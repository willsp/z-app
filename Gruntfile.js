/* jshint camelcase: false */
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',
        // Task configuration
        less: {
            development: {
                src: 'less/{,*/}*.less',
                dest: 'app/styles/main.css'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,
                browser: true,
                globals: { jQuery: true },
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['lib/{,*/}*.js', 'test/{,*/}*.js']
            }
        },
        karma: {
            single: {
                options: {
                    browsers: ['PhantomJS'],
                    files: '<%= jshint.lib_test.src %>',
                    frameworks: ['jasmine'],
                    singleRun: true
                }
            },
            unit: {
                options: {
                    browsers: ['Chrome'],
                    files: '<%= jshint.lib_test.src %>',
                    frameworks: ['jasmine'],
                    reporters: 'dots'
                }
            }
        },
        clean: ['app/scripts/lib'],
        copy: {
            jslib: {
                src: '<%= jshint.lib_test.src[0] %>',
                dest: 'app/scripts/'
            }
        },
        connect: {
            options: {
                port: 9000
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'app/')
                        ];
                    }
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'js_lib']
            },
            less: {
                files: '<%= less.development.src %>',
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        open: {
            build: {
                path: 'http://localhost:9000'
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task
    grunt.registerTask('default', ['less', 'jshint', 'js_lib']);
    grunt.registerTask('js_lib', ['karma:single', 'clean', 'copy:jslib']);
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('serve', ['default', 'connect', 'open', 'watch']);
};

