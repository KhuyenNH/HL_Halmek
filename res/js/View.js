//テンプレートから読み込まれるアコーディオンメニューの
//エスケープ処理
var domflag;
var escapeflag;
jQuery.event.add(window, ("onpageshow" in window && window.onpageshow === null) ? "pageshow" : "load", function(){
	if (!domflag){
		domflag = 1;
	}else{
		escapeflag = 1;
	}
});

// 変数「viewflag」チェック
if (typeof(viewflag) == 'undefined') var viewflag;
	// IE8チェック
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";
/**
 * 表示関連、UIなどの拡張クラス
 */
;var View = {};
// View.initPage = function(){};

/**
 * ページ読み込み時に表示されるspinner.
 */
// !function($){
jQuery(function(){
	//page読み込み用spinner
	// View.$wrap.css('visibility','hidden');
	// View.bodyspinner = new SpinnerControler({top:150});
	//View.bodyspinner = new SpinnerControler({padding:24},jQuery('body'),true);
	//View.bodyspinner.setSize('M');
	//View.bodyspinner.show();
	//hideはView.initAllの最後に。
	jQuery("select[name=select_lower]").addClass("select_lower no-init");
	jQuery("select[name=select_upper]").addClass("select_upper no-init");
	jQuery("div.modal-body select[name=select_lower]").removeClass("no-init");
	jQuery("div.modal-body select[name=select_upper]").removeClass("no-init");
});//(window.jQuery);

//各ページの初期化待ち：通常はしない。ajaxで初期化前にjson等をとって来る必要があれば真に。
View.waitInitPage = 0;


/**
 * initAllのおわりに。
 * @return {[type]} [description]
 */
View.onInitAll = function(){
	//Spinnerを消す
	//View.bodyspinner && View.bodyspinner.hide();
	//隠していた要素を表示
	View.$wrap.addClass('show');
	//.errorがあるとき監視。スクロールとか。
	// View.$errors = jQuery('.wrap-body .error');
	View.errors = new View.ErrorObserver();
	//初期化終了フラグにも使うため。
	View.waitInitPage = 0;

	View.onShown();
};

//override専用（エラー表示も終えたラスト）
View.onShown = function(){};

/**
 * 汎用ViewのInit.パーツ読み込み完了時に即実行。
 */
View.initAll = function(){

	View.$w = jQuery(window);
	View.$body = jQuery('body');
	View.$wrap = jQuery('body > .wrap-body');
	View.$sideNav = jQuery('#sideNav');//サイドナビがある場合は処理しやすいように。

	//[FIXME] safari用ブラウザバック対策(mobilesafariはだめ。loadイベントをpageshowにしないといけない？)
	View.$w.on('unload',function(){});

	//firefox,macsafari用<label for="*" の挙動修正(:radio,:checkboxのcheckedイベント)
	if(jQuery.browser.mozilla || jQuery.browser.safari || (jQuery.browser.chrome && parseInt(jQuery.browser.version.split('.')[0]) >= 45)){
		jQuery(document).on('click', 'label[for]', function(e) {
			if(!(e.currentTarget === this && e.target.nodeName.toUpperCase() !== 'INPUT'))return;
			// console.log('through 1');
			if(!this.control || !this.control.type) return;
			// console.log('through 2');
			var ct = this.control.type.toLowerCase(),f=0;
			if(ct == 'radio'){
				f = 1;
			}else if(ct == 'checkbox'){
				if(document.getElementById("sns_fg_sp")){
					var chk03 = document.getElementById("sns_fg_sp").classList.contains("no-init");
				}
				if(document.getElementById("mag_ec_sp")){
					var chk04 = document.getElementById("mag_ec_sp").classList.contains("no-init");
				}
				if (chk03 != true || chk04 != true) {
					if(/iPhone OS/.test(navigator.userAgent)){
						//iOSのchrome判定はSafariより先に行う
						f = /CriOS/.test(navigator.userAgent) ? 2 :
						/Mobile.*Safari/.test(navigator.userAgent) ? 1 : 0;
					}
				}
			}
			// jQuery(this.control)
			// .off('change.trace150914')
			// .on('change.trace150914', function(){jQuery(this).parent().parent().prepend(jQuery(this).attr('checked')+'<br>')});
			if(f) jQuery(this.control).trigger(f == 2 ? 'touchend' : 'click');
		});
	}

	//PIE.js適用
	if(typeof PIE != 'undefined'){
		//[TODO] いまのところIE8のみ。 initの順番変えてもイベントが効かなくなったりとか。（バグは出ないようになるが）
		if(jQuery.browser.msie && /**/jQuery.browser.version > 7  && jQuery.browser.version < 9){
			//[!] 各css1行目のpie使用しているセレクタが変われば変更の必要あり。
			//[!] これからはpie使ったら追加していく方向で。130121
			jQuery('.pie, .btn, .rrect21, .mypage-nav, .rbadge18, .side-nav .head, .item-box-list li, .paging a, .text-section .rdrect, #buyBox .bb-footer .cart-body, .rh-block > header, .rh-block > .block-header, .crh-block > header, .crh-block > .block-header, .rh-block > .block-content, .crh-block > .block-content').each(function(){
				PIE.attach(this);
			});
		}
	}
	
	jQuery("select[name=select_lower] > option:not(option:first)").each(function(){
		var price = jQuery(this).text();
		price = separate(price);
		jQuery(this).text(price);
	});
	jQuery("select[name=select_upper] > option:not(option:first)").each(function(){
		var price = jQuery(this).text();
		price = separate(price);
		jQuery(this).text(price);
	});
	
	function separate(num){
		return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	}
	
	//set designed selectForm.(no-init以外)
	jQuery("select:not(.no-init)").selectbox({
		speed: Conf.selectOpenSpeed
		// ,onOpen:function(instance){
		// 	jQuery.log('selectbox open.',instance,this);
		// }
	});
	//set designed radio & checkbox.
	jQuery('input:radio:not(.no-init)').screwDefaultButtons({
		image: "url("+Conf.PATH.img+"form-radio36.png)"
		,width: 36
		,height: 36
	});
	jQuery('input:checkbox:not(.no-init)').screwDefaultButtons({
		image: "url("+Conf.PATH.img+"form-checkbox36.png)"
		,width: 36
		,height: 36
	});

	//特集ブロックををタイリング
	jQuery('#topicsLauncher').freetile({
		animate: false
  });

	/**
	 * サイドナビにつける.active
	 */
	if(View.$sideNav.length){
		var floc = ReqUtil.removeParamsAll(ReqUtil.getFullPath(location.href));
		jQuery('ul>li',View.$sideNav).each(jQuery.proxy(function(i,o){
			var $li = jQuery(o);
			var $a = jQuery('a',$li).eq(0);
			var lnk = ReqUtil.removeParamsAll(ReqUtil.getFullPath($a.attr('href')));
			// jQuery.log(lnk,floc);
			if(floc == lnk){
				//仮：$li.addClass('active');
				return false; //一個目にみつかったやつしかつけない。
			}
		},this));
	}

	//itemlistの同じ行にあiる要素の高さ揃え(画像が入ってから？img指定しても良い？>cssで固定。
	// jQuery(".item-list.size-S.clm4 .item .detail").tile(4);
	jQuery(".item-list.size-S.clm4 .item .badges").tile(4);
	jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);}); //top,ranking.
	//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //一覧
	var heightrank =  jQuery('li > .rank').height(); //top,ranking.
	jQuery('li > .rank').css("height",heightrank); //top,ranking.
	jQuery('li > .rank').css("display","block"); //top,ranking.
	//(>)リスト系
	jQuery(".arrow-list.column-size2").each(function(){jQuery('> li',jQuery(this)).tile(2);});
	jQuery(".arrow-list.column-size3").each(function(){jQuery('> li',jQuery(this)).tile(3);});
	jQuery(".arrow-list.column-size4").each(function(){jQuery('> li',jQuery(this)).tile(4);});


	jQuery(function(){
		var win_width = window.innerWidth;
		if (!win_width) win_width = document.body.clientWidth;
		if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
			// カテゴリList、高さ揃え
			jQuery(".arrow-list.column-size2").each(function(){jQuery('> li',jQuery(this)).tile(2);});
			jQuery(".arrow-list.column-size3").each(function(){jQuery('> li',jQuery(this)).tile(3);});
			jQuery(".arrow-list.column-size4").each(function(){jQuery('> li',jQuery(this)).tile(4);});
			jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);}); //top,ranking.
				//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //一覧
			var heightrank =  jQuery('li > .rank').height(); //top,ranking.
			jQuery('li > .rank').css("height","42px"); //top,ranking.
			jQuery('li > .rank').css("display","block"); //top,ranking.
		}else{
			jQuery(".item-list.size-S.clm4 .item .badges").tile(2);
			jQuery('li > .rank').css("height","58px"); //top,ranking.
			jQuery('li > .rank').css("display","block"); //top,ranking.
		}

		var timer = false;
		jQuery(window).resize(function() {
			var win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				var win_width = window.innerWidth;
				if (!win_width) win_width = document.body.clientWidth;
				jQuery(".arrow-list.column-size2").each(function(){jQuery('> li',jQuery(this)).tile(2);});
				jQuery(".arrow-list.column-size3").each(function(){jQuery('> li',jQuery(this)).tile(3);});
				jQuery(".arrow-list.column-size4").each(function(){jQuery('> li',jQuery(this)).tile(4);});
				if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
					jQuery('.item-list .item .detail').attr('style');
					jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);}); //top,ranking.
					//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //一覧
					var heightrank =  jQuery('li > .rank').height(); //top,ranking.
					jQuery('li > .rank').css("height","42px"); //top,ranking.
					jQuery('li > .rank').css("display","block"); //top,ranking.
				} else{
					jQuery('.item-list .item .detail').removeAttr('style');
					jQuery('li > .rank').css("height","58px"); //top,ranking.
					jQuery('li > .rank').css("display","block"); //top,ranking.
				}

			}, 200);
		});
	});


