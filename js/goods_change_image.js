// �摜�ؑ֏���
function initChangeImage() {
	var href;
	var src;
	var comment;
	
	jQuery('[id^=change_image]').each( function() {
		jQuery(this).bind('click', function() {
			href = jQuery(this).find('a').attr('href');
			src = jQuery(this).find('img').attr('src');
			comment = jQuery(this).find('p').text();
			
			// �����N
			if (href != undefined) {
				jQuery('#large_image').find('a').attr('href',href);
			}
			else {
				jQuery('#large_image').find('a').attr('href',"javascript:void(0)");
			}
			
			// �摜�p�X
			if (src != undefined) {
				jQuery('#large_image').find('img').attr('src',src);
			}
			else {
				jQuery('#large_image').find('img').attr('src',"");
			}
			
			// �R�����g
			if (comment != undefined) {
				jQuery('#large_image').find('p').text(comment);
			}
			else {
				jQuery('#large_image').find('p').text("");
			}
			
			return false;
		});
	});
}