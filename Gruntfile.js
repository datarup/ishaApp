module.exports = function ( grunt ) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-war');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-crx');
	/**
	 * Load in our build configuration file.
	 */
	var userConfig = require( './grunt.config.js' );

	/**
	 * This is the configuration object Grunt uses to give each plugin its
	 * instructions.
	 */
	var taskConfig = {
		/**
		 * We read in our `package.json` file so we can access the package name and
		 * version. It's already there, so we don't repeat ourselves here.
		 */
		pkg: grunt.file.readJSON("package.json"),

		/**
		 * The banner is the comment that is placed at the top of our compiled
		 * source files. It is first processed as a Grunt template, where the `<%=`
		 * pairs are evaluated based on this very configuration object.
		 */
		meta: {
			banner: '/**\n' +
			' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' *\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
			' */\n'
		},

		/**
		 * The directories to delete when `grunt clean` is executed.
		 */
		clean: [
			'<%= build_dir %>'
		],

		/**
		 * HTML2JS is a Grunt plugin that takes all of your template files and
		 * places them into JavaScript files as strings that are added to
		 * AngularJS's template cache. This means that the templates too become
		 * part of the initial payload as one JavaScript file. Neat!
		 */
		html2js: {
			/**
			 * These are the templates from `src/app`.
			 */
			app: {
				options: {
					base: 'src/app'
				},
				src: ['<%= app_files.atpl %>'],
				dest: '<%= build_dir %>/templates-app.js'
			},
			/**
			 * These are the templates from `src/common`.
			 */
			common: {
				options: {
					base: 'src/common'
				},
				src: [ '<%= app_files.ctpl %>' ],
				dest: '<%= build_dir %>/templates-common.js'
			}
		},

		/**
		 * `jshint` defines the rules of our linter as well as which files we
		 * should check. This file, all javascript sources, and all our unit tests
		 * are linted based on the policies listed in `options`. But we can also
		 * specify exclusionary patterns by prefixing them with an exclamation
		 * point (!); this is useful when code comes from a third party but is
		 * nonetheless inside `src/`.
		 */
		jshint: {
			src: [
				'<%= app_files.js %>'
			],
			test: [
				'<%= app_files.jsunit %>'
			],
			gruntfile: [
				'Gruntfile.js'
			],
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				eqnull: true,
				es5: true
			},
			globals: {}
		},

		/**
		 * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
		 * Only our `main.less` file is included in compilation; all other files
		 * must be imported from this file.
		 */
		less: {
			build: {
				files: {
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
				}
			}
		},

		/**
		 * The `copy` task just copies files from A to B. We use it here to copy
		 * our project assets (images, fonts, etc.) and javascripts into
		 * `build_dir`
		 */
		copy: {
			build_app_assets: {
				files: [
					{
						src: ['**'],
						dest: '<%= build_dir %>/assets/',
						cwd: 'src/assets',
						expand: true
					}
				]
			},
			build_vendor_assets: {
				files: [
					{
						src: [ '<%= vendor_files.assets %>' ],
						dest: '<%= build_dir %>/assets/',
						cwd: '.',
						expand: true,
						flatten: true
					}
				]
			},
			build_appjs: {
				files: [
					{
						src: ['<%= app_files.js %>'],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_vendorjs: {
				files: [
					{
						src: ['<%= vendor_files.js %>'],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_vendorcss: {
				files: [
					{
						src: ['<%= vendor_files.css %>'],
						dest: '<%= build_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			build_offers_redirect: {
				files: [
					{
						src: ['index.html'],
						dest: '<%= build_dir %>/offers',
						cwd: 'src/app/offers',
						expand: true
					}
				]
			},
			build_hotels_redirect: {
				files: [
					{
						src: ['index.html'],
						dest: '<%= build_dir %>/hotels',
						cwd: 'src/app/hotels',
						expand: true
					}
				]
			},
			build_config: {
				files: [
					{
						src: ['advisor.environment.js'],
						dest: '<%= build_dir %>/',
						cwd: 'src/app/',
						expand: true
					}
				]
			},
			build_chromeApp: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= app_files.chromeApp %>'],
						dest: '<%= build_dir %>/',
						cwd: '.'
					}
				]
			},
			distFiles: {
				files: [
					{
						expand: true,
						src: ['<%= dist_files.chromeApp %>', '<%= dist_files.html %>', '<%= dist_files.css %>',
									'<%= dist_files.images %>', '<%= dist_files.vendor_all %>' ],
						dest: '<%= dist_dir %>/',
						cwd: '.'
					}
				]
			}
		},

		/**
		 * `grunt concat` concatenates multiple source files into a single file.
		 */
		concat: {
			/**
			 * The `build_css` target concatenates compiled CSS and vendor CSS
			 * together.
			 */
			build_css: {
				src: [
					'<%= vendor_files.css %>',
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
				],
				dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
			},
			build_vendor_js: {
				src: ['<%= vendor_files.js %>'],
				dest: '<%= build_dir %>/vendor/vendor_all.js'
			},
			build_app_js: {
				src: ['<%= app_files.js %>'],
				dest: '<%= build_dir %>/src/app_all.js'
			},
			build_all_js: {
				src: [
					'<%= build_dir %>/src/app_all.js',
					'<%= build_dir %>/templates-app.js',
					'<%= build_dir %>/templates-common.js'
				],
				dest: '<%= build_dir %>/app_all.js'
			}
		},

		cssmin: {
			build: {
				src: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
				dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.css'
			}
		},

		/**
		 * Minify the vendor sources!
		 */
		uglify: {
			build: {
				src: '<%= build_dir %>/vendor/vendor_all.js',
				dest: '<%= build_dir %>/vendor/vendor_all.min.js'
			},
			dist_app_all: {
				src: '<%= build_dir %>/app_all.js',
				dest: '<%= dist_dir %>/build/app_all.js' //keeping the file name same here as it's referenced from index.html
				//and we need un-minified version for development
			}
		},

		/**
		 * The `index` task compiles the `index.html` file as a Grunt template. CSS
		 * and JS files co-exist here but they get split apart later.
		 */
		index: {

			/**
			 * During development, we don't want to have wait for compilation,
			 * concatenation, minification, etc. So to avoid these steps, we simply
			 * add all script files directly to the `<head>` of `index.html`. The
			 * `src` property contains the list of included files.
			 */
			build: {
				dir: '<%= build_dir %>',
				src: [
					'<%= build_dir %>/vendor/vendor_all.min.js',
					'<%= concat.build_all_js.dest %>',
					'<%= vendor_files.css %>',
					'<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.min.css'
				]
			}
		},

		/**
		 * Task for setting up server
		 */
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: 'localhost',
				debug: true,
				keepalive: true
			},
			livereload: {
				options: {
					open: {
						target: 'http://localhost:9000/'
					},
					base: [
						'build/'
					]
				}
			}
		},

		/**
		 * And for rapid development, we have a watch set up that checks to see if
		 * any of the files listed below change, and then to execute the listed
		 * tasks when they do. This just saves us from having to type "grunt" into
		 * the command-line every time we want to see what we're working on; we can
		 * instead just leave "grunt watch" running in a background terminal. Set it
		 * and forget it, as Ron Popeil used to tell us.
		 *
		 * But we don't need the same thing to happen for all the files.
		 */
		watch: {
			/**
			 * By default, we want the Live Reload to work for all tasks; this is
			 * overridden in some tasks (like this file) where browser resources are
			 * unaffected. It runs by default on port 35729, which your browser
			 * plugin should auto-detect.
			 */
			options: {
				livereload: true
			},

			/**
			 * When the Gruntfile changes, we just want to lint it. In fact, when
			 * your Gruntfile changes, it will automatically be reloaded!
			 */
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
				options: {
					livereload: false
				}
			},

			/**
			 * When our JavaScript source files change, we want to run lint them and
			 * run our unit tests.
			 */
			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: ['jshint:src', 'copy:build_appjs', 'concat:build_app_js', 'concat:build_all_js']
			},

			/**
			 * When assets are changed, copy them. Note that this will *not* copy new
			 * files, so this is probably not very useful.
			 */
			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: ['copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_offers_redirect', 'copy:build_hotels_redirect', 'copy:build_config']
			},

			/**
			 * When index.html changes, we need to compile it.
			 */
			html: {
				files: ['<%= app_files.html %>'],
				tasks: ['index:build']//, 'offersindex:build', 'hotelsindex:build', 'poioffersindex:build']
			},
			/**
			 * When chromeApp files change copy them to build dir
			 */
			chromeApp: {
				files: ['<%= app_files.chromeApp %>'],
				tasks: ['copy:build_chromeApp']
			},

			/**
			 * When our templates change, we only rewrite the template cache.
			 */
			tpls: {
				files: [
					'<%= app_files.atpl %>',
					'<%= app_files.ctpl %>'
				],
				tasks: ['html2js', 'concat:build_all_js']
			},

			/**
			 * When the CSS files change, we need to compile and minify them.
			 */
			less: {
				files: ['src/**/*.less'],
				tasks: ['less:build', 'cssmin']
			},

			advEnv: {
				files: [ '<%= app_files.env %>' ],
				tasks: [ 'copy:build_config' ]
			},

			/**
			 * When a JavaScript unit test file changes, we only want to lint it and
			 * run the unit tests. We don't want to do any live reloading.
			 */
			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: ['jshint:test'],
				options: {
					livereload: false
				}
			}
		},

		crx: {
			ishaAppCrx: {
				"src": [
					'<%= dist_dir %>/<%= build_dir %>/**/*',
					'!*.pem'
				],
				"dest": "<%= dist_dir %>/crx/",
				"options": {
					"privateKey": "<%= dist_dir %>/ishaApp.pem",
					"maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
				}
			},
			ishaAppZip: {
				"src": [
					'<%= dist_dir %>/<%= build_dir %>/**/*',
					'!*.pem'
				],
				"zipDest": "<%= dist_dir %>/zip/"
			}
		}
	};

	grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

	/**
	 * In order to make it safe to just compile or copy *only* what was changed,
	 * we need to ensure we are starting from a clean, fresh build. So we rename
	 * the `watch` task to `delta` (that's why the configuration var above is
	 * `delta`) and then add a new task called `watch` that does a clean build
	 * before watching for changes.
	 */
		// commented this out as we are now using 'play' task and watch keeps its name
		//grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask( 'play', [ 'build', 'watch' ] );

	//TODO: find source and remove app_all.min.js from getting put in dist
	grunt.registerTask( 'dist', [ 'build', 'copy:distFiles', 'uglify:dist_app_all', 'crx'] );

	/**
	 * The default task is to build.
	 */
	grunt.registerTask( 'default', [ 'build' ] );
	/**
	 * The `grunt deploy` task is for preparing the file for deploy. At this point,
	 * there is no differece between a build and deploy. In the future, when GM/Onstar
	 * has a more stable system, moves from IE, the scripts should be minified.
	 */
	grunt.registerTask( 'deploy', [ 'build' ] );

	// So , these commands are all equivalent: grunt = grunt deploy = grunt build


	/**
	 * The `build` task gets your app ready to run for development and testing.
	 */
		//remove: 'copy:build_appjs', 'copy:build_vendorjs',
		// removed these two as the concat takes care of this, it takes files from app_file.js and place it in build folder
	grunt.registerTask( 'build', [
		'clean', 'html2js', 'jshint', 'less:build',
		'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_offers_redirect', 'copy:build_hotels_redirect',
		'copy:build_config',
		'copy:build_chromeApp',
		'copy:build_vendorcss',
		'concat:build_css', 'concat:build_vendor_js', 'concat:build_app_js', 'cssmin:build', 'uglify:build',
		'concat:build_all_js',
		'index:build'
	]);

	/**
	 * The `serve` task hosts the files locally. To enable livereload for development,
	 * run 'grunt watch' in a separate terminal.
	 */
	grunt.registerTask( 'serve', [ 'connect' ] );
	/**
	 * A utility function to get all app JavaScript sources.
	 */
	function filterForJS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.js$/ );
		});
	}

	/**
	 * A utility function to get all app CSS sources.
	 */
	function filterForCSS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.css$/ );
		});
	}

	/**
	 * The index.html template includes the stylesheet and javascript sources
	 * based on dynamic names calculated in this Gruntfile. This task assembles
	 * the list into variables for the template to use and then runs the
	 * compilation.
	 */
	grunt.registerMultiTask( 'index', 'Process index.html template', function () {
		var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
		var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});
		var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});

		grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
			process: function ( contents, path ) {
				return grunt.template.process( contents, {
					data: {
						scripts: jsFiles,
						styles: cssFiles,
						version: grunt.config( 'pkg.version' )
					}
				});
			}
		});
	});
};
