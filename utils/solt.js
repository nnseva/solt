#! /usr/bin/env node
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');
const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { Console } = require('node:console');

const ejs = require('ejs');

console = new Console(process.stdout, process.stderr);

const preprocessor = function(args) {
    var template_search_path = [];
    var extract_search_path_from_packages_info = function(package_info) {
        var search_path = [];
        if(package_info.path) {
            var dirname = path.join(package_info.path, args.template_folder);
            if(fs.existsSync(dirname)) {
                if(fs.statSync(dirname).isDirectory()) {
                    search_path.push(dirname);
                }
            }
        }
        if(package_info.dependencies) {
            for(var k in package_info.dependencies) {
                search_path = search_path.concat(extract_search_path_from_packages_info(package_info.dependencies[k]));
            }
        }
        return search_path;
    }

    template_search_path = template_search_path.concat(args.folders);
    if(!args.template_folder_ignore) {
        console.debug('Collecting templates search path in local modules');
        var package_info = JSON.parse(execSync('npm list -l --all --json', {'maxBuffer': 2**32}).toString());
        var search_path = extract_search_path_from_packages_info(package_info);
        console.debug('Found templates search path in local modules', search_path);
        template_search_path = template_search_path.concat(search_path);
        console.debug('Collecting templates search path in global modules');
        var package_info = JSON.parse(execSync('npm list -l --all -g --json', {'maxBuffer': 2**32}).toString());
        var search_path = extract_search_path_from_packages_info(package_info);
        console.debug('Found templates search path in global modules', search_path);
        template_search_path = template_search_path.concat(search_path);
    }
    console.debug('Found templates search path', template_search_path);
    defines = {};
    if(args.defines.length) {
        console.debug('Collecting definitions from the command line');
        for(var i=0; i < args.defines.length; i++) {
            var m = args.defines[i].match(/([_a-zA-Z0-9]*)(=(.*))?/);
            if(m[0]) {
                defines[m[1]] = m[3] || 1;
            } else {
                console.warn('Incorrect definition name, ignored:', args.defines[i]);
            }
        }
        console.debug('Collected definitions from the command line:', defines);
    }

    var output = process.stdout;
    if(args.output) {
        console.debug('Output is', args.output);
        output = fs.createWriteStream(args.output);
    } else {
        console.debug('Output is stdout');
    }

    var context = {};
    options = {
        views:template_search_path,
        context: context,
        escape: (v) => {
            v = v.toString().replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
            for(var i=1; i < 32; i++) {
                v = v.replace(String.fromCharCode(i), `\\x${i.toString(16).padStart(2, 0)}`)
            }
            return v;
        }
    }
    
    for(var i in args.files) {
        var fullname = args.files[i];
        if(!fullname) {
            console.warn('File not found, ignored:', name);
        } else {
            var result = ejs.render(fs.readFileSync(fullname).toString(), defines, {
                ...options,
                filename: fullname,
            });
            output.write(result);
        }
    }
    if(args.output) {
        console.debug('Close output', args.output);
        output.close();
    }
};

(function() {
    const parser = new ArgumentParser({
        description: 'SOLT preprocessor'
    });

    parser.add_argument('-V', '--version', { action: 'version', version });
    parser.add_argument('-v', '--verbose', {
        action: 'count', dest: 'verbosity', default: 1,
        help: 'Increase verbosity level from %(default)s: ERROR, WARNING, INFO, DEBUG'
    });
    parser.add_argument('-Q', '--quiet', {
        action: 'store_const', dest: 'verbosity', const: 0,
        help: 'Suppress any console output'
    });
    const subparsers = parser.add_subparsers({ title: 'Commands', dest: 'command', help: 'Commands to run'});
    const pp = subparsers.add_parser('pp', { help: 'Preprocess SOLT files, run `solt pp` go get details'});
    pp.add_argument('files', {
        nargs: '*', type: 'str', metavar: 'FILE',
        help: 'Files to be processed. All files are joined together in the output. You can use `--` to separate files from options'
    });
    pp.add_argument('--template-folder', {
        action: 'store', dest: 'template_folder', metavar: 'FOLDER', default: 'templates',
        help: 'The template search path is collected searching this folder name in the installed packages. The default is `%(default)s`'
    });
    pp.add_argument('--template-folder-', {
        action: 'store_true', dest: 'template_folder_ignore',
        help: 'Turn off the --template-folder option, no any folder will be searched in the installed packages'
    });
    pp.add_argument('-I', {
        type: 'str', action: 'append', dest: 'folders', metavar: 'FOLDER', default: [],
        help: 'Extend the template search path. Repeat the option to extend the list'
    });
    pp.add_argument('-D', {
        type: 'str', action: 'append', dest: 'defines', metavar: 'VARIABLE', default: [],
        help: 'Define variables in form of `VARIABLE=VALUE` or `VARIABLE`. Repeat the option to extend the list'
    });
    pp.add_argument('-o', {
        type: 'str', action: 'store', dest: 'output', metavar: 'OUTPUT', default: '',
        help: 'Output file. Leave it blank or absent to stream everything to the STDOUT'
    });
    pp.add_argument('--stderr', {
        action: 'store_true', dest: 'stderr',
        help: 'Redirect all console messages to stderr'
    });

    var args = parser.parse_args();

    if(args.stderr) {
        console = new Console(process.stderr, process.stderr);
    }

    if(args.verbosity < 1) {
        console.log = function() {};
    }
    if(args.verbosity < 2) {
        console.warn = function() {};
    }
    if(args.verbosity < 3) {
        console.info = function() {};
    }
    if(args.verbosity < 4) {
        console.debug = function() {};
    }

    if(!args.command)
        parser.print_help()
    if(args.command == 'pp') {
        if(args.files.length == 0) {
            pp.print_help()
        } else {
            preprocessor(args);
        }
    }
})();
