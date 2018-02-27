//indexOf関数が無い場合
if (!("indexOf" in Array.prototype)) {
	Array.prototype.indexOf = function(find, i) {
		var n;
		if (i === undefined) i = 0;
		if (i < 0) i += this.length;
		if (i < 0) i = 0;
		n = this.length;
		while (i < n) {
			if (i in this && this[i] === find) return i;
			i++;
		}
		return -1;
	};
}

/* ------- 初期設定 ------- */
var nowdate   = new Date();
var viewflag;
var setdate;
var date30;

var EC_WWW_ROOT = ''

// 今日の日付を30日後にして検証
// var nowdate = computeDate(nowdate.getFullYear(), (nowdate.getMonth() + 1), nowdate.getDate(), 30);

/* ------- クッキー取得 ------- */
if (GetCookie('data')){
	var cookies = GetCookie('data').split(',');
	viewflag = cookies[0];
	setdate  = cookies[1];	
}

/* ------- 振り分け ------- */
if (viewflag == "PC"){
	document.write('<link id="pc_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');

}else if (!jQuery.support.opacity){

	jQuery("#change_view_top_sp").css("display", "none"); //パソコン版で見る
	jQuery("#change_view_top_sp").css("background-", "none"); //パソコン版で見る
	jQuery("#important-notify_sp").css("display", "none"); //SPお知らせ
	jQuery("#topbar_sp").css("display", "none"); //SPヘッダー
	jQuery("#shopNav_wrapper_sp").css("display", "none"); //SPヘッダーボタン群
	jQuery(".sp-contents").css("display", "none"); //SP商品が決まっている方
	jQuery("#ranking_sp").css("display", "none"); //SP今月号の人気ランキング
	jQuery("#section1_sp").css("display", "none"); //SPカテゴリ
	jQuery("#simpleGuide_sp").css("display", "none"); //SPかんたんショッピングガイド
	jQuery("#inquirySection_sp").css("display", "none"); //SPお問い合わせ
	jQuery("#copyrights_sp").css("display", "none"); //SPフッター

	document.write('<link id="pc_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
	document.write('<link id="subset_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/subset.css" />');

}else{

	var ua = navigator.userAgent;

	if (ua.indexOf('iPhone') != -1) {
		viewflag = "iPhone";
		document.write('<meta id="meta_vp_sp" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">');
		document.write('<meta id="meta_phone" name="format-detection" content="telephone=no" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
		document.write('<link id="sp_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');

	}else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){

		viewflag = "Android";
		document.write('<meta id="meta_vp" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">');
		document.write('<meta id="meta_phone" name="format-detection" content="telephone=no" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="./res/css/pc.css" />');
		document.write('<link id="sp_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');

	}else if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || ua.indexOf('A1_07') > 0 || ua.indexOf('SC-01C') > 0 ){
		
		viewflag = "Android tablet";
		document.write('<meta name="viewport" content="width=1080px,user-scalable=yes">');
		document.write('<meta id="meta_phone" name="format-detection" content="telephone=no" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/tablet_pc.css" />');
		document.write('<link id="sp_css" rel="stylesheet" media="screen and (max-width: 767px)" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');
		document.write('<link id="subset_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/subset.css" />');

	}else if(ua.indexOf('iPad') != -1){
		
		viewflag = "iPad";
		document.write('<meta name="viewport" content="width=1080px,user-scalable=yes">');
		document.write('<meta id="meta_phone" name="format-detection" content="telephone=no" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/tablet_pc.css" />');
		document.write('<link id="sp_css"rel="stylesheet" media="screen and (max-width: 767px)" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');
		document.write('<link id="subset_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/subset.css" />');

	}else{

		viewflag = "defult";
		document.write('<meta id="meta_vp_pc" name="viewport" content="width=device-width,initial-scale=1.0,user-scalable = no">');
		document.write('<link id="pc_css" rel="stylesheet" media="screen and (min-width: 768px)" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
		document.write('<link id="sp_css" rel="stylesheet" media="screen and (max-width: 767px)" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');
		document.write('<link id="subset_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/subset.css" />');
	}

}

var win_width = window.innerWidth;
/* ------- JS読み込み ------- */
if (win_width < 768){
	//console.log(win_width);
	document.write('<script type="text/javascript" src="' + EC_WWW_ROOT+ './res/js/lib/libs.minsp.js"></script>');
}else{
	document.write('<script type="text/javascript" src="' + EC_WWW_ROOT+ './res/js/lib/libs.min.js"></script>');
}




/* ------- 読み込み後、表示切り替え ------- */
jQuery(function(){
	
	
	if (setdate){
		var tmpary = setdate.split('-');
		date30 = computeDate(tmpary[0], tmpary[1], tmpary[2], 30);
	}
	
	if (!jQuery.support.opacity){
		jQuery("#change_view_toppc_sp").css("display", "none");
		jQuery("#change_view_top_sp").css("display", "none");
	} else if (viewflag == "defult" || viewflag == "Android tablet" || viewflag == "iPad"){
		// PCとタブレット
		//console.log("▼PCとタブレット");
		jQuery("#change_view_toppc_sp").css("display", "none");
		jQuery("#change_view_top_sp").css("display", "none");
		window.onresize = window_load;	//レスポンシブを稼働

	}else if (viewflag == "PC"){
		// スマホでPC版を見ている状態
		//console.log("▼スマホでPC版を見ている状態");
		jQuery("#change_view_top_sp").css("display", "none");
		jQuery("#change_view_btm").css("display", "block");
		if (date30 && nowdate < date30) {
			jQuery("#change_view_toppc_sp").css("display", "none");
		}else{
			jQuery("#change_view_toppc_sp").css("display", "block");
		}
	
	}else{
		// スマホ
		//console.log("▼スマホ");
		jQuery("#change_view_toppc_sp").css("display", "none");
		if (date30 && nowdate < date30) {
			jQuery("#change_view_top_sp").css("display", "none");
		}else{
			jQuery("#change_view_top_sp").css("display", "block");
		}
		
	}

	bannerCheck(); // バナーチェック

});

/* ------- 表示切り替えバナーによる処理 ------- */
function change_view(site){
	var dt = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate();
	
	if (site == "PC"){
		// ▼スマホ版からPC版に表示切り替え
		//console.log("▼スマホ版からPC版に表示切り替え");
		SetCookie('data', 'PC,', 365);
		viewflag = 'PC';

		jQuery('head #meta_vp_sp').remove();
		jQuery('head #meta_phone').remove();
		jQuery('head #pc_css').remove();
		jQuery('head #sp_css').remove();

		jQuery('head').append('<meta id="meta_vp_pc" name="viewport" content="width=1024">');
		jQuery('head').append('<link id="strict_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/strict.css" />');
		jQuery('head').append('<link id="pc_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/pc.css" />');
		jQuery('head').append('<link id="subset_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/subset.css" />');
		
		
		jQuery("#change_view_top_sp").css("display", "none"); //パソコン版で見る
		jQuery("#important-notify_sp").css("display", "none"); //SPお知らせ
		jQuery("#topbar_sp").css("display", "none"); //SPヘッダー
		jQuery("#shopNav_wrapper_sp").css("display", "none"); //SPヘッダーボタン群
		jQuery(".sp-contents").css("display", "none"); //SP商品が決まっている方
		jQuery("#ranking_sp").css("display", "none"); //SP今月号の人気ランキング
		jQuery("#section1_sp").css("display", "none"); //SPカテゴリ
		jQuery("#simpleGuide_sp").css("display", "none"); //SPかんたんショッピングガイド
		jQuery("#inquirySection_sp").css("display", "none"); //SPお問い合わせ
		jQuery("#copyrights_sp").css("display", "none"); //SPフッター

		jQuery("#change_view_toppc_sp").css("display", "block"); //PCスマートフォン版で見る(上）
		jQuery("#change_view_btm").css("display", "block");//PCスマートフォン版で見る(下）
		
		jQuery(".arrow-list li").css("height", "44px");//
		jQuery("#sideNav").appendTo( "#naviTop" );//左ナビ入れ替え処理
	}else if (site == "close"){
		// ▼「X」が押されたら表示切り替えバナーを消す
		if (viewflag == "PC"){
			jQuery("#change_view_toppc_sp").css("display", "none");
			SetCookie('data', viewflag + ',' + dt, 365);
		}else{
			jQuery("#change_view_top_sp").css("display", "none");
			SetCookie('data', ',' + dt, 365);
		}
	}else{
		//  ▼PC版からスマホ版に表示切り替え
		//console.log("▼PC版からスマホ版に表示切り替え");
		SetCookie('data', ',', 365);
		viewflag = '';
		//jQuery('.replace').each(function(){
			//var txt = jQuery(this).html();
			//jQuery(this).html(txt.replace(/jQueryで /g,''));
		//});
		//window.location.reload();

		jQuery('head #meta_vp_pc').remove();
		jQuery('head #pc_css').remove();
		jQuery('head #sp_css').remove();
		jQuery('head #subset_css').remove();

		jQuery('head').append('<meta id="meta_phone" name="format-detection" content="telephone=no" />');
		jQuery('head').append('<link id="sp_css" rel="stylesheet" href="' + EC_WWW_ROOT+ './res/css/mobile.css" />');
		jQuery('head').append('<meta id="meta_vp_sp" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">');

		jQuery("#change_view_toppc_sp").css("display", "none"); //PCスマートフォン版で見る(上）
		jQuery("#change_view_btm").css("display", "none");//PCスマートフォン版で見る(下）

		jQuery(".sp-contents").css("display", "block"); //SP商品が決まっている方
		jQuery("#ranking_sp").css("display", "block"); //SP今月号の人気ランキング
		jQuery("#section1_sp").css("display", "block"); //SPカテゴリ
		jQuery("#simpleGuide_sp").css("display", "block"); //SPかんたんショッピングガイド
		jQuery("#inquirySection_sp").css("display", "block"); //SPお問い合わせ
		jQuery("#copyrights_sp").css("display", "block"); //SPフッター
		jQuery("#change_view_top_sp").css("display", "block"); //パソコン版で見る
		jQuery("#important-notify_sp").css("display", "block"); //SPお知らせ
		jQuery("#topbar_sp").css("display", "block"); //SPヘッダー
		jQuery("#shopNav_wrapper_sp").css("display", "block"); //SPヘッダーボタン群
		jQuery("#sideNav").appendTo( "#naviBottom" );//左ナビ入れ替え処理
		var $sn1 = jQuery(".clm2-snav");
		$sn1.each(function(){jQuery('> #naviBottom .side-nav, > .section-content',jQuery(this)).removeAttr('style');});
		var categoryarea = parseInt(jQuery("#important-notify_sp").css('height'));
		var height = jQuery('#important-notify_sp').height();
		var topbar    = jQuery("#topbar_sp");
		var topbarhead = topbar.offset().top + height;
		topbar.css('width','100%');
		//topbar.addClass("fixed");

	}
}

/* ------- SetCookie ------- */
function SetCookie(name, val, expires){
	var expire = new Date();
	expire.setTime( expire.getTime() + 1000 * 3600 * (24 * expires) );
	var cookie_value = name + '=' + encodeURIComponent(val) + ';path=/ec/; expires=' + expire.toUTCString();
	document.cookie = cookie_value;
}

/* ------- GetCookie ------- */
function GetCookie( name ){
	var result     = null;
	var cookieName = name + '=';
	var allcookies = document.cookie;
	var position   = allcookies.indexOf( cookieName );

	if( position != -1 ){
		var startIndex = position + cookieName.length;
		var endIndex = allcookies.indexOf( ';', startIndex );
		if ( endIndex == -1 ) endIndex = allcookies.length;
		result = decodeURIComponent( allcookies.substring( startIndex, endIndex ) );
	}

	return result;
}

/* ------- レスポンシブ ------- */
var minjs    = EC_WWW_ROOT+ './res/js/lib/libs.min.js';
var minspjs  = EC_WWW_ROOT+ './res/js/lib/libs.minsp.js';
var win_flag = "minjs";

function window_load() {
	var win_width = window.innerWidth;

	if (win_width < 768){
		// ▼768以下（スマホ）
		if (win_flag == "minjs"){
			win_flag = "minspjs";
			//$.getScript(minspjs);	// lib.minsp.jp読み込み
			jQuery(".table_style li .signup_form-liquid_right .signup_form-item_right .select-wrap select.select_menu").css("display", "block");
			if (viewflag == "PC" || viewflag == "defult"){
				jQuery("#change_view_top_sp").css("display", "none");
				jQuery("#forSp").css("display", "none");
				jQuery("#copyrights_sp .forpc-btn").css("display", "none");
				jQuery(".select-wrap select").css("display", "block");
				
			} else{
				jQuery(".select-wrap select").css("display", "block");
				jQuery(".table_style li .signup_form-liquid_right .signup_form-item_right .select-wrap select.select_menu").show();
			}
		}
		
	}else{
		// ▼768以上（PC）
		if (win_flag == "minspjs"){
			win_flag = "minjs";
			//jQuery.getScript(minjs);	// lib.min.jp読み込み
			jQuery(".select-wrap select").hide();
			jQuery("#topbar + #shopNav_wrapper_sp").css("padding-top", "0");
		}
	}
}

/* ------- n日後取得 ------- */
function computeDate(year, month, day, addDays) {
	var dt = new Date(year, month - 1, day);
	var baseSec = dt.getTime();
	var addSec = addDays * 86400000;
	var targetSec = baseSec + addSec;
	dt.setTime(targetSec);
	return dt;
}



/* ------- ページ内リンクの設定 ------- */
/*jQuery(function(){	
	var hash = escape_html(location.hash);
	if (hash) jump(hash);
});*/



/* ------- クリック処理 ------- */
jQuery(function(){
	//css追加
	jQuery('button').click(function(){
		jQuery(this).addClass("hover");
	});
});

jQuery(document).ready(function(){
	jQuery(".newtgl").click(function () {
		jQuery("#enterAddress2_sp").slideToggle();
	});
});

function escape_html(val){
	if (val){
		return val.replace( /&/g, "&amp;" )
		.replace( /</g, "&lt;" )
		.replace( />/g, "&gt;" )
		.replace( /"/g, "&quot;" )
		.replace( /'/g, "&#x27;" );
    }
}

/**
* バナー(Webクリップ)処理
*/
var banner_selecter     = '#addhome_sp';	// バナーのセレクタ
var banner_btn_selecter = '#addhome_sp button.closebtnaddhome';// バナーボタンのセレクタ

function bannerCheck(){

	// 今日の日付を30日後にして検証
	 nowdate = computeDate(nowdate.getFullYear(), (nowdate.getMonth() + 1), nowdate.getDate(), 30);

	if (jQuery(banner_selecter)[0]){

		jQuery(banner_btn_selecter).click(function(){
			var nowdt = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate();
			SetCookie('banner', nowdt, 365);
			jQuery(banner_selecter).remove();
		});

		var banner = GetCookie('banner');
		if (banner){
			var bnrary = banner.split('-');
			var dt30 = computeDate(bnrary[0], bnrary[1], bnrary[2], 30);
			if (nowdate < dt30){
				jQuery(banner_selecter).remove();
			}else{
				SetCookie('banner', '', 365);
				banner = '';
			}
			// console.log('nowdate:' + nowdate + '< dt30:' + dt30);
		}

		// if (!banner) console.log("バナーを表示");
	}
}