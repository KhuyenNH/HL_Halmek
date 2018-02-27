jQuery(function() {
	if (isIE() && isIE() <= 8) {
		jQuery('#gallery a.info').attr("rel", "lightbox");
	} else {
		jQuery('#gallery a.info').attr("rel", "lightbox").attr("data-lightbox", "goods-image-set");
	}
	
	// IEのバージョン取得(IE10まで)
	function isIE() {
		var nav = navigator.userAgent.toLowerCase();
		return (nav.indexOf('msie ') != -1) ? parseInt( nav.split('msie ')[1].split(';')[0] ) : false;
	}
});