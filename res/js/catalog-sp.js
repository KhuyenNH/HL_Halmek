/* ------- 初期設定 ------- */
var argv      = GetScriptParams(); //[FIXME]これ動いてないですよ
var mode      = argv["mode"]; //'local';

var nowdate   = new Date();
var viewflag;
var setdate;
var date30;
var win_width = window.innerWidth;

/* ------- クッキー取得 ------- */
if (GetCookie('data')){
	var cookies = GetCookie('data').split(',');
	viewflag = cookies[0];
	setdate  = cookies[1];	
}

/* ------- 振り分け ------- */
if (viewflag == "PC"){

	document.write('<link rel="stylesheet" href="/res/css/pc.css" />');

}else{

	var ua = navigator.userAgent;

	if (ua.indexOf('iPhone') != -1) {

		viewflag = "iPhone";
		document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">');
		document.write('<meta name="format-detection" content="telephone=no" />');
		document.write('<link rel="stylesheet" media="screen and (min-width: 768px)" href="/res/css/mobile.css" />');
		document.write('<link rel="stylesheet" media="screen and (max-width: 767px)" href="/res/css/mobile.css" />');

	}else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){

		viewflag = "Android";
		document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">');
		document.write('<meta name="format-detection" content="telephone=no" />');
		document.write('<link rel="stylesheet" media="screen and (min-width: 768px)" href="/res/css/mobile.css" />');
		document.write('<link rel="stylesheet" media="screen and (max-width: 767px)" href="/res/css/mobile.css" />');

	}else if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || ua.indexOf('A1_07') > 0 || ua.indexOf('SC-01C') > 0 ){
		
		viewflag = "Android tablet";
		document.write('<meta name="viewport" content="width=1080px,user-scalable=yes">');
		document.write('<link rel="stylesheet" media="screen and (min-width: 768px)" href="/res/css/pc.css" />');
		document.write('<link rel="stylesheet" media="screen and (max-width: 767px)" href="/res/css/mobile.css" />');
		document.write('<link rel="stylesheet" href="/res/css/subset.css" />');

	}else if(ua.indexOf('iPad') != -1){
		
		viewflag = "iPad";
		document.write('<meta name="viewport" content="width=1080px,user-scalable=yes">');
		document.write('<link rel="stylesheet" media="screen and (min-width: 768px)" href="/res/css/pc.css" />');
		document.write('<link rel="stylesheet" media="screen and (max-width: 767px)" href="/res/css/mobile.css" />');
		document.write('<link rel="stylesheet" href="/res/css/subset.css" />');

	}else {

		viewflag = "defult";
		document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0",user-scalable = no>');
		document.write('<link rel="stylesheet" media="all" href="/res/css/pc.css" />');
		document.write('<link rel="stylesheet" media="screen and (min-width: 768px)" href="/res/css/pc.css" />');
		document.write('<link rel="stylesheet" media="screen and (max-width: 767px)" href="/res/css/mobile.css" />');
		document.write('<link rel="stylesheet" href="/res/css/subset.css" />');
	}

}

/* ------- JS読み込み ------- */
var win_width = window.innerWidth;
var confjs_mode = "";
if (mode) confjs_mode = "?mode=" + mode;

if (win_width < 767){
	document.write('<script type="text/javascript" src="/res/js/lib/libs.minsp.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/lib/taffy-r2.min.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/Conf.js' + confjs_mode + '"></script>');
	document.write('<script type="text/javascript" src="/res/js/View.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/View.catalog.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/Init.js"></script>');

}else{
	document.write('<script type="text/javascript" src="/res/js/lib/libs.min.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/lib/json2.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/lib/taffy-r2.min.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/Conf.js' + confjs_mode + '"></script>');
	document.write('<script type="text/javascript" src="/res/js/View.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/View.catalog.js"></script>');
	document.write('<script type="text/javascript" src="/res/js/Init.js"></script>');
}

/* ------- 読み込み後、表示切り替え ------- */
jQuery(function(){

	if (setdate){
		var tmpary = setdate.split('-');
		date30 = computeDate(tmpary[0], tmpary[1], tmpary[2], 30);
	}

	if (viewflag == "defult" || viewflag == "Android tablet" || viewflag == "iPad"){
		// PCとタブレット
		jQuery("#change_view_top").css("display", "none");
		jQuery("#change_view_top_sp").css("display", "none");
		window.onresize = window_load;	//レスポンシブを稼働

	}else if (viewflag == "PC"){
		// スマホでPC版を見ている状態
		jQuery("#change_view_top_sp").css("display", "none");
		if (date30 && nowdate < date30) jQuery("#change_view_top").css("display", "none");
	
	}else{
		// スマホ
		jQuery("#change_view_top").css("display", "none");
		if (date30 && nowdate < date30) jQuery("#change_view_top_sp").css("display", "none");
	}
	
	jQuery("html,body").animate({scrollTop:jQuery("#wrap-body")}, 400, "swing");
});

