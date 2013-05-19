/*
 * grunt recess task to lint .less files; DOES NOT support compiling
 * http://spektrakel.de
 *
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {

  var path = require('path')

  grunt.registerMultiTask('recess', 'Lint .less or .css files with RECESS.', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: false,
      config: undefined,
      output: undefined,
      reporter: undefined,
      reportFile: undefined
    });

    // get files and directories
    var srcFiles = this.files[0].src;
    var destFile = this.files[0].dest;
    var output = options.output;

    // read config.json file
    var config = undefined;
    if (options.config) {
      config = grunt.file.readJSON(options.config);
    }
    config.compile = false;
    config.compress = false;

    // read mapping.json file for checkstyle reporter
    var mapping = undefined;
    if (options.mapping) {
      mapping = grunt.file.readJSON(options.mapping);
    }

    // Prepare reporter object
    options.reporter ? report() : log();

    // Use the recess-reporting.js add-on
    function report() {
      // Require and instantiate the reporter class
      var reporterClass;
      var reporter = undefined;
      switch (true) {
        // Checkstyle xml
        case options.reporter === 'checkstyle':
          reporterClass = require('./lib/recess/reporters/checkstyle.js');
          reporter = new reporterClass(mapping);
          break;
        // Custom reporter
        case options.reporter !== undefined:
          reporterClass = require(path.resolve(process.cwd(), options.reporter));
          reporter = new reporterClass(mapping);
          break;
        default:
          break;
      }

      // Sophisticated reporting using a custom reporter
      var reporting = require('./lib/recess/recess-reporting.js')
      var result = reporting.run(srcFiles, config, reporter, output, function () {
        // Write report to the report file, if wanted
        if (destFile) {
          destFile = grunt.template.process(destFile);
          var destDir = path.dirname(destFile);
          if (!grunt.file.exists(destDir)) {
            grunt.file.mkdir(destDir);
          }
          grunt.file.write(destFile, reporter.report);
          grunt.log.ok('Report "' + destFile + '" created.');
        }

        done(options.force ? options.force : result);
      });
    }

    // Use plain RECESS
    function log() {
      // Hook into stdout to capture report
      var data = '';
      if (destFile) {
        grunt.util.hooker.hook(process.stdout, 'write', {
          pre: function (out) {
            data += out;
            return grunt.util.hooker.preempt();
          }
        });
      }

      // Plain reporting by using RECESS's programmatic API
      var recess = require('recess');
      config.stripColors = true;
      config.cli = true;
      var result = recess(srcFiles, config, function(err, instances) {
        // Write recesss output to destFile if wanted
        if (destFile) {
          grunt.util.hooker.unhook(process.stdout, 'write');
          destFile = grunt.template.process(destFile);
          var destDir = path.dirname(destFile);
          if (!grunt.file.exists(destDir)) {
            grunt.file.mkdir(destDir);
          }
          grunt.file.write(destFile, data);
          grunt.log.ok('Report "' + destFile + '" created.');
        }

        done(options.force ? options.force : result);
      });
    }

  });

};
