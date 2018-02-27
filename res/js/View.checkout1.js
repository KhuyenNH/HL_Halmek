View.initPage = function(){
	//formhelper
	var helper1 = new FormHelper(jQuery('#deliveryForm'));
	var helper2 = new FormHelper(jQuery('#deliveryForm_sp'));
	
	View.initForm.addresses(helper1);
	View.initForm.addresses(helper2,0,1);
	// View.initForm.dynamicRefleshSelect();
	
	// View.initForm.addresses(helper);
	// View.initForm.dynamicRefleshSelect();
	helper1.setSelectedValues();
	helper1.setDefaults();
	
	//sp
	helper2.setSelectedValues();
	helper2.setDefaults();
};


