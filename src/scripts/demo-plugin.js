/*
 * jQuery plugin for demonstration purposes.
 */
;(function ($, window, document, undefined) {

  // Plugin code

  var pluginName = "foobazaaar"
    , pluginDefaults = {
        key: "value"
      }

  function Foobazaaar(element, options) {
    this.element = element;
    this.options = $.extend({}, pluginDefaults, options);
    this.init();
  }

  Foobazaaar.prototype = {

    init: function () {
    }

  , yourOtherFunction: function (el, options) {
      // some gui & logic jShitty spaghetti code
    }

  };


  // Plugin definition on the $ beast scope

  var old = $.fn[pluginName];

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin." + pluginName)) {
        $.data(this, "plugin." + pluginName, new Foobazaaar(this, options));
      }
    });
  };

  $.fn[pluginName].Constructor = Foobazaaar;

  $.fn[pluginName].defaults = pluginDefaults;

  $.fn[pluginName].noConflict = function () {
    $.fn[pluginName] = old;
    return this;
  }

})(jQuery, window, document);
