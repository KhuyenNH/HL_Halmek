//�e���v���[�g����ǂݍ��܂��A�R�[�f�B�I�����j���[��
//�G�X�P�[�v����
var domflag;
var escapeflag;
jQuery.event.add(window, ("onpageshow" in window && window.onpageshow === null) ? "pageshow" : "load", function(){
	if (!domflag){
		domflag = 1;
	}else{
		escapeflag = 1;
	}
});

// �ϐ��uviewflag�v�`�F�b�N
if (typeof(viewflag) == 'undefined') var viewflag;
	// IE8�`�F�b�N
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";
/**
 * �\���֘A�AUI�Ȃǂ̊g���N���X
 */
;var View = {};
// View.initPage = function(){};

/**
 * �y�[�W�ǂݍ��ݎ��ɕ\�������spinner.
 */
// !function($){
jQuery(function(){
	//page�ǂݍ��ݗpspinner
	// View.$wrap.css('visibility','hidden');
	// View.bodyspinner = new SpinnerControler({top:150});
	//View.bodyspinner = new SpinnerControler({padding:24},jQuery('body'),true);
	//View.bodyspinner.setSize('M');
	//View.bodyspinner.show();
	//hide��View.initAll�̍Ō�ɁB
	jQuery("select[name=select_lower]").addClass("select_lower no-init");
	jQuery("select[name=select_upper]").addClass("select_upper no-init");
	jQuery("div.modal-body select[name=select_lower]").removeClass("no-init");
	jQuery("div.modal-body select[name=select_upper]").removeClass("no-init");
});//(window.jQuery);

//�e�y�[�W�̏������҂��F�ʏ�͂��Ȃ��Bajax�ŏ������O��json�����Ƃ��ė���K�v������ΐ^�ɁB
View.waitInitPage = 0;


/**
 * initAll�̂����ɁB
 * @return {[type]} [description]
 */
View.onInitAll = function(){
	//Spinner������
	//View.bodyspinner && View.bodyspinner.hide();
	//�B���Ă����v�f��\��
	View.$wrap.addClass('show');
	//.error������Ƃ��Ď��B�X�N���[���Ƃ��B
	// View.$errors = jQuery('.wrap-body .error');
	View.errors = new View.ErrorObserver();
	//�������I���t���O�ɂ��g�����߁B
	View.waitInitPage = 0;

	View.onShown();
};

//override��p�i�G���[�\�����I�������X�g�j
View.onShown = function(){};

/**
 * �ėpView��Init.�p�[�c�ǂݍ��݊������ɑ����s�B
 */
