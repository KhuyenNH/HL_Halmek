// 変数「viewflag」チェック
if (typeof(viewflag) == 'undefined') var viewflag;

var flag  = true;
var flag2 = true;

jQuery(function(){
	jQuery(".more-btn").on("click", function() {
	jQuery(".moreRead").slideDown(500, 'swing');
	jQuery("#section .sec-inner-footer").css("display","none");
	jQuery(".news-block ul").css("height","auto");
	});
});

jQuery(function(){
	jQuery(".elmSearch a").on("click", function() {
	if(flag || !flag2){
	jQuery(".elmSearch span.try").slideDown(0, 'swing');
	jQuery(".hidden-wrap").slideDown(100, 'swing');
	jQuery("#shopNav .logins p:last-child span.try").slideUp(100, 'swing');
	jQuery(".hidden-wrap2").slideUp(100, 'swing');
	}else{
	jQuery(".elmSearch span.try").slideUp(0, 'swing');
	jQuery(".hidden-wrap").slideUp(100, 'swing');
	}
		flag = !flag;
		flag2 = true;
	});
	return;
});

jQuery(function(){
	jQuery(".hidden-wrap .close-btn").on("click", function() {
	if(flag || !flag2){
	jQuery(".elmSearch span.try").slideDown(100, 'swing');
	jQuery(".hidden-wrap").slideDown(100, 'swing');
	jQuery("#shopNav .logins p:last-child span.try").slideUp(100, 'swing');
	jQuery(".hidden-wrap2").slideUp(100, 'swing');
	}else{
	jQuery(".elmSearch span.try").slideUp(0, 'swing');
	jQuery(".hidden-wrap").slideUp(100, 'swing');
	}
		flag = !flag;
		flag2 = true;
	});
	return;
});

jQuery(function(){
	jQuery("#shopNav .logins p:last-child a").on("click", function() {
	if(flag2 || !flag){
	jQuery("#shopNav .logins p:last-child span.try").slideDown(0, 'swing');
	jQuery(".hidden-wrap2").slideDown(100, 'swing');
	jQuery(".elmSearch span.try").slideUp(100, 'swing');
	jQuery(".hidden-wrap").slideUp(100, 'swing');
	}else{
	jQuery("#shopNav .logins p:last-child span.try").slideUp(0, 'swing');
	jQuery(".hidden-wrap2").slideUp(100, 'swing');
	}
		flag2 = !flag2;
		flag = true;
	});
	return;
});

jQuery(function(){
	jQuery(".hidden-wrap2 .close-btn").on("click", function() {
	if(flag2 || !flag){
	jQuery("#shopNav .logins p:last-child span.try").slideDown(0, 'swing');
	jQuery(".hidden-wrap2").slideDown(100, 'swing');
	jQuery(".elmSearch span.try").slideUp(100, 'swing');
	jQuery(".hidden-wrap").slideUp(100, 'swing');
	}else{
	jQuery("#shopNav .logins p:last-child span.try").slideUp(0, 'swing');
	jQuery(".hidden-wrap2").slideUp(100, 'swing');
	}
		flag2 = !flag2;
		flag = true;
	});
	return;
});

jQuery(function(){
	jQuery('.pagelink >a').click(function(){
	jQuery(".elmSearch span.try").slideUp(0, 'swing');
	jQuery(".hidden-wrap").slideUp(100, 'swing');
		flag2 = true;
		flag = true;
	});
});

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

View.initPage = function(){
	View.catalogForm    = new CatalogForm(jQuery('#catalogForm'));
	View.catalogForm_sp = new CatalogForm_sp(jQuery('#catalogForm_sp'));
};

View.hashchangePage = function(e){};


//色・サイズ・数量をdisabled
//jQuery(function(){
//	jQuery("select").attr("disabled", "disabled");
//});



/* ==================================================================
	▼PC用
 ================================================================== */
