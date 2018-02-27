/**
 * toppage用初期化。
 */
View.initPage = function(){

var win_width = window.innerWidth;
if (!win_width) win_width = document.body.clientWidth;
if (767 < win_width){
		// ランキングのタブ、高さ揃え
		var rankSelect_ = function(e){
			// e.target // activated tab
			// e.relatedTarget // previous tab
			jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);});
			jQuery(".clm2-snav").each(function(){jQuery('> .side-nav, > .tab-content > .tab-pane.active',jQuery(this)).tile();});
			// jQuery(".clm2-snav > .side-nav, .clm2-snav > .tab-content > .tab-pane.active").tile();
		};
		jQuery('[data-toggle="tab"]').on('shown', rankSelect_);
		rankSelect_();
}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
		//console.log('resized');
		jQuery.log("topページINIT");
	
		// ランキングのタブ、高さ揃え
		var rankSelect_ = function(e){
			// e.target // activated tab
			// e.relatedTarget // previous tab
			jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);});
			jQuery(".clm2-snav").each(function(){jQuery('> .side-nav, > .tab-content > .tab-pane.active',jQuery(this)).tile();});
			// jQuery(".clm2-snav > .side-nav, .clm2-snav > .tab-content > .tab-pane.active").tile();
		};
		jQuery('[data-toggle="tab"]').on('shown', rankSelect_);
		rankSelect_();
		}, 200);
	});
};

View.hashchangePage = function(e){
};

/* ------- ページ内リンクの設定 ------- */
jQuery(function(){	
	var hash = escape_html(location.hash);
	if (hash) jump(hash);
});

//トップページの各コンテンツへのページ内リンク
function jump(target){
	if (jQuery(target).length){
	
			var speed = 400
			var href= jQuery(this).attr("href");
			var position = jQuery(target).offset().top - 89
			jQuery("html, body").animate({scrollTop:position}, speed, "swing");
			
			var counter = 1;
			var timerId = setInterval(function(){
			
				var height = jQuery('#brandNav_sp').outerHeight(true);
				var speed = 400
				var href= jQuery(this).attr("href");
				var position = jQuery(target).offset().top - 94
				jQuery("html, body").animate({scrollTop:position}, speed, "swing");
				
			if(counter >= 2){
				clearInterval(timerId);
			}
		counter++;
	}, 250);
	return false;
	}
}

//第2階層以下からのトップページ各コンテンツへのリンク
jQuery(window).load(function () {
	hashtaglink();
	
	var counter = 1;
	var timerId = setInterval(function(){
		hashtaglink();
		if(counter >= 2){
			clearInterval(timerId);
		}
		counter++;
	}, 1000);
});

function hashtaglink(){
	var hashtag = escape_html(location.hash);
	if (hashtag && hashtag.indexOf("#") != -1){
		//alert("#があるよ。");
		//文字列を切り取ります。
		var target = hashtag.substring( 0, 20 );
		//alert("target = " + target);
		var height = jQuery('#brandNav_sp').outerHeight(true);
		//alert("height = " +height);
		var speed = 400
		var href= jQuery(this).attr("href");
		var position = jQuery(target).offset().top - 94
		//alert("position = " + position);
		jQuery("html, body").animate({scrollTop:position}, speed, "swing");
	}
}

var flag = true;
var flag2 = true;

jQuery(function(){
	jQuery(".more-close-btn").css("display","none");
	jQuery(".more-open-btn").on("click", function() {
	jQuery(".moreRead").slideDown(500, 'swing');
	jQuery(this).css("display","none");
	jQuery(".more-close-btn").css("display","block");
	jQuery(".news-block ul").css("height","auto");
	});
});

jQuery(function(){
	jQuery(".more-close-btn").on("click", function() {
	jQuery(".moreRead").slideUp(500, 'swing');
	jQuery(this).css("display","none");
	jQuery(".more-open-btn").css("display","block");
	jQuery(".news-block ul").css("height","200px");
	});
});

jQuery(function(){
	jQuery(".more-close-btn").on("click", function() {
	jQuery(".moreRead").slideUp(500, 'swing');
	jQuery(this).css("display","none");
	jQuery(".more-open-btn").css("display","block");
	jQuery(".news-block ul").css("height","200px");
	});
});



jQuery(function(){
	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			win_width = window.innerWidth;
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){

				jQuery(".news-block ul").removeAttr('style');
				jQuery(".more-open-btn").css("display","block");
				jQuery(".more-close-btn").css("display","none");
			} else {
				jQuery(".news-block ul").removeAttr('style');
			}
		}, 400);
	});
});


// 2017.01.31 add @ Hel
jQuery(function(){
	//cookieのセッティング
	var cookie_save = jQuery.cookie('campaign');
	
	//モーダルのセッティング
	var modal1 = {
		type: 'inline',
		items: {src: '#mfp-popup1'},
		preloader: false,
		closeMarkup:"<button title=\"%title%\" type=\"button\" class=\"mfp-close\"><\/button>"
	};
	var modal2 = {
		type: 'inline',
		items: {src: '#mfp-popup2'},
		preloader: false,
		closeMarkup:"<button title=\"%title%\" type=\"button\" class=\"mfp-close\"><\/button>"
	};
	var modal3 = {
		type: 'inline',
		items: {src: '#mfp-popup3'},
		preloader: false,
		closeMarkup:"<button title=\"%title%\" type=\"button\" class=\"mfp-close\"><\/button>"
	};
	jQuery('.campaign1').magnificPopup(modal1);
	jQuery('.campaign2').magnificPopup(modal2);
	jQuery('.campaign3').magnificPopup(modal3);
	
	//カルーセル枚数別の制御
	/*
	jQuery("#campaign_bnr").each(function () {
		var num = jQuery(this).find('li').length;
		if(cookie_save !== "true"){
			jQuery.cookie('campaign', 'true', {expires: 1});
			if(num <= 1){
				jQuery.magnificPopup.open(modal1, 0);
			}else{
				jQuery.magnificPopup.open(modal2, 0);
			}
		}
	});
	*/
	jQuery("#campaign_bnr").each(function () {
		var num = jQuery(this).find('li').length;
		if(cookie_save !== "true"){
			jQuery.cookie('campaign', 'true', {expires: 1});
			if(num <= 1){
				jQuery.magnificPopup.open(modal1, 0);
			}else{
				if(document.getElementById("campBnr2") != null){
					jQuery.magnificPopup.open(modal2, 0);
				}else if(document.getElementById("campBnr3") != null){
					jQuery.magnificPopup.open(modal3, 0);
				}
			}
		}
	});
});
// 2017.01.31 add @ Hel End