View.initAll = function(){

	View.$w = jQuery(window);
	View.$body = jQuery('body');
	View.$wrap = jQuery('body > .wrap-body');
	View.$sideNav = jQuery('#sideNav');//�T�C�h�i�r������ꍇ�͏������₷���悤�ɁB

	//[FIXME] safari�p�u���E�U�o�b�N�΍�(mobilesafari�͂��߁Bload�C�x���g��pageshow�ɂ��Ȃ��Ƃ����Ȃ��H)
	View.$w.on('unload',function(){});

	//firefox,macsafari�p<label for="*" �̋����C��(:radio,:checkbox��checked�C�x���g)
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
						//iOS��chrome�����Safari����ɍs��
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

	//PIE.js�K�p
	if(typeof PIE != 'undefined'){
		//[TODO] ���܂̂Ƃ���IE8�̂݁B init�̏��ԕς��Ă��C�x���g�������Ȃ��Ȃ�����Ƃ��B�i�o�O�͏o�Ȃ��悤�ɂȂ邪�j
		if(jQuery.browser.msie && /**/jQuery.browser.version > 7  && jQuery.browser.version < 9){
			//[!] �ecss1�s�ڂ�pie�g�p���Ă���Z���N�^���ς��ΕύX�̕K�v����B
			//[!] ���ꂩ���pie�g������ǉ����Ă��������ŁB130121
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
	
	//set designed selectForm.(no-init�ȊO)
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

	//���W�u���b�N�����^�C�����O
	jQuery('#topicsLauncher').freetile({
		animate: false
  });

	/**
	 * �T�C�h�i�r�ɂ���.active
	 */
	if(View.$sideNav.length){
		var floc = ReqUtil.removeParamsAll(ReqUtil.getFullPath(location.href));
		jQuery('ul>li',View.$sideNav).each(jQuery.proxy(function(i,o){
			var $li = jQuery(o);
			var $a = jQuery('a',$li).eq(0);
			var lnk = ReqUtil.removeParamsAll(ReqUtil.getFullPath($a.attr('href')));
			// jQuery.log(lnk,floc);
			if(floc == lnk){
				//���F$li.addClass('active');
				return false; //��ڂɂ݂�������������Ȃ��B
			}
		},this));
	}

	//itemlist�̓����s�ɂ�i��v�f�̍�������(�摜�������Ă���Himg�w�肵�Ă��ǂ��H>css�ŌŒ�B
	// jQuery(".item-list.size-S.clm4 .item .detail").tile(4);
	jQuery(".item-list.size-S.clm4 .item .badges").tile(4);
	jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);}); //top,ranking.
	//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //�ꗗ
	var heightrank =  jQuery('li > .rank').height(); //top,ranking.
	jQuery('li > .rank').css("height",heightrank); //top,ranking.
	jQuery('li > .rank').css("display","block"); //top,ranking.
	//(>)���X�g�n
	jQuery(".arrow-list.column-size2").each(function(){jQuery('> li',jQuery(this)).tile(2);});
	jQuery(".arrow-list.column-size3").each(function(){jQuery('> li',jQuery(this)).tile(3);});
	jQuery(".arrow-list.column-size4").each(function(){jQuery('> li',jQuery(this)).tile(4);});


	jQuery(function(){
		var win_width = window.innerWidth;
		if (!win_width) win_width = document.body.clientWidth;
		if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
			// �J�e�S��List�A��������
			jQuery(".arrow-list.column-size2").each(function(){jQuery('> li',jQuery(this)).tile(2);});
			jQuery(".arrow-list.column-size3").each(function(){jQuery('> li',jQuery(this)).tile(3);});
			jQuery(".arrow-list.column-size4").each(function(){jQuery('> li',jQuery(this)).tile(4);});
			jQuery(".item-list.size-M.clm3").each(function(){jQuery('.item .detail',jQuery(this)).tile(3);}); //top,ranking.
				//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //�ꗗ
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
					//jQuery(".item-list.size-S.clm4").each(function(){jQuery('.item',jQuery(this)).tile(4);}); //�ꗗ
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
	//�X�}�z�\���F�^�b�`�C�x���g�pclass�ǉ�
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
	//�X�}�z�\���F�^�b�`�C�x���g�pclass�폜
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

	//�X�}�z�\���F�^�b�`�C�x���g�pclass�ǉ�
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

	//�T�C�h�i�r�Q�[�V����������Ƃ��A�E�J�����ƍ����𑵂���B
	// jQuery(".clm2-snav > .side-nav, .clm2-snav > .section-content").tile();
	// jQuery(".clm2-guide > .side-nav, .clm2-guide > .section-content").tile();
	var $sn1 = jQuery(".clm2-snav");
	//�ÓI�y�[�W�̃T�C�h�i�r�ݒ���`
	var $sn2 = jQuery("#anniversary .clm2-snav");
	$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
	jQuery(".clm2-guide").each(function(){jQuery('> .side-nav, > .section-content',jQuery(this)).tile();});
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		// Sp�p�E�J��������������
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
				// Sp�p�E�J��������������
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

	//[140919����]�T�C�h�i�r�Ƀo�i�[������ꍇ�A�摜�������ł��������������
	// jQuery.log($sn1.height());
	var $bnrImgs = jQuery(".img-bnr img",$sn1), bnrImgLoaded = 0;
	$bnrImgs.each(jQuery.proxy(function(i,o){
		jQuery(o).on('load', jQuery.proxy(function(e){
			bnrImgLoaded++;
			if($bnrImgs.length != bnrImgLoaded) return;
			jQuery.log('�T�C�h�i�r�̃o�i�[�摜���������I');
			// jQuery.log($sn1.height());
			$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
			//�ÓI�y�[�W�̃T�C�h�i�r�ƃR���e���c�̍����𑵂���
			$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).tile();});
		},this));
	},this));

	//sp�Ή�
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		// Sp�p�E�J��������������
		var $bnrImgs = jQuery(".img-bnr img",$sn1), bnrImgLoaded = 0;
		$bnrImgs.each(jQuery.proxy(function(i,o){
			jQuery(o).on('load', jQuery.proxy(function(e){
				bnrImgLoaded++;
				if($bnrImgs.length != bnrImgLoaded) return;
				jQuery.log('�T�C�h�i�r�̃o�i�[�摜���������I');
				// jQuery.log($sn1.height());
				$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
				//�ÓI�y�[�W�̃T�C�h�i�r�ƃR���e���c�̍����𑵂���
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
				// Sp�p�E�J��������������
					var naviHeighttop = jQuery('.section-content').height();
						jQuery('#naviTop .side-nav').css("height",naviHeighttop);
						$sn1.each(function(){jQuery('> #naviTop .side-nav, > .section-content',jQuery(this)).tile();});
						//�ÓI�y�[�W�̃T�C�h�i�r�ƃR���e���c�̍����𑵂���
						$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).tile();});
			} else {
				$sn1.each(function(){jQuery('> #naviBottom .side-nav, > .section-content',jQuery(this)).removeAttr('style');});
				//�ÓI�y�[�W�̃T�C�h�i�r�ƃR���e���c�̍��������ꂼ��̍����ɐݒ肷�邽�߂�style���폜
				$sn2.each(function(){jQuery('> #naviTop .side-nav, > .anniversary .section-content',jQuery(this)).removeAttr('style');});
				var naviHeightbottom = jQuery('#naviBottom .side-nav').height();
				jQuery('#naviBottom .side-nav').css("height",naviHeightbottom);
			}
		}, 400);
	});

	//pagetop�̋���
	// var aScrollTop = new AnimScrollTop();
	jQuery('.pagetop > a').on('click',function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop().to();
		return false;
	});

	//�d�b
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


	//�y�[�W�������N�̐ݒ�
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

	//css�ǉ�
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

	//�A�R�[�f�B�I��
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


//�e���v���[�g�u���񂽂�V���b�s���O�K�C�h�v
jQuery(function(){
	if (!escapeflag){
		jQuery(".guide_item h2").on("click", function() {
		jQuery(this).toggleClass("opened");
		jQuery(this).next('p').slideToggle(100, 'swing');
		});
	}
});

//�e���v���[�g�u���i��T���v
jQuery(function(){
	if (!escapeflag){
		jQuery("#slideBoxsearch_sp").css("display","none");
		jQuery(".slideBoxsearch").on("click", function() {
		jQuery("#slideBoxsearch_sp").slideToggle(100, 'swing');
		});
	}
});

