module.exports = function( grunt ) {
	"use strict";

	// Force use of Unix newlines
	grunt.util.linefeed = "\n";

	grunt.initConfig( {
		pkg: grunt.file.readJSON( "package.json" ),
		banner: [
			"/*!",
			" * Minimalist social sharing jQuery plugin v<%= pkg.version %> (<%= pkg.homepage %>)",
			" *",
			" * MIT License (View LICENSE file with this package)",
			" * ",
			" * Copyright (c) 2017 Pedro Maia Costa <geral@pmcdigital.pt>",
			" */"
		].join( "\n" ) + "\n",

		clean: [ "dist/*" ],

		eslint: {
			options: {

				// See https://github.com/sindresorhus/grunt-eslint/issues/119
				quiet: true
			},
			dev: {
				src: [ "src/**/*.js", "Gruntfile.js" ]
			},
			dist: {
				src: "dist/js/<%= pkg.name %>.js"
			}
		},
		concat: {
			options: {
				stripBanners: true
			},
			src: {
				src: "src/<%= pkg.name %>.js",
				dest: "dist/js/<%= pkg.name %>.js"
			}
		},
		uglify: {
			options: {
				preserveComments: "some"
			},
			src: {
				src: "<%= concat.src.dest %>",
				dest: "dist/js/<%= pkg.name %>.min.js"
			}
		},
		usebanner: {
			options: {
				banner: "<%= banner %>"
			},
			dist: "dist/js/*.js"
		},
		compress: {
			dist: {
				options: {
					archive: "dist/<%= pkg.name %>-<%= pkg.version %>-dist.zip",
					mode: "zip",
					level: 9,
					pretty: true
				},
				files: [
					{
						src: [ "README.md", "LICENSE", "package.json", "./docs/**" ]
					},
					{
						expand: true,
						cwd: "dist/",
						src: "**"
					}
				]
			}
		},
		"string-replace": {
			npm: {
				files: [ {
					src: "package.json",
					dest: "package.json"
				} ],
				options: {
					replacements: [ {
						pattern: /\"version\":\s\"[0-9\.a-z].*",/gi,
						replacement: "\"version\": \"" + grunt.option( "newver" ) + "\","
					} ]
				}
			}
		},
		watch: {
			files: [ "<%= eslint.dev.src %>" ],
			tasks: [ "eslint:dev" ]
		}
	} );

	// load dependencies tasks
	require( "load-grunt-tasks" )( grunt, { scope: "devDependencies" } );


	// distribution task.
	grunt.registerTask( "dist",
		[
			"clean",
			"concat:src",
			"eslint:dist",
			"uglify:src",
			"usebanner:dist",
			"compress:dist"
		]
	);

	// Version numbering task.
	// grunt bump-version --newver=X.Y.Z
	grunt.registerTask( "bump-version", "string-replace" );

};
