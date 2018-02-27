!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var PopModal = function (element, options) {
    this.options = options;
    this.$element = jQuery(element)
      .delegate('[data-dismiss="popmodal"]', 'click.dismiss.popmodal', jQuery.proxy(this.hide, this));
    // this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  };

  PopModal.prototype = {

      constructor: PopModal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']();
      }

    , show: function () {
        var that = this
          , e = jQuery.Event('show')
        ;
        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.escape();

        this.$element.removeClass('hide');
        jQuery('.modal-header,.modal-footer',this.$element).hide().slideDown(420);
        jQuery('.modal-body',this.$element).hide().slideDown(420,jQuery.proxy(function(e){
          that.$element
            // .addClass('in')
            .attr('aria-hidden', false)
            that.enforceFocus()
          ;
        },this));

        // this.backdrop(function () {
        //   var transition = jQuery.support.transition && that.$element.hasClass('fade')

        //   if (!that.$element.parent().length) {
        //     that.$element.appendTo(document.body) //don't move popmodals dom position
        //   }

        //   that.$element
        //     .show()

        //   if (transition) {
        //     that.$element[0].offsetWidth // force reflow
        //   }

        //   that.$element
        //     .addClass('in')
        //     .attr('aria-hidden', false)

        //   that.enforceFocus()

        //   transition ?
        //     that.$element.one(jQuery.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
        //     that.$element.focus().trigger('shown')

        // })
      }

    , hide: function (e) {
        e && e.preventDefault();

        var that = this;

        e = jQuery.Event('hide');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.escape();

        jQuery(document).off('focusin.popmodal');

        jQuery('.modal-header,.modal-footer',this.$element).slideUp(420);
        jQuery('.modal-body',this.$element).slideUp(420,jQuery.proxy(function(e){
          that.$element
            .addClass('hide')
            // .addClass('in')
            .attr('aria-hidden', true)
            that.enforceFocus()
          ;
        },this));

        // this.$element
        //   .removeClass('in')
        //   .attr('aria-hidden', true)
        ;

        // jQuery.support.transition && this.$element.hasClass('fade') ?
        //   this.hideWithTransition() :
        //   this.hidePopModal();
      }

    , enforceFocus: function () {
        var that = this;
        jQuery(document).on('focusin.popmodal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus();
          }
        });
      }

    , escape: function () {
        var that = this;
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.popmodal', function ( e ) {
            e.which == 27 && that.hide();
          });
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.popmodal');
        }
      }

    // , hideWithTransition: function () {
    //     var that = this
    //       , timeout = setTimeout(function(){
    //           that.$element.off(jQuery.support.transition.end);
    //           that.hidePopModal();
    //         }, 500)
    //       ;

    //     this.$element.one(jQuery.support.transition.end, function () {
    //       clearTimeout(timeout);
    //       that.hidePopModal();
    //     });
    //   }

    , hidePopModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')
        ;

        // this.backdrop()
      }

    // , removeBackdrop: function () {
    //     this.$backdrop.remove()
    //     this.$backdrop = null
    //   }

    // , backdrop: function (callback) {
    //     var that = this
    //       , animate = this.$element.hasClass('fade') ? 'fade' : ''

    //     if (this.isShown && this.options.backdrop) {
    //       var doAnimate = jQuery.support.transition && animate

    //       this.$backdrop = jQuery('<div class="popmodal-backdrop ' + animate + '" />')
    //         .appendTo(document.body)

    //       this.$backdrop.click(
    //         this.options.backdrop == 'static' ?
    //           jQuery.proxy(this.$element[0].focus, this.$element[0])
    //         : jQuery.proxy(this.hide, this)
    //       )

    //       if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

    //       this.$backdrop.addClass('in')

    //       doAnimate ?
    //         this.$backdrop.one(jQuery.support.transition.end, callback) :
    //         callback()

    //     } else if (!this.isShown && this.$backdrop) {
    //       this.$backdrop.removeClass('in')

    //       jQuery.support.transition && this.$element.hasClass('fade')?
    //         this.$backdrop.one(jQuery.support.transition.end, jQuery.proxy(this.removeBackdrop, this)) :
    //         this.removeBackdrop()

    //     } else if (callback) {
    //       callback()
    //     }
    //   }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = jQuery.fn.popmodal;

  jQuery.fn.popmodal = function (option) {
    return this.each(function () {
      var $this = jQuery(this)
        , data = $this.data('popmodal')
        , options = jQuery.extend({}, jQuery.fn.popmodal.defaults, $this.data(), typeof option == 'object' && option)
      ;
      if (!data) $this.data('popmodal', (data = new PopModal(this, options)));
      if (typeof option == 'string') data[option]();
      else if (options.show) data.show();
    });
  };

  jQuery.fn.popmodal.defaults = {
    keyboard: true
    , show: true
  };

  jQuery.fn.popmodal.Constructor = PopModal;


 /* MODAL NO CONFLICT
  * ================= */

  jQuery.fn.popmodal.noConflict = function () {
    jQuery.fn.popmodal = old;
    return this;
  }


 /* MODAL DATA-API
  * ============== */

  jQuery(document).on('click.popmodal.data-api', '[data-toggle="popmodal"]', function(e){
    var $this = jQuery(this)
      , href = $this.attr('href')
      , $target = jQuery($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('popmodal') ? 'toggle' : jQuery.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())
    ;

    e.preventDefault();

    $target
      .popmodal(option)
      .one('hide', function () {
        $this.focus();
      })
    ;
  });

}(window.jQuery);