var CatalogForm = Class.extend({

	helper:null
	,$:null
	,$table:null
	,$tableFooterTd:null
	,$addNewRowLnk:null
	,rows:[]
	,rowCnt:0
	,$headBalloon:null
	,$submitBtn:null
	
	,init:function($form){
		this.$ = $form;
		this.$table = jQuery('#catalogTable',this.$);
		this.$tableFooterTd = jQuery('.additional-table-footer',this.$);//,this.$table);
		this.$addNewRowLnk = jQuery('a',this.$tableFooterTd);
		this.$submitBtn = jQuery('.btn-block button',this.$);//2個

		
		this.helper = new FormHelper(this.$);
		
		//submit前に値のチェックを追加
		this.helper.submitCheck = jQuery.proxy(this.submitCheck,this);
		this.helper.$.on(FormHelper.EVENT.SUBMIT_CHECK,jQuery.proxy(this.onSubmitCheck,this));
		
		CatalogForm.KLASS_PLACEHOLDER = this.helper.klass_placeholder;

		//既にhtmlに記載されている行を取得(★1行目はデータが入っているおそれあり)
		var $ri = jQuery('tbody tr.inputs',this.$table);
		var $rr = jQuery('tbody tr.results',this.$table);

		// CatalogForm.HTM_INPUT_ROW = $ri.eq($ri.length-1).outerHtml();
		// CatalogForm.HTM_RESULT_ROW = $rr.eq($rr.length-1).outerHtml();
		// CatalogForm.HTM_ITEM_BOX = jQuery('.item-box',$rr.eq(0)).outerHtml();
		CatalogForm.HTM_ITEM_BOX = jQuery('.item-box',jQuery(CatalogForm.HTM_RESULT_ROW)).outerHtml();
		// jQuery.log(CatalogForm.HTM_INPUT_ROW,CatalogForm.HTM_RESULT_ROW);
		
		for (var i = 0; i < $ri.length; i++) {
			this.initRow($ri.eq(i),$rr.eq(i),i);
		}

		//「(▼)もっと商品を入力する」
		this.addNewRow_ = jQuery.proxy(function(e){
			jQuery.preventDefault(e);
			this.addNewRow();
			//balloonも消す
			this.hideAllBalloons();
			return false;
		},this);
		this.$addNewRowLnk.on('click',this.addNewRow_);

		/**
		 * balloon設定(thのやつ)
		 */
		this.hideAllBalloons_ = jQuery.proxy(this.hideAllBalloons,this);
		this.$headBalloon = jQuery('thead .additional-balloon',this.$table)
			.tooltip({
				html:true
				,placement:'top'
			})
		;
		// カタログ番号軽いほうの空チェックでバルーン表示（消すためのイベントも）[!initRow後]
		if(!this.rows[0].chkCnInputNotNull()){
			this.showHeadBalloon();
		}
	}
	
	/**
	 * 行(tr.inputs と tr.result 2つ)を初期化
	 */
	,initRow:function($ri,$rr,id){
		var mode,row;
		if(this.rows.length-1>=id
			&& this.rows[id]
			&& this.rows[id].$ri == $ri
			&& this.rows[id].$rr == $rr){ // 削除ボタンより
			
			mode = "replace";
			jQuery.log("CatalogForm::initRow() mode=",mode);
			row = this.rows[id];

			this.helper.unsetDefaults($ri);

			row.kill();

			jQuery("select",$ri).selectbox("detach");
			jQuery("select",$ri).selectbox("attach");
			// this.helper.setSelectedValues($ri);

			//もっかい初期化。
			row = new CatalogForm.Rows($ri,$rr,id,this);
			this.rows.splice(id,1,row);
			
			this.helper.setDefaults($ri); 

		}else{
			// 通常の初期化
			//idをつける
			$ri.attr('id',CatalogForm.PREF_INPUT_ROW_ID+id);
			$rr.attr('id',CatalogForm.PREF_RESULT_ROW_ID+id);

			//helper(行ごとのinit)
			var filterInputsSelector = '#'+CatalogForm.PREF_INPUT_ROW_ID+id+' .nth-child1 input';
			this.helper.addFilter(filterInputsSelector,FormHelper.FILTER_TYPE.HALF_NUMBER,'remove','keyup blur');
			// console.log("入力値フィルタリングしているinputのid:",id);
			// [130812]
			// 一個目はフィルタリングしてない値が入ってきている場合があるのでここで走らせておく。
			if(id === 0){
				jQuery(filterInputsSelector).trigger('blur');
			}

			//selected-valueは走らせない?
			this.helper.setSelectedValues($ri);
			// 
			//selectbox初期化はnew Rows()の前に
			jQuery("select",$ri).selectbox({
				speed: Conf.selectOpenSpeed
			});

			row = new CatalogForm.Rows($ri,$rr,id,this);

			this.rows[id] = row;

			//
			this.helper.setDefaults($ri);
		}
	}


	/**
	 * 新しい行を追加
	 */
	,addNewRow:function(){
		var $ri = jQuery(CatalogForm.HTM_INPUT_ROW);
		var $rr = jQuery(CatalogForm.HTM_RESULT_ROW);
		// this.$tableFooterTd.parent().before($ri);
		// this.$tableFooterTd.parent().before($rr);
		var $wrap = jQuery('<tbody>');
		$wrap
			.append($ri)
			.append($rr)
		;
		this.$table.append($wrap);
		//ie8用"削除"ボタン修正
		if(jQuery.browser.msie && /**/jQuery.browser.version > 7  && jQuery.browser.version < 9){
			jQuery('.btn',$wrap).each(function(){PIE.attach(this);});
		}
		// ★DOM追加後にFormHelper内のセレクタ修正
		this.helper.resetDOMSelectors();
		// this.helper.kill();
		this.initRow($ri,$rr,this.rows.length);

	}

	/**
	 * 全バルーン除去
	 */
	,hideAllBalloons:function(){
		// jQuery.log('hideAllBalloons');
		this.hideHeadBalloon();
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var r = this.rows[i];
			if(r.balloonIsShown){
				r.$balloon.tooltip('hide');
				r.balloonIsShown = false;
			}
			//イベントあったら除去。
			r.$cn1.off('focus',this.hideAllBalloons_);
			r.$cn2.off('focus',this.hideAllBalloons_);
			r.$color.parent().off('click',this.hideAllBalloons_);
			r.$size.parent().off('click',this.hideAllBalloons_);
			r.$qty.parent().off('click',this.hideAllBalloons_);
			r.$del.off('click',this.hideAllBalloons_);
		}
	}
	,hideAllBalloons_:null

	//イベントにして一回のみ実行にすればいいか。
	,attachHideAllBalloons:function(){
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var r = this.rows[i];
			r.$cn1.one('focus',this.hideAllBalloons_);
			r.$cn2.one('focus',this.hideAllBalloons_);
			// jQuery('.sbSelector',r.$ri).one('mouseover',this.hideAllBalloons_);
			r.$color.parent().one('click',this.hideAllBalloons_);
			r.$size.parent().one('click',this.hideAllBalloons_);
			r.$qty.parent().one('click',this.hideAllBalloons_);
			r.$del.one('click',this.hideAllBalloons_);
		}
	}

	,showHeadBalloon:function(){
		if(!this.headBalloonIsShown){
			this.$headBalloon.tooltip('show');
			this.headBalloonIsShown = true;
			//balloon消すためのイベント追加。
			this.attachHideAllBalloons();
		}
	}
	,hideHeadBalloon:function(){
		if(this.headBalloonIsShown){
			this.$headBalloon.tooltip('hide');
			this.headBalloonIsShown = false;
		}
	}
	,headBalloonIsShown:false


	/**
	 * 次の商品番号入力が空のrowを返す。なかった場合はfalse
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	,getNextCnEmptyRow:function(id){
		if(typeof id == 'undefined')id = 0; //引数ないとき最初から
		var r,ret=false;
		for (var i = id; i < this.rows.length; i++) {
			r = this.rows[i];
			if(!r.chkCnInputNotNull()){
				ret = r;
				break;
			}
		}
		return ret;
	}

	/**
	 * submitボタン押下直後にチェック。
	 * @return {[type]} [description]
	 */
	,submitCheck:function(){
		var valid = false;
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var row = this.rows[i];
			if(row.successCn.length){
				//1個でもvalidならば。
				valid = true;
				break;
			}
		}
		return valid;
	}
	,onSubmitCheck:function(e,valid){
		if(!valid){
			jQuery.log('おっと旦那！submitできませんぜ。')
			//submitしないとき
			//this.getNextCnEmptyRow(0);
			this.rows[0].$cn1.trigger('focus');
			// if(!this.rows[0].chkCnInputNotNull()) this.showHeadBalloon();
		}else{
			//submitする直前に。(前に読み込み成功したcatalogNumberを戻す。)
			for (var i = this.rows.length - 1; i >= 0; i--) {
				var row = this.rows[i];
				if(row.successCn.length){
					this.helper.unsetDefaults(row.$cnParent);
					// 最初の3桁入力（認知媒体コード）は戻さない?
					if(row.$cn1.val() != row.successCn[0]) row.$cn1.val(row.successCn[0]);
					if(row.$cn2.val() != row.successCn[1]) row.$cn2.val(row.successCn[1]);
				}else{
					//successCnがないときは空に。
					row.$cn1.val('');
					row.$cn2.val('');
				}
			}
		}
	}

});

/* ==================================================================
	▼SP用
 ================================================================== */
