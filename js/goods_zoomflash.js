jQuery(function() {
	var qs = '';
	jQuery('#gallery a.info').each(function(i){
		qs += 'image' + String(i + 1) + '=' + this + '&';
	});

	jQuery('#gallery a.info').bind("click", function(){
		var url = qs + 'focus=' + this;
		window.open(EC_WWW_ROOT + '/zoom.html?' + url,null,'width=750,height=750,menubar=no,toolbar=no,location=no,status=no');
		return false;
	});
});