module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: [
            '/*!',
            ' * Datepicker for Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)',
            ' *',
            ' * Licensed under the MIT License (https://opensource.org/licenses/MIT)',
            ' */'
        ].join('\n') + '\n',

        clean: ['dist/*'],

        eslint: {
            options: {

                // See https://github.com/sindresorhus/grunt-eslint/issues/119
                quiet: true
            },
            dev: {
                src: ["src/**/*.js", "Gruntfile.js"]
            },
            dist: {
                src: "dist/<%= pkg.name %>.js"
            }
        },
        concat: {
            options: {
                stripBanners: true
            },
            dev: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            dev: {
                src: '<%= concat.dev.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        usebanner: {
            options: {
                banner: '<%= banner %>'
            },
            dist: 'dist/*.js'
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>-dist.zip',
                    mode: 'zip',
                    level: 9,
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: '**'
                    }
                ]
            }
        },
        'string-replace': {
            bower: {
                files: [{
                    src: 'bower.json',
                    dest: 'bower.json'
                }],
                options: {
                    replacements: [{
                        pattern: /\"version\":\s\"[0-9\.a-z].*",/gi,
                        replacement: '"version": "' + grunt.option('newver') + '",'
                    },
                    {
                        pattern: /\"name\":\s\".*",/gi,
                        replacement: '"name": "<%= pkg.name %>",'
                    },
                    {
                        pattern: /\"description\":\s\".*",/gi,
                        replacement: '"description": "<%= pkg.description %>",'
                    }]
                }
            },
            npm: {
                files: [{
                    src: 'package.json',
                    dest: 'package.json'
                }],
                options: {
                    replacements: [{
                        pattern: /\"version\":\s\"[0-9\.a-z].*",/gi,
                        replacement: '"version": "' + grunt.option('newver') + '",'
                    }]
                }
            }
        },
        watch: {
            files: [ "<%= eslint.dev.src %>" ],
			tasks: [ "eslint:dev" ]
        }
    });

    // load dependencies tasks
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });


    // distribution task.
    grunt.registerTask('dist', ['clean:dist', 'eslint:dist', 'concat:dev', 'uglify:dev', 'usebanner:dist', 'compress:dist']);

    // Version numbering task.
    // grunt bump-version --newver=X.Y.Z
    grunt.registerTask('bump-version', 'string-replace');

};