jQuery(function(){
	var flow7Height = jQuery('.flow-nav.flow-7.showSp').height();
	var win_width = window.innerWidth;
	//var flowWidth = jQuery(".flow-nav.flow-7").width();
	if (28 < flow7Height){
				jQuery('.flow-nav.flow-7.showSp ol').css('margin-bottom','2px');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('float','right');
				jQuery('.flow-nav.flow-7.showSp').css('background','#F2EEEA');
				jQuery('.flow-nav.flow-7.fin.showSp').removeClass('fin');
				jQuery('.flow-nav.flow-7.fin.showSp').css('background','#4B1E00');
//	} else if (flow7Height > 52 && !get_spflag()) {
	} else {
				jQuery('.flow-nav.flow-7.showSp ol').css('margin-bottom','0');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('float','left');
				jQuery('.flow-nav.flow-7.showSp').css('background','#D2C7BF');
				jQuery('.flow-nav.flow-7.showSp ol').css('border-bottom','none');
				jQuery('.flow-nav.flow-7.showSp ol').css('border-top','none');
				jQuery('.flow-nav.flow-7.fin.showSp').addClass('fined');
				jQuery('.flow-nav.flow-7.fin.showSp.fined').css('background','#4B1E00');
	}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
	var flow7Height = jQuery('.flow-nav.flow-7.showSp').height();
			var win_width = window.innerWidth;
			var flowWidth = jQuery(".flow-nav.flow-7").width();
	if (28 < flow7Height){
				jQuery('.flow-nav.flow-7.showSp ol').css('margin-bottom','2px');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('float','right');
				jQuery('.flow-nav.flow-7.showSp').css('background','#F2EEEA');
				jQuery('.flow-nav.flow-7.fin.showSp').removeClass('fin');
				jQuery('.flow-nav.flow-7.fin.showSp').css('background','#4B1E00');
//	} else if (flow7Height > 52 && !get_spflag()) {
	} else {
				jQuery('.flow-nav.flow-7.showSp ol').css('margin-bottom','0px');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-nav.flow-7.showSp ol + ol').css('float','left');
				jQuery('.flow-nav.flow-7.showSp').css('background','#D2C7BF');
				jQuery('.flow-nav.flow-7.showSp ol').css('border-bottom','none');
				jQuery('.flow-nav.flow-7.showSp ol').css('border-top','none');
				jQuery('.flow-nav.flow-7.fin.showSp').addClass('fined');
				jQuery('.flow-nav.flow-7.fin.showSp.fined').css('background','#4B1E00');
			}
		}, 200);
	});
});


jQuery(function(){
	var flow5Height = jQuery('.flow-navs.flow-5.showSp').height();
	var win_width = window.innerWidth;
	//var flowWidth = jQuery(".flow-navs.flow-5").width();
	if (28 < flow5Height){
				jQuery('.flow-navs.flow-5.showSp ol').css('margin-bottom','2px');
				jQuery('.flow-navs.flow-5.showSp ol').css('border','none');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('float','right');
				jQuery('.flow-navs.flow-5.showSp').css('background','#F2EEEA');
				jQuery('.flow-navs.flow-5.fin.showSp').removeClass('fin');
				jQuery('.flow-navs.flow-5.fin.showSp').css('background','#4B1E00');
//	} else if (flow7Height > 52 && !get_spflag()) {
	} else {
				jQuery('.flow-navs.flow-5.showSp ol').css('margin-bottom','0');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('float','left');
				jQuery('.flow-navs.flow-5.showSp').css('background','#D2C7BF');
				jQuery('.flow-navs.flow-5.showSp ol').css('border-bottom','none');
				jQuery('.flow-navs.flow-5.showSp ol').css('border-top','none');
				jQuery('.flow-navs.flow-5.fin.showSp').addClass('fined');
				jQuery('.flow-navs.flow-5.fin.showSp.fined').css('background','#4B1E00');
	}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
	var flow5Height = jQuery('.flow-navs.flow-5.showSp').height();
			var win_width = window.innerWidth;
			var flowWidth = jQuery(".flow-navs.flow-57").width();
	if (28 < flow5Height){
				jQuery('.flow-navs.flow-5.showSp ol').css('margin-bottom','2px');
				jQuery('.flow-navs.flow-5.showSp ol').css('border','none');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('float','right');
				jQuery('.flow-navs.flow-5.showSp').css('background','#F2EEEA');
				jQuery('.flow-navs.flow-5.fin.showSp').removeClass('fin');
				jQuery('.flow-navs.flow-5.fin.showSp').css('background','#4B1E00');
//	} else if (flow7Height > 52 && !get_spflag()) {
	} else {
				jQuery('.flow-navs.flow-5.showSp ol').css('margin-bottom','0px');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('margin-bottom','0');
				jQuery('.flow-navs.flow-5.showSp ol + ol').css('float','left');
				jQuery('.flow-navs.flow-5.showSp').css('background','#D2C7BF');
				jQuery('.flow-navs.flow-5.showSp ol').css('border-bottom','none');
				jQuery('.flow-navs.flow-5.showSp ol').css('border-top','none');
				jQuery('.flow-navs.flow-5.fin.showSp').addClass('fined');
				jQuery('.flow-navs.flow-5.fin.showSp.fined').css('background','#4B1E00');
			}
		}, 200);
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

