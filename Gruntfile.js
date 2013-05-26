/*
 * Gruntfile.js: task defininitions for grunt
 * http://gruntjs.com/
 *
 * TODO: adapt to the needs of your very own project!
 */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // task: concat
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    // task: uglify
    uglify: {
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
      options: { // gobal jshint options
        force: true,
        reporter: 'checkstyle'
      },
      test: { // sub-task: jshint:test
        src: ['Gruntfile.js', 'test/core/**/*.js'],
        options: {output: 'logs/jshint/test_checkstyle.xml'}
      },
      source: { // sub-task: jshint:source
        src: ['src/js/**/*.js'],
        options: {output: 'logs/jshint/src_checkstyle.xml'}
      }
    },
    // task: connect
    connect: {
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
    phantom: {
// TODO: phantom task
    },
    // task: less
    less: {
      dist: { // sub-task: less:dist
        files: {
          'dist/css/myproject.css': 'src/less/myproject.less',
          'dist/css/myproject-responsive.css': 'src/less/myproject-responsive.less'
        }
      },
      min: { // sub-task: less:min
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
      checkstyle: { // sub-task: recess:checkstyle
        src: ['src/less/myproject.less'],
        dest: 'logs/recess/checkstyle.xml',
        options: {
          reporter: 'checkstyle',
          output: 'logs/recess'
        }
      },
      log: {  // sub-task: recess:log
        src: ['src/less/myproject.less', 'src/less/myproject-responsive.less'],
        dest: 'logs/recess/recess.log'
      }
    }
  });

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