//�e���v���[�g�u�����p�K�C�h�v
jQuery(function(){
	if (!escapeflag){
		jQuery("#slideBoxguide_sp").css("display","none");
		jQuery(".slideBoxguide").on("click", function() {
		jQuery("#slideBoxguide_sp").slideToggle(100, 'swing');
		});
	}
});

//cartt.html �e���v���[�g�u���i��T���v
//checkout_01.html �o�^�ς݂̂��͂���ꗗ
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

//checkout_01.html ���̑��̏Z���ɑ���
//checkout_m01.html ���̑��̏Z���ɑ���
//cart.html ���i��ǉ�����
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

//checkout_01.html �����E�ّ̎��̕���
//checkout_m01.html �����E�ّ̎��̕���
//item_catalog.html ���̃y�[�W�̎g����
jQuery(function(){
	//jQuery("#slideBox3_sp").css("display","none");
	if (!escapeflag){
		jQuery("#slideBox3_sp").hide;
		jQuery(".slidebtn3").on("click", function() {
		jQuery("#slideBox3_sp").slideToggle(100, 'swing');
		});
	}
});

//checkout_01.html �C�O�����ɂ���
//checkout_m01.html �C�O�����ɂ���
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

//signup_02.html �����������q�l�ԍ��Ƃ́H
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

//signup_02.html �l���ی���j
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

//signup_02.html �l���ی���j
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


//signup_02.html ����K��
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

//signup_02.html ����K��
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

	//SP�p�}�C�y�[�W���j���[��������
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

	//pagetop@modal�p
	jQuery('.modal .pagetop > a').off('click');
	jQuery(document).on('click','.modal .pagetop', function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop(jQuery(e.target).closest('.modal-body')).to(0);
		return false;
	});

	//page���i�r,.tabtop�̋���
	jQuery('.page-nav .pn-body a, .tabtop > a, .clm2-guide .side-nav .active .sub-list a, a.anchor').on('click',function(e){
		jQuery.preventDefault(e);
		new AnimScrollTop().to(ReqUtil.getAnchor(jQuery(e.target).attr('href')));
		return false;
	});

	//page���i�r@modal�p
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
	//���ʂ�tooltip
	jQuery('[rel=tooltip]').tooltip();
	View.$manualTooltips = jQuery('[rel=tooltip][data-trigger=manual]');
	View.$manualTooltips.each(function(i,o){
		var $o = jQuery(o);
		if($o.hasClass('show'))$o.tooltip("show");
	});
	//�}�E�X�Ǐ]�^�c�[���`�b�v
	jQuery('[rel="fixed-tooltip"]').each(function(i,o){
		new FixedTooltip(jQuery(o));
	});

	/**
	 * modal�֘A�������B
	 */
	View.modal = new MiscModal();
	View.reqmodal = new ReqModal();
	jQuery(document).on('click.reqmodal.data-api'
		,'[data-toggle="reqmodal"]'
		,function(e){
			View.reqmodal.calleeToggle(e,this);
	});

	//�\���O�ɒ�������
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
	 * table��.odd,.even������B
	 */
	View.setTableOddEven();

	/**
	 * ���T�C�Y
	 */
	View.$w.bind('resize',View.windowResize_);
	View.$w.trigger('resize'); //������Ƃ��B

	/**
	 * hashchange�C�x���g�̃o�C���h
	 */
	View.$w.bind("hashchange",View.hashchange_);


	//historyBack(form���̂�)
	View.initForm.formBack();

	/**
	 * miscForm([��] CSS��misc-form�N���X�w�肪������̂̂ݏ������B)
	 */
	jQuery('form.misc-form').each(function(i,o){
		// View.$body.prepend('misc-form'+i+'����<br>'+o.action)
		// try{
		var helper = new FormHelper(jQuery(o));
		var num_selector = '.num-input';

		if(helper.$alltexts.length){
			//num-input�̓t�B���^������
			helper.addFilter(num_selector,FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
			helper.addFilter('.num-input-alpha',FormHelper.FILTER_TYPE.HALF_NUM_ALPHA,'remove');
			//��̃`�F�b�N
			helper.attachEmptyCheck(function(empties){
				if(empties.length && empties[0] instanceof jQuery){
					empties[0].trigger('focus');
				}
			},true);
		}

		helper.setSelectedValues(); //selected�̏����l�ݒ��defaultValue�ݒ�O�ɁI
		helper.setDefaults();
		// }catch(e){
		// 	jQuery.err('.misc-form �� new FormHelper() �ŃG���[',e)
		// }
	});


	/**
	 * �e�y�[�W��init������Ƃ����s
	 */
	View.initPage && View.initPage();

	/**
	 * location.hash������Ƃ���hashchange���s
	 */
	location.hash && View.$w.trigger("hashchange");

	if(!View.waitInitPage) View.onInitAll();

};//end initAll();


