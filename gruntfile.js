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

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            main: {
                src: 'src/jquery-socialshare.js'
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc-grunt'
                },
                src: 'gruntfile.js'
            }
        },
        jscs: {
            options: {
                config: 'src/.jscsrc'
            },
            main: {
                src: 'src/jquery-socialshare.js'
            },
            gruntfile: {
                src: 'gruntfile.js'
            }
        },
        concat: {
            options: {
                stripBanners: true
            },
            main: {
                src: 'src/jquery-socialshare.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            main: {
                src: '<%= concat.main.dest %>',
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
            gruntfile: {
                files: 'gruntfile.js',
                tasks: ['jshint:gruntfile'/*, 'jscs:gruntfile'*/]
            },
            main: {
                files: ['src/*.js'],
                tasks: ['jshint:main'/*, 'jscs:main'*/]
            }
        }
    });

    // load dependencies tasks
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });


    // distribution task.
    grunt.registerTask('dist', ['clean:dist', 'concat:main', 'uglify:main', 'usebanner:dist', 'compress:dist']);

    // Version numbering task.
    // grunt bump-version --newver=X.Y.Z
    grunt.registerTask('bump-version', 'string-replace');

};