/* ------- 表示切り替えバナーによる処理 ------- */
function change_view(site){
	var dt = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate();
	
	if (site == "PC"){
		// ▼スマホ版からPC版に表示切り替え
		SetCookie('data', 'PC,', 365);
		window.location.reload();

	}else if (site == "close"){
		// ▼「X」が押されたら表示切り替えバナーを消す
		if (viewflag == "PC"){
			jQuery("#change_view_top").css("display", "none");
			SetCookie('data', viewflag + ',' + dt, 365);
		}else{
			jQuery("#change_view_top_sp").css("display", "none");
			jQuery("#topbar + #shopNav_wrapper_sp").css("padding-top", "95px");
			SetCookie('data', ',' + dt, 365);
		}

	}else{
		//  ▼PC版からスマホ版に表示切り替え
		SetCookie('data', ',', 365);
		window.location.reload();
	}
}

/* ------- SetCookie ------- */
function SetCookie(name, val, expires){
	var expire = new Date();
	expire.setTime( expire.getTime() + 1000 * 3600 * (24 * expires) );
	var cookie_value = name + '=' + encodeURIComponent(val) + ';path=/; expires=' + expire.toUTCString();
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
var minjs    = '/res/js/lib/libs.min.js';
var minspjs  = '/res/js/lib/libs.minsp.js';
var win_flag = "minjs";

function window_load() {
	var win_width = window.innerWidth;

	if (win_width < 767){
	
		// ▼768以下（スマホ）
		if (win_flag == "minjs"){
			win_flag = "minspjs";
			//jQuery.getScript(minspjs);
			if (viewflag == "PC"){
				//console.log("[768以下 PC] CSS : viewflag = " + viewflag);
				jQuery("#change_view_top_sp").css("display", "none");
				jQuery("#forSp").css("display", "none");
				jQuery("#copyrights_sp .forpc-btn").css("display", "none");
				jQuery(".select-wrap select").css("display", "block");
				jQuery(".catalog-spec-item select.select_menu").css("display", "block");

			} else{
				//console.log("[768以下 SP] CSS : viewflag = " + viewflag);
				jQuery(".select-wrap select").css("display", "block");
				jQuery(".catalog-spec-item select.select_menu").css("display", "block");
			}
		}
		
	}else{
		// ▼768以上（PC）
		if (win_flag == "minspjs"){
			win_flag = "minjs";
			//jQuery.getScript(minjs);
			//console.log("[768以上] CSS : viewflag = " + viewflag);
			jQuery(".select-wrap select").css("display", "none");
			jQuery(".catalog-spec-item select.select_menu").css("display", "none");
			jQuery(".catalog-spec-item select").css("display", "none");
			jQuery("#catalogTable tbody tr td select").hide();
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
jQuery(function(){
	jQuery('.pagelink >a[href^=#]').click(function(){
		var speed = 400;
		var href= jQuery(this).attr("href");
		var target = jQuery(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		jQuery("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	});
});

/* ------- クリック処理 ------- */
jQuery(function(){
	//ページ内リンクの設定
	jQuery('button').click(function(){
		jQuery(this).addClass("hover");
	});
});

jQuery(document).ready(function(){
	jQuery(".newtgl").click(function () {
		jQuery("#enterAddress2_sp").slideToggle();
	});
});

/* ------- JSの引数取得 ------- */
function GetScriptParams(){
	var scripts = document.getElementsByTagName( 'script' );
	var src = scripts[ scripts.length - 1 ].src;

	var query = src.substring( src.indexOf( '?' ) + 1 );
	var parameters = query.split( '&' );

	var result = new Object();
	for( var i = 0; i < parameters.length; i++ ){
		var element = parameters[ i ].split( '=' );
		var paramName = escape_html(decodeURIComponent(element[0]));
        var paramValue = escape_html(decodeURIComponent(element[1]));
		result[ paramName ] = paramValue;
	}

	return result;
}

function escape_html(val){
	if (val){
		return val.replace( /&/g, "&amp;" )
		.replace( /</g, "&lt;" )
		.replace( />/g, "&gt;" )
		.replace( /"/g, "&quot;" )
		.replace( /'/g, "&#x27;" );
    }
}