View.windowResize_ = function(){
	var ww = View.ww = View.$w.width();
	var wh = View.wh = View.$w.height();

	// //modal�p�c�Z���^�[�������T�C�Y
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
 * �ėp�n�b�V���`�F���W���̎󂯎M
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
View.hashchange_ = function(e){
	jQuery.log('[EVENT] hash changed.',"location.hash =>",location.hash);

	//�ʃy�[�W�Őݒ肵�Ă���hashchange�֐����ĂԁB
	if(typeof View.hashchangePage == 'function') View.hashchangePage(e);
};

/**
 * table.oddeven�ɃN���X������B����ł��ʂ��Ă����v�Ȃ悤�ɁB
 */
View.setTableOddEven = function($t){
	if(!($t instanceof jQuery))$t = View.$body;
	jQuery('.oddeven tr',$t).removeClass('odd even');
	// jQuery('.oddeven tr:odd',$t).addClass('even');
	// head���������邽�߂�.oddeven���ɂ���B
	jQuery('.oddeven',$t).each(function(){
		// var $this = jQuery(this);
		//:even��index�������̂��̂ƈ�v����̂ŋt�ɁB
		// jQuery('tr:even',$this).addClass('odd');
		// jQuery('tr:odd',$this).addClass('even');
		var idx = 0;
		jQuery('tr',jQuery(this)).each(function(){
			var $_this = jQuery(this);
			//.head�N���X���t���Ă���tr�͖���
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
 * �Z���N�g�{�b�N�X�������p��obj
 * @type {Object}
 */
View.selectboxInitObj = {
	speed: Conf.selectOpenSpeed
	,onOpen:function(sb){//�J���n�߂ɁA���ݑI�𒆂�option��scrollTop()����
		var sv,$sbopt,$list,$li,$a
			,$select = jQuery(this)
			,$optsel = jQuery(':selected',$select)
			,$sbh = $select.next('div.sbHolder') //holder.
		;
		if($optsel.length){
			if($optsel.length>1) $optsel = $optsel[0];
			sv = $optsel.val(); //�Fselected��val���擾
			$sbopt = jQuery('.sbOptions',$sbh);
			//�ŏ��ɏ�ɖ߂��Ă����i2��A���ŊJ�������΍�j
			$sbopt.scrollTop(0);
			// $list = jQuery('li',$sbopt);
			// maxh = 0;
			// $list.each(function(i,o){
			// 	maxh+=jQuery(o).height();
			// })
			$li = jQuery('li > a[rel="'+sv+'"]',$sbopt).parent();
			// jQuery.log($sbh,$li.position().top,$sbopt.height())//,maxh);
			var pt = ($li.length >= 1 && typeof $li.eq(0).position == 'function') ? $li.eq(0).position().top : 0;
			// li�����ԏ��肸�炷�i�I�𒆂̒l���O���Ȃ��悤�Ɍ����邽�߁j
			$sbopt.scrollTop(pt - $li.height());
		}
	}
}

/**
 * �݌ɕ\���̃t�B���^
 * @type {Object}
 */
View.stockBadge = {
	html:{
		many:'<mark class="icon ico-ex badge-stock2">�݌ɂ���</mark>'
		,less:'<mark class="icon ico-ex badge-stock1">�c��킸��</mark>'
		,empty:'<mark class="icon ico-ex badge-stock0">�݌ɂȂ�</mark>'
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
 * �G���[�Ď��p�N���X
 * .error���������肵����A
 * ��{�I�Ƀe�[�u�����H
 */
View.ErrorObserver = Class.extend({
	/**
	 * @param  {String} parentsSelector .error��T�����B�Ȃ��ꍇjQuery(document)
	 * @param  {Boolean} scrollEnables   �ŏ��Ɍ��������G���[�ɃX�N���[�������邩�B:true
	 * @param  {[type]} tableMode       def:true �e�[�u������Ȃ��ꍇ��View.ErrorObserver.ATTR_WRAPPER���w�肵�Ă����΂������B
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
	 * ��html�Ō��m���Ă���̂ŁA�S���������e��html���o�^����Ă���ꍇ�͋��������������Ȃ鋰�ꂠ��B
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
	 * .error�ɔw�i��ǉ����ăX�N���[��
	 * @param  {[type]} $err �����I�Ɏw�肳���΂���̂ݔw�i�ǉ�+�X�N���[���H
	 * @param {Boolean} scrollEnables def:this.scrollEnables()>true
	 * @return {[type]}
	 */
	,attach:function($err,scrollEnables){
		scrollEnables = typeof scrollEnables == 'undefined' ? this.scrollEnables:false;
		var fT = [];
		if($err && $err.length){

			$err.each(jQuery.proxy(function(i,o){
				$e = jQuery(o);
				//�w�肠��
				var t = this.getTarget($e);
				if(!t){
					//�o�^����Ă��Ȃ��ꍇ�A�V�K�o�^
					t = new View.ErrorObserveTarget($e,this.targets.length);
					this.targets.push(t);
					fT.push(t);
				}else{
					jQuery.log('View.ErrorObserver::attach() ���ɓo�^����Ă���^�[�Q�b�g���n����܂����B',this.targets,' $e:',$e);
				}
			},this));
		}else{
			//�S����.error�ɁB
			//�S���ǉ��O�ɂ͈��kill?
			// this.detach();
			jQuery('.'+View.ErrorObserver.KLASS_ERROR,this.$).each(jQuery.proxy(function(i,o){
				this.targets.push(new View.ErrorObserveTarget(jQuery(o),i));
			},this));
			// if(this.targets.length>0) fT = this.targets[0];
			fT = this.targets;
		}
			//�X�N���[������H���g��������̂ōŏ��̂�ɁB�i�w�i�F�ς����ꍇ�͔w�i�̊J�n�ʒu�j
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
	 * $err�̎w��I�u�W�F�N�g���Ȃ��ꍇ�͑S�āB
	 * @param  {[type]} $target [description]
	 * @return {[type]}         [description]
	 */
	,detach:function($err){
		if($err && $err.length){
			//�w�肠��
			$err.each(jQuery.proxy(function(i,o){
				var $e = jQuery(o);
				var t = this.getTarget($e);
				if(t){
					this.targets.splice(t.id,1);
					t.kill();
				}else{
					jQuery.err('View.ErrorObserver::detach() �w�肳�ꂽ�^�[�Q�b�g��this.targets[]���猩����܂���ł����Bthis.targets:',this.targets,' $e:',$e);
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
View.ErrorObserver.ATTR_WRAPPER = 'data-error-wrapper';//���b�s���O�p
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
			//�G���[���͂ރZ���N�^���w�肳��Ă��鎞
			this.$wrapper = jQuery(selector);
		}else{
			//�Z���N�^�w�肪�Ȃ��Ƃ��͒��߂�tr
			if (viewflag !== "PC" && window.innerWidth < 768){
				// SP�̏ꍇ
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
		//���g������Ƃ��̂�enabled.�����Ƃ��͗v�f���B��
		if(!this.text){
			this.enabled = false;
			this.$err.addClass(View.ErrorObserver.KLASS_HIDE);
		}else{
			this.$err.removeClass(View.ErrorObserver.KLASS_HIDE);
			if(this.$wrapper.length){
				// SP�̏ꍇ
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
		//���I�ɏ����ꂽ��cssClass�����H
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
 * �ėp�I�ɂł���t�H�[���֘A�̏�����fnc�Z�b�g
 * @type {Object}
 */
View.initForm = {}
/**
 * ��������͂̏������B
 * @param  {[type]} helper        FormHelper
 * @param  {[type]} noSetDefaults ��������helper.setDefaults()����H
 * @param  {[type]} isSp        mobileDevice�p�t���O
 */
View.initForm.addresses = function(helper, noSetDefaults, isSp){
	var _sfx = isSp ? '_sp': '';

	//���N�����p
	helper.initDateSelects('#birthdayYearSelect'+_sfx,'#birthdayMonthSelect'+_sfx,'#birthdayDaySelect'+_sfx,'�|',1900,new Date().getFullYear(),false,false);
	//40�N�O�̔N��I���i���� data-selected-value �������ĂȂ����̂݁j
	var $yearSelect = jQuery('#birthdayYearSelect'+_sfx);
	if(!$yearSelect.attr(helper.attr_selectedValue)){
		$yearSelect.attr(helper.attr_selectedValue, new Date().getFullYear()-Conf.defBirthdayYearSelectDiff)
	}


	//�S�p�K�{
	helper.addFilter('.htof-input',FormHelper.FILTER_TYPE.HALF_TO_FULL);

	//�J�i
	helper.addFilter('.kana-input',FormHelper.FILTER_TYPE.FULL_KANA);

	//���l
	helper.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');

	//zipcode�n
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
			// jQuery.log('�Z�����͂̂����ǂꂩ�ɕύX���������B'+this.newVal);
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
	//�s�撬��input�i�u���p/�B���Ă�j��onChange
	$city.on('change',cityChangeFn);
	//�S�Ă�zip�Ɋ֌W����addrinput�ύX��
	// $pref.on('change',allAddressInputsChangeFn);
	// $city.on('change',allAddressInputsChangeFn);
	// $addr1.on('change',allAddressInputsChangeFn);
	// $addr2.on('change',allAddressInputsChangeFn);

	//hiddenField��change�C�x���g�`�F�b�N��interval�ŉ񂷂����Ȃ��̂�����B
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

	//�l�������Ă���ꍇ������̂ň�񂾂�����Ă����B
	cityChangeFn();

	/*
	///zipcode�n sp�p
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
			// jQuery.log('�Z�����͂̂����ǂꂩ�ɕύX���������B'+this.newVal);
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
	//�s�撬��input�i�u���p/�B���Ă�j��onChange
	$citysp.on('change',cityChangeFn);
	//�S�Ă�zip�Ɋ֌W����addrinput�ύX��
	// $prefsp.on('change',allAddressInputsChangeFn);
	// $citysp.on('change',allAddressInputsChangeFn);
	// $addr1sp.on('change',allAddressInputsChangeFn);
	// $addr2sp.on('change',allAddressInputsChangeFn);

	//hiddenField��change�C�x���g�`�F�b�N��interval�ŉ񂷂����Ȃ��̂�����B
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

	//�l�������Ă���ꍇ������̂ň�񂾂�����Ă����B
	cityChangeFn();
	*/

	//mail
	// helper.addFilter('#emailInput',FormHelper.FILTER_TYPE.EMAIL,'remove');

	if(!noSetDefaults){
		helper.setSelectedValues();
		helper.setDefaults();
	}

	//jQuery.selectbox�̍ď�����
	// jQuery('select',helper.$).selectbox('detach').selectbox('attach');
	//:selected�̒����I���e�X�g
	jQuery('select',helper.$).selectbox('detach').selectbox(View.selectboxInitObj);
};



