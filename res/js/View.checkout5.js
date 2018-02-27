View.initPage = function(){
	/**
	 * balloon(submitボタンのやつ)
	 */
	// this.hideAllBalloons_ = jQuery.proxy(this.hideAllBalloons,this);
	var ATTR_ = 'data-is-card-payment';
	var $ccp = jQuery('#sec5 span['+ATTR_+']');
	var $ccpBalloon = jQuery('.btn-block .additional-balloon');
	if($ccp.length && Number($ccp.attr(ATTR_)) == 1){
		$ccpBalloon.each(jQuery.proxy(function(i,o){
			var $b = jQuery(o);
			$b.tooltip({
				html:true
				,placement:'top'
				,trigger:'manual'
			});
			var $bb = $b.closest('.btn-block');
			var $btn = jQuery('button[type=button]',$bb);
			$btn.on('mouseenter',jQuery.proxy(function(e){
				$b.tooltip('show');
			},this));
			$btn.on('mouseleave',jQuery.proxy(function(e){
				$b.tooltip('hide');
			},this));
		},this));

	}
	
	/**
	 * クレジットカード入力画面の有効期限初期表示
	 */
	//年入力の初期値は今年（下２桁）
	jQuery('#expirationYearInput').attr('placeholder',StringUtil.fillZeros(String(new Date().getYear()).substr(1,2),2));

	//sp
	jQuery('#expirationYearInput_sp').attr('placeholder',StringUtil.fillZeros(String(new Date().getYear()).substr(1,2),2));
	
	//formhelper
	var helper = new FormHelper(jQuery('#cardPaymentForm2'));

	//sp
	var helper2 = new FormHelper(jQuery('#cardPaymentForm2_sp'));
	
	//全角必須
	// helper.addFilter('.ftoh-input',FormHelper.FILTER_TYPE.FULL_TO_HALF);
	//スペースも置換対象に。
	helper.addFilter('.ftoh-input',FormHelper.FILTER_TYPE.FULL_TO_HALF,undefined,undefined,{'space':true});

	//sp
	helper2.addFilter('.ftoh-input',FormHelper.FILTER_TYPE.FULL_TO_HALF,undefined,undefined,{'space':true});
	
	//数値
	helper.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
	

	//sp
	helper2.addFilter('.num-input',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');


	// View.initForm.addresses(helper);
	// View.initForm.dynamicRefleshSelect();
	helper.setSelectedValues();
	helper.setDefaults();
	
	

	//sp
	helper2.setSelectedValues();
	helper2.setDefaults();


};

View.hashchangePage = function(e){
};