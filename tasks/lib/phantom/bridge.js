/*
 * phantomjs bridge - injected into phantom's webkit context
 * http://spektrakel.de
 *
 * Copyright (c) 2013 David Herges <david@spektrakel.de>
 * Licensed under the MIT license.
 */

/*global QUnit:true, alert:true*/

'use strict';

/**
 * Connects QUnit to the Grunt task. These messages are transported from Phantom's WebKit
 * context to the parent PhantomJS process, then written on disk to a temporary file,
 * read by the Grunt PhantomJS library, and finally delivered to the Grunt task; all that
 * happening without you noticing it... Oo
 */
function sendMessage() {
  var args = [].slice.call(arguments);
  alert(JSON.stringify(args));
}

QUnit.config.reorder = false;
QUnit.config.autorun = false;

QUnit.log(function (obj) {
  if (obj.message === '[object Object], undefined:undefined') {
    return;
  }
  var actual = QUnit.jsDump.parse(obj.actual);
  var expected = QUnit.jsDump.parse(obj.expected);
  sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
});

QUnit.testStart(function (obj) {
  sendMessage('qunit.testStart', obj.name);
});

QUnit.testDone(function (obj) {
  sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total);
});

QUnit.moduleStart(function (obj) {
  sendMessage('qunit.moduleStart', obj.name);
});

QUnit.moduleDone(function (obj) {
  sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
});

QUnit.begin(function () {
  sendMessage('qunit.begin');
});

QUnit.done(function (obj) {
  sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
});

QUnit.jUnitReport = function (data) {
  sendMessage('qunit.jUnitReport', data.results, data.xml);
};