/***   �X�}�[�g�t�H���p     *****/

View.initForm.addressesSp = function(helper_sp,noSetDefaults){

	//���N�����p
	helper_sp.initDateSelects('#birthdayYearSelect','#birthdayMonthSelect','#birthdayDaySelect','�|',1900,new Date().getFullYear(),false,false);
	//40�N�O�̔N��I���i���� data-selected-value �������ĂȂ����̂݁j
	var $yearSelect = jQuery('#birthdayYearSelect');
	if(!$yearSelect.attr(helper_sp.attr_selectedValue)){
		$yearSelect.attr(helper_sp.attr_selectedValue, new Date().getFullYear()-Conf.defBirthdayYearSelectDiff)
	}

	//�S�p�K�{
	helper_sp.addFilter('.htof-input',Formhelper_sp.FILTER_TYPE.HALF_TO_FULL);

	//�J�i
	helper_sp.addFilter('.kana-input',Formhelper_sp.FILTER_TYPE.FULL_KANA);

	//���l
	helper_sp.addFilter('.num-input',Formhelper_sp.FILTER_TYPE.HALF_NUMBER,'remove');

	//mail
	// helper_sp.addFilter('#emailInput_sp',Formhelper_sp.FILTER_TYPE.EMAIL,'remove');

	if(!noSetDefaults){
		helper_sp.setSelectedValues();
		helper_sp.setDefaults();

	}

	//jQuery.selectbox�̍ď�����
	// jQuery('select',helper_sp.$).selectbox('detach').selectbox('attach');
	//:selected�̒����I���e�X�g
	jQuery('select',helper_sp.$).selectbox('detach').selectbox(View.selectboxInitObj);
};