/*
var linkTouchStart = function(){
	thisAnchor = jQuery(this);
	touchPos = thisAnchor.offset().top;
	moveCheck = function(){
	nowPos = thisAnchor.offset().top;
		if(touchPos == nowPos){
			thisAnchor.addClass("hover");
		}
	}
	setTimeout(moveCheck,50);
}
var linkTouchEnd = function(e){
	thisAnchor = jQuery(this);
	hoverRemove = function(){
		thisAnchor.removeClass("hover");
		preventDefault();
	}
	setTimeout(hoverRemove,50);
}

jQuery(document).on('touchstart mousedown','a',linkTouchStart);
jQuery(document).on('touchend mouseup','a',linkTouchEnd);
*/
	//スマホ表示：タッチイベント用class追加
	/*
	jQuery("a").on('mousedown', function(e){
		thisAnchor = jQuery(this);
		touchPos = thisAnchor.offset().top;
		moveCheck = function(){
			nowPos = thisAnchor.offset().top;
			if(touchPos == nowPos){
				thisAnchor.addClass("hover");
			}
		}
		setTimeout(moveCheck,50);
	});
	//スマホ表示：タッチイベント用class削除
	jQuery("a").on('mouseup', function(e){
		thisAnchor = jQuery(this);
		e.preventDefault();
					e.preventDefault();
		hoverRemove = function(){
			thisAnchor.removeClass("hover");

		}
		setTimeout(hoverRemove,50);
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
					if (target.tagName == "A" || jQuery(target).hasClass(tapClass)) {
						bindElement = jQuery(target);
					} else if (jQuery(target).parents("a").length > 0) {
						bindElement = jQuery(target).parents("a");
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

	Hover().bind("hover", "a");
}
)();

	//サイドナビゲーションがあるとき、右カラムと高さを揃える。
	// jQuery(".clm2-snav > .side-nav, .clm2-snav > .section-content").tile();
	// jQuery(".clm2-guide > .side-nav, .clm2-guide > .section-content").tile();
	var $sn1 = jQuery(".clm2-snav");
	//静的ページのサイドナビ設定を定義
	var $sn2 = jQuery("#anniversary .clm2-snav");
	$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
	jQuery(".clm2-guide").each(function(){jQuery('> .side-nav, > .section-content',jQuery(this)).tile();});
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		// Sp用右カラム高さ揃える
		var $sn1 = jQuery(".clm2-snav");
		$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
		jQuery(".clm2-guide").each(function(){jQuery('> .side-nav, > .section-content',jQuery(this)).tile();});
	}

jQuery(function(){
	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			win_width = window.innerWidth;
			var $sn1 = jQuery(".clm2-snav");
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				// Sp用右カラム高さ揃える
				$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
				jQuery(".clm2-guide").each(function(){jQuery('> .side-nav, > .section-content',jQuery(this)).tile();});
			} else {
				$sn1.each(function(){jQuery('> #naviBottom .side-nav, > .section-content',jQuery(this)).removeAttr('style');});
				jQuery('.clm2-guide .section-content').removeAttr('style');
				jQuery('#naviBottom .side-nav').removeAttr('style');
			}
		}, 400);
	});
});

	//[140919調整]サイドナビにバナーがある場合、画像が準備できたらもいっかい
	// jQuery.log($sn1.height());
	var $bnrImgs = jQuery(".img-bnr img",$sn1), bnrImgLoaded = 0;
	$bnrImgs.each(jQuery.proxy(function(i,o){
		jQuery(o).on('load', jQuery.proxy(function(e){
			bnrImgLoaded++;
			if($bnrImgs.length != bnrImgLoaded) return;
			jQuery.log('サイドナビのバナー画像準備完了！');
			// jQuery.log($sn1.height());
			$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
			//静的ページのサイドナビとコンテンツの高さを揃える
			$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).tile();});
		},this));
	},this));

	//sp対応
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		// Sp用右カラム高さ揃える
		var $bnrImgs = jQuery(".img-bnr img",$sn1), bnrImgLoaded = 0;
		$bnrImgs.each(jQuery.proxy(function(i,o){
			jQuery(o).on('load', jQuery.proxy(function(e){
				bnrImgLoaded++;
				if($bnrImgs.length != bnrImgLoaded) return;
				jQuery.log('サイドナビのバナー画像準備完了！');
				// jQuery.log($sn1.height());
				$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
				//静的ページのサイドナビとコンテンツの高さを揃える
				$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).tile();});
			},this));
		},this));
	}


	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			var $sn1 = jQuery(".clm2-snav");
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				// Sp用右カラム高さ揃える
					var naviHeighttop = jQuery('.section-content').height();
						jQuery('#naviTop .side-nav').css("height",naviHeighttop);
						$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
						//静的ページのサイドナビとコンテンツの高さを揃える
						$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).tile();});
			} else {
				$sn1.each(function(){jQuery('> #naviBottom .side-nav, > .section-content',jQuery(this)).removeAttr('style');});
				//静的ページのサイドナビとコンテンツの高さをそれぞれの高さに設定するためにstyleを削除
				$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).removeAttr('style');});
				var naviHeightbottom = jQuery('#naviBottom .side-nav').height();
				jQuery('#naviBottom .side-nav').css("height",naviHeightbottom);
			}
		}, 400);
	});

	//pagetopの挙動
	// var aScrollTop = new AnimScrollTop();
	jQuery('.pagetop > a').on('click',function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop().to();
		return false;
	});

	//電話
	jQuery(function() {
		if (!isPhone())
		return;
		jQuery('span[data-action=call]').each(function() {
			var $ele = jQuery(this);
			$ele.wrap('<a href="tel:' + $ele.data('tel') + '"></a>');
		});
	});

	function isPhone() {
		return (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0);
	}


	//ページ内リンクの設定
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

	jQuery(function() {
		jQuery('span[data-action=page]').each(function() {
			var $ele = jQuery(this);
			$ele.wrap('<a href="' + $ele.data('page') + '"></a>');
		});
	});

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				if (!escapeflag){
					jQuery('span[data-action=page]').each(function() {
						var $ele = jQuery(this);
						$ele.wrap('<a href="' + $ele.data('page') + '"></a>');
					});
				}
			} else{
				if (!escapeflag){
					jQuery('span[data-action=page]').each(function() {
						var $ele = jQuery(this);
						$ele.wrap('<a href="' + $ele.data('page') + '"></a>');
					});
				}
			}
		}, 400);
	});

	jQuery(window).load(function(){
		jQuery('span[data-action=page]').each(function() {
			var $ele = jQuery(this);
			$ele.wrap('<a href="' + $ele.data('page') + '"></a>');

		});
	});

	//css追加
	jQuery(function() {
		if (!escapeflag){
			jQuery('.sp-section-header h2.acc').on('click',function(){
				jQuery(this).toggleClass('opened');
			});
		}
	});

	jQuery('.total_price .itemadd_button').on('click',function(){
		jQuery(this).toggleClass('opened');
	});

	//アコーディオン
jQuery(function() {
    jQuery('span[data-action=slide]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('slide') + '"></a>');
    });
});

jQuery(function() {
    jQuery('span[data-action=slidebtn]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('slidebtn') + '"></a>');
    });
});



jQuery(function() {
    jQuery('span[data-action=slidebtn2]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('slidebtn2') + '"></a>');
    });
});

jQuery(function() {
    jQuery('span[data-action=slidebtn3]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('slidebtn3') + '"></a>');
    });
});

jQuery(function() {
    jQuery('span[data-action=slidebtn4]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('slidebtn4') + '"></a>');
    });
});

jQuery(function() {
    jQuery('span[data-action=closeBtn]').each(function() {
        var $ele = jQuery(this);
        $ele.wrap('<a href="' + $ele.data('closeBtn') + '"></a>');
    });
});


//テンプレート「かんたんショッピングガイド」
jQuery(function(){
	if (!escapeflag){
		jQuery(".guide_item h2").on("click", function() {
		jQuery(this).toggleClass("opened");
		jQuery(this).next('p').slideToggle(100, 'swing');
		});
	}
});

//テンプレート「商品を探す」
jQuery(function(){
	if (!escapeflag){
		jQuery("#slideBoxsearch_sp").css("display","none");
		jQuery(".slideBoxsearch").on("click", function() {
		jQuery("#slideBoxsearch_sp").slideToggle(100, 'swing');
		});
	}
});

//テンプレート「ご利用ガイド」
jQuery(function(){
	if (!escapeflag){
		jQuery("#slideBoxguide_sp").css("display","none");
		jQuery(".slideBoxguide").on("click", function() {
		jQuery("#slideBoxguide_sp").slideToggle(100, 'swing');
		});
	}
});

//cartt.html テンプレート「商品を探す」
//checkout_01.html 登録済みのお届け先一覧
jQuery(function(){
	//jQuery("#slideBox_sp").css("display","none");
	if (!escapeflag){
		jQuery("#slideBox_sp").hide;
		jQuery(".slidebtn").on("click", function() {
		jQuery("#slideBox_sp").slideToggle(100, 'swing');
		});
	}
});

//
jQuery(function(){
	jQuery("#slideBox0_sp").css("display","none");
	jQuery(".slidebtn0").on("click", function() {
	jQuery("#slideBox0_sp").slideToggle(100, 'swing');
	});
});

//
jQuery(function(){
	jQuery("#slideBox1_sp").css("display","none");
	jQuery(".slidebtn1").on("click", function() {
	jQuery("#slideBox1_sp").slideToggle(100, 'swing');
	});
});

//checkout_01.html その他の住所に送る
//checkout_m01.html その他の住所に送る
//cart.html 商品を追加する
jQuery(function(){
	//jQuery("#slideBox2_sp").css("display","none");
	//jQuery("#slideBox2_sp").hide();
	if (!escapeflag){
		jQuery("#itemadd_button_sp").css("display","none");
		jQuery(".slidebtn2, .itemadd_button").on("click", function() {
		jQuery("#slideBox2_sp, #itemadd_button_sp").slideToggle(100, 'swing');
		});
	}
});

//checkout_01.html 旧字・異体字の方へ
//checkout_m01.html 旧字・異体字の方へ
//item_catalog.html このページの使い方
jQuery(function(){
	//jQuery("#slideBox3_sp").css("display","none");
	if (!escapeflag){
		jQuery("#slideBox3_sp").hide;
		jQuery(".slidebtn3").on("click", function() {
		jQuery("#slideBox3_sp").slideToggle(100, 'swing');
		});
	}
});

//checkout_01.html 海外発送について
//checkout_m01.html 海外発送について
jQuery(function(){
	//jQuery("#slideBox4_sp").css("display","none");
	if (!escapeflag){
		jQuery("#slideBox4_sp").hide;
		jQuery(".slidebtn4").on("click", function() {
		jQuery("#slideBox4_sp").slideToggle(100, 'swing');
		});
	}
});

//
jQuery(function(){
	jQuery("#slideBox5_sp").css("display","none");
	jQuery(".slidebtn5").on("click", function() {
	jQuery("#slideBox5_sp").slideToggle(100, 'swing');
	});
});

//signup_02.html いきいきお客様番号とは？
jQuery(function(){
	jQuery("#membership_number_pc").hide;
	jQuery(".membership_numberPc").on("click", function() {
		jQuery("#membership_number_pc").slideToggle(100, 'swing');
	});
});
jQuery(function(){
	//jQuery("#membership_number_sp").css("display","none");
	if (!escapeflag){
		jQuery("#membership_number_sp").hide;
		jQuery(".membership_number").on("click", function() {
		jQuery("#membership_number_sp").slideToggle(100, 'swing');
		});
	}
});

//signup_02.html 個人情報保護方針
jQuery(function(){
	//jQuery("#privacy_policy").css("display","none");
	if (!escapeflag){
		jQuery("#privacy_policy").hide;
		jQuery(".privacy_policy").on("click", function() {
			jQuery("#membership_agreement").slideUp(100, 'swing');
			jQuery("#privacy_policy").slideToggle(100, 'swing');
		});
	}
});

//signup_02.html 個人情報保護方針
jQuery(function(){
	//jQuery("#privacy_policy2").css("display","none");
	if (!escapeflag){
		jQuery("#privacy_policy2").hide;
		jQuery(".privacy_policy2").on("click", function() {
			jQuery("#membership_agreement2").slideUp(100, 'swing');
			jQuery("#privacy_policy2").slideToggle(100, 'swing');
		});
	}
});


//signup_02.html 会員規約
jQuery(function(){
	//jQuery("#membership_agreement").css("display","none");
	if (!escapeflag){
		jQuery("#membership_agreement").hide;
		jQuery(".membership_agreement").on("click", function() {
			jQuery("#privacy_policy").slideUp(100, 'swing');
			jQuery("#membership_agreement").slideToggle(100, 'swing');
		});
	}
});

//signup_02.html 会員規約
jQuery(function(){
	//jQuery("#membership_agreement2").css("display","none");
	if (!escapeflag){
		jQuery("#membership_agreement2").hide;
		jQuery(".membership_agreement2").on("click", function() {
			jQuery("#privacy_policy2").slideUp(100, 'swing');
			jQuery("#membership_agreement2").slideToggle(100, 'swing');
		});
	}
});

jQuery(function(){
	jQuery(".hidden-menu a").on("click", function() {
	jQuery("#slideBoxsearch_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".hidden-menu span").on("click", function() {
	jQuery("#slideBoxsearch_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".closebtnsearch").on("click", function() {
	jQuery("#slideBoxsearch_sp, #itemadd_button_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".closebtnguide").on("click", function() {
	jQuery("#slideBoxguide_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".closebtn").on("click", function() {
	jQuery("#slideBox_sp").slideUp(100, 'swing');
	});
});


jQuery(function(){
	jQuery(".closebtn2").on("click", function() {
	jQuery("#slideBox2_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".closebtn3").on("click", function() {
	jQuery("#slideBox3_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".closebtn4").on("click", function() {
	jQuery("#slideBox4_sp").slideUp(100, 'swing');
	});
});


jQuery(function(){
	jQuery(".closebtn5").on("click", function() {
	jQuery("#slideBox5_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".mnclosebtn").on("click", function() {
	jQuery("#membership_number_sp").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".membershipclosebtn").on("click", function() {
	jQuery("#membership_agreement").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".membershipclosebtn2").on("click", function() {
	jQuery("#membership_agreement2").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".privacyclosebtn").on("click", function() {
	jQuery("#privacy_policy").slideUp(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".privacyclosebtn2").on("click", function() {
	jQuery("#privacy_policy2").slideUp(100, 'swing');
	});
});

	//SP用マイページメニュー高さ揃え
	jQuery(function(){
		var pnBodyList = jQuery(".mypage-nav .pn-body li").eq(2).height();
		jQuery(".mypage-nav .pn-body li a").tile();

		/*if(pnBodyList < 80){
			jQuery(".mypage-nav .pn-body li a").eq(0).css("line-height", (pnBodyList -14) + "px");
		}*/
	});

	jQuery(function(){
		jQuery("#merit_sp h3").tile();
	});

	jQuery(function(){
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	if (767 < win_width){
		//var pnBodyList = jQuery(".mypage-nav .pn-body li a").height();
		jQuery(".mypage-nav .pn-body li a").tile();
	}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			//var pnBodyList = jQuery(".mypage-nav .pn-body li a").height();
			jQuery(".mypage-nav .pn-body li a").tile();
		}, 200);
	});

	});

	//pagetop@modal用
	jQuery('.modal .pagetop > a').off('click');
	jQuery(document).on('click','.modal .pagetop', function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop(jQuery(e.target).closest('.modal-body')).to(0);
		return false;
	});

	//page内ナビ,.tabtopの挙動
	jQuery('.page-nav .pn-body a, .tabtop > a, .clm2-guide .side-nav .active .sub-list a, a.anchor').on('click',function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop().to(ReqUtil.getAnchor(jQuery(e.target).attr('href')));
		return false;
	});

	//page内ナビ@modal用
	jQuery('.modal a.anchor').off('click');
	jQuery(document).on('click','.modal a.anchor', function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop(jQuery(e.target).closest('.modal-body'))
			.to(ReqUtil.getAnchor(jQuery(e.target).attr('href')));
		return false;
	});



	/**
	 * tooltips
	 */
	//普通のtooltip
	jQuery('[rel=tooltip]').tooltip();
	View.$manualTooltips = jQuery('[rel=tooltip][data-trigger=manual]');
	View.$manualTooltips.each(function(i,o){
		var $o = jQuery(o);
		if($o.hasClass('show'))$o.tooltip("show");
	});
	//マウス追従型ツールチップ
	jQuery('[rel="fixed-tooltip"]').each(function(i,o){
		new FixedTooltip(jQuery(o));
	});

	/**
	 * modal関連初期化。
	 */
	View.modal = new MiscModal();
	View.reqmodal = new ReqModal();
	jQuery(document).on('click.reqmodal.data-api'
		,'[data-toggle="reqmodal"]'
		,function(e){
			View.reqmodal.calleeToggle(e,this);
	});

	//表示前に中央揃え
	jQuery(document).on('show','.modal',function(e){

		var counter = 1;


		var marginV = 0;
		var $m = jQuery(this);
		var md = $m.data('modal');
		var shown = md.isShown;
		var $mb = jQuery('.modal-body',$m);
		if(!shown) $m.show();
		$m.css({'top':'0%'});
		$mb.css({
			'max-height':'none'
			,'height':'auto'
		});
		var otherHeights = $m.outerHeight()-$mb.height();
		$mb.css('max-height',(View.wh-otherHeights+marginV));

		var timerId = setInterval(function(){
		$m.css({
			'top':'50%'
			,'margin-top':(-1*($m.outerHeight())/2)
		});
		if(counter >= 2){
			clearInterval(timerId);
		}
		counter++;
	}, 500);


		if(!shown) $m.hide();
	});


	/**
	 * tableに.odd,.evenをつける。
	 */
	View.setTableOddEven();

	/**
	 * リサイズ
	 */
	View.$w.bind('resize',View.windowResize_);
	View.$w.trigger('resize'); //一回やっとく。

	/**
	 * hashchangeイベントのバインド
	 */
	View.$w.bind("hashchange",View.hashchange_);


	//historyBack(form内のみ)
	View.initForm.formBack();

	/**
	 * miscForm([★] CSSのmisc-formクラス指定があるもののみ初期化。)
	 */
	jQuery('form.misc-form').each(function(i,o){
		// View.$body.prepend('misc-form'+i+'こめ<br>'+o.action)
		// try{
		var helper = new FormHelper(jQuery(o));
		var num_selector = '.num-input';

		if(helper.$alltexts.length){
			//num-inputはフィルタかける
			helper.addFilter(num_selector,FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
			helper.addFilter('.num-input-alpha',FormHelper.FILTER_TYPE.HALF_NUM_ALPHA,'remove');
			//空のチェック
			helper.attachEmptyCheck(function(empties){
				if(empties.length && empties[0] instanceof jQuery){
					empties[0].trigger('focus');
				}
			},true);
		}

		helper.setSelectedValues(); //selectedの初期値設定はdefaultValue設定前に！
		helper.setDefaults();
		// }catch(e){
		// 	jQuery.err('.misc-form の new FormHelper() でエラー',e)
		// }
	});


	/**
	 * 各ページのinitがあるとき実行
	 */
	View.initPage && View.initPage();

	/**
	 * location.hashがあるときはhashchange実行
	 */
	location.hash && View.$w.trigger("hashchange");

	if(!View.waitInitPage) View.onInitAll();

};//end initAll();


