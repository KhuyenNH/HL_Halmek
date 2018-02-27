var View2 = {};

View2.initPage = function(){
	// IE8チェック
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";
	//ソートクリックでsubmit
	var $sortForm = jQuery('#sortForm');

	jQuery('select',$sortForm).on('change',function(e){
		jQuery.cancelBubble(e);
		jQuery.preventDefault(e);
		$sortForm.trigger('submit');
		// View.$wrap.prepend('&nbsp;A');
		return false;
	});

	//[itemListだけの暫定処理] .mainvisual内のimgが読み込まれたタイミングでもう一回サイドナビとメインコンテンツの高さ修正。
	var $mv = jQuery('.mainvisual');
	$mv.each(function(i,o){
		var $o = jQuery(o);
		var $img = jQuery('img',$o);
		if(!$img.attr('src'))return;
		var newSrc = $img.attr('src') + '?' + (new Date().getTime());//キャッシュを無効
		var $img2 = jQuery('<img>');
		$img2.load(function(){
			// console.log("mainvisual image loaded!", this);
			 jQuery(".clm2-snav").each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
		});
		$img2.get(0).src = newSrc;
		$img.after($img2);
		$img.remove();
	});
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	//View.ranking.js、View.selectset.js、View.itemList.js、script.js(2周年キャンペーン)で同様の設定
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		jQuery(function(){
			jQuery("#sideNav").appendTo( "#naviTop" );
		});
		}else{
		jQuery(function(){
			jQuery("#sideNav").appendTo( "#naviBottom" );
		});
	}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			var win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			//View.ranking.js、View.selectset.js、View.itemList.js、script.js(2周年キャンペーン)で同様の設定
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				jQuery(function(){
					jQuery("#sideNav").appendTo( "#naviTop" );
				});
				jQuery(".clm2-snav").each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
			}else{
				jQuery(function(){
					jQuery("#sideNav").appendTo( "#naviBottom" );
				});
			}
		}, 200);
	});

	function get_spflag(){
		var flag = 0;
		var ua = navigator.userAgent;
	
		if (ua.indexOf('iPhone') != -1) {
			flag = 1;	//iPhone
		}else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
			flag = 1;	// Android
		}else if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || ua.indexOf('A1_07') > 0 || ua.indexOf('SC-01C') > 0 ){
			flag = 1;	// Android tablet
		}else if(ua.indexOf('iPad') != -1){
			flag = 1;	// iPad
		}
	
		return flag;
	}


	// SP版の[前へ][次へ]ボタンにクラスを追加する
	var $prevPage = jQuery('.paging .arrowL').parent();
	var $nextPage = jQuery('.paging .arrowR').parent();
	if ($prevPage[0]) $prevPage.addClass('prevPage');
	if ($nextPage[0]) $nextPage.addClass('nextPage');

};
View2.hashchangePage = function(e){
};


var linkTouchStart = function(){
  thisAnchor = jQuery(this);
  touchPos = thisAnchor.offset().top;
  moveCheck = function(){
    nowPos = thisAnchor.offset().top;
    if(touchPos == nowPos){
      thisAnchor.addClass("hover");
    }
  }
  setTimeout(moveCheck,10);
}

var linkTouchEnd = function(){
  thisAnchor = jQuery(this);
  hoverRemove = function(){
    thisAnchor.removeClass("hover");
  }
  setTimeout(hoverRemove,100);
}

 

jQuery(document).on('touchstart mousedown','a',linkTouchStart);

jQuery(document).on('touchend mouseup','a',linkTouchEnd);

jQuery(function(){
  View2.initPage();
});

/* drilldown search */

jQuery(function(){

  //絞り込みボタン押下時の送信可否判定用フラグ
  var submit_flg = true;
  
	jQuery(".form_filter_by_price").each(function(){
    var this_ = jQuery(this);
    var check_filter_by_price_value = function(){
      var select_lower_val = Number(this_.find("select.select_lower").val());
      var select_upper_val = Number(this_.find("select.select_upper").val());
      if(select_lower_val != "" ){
        if(select_upper_val != ""){
          if(select_lower_val >= select_upper_val){
            this_.find(".popmessage").addClass("show");
            submit_flg = false;
          } else {
            this_.find(".popmessage").removeClass("show");
            submit_flg = true;
          }
        } else {
          this_.find(".popmessage").removeClass("show");
          submit_flg = true;
        }
      } else {
        this_.find(".popmessage").removeClass("show");
        submit_flg = true;
      }
    };
    jQuery(this).find("select.select_lower").change(function(){
      check_filter_by_price_value();
    });
    jQuery(this).find("select.select_upper").change(function(){
      check_filter_by_price_value();
    });
    jQuery(this).find(".btn_submit_drilldown_price_search a").click(function(){
      if(submit_flg){
         this_.find("#_price_search_frm").submit();
      }
      //console.log(0);
      //if(submit_flg){
      //  alert("絞り込み実行");
      //}
    });
  });

  var toggle_drilldown_search_sp_dropdown = function(){
    var menu = jQuery(".drilldown_search_sp_dropdown_menu");
    if(menu.is(":visible")){
      menu.slideUp(300);
      jQuery(".drilldown_search_sp").removeClass("open");
    } else {
      menu.slideDown(300);
      jQuery(".drilldown_search_sp").addClass("open");
    }
  };
  jQuery(".drilldown_search_sp").each(function(){
    jQuery(this).click(function(){
      toggle_drilldown_search_sp_dropdown();
    });
    jQuery(".drilldown_search_sp_dropdown_menu .btn_close a").click(function(){
      toggle_drilldown_search_sp_dropdown();
    });
  });

});

jQuery(function(){
	jQuery(".btn_searchInput_nohit_clear").click(function(){
		jQuery("#searchInput_nohit").val("");
	});
});

jQuery(function(){
	if(!jQuery("div").hasClass("drilldown_search_sp")){
		jQuery(".sortby").css("margin-left","0px")
	}
});