/**
 * onChange�Ō����ڂ����t���b�V��������K�v�̂���Z���N�g�{�b�N�X�Q�ւ̃C�x���g�ǉ��B
 * ���[�U�[�̑I�������l�ɂ���đ��̃Z���N�g�{�b�N�X���A��������t�I���ȂǂɁB
 * �� �O���[�v���͂����Ƃ��Ȃ��ƁA�O���[�v���̑Ώ�selectbox���]��ɑ�����Ə����d�ɂȂ�B
 * �� �C�x���g�̏��Ԃɍ��E����镔�������邽�߁A�K��formHelper��init+setSelectedValues���ƂɎ��s������B(FormHelper�̃C�x���g�S����namespace��������v��������
 * @param  {[type]} $parent �Ώۂ�����jqObj
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
			$sel.selectbox("detach").selectbox(View.selectboxInitObj);//�܂�����
			if(gn){
				//�O���[�v��������Ƃ��A�����ȊO�̃O���[�v�S���ɑ΂���selectbox()
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

//�p�X���[�h������{�^��
View.initForm.showHidePassword = function($pwInput,$btn){
	$btn.on('click',jQuery.proxy(function(e){
		//type�͕ύX�ł��Ȃ��̂�html�E���ĕ�����u�����Ȃ��Ƃ����Ȃ��B
		// var t = $pwInput.attr('type');
		// var toggleOn = false;
		// if(t == 'text'){$btn.removeClass('toggle-on')}else{$btn.addClass('toggle-on');}
		// $pwInput.attr('type',t == 'text' ? 'password':'text');
	},this))
}

//form���ɂ���u�O�̃y�[�W�ɖ߂�v�p
View.initForm.formBack = function(){
	var $aa = jQuery('form a.form-back');
	var click_ = function(e){
		var $a,$form,k,helper,v = true;
		jQuery.preventDefault(e);
		$a = jQuery(e.target);
		if($a.get(0).tagName.toLowerCase() !== 'a')$a = $a.closest('a');
		k = $a.attr('name');
		$a.attr('name','');//���O��Ԃ����Ԃ邩������Ƃ��B
		// v = $a.attr('data-post-value');
		// if(!v)v = true;
		$form = $a.closest('form');
		if(!$form.length){
			jQuery.err('View.initForm.formBack() : �e�ƂȂ�form��������܂���B');
			return;
		}
		if(!k){
			jQuery.err('View.initForm.formBack() : a��name�������ݒ肳��Ă��܂���B');
			return;
		}
		helper = $form.data('FormHelper');
		if(!helper){
			jQuery.log('form�ɂ�helper���ݒ肳��Ă��܂���B');
		}else{
			helper.unsetDefaults();
		}
		$form.append('<input type="hidden" name="'+k+'" value="'+v+'">');
		$form.trigger('submit');
	}
	$aa.on('click',jQuery.proxy(click_,this));
}


/**
 * DOM��show()hide()��css�N���X��t�^���Aopcity��animate
 */
