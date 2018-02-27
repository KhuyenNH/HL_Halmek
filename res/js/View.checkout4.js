View.initPage = function(){
	//formhelper
	// var helper = new FormHelper(jQuery('#paymentForm'));
	
	// View.initForm.addresses(helper);
	// View.initForm.dynamicRefleshSelect();
	// helper.setSelectedValues();
	// helper.setDefaults();
	
	// tableRowChecker
	jQuery('.table-selectable > tbody > tr').on('click',function(e){
		jQuery.cancelBubble(e);
		jQuery(':radio',jQuery(this)).screwDefaultButtons("check");
	});
};

View.hashchangePage = function(e){
};