var CatalogForm_sp = Class.extend({
	helper:null
	,$:null
	,$table:null
	,$tableFooterTd:null
	,$addNewRowLnk:null
	,rows:[]
	,rowCnt:0
	,$headBalloon:null
	,$submitBtn:null
	
	,init:function($form){
		this.$ = $form;
		this.$table = jQuery('#catalogTable_sp',this.$);
		this.$tableFooterTd = jQuery('.additional-table-footer',this.$);//,this.$table);
		this.$addNewRowLnk = jQuery('a',this.$tableFooterTd);
		this.$submitBtn = jQuery('.btn-block button',this.$);//2個

		this.helper = new FormHelper(this.$);
		
		//submit前に値のチェックを追加
		this.helper.submitCheck = jQuery.proxy(this.submitCheck,this);
		this.helper.$.on(FormHelper.EVENT.SUBMIT_CHECK,jQuery.proxy(this.onSubmitCheck,this));
		
		CatalogForm.KLASS_PLACEHOLDER = this.helper.klass_placeholder;

		//既にhtmlに記載されている行を取得(★1行目はデータが入っているおそれあり)
		var $ri = jQuery('.inputs',this.$table);
		var $rr = jQuery('.results',this.$table);
		// CatalogForm.HTM_INPUT_ROW = $ri.eq($ri.length-1).outerHtml();
		// CatalogForm.HTM_RESULT_ROW = $rr.eq($rr.length-1).outerHtml();
		// CatalogForm.HTM_ITEM_BOX = jQuery('.item-box',$rr.eq(0)).outerHtml();
		CatalogForm.HTM_ITEM_BOX = jQuery('.item-box',jQuery(CatalogForm.HTM_RESULT_ROW)).outerHtml();
		// jQuery.log(CatalogForm.HTM_INPUT_ROW,CatalogForm.HTM_RESULT_ROW);
		
		for (var i = 0; i < $ri.length; i++) {
			this.initRow($ri.eq(i),$rr.eq(i),i);
		}

		//「(▼)もっと商品を入力する」
		this.addNewRow_ = jQuery.proxy(function(e){
			jQuery.preventDefault(e);
			this.addNewRow();
			//balloonも消す
			this.hideAllBalloons();
			return false;
		},this);
		this.$addNewRowLnk.on('click',this.addNewRow_);
		
		/**
		 * balloon設定(thのやつ)
		 */
		this.hideAllBalloons_ = jQuery.proxy(this.hideAllBalloons,this);
		this.$headBalloon = jQuery('thead .additional-balloon',this.$table)
			.tooltip({
				html:true
				,placement:'top'
			})
		;
		// カタログ番号軽いほうの空チェックでバルーン表示（消すためのイベントも）[!initRow後]
		if(!this.rows[0].chkCnInputNotNull()){
			this.showHeadBalloon();
		}
	}
	
	/**
	 * 行(tr.inputs と tr.result 2つ)を初期化
	 */
	,initRow:function($ri,$rr,id){
		var mode,row;
		if(this.rows.length-1>=id
			&& this.rows[id]
			&& this.rows[id].$ri == $ri
			&& this.rows[id].$rr == $rr){ // 削除ボタンより
			
			mode = "replace";
			jQuery.log("CatalogForm::initRow() mode=",mode);
			row = this.rows[id];

			this.helper.unsetDefaults($ri);

			row.kill();


			jQuery("select",$ri).selectbox("detach");
			jQuery("select",$ri).selectbox("attach");
			// this.helper.setSelectedValues($ri);

			//もっかい初期化。
			row = new CatalogForm.Rows($ri,$rr,id,this);
			this.rows.splice(id,1,row);
			
			this.helper.setDefaults($ri); 

		}else{
			// 通常の初期化
			//idをつける
			$ri.attr('id',CatalogForm.PREF_INPUT_ROW_ID+id);
			$rr.attr('id',CatalogForm.PREF_RESULT_ROW_ID+id);

			//helper(行ごとのinit)
			var filterInputsSelector = '#'+CatalogForm.PREF_INPUT_ROW_ID+id+' .nth-child1 input';
			this.helper.addFilter(filterInputsSelector,FormHelper.FILTER_TYPE.HALF_NUMBER,'remove','keyup blur');
			// console.log("入力値フィルタリングしているinputのid:",id);
			// [130812]
			// 一個目はフィルタリングしてない値が入ってきている場合があるのでここで走らせておく。
			if(id === 0){
				jQuery(filterInputsSelector).trigger('blur');
			}

			//selected-valueは走らせない?
			this.helper.setSelectedValues($ri);
			// 
			//selectbox初期化はnew Rows()の前に
			jQuery("select",$ri).selectbox({
				speed: Conf.selectOpenSpeed
			});

			row = new CatalogForm.Rows($ri,$rr,id,this);

			this.rows[id] = row;

			//
			this.helper.setDefaults($ri);
		}
	}

	/**
	 * 新しい行を追加
	 */
	,addNewRow:function(){
		//console.log("SP「新しい行を追加」");
		var $ri = jQuery(CatalogForm.HTM_INPUT_ROW_sp);
		var $rr = jQuery(CatalogForm.HTM_RESULT_ROW_sp);
		var $rb = jQuery(CatalogForm.HTM_ITEM_BODY_sp);
		
		// this.$tableFooterTd.parent().before($ri);
		// this.$tableFooterTd.parent().before($rr);
		var $wrap = jQuery('<div class="sp-catalog-wrapper">');
		/*
		$wrap
			.append($ri)
			.append($rr)
			.append($rb)
		;
		*/

		/*
		this.$table.append(
			$wrap.append(
				$ri.append(
					$rr.append(
						$rb
					)
				)
			)
		);
		*/

		this.$table.append(
			$wrap.append(
				$ri.append($rr).append($rb)
			)
		);

		//ie8用"削除"ボタン修正
		if(jQuery.browser.msie && /**/jQuery.browser.version > 7  && jQuery.browser.version < 9){
			jQuery('.btn',$wrap).each(function(){PIE.attach(this);});
		}

		//色・サイズ・数量を隠す。
		//jQuery($ri).find('.sp-catalogTable').hide();
		jQuery($ri).find("select").attr("disabled", "disabled");

		// ★DOM追加後にFormHelper内のセレクタ修正
		this.helper.resetDOMSelectors();
		// this.helper.kill();
		this.initRow($ri,$rr,this.rows.length);
	}

	/**
	 * 全バルーン除去
	 */
	,hideAllBalloons:function(){
		// jQuery.log('hideAllBalloons');
		this.hideHeadBalloon();
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var r = this.rows[i];
			if(r.balloonIsShown){
				r.$balloon.tooltip('hide');
				r.balloonIsShown = false;
			}
			//イベントあったら除去。
			r.$cn1.off('focus',this.hideAllBalloons_);
			r.$cn2.off('focus',this.hideAllBalloons_);
			r.$color.parent().off('click',this.hideAllBalloons_);
			r.$size.parent().off('click',this.hideAllBalloons_);
			r.$qty.parent().off('click',this.hideAllBalloons_);
			r.$del.off('click',this.hideAllBalloons_);
		}
	}
	,hideAllBalloons_:null

	//イベントにして一回のみ実行にすればいいか。
	,attachHideAllBalloons:function(){
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var r = this.rows[i];
			r.$cn1.one('focus',this.hideAllBalloons_);
			r.$cn2.one('focus',this.hideAllBalloons_);
			// jQuery('.sbSelector',r.$ri).one('mouseover',this.hideAllBalloons_);
			r.$color.parent().one('click',this.hideAllBalloons_);
			r.$size.parent().one('click',this.hideAllBalloons_);
			r.$qty.parent().one('click',this.hideAllBalloons_);
			r.$del.one('click',this.hideAllBalloons_);
		}
	}

	,showHeadBalloon:function(){
		if(!this.headBalloonIsShown){
			this.$headBalloon.tooltip('hide');
			this.headBalloonIsShown = true;
			//balloon消すためのイベント追加。
			this.attachHideAllBalloons();
		}
	}
	,hideHeadBalloon:function(){
		if(this.headBalloonIsShown){
			this.$headBalloon.tooltip('hide');
			this.headBalloonIsShown = false;
		}
	}
	,headBalloonIsShown:false


	/**
	 * 次の商品番号入力が空のrowを返す。なかった場合はfalse
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	,getNextCnEmptyRow:function(id){
		if(typeof id == 'undefined')id = 0; //引数ないとき最初から
		var r,ret=false;
		for (var i = id; i < this.rows.length; i++) {
			r = this.rows[i];
			if(!r.chkCnInputNotNull()){
				ret = r;
				break;
			}
		}
		return ret;
	}

	/**
	 * submitボタン押下直後にチェック。
	 * @return {[type]} [description]
	 */
	,submitCheck:function(){
		var valid = false;
		for (var i = this.rows.length - 1; i >= 0; i--) {
			var row = this.rows[i];
			if(row.successCn.length){
				//1個でもvalidならば。
				valid = true;
				break;
			}
		}
		return valid;
	}
	,onSubmitCheck:function(e,valid){
		if(!valid){
			jQuery.log('おっと旦那！submitできませんぜ。')
			//submitしないとき
			//this.getNextCnEmptyRow(0);
			this.rows[0].$cn1.trigger('focus');
			// if(!this.rows[0].chkCnInputNotNull()) this.showHeadBalloon();
		}else{
			//submitする直前に。(前に読み込み成功したcatalogNumberを戻す。)
			for (var i = this.rows.length - 1; i >= 0; i--) {
				var row = this.rows[i];
				if(row.successCn.length){
					this.helper.unsetDefaults(row.$cnParent);
					// 最初の3桁入力（認知媒体コード）は戻さない?
					if(row.$cn1.val() != row.successCn[0]) row.$cn1.val(row.successCn[0]);
					if(row.$cn2.val() != row.successCn[1]) row.$cn2.val(row.successCn[1]);
				}else{
					//successCnがないときは空に。
					row.$cn1.val('');
					row.$cn2.val('');
				}
			}
		}
	}

});