var ShowHideSprite = Class.extend({
	$:null
	,shownFD:false
	,duration:320
	/**
	 * INIT
	 * @param  {[type]} $target          [description]
	 * @param  {[type]} duration         �A�j���[�V����duration.
	 * @param  {[type]} shownFirstDetect �ŏ��̏�Ԃŕ\�����邩�ǂ����B
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
 * s.hide(); -> ����
 * s.show(); -> �O�Ɏw�肵��target��show
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
			//obj�ݒ肳��Ă�����̂̂�
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
			jQuery.log("[!] SpinnerControler :: Spinner�\����target���w�肳��Ă��܂���B body��target�ɂ��܂��B");
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
 * ���IModal�e���v��
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
	+'		<button type="button" class="btn btn-baige close" data-dismiss="modal" aria-hidden="true"><i class="icon ico-ex btn16-cross-0">�~</i><span class="text tx-btn s16-close">����</span></button>'
	+'		<h3 id="miscModalLabel">&nbsp;</h3>'
	+'	</div>'
	+'	<div class="modal-body"><div class="modal-body-iwrap">&nbsp;</div></div>'
	//+'	<div class="modal-footer"><button type="button" class="btn btn-baige close showSp" data-dismiss="modal" aria-hidden="true"><i class="icon ico-ex btn16-cross-0">�~</i><span class="text tx-btn s16-close">����</span></button></div>'
	+'</div>'
	,isShown:false

	/**
	 * @param  {[type]} centering       �������������s���邩�Bdef:true
	 * @param  {[type]} backdropEnables �w�i��\������Hdef:true
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
		//�{��modal�p�C�x���g��ǉ�?
		this.$
			.on('show',jQuery.proxy(function(){this.isShown = true;},this))
			.on('hide',jQuery.proxy(function(){this.isShown = false;},this))
		;
		//������
		// this.$.modal({'backdrop':this.backdropEnables});
		this.setId();

		// jQuery('.misc-modal-close',this.$).bind('click',jQuery.proxy(function(e){
		// 	jQuery.preventDefault(e);
		// 	this.hide();
		// 	return false;
		// },this));
	}


	/**
	 * �ݒ肵�ĕ\���B��{�����n���Ȃ��Ă��\��OK.
	 * @param  {String} title     String(or HTML)
	 * @param  {String} content   .modal-body��html.
	 * @param  {String} size      "S|M|L"
	 * @param  {Boolean} errorMode �G���[�\���Hdefault:false
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
		// remote�͏��off(reqmodal�Ƃ���href=""�����鎞�A�ςȋ���������̂�)
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
	 * modal�̋�`�w��
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
				//������������
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

		//���ɊJ���Ă���ꍇ��diaplay:block;
		if(this.isShown) this.$.show();
	}

});
MiscModal.InstanceCnt = 0;
MiscModal.EVT = {
	SHOW:'modalShow'
	,HIDE:'modalHide'
};

/**
 * ���N�G�X�g�𔺂�modal
 * @type {[type]}
 */
var ReqModal = MiscModal.extend({
	init:function(){
		this._super();
		this.spinner = new SpinnerControler('S');
	}
	,url:''
	,attr_modal_size:'data-modal-size'
	,attr_page_title:'data-modal-title'//�����Ƃ���target.text()
	,attr_parts_selector:'data-modal-parts' // data-modal-parts = ".taco > #nama" �Ȃ�
	,spinner:null
	/**
	 * jQuery(document).on('click.miscmodal.data-api', '[data-toggle="miscmodal"]',function(e){new MiscModal().calleeToggle(e,this);});
	 * �Ȃ񂩂ŌĂ΂ꂽ���Bthis�͑������Ɉ����p���B
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	,calleeToggle:function(e,calleeScope){
		var $callee = jQuery(calleeScope);
		jQuery.preventDefault(e);
		this.url = $callee.get(0).href;

		//���^�C�g����ǂݍ��ݐ�̃Z���N�^�ݒ�� data-modal-* attr�D��
		this.page_title = $callee.attr(this.attr_page_title) || $callee.text() || '&nbsp;';
		this.parts_selector = $callee.attr(this.attr_parts_selector) || ReqUtil.getAnchor(this.url) || false;
		var resize = $callee.attr(this.attr_modal_size);
		if(resize) this.setSize(resize);

		// this.$.modal({'remote':$callee.href});
		// modal��spinner��\��
		this.spinner.show(this.$bodyIWrap);

		this.show(this.page_title); //modal�̒��g��ݒ�
		// this.setPosition(); //�|�W�V��������
		//�ǂݍ���
		jQuery.ajax({
			//#��?�ȉ��͏������Ĉ�ӂ�url�œǂށB
			url:ReqUtil.makeUniqueUrl(ReqUtil.removeParams(this.url))
			,dataType:'html'
			,success:jQuery.proxy(this.onLoad_,this)
			,error:jQuery.proxy(this.onError_,this)
		});
	}
	,onLoad_:function(html){
		// [TODO]�ǂݍ���htm���̃p�X���������ǂ����܂���
		this.$htm = ReqUtil.html5str2jqo(html);
		this.spinner.hide();

		jQuery.log('ReqModal:�y�[�W�̓ǂݍ��݂��������܂����B\n	url :', this.url);
		jQuery.log('	selector:',this.parts_selector);
		jQuery.log('	jQuery(selector,jQuery(html)):', this.$htm);

		if(this.parts_selector !== false){
			this.setContents(this.page_title,jQuery(this.parts_selector,this.$htm));
		}else{
			this.setContents(this.page_title,this.$htm);
		}
		this.setPosition();//�z�u�C��
	}
	,onError_:function(){
		this.spinner.hide();
		this.setContents('�ʐM�G���[','<p>&quot;'+this.url+'&quot;�̓ǂݍ��݂Ɏ��s���܂����B</p>',true);
	}
});


/**
 * �G���[�\���֘A�̃��\�b�h�����N���X�g���p
 */
var AjaxErrorImpl = Class.extend({
	api:'url'
	,ajax_error_:function(xhr,stat,errThrown){
		this.showError('���N�G�X�g�G���[','<p>&quot;'+this.api+'&quot; �̓ǂݍ��݂Ɏ��s���܂����B</p>');
		jQuery.log('AjaxErrorImpl::ajax_error_ :',xhr,stat,errThrown);
	}
	/**
	 * View.Modal��ł̃G���[�\���B�Ȃ��ꍇ��console�ɏo��
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
	 * ���ߍ��݃G���[�\��
	 * @param  {[type]} content html���B�����A�擪�ɃC�����C���v�f��<i>�����邽�߁A�{�b�N�X�v�f�����Ɖ��s���܂��B
	 * @param  {[type]} $target [description]
	 * @param {[type]} removeBefore �O�ɕ\�����Ă��G���[�i�S���j����
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
		// var $e = jQuery('<p>').addClass('error error-box hide small'); //�ŏ��͏���?�B
		var $e = jQuery('<p>').addClass('error error-box small'); //���I�ɏo�������������Ȃ��Ă������B
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
 * �G���[modal�t��json�ploader�N���X
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
 * ���iDB�p�N���Ximpl�B�K�v���C�u���������̂���init��this._super();���Ă��������B
 * @type {[type]}
 */
var ItemDBImpl = AjaxErrorImpl.extend({
	dat:{}//json
	,db:{
		"error":{
			"title":"�G���[�n���h�����O"
			,"content":"����error�I�u�W�F�N�g������ꍇ�̓G���[���e���\�������悤�ɂ��܂��B"
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
				"�F"
				,"�T�C�Y"
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


	//qty�ȊO�̑I�������l������B{"color":color.uid}�Ƃ�
	,optSelectedNow:null

	,init:function(){
		this.dat = {};
		if(!TAFFY){jQuery.err('ItemDBImpl::init()','taffy.js���K�v�ł��B');}
		if(!JSON || JSON && typeof JSON.parse != 'function'){jQuery.err('ItemDBImpl::init()','IE7�ȍ~��json2.js���K�v�ł��B');}
	}


	// this.dat�̐���������
	,_validData:function(){
		return this.dat && this.dat.column && this.dat.options && this.dat.stock ? true : false;
	}

	,clmlen:0,stocklen:0,allStockCnt:0
	/**
	 * stock�pdb�������Bdata���A���Ă�������B
	 * @return {[type]} [description]
	 */
	,stockDBInit:function(){
		var i,label;
		//���f�[�^�x�[�X�͎Q�Ɠn���Ȃ̂œs�x����������B
		this.db = {};
		// jQuery.log(this.dat);//this.db.stock);
		this.db.stock = TAFFY(this.dat.stock); //[XXX] >>> IE�ŃG���[�f���Ă��B���S�ɂȂ����ĂȂ��B
		jQuery.log(this.db.stock().select("stock"));

		this.db.options = {};//new Object();


		//�J��Ԃ��p��
		this.clmlen = this.dat.column.label.length;
		this.stocklen = this.dat.stock.length;

		//options����
		for (i = 0; i < this.clmlen; i++) {
			label = this.dat.column.label[i];
			this.db.options[label] = TAFFY(this.dat.options[label]);
		}

		//�S�݌ɂ����邩�ǂ���
		var stocks = this.db.stock().select("stock");
		this.allStockCnt = 0;
		for (i = stocks.length - 1; i >= 0; i--) {
			this.allStockCnt+=Number(stocks[i]);
		}
		jQuery.log("�S�݌ɐ��F",this.allStockCnt);
	}

	,dbGetOptCache:[]

	//option[label]����uid���擾�Hselect()�ł��������B
	,dbGetOpt:function(label,uid){
		if(!this._validData())return {};
		var i,opts = this.dat.options[label],r;
		for (i = opts.length - 1; i >= 0; i--) {
			if(opts[i].uid === uid){
				r = opts[i];
				// this.dbGetOptCache.push() //�L���b�V���͂��Ȃ��H
				break;
			}
		}
		return r || {};
	}

	//<select> > <option>�ɒǉ�����uid�p�v�f�B
	,attr_uid:'data-unique-id'

	,dbGetSelectOptionHtm:function(label){
		// return this.db.options[label]().supplant('<option value="{num}" '+this.attr_uid+'="{uid}">{name}({num})</option>');
		// return this.db.options[label]().supplant('<option value="{uid}" '+this.attr_uid+'="{uid}">{name}({num})</option>');
		// (opt.num)�͂���Ȃ��B
		return this.db.options[label]().supplant('<option value="{uid}" '+this.attr_uid+'="{uid}">{name}</option>');
	}
});

/**
 * ItemDBImpl���p���������i�f�[�^�\���֘A�̃N���X
 * @type {[type]}
 */
var ItemSelectView = ItemDBImpl.extend({
	setAllView:function(){
		if(!this.db.stock) return false;
		return true;
	}

	/**
	 * selectbox���L�����ǂ���(�l�����邩�ǂ���)����
	 * @param  {[type]} column_label [description]
	 * @return {[type]}              [description]
	 */
	,optEnables:function(column_label){
		return this.dat.options[column_label] && this.dat.options[column_label].length;
	}
	/**
	 * selectbox��\�����Ȃ��ꍇ�̃`�F�b�N�B
	 * selectbox���L���ł������Ƃ��ł��A�l��1�Ŋ��l�̖��̂���"-"�������Ƃ�true
	 * @param  {[type]} column_label [description]
	 * @return {[type]}              [description]
	 */
	,optHasOneEmptyNameField:function(column_label){
		var ln = this.dat.options[column_label][0].name;
		return this.dat.options[column_label] && this.dat.options[column_label].length == 1 && (Boolean(ln) === false || ""+ln === '-');
	}

	,optSelectedNow:{}

	/**
	 * �Ԃ񓊂���selectbox��option�l��html�ɂ��ďE���B
	 * AddToCart�N���X�ŃJ�[�g�ɓ��ꂽ��setView()�A.item-box�̓��e�u���ȂǂŎg�p
	 * @return {[type]} [description]
	 */
	,getPostedOptionsHtml:function(){
		// var fmt='<p class="options">�F�F<em>��(06)</em>, �T�C�Y�F<em>S(01)</em></p>'
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
			// htm_arr.push(hn+'�F<em>'+name+'('+num+')</em>');
			htm_arr.push(hn+'�F<em>'+name+'</em>');
		}
		return htm_arr.join(', ');
	}
});


// �}�E�X�ʒu�ɒǏ]����BootstrapTooltip��Extend
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
			// jQuery('[rel=fixed-tooltip]') �ŏ������͂��Ȃ��Ă������H
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
	
	//���[�_���̃Z�b�e�B���O
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
	
	//�J���[�Z���̃Z�b�e�B���O
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
	
	//�J���[�Z�������ʂ̐���
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