View.windowResize_ = function(){
	var ww = View.ww = View.$w.width();
	var wh = View.wh = View.$w.height();

	// //modal用縦センター揃えリサイズ
	// jQuery('.modal').each(jQuery.proxy(function(i,o){
	// 	var $m = jQuery(o);
	// 	// var otherHeight = jQuery('.modal-header,.modal-footer',$m).height();
	// 	var $mb = jQuery('.modal-body',$m);
	// 	$mb.css({
	// 		'max-height':'none'
	// 		,'height':'auto'
	// 	});
	// 	var otherHeights = $m.outerHeight()-$mb.height();
	// 	$mb.css('max-height',(wh-otherHeights-30));
	// 	$m.css('margin-top',(-1*($m.outerHeight())/2));
	// 	// jQuery.log($mb.css('max-height'),$m.css('margin-top'));
	// },this));
};

/**
 * 汎用ハッシュチェンジ時の受け皿
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
View.hashchange_ = function(e){
	jQuery.log('[EVENT] hash changed.',"location.hash =>",location.hash);

	//個別ページで設定しているhashchange関数を呼ぶ。
	if(typeof View.hashchangePage == 'function') View.hashchangePage(e);
};

/**
 * table.oddevenにクラスをつける。何回でも通しても大丈夫なように。
 */
View.setTableOddEven = function($t){
	if(!($t instanceof jQuery))$t = View.$body;
	jQuery('.oddeven tr',$t).removeClass('odd even');
	// jQuery('.oddeven tr:odd',$t).addClass('even');
	// head抜きをするために.oddeven毎にする。
	jQuery('.oddeven',$t).each(function(){
		// var $this = jQuery(this);
		//:evenがindexが偶数のものと一致するので逆に。
		// jQuery('tr:even',$this).addClass('odd');
		// jQuery('tr:odd',$this).addClass('even');
		var idx = 0;
		jQuery('tr',jQuery(this)).each(function(){
			var $_this = jQuery(this);
			//.headクラスが付いているtrは無視
			if($_this.hasClass('head'))return true;
			if(idx % 2 === 0){
				$_this.addClass('odd');
			}else{
				$_this.addClass('even');
			}
			idx+=1;
		});
	});
};

/**
 * セレクトボックス初期化用のobj
 * @type {Object}
 */
View.selectboxInitObj = {
	speed: Conf.selectOpenSpeed
	,onOpen:function(sb){//開き始めに、現在選択中のoptionをscrollTop()する
		var sv,$sbopt,$list,$li,$a
			,$select = jQuery(this)
			,$optsel = jQuery(':selected',$select)
			,$sbh = $select.next('div.sbHolder') //holder.
		;
		if($optsel.length){
			if($optsel.length>1) $optsel = $optsel[0];
			sv = $optsel.val(); //：selectedのvalを取得
			$sbopt = jQuery('.sbOptions',$sbh);
			//最初に上に戻しておく（2回連続で開いた時対策）
			$sbopt.scrollTop(0);
			// $list = jQuery('li',$sbopt);
			// maxh = 0;
			// $list.each(function(i,o){
			// 	maxh+=jQuery(o).height();
			// })
			$li = jQuery('li > a[rel="'+sv+'"]',$sbopt).parent();
			// jQuery.log($sbh,$li.position().top,$sbopt.height())//,maxh);
			var pt = ($li.length >= 1 && typeof $li.eq(0).position == 'function') ? $li.eq(0).position().top : 0;
			// li一個分一番上よりずらす（選択中の値より前がないように見えるため）
			$sbopt.scrollTop(pt - $li.height());
		}
	}
}

/**
 * 在庫表示のフィルタ
 * @type {Object}
 */
View.stockBadge = {
	html:{
		many:'<mark class="icon ico-ex badge-stock2">在庫あり</mark>'
		,less:'<mark class="icon ico-ex badge-stock1">残りわずか</mark>'
		,empty:'<mark class="icon ico-ex badge-stock0">在庫なし</mark>'
	}
	,get:function(stockcnt){
		// Conf.stockCnt.less
		if(stockcnt <= Conf.stockCnt.empty){
			return View.stockBadge.html.empty;
		}else if(stockcnt <= Conf.stockCnt.less){
			return View.stockBadge.html.less;
		}
		return View.stockBadge.html.many;
	}
};


/**
 * エラー監視用クラス
 * .errorが入ったりしたら、
 * 基本的にテーブル内？
 */
View.ErrorObserver = Class.extend({
	/**
	 * @param  {String} parentsSelector .errorを探す元。ない場合jQuery(document)
	 * @param  {Boolean} scrollEnables   最初に見つかったエラーにスクロールさせるか。:true
	 * @param  {[type]} tableMode       def:true テーブルじゃない場合はView.ErrorObserver.ATTR_WRAPPERを指定しておけばいいか。
	 * @return {[type]}                 [description]
	 */
	init:function(parentsSelector,scrollEnables){
		// this.$targets = [];
		this.parentsSelector = parentsSelector || '';
		this.$ = this.parentsSelector ? jQuery(this.parentsSelector) : jQuery(document);
		this.scrollEnables = typeof scrollEnables == 'undefined' ? true : false;
		// this.tableMode = typeof tableMode == 'undefined' ? true : false;
		this.targets = [];
		this.attach();
	}

	,kill:function(){
		this.detach();
		// delete this;
	}

	,reflesh:function(){
		this.kill();
		this.init();
	}

	/**
	 * ★htmlで検知しているので、全く同じ内容のhtmlが登録されている場合は挙動がおかしくなる恐れあり。
	 * @param  {[type]} $err [description]
	 * @return {[type]}      [description]
	 */
	,getTarget:function($err){
		if($err && $err.length){
			var ehtm = $err.outerHtml();
			for (var i = this.targets.length - 1; i >= 0; i--) {
				if(this.targets[i].$err.outerHtml() == ehtm) return this.targets[i];
			}
		};
		return false;
	}

	/**
	 * .errorに背景を追加してスクロール
	 * @param  {[type]} $err 明示的に指定されればそれのみ背景追加+スクロール？
	 * @param {Boolean} scrollEnables def:this.scrollEnables()>true
	 * @return {[type]}
	 */
	,attach:function($err,scrollEnables){
		scrollEnables = typeof scrollEnables == 'undefined' ? this.scrollEnables:false;
		var fT = [];
		if($err && $err.length){

			$err.each(jQuery.proxy(function(i,o){
				$e = jQuery(o);
				//指定あり
				var t = this.getTarget($e);
				if(!t){
					//登録されていない場合、新規登録
					t = new View.ErrorObserveTarget($e,this.targets.length);
					this.targets.push(t);
					fT.push(t);
				}else{
					jQuery.log('View.ErrorObserver::attach() 既に登録されているターゲットが渡されました。',this.targets,' $e:',$e);
				}
			},this));
		}else{
			//全部の.errorに。
			//全部追加前には一回kill?
			// this.detach();
			jQuery('.'+View.ErrorObserver.KLASS_ERROR,this.$).each(jQuery.proxy(function(i,o){
				this.targets.push(new View.ErrorObserveTarget(jQuery(o),i));
			},this));
			// if(this.targets.length>0) fT = this.targets[0];
			fT = this.targets;
		}
			//スクロールする？中身があるもので最初のやつに。（背景色変えた場合は背景の開始位置）
			if(scrollEnables){// && fT && fT.enabled){
				if (viewflag !== "PC" && window.innerWidth < 768){
					var ckstart = 0;
				}else{
					var ckstart = Math.floor(fT.length / 2);
				}

				for (var i = ckstart; i < fT.length; i++) {
					var t = fT[i];
					if(t.enabled){
						var scrollTarget = t.$wrapper.length ? t.$wrapper : t.$err;
						new AnimScrollTop().to(scrollTarget.offset().top);
						break;
					}
				}
			}
	}

	/**
	 * $errの指定オブジェクトがない場合は全て。
	 * @param  {[type]} $target [description]
	 * @return {[type]}         [description]
	 */
	,detach:function($err){
		if($err && $err.length){
			//指定あり
			$err.each(jQuery.proxy(function(i,o){
				var $e = jQuery(o);
				var t = this.getTarget($e);
				if(t){
					this.targets.splice(t.id,1);
					t.kill();
				}else{
					jQuery.err('View.ErrorObserver::detach() 指定されたターゲットがthis.targets[]から見つかりませんでした。this.targets:',this.targets,' $e:',$e);
				}
			},this));
		}else{
			for (var i = this.targets.length - 1; i >= 0; i--) {
				this.targets[i].kill();
			}
			this.targets = [];
		}
	}
});
View.ErrorObserver.EVT = {
	REMOVE:'View.ErrorObserver.remove'
};
View.ErrorObserver.ATTR_WRAPPER = 'data-error-wrapper';//ラッピング用
View.ErrorObserver.KLASS_ERROR = 'error';
View.ErrorObserver.KLASS_ERROR_BG = 'error-bg';
View.ErrorObserver.KLASS_HIDE = 'hide';
View.ErrorObserveTarget = Class.extend({
	init:function($err,id){
		var selector;
		this.$err = $err;
		this.id = id;
		selector = this.$err.attr(View.ErrorObserver.ATTR_WRAPPER) || '';
		this.text = jQuery.trim(this.$err.text());
		if(selector){
			//エラーを囲むセレクタが指定されている時
			this.$wrapper = jQuery(selector);
		}else{
			//セレクタ指定がないときは直近のtr
			if (viewflag !== "PC" && window.innerWidth < 768){
				// SPの場合
				if (jQuery('.checkout_form_wrapper').length){
					this.$wrapper = this.$err.closest('.checkout_form_wrapper');
				}else if (jQuery('.signup_form_wrapper').length){
					this.$wrapper = this.$err.closest('.signup_form_wrapper');
				}else if (jQuery('.delivery_form_wrapper').length){
					this.$wrapper = this.$err.closest('.delivery_form_wrapper');
					this.$wrapper = this.$err.closest('.table-style');
				}else if (jQuery('.table-area').length){
					this.$wrapper = this.$err.closest('.table-style');
				}else{
					this.$wrapper = this.$err.closest('.text-section-sp');
				}
			}else{
				this.$wrapper = this.$err.closest('tr');
			}
		}
		//中身があるときのみenabled.無いときは要素を隠す
		if(!this.text){
			this.enabled = false;
			this.$err.addClass(View.ErrorObserver.KLASS_HIDE);
		}else{
			this.$err.removeClass(View.ErrorObserver.KLASS_HIDE);
			if(this.$wrapper.length){
				// SPの場合
				if (viewflag !== "PC" && window.innerWidth < 768){
					if (jQuery('.addaccordion').length){
						jQuery("#slideBox2_sp").show();
						jQuery('.addaccordion').show();
					}else if (jQuery('.popmodal_sp').length){
						jQuery('.popmodal_sp').show();
						jQuery('.accordion_wrap').hide();
					}
				}
				this.$wrapper.addClass(View.ErrorObserver.KLASS_ERROR_BG);
			}
			this.enabled = true;
		}
		//動的に消されたらcssClass除去？
		// this.$err.on('delete',jQuery.proxy(function(e){this.$wrapper.removeClass('error-bg');},this));
	}
	,kill:function(){
		if(this.$wrapper.length){
			this.$wrapper.removeClass(View.ErrorObserver.KLASS_ERROR_BG);
		}
		this.enabled = false;
		this.$err.removeClass(View.ErrorObserver.KLASS_HIDE);
	}
});