CatalogForm.KLASS_PLACEHOLDER = '' //FormHelper(instance).klass_placeholder
//テンプレ系は値が入っている場合もあるのでシステム側で出力したソースは利用しない

//-------------------------------------
// PC用テンプレ
//-------------------------------------
CatalogForm.HTM_INPUT_ROW = '<tr class="inputs" id="catalogInputs_0">\
								<td class="nth-child1">\
									<div class="balloon-wrap">\
										<input type="hidden" name="items[0].itemCd">\
										<input type="text" name="items[0].catalogItemCd1" class="first-child" data-placeholder="123" maxlength="3" value="">\
										<span class="sep-h">－</span>\
										<input type="text" name="items[0].catalogItemCd2" data-placeholder="4567890" maxlength="7" value="">\
										<span class="additional-balloon" title="他にも欲しい商品がある場合は、&lt;br&gt;他の商品番号をご入力ください"></span>\
									</div>\
								</td>\
								<td class="nth-child2">\
									<select name="items[0].color" class="no-init" data-selected-value="">\
										<option value=""></option>\
									</select>\
								</td>\
								<td class="nth-child3">\
									<select name="items[0].size" class="no-init" data-selected-value="">\
										<option value=""></option>\
									</select>\
								</td>\
								<td class="nth-child4" rowspan="2">\
									<select name="items[0].quantity" class="no-init" data-selected-value="">\
										<option value=""></option>\
									</select>\
									<p class="stock-badges"></p>\
								</td>\
								<td class="nth-child5" rowspan="2">\
									<button type="button" name="" value="" class="btn btn-baige"><i class="icon ico-ex btn16-cross-0"></i><span class="text tx-btn s16-del">削除</span></button>\
								</td>\
							</tr>'; //html内最後の行から取得
CatalogForm.HTM_RESULT_ROW = '<tr class="results" id="catalogResults_0">\
								<td colspan="3">\
									<div class="item-box cfx">\
										<div class="img">\
											<p><a href="" title=""><img src="" alt=""></a></p>\
										</div>\
										<div class="detail">\
											<p class="iname"><a href="" title=""><span><!-- ページ出力時、商品番号が両方埋まっている時はajaxのloadは発生しません。 --></span></a></p>\
											<p class="price">価格 <span class="price-note"><strike><!-- 4,300円 --></strike> <strong><!-- 10%OFF --></strong></span> <span><!-- 3,870円(税込) --></span></p>\
											<p class="options"><!-- 色：<em>黒(06)</em>, サイズ：<em>S(01)</em> --></p>\
										</div>\
									</div>\
								</td>\
							</tr>'; //html内最後の行から取得

//-------------------------------------
// SP用テンプレ
//-------------------------------------
CatalogForm.HTM_INPUT_ROW_sp = '<div class="sp-catalog-wrap inputs" id="catalogInputs_0_sp">\
									<div class="nth-child1 clearfix sp-catalogTable-head">\
										<p>カタログに記載されている商品番号</p>\
										<div class="catalog-No1">\
											<input type="hidden" name="items[0].itemCd">\
											<input type="text" name="items[0].catalogItemCd1" class="first-child placeholder_sp" placeholder="123" maxlength="3" value="">\
										</div>\
										<div class="catalog-No2 clearfix">\
											<span class="catalog-solid">－</span>\
											<div class="catalog-liquid">\
												<div class="catalog-liquid-item">\
													<input type="text" name="items[0].catalogItemCd2" class="placeholder_sp" placeholder="4567890" maxlength="7" value="">\
													<span class="additional-balloon" title="他にも欲しい商品がある場合は、&lt;br&gt;他の商品番号をご入力ください"></span>\
												</div>\
											</div>\
										</div>'; //html内最後の行から取得

CatalogForm.HTM_RESULT_ROW_sp = '<div class="single-itemlist results" id="catalogResults_0_sp">\
									<div class="item-box_style">\
										<ul>\
											<li>\
												<table>\
													<tr>\
														<td>\
															<div class="clearfix item-box cfx">\
																<div class="left_solid img">\
																	<p><a href="./item.html" title=""><img src="holder.js/78x78/gM"></a></p>\
																</div>\
																<div class="right_liquid">\
																	<div class="right_ltem">\
																		<p class="iname"><a href="./item.html" title=""><span><!-- ページ出力時、商品番号が両方埋まっている時はajaxのloadは発生しません。 --></span></a></p>\
																		<p class="price">価格 <span class="price-note"><strike><!-- 4,300円 --></strike> <strong><!-- 10%OFF --></strong></span> <span><!-- 3,870円(税込) --></span></p>\
																		<p class="options"><!-- 色：<em>黒(06)</em>, サイズ：<em>S(01)</em> --></p>\
																	</div>\
																</div>\
															</div>\
														</td>\
													</tr>\
												</table>\
												<div class="nth-child5">\
													<button type="button" name="" value="" class="close-btn"><span>削除</span></button>\
												</div>\
											</li>\
										</ul>\
									</div><!-- /.item-box_style -->\
								</div><!-- /.single-itemlist -->'; //html内最後の行から取得

