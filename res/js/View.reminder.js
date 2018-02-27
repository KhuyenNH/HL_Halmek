View.initPage = function(){
	//formhelper
	var helper = new FormHelper(jQuery('#reminderForm'));
	
	//email
	helper.addFilter('#emailInput',FormHelper.FILTER_TYPE.EMAIL,'remove');

	//数値
	helper.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');

	helper.setDefaults();
	// View.initForm.addresses(helper);
	// View.initForm.dynamicRefleshSelect();
};

View.hashchangePage = function(e){
};

	jQuery(function(){
	var win_width = window.innerWidth;
	//var flowWidth = jQuery(".flow-navs.flow-5").width();
	//alert(win_width);
	//alert(flowWidth);
	var flow5Height = jQuery('.flow-navs.flow-5').height();
	var win_width = window.innerWidth;
	if (26 < flow5Height){
		jQuery(".flow-navs.flow-5 ol + ol").css("float","right");
		jQuery(".flow-navs.flow-5").css("background","#F2EEEA");
		jQuery(".flow-navs.flow-5 ol").css("border-bottom","1px solid #FFF");
		jQuery(".flow-navs.flow-5 ol").css("border-top","1px solid #FFF");
		jQuery(".flow-navs.flow-5.flowEnd").removeClass("fin");
		jQuery(".flow-navs.flow-5.flowEnd").css("background","#F2EEEA");
	} else {
		jQuery(".flow-navs.flow-5 ol + ol").css("float","left");
		jQuery(".flow-navs.flow-5").css("background","#D2C7BF");
		jQuery(".flow-navs.flow-5 ol").css("border-bottom","none");
		jQuery(".flow-navs.flow-5 ol").css("border-top","none");
		jQuery(".flow-navs.flow-5.flowEnd").addClass("fin");
		jQuery(".flow-navs.flow-5.flowEnd").css("background","#4B1E00");
	}


	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			var flow5Height = jQuery('.flow-navs.flow-5').height();
			var win_width = window.innerWidth;
	if (26 < flow5Height){
				jQuery(".flow-navs.flow-5 ol + ol").css("float","right");
				jQuery(".flow-navs.flow-5").css("background","#F2EEEA");
				jQuery(".flow-navs.flow-5 ol").css("border-bottom","1px solid #FFF");
				jQuery(".flow-navs.flow-5 ol").css("border-top","1px solid #FFF");
				jQuery(".flow-navs.flow-5.flowEnd").removeClass("fin");
				jQuery(".flow-navs.flow-5.flowEnd").css("background","#F2EEEA");
			} else{
				jQuery(".flow-navs.flow-5 ol + ol").css("float","left");
				jQuery(".flow-navs.flow-5").css("background","#D2C7BF");
				jQuery(".flow-navs.flow-5 ol").css("border-bottom","none");
				jQuery(".flow-navs.flow-5 ol").css("border-top","none");
				jQuery(".flow-navs.flow-5.flowEnd").addClass("fin");
				jQuery(".flow-navs.flow-5.flowEnd").css("background","#4B1E00");
			}
		}, 200);
	});

});