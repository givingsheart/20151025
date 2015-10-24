module.exports = function(grunt) {
	grunt.initConfig({
		env: {
			dev: {
				NODE_ENV: 'development'
			},
			test: {
				NODE_ENV: 'test'
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					ext: 'js,html',
					watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
				}
			},
			debug: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: ['server.js', 'config/**/*.js', 'app/**/*/js']
				}
			}
		},
		mochaTest: {
			src: 'app/tests/**/*.js',
			options: {
				reporter: 'spec'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		protractor: {
			e2e: {
				options: {
					configFile: 'protractor.conf.js'
				}
			}
		},
		jshint: {
			all: {
				src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js',
						'public/modules/**/*.js']
			}
		},
		csslint: {
			all: {
				src: 'public/modules/**/*.css'
			}
		},
		watch: {
			js: {
				files: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js',
						'public/modules/**/*.js'],
				tasks: ['jshint']
			},
			css: {
				files: 'public/modules/**/*.css',
				tasks: ['csslint']
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			},
			debug: {
				tasks: ['nodemon:debug', 'watch', 'node-inspector'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		'node-inspector': {
			debug: {}
		}
	});

	//env 모듈 올리기 메서드
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-node-inspector');
	//작업이름, 부모작업을 사용핳ㄹ때 실행될 다른 grunt작업 컬렉션으로
	//손쉽게 여러 운영을 자동화하기 위해 다양한 작업을 그룹으로 묶는 일반적인 패턴이다.
	grunt.registerTask('default', ['env:dev', 'lint', 'concurrent:dev']);
	grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent:debug']);
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma', 'protractor']);
	grunt.registerTask('lint', ['jshint', 'csslint']);
};