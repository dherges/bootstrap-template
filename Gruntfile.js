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
      // sub-task: jshint:tasks
      tasks: {
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
        // Sophisticated Grunt feature: dynamically build the src-dest mapping
        // For each '*.html' file in 'src/js/tests', write a 'logs/qunit/*.xml'
        // http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
        files: [
          {
            expand: true,        // Enable dynamic expansion.
            cwd: 'src/js/tests', // Src matches are relative to this path.
            src: ['**/*.html'],  // Actual pattern(s) to match.
            dest: 'logs/qunit',  // Destination path prefix.
            ext: '.xml',         // Dest filepaths will have this extension.
          },
        ],
        options: {
          baseUrl: 'http://localhost:3000/'
        }
      }
    },

    // task: less
    less: {
      // sub-task: less:compile
      compile: {
        files: {
          'dist/css/myproject.css': 'src/less/myproject.less',
          'dist/css/myproject-responsive.css': 'src/less/myproject-responsive.less'
        }
      },
      // sub-task: less:compress
      compress: {
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
        src: ['src/less/myproject.less', 'src/less/myproject-responsive.less'],
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

    // TODO: add a grunt task for dist'ing image assets...

    // TODO: grunt task to resolve node & bower dependencies?
  });

  // Load task definitions and grunt plugins
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Alias Tasks: dist, lint, test
  grunt.registerTask('dist', ['concat', 'uglify', 'less']);
  grunt.registerTask('lint', ['jshint', 'recess']);
  grunt.registerTask('test', ['connect', 'phantom']);

  grunt.registerTask('default', ['dist', 'lint', 'test']);

};
