View.initPage = function(){

	//json読み込み終わるまで止めとく。
	View.waitInitPage = 1;

	var loader = new View.SimpleJsonLoader();
	loader.success = function(dat){
		if(!dat.attention1){
			// this.showError('データ解析エラー','<p>&quot;'+this.api+'&quot; のデータを解析できませんでした。</p>');
			return;
		}
		//jsonパースしてプルダウン内容へ。
		var n,arr,len,i,opts;
		for (var n = 1; n <= 3; n++) {
			arr = dat['attention'+n];
			len = arr.length;
			opts=[];
			opts.push('<option disabled="disabled" selected="selected" value="">▼選択してください</option>');
			for (i = 0; i < len; i++) {
				opts.push('<option value="'+arr[i].value+'">'+arr[i].content+'</option>');
			};
			
			var win_width = window.innerWidth;
			if (win_width < 768){
				//console.log(win_width);
				opts.push('<optgroup label=""></optgroup>');
			}
			
			jQuery('#interestedSelect'+n).html(opts.join(''));
			jQuery('#interestedSelect'+n+'_sp').html(opts.join(''));
		};


		//紹介者入力を開くボタン
		var $ifBtn = jQuery('#openIntroducerFormBtn');
		var $ifBody = jQuery('#introducerFormBody');
		$ifBtn.on('click',jQuery.proxy(function(e){
			$ifBtn.hide();
			$ifBody.slideDown(720);
		},this));
		$ifBody.slideUp(0);

		//formhelper
		var helper = new FormHelper(jQuery('#introducerForm'));
		var helper2 = new FormHelper(jQuery('#introducerForm_sp'));
		
		//テキスト入力に文字が入ってた時は消す。 : setDefaults()前に！
		var edited = false;
		helper.$texts.each(jQuery.proxy(function(i,o){
			if(jQuery(o).val() || jQuery(o).attr('value')){
				edited = true;
				return false;
			}
		},this));

		if(edited){
			$ifBtn.trigger('click');
		}

		//form初期値設定も含む
		View.initForm.addresses(helper);
		View.initForm.addresses(helper2,0,1);
		// View.initForm.dynamicRefleshSelect();


		//View.waitInitPageでonInitAllを止めていた時、onInitAll実行。
		if(View.waitInitPage)View.onInitAll();
	}
	loader.load(Conf.PATH.json.attentions);

};


View.hashchangePage = function(e){
};
