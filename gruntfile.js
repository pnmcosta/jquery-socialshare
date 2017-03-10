module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*'],
        'string-replace': {
            manifest: {
                files: [{
                    src: 'src/manifest.json',
                    dest: 'src/manifest.json'
                }],
                options: {
                    replacements: [{
                        pattern: /\"version\":\s\"[0-9\.a-z].*",/gi,
                        replacement: '"version": "' + grunt.option('newver') + '",'
                    },
                    {
                        pattern: /\"name\":\s\".*",/gi,
                        replacement: '"name": "<%= pkg.title %>",'
                    },
                    {
                        pattern: /\"description\":\s\".*",/gi,
                        replacement: '"description": "<%= pkg.description %>",'
                    },
                    {
                        pattern: /\"homepage_url\":\s\".*",/gi,
                        replacement: '"homepage_url": "<%= pkg.homepage %>",'
                    },
                    {
                        pattern: /\"default_title\":\s\".*"/gi,
                        replacement: '"default_title": "<%= pkg.title %>!"'
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
        crx: {
            options: {
                privateKey: "../../ssh/chrome-apps.pem",
                maxBuffer: 3000 * 1024, //build extension with a weight up to 3MB
                baseURL: "<%= pkg.homepage %>"
            },
            dist: {
                files: {
                    "dist/<%= pkg.name %>-<%= pkg.version %>.crx": [
                        "src/**/*",
                        "!.{git,svn}",
                        "!*.pem",
                    "!*.psd"
                    ],
                    "dist/<%= pkg.name %>-<%= pkg.version %>.zip": [
                        "src/**/*",
                        "!.{git,svn}",
                        "!*.pem",
                    "!*.psd"
                    ]
                }
            }
        }
    });

    // load dependencies tasks
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Version numbering task.
    // grunt bump-version --newver=X.Y.Z
    grunt.registerTask('bump-version', 'string-replace');

     // Full distribution task.
    grunt.registerTask('dist', ['clean', 'crx:dist']);
};