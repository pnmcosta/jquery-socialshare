module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*'],
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
        }
    });

    // load dependencies tasks
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Version numbering task.
    // grunt bump-version --newver=X.Y.Z
    grunt.registerTask('bump-version', 'string-replace');

};