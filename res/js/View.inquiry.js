/*
View.initPage = function(){

	//json読み込み終わるまで止めとく。
	View.waitInitPage = 1;

	var loader = new View.SimpleJsonLoader();
	var loader_taikai = new View.SimpleJsonLoader();
	loader_taikai.success = function(dat){
		if(!dat.taikai_reason){
			// this.showError('データ解析エラー','<p>&quot;'+this.api+'&quot; のデータを解析できませんでした。</p>');
			return;
		}
		//jsonパースしてプルダウン内容へ。
		var arr = dat.taikai_reason;
		var len = arr.length;
		var i,opts=[];
		opts.push('<option disabled="disabled" selected="selected" value="">▼選択してください</option>');
		for (i = 0; i < len; i++) {
			opts.push('<option value="'+arr[i].value+'">'+arr[i].content+'</option>');
		};
		//iOSのプルダウンで、全ての文字が表示されるよう対応
		opts.push('<optgroup label=""></optgroup>');
		jQuery('#taikaiReason').html(opts.join(''));
		jQuery('#taikaiReasonSp').html(opts.join(''));
		loader.load(Conf.PATH.json.inquiry_type);
	}
	loader_taikai.load(Conf.PATH.json.taikai_reason);

	loader.success = function(dat){
		if(!dat.inquiry_type){
			// this.showError('データ解析エラー','<p>&quot;'+this.api+'&quot; のデータを解析できませんでした。</p>');
			return;
		}
		//jsonパースしてプルダウン内容へ。
		var arr = dat.inquiry_type;
		var len = arr.length;
		var i,opts=[];
		opts.push('<option disabled="disabled" selected="selected" value="">▼選択してください</option>');
		for (i = 0; i < len; i++) {
			opts.push('<option value="'+arr[i].value+'">'+arr[i].content+'</option>');
		};
		//iOSのプルダウンで、全ての文字が表示されるよう対応
		opts.push('<optgroup label=""></optgroup>');
		jQuery('#triggerSelect').html(opts.join(''));
		jQuery('#triggerSelectSp').html(opts.join(''));

		//formhelper
		var helper = new FormHelper(jQuery('#inquiryForm'));
		var helper2 = new FormHelper(jQuery('#inquiryFormSp'));

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

		//問い合わせ 一般
		jQuery('#ecOfferNoInputTr').hide();
		jQuery('#zipCodeInputTr').hide();
		jQuery('#stateNameInputTr').hide();
		jQuery('#address1InputTr').hide();
		jQuery('#address3InputTr').hide();
		jQuery('#noteInputTr').hide();
		jQuery('#birthdayInputTr').hide();
		jQuery('#taikaiReasonTr').hide();

		jQuery('#ecOfferNoInputTrSp').hide();
		jQuery('#zipCodeInputTrSp').hide();
		jQuery('#stateNameInputTrSp').hide();
		jQuery('#address1InputTrSp').hide();
		jQuery('#address3InputTrSp').hide();
		jQuery('#noteInputTrSp').hide();
		jQuery('#birthdayInputTrSp').hide();
		jQuery('#taikaiReasonTrSp').hide();

		//注釈文言
		jQuery('#base1').show();
		jQuery('#base2').show();
		jQuery('#base3').show();
		jQuery('#catalog1').hide();
		jQuery('#catalog2').hide();
		jQuery('#taikai').hide();
		jQuery('#taikai_note').hide();
		jQuery('#doc_note').hide();

		jQuery('#base1Sp').show();
		jQuery('#base2Sp').show();
		jQuery('#base3Sp').show();
		jQuery('#catalog1Sp').hide();
		jQuery('#catalog2Sp').hide();
		jQuery('#taikaiSp').hide();
		jQuery('#taikai_noteSp').hide();
		jQuery('#doc_noteSp').hide();

		var selectFn = function(){
			if(jQuery('#triggerSelect').attr('value') == 9) {
				//生年月日/退会理由/備考 表示、お問い合わせ内容(申し込み番号・注文番号) 非表示
				jQuery('#inquiryBodyInputTr').hide();
				jQuery('#inquiryBodyInput').attr('value', '');
				jQuery('#ecOfferNoInputTr').hide();
				jQuery('#ecOfferNoInput').attr('value','');
				jQuery('#birthdayInputTr').show();
				jQuery('#taikaiReasonTr').show();
				jQuery('#zipCodeInputTr').hide();
				jQuery('#zipCodeInput').attr('value','');
				jQuery('#stateNameInputTr').hide();
				jQuery('#prefHidden').attr('value','');
				jQuery('#cityHidden').attr('value','');
				jQuery('#address1InputTr').hide();
				jQuery('#address1Input').attr('value','');
				jQuery('#address3InputTr').hide();
				jQuery('#address2Input').attr('value','');
				jQuery('#address3Input').attr('value','');
				jQuery('#noteInputTr').show();
				jQuery('#taikai_note').show();
			} else if(jQuery('#triggerSelect').attr('value') == 5) {
				//住所/備考 表示、お問い合わせ内容(申し込み番号・注文番号) 非表示
				jQuery('#inquiryBodyInputTr').hide();
				jQuery('#inquiryBodyInput').attr('value', '');
				jQuery('#ecOfferNoInputTr').hide();
				jQuery('#ecOfferNoInput').attr('value', '');
				jQuery('#birthdayInputTr').hide();
				var yearId = jQuery('#birthdayYearSelect').attr('sb');
				var defYear = new Date().getFullYear() - Conf.defBirthdayYearSelectDiff;
				jQuery('#sbSelector_' + yearId).text(defYear);
				jQuery('#birthdayYearSelect').attr('data-selected-value', defYear);
				jQuery('#birthdayYearSelect').attr('value', defYear);
				var monthId = jQuery('#birthdayMonthSelect').attr('sb');
				jQuery('#sbSelector_' + monthId).text('－');
				jQuery('#birthdayMonthSelect').attr('data-selected-value', '－');
				jQuery('#birthdayMonthSelect').attr('value', '');
				var dayId = jQuery('#birthdayDaySelect').attr('sb');
				jQuery('#sbSelector_' + dayId).text('－');
				jQuery('#birthdayDaySelect').attr('data-selected-value', '－');
				jQuery('#birthdayDaySelect').attr('value', '');
				jQuery('#taikaiReasonTr').hide();
				var taikaiId = jQuery('#taikaiReason').attr('sb');
				jQuery('#sbSelector_' + taikaiId).text('▼選択してください');
				jQuery('#taikaiReason').attr('data-selected-value', "▼選択してください");
				jQuery('#taikaiReason').attr('value', '');
				jQuery('#zipCodeInputTr').show();
				jQuery('#stateNameInputTr').show();
				jQuery('#address1InputTr').show();
				jQuery('#address3InputTr').show();
				jQuery('#noteInputTr').show();
				jQuery('#taikai_note').hide();
			} else {
				jQuery('#inquiryBodyInputTr').show();
				//問い合わせ 注文関係→表示
				if(jQuery('#triggerSelect').attr('value') == 1 || jQuery('#triggerSelect').attr('value') == 3 || jQuery('#triggerSelect').attr('value') == 4) {
					jQuery('#ecOfferNoInputTr').show();
				} else {
					jQuery('#ecOfferNoInputTr').hide();
					jQuery('#ecOfferNoInput').attr('value', '');
				}
				jQuery('#birthdayInputTr').hide();
				var yearId = jQuery('#birthdayYearSelect').attr('sb');
				var defYear = new Date().getFullYear() - Conf.defBirthdayYearSelectDiff;
				jQuery('#sbSelector_' + yearId).text(defYear);
				jQuery('#birthdayYearSelect').attr('data-selected-value', defYear);
				jQuery('#birthdayYearSelect').attr('value', defYear);
				var monthId = jQuery('#birthdayMonthSelect').attr('sb');
				jQuery('#sbSelector_' + monthId).text('－');
				jQuery('#birthdayMonthSelect').attr('data-selected-value', '－');
				jQuery('#birthdayMonthSelect').attr('value', '');
				var dayId = jQuery('#birthdayDaySelect').attr('sb');
				jQuery('#sbSelector_' + dayId).text('－');
				jQuery('#birthdayDaySelect').attr('data-selected-value', '－');
				jQuery('#birthdayDaySelect').attr('value', '');
				jQuery('#taikaiReasonTr').hide();
				var taikaiId = jQuery('#taikaiReason').attr('sb');
				jQuery('#sbSelector_' + taikaiId).text('▼選択してください');
				jQuery('#taikaiReason').attr('data-selected-value', "▼選択してください");
				jQuery('#taikaiReason').attr('value', '');
				jQuery('#zipCodeInputTr').hide();
				jQuery('#zipCodeInput').attr('value','');
				jQuery('#stateNameInputTr').hide();
				jQuery('#prefHidden').attr('value','');
				jQuery('#cityHidden').attr('value','');
				jQuery('#address1InputTr').hide();
				jQuery('#address1Input').attr('value','');
				jQuery('#address3InputTr').hide();
				jQuery('#address2Input').attr('value','');
				jQuery('#address3Input').attr('value','');
				jQuery('#noteInputTr').hide();
				jQuery('#note').attr('value', '');
				jQuery('#taikai_note').hide();
			}

			//注釈文言切り替え
			if(jQuery('#triggerSelect').attr('value') == 9) {
				jQuery('#base1').hide();
				jQuery('#base2').hide();
				jQuery('#base3').hide();
				jQuery('#catalog2').hide();
				jQuery('#taikai').show();
			} else if(jQuery('#triggerSelect').attr('value') == 5) {
				jQuery('#base1').hide();
				jQuery('#base2').hide();
				jQuery('#base3').hide();
				jQuery('#catalog2').show();
				jQuery('#taikai').hide();
			} else {
				jQuery('#base1').show();
				jQuery('#base2').show();
				jQuery('#base3').show();
				jQuery('#catalog2').hide();
				jQuery('#taikai').hide();
			}

			//入力項目の表示・非表示によって、tooltipの表示位置を変更する必要があるため、
			//tooltipを再描画する
			$cnInput.parent().tooltip('show');
		};

		var selectFnSp = function(){
			if(jQuery('#triggerSelectSp').attr('value') == 9) {
				//生年月日/退会理由/備考 表示、お問い合わせ内容(申し込み番号・注文番号) 非表示
				jQuery('#inquiryBodyInputTrSp').hide();
				jQuery('#inquiryBodyInputSp').attr('value', '');
				jQuery('#ecOfferNoInputTrSp').hide();
				jQuery('#ecOfferNoInputSp').attr('value','');
				jQuery('#birthdayInputTrSp').show();
				jQuery('#taikaiReasonTrSp').show();
				jQuery('#zipCodeInputTrSp').hide();
				jQuery('#zipCodeInputSp').attr('value','');
				jQuery('#stateNameInputTrSp').hide();
				jQuery('#prefHiddenSp').attr('value','');
				jQuery('#cityHiddenSp').attr('value','');
				jQuery('#address1InputTrSp').hide();
				jQuery('#address1InputSp').attr('value','');
				jQuery('#address3InputTrSp').hide();
				jQuery('#address2InputSp').attr('value','');
				jQuery('#address3InputSp').attr('value','');
				jQuery('#noteInputTrSp').show();
				jQuery('#taikai_noteSp').show();
			} else if(jQuery('#triggerSelectSp').attr('value') == 5) {
				//住所/備考 表示、お問い合わせ内容(申し込み番号・注文番号) 非表示
				jQuery('#inquiryBodyInputTrSp').hide();
				jQuery('#inquiryBodyInputSp').attr('value', '');
				jQuery('#ecOfferNoInputTrSp').hide();
				jQuery('#ecOfferNoInputSp').attr('value', '');
				jQuery('#birthdayInputTrSp').hide();
				var yearId = jQuery('#birthdayYearSelectSp').attr('sb');
				var defYear = new Date().getFullYear() - Conf.defBirthdayYearSelectDiff;
				jQuery('#sbSelector_' + yearId).text(defYear);
				jQuery('#birthdayYearSelectSp').attr('data-selected-value', defYear);
				jQuery('#birthdayYearSelectSp').attr('value', defYear);
				var monthId = jQuery('#birthdayMonthSelectSp').attr('sb');
				jQuery('#sbSelector_' + monthId).text('－');
				jQuery('#birthdayMonthSelectSp').attr('data-selected-value', '－');
				jQuery('#birthdayMonthSelectSp').attr('value', '');
				var dayId = jQuery('#birthdayDaySelectSp').attr('sb');
				jQuery('#sbSelector_' + dayId).text('－');
				jQuery('#birthdayDaySelectSp').attr('data-selected-value', '－');
				jQuery('#birthdayDaySelectSp').attr('value', '');
				jQuery('#taikaiReasonTrSp').hide();
				var taikaiId = jQuery('#taikaiReasonSp').attr('sb');
				jQuery('#sbSelector_' + taikaiId).text('▼選択してください');
				jQuery('#taikaiReasonSp').attr('data-selected-value', "▼選択してください");
				jQuery('#taikaiReasonSp').attr('value', '');
				jQuery('#zipCodeInputTrSp').show();
				jQuery('#stateNameInputTrSp').show();
				jQuery('#address1InputTrSp').show();
				jQuery('#address3InputTrSp').show();
				jQuery('#taikai_noteSp').hide();
				jQuery('#noteInputTrSp').show();
			} else {
				jQuery('#inquiryBodyInputTrSp').show();
				//問い合わせ 注文関係→表示
				if(jQuery('#triggerSelectSp').attr('value') == 1 || jQuery('#triggerSelectSp').attr('value') == 3 || jQuery('#triggerSelectSp').attr('value') == 4) {
					jQuery('#ecOfferNoInputTrSp').show();
				} else {
					jQuery('#ecOfferNoInputTrSp').hide();
					jQuery('#ecOfferNoInputSp').attr('value', '');
				}
				jQuery('#birthdayInputTrSp').hide();
				var yearId = jQuery('#birthdayYearSelectSp').attr('sb');
				var defYear = new Date().getFullYear() - Conf.defBirthdayYearSelectDiff;
				jQuery('#sbSelector_' + yearId).text(defYear);
				jQuery('#birthdayYearSelectSp').attr('data-selected-value', defYear);
				jQuery('#birthdayYearSelectSp').attr('value', defYear);
				var monthId = jQuery('#birthdayMonthSelectSp').attr('sb');
				jQuery('#sbSelector_' + monthId).text('－');
				jQuery('#birthdayMonthSelectSp').attr('data-selected-value', '－');
				jQuery('#birthdayMonthSelectSp').attr('value', '');
				var dayId = jQuery('#birthdayDaySelectSp').attr('sb');
				jQuery('#sbSelector_' + dayId).text('－');
				jQuery('#birthdayDaySelectSp').attr('data-selected-value', '－');
				jQuery('#birthdayDaySelectSp').attr('value', '');
				jQuery('#taikaiReasonTrSp').hide();
				var taikaiId = jQuery('#taikaiReasonSp').attr('sb');
				jQuery('#sbSelector_' + taikaiId).text('▼選択してください');
				jQuery('#taikaiReasonSp').attr('data-selected-value', "▼選択してください");
				jQuery('#taikaiReasonSp').attr('value', '');
				jQuery('#zipCodeInputTrSp').hide();
				jQuery('#zipCodeInputSp').attr('value','');
				jQuery('#stateNameInputTrSp').hide();
				jQuery('#prefHiddenSp').attr('value','');
				jQuery('#cityHiddenSp').attr('value','');
				jQuery('#address1InputTrSp').hide();
				jQuery('#address1InputSp').attr('value','');
				jQuery('#address3InputTrSp').hide();
				jQuery('#address2InputSp').attr('value','');
				jQuery('#address3InputSp').attr('value','');
				jQuery('#taikai_noteSp').hide();
				jQuery('#noteInputTrSp').hide();
				jQuery('#noteSp').attr('value', '');
			}

			//注釈文言切り替え
			if(jQuery('#triggerSelectSp').attr('value') == 9) {
				jQuery('#base1Sp').hide();
				jQuery('#base2Sp').hide();
				jQuery('#base3Sp').hide();
				jQuery('#catalog2Sp').hide();
				jQuery('#taikaiSp').show();
			} else if(jQuery('#triggerSelectSp').attr('value') == 5) {
				jQuery('#base1Sp').hide();
				jQuery('#base2Sp').hide();
				jQuery('#base3Sp').hide();
				jQuery('#catalog2Sp').show();
				jQuery('#taikaiSp').hide();
			} else {
				jQuery('#base1Sp').show();
				jQuery('#base2Sp').show();
				jQuery('#base3Sp').show();
				jQuery('#catalog2Sp').hide();
				jQuery('#taikaiSp').hide();
			}
		};

		//お問い合わせの種類によって項目の切り替え
		jQuery('#triggerSelect').on('change', selectFn);
		jQuery('#triggerSelectSp').on('change', selectFnSp);

		//画面に表示・非表示する項目を更新
		selectFn();
		selectFnSp();
		//View.waitInitPageでonInitAllを止めていた時、onInitAll実行。
		if(View.waitInitPage)View.onInitAll();
		
	}

};
*/

View.hashchangePage = function(e){
};

jQuery(function(){
	jQuery("#privacy_policy article").load("/inquiry/guide18.php #guide19");
	jQuery("#privacy_policy2 article").load("/inquiry/guide18.php #guide19");
	jQuery("article.oversea").load("/inquiry/guide23.php #s17");
});
