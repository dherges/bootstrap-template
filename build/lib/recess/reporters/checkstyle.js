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

var _ = require('underscore')
  , defaults = {
      noIDs: 'error'
    , noJSPrefix: 'error'
    , noOverqualifying: 'warning'
    , noUnderscores: 'error'
    , noUniversalSelectors: 'warning'
    , Parse: 'error'
    , prefixWhitespace: 'ignore'
    , strictPropertyOrder: 'info'
    , zeroUnits: 'info'
    , defaultError: 'warning'
  }


/**
 * Creates a new instance of CheckstyleReporter. CheckstyleReporter provides an API to
 * generate a checkstyle.xml report file from RECESS error objects.
 * @param {Object} options Options for the reporter
 */
function CheckstyleReporter(options) {
  this.options = _.extend({}, defaults, options)
  this.report = ''
}

CheckstyleReporter.prototype = {

  constructor: CheckstyleReporter

  /**
   * Starts a checkstyle report.
   */
, startReport: function() {
    this.report = '<?xml version="1.0" encoding="UTF-8"?>'
    this.report += '<checkstyle version="4.0.0">'
  }

  /**
   * Ends a checkstyle report and returns XML as string.
   * @return {String} XML of checkstyle report
   */
, endReport: function() {
    this.report += '</checkstyle>'
    return this.report
  }

  /**
   * Starts reporting errors of a source file.
   * @param {String} srcFile Filename of .less or .css source file
   */
, startFile: function(srcFile) {
    this.report += '<file name="' + srcFile + '">'
  }

  /**
   * Ends reporting errors of a source file.
   */
, endFile: function() {
    this.report += '</file>'
  }

  /**
   * Logs an error of the current source file.
   * @param {Object} err RECESS error object
   */
, logError: function(err) {
    var mappedErr = this.translate(err)
    this.report += '<error line="' + mappedErr.line + '"'
            + ' column="' + mappedErr.column + '"'
            + ' severity="' + mappedErr.severity + '"'
            + ' message="' + _.escape(mappedErr.message) + '"'
            + ' source="' + _.escape(mappedErr.source) + '"/>'
  }

  /**
   * Translates a RECESS error object to a checkstyle-compatible error object.
   * @param {Object} err RECESS error object
   * @return {Object} Checkstyle error object with properties 'line', 'column', 'severity', 'source', and 'message'
   */
, translate: function(err) {
  return {
      line: err.line || (err.extract.stripColors.match(/^\s*(\d+)/))[1] || 0
    , column: err.column || 0
    , severity: this.options[err.type] || this.options.defaultError
    , source: 'recess.' + err.type
    , message: err.message.stripColors + (err.extract.stripColors ? err.extract.stripColors : '')
    }
  }

  /**
   * Flush the report to stdout
   */
, flush: function() {
    console.log(this.report)
  }

}

module.exports = CheckstyleReporter
