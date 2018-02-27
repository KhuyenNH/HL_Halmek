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
			}else{
				jQuery(function(){
					jQuery("#sideNav").appendTo( "#naviBottom" );
				});
			}
		}, 200);
	});
};

//セレクトセット アコーディン処理
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
				if (!get_spflag() && 767 < win_width){
				jQuery("#selectset .flow_navi h1").removeClass("slideH2");
				jQuery("#selectset .flow_navi h1").removeClass("opened");
				jQuery("#selectset .flow_navi ul").css("display","block");
			} else {
				jQuery("#guidePage .clm2-guide .page-body section h2").addClass("slideH2");
				jQuery("#selectset .flow_navi h1").removeClass("opened");
				jQuery("#selectset .flow_navi ul").css("display","none");

				}
				win_width_tmp = win_width;
			}, 200);
		}
	});
	jQuery('#selectset .flow_navi h1').on('click', function() {
		if (get_spflag() || win_width < 767){
			jQuery(this).toggleClass('opened');
			jQuery(this).next('ul').slideToggle(100, 'swing');
		}
	});
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

View.hashchangePage = function(e){
};