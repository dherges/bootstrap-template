/*
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

module.exports = function (argv) {

  var recess = require('recess')
    , fs = require('fs')
    , nopt = require('nopt')
    , path = require('path')
    , checkstyleReporter = require('./reporters/checkstyle.js')
    , mapping = {}
    , nopts
    , options
    , outputFile
    , paths
    , recessOptions
    , reporter
    , shorthand


  // define and parse options
  nopts = {
    config: String
  , mapping: String
  , output: String
  }
  shorthand = {
    'c': ['--config']
  , 'm': ['--mapping']
  , 'o': ['--output']
  }
  options = nopt(nopts, shorthand, argv)

  // get paths
  paths = options.argv.remain

  // read mapping.json file
  options.mapping && fs.existsSync(options.mapping) && (mapping = JSON.parse(fs.readFileSync(options.mapping)))
  reporter = new checkstyleReporter(mapping)

  // read config.json file
  options.config && fs.existsSync(options.config) && (recessOptions = JSON.parse(fs.readFileSync(options.config)))
  recessOptions.cli = false
  recessOptions.stripColors = true


  // run build & process callback
  recess(paths, recessOptions, function (err, instances) {
    if (err) throw err
    reporter.startReport();

    // for each file, we get one instance
    instances
      && instances.length
      && instances.forEach(function (instance) {

        // write compiled css code to output directory
        outputFile = path.resolve(path.normalize(options.output + '/' + path.basename(instance.path)))
        options.output
          && fs.existsSync(options.output)
          && fs.statSync(options.output).isDirectory()
          && fs.writeFileSync(outputFile, instance.data)

        // start <file> tag in checkstyle.xml
        reporter.startFile((options.output) ? outputFile : instance.path);

        // loop over definitions to get errors
        instance.definitions
          && instance.definitions.length
          && instance.definitions.forEach(function (def) {

            // report that error
            def.errors
              && def.errors.length
              && def.errors.forEach(function (err) {

                // log an <error> tag in checkstyle.xml
                reporter.logError(err);
              });
          });

        // end a </file> tag in checkstyle.xml
        reporter.endFile();
      });

    reporter.endReport();
    console.log(reporter.report);
  });

}