CatalogForm.HTM_ITEM_BODY_sp = '<div class="sp-catalogTable clearfix">\
										<div class="catalog-spec-wrap clearfix">\
											<span class="catalog-spec">色</span>\
											<div class="catalog-spec-liquid">\
												<div class="catalog-spec-item nth-child2">\
													<select name="items[0].color" class="no-init select_menu" data-selected-value="">\
														<option value=""></option>\
													</select>\
												</div>\
											</div>\
										</div>\
									</div><!-- /.sp-catalogTable -->\
									<div class="sp-catalogTable clearfix">\
										<div class="catalog-spec-wrap clearfix">\
											<span class="catalog-spec">サイズ</span>\
											<div class="catalog-spec-liquid">\
												<div class="catalog-spec-item nth-child3">\
													<select name="items[0].size" class="no-init select_menu" data-selected-value="">\
														<option value=""></option>\
													</select>\
												</div>\
											</div>\
										</div>\
									</div><!-- /.sp-catalogTable -->\
									<div class="sp-catalogTable clearfix">\
										<div class="catalog-spec-wrap clearfix">\
											<span class="catalog-spec"><a href="#">数量</a></span>\
											<div class="catalog-spec-liquid">\
												<div class="catalog-spec-item nth-child4">\
													<select name="items[0].quantity" class="no-init select_menu" data-selected-value="">\
														<option value=""></option>\
													</select>\
													<p class="stock-badges"></p>\
												</div>\
											</div>\
										</div>\
									</div><!-- /.sp-catalogTable -->'; //html内最後の行から取得

										
										
										
										
										
										
										
										
										
										
										
CatalogForm.HTM_ITEM_BOX = ''; //html内最初の行から取得 tr.results .item-box
CatalogForm.PREF_INPUT_ROW_ID = 'catalogInputs_';
CatalogForm.PREF_RESULT_ROW_ID = 'catalogResults_';
CatalogForm.CN2_CHKOK_LENGTHS = [5,7]; //カタログ番号入力2個目の入力でpostできるlength(.Rows.chkCnInput()にて)

