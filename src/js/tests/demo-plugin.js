$(function () {

  module("foobazaaar")

    test("should provide no conflict", function () {
      var foobazaaar = $.fn.foobazaaar.noConflict();
      ok(!$.fn.foobazaaar, 'foobazaaar was set back to undefined (org value)');
      $.fn.foobazaaar = foobazaaar;
    });

    test("should be defined on jquery object", function () {
      ok($(document.body).foobazaaar, 'foobazaaar method is defined');
    });

    test("should return element", function () {
      ok($(document.body).foobazaaar()[0] == document.body, 'document.body returned');
    });

    test("should fail", function () {
      ok(true);
      ok(false, "intentionally failed-as-designed");
    });

});
