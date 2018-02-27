/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = jQuery(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', jQuery.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = jQuery.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()
        

        this.backdrop(function () {
          var transition = jQuery.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          // これ、modalを複数表示したらcallstackでエラる。 >> ie用にdocumentのフォーカスイベント弄ってるせいかも？
          // that.enforceFocus()

          if(transition){
            that.$element.one(jQuery.support.transition.end, function () {
              that.$element.focus().trigger('shown')
              //modal表示中はbodyのスクロールを止める
              //overflow:hiddenでも良かったが、重複した時のためにクラス追加にした
              jQuery('body').addClass('modal-open')
            })
          }else{
            that.$element.focus().trigger('shown')
            jQuery('body').addClass('modal-open')
          }
        })

        //zIndexの修正(backdrop初期化後に。)
        this.resetGlobalZIndex();
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = jQuery.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        // これ、modalを複数表示したらcallstackでエラる。
        // jQuery(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        jQuery.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        jQuery(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off(jQuery.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one(jQuery.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        //他のmodalが開いていない && modal表示中はbodyのスクロールを止める
        if(this.getOtherOpenedModal().length < 1){
          jQuery('body').removeClass('modal-open');
        }

        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = jQuery.support.transition && animate

          this.$backdrop = jQuery('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              jQuery.proxy(this.$element[0].focus, this.$element[0])
            : jQuery.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one(jQuery.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          jQuery.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one(jQuery.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }

    /**
     * 他の開いているmodalを取得。
     * @return {[type]} [description]
     */
    , getOtherOpenedModal:function(){
      var that = this
        ,$m = jQuery('.modal')
        ,modals = []
      ;
      $m.each(function(i,o){
        var m = jQuery(o).data('modal');
        if(m && m != that && m.isShown) modals.push(m);
      });
      return modals;
    }
    
    /**
     * modal上にmodalを表示するとき、強制的にzIndexを設定。
     * @return {[type]} [description]
     */
    , resetGlobalZIndex:function(){
      var maxIndex = -Infinity,
          others = this.getOtherOpenedModal()
      ;
      for (var i = 0; i < others.length; i++) {
        maxIndex = Math.max(maxIndex,parseInt(others[i].$element.css('z-index')));
      };
      if(maxIndex === -Infinity){
        //ここで設定したzIndexを解除
        if(this.issetGlobalZIndex){
          this.$element.css('z-index','');
          this.options.backdrop && this.$backdrop.length > 0 && this.$backdrop.css('z-index','');
          this.issetGlobalZIndex = false;
        }
      }else{
        //zIndexを設定する
        this.$element.css('z-index',maxIndex+2);
        this.options.backdrop && this.$backdrop.length > 0 && this.$backdrop.css('z-index',maxIndex+1);
        this.issetGlobalZIndex = true;
      }
    }

  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = jQuery.fn.modal

  jQuery.fn.modal = function (option) {
    return this.each(function () {
      var $this = jQuery(this)
        , data = $this.data('modal')
        , options = jQuery.extend({}, jQuery.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  jQuery.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  jQuery.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  jQuery.fn.modal.noConflict = function () {
    jQuery.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  jQuery(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = jQuery(this)
      , href = $this.attr('href')
      , $target = jQuery($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : jQuery.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
