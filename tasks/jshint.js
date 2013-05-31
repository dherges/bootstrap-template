/*
 * grunt jshint task that actually works; requires jshint 2.x
 * http://spektrakel.de
 *
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  var path = require('path');
  var jshint = require('jshint/src/cli/cli');

  grunt.registerMultiTask('jshint', 'Validate files with JSHint.', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: false,
      output: null,
      jshintrc: null,
      ignores: null,
      extensions: '',
      reporter: null
    });

    // Get source and destination files
    var srcFiles = this.files[0].src;
    var destFile = this.files[0].dest;

    // Prepare reporter object
    var reporter = options.reporter;
    switch (true) {
      // Checkstyle xml
      case reporter === 'checkstyle':
        reporter = require('jshint/src/reporters/checkstyle.js').reporter;
        break;
      // jslint xml reporter
      case reporter === 'jslint':
        reporter = require('jshint/src/reporters/jslint_xml.js').reporter;
        break;
      // JSHint non_error
      case reporter === 'non_error':
        reporter = require('jshint/rc/reporters/non_error.js').reporter;
        break;
      // JSHint default reporter
      case reporter === 'default':
        reporter = require('jshint/src/reporters/default.js').reporter;
        break;
      // Custom reporter
      case reporter !== undefined:
        reporter = path.resolve(process.cwd(), options.reporter);
        break;
    }


    // Read JSHint options from a specified jshintrc file.
    var config = undefined;
    if (options.jshintrc) {
      config = grunt.file.readJSON(options.jshintrc);
    }

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

    // Run JSHint through the cli
    var result = jshint.run({
      args: this.filesSrc,
      config: config,
      reporter: reporter,
      ignores: options.ignores,
      extensions: options.extensions
    });

    // Write the output of the reporter if wanted
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

};
