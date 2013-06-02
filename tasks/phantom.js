/*
 * grunt phantomjs task; inspired by grunt-contrib-qunit
 * http://spektrakel.de
 *
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  var path = require('path')
    , url = require('url')
    , phantomjs = require('grunt-lib-phantomjs').init(grunt)
    , taskResult = true
    , destFile = null

  // QUnit events that are emitted by the phantomjs bridge (see lib/phantom/bridge.js)
  phantomjs.on('qunit.log', function (result, actual, expected, message, source) {
    if (!result) {
      grunt.log.error('Failed assertion: ', message + '\n' + source);
    }
  });

  phantomjs.on('qunit.testDone', function (name, failed, passed, total) {
    // Log errors if necessary, otherwise success.
    if (failed > 0) {
      grunt.log.error('Test `' + name + '` failed;', failed, 'of', total,
        'assertions failed, passed:',  passed);
    }
  });

  phantomjs.on('qunit.moduleDone', function (name, failed, passed, total) {
    if (failed > 0) {
      // module had failed tests
      grunt.log.error('Module `' + name  + '` has errors;', failed, 'of', total,
        'tests failed, passed:', passed);
    }
  });

  phantomjs.on('qunit.done', function (failed, passed, total, duration) {
    phantomjs.halt();
    taskResult = (taskResult && (failed === 0) && (passed === total));
    if (failed > 0) {
      grunt.log.error('Test suite finished with errors; failed', failed, 'of', total,
        'assertions; passed:', passed);
    } else {
      grunt.log.ok('Test suite completed successfully; passed', passed, 'of', total,
        'assertions in', duration, 'msec');
    }
  });

  phantomjs.on('qunit.jUnitReport', function (results, xml) {
    grunt.verbose.writeln('JUnit Results:', results);
    if (destFile) {
      var destDir = path.dirname(destFile);
      if (!grunt.file.exists(destDir)) {
        grunt.file.mkdir(destDir);
      }
      grunt.file.write(destFile, xml);
      grunt.log.ok('Report "' + destFile + '" created.');
    }
  });

  // Built-in error handlers
  phantomjs.on('fail.load', function (url) {
    phantomjs.halt();
    grunt.verbose.write('Running PhantomJS...').or.write('...');
    grunt.log.error();
    grunt.warn('PhantomJS unable to load "' + url + '" URI.');
  });

  phantomjs.on('fail.timeout', function () {
    phantomjs.halt();
    grunt.log.writeln();
    grunt.warn('PhantomJS timed out, events were not received.');
  });

  // Pass-through console.log statements
  phantomjs.on('console', console.log.bind(console));


  grunt.registerMultiTask('phantom', 'Run QUnit test suites through phantom', function () {
    // Merge task-specific options with these defaults
    var options = this.options({
      force: false,
      timeout: 5000,
      inject: ['tasks/lib/phantom/bridge.js'],
      baseUrl: ''
    });

    // This is an asynchronous task
    var done = this.async()
      , force = options.force
      , baseUrl = options.baseUrl
      , urls = []

    // Delete "our" options (not passed to the phantom script)
    delete options.force;
    delete options.baseUrl;

    // Reset the task result since this is a multi task
    taskResult = true;

    // Build urls array by adding the baseUrl to the file's src
    this.files.forEach(function (file) {
      urls.push({
        src: url.resolve(baseUrl, file.src[0]),
        dest: file.dest
      });
    });

    grunt.util.async.forEachSeries(urls, function(url, next) {
      // Set destFile for current url -- used to write jUnitReport on disk
      destFile = url.dest;
      // Spawn phantom's process
      phantomjs.spawn(url.src, {
        // Pass-through remaining options to PhantomJS
        options: options,
        done: function (err) {
          if (err) {
            // Abort on an error in the phantom script
            grund.log.writeln();
            grunt.verbose.write('PhantomJS got an error on', url.src);
            grunt.warn(err);
            done();
          } else {
            // Go to next url
            next();
          }
        }
      });
    },
    function () {
      // All urls are done, finish async task
      done(force ? force : taskResult);
    });
  });
};