/**
 * 汎用的にできるフォーム関連の初期化fncセット
 * @type {Object}
 */
View.initForm = {}
/**
 * 会員情報入力の初期化。
 * @param  {[type]} helper        FormHelper
 * @param  {[type]} noSetDefaults さいごにhelper.setDefaults()する？
 * @param  {[type]} isSp        mobileDevice用フラグ
 */
View.initForm.addresses = function(helper, noSetDefaults, isSp){
	var _sfx = isSp ? '_sp': '';

	//生年月日用
	helper.initDateSelects('#birthdayYearSelect'+_sfx,'#birthdayMonthSelect'+_sfx,'#birthdayDaySelect'+_sfx,'－',1900,new Date().getFullYear(),false,false);
	//40年前の年を選択（既に data-selected-value が入ってない時のみ）
	var $yearSelect = jQuery('#birthdayYearSelect'+_sfx);
	if(!$yearSelect.attr(helper.attr_selectedValue)){
		$yearSelect.attr(helper.attr_selectedValue, new Date().getFullYear()-Conf.defBirthdayYearSelectDiff)
	}


	//全角必須
	helper.addFilter('.htof-input',FormHelper.FILTER_TYPE.HALF_TO_FULL);

	//カナ
	helper.addFilter('.kana-input',FormHelper.FILTER_TYPE.FULL_KANA);

	//数値
	helper.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');

	//zipcode系
	// helper.addFilter('#zipCodeInput',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
	var $zip = jQuery('#zipCodeInput'+_sfx,helper.$)
	,$prefs_rep = jQuery('.prefs-replacement'+_sfx,helper.$)
	,$pref = jQuery('#prefHidden'+_sfx,helper.$)
	,$city = jQuery('#cityHidden'+_sfx,helper.$)
	,$addr1 = jQuery('#address1Input'+_sfx,helper.$)
	,$addr2 = jQuery('#address2Input'+_sfx,helper.$)
	,tmp_zip = ''
	,prefs_repDef = $prefs_rep.text()
	// ,allAddressInputsChangeFn = jQuery.proxy(function(){
	// 	jQuery.log('allAddressInputsChangeFn')
	// })
	,sidz = []
	,chkInputChange = function(){
		this.newVal = jQuery(this).val();
		if(typeof this.oldVal != 'undefined' && this.oldVal !== this.newVal){
			this.trigger('change');
			// jQuery.log('住所入力のうちどれかに変更があった。'+this.newVal);
		}
		this.oldVal = this.newVal;
	}
	,cityChangeFn = jQuery.proxy(function(){
		// jQuery.log('cityChangeFn')
		var pv = $pref.val()
			,cv = $city.val()
		;
		if(pv && cv){
			$prefs_rep
				.removeClass('off')
				.text(pv+" "+cv);
		}else{
			$prefs_rep
				.addClass('off')
				.text(prefs_repDef);
		}
	},this)
	;
	//市区町村input（置換用/隠してる）のonChange
	$city.on('change',cityChangeFn);
	//全てのzipに関係するaddrinput変更時
	// $pref.on('change',allAddressInputsChangeFn);
	// $city.on('change',allAddressInputsChangeFn);
	// $addr1.on('change',allAddressInputsChangeFn);
	// $addr2.on('change',allAddressInputsChangeFn);

	//hiddenFieldのchangeイベントチェックはintervalで回すしかないのかしら。
	$zip.on('focus',jQuery.proxy(function(){
		if(sidz.length){
			for (var i = sidz.length - 1; i >= 0; i--) {
				clearInterval(sidz[i]);
			};
			sidz = [];
		}
		sidz.push(setInterval(jQuery.proxy(chkInputChange,$pref),300));
		sidz.push(setInterval(jQuery.proxy(chkInputChange,$city),300));
		// sidz.push(setInterval(jQuery.proxy(chkInputChange,$addr1),300));
		// sidz.push(setInterval(jQuery.proxy(chkInputChange,$addr2),300));
	},this));
	// $zip.on('blur',jQuery.proxy(function(){clearInterval(chkHiddenSid);},this));
	// $zip.on('blur',jQuery.proxy(function(){
	// },this));
	// $zip.on('keyup',jQuery.proxy(function(){
	// 	if(!$zip.val()){}
	// },this));


	// helper.addAddressAutoFill('#zipCodeInput',$pref.attr('name'),$city.attr('name'));
	helper.addAjaxZip3('#zipCodeInput'+_sfx
		,null
		,$pref.attr('name')
		,$city.attr('name')
		,jQuery('#address1Input'+_sfx,helper.$).attr('name')
		,jQuery('#address2Input'+_sfx,helper.$).attr('name')
		// ,'keyup blur'
		// ,0
	);
	// jQuery.log("View.initForm.addresses:helper.addAjaxZip3 >>> "
	// 	,$pref.attr('name')
	// 	,$city.attr('name')
	// 	,jQuery('#address1Input',helper.$).attr('name')
	// 	,jQuery('#address2Input',helper.$).attr('name'))

	//値が入っている場合もあるので一回だけやっておく。
	cityChangeFn();

	/*
	///zipcode系 sp用
	// helper.addFilter('#zipCodeInput_sp',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
	var $zipsp = jQuery('#zipCodeInput_sp',helper.$)
	,$prefs_repsp = jQuery('.prefs-replacement_sp',helper.$)
	,$prefsp = jQuery('#prefHidden_sp',helper.$)
	,$citysp = jQuery('#cityHidden_sp',helper.$)
	,$addr1sp = jQuery('#address1Input_sp',helper.$)
	,$addr2sp = jQuery('#address2Input_sp',helper.$)
	,tmp_zip = ''
	,prefs_repDef = $prefs_repsp.text()
	// ,allAddressInputsChangeFn = jQuery.proxy(function(){
	// 	jQuery.log('allAddressInputsChangeFn')
	// })
	,sidz = []
	,chkInputChange = function(){
		this.newVal = jQuery(this).val();
		if(typeof this.oldVal != 'undefined' && this.oldVal !== this.newVal){
			this.trigger('change');
			// jQuery.log('住所入力のうちどれかに変更があった。'+this.newVal);
		}
		this.oldVal = this.newVal;
	}
	,cityChangeFn = jQuery.proxy(function(){
		// jQuery.log('cityChangeFn')
		var pv = $prefsp.val()
			,cv = $citysp.val()
		;
		if(pv && cv){
			$prefs_repsp
				.removeClass('off')
				.text(pv+" "+cv);
				jQuery('input#address1Input_sp').toggleClass('placeholders');
		}else{
			$prefs_repsp
				.addClass('off')
				.text(prefs_repDef);
		}
	},this)
	;
	//市区町村input（置換用/隠してる）のonChange
	$citysp.on('change',cityChangeFn);
	//全てのzipに関係するaddrinput変更時
	// $prefsp.on('change',allAddressInputsChangeFn);
	// $citysp.on('change',allAddressInputsChangeFn);
	// $addr1sp.on('change',allAddressInputsChangeFn);
	// $addr2sp.on('change',allAddressInputsChangeFn);

	//hiddenFieldのchangeイベントチェックはintervalで回すしかないのかしら。
	$zipsp.on('focus',jQuery.proxy(function(){
		if(sidz.length){
			for (var i = sidz.length - 1; i >= 0; i--) {
				clearInterval(sidz[i]);
			};
			sidz = [];
		}
		sidz.push(setInterval(jQuery.proxy(chkInputChange,$prefsp),300));
		sidz.push(setInterval(jQuery.proxy(chkInputChange,$citysp),300));
		// sidz.push(setInterval(jQuery.proxy(chkInputChange,$addr1sp),300));
		// sidz.push(setInterval(jQuery.proxy(chkInputChange,$addr2sp),300));
	},this));
	// $zipsp.on('blur',jQuery.proxy(function(){clearInterval(chkHiddenSid);},this));
	// $zipsp.on('blur',jQuery.proxy(function(){
	// },this));
	// $zipsp.on('keyup',jQuery.proxy(function(){
	// 	if(!$zip.val()){}
	// },this));


	// helper.addAddressAutoFill('#zipCodeInput_sp',$prefsp.attr('name'),$citysp.attr('name'));
	helper.addAjaxZip3('#zipCodeInput_sp'
		,null
		,$prefsp.attr('name')
		,$citysp.attr('name')
		,jQuery('#address1Input_sp',helper.$).attr('name')
		,jQuery('#address2Input_sp',helper.$).attr('name')
		// ,'keyup blur'
		// ,0
	);
	// jQuery.log("View.initForm.addresses:helper.addAjaxZip3 >>> "
	// 	,$prefsp.attr('name')
	// 	,$citysp.attr('name')
	// 	,jQuery('#address1Input_sp',helper.$).attr('name')
	// 	,jQuery('#address2Input_sp',helper.$).attr('name'))

	//値が入っている場合もあるので一回だけやっておく。
	cityChangeFn();
	*/

	//mail
	// helper.addFilter('#emailInput',FormHelper.FILTER_TYPE.EMAIL,'remove');

	if(!noSetDefaults){
		helper.setSelectedValues();
		helper.setDefaults();
	}

	//jQuery.selectboxの再初期化
	// jQuery('select',helper.$).selectbox('detach').selectbox('attach');
	//:selectedの中央選択テスト
	jQuery('select',helper.$).selectbox('detach').selectbox(View.selectboxInitObj);
};



