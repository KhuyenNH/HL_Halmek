View.initPage = function(){
	// IE8チェック
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	//View.ranking.js、View.selectset.js、View.itemList.js、script.js(2周年キャンペーン)で同様の設定
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		jQuery(function(){
			jQuery("#sideNav").appendTo( "#naviTop" );
		});
		//スマホ表示：4位から10位のタッチイベント用class追加
		//jQuery('ul.item-box-list li').addClass('rkg');
		//jQuery('ul.item-box-list li').css('cursor','pointer');
	}else{
		jQuery(function(){
			jQuery("#sideNav").appendTo( "#naviBottom" );
		});
	}

//スマホ表示：4位から10位のリンク処理
	jQuery(function(){
		jQuery('ul.item-box-list li').click(function(){
			win_width = window.innerWidth;
			if ((viewflag == "defult" && win_width < 767) || viewflag == "Android" || viewflag == "iPhone"){
				location.href = jQuery(this).find("a").attr('href');
			}
		});
	});

//左メニュの制御
	jQuery(function(){
		var url   = location.href;
        parameters  = url.split("?");
        if(parameters.length == 1){
            jQuery("#ranking0").addClass("active");
            jQuery("#ranking1").removeClass("active");
            jQuery("#ranking2").removeClass("active");
            jQuery("#ranking3").removeClass("active");
            return;
        }
        params   = parameters[1].split("&");
        var paramsArray = [];
        for ( i = 0; i < params.length; i++ ) {
            neet = params[i].split("=");
            paramsArray.push(neet[0]);
            paramsArray[neet[0]] = neet[1];
        }
        var rankingKey = paramsArray["ranking"];
        
        switch (paramsArray["ranking"]){
        	case "1":
        		jQuery("#ranking0").removeClass("active");
        		jQuery("#ranking1").addClass("active");
        		jQuery("#ranking2").removeClass("active");
        		jQuery("#ranking3").removeClass("active");
        		break;
        	case "2":
        		jQuery("#ranking0").removeClass("active");
        		jQuery("#ranking1").removeClass("active");
        		jQuery("#ranking2").addClass("active");
        		jQuery("#ranking3").removeClass("active");
        		break;
        	case "3":
        		jQuery("#ranking0").removeClass("active");
        		jQuery("#ranking1").removeClass("active");
        		jQuery("#ranking2").removeClass("active");
        		jQuery("#ranking3").addClass("active");
        		break;
        	default:
        		jQuery("#ranking0").addClass("active");
        		jQuery("#ranking1").removeClass("active");
        		jQuery("#ranking2").removeClass("active");
        		jQuery("#ranking3").removeClass("active");
        		break;
        }
	});

//スマホ表示：4位から10位のマウスポインタ
	jQuery(function(){
		if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
			jQuery('ul.item-box-list li').css('cursor','auto');
		}else{
			jQuery('ul.item-box-list li').css('cursor','pointer');
		}
	});

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
					//スマホ表示：4位から10位のタッチイベント用class追加
					//jQuery('ul.item-box-list li').addClass('rkg');
					jQuery('ul.item-box-list li').css('cursor','auto');

				});
			}else{
				jQuery(function(){
					jQuery("#sideNav").appendTo( "#naviBottom" );
					//スマホ表示：4位から10位のタッチイベント用classs削除
					//jQuery('ul.item-box-list li').removeClass('rkg');
					jQuery('ul.item-box-list li').css('cursor','pointer');
				});
			}
		}, 400);
	});
/*
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
*/
};

//スマホ表示：位から10位のタッチイベント
var linkTouchStart = function(){
	jQuery(this).css('background-color','#E7A06A');
	setTimeout(moveCheck,50);
}
var linkTouchEnd = function(){
	jQuery(this).css('background-color','#fff');
	setTimeout(hoverRemove,50);
}

jQuery(document).on('touchstart mousedown','.rkg',linkTouchStart);
jQuery(document).on('touchend mouseup','.rkg',linkTouchEnd);

//スマホ表示：4位から10位のリンク処理
/*
jQuery(function(){
	jQuery('ul.item-box-list li').click(function(){
		if ((viewflag == "defult" && win_width  < 767 ) || viewflag == "iPhone" || viewflag == "Android"){
			location.href = jQuery(this).find("a").attr('href');
		}
	});
});

*/
	//スマホ表示：タッチイベント用class追加
	(function () {
		var tapClass = "";
		var hoverClass = "";

		var Hover = window.Hover = function (ele) {
			return new Hover.fn.init(ele);
		};
		Hover.fn = {
			//Hover Instance
			init : function (ele) {
				this.prop = ele;
			}
 
			, bind : function (_hoverClass, _tapClass) {
				hoverClass = _hoverClass;
				tapClass = _tapClass;
 
				jQuery(window).bind("touchstart", function(event) {
					var target = event.target || window.target;
				
					var bindElement = null;
					if (target.tagName == "li" || jQuery(target).hasClass(tapClass)) {
						bindElement = jQuery(target);
					} else if (jQuery(target).parents("li").length > 0) {
						bindElement = jQuery(target).parents("li");
					} else if (jQuery(target).parents("." + tapClass).length > 0) {
						bindElement = jQuery(target).parents("." + tapClass);
					}
				
					if (bindElement != null) {
						Hover().touchstartHoverElement(bindElement);
					}
				});
			}
			, touchstartHoverElement : function (bindElement) {
				bindElement.addClass(hoverClass);
				bindElement.unbind("touchmove", Hover().touchmoveHoverElement);
				bindElement.bind("touchmove", Hover().touchmoveHoverElement);
			
				bindElement.unbind("touchend", Hover().touchendHoverElement);
				bindElement.bind("touchend", Hover().touchendHoverElement);
			}
			, touchmoveHoverElement : function (event) {
				jQuery(this).removeClass(hoverClass);
			}
			, touchendHoverElement : function (event) {
				jQuery(this).removeClass(hoverClass);
			}
		}
		Hover.fn.init.prototype = Hover.fn;
 
	Hover().bind("hover", "li");
}
)();
View.hashchangePage = function(e){
};
