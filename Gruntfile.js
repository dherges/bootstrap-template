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
      // sub-task dist
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
      source: { // sub-task: jshint:src
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

    },
    recess: {
      options: {
        config: 'recess.json',
      },
      checkstyle: {
        src: ['src/less/myproject.less'],
        dest: 'logs/recess/checkstyle.xml',
        options: {
          reporter: 'checkstyle',
          output: 'logs/recess'
        }
      },
      log: {
        src: ['src/less/myproject.less', 'src/less/myproject-responsive.less'],
        dest: 'logs/recess/recess.log'
      }
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');


  // Alias Tasks: test, dist
  grunt.registerTask('test', ['connect', 'qunit-phantom']);
  grunt.registerTask('dist', ['concat', 'uglify']);

  grunt.registerTask('default', ['dist', 'jshint', 'test']);

};