/***   スマートフォン用     *****/

View.initForm.addressesSp = function(helper_sp,noSetDefaults){

	//生年月日用
	helper_sp.initDateSelects('#birthdayYearSelect','#birthdayMonthSelect','#birthdayDaySelect','－',1900,new Date().getFullYear(),false,false);
	//40年前の年を選択（既に data-selected-value が入ってない時のみ）
	var $yearSelect = jQuery('#birthdayYearSelect');
	if(!$yearSelect.attr(helper_sp.attr_selectedValue)){
		$yearSelect.attr(helper_sp.attr_selectedValue, new Date().getFullYear()-Conf.defBirthdayYearSelectDiff)
	}

	//全角必須
	helper_sp.addFilter('.htof-input',Formhelper_sp.FILTER_TYPE.HALF_TO_FULL);

	//カナ
	helper_sp.addFilter('.kana-input',Formhelper_sp.FILTER_TYPE.FULL_KANA);

	//数値
	helper_sp.addFilter('.num-input',Formhelper_sp.FILTER_TYPE.HALF_NUMBER,'remove');

	//mail
	// helper_sp.addFilter('#emailInput_sp',Formhelper_sp.FILTER_TYPE.EMAIL,'remove');

	if(!noSetDefaults){
		helper_sp.setSelectedValues();
		helper_sp.setDefaults();

	}

	//jQuery.selectboxの再初期化
	// jQuery('select',helper_sp.$).selectbox('detach').selectbox('attach');
	//:selectedの中央選択テスト
	jQuery('select',helper_sp.$).selectbox('detach').selectbox(View.selectboxInitObj);
};


/**
 * onChangeで見た目をリフレッシュさせる必要のあるセレクトボックス群へのイベント追加。
 * ユーザーの選択した値によって他のセレクトボックスが連動する日付選択などに。
 * ※ グループ名はちゃんとつけないと、グループ内の対象selectboxが余りに増えると処理重になる。
 * ※ イベントの順番に左右される部分があるため、必ずformHelperのinit+setSelectedValuesあとに実行させる。(FormHelperのイベント全部にnamespaceつけたら大丈夫そうだが
 * @param  {[type]} $parent 対象を内包するjqObj
 * @return {[type]}         [description]
 */
View.initForm.dynamicRefleshSelect = function( $parent ){
	jQuery('select.'+View.initForm.REF_SELBOX_KLASS, $parent || View.$body ).each(function(i,o){
		var $o = jQuery(o);
		$o
		.off('change.dynamicRefleshSelect')
		.on('change.dynamicRefleshSelect',function(){
			var $sel = jQuery(this);
			var ATTR_ = View.initForm.REF_SELBOX_ATTR_GROUP;
			var gn = $sel.attr(ATTR_);
			$sel.selectbox("detach").selectbox(View.selectboxInitObj);//まず自分
			if(gn){
				//グループ名があるとき、自分以外のグループ全部に対してselectbox()
				var $groups = jQuery('select['+ATTR_+'='+gn+']');
				$groups.each(function(j,go){
					var $go = jQuery(go);
					if($go[0] != $sel[0]) $go.selectbox("detach").selectbox(View.selectboxInitObj);
				})
			}
		});
	});
};
View.initForm.REF_SELBOX_KLASS = 'reflesh-select';
View.initForm.REF_SELBOX_ATTR_GROUP = 'data-select-group';

//パスワードを見るボタン
View.initForm.showHidePassword = function($pwInput,$btn){
	$btn.on('click',jQuery.proxy(function(e){
		//typeは変更できないのでhtml拾って文字列置換しないといけない。
		// var t = $pwInput.attr('type');
		// var toggleOn = false;
		// if(t == 'text'){$btn.removeClass('toggle-on')}else{$btn.addClass('toggle-on');}
		// $pwInput.attr('type',t == 'text' ? 'password':'text');
	},this))
}

//form内にある「前のページに戻る」用
View.initForm.formBack = function(){
	var $aa = jQuery('form a.form-back');
	var click_ = function(e){
		var $a,$form,k,helper,v = true;
		jQuery.preventDefault(e);
		$a = jQuery(e.target);
		if($a.get(0).tagName.toLowerCase() !== 'a')$a = $a.closest('a');
		k = $a.attr('name');
		$a.attr('name','');//名前空間がかぶるから消しとく。
		// v = $a.attr('data-post-value');
		// if(!v)v = true;
		$form = $a.closest('form');
		if(!$form.length){
			jQuery.err('View.initForm.formBack() : 親となるformが見つかりません。');
			return;
		}
		if(!k){
			jQuery.err('View.initForm.formBack() : aにname属性が設定されていません。');
			return;
		}
		helper = $form.data('FormHelper');
		if(!helper){
			jQuery.log('formにはhelperが設定されていません。');
		}else{
			helper.unsetDefaults();
		}
		$form.append('<input type="hidden" name="'+k+'" value="'+v+'">');
		$form.trigger('submit');
	}
	$aa.on('click',jQuery.proxy(click_,this));
}


/**
 * DOMにshow()hide()でcssクラスを付与し、opcityのanimate
 */
var ShowHideSprite = Class.extend({
	$:null
	,shownFD:false
	,duration:320
	/**
	 * INIT
	 * @param  {[type]} $target          [description]
	 * @param  {[type]} duration         アニメーションduration.
	 * @param  {[type]} shownFirstDetect 最初の状態で表示するかどうか。
	 * @return {[type]}                  [description]
	 */
	,init:function($target,duration,shownFirstDetect){
		this.$ = $target;
		this.duration = typeof duration != "undefined" ? duration : 320;
		this.shownFD = typeof(shownFirstDetect) !='undefined' ? shownFirstDetect : shownFD;
		this.$.animate({opacity:0},0);
		if(this.shownFD)
			this.show();
	}
	,show:function(d){
		this.$
			.addClass('show')
			.animate({opacity:1},{
				duration:typeof d != "undefined" ? d : this.duration
				,easing:'linear'
				,queue:false})
		;
	}
	,hide:function(d){
		this.$
			.removeClass('show')
			.animate({opacity:0},{
				duration:typeof d != "undefined" ? d : this.duration
				,easing:'linear'
				,queue:false})
		;
	}
});

/**
 * SpinnerControler(showHide)
 * var s = new SpinnerControler();
 * s.show(jQuery(target));
 * s.hide(); -> 消す
 * s.show(); -> 前に指定したtargetにshow
 * @type {[type]}
 */
var SpinnerControler = Class.extend({
	$:null
	,$t:null //target
	,s:null //Spinner
	,opt:{
		dashes: 21,
		radius: 11,
		width: 1.1,
		height: 6,
		opacity: 1,
		padding: 0,
		rotation: 700,
		color: '#4A1E04'
	}
	,init:function(opt,$targ,centering){
		if(typeof opt == "object"){
			//obj設定されているもののみ
			for(var i in opt){
				this.opt[i] = opt[i];
			}
		}else if(typeof opt == "string"){
			this.setSize(opt);
		}
		this.$ = jQuery('<span class="spinner"></span>');
		this.$.css({
			'display':'inline-block'
			,'*display':'inline'
			,'*zoom':1
		});
		if(typeof centering == 'boolean') this.centering = centering;
		if($targ && $targ.length) this.$t = $targ;
	}
	,setSize:function(size){
		var newopt = {};
		switch(size){
			case "L": newopt = {dashes:39,radius:32,height:8}; break;
			case "M": newopt = {dashes:29,radius:17,height:7}; break;
			case "S": newopt = {dashes:23,radius:11,height:6}; break;
		}
		for(var i in newopt) this.opt[i] = newopt[i];
	}
	,show:function($targ){
		if($targ && $targ.length) this.$t = $targ;
		if(!this.$t){
			jQuery.log("[!] SpinnerControler :: Spinner表示先targetが指定されていません。 bodyをtargetにします。");
			this.$t = jQuery('body');
		}

		// this.s = new Spinner(this.opt).spin(this.$t.get(0));
		this.s = Spinners.create(this.$.get(0),this.opt);
		this.s.play();
		if(this.centering) this.doCentering_();
		this.$t.prepend(this.$);
		// this.$t.prepend(jQuery(this.s.el));
		return this;
	}
	,hide:function(){
		if(typeof this.s == 'undefined') return this;
		// this.s.stop();
		// jQuery(this.s.el).remove();
		// delete this.s;
		this.s.pause();
		this.releaseCentering_();
		this.$.remove();
		return this;
	}
	,centering:false
	,centeringFlg:false
	,preprop_targ:{}
	,preprop_s:{}
	,doCentering_:function(){
		if(this.centeringFlg) return;
		this.preprop_targ['text-align'] = this.$t.css('text-align');
		this.$t.css({
			'text-align':'center'
		});
		this.preprop_s['margin'] = this.$.css('margin');
		this.$.css({
			'margin':'0 auto'
		});
		this.centeringFlg = true;
	}
	,releaseCentering_:function(){
		if(!this.centeringFlg) return;
		this.$t.css({
			'text-align':this.preprop_targ['text-align']
		});
		this.$.css({
			'margin':this.preprop_s['margin']
		});
		this.centeringFlg = false;
	}
});


/**
 * 動的Modalテンプレ
 * @require bootstrap-modal.js
 */
