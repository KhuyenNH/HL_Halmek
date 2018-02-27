View.initPage = function(){
	//formhelper
	var helper1 = new FormHelper(jQuery('#updateMemberForm'));
	var helper2 = new FormHelper(jQuery('#updateMemberForm_sp'));
	
	//email
	helper1.addFilter('.email-input',FormHelper.FILTER_TYPE.EMAIL,'remove');
	helper2.addFilter('.email-input',FormHelper.FILTER_TYPE.EMAIL,'remove');

	//View.initForm.addresses(helper);
	View.initForm.addresses(helper1);
	View.initForm.addresses(helper2,0,1);
	View.initForm.dynamicRefleshSelect();

	// SP版の[前へ][次へ]ボタンにクラスを追加する
	var $prevPage = jQuery('.paging .arrowL').parent();
	var $nextPage = jQuery('.paging .arrowR').parent();
	if ($prevPage[0]) $prevPage.addClass('prevPage');
	if ($nextPage[0]) $nextPage.addClass('nextPage');

};

View.hashchangePage = function(e){
};

jQuery(function(){
	jQuery("article.oversea").load("/ec/html/guide/23.html #s17");
});