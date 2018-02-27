jQuery(document).ready(function() {

	var userAgent = window.navigator.userAgent.toLowerCase();
	
	if (userAgent.indexOf("msie 8.") != -1) {
		jQuery('textarea, input:text, input:password').each(function() {
			PIE.attach(this);
		});
	}


});