var MiscModal = Class.extend({
	$:null
	,$title:null
	,$body:null
	,centering:true
	,size:'M'
	,labelId:''
	,labelIdPref:'miscModalLabel'
	,backdropEnables:true
	,htm:''
	+'<div id="modal1" class="modal size-M hide fade" tabindex="-1" role="dialog" aria-labelledby="miscModalLabel" aria-hidden="true">'
	+'	<div class="modal-header">'
	+'		<button type="button" class="btn btn-baige close" data-dismiss="modal" aria-hidden="true"><i class="icon ico-ex btn16-cross-0">×</i><span class="text tx-btn s16-close">閉じる</span></button>'
	+'		<h3 id="miscModalLabel">&nbsp;</h3>'
	+'	</div>'
	+'	<div class="modal-body"><div class="modal-body-iwrap">&nbsp;</div></div>'
	//+'	<div class="modal-footer"><button type="button" class="btn btn-baige close showSp" data-dismiss="modal" aria-hidden="true"><i class="icon ico-ex btn16-cross-0">×</i><span class="text tx-btn s16-close">閉じる</span></button></div>'
	+'</div>'
	,isShown:false

	/**
	 * @param  {[type]} centering       中央揃えを実行するか。def:true
	 * @param  {[type]} backdropEnables 背景を表示する？def:true
	 * @param  {[type]} labelId         attr : aria-labelledby
	 * @return {[type]}                 [description]
	 */
	,init:function(centering,backdropEnables,labelId){
		MiscModal.InstanceCnt++;
		this.$ = jQuery(this.htm);
		jQuery('body').append(this.$);

		this.$title = jQuery('.modal-header > h3',this.$);
		this.$bodyIWrap = jQuery('.modal-body-iwrap',this.$);
		this.$body = jQuery('.modal-body',this.$);

		if(typeof centering != 'undefined') this.centering = centering;
		if(typeof backdropEnables != 'undefined') this.backdropEnables = backdropEnables;
		if(typeof labelId == 'undefined') this.labelId = this.labelIdPref + MiscModal.InstanceCnt;
		// jQuery.log(this.labelId,this.centering,this.backdropEnables)
		//本家modal用イベントを追加?
		this.$
			.on('show',jQuery.proxy(function(){this.isShown = true;},this))
			.on('hide',jQuery.proxy(function(){this.isShown = false;},this))
		;
		//初期化
		// this.$.modal({'backdrop':this.backdropEnables});
		this.setId();

		// jQuery('.misc-modal-close',this.$).bind('click',jQuery.proxy(function(e){
		// 	jQuery.preventDefault(e);
		// 	this.hide();
		// 	return false;
		// },this));
	}


	/**
	 * 設定して表示。基本何も渡さなくても表示OK.
	 * @param  {String} title     String(or HTML)
	 * @param  {String} content   .modal-bodyのhtml.
	 * @param  {String} size      "S|M|L"
	 * @param  {Boolean} errorMode エラー表示？default:false
	 * @return {[type]}           this
	 */
	,show:function(title,content,size,errorMode){
		if(this.isShown){
			this.hide();//modal('hide');
			this.isShown = false;
		}
		this.setSize(size ? size : this.size);
		this.setContents(title,content);
		//if(typeof errorMode != 'undefined');
		this.setError(errorMode);
		// this.$.modal('show');
		// remoteは常にoff(reqmodalとかでhref=""がある時、変な挙動をするので)
		this.$.modal({
			'backdrop':this.backdropEnables
			,'remote':false
		});
		this.$.trigger(MiscModal.EVT.SHOW);
		this.isShown = true;
		return this;
	}

	,hide:function(){
		if(!this.isShown) return;
		this.$.modal('hide');
		this.$.trigger(MiscModal.EVT.HIDE);
		this.isShown = false;
		return this;
	}

	,setContents:function(title,content,errorMode){
		if(typeof title == "string" || content instanceof jQuery){
			this.$title.html(title);
		}
		if(typeof content == "string" || content instanceof jQuery){
			this.$bodyIWrap.html(content);
		}
		if(errorMode == true) this.setError(errorMode);
	}

	/**
	 * modalの矩形指定
	 * @param  {[type]} size "S|M|L".default is "M"
	 * @param {[type]} error [description]
	 * @return {[type]}      [description]
	 */
	,setSize:function(size){
		switch(size){
			case 'S':
			case 'M':
			case 'M2':
			case 'L':
				this.unsetSize();
				this.size=size;
				this.$.addClass('modal-size-'+this.size);
				//中央揃えする
				if(this.centering) this.setPosition();
			break;
		}
	}
	,unsetSize:function(){
		this.$.removeClass('modal-size-S modal-size-M modal-size-M2 modal-size-L');
	}

	,setError:function(bool){
		this.$.removeClass('error-modal');
		if(bool){
			this.$.addClass('error-modal');
		}
	}

	,setId:function(id){
		if(typeof id != 'undefined') this.labelId = id;
		this.$.attr('aria-labelledby',this.labelId);
		this.$title.attr('id',this.labelId);
	}

	,setPosition:function(){
		// jQuery.log("MiscModal.setPosition::");
		var marginV = 30;
		var ww = jQuery(window).width();
		var wh = jQuery(window).height();
		this.$.show();
		this.$.css({'top':'0%'});
		this.$body.css({
			'max-height':'none'
			,'height':'auto'
		});
		var otherHeights = this.$.outerHeight()-this.$body.height();
		this.$body.css('max-height',(wh-otherHeights-marginV));
		this.$.css({
			'top':'50%'
			,'margin-top':(-1*(this.$.outerHeight())/2)
		});

		//既に開いている場合はdiaplay:block;
		if(this.isShown) this.$.show();
	}

});
MiscModal.InstanceCnt = 0;
MiscModal.EVT = {
	SHOW:'modalShow'
	,HIDE:'modalHide'
};

/**
 * リクエストを伴うmodal
 * @type {[type]}
 */
