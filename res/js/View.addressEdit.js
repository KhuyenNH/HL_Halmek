View.initPage = function(){
	//formhelper
	//var helper = new FormHelper(jQuery('#addressForm'));
	var helper1 = new FormHelper(jQuery('#addressForm'));
	var helper2 = new FormHelper(jQuery('#addressForm_sp'));
	//全角必須
	// helper.addFilter('.ftoh-input',FormHelper.FILTER_TYPE.FULL_TO_HALF);
	
	//数値
	// helper.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');

	//View.initForm.addresses(helper);
	View.initForm.addresses(helper1);
	View.initForm.addresses(helper2,0,1);
	// View.initForm.dynamicRefleshSelect();
	// helper.setSelectedValues();
	// helper.setDefaults();
};

View.hashchangePage = function(e){
};

jQuery(function(){
	jQuery("article.oversea").load("/ec/html/guide/23.html #s17");
});