module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var mozjpeg = require('imagemin-mozjpeg');

	grunt.initConfig({
		config: {
			src: 'src/public',
			dist: 'dist/public',
			tmp: '.tmp'
		},

		clean: {
			dist: {
				src: [
					'.tmp',
					'dist/*',
					'!dist/.git*'
				]
			}
		},

		useminPrepare: {
			html: '<%= config.src %>/index.html',
			options: {
				dest: '<%= config.tmp %>',
				flow: {
					steps: {
						js: [
							'concat',
							'uglify'
						],
						css: [
							'concat',
							'cssmin'
						]
					},
					post: {}
				}
			}
		},

		copy: {
			pages: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>',
					src: [
						'index.html',
						'pages/{,*/}*.html'
					],
					dest: '<%= config.dist %>'
				}]
			},
			js_server: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['*.js'],
					dest: 'dist'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: '.tmp/js',
					src: ['*.js'],
					dest: '<%= config.dist %>/js'
				}]
			},
			css: {
				files: [{
					expand: true,
					cwd: '.tmp/css',
					src: ['*.css'],
					dest: '<%= config.dist %>/css'
				}]
			},
		},

		imagemin: {
			static: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{
						removeViewBox: false
					}],
					use: [mozjpeg()]
				},
				files: {}
			},
			dynamic: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>',
					src: ['images/*.{png,jpg,gif}'],
					dest: '<%= config.dist %>'
				}]
			}
		},

		filerev: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: [
						'js/{,*/}*.js',
						'css/{,*/}*.css'
					],
					dest: '<%= config.dist %>'
				}],
			}
		},

		usemin: {
			html: ['<%= config.dist %>/index.html'],
			options: {
				assetsDirs: [
					'<%= config.dist %>'
				]
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: [
						'index.html',
						'pages/{,*/}*.html'
					],
					dest: '<%= config.dist %>'
				}]
			}
		}
	});

	grunt.registerTask('build', [
		'clean',

		'useminPrepare',
		'concat:generated',
		'cssmin:generated',
		'uglify:generated',

		'copy:pages',
		'copy:js_server',
		'copy:js',
		'copy:css',

		'filerev',

		'imagemin',

		'usemin',

		'htmlmin'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};