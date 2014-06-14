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

    connect: {
      // sub-task: connect:server
      server: {
        options: {
          host: 'localhost',
          port: 3000,
          base: '.',
          keepalive: true
/*
          middleware: function(connect, options) {
            return [
              connect.static(options.base),
              connect.directory(options.base),
              connect.logger('dev')
            ];
          }
*/
        }
      }
    },


    /** JavaScript tasks **/

    concat: {
      // global concat options
      options: {
        separator: ';',
        stripBanners: true
      },
      // sub-task: concat:dist
      dist: {
        src: ['src/scripts/**/*.js'],
        dest: 'dist/scripts/<%= pkg.name %>.js'
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
        dest: 'dist/scripts/<%= pkg.name %>.min.js'
      }
    },


    /** Less Tasks **/

    less: {
      options: {
        relativeUrls: true
      },
      // sub-task: less:compile
      compile: {
        files: {
          'dist/styles/myproject.css': 'src/styles/myproject.less'
        }
      },
      // sub-task: less:compress
      compress: {
        options: {
          yuicompress: true
        },
        files: {
          'dist/styles/myproject.min.css': 'src/styles/myproject.less'
        }
      }
    },


    /** Spritesheet Generation **/

    sprite: {
      // sub-task: sprite:set
      set: {
        src: ['src/img/set/**/*.gif'],
        destImg: 'src/img/set.png',
        destCSS: 'src/less/sprites/sprite-set.less'
      }
    },


    /** Raw Assets **/

    copy: {
      // sub-task: copy:img
      img: {
        files: [
          // copy all .png's from src/img to dist/img
          {expand: true, cwd: 'src/img', src: ['**/*.png'], dest: 'dist/img'},
          // copy all files from bower_components/bootstrap/fonts to dist/fonts
          {expand: true, cwd: 'bower_components/bootstrap/fonts', src: ['**/*'], dest: 'dist/fonts'}
        ]
      }
    },


    /** File Watcher **/

    watch: {
      // sub-task: watch:less
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less']
      }
    }


/*** isn't there a good grunt-jshint plugin out in 2014? ***/
//     // task: jshint
//     jshint: {
//       // gobal jshint options
//       options: {
//         force: true,
//         reporter: 'checkstyle'
//       },
//       // sub-task: jshint:myproject
//       myproject: {
//         src: ['Gruntfile.js', 'src/js/**/*.js'],
//         dest: 'logs/jshint/checkstyle.xml'
//       },
//       // sub-task: jshint:tasks
//       tasks: {
//         src: ['tasks/**/*.js'],
//         dest: 'logs/jshint/tasks-checkstyle.xml'
//       }
//     },



/*** isn't there a good grunt+phantomjs plugin out in 2014? ***/
//     // task: phantom
//     phantom: {
//       // sub-task: phantom:qunit
//       qunit: {
//         // Sophisticated Grunt feature: dynamically build the src-dest mapping
//         // For each '*.html' file in 'src/js/tests', write a 'logs/qunit/*.xml'
//         // http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
//         files: [
//           {
//             expand: true,        // Enable dynamic expansion.
//             cwd: 'src/js/tests', // Src matches are relative to this path.
//             src: ['**/*.html'],  // Actual pattern(s) to match.
//             dest: 'logs/qunit',  // Destination path prefix.
//             ext: '.xml',         // Dest filepaths will have this extension.
//           },
//         ],
//         options: {
//           baseUrl: 'http://localhost:3000/'
//         }
//       }
//     },


  });

  // Load task definitions and grunt plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-spritesmith');

  // Alias Tasks: lint, test, dist
  grunt.registerTask('dist', ['concat', 'uglify', 'less', 'copy']);
  grunt.registerTask('lint', []);
  grunt.registerTask('test', ['connect']);

  grunt.registerTask('default', ['lint', 'test', 'dist']);

};
