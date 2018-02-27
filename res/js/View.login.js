View.initPage = function(){
	var helper = new FormHelper(jQuery('#loginForm'));
	
	helper.addFilter('#emailInput',FormHelper.FILTER_TYPE.EMAIL,'remove');

	helper.setDefaults();

	var helper2 = new FormHelper(jQuery('#loginForm2'));
	
	helper2.addFilter('#emailInput2',FormHelper.FILTER_TYPE.EMAIL,'remove');

	helper2.setDefaults();
};

View.hashchangePage = function(e){
};


jQuery(function(){
	jQuery(".modalStyle").on("click", function() {
	jQuery(".howtowrap").slideToggle(100, 'swing');
	});
});

jQuery(function(){
	jQuery(".howtowrap .close-btn").on("click", function() {
	jQuery(".howtowrap").slideToggle(100, 'swing');
	});
});