var ReqModal = MiscModal.extend({
	init:function(){
		this._super();
		this.spinner = new SpinnerControler('S');
	}
	,url:''
	,attr_modal_size:'data-modal-size'
	,attr_page_title:'data-modal-title'//無いときはtarget.text()
	,attr_parts_selector:'data-modal-parts' // data-modal-parts = ".taco > #nama" など
	,spinner:null
	/**
	 * jQuery(document).on('click.miscmodal.data-api', '[data-toggle="miscmodal"]',function(e){new MiscModal().calleeToggle(e,this);});
	 * なんかで呼ばれた時。thisは第二引数に引き継ぐ。
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	,calleeToggle:function(e,calleeScope){
		var $callee = jQuery(calleeScope);
		jQuery.preventDefault(e);
		this.url = $callee.get(0).href;

		//★タイトルや読み込み先のセレクタ設定は data-modal-* attr優先
		this.page_title = $callee.attr(this.attr_page_title) || $callee.text() || '&nbsp;';
		this.parts_selector = $callee.attr(this.attr_parts_selector) || ReqUtil.getAnchor(this.url) || false;
		var resize = $callee.attr(this.attr_modal_size);
		if(resize) this.setSize(resize);

		// this.$.modal({'remote':$callee.href});
		// modal内spinnerを表示
		this.spinner.show(this.$bodyIWrap);

		this.show(this.page_title); //modalの中身を設定
		// this.setPosition(); //ポジション直し
		//読み込み
		jQuery.ajax({
			//#や?以下は除去して一意なurlで読む。
			url:ReqUtil.makeUniqueUrl(ReqUtil.removeParams(this.url))
			,dataType:'html'
			,success:jQuery.proxy(this.onLoad_,this)
			,error:jQuery.proxy(this.onError_,this)
		});
	}
	,onLoad_:function(html){
		// [TODO]読み込んだhtm内のパス書き換えどうしましょ
		this.$htm = ReqUtil.html5str2jqo(html);
		this.spinner.hide();

		jQuery.log('ReqModal:ページの読み込みが完了しました。\n	url :', this.url);
		jQuery.log('	selector:',this.parts_selector);
		jQuery.log('	jQuery(selector,jQuery(html)):', this.$htm);

		if(this.parts_selector !== false){
			this.setContents(this.page_title,jQuery(this.parts_selector,this.$htm));
		}else{
			this.setContents(this.page_title,this.$htm);
		}
		this.setPosition();//配置修正
	}
	,onError_:function(){
		this.spinner.hide();
		this.setContents('通信エラー','<p>&quot;'+this.url+'&quot;の読み込みに失敗しました。</p>',true);
	}
});


/**
 * エラー表示関連のメソッドを持つクラス拡張用
 */
var AjaxErrorImpl = Class.extend({
	api:'url'
	,ajax_error_:function(xhr,stat,errThrown){
		this.showError('リクエストエラー','<p>&quot;'+this.api+'&quot; の読み込みに失敗しました。</p>');
		jQuery.log('AjaxErrorImpl::ajax_error_ :',xhr,stat,errThrown);
	}
	/**
	 * View.Modal上でのエラー表示。ない場合はconsoleに出力
	 * @param  {[type]} title        [description]
	 * @param  {[type]} content      [description]
	 * @param  {[type]} disableModal [description]
	 * @return {[type]}              [description]
	 */
	,showError:function(title,content,disableModal){
		if(View.modal && !disableModal){
			View.modal.show(title,content,'S',true);
		}else{
			jQuery.log(title,content);
		}
	}
	/**
	 * 埋め込みエラー表示
	 * @param  {[type]} content htmlも可。ただ、先頭にインライン要素の<i>が入るため、ボックス要素入れると改行します。
	 * @param  {[type]} $target [description]
	 * @param {[type]} removeBefore 前に表示してたエラー（全部）消す
	 * @return {[type]}         [description]
	 */
	,showInlineError:function(content,$target,removeBefore){
		if(removeBefore && this.$inlineError && this.$inlineError.length){
			this.$inlineError.remove();
			this.$inlineError = jQuery([]);
		}
		if(!this.$inlineError){
			this.$inlineError = jQuery([]);
		}
		// var $e = jQuery('<p>').addClass('error error-box hide small'); //最初は消す?。
		var $e = jQuery('<p>').addClass('error error-box small'); //動的に出すやつだから消さなくていいか。
		$e.append(jQuery('<i>').addClass('icon ico-ex caution14 mr-g1'));
		$e.append(content);
		$target.append($e);
		this.$inlineError.push($e);
		jQuery.log('CatalogForm.Rows::showInlineError() ',this.$inlineError);
		return $e;
	}
	,showListError:function(content,$target,removeBefore){
		if(removeBefore && jQuery('ul.error-box', $target) && jQuery('ul.error-box', $target).length){
			jQuery('ul.error-box', $target).remove();
			this.$listError = jQuery([]);
		}
		if(!this.$listError){
			this.$listError = jQuery([]);
		}
		var $ul = jQuery('<ul>').addClass('error-box small');
		var liz = [];
		if(!jQuery.isArray(content))content = [content];
		for (var i = 0; i < content.length; i++) {
			liz.push('<li>'+content[i]+'</li>');
		};
		$ul.append(liz.join());
		$target.append($ul);
		this.$listError.push($ul);
		jQuery.log('CatalogForm.Rows::showListError() ',this.$listError);
		return $ul;
	}
});

/**
 * エラーmodal付きjson用loaderクラス
 * @type {[type]}
 */
View.SimpleJsonLoader = AjaxErrorImpl.extend({
	init:function(jsonurl){
		this.api = jsonurl;
	}
	,load:function(jsonurl){
		if(jsonurl)this.api = jsonurl;
		jQuery.ajax({
			url:ReqUtil.makeUniqueUrl(this.api)
			,dataType:'json'
			,type:Conf.ajaxMeth
			,success:jQuery.proxy(this.success_,this)
			,error:jQuery.proxy(this.ajax_error_,this)
		});
	}
	,success:null
	,success_:function(dat){
		this.dat = dat;
		if(typeof this.success === "function")this.success(dat);
	}
});

/**
 * 商品DB用クラスimpl。必要ライブラリ検査のためinit時this._super();してください。
 * @type {[type]}
 */
var ItemDBImpl = AjaxErrorImpl.extend({
	dat:{}//json
	,db:{
		"error":{
			"title":"エラーハンドリング"
			,"content":"このerrorオブジェクトがある場合はエラー内容が表示されるようにします。"
		}
		,"item":{
			"name":""
			,"permalink":""
			,"thumb":""
			,"display_price":""
			,"discount_rate":""
			,"regular_price":""
		}
		,"column":{
			"label":[
				"color"
				,"size"
			]
			,"label_name":[
				"色"
				,"サイズ"
			]
		}
		,"options":{
			"color":[
				{
					"uid":"1"
					,"num":""
					,"name":""
				}
			]
			,"size":[
				{
					"uid":"1"
					,"num":""
					,"name":""
				}
			]
		}
		,"stock":[
			{
				"color":"1"
				,"size":"1"
				,"stock":0
			}
		]
	}


	//qty以外の選択した値が入る。{"color":color.uid}とか
	,optSelectedNow:null

	,init:function(){
		this.dat = {};
		if(!TAFFY){jQuery.err('ItemDBImpl::init()','taffy.jsが必要です。');}
		if(!JSON || JSON && typeof JSON.parse != 'function'){jQuery.err('ItemDBImpl::init()','IE7以降はjson2.jsが必要です。');}
	}


	// this.datの正当性検査
	,_validData:function(){
		return this.dat && this.dat.column && this.dat.options && this.dat.stock ? true : false;
	}

	,clmlen:0,stocklen:0,allStockCnt:0
	/**
	 * stock用db初期化。dataが帰ってきたらやる。
	 * @return {[type]} [description]
	 */
	,stockDBInit:function(){
		var i,label;
		//★データベースは参照渡しなので都度初期化する。
		this.db = {};
		// jQuery.log(this.dat);//this.db.stock);
		this.db.stock = TAFFY(this.dat.stock); //[XXX] >>> IEでエラー吐いてた。完全になおってない。
		jQuery.log(this.db.stock().select("stock"));

		this.db.options = {};//new Object();


		//繰り返し用に
		this.clmlen = this.dat.column.label.length;
		this.stocklen = this.dat.stock.length;

		//options準備
		for (i = 0; i < this.clmlen; i++) {
			label = this.dat.column.label[i];
			this.db.options[label] = TAFFY(this.dat.options[label]);
		}

		//全在庫があるかどうか
		var stocks = this.db.stock().select("stock");
		this.allStockCnt = 0;
		for (i = stocks.length - 1; i >= 0; i--) {
			this.allStockCnt+=Number(stocks[i]);
		}
		jQuery.log("全在庫数：",this.allStockCnt);
	}

	,dbGetOptCache:[]

	//option[label]からuidを取得？select()でもいいか。
	,dbGetOpt:function(label,uid){
		if(!this._validData())return {};
		var i,opts = this.dat.options[label],r;
		for (i = opts.length - 1; i >= 0; i--) {
			if(opts[i].uid === uid){
				r = opts[i];
				// this.dbGetOptCache.push() //キャッシュはしない？
				break;
			}
		}
		return r || {};
	}

	//<select> > <option>に追加するuid用要素。
	,attr_uid:'data-unique-id'

	,dbGetSelectOptionHtm:function(label){
		// return this.db.options[label]().supplant('<option value="{num}" '+this.attr_uid+'="{uid}">{name}({num})</option>');
		// return this.db.options[label]().supplant('<option value="{uid}" '+this.attr_uid+'="{uid}">{name}({num})</option>');
		// (opt.num)はいらない。
		return this.db.options[label]().supplant('<option value="{uid}" '+this.attr_uid+'="{uid}">{name}</option>');
	}
});

/**
 * ItemDBImplを継承した商品データ表示関連のクラス
 * @type {[type]}
 */
var ItemSelectView = ItemDBImpl.extend({
	setAllView:function(){
		if(!this.db.stock) return false;
		return true;
	}

	/**
	 * selectboxが有効かどうか(値があるかどうか)検査
	 * @param  {[type]} column_label [description]
	 * @return {[type]}              [description]
	 */
	,optEnables:function(column_label){
		return this.dat.options[column_label] && this.dat.options[column_label].length;
	}
	/**
	 * selectboxを表示しない場合のチェック。
	 * selectboxが有効であったときでも、値が1個で且つ値の名称が空か"-"だったときtrue
	 * @param  {[type]} column_label [description]
	 * @return {[type]}              [description]
	 */
	,optHasOneEmptyNameField:function(column_label){
		var ln = this.dat.options[column_label][0].name;
		return this.dat.options[column_label] && this.dat.options[column_label].length == 1 && (Boolean(ln) === false || ""+ln === '-');
	}

	,optSelectedNow:{}

	/**
	 * ぶん投げたselectboxのoption値をhtmlにして拾う。
	 * AddToCartクラスでカートに入れた後setView()、.item-boxの内容置換などで使用
	 * @return {[type]} [description]
	 */
	,getPostedOptionsHtml:function(){
		// var fmt='<p class="options">色：<em>黒(06)</em>, サイズ：<em>S(01)</em></p>'
		// this.joinedStocks(this.optSelectedNow)
		var htm_arr = [],l,uid,clmidx,hn,q,name,num;
		for(l in this.optSelectedNow){
			if(!this.optEnables(l) || !this.optSelectedNow[l]) continue;
			uid = this.optSelectedNow[l];
			clmidx = ArrayUtil.indexOf(this.dat.column.label,l);
			hn = clmidx === -1 ? '' : this.dat.column.label_name[clmidx];
			q = this.db.options[l]({'uid':uid});
			name = q.select('name').toString();
			// num = q.select('num').toString();
			// jQuery.log(q.select('name').toString(),''+q.select('name'),clmidx);
			// q.length
			// if(!name || !num) continue;
			if(!name) continue;
			// htm_arr.push(hn+'：<em>'+name+'('+num+')</em>');
			htm_arr.push(hn+'：<em>'+name+'</em>');
		}
		return htm_arr.join(', ');
	}
});


// マウス位置に追従するBootstrapTooltipのExtend
// !function($){
	var FixedTooltip = Class.extend({
		$target:null
		,$parent:null
		,$container:null
		,tooltip:null
		,isSupportTouch: !!("createTouch" in document)
		,zindex:9999
		,opt_def:{
			trigger: 'manual',
			placement: 'top'
		}

		,init:function($target,$parent){
			this.$container = jQuery('<div class="bs-tooltip-container">');
			this.$container.css({
				'position':'absolute'
				,'z-index':this.zindex
				// ,'height':4
				// ,'width':4
				// ,'margin-top':-2
				// ,'margin-left':-2
				// ,'background':'#0f0'
			});
			this.$target = $target;
			this.$parent = $parent && $parent.length ? $parent : jQuery('body');
			this.$parent.append(this.$container);
			// this.$target.on('mouseover', jQuery.proxy(this.show_,this));
			// this.$target.on('mouseout', jQuery.proxy(this.hide_,this));
			// this.$target.on('mouseenter', jQuery.proxy(this.show_,this));
			// this.$target.on('mouseleave', jQuery.proxy(this.hide_,this));
			// jQuery.log('(new FixedTooltip()).$target :',this.$target)
			if(this.isSupportTouch){
				this.$target.on('touchstart.FixedTooltip', jQuery.proxy(this.show_,this));
			}else{
				this.$target.on('mouseenter.FixedTooltip', jQuery.proxy(this.show_,this));
				this.$target.on('mouseleave.FixedTooltip', jQuery.proxy(this.hide_,this));
			}
			// this.setContainerPos_ = jQuery.proxy(this.setContainerPos__,this);
			this.$container.tooltip(jQuery.extend({},{
				'title':this.$target.attr('data-original-title') || this.$target.attr('title')
			},this.opt_def));
		}
		,setContainerPos_:null
		,setContainerPos__:function(e){
			// jQuery.log(e);
			// this.$container.css({
			// 	top:e.pageY-5
			// 	,left:e.pageX
			// });
		}
		,show_:function(){
			jQuery.log('FixedTooltip :: show_')
			var offset = this.$target.offset();
			this.$container.css({
				top: offset.top
				,left: offset.left + (this.$target.width()/2)
			});
			this.$container.tooltip('show');
			if(this.isSupportTouch) jQuery('body').on('touchend.FixedTooltip',jQuery.proxy(this.hide_,this));
			// jQuery(document).on('mousemove',this.setContainerPos_);
		}
		,hide_:function(){
			jQuery.log('FixedTooltip :: hide_')
			this.$container.tooltip('hide');
			if(this.isSupportTouch) jQuery('body').off('touchend.FixedTooltip');
			// jQuery(document).off('mousemove',this.setContainerPos_);
		}
	});
// 	jQuery(function(){
			// jQuery('[rel=fixed-tooltip]') で初期化はしなくていいか？
			// jQuery('[rel=fixed-tooltip]').each(function(i,o){
			// 	new FixedTooltip(jQuery(o));
			// });
// 	});
// }(window.jQuery);


// 2017.01.31 add @ Hel
jQuery(function(){
	//magnific-popup
	jQuery('head').append('<link rel="stylesheet" href="/lib/jquery.magnific-popup.css" />');
	jQuery('head').append('<script type="text/javascript" src="/lib/jquery.magnific-popup.custom.js"></script>');
	//slick-slider
	jQuery('head').append('<link rel="stylesheet" href="/res/css/slick.css" />');
	jQuery('head').append('<script type="text/javascript" src="/res/js/lib/slick.min.js"></script>');
	//cookie
	jQuery('head').append('<script type="text/javascript" src="/lib/jquery.cookie.js"></script>');
	//campaign
	jQuery('head').append('<link rel="stylesheet" href="/res/css/campaign.css" />');
	
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
	jQuery('.campaign1').magnificPopup(modal1);
	jQuery('.campaign2').magnificPopup(modal2);
	
	//カルーセルのセッティング
	var defaultOpt = {
		infinite: false,
		slidesToShow: 2,
		centerMode: false,
		autoplay: false,
		arrows: false,
		responsive: [{
			breakpoint: 768,
			settings: {
				infinite: true,
				slidesToShow: 1,
				centerMode: true,
				centerPadding:'20px',
				autoplay: true
			}
		}]
	};
	var slider = jQuery('#campaign_bnr');
	
	//カルーセル枚数別の制御
	jQuery("#campaign_bnr").each(function () {
		var num = jQuery(this).find('li').length;
		if(num <= 1){
			slider.on('destroy');
		}else{
			slider.slick(defaultOpt);
		}
	});
});
// 2017.01.31 add @ Hel End
