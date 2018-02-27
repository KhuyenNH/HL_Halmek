/**
 * guide(全)用初期化など。(tmpl)
 */
View.initPage = function(){
	/**
	 * サイドナビゲーションを開くためのパラメタは、右カラムヘッダ下の <div id="guide9" class="page-body text-section"> のidから取得
	 * =>View.jsの$sideNavの処理に集約。
	 */
	// var nidPref = 'guide';
	// var navId = jQuery('.page-body').attr('id');//View.$body.attr('data-nav-id');
	// if(navId){
	// 	navId = Number( navId.replace(new RegExp(RegExp.escape(nidPref)),'') );
	// }
	// var $pNavList = jQuery('.clm2-guide > .side-nav > ul:first > li');
	// if(navId!=NaN && $pNavList && $pNavList.length){
	// 	$pNavList.eq(navId).addClass('active');
	// }
	
	//サイドナビのスムーススクロール
	jQuery('#sideNav li.active ul > li > a').on('click',function(e){
		jQuery.preventDefault(e);
		var $t = jQuery(e.target);
		if($t.get(0).tagName.toLowerCase() != 'a'){
			$t = $t.closest('a');
		}
		// jQuery.log(ReqUtil.getAnchor($t.attr('href')));
		new AnimScrollTop().to(ReqUtil.getAnchor($t.attr('href')));
		return false;
	});  
	
	//Sp用
	jQuery(function(){
	var win_width = window.innerWidth;
	if (win_width < 767){
		jQuery('#guide9 #s2 div').removeAttr('style');
		jQuery('#guidePage .clm2-guide .page-body section h2 a').replaceWith(function() {
			var tag_href = jQuery(this).attr("href");
			if ( tag_href == null) {
				var tag_href_plus =[];
			} else {
				var tag_href_plus = 'href="'+tag_href+'"';
			}
			jQuery(this).replaceWith('<span '+tag_href_plus+' class="span">'+jQuery(this).html()+'</span>');
		});
	}
		var timer = false;
		jQuery(window).resize(function() {
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				var win_width = window.innerWidth;
				var tag_href = jQuery(this).attr("href");
				if (win_width < 767){
					jQuery('#guide9 #s2 div').removeAttr('style');
					jQuery('#guidePage .clm2-guide .page-body section h2 a').replaceWith(function() {
						var tag_href = jQuery(this).attr("href");
						if ( tag_href == null) {
							var tag_href_plus =[];
						} else {
							var tag_href_plus = 'href="'+tag_href+'"';
						}
						jQuery(this).replaceWith('<span '+tag_href_plus+' class="span">'+jQuery(this).html()+'</span>');
					});
				} else {
					jQuery('#guide9 #s2 div').attr({
						style:"width:642px;"
					});

					jQuery('#guidePage .clm2-guide .page-body section h2 span.span').replaceWith(function() {
						var tag_href = jQuery(this).attr("href");
						if ( tag_href == null) {
							var tag_href_plus =[];
						} else {
							var tag_href_plus = 'href="'+tag_href+'"';
						}
					jQuery(this).replaceWith('<a '+tag_href_plus+'>'+jQuery(this).html()+'</a>');
					});
				}
			}, 200);
		});
	});

};

/* ------- ページ内リンクの設定 ------- */
jQuery(function(){	
	var hash = escape_html(location.hash);
	if (hash) jump(hash);
});

//ページ内リンク
function jump(target){
	if (jQuery(target).length){
		if (!get_spflag() && 767 < win_width){
			//alert("PC");
			var speed = 400
			var href= jQuery(this).attr("href");
			var position = jQuery(target).offset().top - 115
			jQuery("html, body").animate({scrollTop:position}, speed, "swing");

		}else if(get_spflag() && 767 < win_width){
			//alert("SP_TAB");
			var speed = 400
			var href= jQuery(this).attr("href");
			var position = jQuery(target).offset().top - 185
			jQuery("html, body").animate({scrollTop:position}, speed, "swing");
		}else{
			//alert("SP");
			var speed = 400
			var href= jQuery(this).attr("href");
			var position = jQuery(target).offset().top - 185
			jQuery("html, body").animate({scrollTop:position}, speed, "swing");
		}
	}
}
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
			flag = 0;	// iPad
		}
	
		return flag;
	}

//ご利用ガイド トップ アコーディン処理
jQuery(function(){
	var timer = false;
	var win_width_tmp;

	jQuery(window).resize(function() {
		
		win_width = window.innerWidth;
		if (win_width != win_width_tmp){
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				if (win_width < 767){
					jQuery("#guidePage .clm2-guide .page-body section h2").addClass("slideH2");
					jQuery("#guidePage .clm2-guide .page-body section h2").removeClass("opened");
					jQuery("#guidePage .clm2-guide .page-body ul.arrows").css("display","none");
				} else {
					jQuery("#guidePage .clm2-guide .page-body section h2").removeClass("slideH2");
					jQuery("#guidePage .clm2-guide .page-body section h2").removeClass("opened");
					jQuery("#guidePage .clm2-guide .page-body ul.arrows").css("display","block");
				}
				win_width_tmp = win_width;
			}, 200);
		}
	});
	
	jQuery('h2').on('click', function() {
		if (window.innerWidth < 767){
			jQuery(this).toggleClass('opened');
			jQuery(this).next('ul').slideToggle(100, 'swing');
		}
	});
});

View.hashchangePage = function(e){
};