/*
 * Gruntfile.js: task defininitions for grunt
 * http://gruntjs.com/
 *
 * TODO: adapt to the needs of your very own project!
 */
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // task: concat
    concat: {
      // global concat options
      options: {
        separator: ';',
        stripBanners: true
      },
      // sub-task: concat:dist
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    // task: uglify
    uglify: {
      // global uglify options
      options: {
        preserveComments: 'some'
      },
      // sub-task: uglify:dist
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    // task: jshint
    jshint: {
      // gobal jshint options
      options: {
        force: true,
        reporter: 'checkstyle'
      },
      // sub-task: jshint:myproject
      myproject: {
        src: ['Gruntfile.js', 'src/js/**/*.js'],
        dest: 'logs/jshint/checkstyle.xml'
      },
      // sub-task: jshint:util
      util: {
        src: ['tasks/**/*.js'],
        dest: 'logs/jshint/tasks-checkstyle.xml'
      }
    },

    // task: connect
    connect: {
      // sub-task: connect:server
      server: {
        options: {
          host: 'localhost',
          port: 3000,
          middleware: function(connect, options) {
            return [
              connect.static(options.base),
              connect.directory(options.base),
              connect.logger('dev')
            ];
          }
        }
      }
    },

    // task: phantom
    phantom: {
      // sub-task: phantom:qunit
      qunit: {
  // TODO: how to write reports to disk?
        src: ['src/js/tests/runner.html'],
        dest: 'logs/qunit',
        options: {
          baseUrl: 'http://localhost:3000/',
          url: 'http://localhost:3000/src/js/tests/runner.html',
          report: 'junit'
        }
      }
    },

    // task: less
    less: {
      // sub-task: less:dist
      dist: {
        files: {
          'dist/css/myproject.css': 'src/less/myproject.less',
          'dist/css/myproject-responsive.css': 'src/less/myproject-responsive.less'
        }
      },
      // sub-task: less:min
      min: {
        options: {
          yuicompress: true
        },
        files: {
          'dist/css/myproject.min.css': 'src/less/myproject.less',
          'dist/css/myproject-responsive.min.css': 'src/less/myproject-responsive.less'
        }
      }
    },

    // task: recess
    recess: {
      options: {
        config: 'recess.json',
      },
      // sub-task: recess:checkstyle
      checkstyle: {
        src: ['src/less/myproject.less'],
        dest: 'logs/recess/checkstyle.xml',
        options: {
          reporter: 'checkstyle',
          output: 'logs/recess'
        }
      },
      // sub-task: recess:log
      log: {
        src: ['src/less/myproject.less', 'src/less/myproject-responsive.less'],
        dest: 'logs/recess/recess.log'
      }
    }

  });

  // load task definitions and grunt plugins
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');


  // Alias Tasks: test, dist
  grunt.registerTask('test', ['connect', 'phantom']);
  grunt.registerTask('dist', ['concat', 'uglify']);

  grunt.registerTask('default', ['dist', 'jshint', 'test']);

};
