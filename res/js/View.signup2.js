View.initPage = function(){

	//json読み込み終わるまで止めとく。
	View.waitInitPage = 1;

	var loader = new View.SimpleJsonLoader();
	loader.success = function(dat){
		if(!dat.research){
			// this.showError('データ解析エラー','<p>&quot;'+this.api+'&quot; のデータを解析できませんでした。</p>');
			return;
		}
		//jsonパースしてプルダウン内容へ。
		var arr = dat.research;
		var len = arr.length;
		var i,opts=[];
		opts.push('<option disabled="disabled" selected="selected" value="">▼選択してください</option>');
		for (i = 0; i < len; i++) {
			opts.push('<option value="'+arr[i].value+'">'+arr[i].content+'</option>');
		};
		
		var win_width = window.innerWidth;
		if (win_width < 768){
			//console.log(win_width);
			opts.push('<optgroup label=""></optgroup>');
		}
			
		jQuery('#triggerSelect').html(opts.join(''));
		jQuery('#triggerSelect_sp').html(opts.join(''));
		//formhelper
		var helper = new FormHelper(jQuery('#signupForm'));
		var helper2 = new FormHelper(jQuery('#signupForm_sp'));
		
		View.initForm.addresses(helper);
		View.initForm.addresses(helper2,0,1);
		View.initForm.dynamicRefleshSelect();

		var $cnInput = jQuery('#customerNumberInput');
		var cnInputFn = function(){
			var $wrap = $cnInput.parent(),
					$tip = $wrap.data('tooltip').tip()
				;
			if(!$cnInput.val()){
				if(!$tip.hasClass('in')) $wrap.tooltip('show');
			}else{
				if($tip.hasClass('in')) $wrap.tooltip('hide');
			}
		};
		$cnInput.on('blur',cnInputFn);
		cnInputFn();
		// $cnInput.tooltip('show');

		//pwを見る
		// View.initForm.showHidePassword(jQuery('#passwordInput',helper.$),jQuery('#password1ShowBtn',helper.$));
		// <button type="button" id="password1ShowBtn" class="btn btn-baige"><i class="icon ico-ex btn16-edit-0"></i><span class="text tx-btn s16-showpassword">パスワードを見る</span></button>
		// 


		//View.waitInitPageでonInitAllを止めていた時、onInitAll実行。
		if(View.waitInitPage)View.onInitAll();
	}
	loader.load(Conf.PATH.json.research);

};
	
View.hashchangePage = function(e){
};

jQuery(function(){
	jQuery("#privacy_policy article").load("/ec/html/guide/18.html #guide18");
	jQuery("#privacy_policy2 article").load("/ec/html/guide/18.html #guide18");
	jQuery("#membership_agreement article").load("/ec/html/guide/20.html #guide20");
	jQuery("#membership_agreement2 article").load("/ec/html/guide/20.html #guide20");
	jQuery("article.oversea").load("/ec/html/guide/23.html #s17");
});
