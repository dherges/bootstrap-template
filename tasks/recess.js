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

    // Get output directory and report file
    var output = options.output;
    var reportFile = options.reportFile;

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
    if (options.reporter) {
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
      require('./lib/recess/recess-reporting.js').run(this.filesSrc, config, reporter, output, function () {
        // Write report to the report file, if wanted
        if (reportFile) {
          reportFile = grunt.template.process(reportFile);
          var destDir = path.dirname(reportFile);
          if (!grunt.file.exists(destDir)) {
            grunt.file.mkdir(destDir);
          }
          grunt.file.write(reportFile, reporter.report);
          grunt.log.ok('Report "' + reportFile + '" created.');
        }

        done(options.force ? options.force : result);
      });

      return;
    }

    // Plain reporting by using RECESS's programmatic API
    var recess = require('recess');
    config.stripColors = true;
    config.cli = true;

    // Hook into stdout to capture report
    var data = '';
    if (reportFile) {
      grunt.util.hooker.hook(process.stdout, 'write', {
        pre: function (out) {
          data += out;
          return grunt.util.hooker.preempt();
        }
      });
    }

    var result = recess(this.filesSrc, config, function(err, instances) {

      // Write the output of the reporter if wanted
      if (reportFile) {
        grunt.util.hooker.unhook(process.stdout, 'write');
        reportFile = grunt.template.process(reportFile);
        var destDir = path.dirname(reportFile);
        if (!grunt.file.exists(destDir)) {
          grunt.file.mkdir(destDir);
        }
        grunt.file.write(reportFile, data);
        grunt.log.ok('Report "' + reportFile + '" created.');
      }

      done(options.force ? options.force : result);
    });


  });

};