//[TEST]違う在庫読み込みテス -->
// CatalogForm.flg = false
// <-- [TEST]
CatalogForm.Rows = ItemSelectView.extend({
	api:Conf.PATH.json.item_by_catalog
	,$ri:null
	,$rr:null
	,id:null
	,$cn1:null
	,$cn2:null
	,$color:null
	,$size:null
	,$qty:null
	,$del:null
	,$balloon:null
	,balloonIsShown:false
	,catalogForm:null
	,dat:null
	,postCn:[]
	,validCn:[] //loadがsuccessしたときのみ値が入る（次のload()まで保持）
	,xhrTh:[]

	//formhelperのaddFilter,setDefaults前。
	,init:function($ri,$rr,id,catalogForm){

		//[TEST]違う在庫読み込みテス --> 
		// if(CatalogForm.flg){
		// 	this.api = Conf.PATH.json.item_by_catalog2
		// }
		// CatalogForm.flg = true;
		// <-- [TEST]

		this.$ri = $ri;
		this.$rr = $rr;
		this.$rrd = jQuery('td:first',$rr);
		this.id = id;
		this.catalogForm = catalogForm;
		this.$cnParent = jQuery('.nth-child1',this.$ri);
		this.$cn1 = jQuery('input:text:first',this.$cnParent);
		this.$cn2 = jQuery('input:text:last',this.$cnParent);
		this.$itemCd = jQuery('input:hidden',this.$cnParent);
		this.$color = jQuery('.nth-child2 select',this.$ri);
		this.$size = jQuery('.nth-child3 select',this.$ri);
		this.$qty = jQuery('.nth-child4 select',this.$ri);
		this.$del = jQuery('.nth-child5 button',this.$ri);
		this.$rowspans = jQuery('.nth-child4,.nth-child5',this.$ri);
		this.$badgeTarget = jQuery('.stock-badges',this.$ri); //badgeを突っ込むエリア

		//★SP用対応
		this.$cn11 = jQuery('.sp-catalogTable',this.$ri);

		this.dat = {};

		this.successCn = [];

		this.xhrTh = [];

		this.spinner = new SpinnerControler('S');

		//row内balloon
		this.$balloon = jQuery('.additional-balloon',this.$ri)
			.tooltip({
				html:true
				,placement:'right'
			})
			// .tooltip('show') //> 表示はload完了後入力があった時、次のやつを。
		;

		// if(this.chkCnInputNotNull()){ //既にpostされた値が入っている時（1行目はある場合あり）
		// 	if(this.chkCnInput()){ //商品番号の文字数がload可能なとき
		// 		//json読み込み
		// 		// this.onCatalogNumberChange__();//入っている場合は検査を伴わない。
		// 		this.load(); //★読まず隠さずそのまま表示?（エラー出力があるため
		// 	}else{

		// 		//エラーがあるとき、既にView.errors(ErrorObserver)には登録されているので
		// 		var $e = jQuery('.error',this.$rr);
		// 		if($e.length) this.$inlineError = $e; 
		// 	}
		// }else{
		// 	//tr.resultsは隠しとく
		// 	this.hideResultRow();
		// 	// this.$rr.hide(); //>> defaultではanimationするので隠す
		// 	// this.deleteRowData();
		// 	this.$color.selectbox("disable");
		// 	this.$size.selectbox("disable");
		// 	this.$qty.selectbox("disable");
		// }
		this.hideResultRow();
		// this.$rr.hide(); //>> defaultではanimationするので隠す
		// this.deleteRowData();
		this.$color.selectbox("disable");
		this.$size.selectbox("disable");
		this.$qty.selectbox("disable");



		/*this.$color.css('display','none');
		this.$size.css('display','none');
		this.$qty.css('display','none');*/

		this.$color.addClass("selectlock");
		this.$size.addClass("selectlock");
		this.$qty.addClass("selectlock");

		this.$color.attr("disabled", "disabled");
		this.$size.attr("disabled", "disabled");
		this.$qty.attr("disabled", "disabled");



		if(this.chkCnInput()){ //商品番号の文字数がload可能なとき
			// this.catalogForm.hideHeadBalloon();
			//json読み込み
			// this.onCatalogNumberChange__();//入っている場合は検査を伴わない。
			this.load(); //★読まず隠さずそのまま表示?（エラー出力があるため
		}

		//formのname属性修正(配列のidを設定)
		//item[1].**
		jQuery('input[name^=item], select[name^=item]',this.$ri).each(jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			var n = $o.attr('name');
			$o.attr('name',n.replace(/\[[0-9]*\]\./g,'['+id+'].'));
		},this));

		//.odd.even追加 > なんか見づらくなるからいらんか。
		// this.$ri.addClass(id % 2 ? 'even' : 'odd');
		// this.$rr.addClass(id % 2 ? 'even' : 'odd');
		

		/**
		 * EVENTS attach.
		 */
		this.onOptSelects_ = jQuery.proxy(this.onOptSelects__,this);
		this.deleteRowData_ = jQuery.proxy(this.deleteRowData,this);
		this.onCatalogNumberChange_ = jQuery.proxy(this.onCatalogNumberChange__,this);

		this.$del.on('click',this.deleteRowData_);
		this.$cn1.on('keyup blur',this.onCatalogNumberChange_); //changeはいらない？
		this.$cn2.on('keyup blur',this.onCatalogNumberChange_);
	}

	,showResultRow:function(){
		this.$rr.show();
		// 表示するとき必ず削除ボタン表示
		if (viewflag !== "PC" && window.innerWidth < 768) this.$rr.find('.nth-child5').show();
		this.$color.removeAttr("disabled");
		this.$size.removeAttr("disabled");
		this.$qty.removeAttr("disabled");
		
		//★IEのrowspanひでぇww
		if(jQuery.browser.msie){// && jQuery.browser.version <= 9){
			this.$rowspans.each(function(i,o){
				// o.setAttribute('ROWSPAN',2);
				this.rowSpan = 2;
			});
		}else{
			this.$rowspans.attr('rowspan',2);
		}
		return;
		// this.$rr.slideDown(CatalogForm.Rows.RESULT_SLIDE_SPD);
	}

	,hideResultRow:function(){
		this.$rr.hide();
		if(jQuery.browser.msie){// && jQuery.browser.version <= 9){
			// this.$rowspans.get(0).rowSpan = 0;
			this.$rowspans.each(function(i,o){
				// o.setAttribute('ROWSPAN',0);
				this.rowSpan = 1;
			});
		}else{
			this.$rowspans.attr('rowspan',1);
		}
		// this.$rr.slideUp(CatalogForm.Rows.RESULT_SLIDE_SPD);
	}

	,spinner:null

	,load:function(){
		var i,xhr;

		//一回placeholder除去しておく
		this.catalogForm.helper.unsetDefaults(this.$cnParent);//this.$cn1.parent());
		//投げる値の保持
		this.postCn = [];
		this.postCn[0] = this.$cn1.val();
		this.postCn[1] = this.$cn2.val();

		//在庫APIにpostするカタログ番号コード
		this.postParams = {};
		this.postParams['catalogItemCd'] = this.$cn2.val();
		
		this.catalogForm.helper.setDefaults(this.$cnParent);

		//"商品番号"の保持はajax.success時に。
		this.successCn = [];
		//前の商品コード（あれば）を一旦消す
		this.$itemCd.val('');

		//xhrの遅延処理
		if(this.xhrTh.length){
			for (i in this.xhrTh) this.xhrTh[i].abort();
			this.xhrTh.length = 0;
		}
		
		this.$rrd.empty();
		if(this.$inlineError && this.$inlineError.length)
			View.errors.detach(this.$inlineError);
		this.spinner.show(this.$rrd);
		this.showResultRow();

		xhr = jQuery.ajax({
			url:ReqUtil.makeUniqueUrl(this.api)
			,dataType:'json'
			,type:Conf.ajaxMeth
			,data:this.postParams
			,success:jQuery.proxy(this.load_success_,this)
			,error:jQuery.proxy(this.load_error_,this)
			// ,complete :jQuery.proxy(this.load_complete_,this)
		});

		this.xhrTh.push(xhr);
	}

	// ,load_complete_:function(xhr,stat){
	// }

	/*
	,load_error_:function(xhr,stat,errThrown){
		this.spinner.hide();

		this.callError('&quot;'+this.api+'&quot; の読み込みに失敗しました。');
		jQuery.err('CatalogForm.Rows::load_error_ :',xhr,stat,errThrown);
		this.successCn = [];
	}

	,load_success_:function(dat){
		this.spinner.hide();
		this.dat = dat;
		if(this.dat.error){
			//jsonのエラーが帰ってきた時。
			this.callError(this.dat.error.content);
			this.successCn = [];
			return;
		}else if(this.dat.item && !this.dat.item.item_cd){
			this.callError('商品情報が取得できませんでした。');
			this.successCn = [];
			return;
		}else{
			//エラーにならなかった時、エラーは消す？
			this.removeError();
		}
		*/

	,load_error_:function(xhr,stat,errThrown){
		var i;
		this.spinner.hide();
		this.removeError();

		//遅延処理用
		for(i in this.xhrTh) if(xhr === this.xhrTh[i]) this.xhrTh.splice(i,1);
		if(stat == 'abort') return;

		this.callError('&quot;'+this.api+'&quot; の読み込みに失敗しました。');
		jQuery.err('CatalogForm.Rows::load_error_ :',xhr,stat,errThrown);
		this.successCn = [];
	}

	 ,load_success_:function(dat,stat,xhr){
		var i;
		this.spinner.hide();
		this.removeError();

		//遅延処理用
		for(i in this.xhrTh) if(xhr === this.xhrTh[i]) this.xhrTh.splice(i,1);

		this.dat = dat;
		if(this.dat.error){
			//jsonのエラーが帰ってきた時。
			this.callError(this.dat.error.content);
			this.successCn = [];
			return;
		}else if(this.dat.item && !this.dat.item.item_cd){
			this.callError('商品情報が取得できませんでした。');
			this.successCn = [];
			return;
		}

		//レスポンスからpost用の商品コードitem_cdを保持
		this.$itemCd.val(this.dat.item.item_cd);

		//正しかった値の保持
		// this.catalogForm.helper.unsetDefaults(this.$cnParent);
		// this.successCn = [this.$cn1.val(),this.$cn2.val()];
		this.successCn = [this.postCn[0],this.postCn[1]];
		// this.catalogForm.helper.setDefaults(this.$cnParent);

		this.stockDBInit();
		this.setAllView();
	}

	/**
	 * this.showInlineError()までの橋渡し
	 */
	,callError:function(content){

		// SPの時削除ボタンを消す。エラーボックスのマージン修正。
		if (viewflag !== "PC" && window.innerWidth < 768){
			var $tmp = this.$rrd.parent().parent().parent().parent();
			$tmp.find('.nth-child5').hide();
			$tmp.find('.sp-catalogTable').hide();
			$tmp.find('table').css('min-height','0px');
			$tmp.find('table').css('padding-bottom','0px');
			var $tmp2 = this.$rrd.parent().parent().parent().parent().parent().parent().parent().parent();
			$tmp2.find('.single-itemlist').css('padding-bottom','1px');
			this.$color.attr("disabled", "disabled");
			this.$size.attr("disabled", "disabled");
			this.$qty.attr("disabled", "disabled");
		}

		var $e = this.showListError(content,this.$rrd,true);
		$e.hide().slideDown(CatalogForm.Rows.RESULT_SLIDE_SPD);
		// var tableId = this.catalogForm.$table.attr('id');
		//エラーの背景をwrapする先指定
		$e.attr(
			View.ErrorObserver.ATTR_WRAPPER,
			// '#'+tableId+' tbody tr.inputs:eq('+this.id+'), #'+tableId+' tbody tr.results:eq('+this.id+')'
			//↓idつけてるのでそれを指定
			'#'+CatalogForm.PREF_INPUT_ROW_ID+this.id+', '+'#'+CatalogForm.PREF_RESULT_ROW_ID+this.id
		);
		//スクロールはしない
		View.errors.attach($e,false);

	}

	,removeError:function(){
		if(this.$listError && this.$listError.length){
			//observerから除去
			View.errors.detach(this.$listError);
			//エレメントを除去
			this.$listError.remove();
			this.$listError = jQuery([]);
		}
	}

	/**
	 * html表示内容変更
	 */
	,setAllView:function(){
		
		if(this._super() === false)return false;

		//item-boxを作成
		var $item = jQuery(CatalogForm.HTM_ITEM_BOX);
		var $lnks = jQuery('a',$item);//[href]
		var permalnk = this.dat.item.permalink || '';
		var $imgs = jQuery('.img img',$item);
		var thumbsrc = this.dat.item.thumb || '';
			$lnks.attr('href',permalnk);
			$imgs.attr('src',thumbsrc);
		// if(jQuery.browser.msie && jQuery.browser.version <= 7){
		// 	$lnks.each(function(i,o){
		// 		/*o.HREF = permalnk; //*/
		// 		// o.setAttribute('HREF',permalnk)
		// 		// jQuery(this).attr('href',permalnk);
		// 		// alert(jQuery(o).attr('href'))
		// 	});
		// 	$imgs.each(function(i,o){
		// 		/*o.SRC = thumbsrc; //*/
		// 		o.setAttribute('src',thumbsrc);
		// 	});
		// }else{
		// }
		var price_note = this.dat.item.price_note || ''
			,$pnote = jQuery('.price > .price-note',$item)
		;
		$pnote.empty();
		if(price_note.length > 0){
			//価格説明があるときは割引率などを表示させない
			$pnote.html(price_note);//.wrapInner('strong');
		}else{
			$pnote.html('<strike></strike> <strong></strong>');
			jQuery('.price strike',$item).text(this.dat.item.display_price || '');
			jQuery('.price strong',$item).text(this.dat.item.discount_rate || '');
		}
		jQuery('.iname span',$item).text(this.dat.item.name || '');
		jQuery('.price span:last',$item).text(this.dat.item.regular_price || '');
		this.$item = $item;
		this.$rrd.html(this.$item);
		
		this.$cn11.show();
			
		//item-box表示アニメーション
		this.$item.hide().slideDown(CatalogForm.Rows.RESULT_SLIDE_SPD);

		//次のballoonの表示
		var nextNotNullRow = this.catalogForm.getNextCnEmptyRow(this.id);
		if(nextNotNullRow){
			nextNotNullRow.$balloon.tooltip('hide');
			nextNotNullRow.balloonIsShown = true;
			//全部フォームにballoon隠すイベント追加
			this.catalogForm.attachHideAllBalloons();
		}

		this.setOptSelects();

		return true;
	}

	/**
	 *数量以外のselectboxの初期化。イベントも。
	 */
	,setOptSelects:function(){


		this.$optSelectAreas = [this.$color.parent(),this.$size.parent()];
		this.$optSelects = [this.$color,this.$size];

		var i,l,ln,htm_opt_pref,htm_opts,$selectArea,$select
		,len = this.$optSelectAreas.length;

		// this.$optSelectsWrap.empty();

		for (i = 0; i < len; i++) {
			l = this.dat.column.label[i];
			if(this.optHasOneEmptyNameField(l)){
				//選択しなくていい、空の名前フィールドをもっているとき。(postする値とdata-unique-idは設定しなくてはならない)
				var uid = this.db.options[l]().select("uid")[0];
				htm_opt_pref = '<option value="'+uid+'" '+this.attr_uid+'="'+uid+'">－(選択不要)</option>';
				htm_opts = '';
			}else if(l && l.length && this.optEnables(l)){
				//通常時
				// htm_opt_pref = '<option value="" disabled="disabled">▼選択して下さい</option>';
				htm_opt_pref = '<option value="">▼ここを選択</option>';
				htm_opts = this.dbGetSelectOptionHtm(l);

			}else{
				//選択不可
				htm_opt_pref = '<option value="">－(選択不要)</option>';
				htm_opts = '';
			}
			// ln = this.dat.column.label_name[i];
			$selectArea = this.$optSelectAreas[i];
			$select = this.$optSelects[i];
			
			// selectboxの初期化はしない。
			
			// $selectArea.attr('id',l+'SelectArea');
			// $select
			// 	.selectbox({'speed':Conf.selectOpenSpeed})
			// 	.attr('id',l+'Select')
			// 	.attr('name',l)
			// ;
			
			// jQuery('.opt-name',$selectArea).text(ln);
			// this.$optSelectAreas.push($selectArea);
			// this.$optSelects.push($select);

			// $selectArea.show();

			$select
				.off('change',this.onOptSelects_)
				.selectbox("detach")
				.html(htm_opt_pref+htm_opts)
				.selectbox("attach")
				.on('change',this.onOptSelects_)
			;

			if(!htm_opts){
				if (viewflag !== "PC" && window.innerWidth < 768){
				// $select.attr("disabled", "disabled");
				// $select.css("color", "#B1ADAB");
					$select.selectbox("disable");
					$select.css("display", "none");
					$select.parent().find(".sbHolder").show();
				}else{
					$select.selectbox("disable");
				}
			}else{
				$select.removeClass("selectlock");
			}
			// }else{
			// 	// $selectArea.hide();
			// }
		}

		//一回表示修正しておく。
		this.switchRowView();
	}

	/**
	 * setAllViewの流れでやるのとoptSelect.onChange
	 * @return {[type]} [description]
	 */
	,switchRowView:function(){
		var stockCnt = 0, nums = [], uids = [], cond = {}, dcnt=0, disablesAll=false,
		i,ln,$opt,num,uid,badge;
		
		//数量検索のためのパラメタ取得
		//
		for (i = 0; i < this.clmlen; i++) {
			l = this.dat.column.label[i];
			ln = this.dat.column.label_name[i];
			$opt = jQuery(':selected',this.$optSelects[i]);
			num = $opt.val();
			uid = $opt.attr(this.attr_uid);
			nums.push(num);
			uids.push(uid);
			cond[l] = uid;
			if(!this.optEnables(l)) dcnt++;
		}
		if(dcnt>=this.clmlen)disablesAll = true;

		this.optSelectedNow = cond;

		//.item-boxの選択options文言を修正
		var optFormat = this.getPostedOptionsHtml();
		jQuery('.options',this.$item).html(optFormat);

		//数量設定
		//
		if(disablesAll){
			stockCnt = this.db.stock().select("stock");
		}else{
			stockCnt = this.db.stock(cond).select("stock");
		}
		stockCnt = stockCnt.length ? stockCnt[0] : -1; 
		
		// jQuery.log('選択商品のストック数:',stockCnt,nums);
		jQuery.log('選択商品のストック数:',stockCnt,nums);
		// jQuery.log(this.dat)
		// jQuery.log(this.db.stock().select("stock"))

		//必要な値が足りていない場合?
		// if((this.colorEnables() && !cid) || (this.sizeEnables() && !sid)){
		// }
		
		// 表示初期化
		// 
		this.$qty
			.selectbox("detach")
			.html('<option value="">－</option>')
			.prop('disabled',true)
		;
		this.$badgeTarget.empty();

		// 振り分けて表示
		// 
		// if(this.allStockCnt<=0 && stockCnt <=0){
		
		
		if(this.allStockCnt === 0){
			//全在庫なし(ページがロードされてから絶対一回しか通らないわけでもない。)
			jQuery.log('-- 完売 --');
			this.$qty.selectbox("attach").selectbox("disable");
			badge = View.stockBadge.get(0);
			//属性選択をdisabledに。
			for (i = 0; i < this.$optSelects.length; i++) {
				this.$optSelects[i]
					.off('change',this.onOptSelects_)
					.selectbox("detach")
					.prop('disabled',true)
					.html('<option value="">－</option>')
					.selectbox("attach")
					.selectbox("disable")
				;
				this.$color.addClass("selectlock");
				this.$size.addClass("selectlock");
				this.$qty.addClass("selectlock");
				this.$color.html('<option value="">在庫なし</option>')
				this.$size.html('<option value="">在庫なし</option>')
			};
		}else{
			this.$qty.removeClass("selectlock");

			if(stockCnt === 0){
				//選択商品のみ在庫なし
				this.$qty.addClass("selectlock");
				this.$qty.selectbox("attach").selectbox("disable");
				badge = View.stockBadge.get(stockCnt);
			}else if(stockCnt == -1){
				//必要なselectの未選択(初期状態？)
				this.$qty.addClass("selectlock");
				this.$qty.selectbox("attach").selectbox("disable");
			}else{
				//在庫あり（|残り僅か）
				var htm_opt = '';
				for (i = 1; i <= Math.min(stockCnt,Conf.qtySelectMax); i++) {
					htm_opt += '<option value="'+i+'">'+i+'</option>';
				}
				this.$qty
					.prop('disabled',false)
					.html(htm_opt)
					.selectbox("attach")
				;
				badge = View.stockBadge.get(stockCnt);
			}
		}

		if(badge){
			$badge = jQuery(badge).addClass('mt-g2');
			this.$badgeTarget.append($badge);
			$badge.hide().fadeIn(320);//addClass('fade in');
		}
	}

	/**
	 * いろ/サイズが選択される毎に実行。
	 * 数量の設定やボタンのdisable解除などの挙動も。
	 */
	,onOptSelects_:null
	,onOptSelects__:function(e){
		this.switchRowView();
	}
	
	/**
	 * カタログ番号が変更される毎に実行。現状商品番号内inputにタイプがあった時
	 */
	,onCatalogNumberChange_:null
	,onCatalogNumberChange__:function(e){
		
		//毎回全バルーン処理するのあほらしいな。
		// this.catalogForm.$headBalloon.tooltip('hide');
		// this.catalogForm.hideHeadBalloon();
		// // 自分のballoonのみ隠す
		// if(this.balloonIsShown){
		// 	this.$balloon.tooltip('hide');
		// 	this.balloonIsShown = false;
		// }

		//数値入力が両方最大数まで達した場合のみ、load実行
		if(this.chkCnInput(e.keyCode)){
			this.load();
		}
	}

	/**
	 * 値のチェック。postするときなど。
	 * @param  {[type]} keycode e.keyCode。ない場合は検査しない。
	 * @return {[type]}         [description]
	 */
	,chkCnInput:function(keycode){
		var kcNotNum = false;
		if(keycode){
			//number:48-57 keypadNumber:96-105
			//jQuery.log("keyCode : ",keycode);
			if(keycode<48 && keycode<57 || keycode<96 && keycode>105){
				kcNotNum = true;
			}
		}
		var cn1v = this.$cn1.val();
		var cn2v = this.$cn2.val();
		var cn1vLen = (cn1v+'').length;
		var cn2vLen = (cn2v+'').length;
		var cn2ChkOk = false; //CatalogForm.CN2_CHKOK_LENGTHS
		for (var i = CatalogForm.CN2_CHKOK_LENGTHS.length - 1; i >= 0; i--) {
			if(cn2vLen === CatalogForm.CN2_CHKOK_LENGTHS[i]){
				cn2ChkOk = true;
				break;
			}
		};
		var cn1HasPlaceholder = this.$cn1.hasClass(CatalogForm.KLASS_PLACEHOLDER);

		var valid = (
			kcNotNum === false &&
			// !this.$cn1.hasClass(CatalogForm.KLASS_PLACEHOLDER) &&
			!this.$cn2.hasClass(CatalogForm.KLASS_PLACEHOLDER) &&
			//最初のinputが空か3文字(以上？)のとき
			(!cn1HasPlaceholder && (
				cn1vLen >= this.$cn1.attr('maxlength') ||
				cn1vLen == 0
			) || cn1HasPlaceholder) &&
			// cn1vLen >= this.$cn1.attr('maxlength') &&
			(cn2vLen >= this.$cn2.attr('maxlength') || cn2ChkOk)&&
			//過去に投げた値をチェック
			!(this.postCn.length &&
				// this.postCn[0] == cn1v && //↓0桁(hasPlaceholder)も検索対象に
				(this.postCn[0] == cn1v || cn1HasPlaceholder) &&
				this.postCn[1] == cn2v)
		);

		jQuery.log('chkCnInput()\n	cn :',cn1v,'-',cn2v,'\n	valid :',valid);

		return valid;
	}
	//上記より少し弱い（値がplaceholderじゃなくて空かどうかのみ）チェック。
	,chkCnInputNotNull:function(){
		var cn1v = this.$cn1.val();
		var cn2v = this.$cn2.val();
		return (
			// !this.$cn1.hasClass(CatalogForm.KLASS_PLACEHOLDER) &&
			!this.$cn2.hasClass(CatalogForm.KLASS_PLACEHOLDER) &&
			// this.$cn1.val() &&
			this.$cn2.val()
		);
	}

	/**
	 * loadで帰ってきたデータと表示をリセット
	 * @return {[type]} [description]
	 */
	,unload:function(){
	}

	/**
	 * データ削除
	 */
	,deleteRowData:function(){
		this.hideResultRow();
		this.catalogForm.initRow(this.$ri,this.$rr,this.id); //こいつがthis.killします
		// var this.$inlineErrors.eq(0)
		// jQuery.log(this.$inlineError); //ErrorObserverの解除。kill()へ。
	}

	/**
	 * Row内全データ削除。（this.datはinit時に初期化。）
	 */
	,kill:function(){
		if(this.balloonIsShown){
			this.$balloon.tooltip('hide');
			this.balloonIsShown = false;
		}
		this.$cn1.val('');
		this.$cn2.val('');
		this.$itemCd.val('');
		this.$color
			.off('change',this.onOptSelects_)
			.empty();
		this.$size
			.off('change',this.onOptSelects_)
			.empty();
		this.$qty
			// .off('change',this.onQtySelect_)
			.empty();
		this.$del.off('click',this.deleteRowData_);
		this.$cn1.off('keyup',this.onCatalogNumberChange_);
		this.$cn2.off('keyup',this.onCatalogNumberChange_);

		this.$badgeTarget.empty();

		//エラー除去
		//if(this.$listError && this.$listError.length)View.errors.detach(this.$listError);
		this.removeError();

		this.$rrd.empty();
	}


});
CatalogForm.Rows.RESULT_SLIDE_SPD = 100;
