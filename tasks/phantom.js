/*
 * grunt phantomjs task
 * http://spektrakel.de
 *
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('phantom', 'Run a phantom script.', function() {
    // Merge task-specific options with these defaults.
    var options = this.options({
      url: 8000,
      hostname: 'localhost',
      script: ''
    });

    // TODO: phantom-task

  });
};
