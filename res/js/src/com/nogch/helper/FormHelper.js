;/**
 * com.nogch.view.form.FormHelper.js
 * @class Form関連の挙動ヘルパー
 * @author nogch
 * @version 0.4.7
 * 
<pre>
[usage]
===============================================================
var helper = new FormHelper(jQuery('form',$htm),true); //第2引数はAjaxMode

helper.addFilter('#emailInput',FormHelper.FILTER_TYPE.EMAIL,'remove');
helper.initDateSelects('#birthdayYearSelect','#birthdayMonthSelect','#birthdayDaySelect',false,1900,new Date().getFullYear(),false,true);
//sp用
helper.initDateSelects('#birthdayYearSelect_sp','#birthdayMonthSelect_sp','#birthdayDaySelect_sp',false,1900,new Date().getFullYear(),false,true);
helper.addFilter('#lastNameKanaInput',FormHelper.FILTER_TYPE.FULL_KANA);
helper.addFilter('#firstNameKanaInput',FormHelper.FILTER_TYPE.FULL_KANA);
helper.addFilter('#zipCodeInput',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');
helper.addFilter('#phoneInput',FormHelper.FILTER_TYPE.HALF_NUMBER,'remove');

//zipcodeから自動住所引
helper.addAddressAutoFill('#zipCodeInput','prefCd','address1');

helper.setSelectedValues(); //selectedの初期値設定はdefaultValue設定前に！
helper.setDefaults();

//submitイヴェント
helper.jQuery.on(FormHelper.AjaxSubmitEvent, Req.submitForm);

[version_history]
===============================================================
# 0.4.1:
ベータリリース
# 0.4.1c:
・ヘルプ追加
・プレースホルダー置換用タグ要素を"data-example-value"から"data-placeholder"に。
・プレースホルダー時、付与されるcssのclass名を"example"から"placeholder"に。
# 0.4.2:
・kill()追加
・すべての:input要素(textarea,hidden,submitも)の値を取得するのにgetAllValues()じゃなくて$form.serializeArray()を使うようにした。
・だいぶajaxフレンドリーに。
# 0.4.3:
色々修正。
・DateSelectsクラスに開始/終了日をDateクラスで渡せるように。
・maxlengthの挙動が変なのでandroidとりあえず無視。
・フィルタに半角>全角を追加。
# 0.4.4:
・window.onBeforeUnload時にplaceholder除去
# 0.4.5:
・addAddressAutoFill,addAddressAutoFill2メソッドをaddAjazZip3()に統合。[★]引数の数が変わってます。
# 0.4.6
・FormHelper.EVENT={}追加。
submitCheck:submitボタン押下直後に実行される、任意のチェック関数を追加できるように。
	helper.submitCheck = function(){return (true || false)};
	helper.jQuery.on(FormHelper.EVENT.SUBMIT_CHECK,function(e,valid){});
#0.4.7
・必須フィールド用の処理を追加。
	<input class="required">
	helper.attachEmptyCheck({callback(最初にみつかった空input)},true);にて動作。
・placeholderの仕様改善。

[require libraries]
===============================================================
jquery, Class, jq.ext, ※ajaxzip3(住所変換をするときのみ、自動でヘッダに追加されます)
</pre>
 */
 
var FormHelper = Class.extend({
	$:null
	,ajaxMode:false
	,attr_placeholder:'data-placeholder' //プレースホルダーテキスト用attribute
	,attr_selectedValue:'data-selected-value' //<select>用初期の選択val指定
	,klass_placeholder:'placeholder' //プレースホルダー用CSSクラス
	,klass_required:'required' //必須フィールド用クラス（input.valが空でsubmitできなくなる）
	,submitBtnClickText:'送信中..' //submitボタンを押した時のvalue内文字の変更
	,$submit:null
	,$submitBtn:null
	,$all:null
	,$texts:null
	,$passwords:null
	,$alltexts:null
	,$hiddens:null
	,$textareas:null
	,$buttons:null
	,$radios:null
	,$checkboxs:null
	,$selects:null
	,$files:null
	,selector_alltexts:':text, :password, textarea, input[type=number], input[type=email], input[type=tel], input[type=url], input[type=search]'
	
	/**
	 * @param $targetForm jquery(form)
	 * @param ajaxMode 普通にsubmit()しないフォーム。submit()時には指定のイベントを最後にtoggle()
	 * 
	 * ★ajaxModeがtrueのとき、submitイベントはFormHelper.AjaxSubmitEvent:'ajaxsubmit'に置き換えられます。
	 * trigger時に渡ってくる引数は以下。
	 * [1] event:イベントオブジェクト
	 * [2] action:formのaction先
	 * [3] method:formのmethod
	 * [4] values:$form.serializeArray();//すべてのinput要素の現在値obj{name:'値'or[値1,値2,..]}(！[type=file]は入りません。checkboxなど、複数値が結果として帰ってくるものは配列で。)
	 */
	,init:function($targetForm,ajaxMode){
		
		if(typeof ajaxMode != 'undefined') this.ajaxMode = ajaxMode;

		this.$ = $targetForm;

		//dataにインスタンス入れておく。
		this.$.data('FormHelper',this);

		//クロージャ用イベント初期化
		this._submitBtnClick_ = jQuery.proxy(this._submitBtnClick,this);

		// this.originalPasswordInputs = []
		jQuery('input[data-input-type=password]',this.$).each(function(i,o){
			new OriginalPasswordInput(jQuery(o));
		});

		this.resetDOMSelectors();

	}

	,_submitBtnClick_:null
	
	/**
	 * すべてのセレクタをリフレッシュ。
	 * @return {[type]} [description]
	 */
	,resetDOMSelectors:function(){
		this.$all = jQuery(':input',this.$); //buttonも取ってきますよ。
		this.$texts = jQuery(':text',this.$);
		this.$passwords = jQuery(':password',this.$);
		// this.$alltexts = jQuery('textarea input[type!=radio] input[type!=checkbox] input[type!=submit]',this.$);
		// jQuery.log(jQuery('[type=tel]'))
		this.$alltexts = jQuery(this.selector_alltexts, this.$);

		this.$hiddens = jQuery(':hidden',this.$);
		this.$textareas = jQuery('textarea',this.$);
		this.$buttons = jQuery(':button',this.$);
		this.$radios = jQuery(':radio',this.$);
		this.$checkboxs = jQuery(':checkbox',this.$);
		this.$selects = jQuery('select',this.$);
		this.$files = jQuery(':file',this.$);
		
		/// メソッドの実行順をインスタンス側で自由に変えたいので値の初期化はinitで自動実行しない。
		/* 
		this.setSelectedValues() //selectedの初期値設定はdefaultValue設定前！
		this.setDefaults()
		*/
		
		this.$submitBtn = jQuery(':submit',this.$);
		// this.$submitBtn = jQuery('input:submit',this.$);
		// if(!this.$submitBtn.length)
		// this.$submitBtn = jQuery('button:submit',this.$);
		if(!this.$submitBtn && !this.$submitBtn.length)
			this.$submitBtn = jQuery('.submit',this.$);

		//↓submitBtnによるsubmitは1回のみに。
		// this.$submitBtn.off('click',this._submitBtnClick_); //前のイヴェントがあれば消す
		// this.$submitBtn.on('click',this._submitBtnClick_);

		this.resetSubmitBtn();

	}

	/**
	 * ★フォームのvalueを根こそぎ{name:value}なobjにして返す。
	 * 空の場合はちゃんと""。 no undefined.
	 * fileはajaxでやりとるのは厳しいので別（フレーム）でやってください。
	 * @return Object
	 */
	// ,getAllValues:function($this_submit){
	// 	var obj = {};
		
	// 	var _everyText = function(i,o){
	// 		var $o = jQuery(o);
	// 		obj[$o.attr('name')] = $o.val(); 
	// 	};
		
	// 	var _everyCheckbox = function(i,o){
	// 		var $o = jQuery(o);
	// 		//var $checks = jQuery(':checked',$o)
	// 		if(!$o.attr('checked'))return;
	// 		var checkval = $o.val();
			
	// 		//$o
	// 		if(typeof obj[$o.attr('name')] == 'undefined'){
	// 			obj[$o.attr('name')] = checkval;
	// 		}else{
	// 			var before = obj[$o.attr('name')];
	// 			if(jQuery.isArray(before)){//typeof before == 'object' && typeof before.pop == 'function'){//isArray
	// 				obj[$o.attr('name')].push(checkval);
	// 			}else{
	// 				obj[$o.attr('name')] = [before,checkval];
	// 			}
	// 		}
	// 	};
		
	// 	var _everySelect = function(i,o){
	// 		var $o = jQuery(o);
	// 		var $selects = jQuery(':selected',$o);
	// 		var selval = [];
	// 		$selects.each(function(){
	// 			selval.push($o.val());
	// 		});
	// 		if(selval.length==0){selval=""}else if(selval.length==1){selval=selval[0]};
	// 		obj[$o.attr('name')] = selval;
	// 	};
		
	// 	var _everyTextarea = function(i,o){
	// 		var $o = jQuery(o);
	// 		obj[$o.attr('name')] = $o.val(); //$o.html(); 
	// 	};
		
	// 	//input（radio,checkbox以外）
	// 	this.$alltexts.each(jQuery.proxy(_everyText,this));
	// 	this.$hiddens.each(jQuery.proxy(_everyText,this));
		
		
	// 	//radiobutton/checkbox
	// 	this.$radios.each(jQuery.proxy(_everyCheckbox,this));
	// 	this.$checkboxs.each(jQuery.proxy(_everyCheckbox,this));
		
	// 	//select
	// 	this.$selects.each(jQuery.proxy(_everySelect,this));
		
	// 	//textarea
	// 	this.$textareas.each(jQuery.proxy(_everyTextarea,this));
		
	// 	return obj;
	// }
	

	/**
	 * select,checkbox,radioのとき data-selected-value の値をselectedと！
	 * （セッション値で戻ってきたときなど、自動設定
	 * ☆現在、チェックボックスなど複数値には対応していないです！
	 */
	,setSelectedValues:function($parent){
		var selectFn = jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			//var name = $o.attr('name')
			//data-selected-valueはgroupの親に記載！(全部セレクタ検査していいか。)
			var sval = $o.parent().attr(this.attr_selectedValue);
			if(!sval){
				// jQuery.log('FormHelper::setSelectedValues()selectFn() : "'+this.attr_selectedValue+'"属性が設定されていません。');
				return;
			};
			//console.log(sval)
			// if($o.attr('value')==sval){
			if($o.val()===sval){
				switch($o.attr('type')){
					case 'radio':
						$o.attr('checked','checked');	
						break;
					default: //selectbox
						$o.attr('selected','selected');
						jQuery.log(sval)
						break;
				}
			}
		},this);

		var $rad,$sel;
		if($parent && $parent.length){
			$rad = jQuery(':radio',$parent);
			$sel = jQuery('select',$parent);
		}else{
			$rad = this.$radios;
			$sel = this.$selects;
		}
		$rad.each(selectFn);
		$sel.each(jQuery.proxy(function(i,o){
			$o = jQuery(o);
			$o.children().each(selectFn);
			$o.trigger('change'); //selectboxは<select>毎にchangeイベントをtrigger.
		},this));
	}


	/**
	 * デフォルト値（attr_placeholder）の値が指定してあり、valueが無いとき
	 * デフォルト値を設定したりfocusイベントつけたりとか。
	 * @param {jqueryObject} $parent 親指定
	 * @param {Boolean} notSetWindowUnloadWithUnset window.onBeforeUnload時にthis.unsetDefaults()を実行しないかどうか。通常は実行させるようにイベント登録する。
	 */
	,setDefaults:function($parent,notSetWindowUnloadWithUnset){
		var $targs;
		if($parent && $parent.length){
			$targs = jQuery(this.selector_alltexts, $parent);
		}else{
			$targs = this.$alltexts;
		}
		$targs.each(jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			$o.data('placeholder',$o.attr(this.attr_placeholder));
			
			if(!$o.data('placeholder')) return; //data-placeholderがないときは何もしない。
			//jQuery.log($o.data('placeholder'))
			
			$o
				.data('defval',$o.val())
				.data('defmaxlength',$o.attr('maxlength'))
			;
			//なにか記入してblurした時trueにする。最終的にsubmitするとき、bind(focus)の時と同じ条件分岐で値の削除。
			////※若しくは、exampleと最初に入っていた値が同じだった場合は常にtrue
			// if($o.data('defval') == $o.data('placeholder')){
				// $o.data('fd',true)
			// }else{
			// }
				$o.data('fd',false);
			
			if(!$o.val()){//初期値が空っぽの時のみ、サンプル値の追加
				$o
					.val($o.data('placeholder'))
					.addClass(this.klass_placeholder)
				;
			}
			if($o.data('defmaxlength')){
				// $o.attr('maxlength',Number($o.data('defmaxlength'))+1);
			}

			/// focus/blur イベント(真っ先に)
			$o.data('placeholderFocusFn', jQuery.proxy(function(e){
				var $tar = jQuery(e.target);				
				// jQuery.log('FormHelper::setDefaults() [EVT] focus :'+$tar.val());
				// if(!$tar.data('fd')){
					// if($tar.val()==$tar.data('placeholder')){
						// jQuery.log('現在のvalがplaceholderといっしょだった')
						// if($tar.data('defval') != $tar.data('placeholder')){
						// 	jQuery.log('defaultなvalがplaceholderとは違った')
					if($tar.hasClass(this.klass_placeholder)){//placeholderがある
						if($tar.val() == $tar.data('placeholder')){//値がplaceholderと一緒

							$tar
								.val('')
								// .attr('value','')
								.removeClass(this.klass_placeholder)
							;
							//droid君(v3)だとmaxlengthがあった場合でexample値が入力値マックスだった時に入力できなくなるので。
							/*if($tar.data('defmaxlength')){
								// jQuery.log('maxlengthあるよ！');
								$tar
									.attr('maxlength',$tar.data('defmaxlength'))
									// .one('blur',jQuery.proxy(function(e){
										// $tar.attr('maxlength',Number($tar.data('defmaxlength'))+1)
									// },this))
								;
							}*/
						}
					}
				// }
			},this));
			$o.data('placeholderBlurFn',jQuery.proxy(function(e){
				var $tar = jQuery(e.target);
				// jQuery.log('FormHelper::setDefaults() [EVT] blur :',$tar.val());
				//data-placeholderが指定されている + 値がない場合は必ず実行
				if($tar.data('placeholder') && !$tar.val()){
					$tar
						.val($tar.data('placeholder'))
						// .attr('value',$tar.data('placeholder'))
						.addClass(this.klass_placeholder)
						// .data('fd',false)
					;
					// if($tar.data('defmaxlength') 
					// 	//&& $tar.val().length>=Number($tar.data('defmaxlength'))
					// ){
					// 	$tar.attr('maxlength',Number($tar.data('defmaxlength'))+1);
					// }
				}else{
					// $tar.data('fd',true);
				}
			},this))
			;

			$o
				// .prependEventHandler('focus',jQuery.proxy(function(e){
				.on('focus',$o.data('placeholderFocusFn'))
				// .prependEventHandler('blur',jQuery.proxy(function(e){
				.on('blur',$o.data('placeholderBlurFn'))
				// .on('keyup',jQuery.proxy(function(e){
					// var $tar = jQuery(e.target)
					// jQuery.log('keyup :: '+$tar.val())
				// },this))
			;
			/**/
				
		},this));
		

		//win.onload時にplaceholder除去するように。引数でセットしないようにも。
		if(!notSetWindowUnloadWithUnset && typeof this.onUnloadUnsetDefaults_ == 'undefined'){
			this.onUnloadUnsetDefaults_ = jQuery.proxy(function(){this.unsetDefaults();},this);
			jQuery(window).on('beforeunload',this.onUnloadUnsetDefaults_);
		}
	}
	// ,onUnloadUnsetDefaults_:null
	/**
	 * 最終的にsubmitするとき、placeholderのイベント除去とかに。(Filterイベントは消さない)
	 * @param  {[type]} $parent    親jqueryObj
	 * @return {[type]}            [description]
	 */
	,unsetDefaults:function($parent){
		var $targs;
		if($parent && $parent.length){
			$targs = jQuery(this.selector_alltexts, $parent);
		}else{
			$targs = this.$alltexts;
		}
		$targs.each(jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			
			if(!$o.data('placeholder')) return; //data-placeholderがないときは何もしない。
			
			//保持してたイベントも殺す
			$o.off('focus',$o.data('placeholderFocusFn'))
				.off('blur',$o.data('placeholderBlurFn'));

			//bind(focus)の時と同じ条件分岐で値の削除。
			//一回も触ってっていないかexampleの値に置換した直後
			// if(!$o.data('fd')){
			// 	//valueの値とexampleの値が一緒だった時
			// 	if($o.val()==$o.data('placeholder')){
			// 		//exampleと最初に入っていた値が同じじゃなかった場合
			// 		if($o.data('defval') != $o.data('placeholder')){
			// if(!$o.data('fd')){
				if($o.hasClass(this.klass_placeholder)){//placeholderがある
					if($o.val() == $o.data('placeholder')){//値がplaceholderと一緒
						$o.val('').removeClass(this.klass_placeholder);
					}
				}
			// }
			
			// maxlengthはいじってない
			// if($o.data('defmaxlength')) $o.attr('maxlength',$o.data('defmaxlength'));

			//保持値は消さんでも？
			$o.data('placeholder','');
			$o.data('defmaxlength','');
			$o.data('placeholderFocusFn','');
			$o.data('placeholderBlurFn','');
			
		},this));

		//return false;

		//unload時のイベントハンドラ（arguments.callee）消す
		if(typeof this.onUnloadUnsetDefaults_ != 'undefined'){
			jQuery(window).on('beforeunload',this.onUnloadUnsetDefaults_);
		}
	}
	
	/**
	 * ajaxなページ推移をするサイトでsubmitの実装。（hashchangeイベントを発行）
	 */
	,_hashsubmit:function(){
		this._defaultsubmit(true);
		var values = this.$.serializeArray(); //this.getAllValues();
		// jQuery.log(values);
		var next = this.$.attr('data-action-success');
		//AjaxSubmitEvent発行 
		this.$.trigger(FormHelper.EVENT.BEFORE_SUBMIT);
		this.$.trigger(FormHelper.EVENT.AJAX_SUBMIT, [this.$.attr('action'), this.$.attr('method')||'post', values, next]);
		this.$.trigger(FormHelper.EVENT.AFTER_SUBMIT);
	}
	
	/**submit()時の共通イベンツ**/
	,_defaultsubmit:function(originalsubmit_no_exec){
		//フォームのデフォルト値を削除
		this.unsetDefaults();
		//submitボタンを使えなくする
		this.$submitBtn.prop('disabled',true);
		// if(this.$submitBtn.attr('value')!=undefined){
		if(!this.$submitBtn.attr('value')){
			this.$submitBtn.val(this.submitBtnClickText);
		}else{
			//this.$submitBtn.text(this.submitBtnClickText)
		}
		//通常のsubmit(Ajaxのsubmitがある場合は実行しない。)
		if(!originalsubmit_no_exec){
			this.$.trigger(FormHelper.EVENT.BEFORE_SUBMIT);
			this.$.trigger('submit');
			this.$.trigger(FormHelper.EVENT.AFTER_SUBMIT);
			// jQuery.log(this.$[0],this.$[0].submit)
			// this.$[0].submit()
		}
	}
	
	,submitBtnClickFlg:false
	,submitBtnClick:function(){
		// this._submitBtnClick(document.createEvent("MouseEvent"));
		if(this.ajaxMode){
			this._hashsubmit();
		}else{
			this._defaultsubmit();
		}
		this.submitBtnClickFlg = true;
	}
	,_submitBtnClick:function(e){
		// var $this_submit;
		// if(typeof e == 'undefined'){
		// 	// イベントがない場合は最初にあったボタンを取得
		// 	e = this.$submitBtn.Event("click");
		// }else{
		// 	$et = jQuery(e.target);
		// 	//バブリングしてた場合もOK.
		// 	if($et.attr('type') == 'submit' || $et.hasClass('submit')){
		// 		$this_submit = $et;
		// 	}else{
		// 		$this_submit;
		// 	}
		// }
		jQuery.preventDefault(e);

		if(this.submitBtnClickFlg) return false;
		
		//form内のフィールドどれかに一回でもフォーカスがあたってない場合の処理
		if(this._focusChkFlg === 0){
			this.$.off(FormHelper.EVENT.RESUME_STOP_SUBMIT);
			this.$.one(FormHelper.EVENT.RESUME_STOP_SUBMIT,jQuery.proxy(function(){
				this._focusChkFlg = 2;
				this._submitBtnClick(e);
			},this));
			this._focusChkHandler();
			return;
		}

		//form内のフィールドが空か検知する？(this.attachEmptyCheck()で設定した時。)
		if(this._emptyChkFlg === 0){
			this.emptyCheckAll();
		}
		// jQuery.log('Empty Checked!!! _emptyChkFlg:'+this._emptyChkFlg)
		if(this._emptyChkFlg === 0){
			this.$.off(FormHelper.EVENT.RESUME_STOP_SUBMIT);
			this.$.one(FormHelper.EVENT.RESUME_STOP_SUBMIT,jQuery.proxy(function(){
				this._emptyChkFlg = 2;
				this._submitBtnClick(e);
			},this));
			//普通はthis = FormHelper
			// this._emptyChkHandler.apply(this,[this.emptyFields]);
			this._emptyChkHandler(this.emptyFields);
			return;
		}

		/**
		 * submitボタンを押下時のチェックfn（@return [Boolean]）があるとき、
		 * 戻り値(true|false)でsubmitを止めるかどうかを決定。
		 */
		if(typeof this.submitCheck == 'function'){
			if(this.submitCheck() === false){
				this.$.trigger(FormHelper.EVENT.SUBMIT_CHECK,[false]);
				//停止
				return;
			}else{
				this.$.trigger(FormHelper.EVENT.SUBMIT_CHECK,[true]);
			}
		}

		//☆押されたボタンのクローンhiddenフィールドを作成。>>>>type="image"でも.x .yがつかない
		var $btn = this.searchSubmitBtn(e.target);
		if(this.$submit_hidden instanceof jQuery && this.$submit_hidden.length){
			//前のは消す。
			this.$submit_hidden.remove();
		}
		if($btn){
			this.$submit_hidden = jQuery('<input type="hidden">')
				.attr('name',$btn.attr('name'))
				.attr('value',$btn.attr('value'))
			;
			$btn.before(this.$submit_hidden);
		}else{
			jQuery.err('FormHelper::_submitBtnClick - submitボタンが取得できません.hiddenFieldを作成できませんでした。');
		}

		//submitの実行
		if(this.ajaxMode){
			this._hashsubmit();
		}else{
			this._defaultsubmit();
		}
		this.submitBtnClickFlg = true;
		return false;
	}
	
	///submitされたボタン探し。
	,searchSubmitBtn:function(et){
		var $btn = false, s1, s2;
		var $et = et ? jQuery(et) : jQuery('<div>');
		// var tn = $et.get(0).tagName.toLowerCase();
		var type = $et.attr('type');
		
		if(!(type && (type == 'submit'/* || type='image'*/)|| $et.hasClass('submit'))){
			s1 = $et.closest(':submit');
			s2 = $et.closest('.submit');
			$et = s1.length ?  s1 : (s2.length ? s2 : $et);
		}
		
		this.$submitBtn.each(jQuery.proxy(function(i,o){
			if($et[0]===jQuery(o)[0]){
				$btn = $et;
			}
		},this));

		/*if(!$btn){
			if($et.parent()[0] === this.$[0]){
				//formまでいってしまったら
				return false;
			}else{
				//再帰処理
				return this.searchSubmitBtn($et.parent()[0]);
			}
		}else */
		if($btn){
			return $btn;
		}else if(this.$submitBtn.length){
			//見当たらないときは一個目のボタン
			return this.$submitBtn.eq(0);
		}else{
			//ボタンがないときfalse
			return false;
		}

	}
	,resetSubmitBtn:function(){
		this.submitBtnClickFlg = false;
		// this.$submitBtn.prop('disabled',true);
		// this.$submitBtn.one('click',jQuery.proxy(this._submitBtnClick,this));
		this.$submitBtn
			.prop('disabled',false)
			.off('click',this._submitBtnClick_)
			.on('click',this._submitBtnClick_)
	}
	
	/**
	* フィールドどれかに一回でもフォーカスしたかチェックし、
	* フォーカスされてなかった場合submit時に処理を停止。
	* this.jQuery(:formObj) に対して @param eventName をtriggerした時にsubmitがレジュームするしくみ。
	*/
	,attachFocusCheckAll:function(handler){
		this._focusChkFlg = 0;
		this._focusChkFn_ = jQuery.proxy(this._focusChkFn__,this);
		this.$all.on('focus',this._focusChkFn_);

		this._focusChkHandler = typeof handler == 'function' ? handler : function(){
			this.$.trigger(FormHelper.EVENT.RESUME_STOP_SUBMIT);
		}
	}
	,detachFocusCheck:function(){
		this._focusChkFlg = -1;
		this._focusChkHandler = function(){};
	}
	,_focusChkFn_:null
	,_focusChkFlg:-1
	,_focusChkHandler:function(){}
	,_focusChkFn__:function(e){
		this.$all.off('focus',this._focusChkFn_);
		this._focusChkFlg = 1;
	}


	/**
	* 任意のフィールドが空かどうかのチェック。
	* デフォルトでは全てのinput,selectがチェックされる。
	* 空だった場合、submit時に処理を停止。
	* this.jQuery(:formObj) に対して @param eventName をtriggerした時にsubmitがレジュームするしくみ。
	* ※現在の対応はinput:text系,textarea,select。ラジオボタンとチェックボックスには未対応(めんどくさいのでw)。対応しなくていい？
	*↓submit時空のフィールドがあった時、1個目の空フィールドにフォーカスとか。
	*helper.attachEmptyCheck(function(empties){
		if(empties.length && empties[0] instanceof jQuery){
			empties[0].trigger('focus');
		}
	});
	* @param {Function} handler 引数に空だったフィールドの配列が返る。スコープはFormHelper。
	* @param t input,selectの検索ターゲット。jqueryObj:直接指定、文字列:dom検索対象、bool値(true):this.klass_required('.required')を検索、bool値(false):this.$
	* 
	*/
	,attachEmptyCheck:function(handler,t){
		this._emptyChkFlg = 0;
		//ターゲットを指定してないときはすべて。
		this._emptyCheckTargets = 
			t instanceof jQuery ? t 
			: typeof t == 'string' ? jQuery(t,this.$) 
			: typeof t == 'boolean' ? jQuery('.'+this.klass_required,this.$)
			: this.$
		;
		//input,selectフィールドに'.requireがあるときはdiv(iblock)でwrap'
		var targets = [];
		this._emptyCheckTargets.each(function(i,o){
			var $o = jQuery(o);
			if($o.get(0).tagName.toLowerCase() == 'input' || 'select'/* 'radio' || 'checkbox'*/){
				var d = $o.css('display');
				var f = $o.css('float');
				var p = $o.css('position');
				$o = $o.wrap('<div>').parent();
				//position系を継承
				$o.css({
					'display':d
					,'float':f
					,'position':p
				});
			}
			targets.push($o[0]);
		});
		// jQuery.log(targets);
		this._emptyCheckTargets = jQuery(targets);
		// jQuery.log(this._emptyCheckTargets)
		// jQuery.log(jQuery(this.selector_alltexts, this._emptyCheckTargets))
		
		this._emptyChkHandler = typeof handler == 'function' ? handler : function(empties){
			jQuery.log('Submit時、空のフィールドを検知しました。arguments[0]:',empties);
			this.$.trigger(FormHelper.EVENT.RESUME_STOP_SUBMIT);
		}
	}
	,detachEmptyCheck:function(){
		this._emptyChkFlg = -1;
		this._emptyChkHandler = function(){};
		this._emptyCheckTargets = null;
	}
	,emptyFields:[]
	,_emptyCheckTargets:null
	,_emptyChkFlg:-1
	,_emptyChkHandler:function(){}
	,emptyCheckAll:function(){
		var execFlg = false;
		var edited = 0;
		var $targets = this._emptyCheckTargets;
		var $alltexts = jQuery(this.selector_alltexts, $targets)
		;
		// var $checkGroups = jQuery(':radio, :checkbox', $targets).parent();
		// var $radioGroups = jQuery(':radio', $targets).parent();
		var $selects = jQuery('select', $targets);
		var empties = [];
		var alllen = $alltexts.length + $selects.length
		// if($alltexts)alllen += $alltexts.length;
		// if($selects)alllen += $selects.length;

		$alltexts.each(jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			$o.data('placeholder',$o.attr(this.attr_placeholder));
			
			if($o.data('placeholder')){//サンプル値がある
				// if($o.data('fd') || $o.val()!=$o.data('placeholder') && $o.val()!=""){//編集している or サンプル値とは違う&空ではない。
				if(!$o.hasClass(this.klass_placeholder) && $o.val()!=""){//placeholderのklass指定がなくて、値がある
					edited++;
				}else{
					empties.push($o);
				}
			}else{
				if($o.val()!=""){
					edited++;
				}else{
					empties.push($o);
				}
			}
		},this));

		$selects.each(jQuery.proxy(function(i,o){
			var $o = jQuery(o);
			var $sel = jQuery(':selected',$o);
			if($sel.length>0 && $sel.val()){
				edited++;
			}else{
				empties.push($o);
			}
		},this));

		// console.log('edited : '+edited)
		// console.log('len : '+$alltexts.length+$selects.length)
		if(alllen == 0){
			jQuery.log('FormHelper::emptyCheckAll() - 検知実行対象のフォームが全くなかった');
			this._emptyChkFlg = 1;
		}else{
			if(alllen <= edited){
				this._emptyChkFlg = 1; //全てOK
			}
		}
		//引数用に配列にした空のフィールドへの参照を
		this.emptyFields = empties;
	}
	
	
	/**
	 * blurイベント時にvalueにかけるフィルタ。
	 * こいつら指定した完全なkillはEventObserverとか書かないとダメか..
	 * @param $tar targetDOM(jq
	 * @param type FormHelper.FILTER_TYPE (def:HALF_NUMBER
	 * @param replace 置換法方。 "remove":それ以外の文字は除去(HALF_NUMBER,TEL,EMAIL以外未実装) | "replace":該当文字のみ置換 (def:replace
	 * @param exec_event "blur" (def:blur
	 * @param exec_event_length autoexecがfalse以外の時、valueが?文字以上の時実行 (def:1
	 */
	,addFilter:function(target_selector,type,replace,exec_event,FHConvertOptions){
		var $targets = jQuery(target_selector,this.$);
		
		// if(!$tar || !$tar.length) return false;
		//jqueryobjがあるなしor複数はeachで対応
		
		if(!type) type = FormHelper.FILTER_TYPE.HALF_NUMBER;
		if(typeof replace == "undefined") replace = "replace";
		if(typeof exec_event == "undefined") exec_event = "blur";
		//if(typeof exec_event_length == "undefined") exec_event_length = 1;
		
		// $tar.on(exec_event,jQuery.proxy(function(){
		// 	var val = $tar.attr('value'); //.val()では入力中の文字は取れない
		// 	$tar.val(this._applyFilter(val,type,replace));
		// },this));
		$targets.each(jQuery.proxy(function(i,o){
			var $tar = jQuery(o)
			$tar.on(exec_event,jQuery.proxy(function(){
				var val = $tar.attr('value'); //.val()では入力中の文字は取れない
				$tar.val(this._applyFilter(val,type,replace,FHConvertOptions));
			},this));
		},this));
	}
	
	/**
	 * 数値用フィルタ。最大値と最小値も。
	 * [120622]blurのタイミングに不安材料あり
	 * @param range new Range(**,**) | {min:**,max:**}
	 */
	,addNumFilter:function(target_selector,digit,range,FHConvertOptions){
		
		if(typeof range == 'undefined'){
			range = new Range();
		}else{
			if(typeof range.min == 'undefined')range.min=-Infinity;
			if(typeof range.max == 'undefined')range.max=Infinity;
		}
		var $targets = jQuery(target_selector,this.$);
		//イベント
		$targets.each(jQuery.proxy(function(i,o){
			var $tar = jQuery(o)
			$tar.on("blur",jQuery.proxy(function(e){
				var val = $tar.attr('value');
				val = this._applyFilter(val,FormHelper.FILTER_TYPE.HALF_NUMBER,"remove",FHConvertOptions);
				if(Number(val)<range.min){val = range.min}
				if(Number(val)>range.max){val = range.max}
				$tar.val(NumHelper.disitsFormatter(val,digit));
			},this));
		},this));
	}
	
	/* フィルタの実行 */
	,_applyFilter:function(val,type,replace,FHConvertOptions){
		if(!type) type = FormHelper.FILTER_TYPE.HALF_NUMBER;
		if(typeof replace == "undefined") replace = "replace";

		//FHConvertのオプション。{jaCode:(’”￥の変換。default:false),space:(スペース変換default:false),convSet:自前の変換処理を指定。}
		var opt = (typeof FHConvertOptions == 'object') ? FHConvertOptions : {};

		//置換(+除去？
		switch(type){
			case FormHelper.FILTER_TYPE.HALF_NUMBER:
				val = FHConvert.ftoh(val,opt);
				if(replace == "remove"){
					val = val.replace(/[^0-9]/g,'');
				}
			break;
			case FormHelper.FILTER_TYPE.TEL:
				val = FHConvert.ftoh(val,opt);
				if(replace == "remove"){
					val = val.replace(/[^0-9\*\#\-]/g,'');
				}
			break;
			case FormHelper.FILTER_TYPE.EMAIL_RFC2822:
			case FormHelper.FILTER_TYPE.EMAIL:
				val = FHConvert.ftoh(val,opt);
				if(replace == "remove"){
					//val = val.replace(/[^0-9a-zA-Z_\-\.@]/g,'')
					val = val.replace(/[^0-9a-zA-Z_\-\.\!\#\$\%\&\’\*\+\-\/\=\?\^\`\{\|\}\~@]/g,'');
				}
			break;
			case FormHelper.FILTER_TYPE.FULL_KANA:
				val = FHConvert.hgtokk(val,opt);
				val = FHConvert.hkktofkk(val,opt);
				if(replace == "remove"){
					//val = val.replace(/[^ァ-ン]/g,'');
				}
			break;
			case FormHelper.FILTER_TYPE.HALF_TO_FULL:
				val = FHConvert.hkktofkk(val,opt);
				val = FHConvert.htof(val,opt);
			break;
			case FormHelper.FILTER_TYPE.FULL_TO_HALF:
				val = FHConvert.fkktohkk(val,opt);
				val = FHConvert.ftoh(val,opt);
			break;
		}
		return val;
	}
	
	
	
	/**
	 * 郵便番号(zipCode)から住所の入力.
	 * (x)初回のみヘッダにajaxzip3を読み込んでます。
	 * zip入力欄が1つ、都道府県はselect,option|inputどちらでもOK.
	 * @param {[type]} zip_selector      [description]
	 * @param {[type]} prefName          [description]
	 * @param {[type]} addressName       [description]
	 * @param {[type]} exec_event        "keyup blur":def| "keyup" | "blur"
	 * @param {[type]} exec_event_length 1-7文字目から検索(def:7
	 * @param {[type]}                   [description]
	 */
	// ,addAddressAutoFill:function(zip_selector, prefName, addressName, exec_event, exec_event_length){
	// 	var $zip = jQuery(zip_selector,this.$);
	// 	if(typeof AjaxZip3 == 'undefined'){
	// 		//※ヘッダに書くとエラる！
	// 		if(location.href.substr(0,5)=="https"){
	// 			//セキュアサーバー対応版
	// 			jQuery('head').append(FormHelper.HTM_AJAXZIP3_HTTPS);
	// 		}else{
	// 			jQuery('head').append(FormHelper.HTM_AJAXZIP3);
	// 		}
	// 	}
	// 	if(typeof exec_event == "undefined") exec_event = "keyup blur"; //keyup blur
	// 	if(typeof exec_event_length == "undefined") exec_event_length = 7;
	// 	//$zip.data('autofill_exec_timing',)
		
	// 	var replaceFn = jQuery.proxy(function(e){
	// 		var zip = $zip.attr('value');
	// 		if(zip.length < exec_event_length) return;
			
	// 		AjaxZip3.zip2addr($zip.get(0),'',prefName,addressName)
	// 	},this);
		
	// 	//イベント
	// 	$zip.on(exec_event,replaceFn);
	// }
	
	/**
	 * zipの入力欄が2個のバージョン
	 */
	// ,addAddressAutoFill2:function(zip_selector1,zip_selector2,prefName,addressName,exec_event,exec_event_length){
	// 	var $zip1 = jQuery(zip_selector1,this.$);
	// 	var $zip2 = jQuery(zip_selector2,this.$);
	// 	if(typeof AjaxZip3 == 'undefined'){
	// 		//※ヘッダに書くとエラる！
	// 		if(location.href.substr(0,5)=="https"){
	// 			//セキュアサーバー対応版
	// 			jQuery('head').append(FormHelper.HTM_AJAXZIP3_HTTPS);
	// 		}else{
	// 			jQuery('head').append(FormHelper.HTM_AJAXZIP3);
	// 		}
	// 	}
	// 	if(typeof exec_event == "undefined") exec_event = "blur";
	// 	if(typeof exec_event_length == "undefined") exec_event_length = 4;
	// 	//$zip.data('autofill_exec_timing',)
		
	// 	var replaceFn = jQuery.proxy(function(e){
	// 		var zip = $zip2.attr('value');
	// 		if(zip.length<exec_event_length) return;
			
	// 		AjaxZip3.zip2addr($zip1.get(0),$zip2.get(0),prefName,addressName)
	// 	},this)
		
	// 	//イベント
	// 	$zip2.on(exec_event,replaceFn);
	// }

	/**
	 * ajaxzip3のパラメータ全部突っ込むバージョン
	 * @param {[type]} zip_selector1     郵便番号1のセレクタ
	 * @param {[type]} zip_selector2     郵便番号2のセレクタ(指定しない場合はfalse or '' or null
	 * @param {[type]} prefName          都道府県inputのname属性
	 * @param {[type]} cityName          市区町村inputのname属性
	 * @param {[type]} townName          inputのname属性
	 * @param {[type]} strtName          inputのname属性
	 * @param {[type]} exec_event        イベント発火タイミング "keyup" | "blur" | "keyup blur" def:"keyup blur"
	 * @param {[type]} exec_event_length keyupの場合、何文字目で照会するか def:4(zip_selector2	が無いときは 7)
	 */
	,addAjaxZip3:function(zip_selector1,zip_selector2,prefName,cityName,townName,strtName,exec_event,exec_event_length){
		var $zip = [];
		$zip[0] = jQuery(zip_selector1,this.$);
		$zip[1] = zip_selector2 ? jQuery(zip_selector2,this.$) : false;

		if(typeof AjaxZip3 == 'undefined'){
			//※ヘッダに書くとエラる！
			if(location.protocol=="https:"){
				//セキュアサーバー対応版
				jQuery('head').append(FormHelper.HTM_AJAXZIP3_HTTPS);
			}else{
				jQuery('head').append(FormHelper.HTM_AJAXZIP3);
			}
		}
		if(typeof exec_event == "undefined") exec_event = "keyup blur";
		if(typeof exec_event_length == "undefined") exec_event_length = 7;//$zip[1] ? [3,4] : 7;
		//$zip.data('autofill_exec_timing',)
		
		var replaceFn = jQuery.proxy(function(e){
			var zip = [$zip[0].val()];
			if($zip[1]) zip.push($zip[1].val());

			//短い場合は処理しない(APIリクエストを制限
			if(zip.join().length < exec_event_length) return;

			//ハイフン抜きで8桁以上なら詰める
			if(e.type === 'blur'){
				for (var i = 0; i < zip.length; i++) {
					zip[i] = FHConvert.ftoh(zip[i],{});//{space:true});
					zip[i] = zip[i].replace(/[^0-9]/g,'');
					var max = 10; //詰める字数
					if($zip[1]){
						if(i == 0){
							max = 3;
						}else{
							max = 4;
						}
					}else{
						max = 7;
					}
					if(zip[i].length > max) zip[i] = zip[i].substr(0,max);
					$zip[i].val(zip[i]);
				};
			}
			
			//AjaxZip3.zip2addr( '〒上3桁', '〒下4桁', '都道府県', '市区町村', '町域大字', '丁目番地' );
			//[!]町域大字と丁目番地が逆！？100-8506で検証
			AjaxZip3.zip2addr($zip[0].get(0),$zip[1] ? $zip[1].get(0) : '',prefName,cityName,townName,strtName);

		},this)
		
		//イベント
		if($zip[1]) $zip[1].on(exec_event,replaceFn);
		$zip[0].on(exec_event,replaceFn);
	}
	
	,dateSerects:null
	,initDateSelects:function(year_selector, month_selector, day_selector, empty_option,start_year, end_year, zerofill, zerofill_value){
		if(this.dateSerects == null) this.dateSerects = [];
		this.dateSerects.push( new DateSelects(year_selector, month_selector, day_selector, empty_option, start_year, end_year, zerofill, zerofill_value) );
	}
	
	/**
	 * formとform内のinput,textareaなどの全イベントぶっ殺してappendしたやつ除去
	 * @return {[type]} [description]
	 */
	,kill:function(){
		if(this.$submit_hidden && this.$submit_hidden.length)this.$submit_hidden.remove();
		this.unsetDefaults();
		this.$.off();
		this.$submitBtn.off('click',this._submitBtnClick_);
		this.$all.off();
		// delete this;
	}
	
})
FormHelper.AJAXZIP3_INITIALIZED = false;
FormHelper.FILTER_TYPE={
	HALF_NUMBER:"half_umber" //半角数字のみ。全角数字>半角数字
	,HALF_TO_FULL:"half_to_full"// 半角 > 全角
	,FULL_TO_HALF:"full_to_half"
	,FULL_KANA:"em_kana"//全角かな ひらがな（全角半角）|カタカナ(半角)->カタカナ（全角）
	,TEL:"tel" //半角英数字と
	,EMAIL:"email"
	,EMAIL_RFC2822:"email2822"
}
FormHelper.HTM_AJAXZIP3 = '<script src="https://ajaxzip3.github.io/ajaxzip3.js" charset="UTF-8"></script>';
FormHelper.HTM_AJAXZIP3_HTTPS = '<script src="https://ajaxzip3.github.io/ajaxzip3.js" charset="UTF-8"></script>';

FormHelper.AjaxSubmitEvent = 'ajaxsubmit';
FormHelper.ResumeStopSubmitEvent = 'resumeStopSubmit';

FormHelper.EVENT = {
	BEFORE_SUBMIT:'beforeSubmit'
	,AFTER_SUBMIT:'sfterSubmit'
	,AJAX_SUBMIT:'ajaxsubmit'
	,RESUME_STOP_SUBMIT:'resumeStopSubmit'
	,SUBMIT_CHECK:'submitCheck'
}

if(typeof NumHelper == 'undefined') var NumHelper = new Object();
/**
 * 桁補完
 */
NumHelper.disitsFormatter = function(str,digit){
	var str=String(str);
	var zero="";
	if(str.length<digit){
		var val = digit-str.length;
		for(var i=0;i<val;i++){
			zero += "0";
		}
		str = zero + str;
	}
	return str;
}

/**
 * <input type="password2" name="pswd" /> を
 * <input type="text" name="pswd">と<input type="hidden">に
 */
var OriginalPasswordInput = Class.extend({
	$hidden:null
	,$orig:null
	,tip:'*'
	,valTmp:''
	,init:function($originalPasswordInput,tip){
		this.$orig = $originalPasswordInput;
		if(tip)this.tip = tip;
		this.$hidden = jQuery('<input type="hidden">');
		this.$orig.after(this.$hidden);
		var nameDef = this.$orig.attr('name');
		this.$orig.removeAttr('name');//nameDef+'_dmy');
		// this.$orig.attr('type','text'); "type"要素は
		this.$hidden.attr('name',nameDef);
		this.valTmp = this.$orig.val();
		// this.$orig.on('keyup',jQuery.proxy(this.onKeyup_,this))
		
		this.onBlur = jQuery.proxy(this.onBlur_,this);
		this.onFocus = jQuery.proxy(this.onFocus_,this);
		this.$orig.on('blur',this.onBlur); 
		this.$orig.on('focus',this.onFocus);
		
		//入力フィールドが作られて最初のフォーカスはjsにより自動入力されるかもなので
		this.$orig.one('change',this.onBlur);
		
		this.hide();
	}
	,hide:function(){
		this.onBlur_();
	}
	/*,onKeyup_:function(e){
		var ov = this.$orig.val()
		if(ov.length > this.valTmp){
			this.valTmp += ov.substr(ov.length-1,1)
		}else if(ov.length < this.valTmp){
			this.valTmp = this.valTmp.substr(0,this.valTmp.length-1)
		}
		var ftxt = ''
		for(var i=0;i<this.valTmp.length-2;i++){
			ftxt += this.tip;
		}
		ftxt += this.valTmp.substr(this.valTmp.length-1,1)
		this.$orig.val(ftxt)
		this.$hidden.val(this.valTmp)
	}*/
	,onBlur_:function(e){
		
		//入力フィールドが作られて最初のフォーカスはjsにより自動入力されるかもなので..
		this.$orig.off('change',this.onBlur);
		
		//text => ****
		var ov = this.$orig.val();
		var ftxt = '';
		this.valTmp = ov;
		for(var i=0;i<this.valTmp.length;i++){
			ftxt += this.tip;
		}
		this.$orig.val(ftxt);
		this.$hidden.val(this.valTmp);
	}
	,onFocus_:function(e){
		//戻す
		this.$orig.val(this.valTmp);
	}
	/**
	 * submit飛ばすとき
	 */
	,submit:function(){
	}
});
var Range = Class.extend({
	min:-Infinity
	,max:Infinity
	,init:function(min,max){
		if(typeof min != 'undefined')this.min=min;
		if(typeof max != 'undefined')this.max=max;
	}
})

var DateSelects = Class.extend({
	defaultSelectedYear:1980
	/**
	 * 日付の<select>を使いやすく！
	 * @param empty_option month/dayに空の<option>を入れるかどうか。Stringの場合は出力。 :default=false
	 * @param start_year def:1900 || new Date() Dateクラスが渡されたときはその日以降
	 * @param start_year def:new Date().year || new Date() Dateクラスが渡されたときはその日まで
	 * @param zerofill <option>内の文字をゼロで桁補完するか。 デフォではfalse
	 * @param zerofill_value <option>のvalue値をゼロで桁補完するか。デフォはfalse
	 * 
	 */
	,init:function(year_selector, month_selector, day_selector, empty_option, start_year, end_year, zerofill, zerofill_value){
		this.today = new Date();
		this.sD = (start_year instanceof Date) ? start_year : false;
		this.eD = (end_year instanceof Date) ? end_year : false;
		this.empty_option = empty_option === null ? false : empty_option;
		this.start_year = this.sD ? this.sD.getFullYear() : isNaN(start_year) ? 1900 : start_year;
		this.end_year = this.eD ? this.eD.getFullYear() : isNaN(end_year) ? this.today.getFullYear() : end_year;
		this.start_month = this.sD ? this.sD.getMonth()+1 : 1;
		this.end_month = this.eD ? this.eD.getMonth()+1 : 12;
		this.zerofill = zerofill === null ? false : zerofill;
		this.zerofill_value = zerofill_value === null ? false : zerofill_value;
		this.$y = jQuery(year_selector);
		this.$m = jQuery(month_selector);
		this.$d = jQuery(day_selector);
		this.y_selected_def = jQuery(':selected',this.$y).val();
		this.m_selected_def = jQuery(':selected',this.$m).val();
		this.d_selected_def = jQuery(':selected',this.$d).val();
		if(!this.y_selected_def)this.y_selected_def = this.defaultSelectedYear;
		
		this.$y.children().remove();
		this.$m.prop('disabled',true).children().remove();
		this.$d.prop('disabled',true).children().remove();
		
		//年の初期化はここで。
		for (var i=this.start_year; i <= this.end_year; i++) {
			var $opt = jQuery('<option>')
				.text(i)
				.val(i)
				;
			if(i == this.y_selected_def) $opt.attr('selected','selected');
			this.$y.append($opt);
		}
		
		///bind
		this._setMonthSelect =jQuery.proxy(this.setMonthSelect,this);
		this._setDaySelect =jQuery.proxy(this.setDaySelect,this);
		this.$y.on('change',this._setMonthSelect);
		this.$m.on('change',this._setDaySelect);
		
		///初期値を設定
		this._setMonthSelect();
		this._setDaySelect();
		//if(!this.m_selected_def) this.$m.prop('disabled',true);
		//if(!this.d_selected_def) this.$d.prop('disabled',true);
	}
	
	,_setMonthSelect:null
	,setMonthSelect:function(){
		this.m_selected_def = jQuery(':selected',this.$m).text();
		this.d_selected_def = jQuery(':selected',this.$d).text();
		this.$m.children().remove();
		//this.$d.prop('disabled',true).children().remove()
		if(this.empty_option){
			this.$m.append('<option value="" selected>'+(this.empty_option !== true ? this.empty_option : '')+'</option>');
		}
		//option生成の開始/終了月を求める
		var sm=1,em=12,sy=parseInt(this.$y.val());
		if(this.sD && this.eD){
			if(sy == this.start_year){
				sm = this.sD.getMonth()+1;
			}
			if(sy == this.end_year){
				em = this.eD.getMonth()+1;
			}
		}
		//option生成
		for (var i=sm; i <= em; i++) {
			var text = this.zerofill ? NumHelper.disitsFormatter(i,2) : i;
			var value = this.zerofill_value ? ( this.zerofill ? text : NumHelper.disitsFormatter(i,2) ) : i;
			var $opt = jQuery('<option>')
				.text(text)
				.val(value)
				;
			if(i == parseInt(this.m_selected_def)) $opt.attr('selected','selected');
			this.$m.append($opt);
		}
		//日付も直す
		this._setDaySelect();
		//フォーカス
		this.$m.prop('disabled',false);//.focus()
	}
	
	,_setDaySelect:null
	,setDaySelect:function(){
		var sy = parseInt(this.$y.val()) //jQuery(':selected',this.$y).text()
		,sm = parseInt(this.$m.val()) //jQuery(':selected',this.$m).text()
		;
		this.d_selected_def = jQuery(':selected',this.$d).text();
		// alert(this.d_selected_def)
		this.$d.children().remove();
		if(this.empty_option){
			this.$d.append('<option value="" selected>'+(this.empty_option !== true ? this.empty_option : '')+'</option>');
		}

		//option生成の開始/終了日を求める
		// jQuery.log(sy,this.start_year,this.end_year)
		var sd=1,ed=31;//,sy=parseInt(this.$y.val());
		if(this.sD && this.eD){
			if(sy == this.start_year){
				if(sm == this.start_month){
					sd = this.sD.getDate();
				}
			}
			if(sy == this.end_year){
				if(sm == this.end_month){
					ed = this.eD.getDate();
				}
			}
		}
		for (var i=sd; i <= ed; i++) {
			//存在しない日にちは入れない
			if(!isNaN(parseInt(sy)) && !isNaN(parseInt(sm)) && new Date(parseInt(sy),parseInt(sm-1),i).getDate() != i) break; //月は0から。
			var text = this.zerofill ? NumHelper.disitsFormatter(i,2) : i;
			var value = this.zerofill_value ? ( this.zerofill ? text : NumHelper.disitsFormatter(i,2) ) : i;
			var $opt = jQuery('<option>')
				.text(text)
				.val(value)
				;
			if(i == parseInt(this.d_selected_def)) $opt.attr('selected','selected');
			this.$d.append($opt);
		}
		this.$d.prop('disabled',false);//.focus()
	}
})


/* 都道府県の<select>サンプル
<select name="prefs" id="prefSelect" tabindex="" data-selected-value="" data-placeholder="">
	<option value="" selected>都道府県</option>
	<option value="北海道">北海道</option>
	<option value="青森県">青森県</option>
	<option value="岩手県">岩手県</option>
	<option value="宮城県">宮城県</option>
	<option value="秋田県">秋田県</option>
	<option value="山形県">山形県</option>
	<option value="福島県">福島県</option>
	<option value="茨城県">茨城県</option>
	<option value="栃木県">栃木県</option>
	<option value="群馬県">群馬県</option>
	<option value="埼玉県">埼玉県</option>
	<option value="千葉県">千葉県</option>
	<option value="東京都">東京都</option>
	<option value="神奈川県">神奈川県</option>
	<option value="新潟県">新潟県</option>
	<option value="富山県">富山県</option>
	<option value="石川県">石川県</option>
	<option value="福井県">福井県</option>
	<option value="山梨県">山梨県</option>
	<option value="長野県">長野県</option>
	<option value="岐阜県">岐阜県</option>
	<option value="静岡県">静岡県</option>
	<option value="愛知県">愛知県</option>
	<option value="三重県">三重県</option>
	<option value="滋賀県">滋賀県</option>
	<option value="京都府">京都府</option>
	<option value="大阪府">大阪府</option>
	<option value="兵庫県">兵庫県</option>
	<option value="奈良県">奈良県</option>
	<option value="和歌山県">和歌山県</option>
	<option value="鳥取県">鳥取県</option>
	<option value="島根県">島根県</option>
	<option value="岡山県">岡山県</option>
	<option value="広島県">広島県</option>
	<option value="山口県">山口県</option>
	<option value="徳島県">徳島県</option>
	<option value="香川県">香川県</option>
	<option value="愛媛県">愛媛県</option>
	<option value="高知県">高知県</option>
	<option value="福岡県">福岡県</option>
	<option value="佐賀県">佐賀県</option>
	<option value="長崎県">長崎県</option>
	<option value="熊本県">熊本県</option>
	<option value="大分県">大分県</option>
	<option value="宮崎県">宮崎県</option>
	<option value="鹿児島県">鹿児島県</option>
	<option value="沖縄県">沖縄県</option>
</select>
*/


/*
	fhconvert.js ver1.1.4 <http://distraid.co.jp/demo/js_codeconv.html>
	Fullwidth to Halfwidth, Hiragana to Katakana and vice versa, Unicode charactor converter

	copyright (c) 2008 distraid Inc. <http://distraid.co.jp/>
	This script is freely distributable under the terms of an MIT-style license.

	$Id: fhconvert.js 10 2009-02-16 08:15:24Z ksy $
*/

var FHConvert = {
	ConvPattern: {
		ftoh: {range:{start:0xff01,end:0xff5e}, mod:-0xfee0},
		htof: {range:{start:0x0021,end:0x007e}, mod:+0xfee0},
		hgtokk: {range:{start:0x3041,end:0x3096}, mod:+0x0060},
		kktohg: {range:{start:0x30a1,end:0x30f6}, mod:-0x0060},

		fkktohkk: {range:{start:0x30a1,end:0x30fc}},
		hkktofkk: {range:{start:0xff61,end:0xff9f}, vsm:0xff9e, vsmRange:{start:0xff66,end:0xff9c}, svsm:0xff9f, svsmRange:{start:0xff8a,end:0xff8e}},

		_jftojh: {convSet:{'\u2019':'\u0027','\u201d':'\u0022','\uffe5':'\u005c'}},
		_jhtojf: {convSet:{'\u0027':'\u2019','\u0022':'\u201d','\u005c':'\uffe5'}},

		_fstohs: {convSet:{'\u3000':'\u0020'}},
		_hstofs: {convSet:{'\u0020':'\u3000'}}
	},

	_convertSet: function( value, param ) {
		if ( !value || !param ) return value;
		var str, idx, len = value.length, newVal = '', strArray = new Array(len);
		for ( idx=0; idx<len; idx++ )
		{
			str = value.charAt( idx );
			if ( param['convSet'] && param['convSet'][str]!=null )
				strArray[idx] = param['convSet'][str];
			else
				strArray[idx] = str;
		}
		return strArray.join('');
	},

	_convert: function( value, param ) {
		if ( !value || !param ) return value;
		var code, str, idx, len = value.length, newVal = '', strArray = new Array(len);
		for ( idx=0; idx<len; idx++ )
		{
			str = value.charAt( idx );
			code = str.charCodeAt(0);
			if ( param['convSet'] && param['convSet'][str]!=null )
				strArray[idx] = param['convSet'][str];
			else if ( code >= param['range']['start'] && code <= param['range']['end'] )
				strArray[idx] = String.fromCharCode( code + param['mod'] );
			else
				strArray[idx] = str;
		}
		return strArray.join('');
	},

	_convertReg: function( value, param ) {
		if ( !value || !param ) return value;
		return value.replace( param['convReg'], param['convRepl'] );			
	},

	mergeObj: function( obj1, obj2 ) {
		var obj = {};
		for ( var prop in obj1 )
			obj[prop] = obj1[prop];
		for ( prop in obj2 )
			obj[prop] = obj2[prop];
		return obj;
	},

	_initConvert: function( id, param ) {
		var opt = {id:id}, convSet = null, code;
		if ( !param ) param = {};

		if ( this.ConvPattern[id] )
		{
			opt['range'] = this.ConvPattern[id]['range'];
			opt['mod'] = this.ConvPattern[id]['mod'];
			convSet = this.ConvPattern[id]['convSet'];
		}

		if ( param['jaCode'] )
		{
			if ( id == 'ftoh' )
				convSet = this.mergeObj( convSet, this.ConvPattern['_jftojh']['convSet'] );
			else if ( id == 'htof' )
				convSet = this.mergeObj( convSet, this.ConvPattern['_jhtojf']['convSet'] );
		}

		if ( param['space'] )
		{
			if ( id == 'ftoh' || id == 'fkktohkk' )
				convSet = this.mergeObj( convSet, this.ConvPattern['_fstohs']['convSet'] );
			else if ( id == 'htof' || id == 'hkktofkk' )
				convSet = this.mergeObj( convSet, this.ConvPattern['_hstofs']['convSet'] );		
		}

		if ( typeof param['convSet'] == 'object' )
		{
			convSet = this.mergeObj( convSet, param['convSet'] );
			for ( code in convSet )
			{
				if ( typeof convSet[code] == 'number' )
					convSet[code] = String.fromCharCode( convSet[code] );
			}
		}
		opt['convSet'] = convSet;
		return opt;
	},

	_toRegStr: function( code ) {
		if ( code == null ) return '';
		var idx, strCode = '';
		if ( typeof code == 'string' )
		{
			for ( idx = 0; idx < code.length; idx++ )
				strCode += this._toRegStr( code.charCodeAt(idx) );
			return strCode;
		}
		strCode = '000'+code.toString(16);
		return '\\u'+strCode.substring( strCode.length-4 );	
	},

	_initConvertReg: function( id, param ) {
		if ( !param ) return null;
		var code, prop, val, regStr, rangeCode = '', recode = '', convObj = {}, recodeM = [];
		if ( param['range'] )
		{
			if ( param['mod'] )
			{
				for ( code = param['range']['start']; code <= param['range']['end']; code++ )
					convObj[String.fromCharCode(code)] = String.fromCharCode( code + param['mod'] );
			}
			rangeCode = this._toRegStr(param['range']['start']) + '-' + this._toRegStr(param['range']['end']);
		}

		if ( param['convSet'] )
		{
			for ( prop in param['convSet'] )
			{
				val = param['convSet'][prop];
				regStr = this._toRegStr( prop );
				if ( prop.length > 1 )
					recodeM.push( '('+regStr+')' );
				else {
					code = prop.charCodeAt(0);
					if ( !param['range'] || code < param['range']['start'] || code > param['range']['end'] )
						recode += regStr;
				}
				convObj[prop] = val;
			}
		}
		if ( id == 'hkktofkk' && this.ConvPattern['hkktofkk']['convSetHKK'] )
		{
			for ( prop in this.ConvPattern['hkktofkk']['convSetHKK'] )
				convObj[prop] = this.ConvPattern['hkktofkk']['convSetHKK'][prop];
			recodeM.push( '(['+this._toRegStr(this.ConvPattern['hkktofkk']['vsmRange']['start'])+'-'+this._toRegStr(this.ConvPattern['hkktofkk']['vsmRange']['end'])+']'+this._toRegStr(this.ConvPattern['hkktofkk']['vsm'])+')' );
			recodeM.push( '(['+this._toRegStr(this.ConvPattern['hkktofkk']['svsmRange']['start'])+'-'+this._toRegStr(this.ConvPattern['hkktofkk']['svsmRange']['end'])+']'+this._toRegStr(this.ConvPattern['hkktofkk']['svsm'])+')' );
		}

		recode = rangeCode + recode;
		if ( !recode && recodeM.length <= 0 ) return null;

		if ( recode )
			recode = '(['+recode+'])';
		if ( recodeM.length > 0 )
		{
			if ( recode )
				recodeM.push( recode );
			recode = recodeM.join( '|' );		
		}

		param['convSet'] = null;
		param['convReg'] = new RegExp( recode, 'g' );
		code = prop = val = ragStr = rengeCode = recode = recodeM = null;

		if ( id == 'hkktofkk' )
		{
			param['convRepl'] = function( m0 ) {
				if ( convObj[m0] != null )
					return convObj[m0];
				return convObj[m0.charAt(0)]+convObj[m0.charAt(1)];
			};
		} else
			param['convRepl'] = function( m0 ) { return convObj[m0]; };
		return param;
	},

	ftoh: function( value, param ) {
		return this._convert( value, this._initConvert('ftoh',param) );
	},
	htof: function( value, param ) {
		return this._convert( value, this._initConvert('htof',param) );
	},
	hgtokk: function( value, param ) {
		return this._convert( value, this._initConvert('hgtokk',param) );
	},
	kktohg: function( value, param ) {
		return this._convert( value, this._initConvert('kktohg',param) );
	},
	fkktohkk: function( value, param ) {
		return this._convertSet( value, this._initConvert('fkktohkk',param) );
	},
	hkktofkk: function( value, param ) {
		param = this._initConvert( 'hkktofkk', param );
		param = this._initConvertReg( 'hkktofkk', param );
		return this._convertReg( value, param );
	},

	createCl: function( id, param ) {
		param = this._initConvert( id, param );
		param = this._initConvertReg( id, param );
		if ( !param ) return function( value ) { return value; }
		var bind = FHConvert;
		var proc = function( value ) {	
			return this._convertReg( value, param );
		}
		return function(value) {
			return proc.apply( bind, [value] );
		}
	}	
};

(function(){
	var cp = FHConvert['ConvPattern'];

	var hkkMark = {0x300c:0xff62,0x300d:0xff63,0x3002:0xff61,0x3001:0xff64,0x309b:0xff9e,0x309c:0xff9f};
	var halfcode = [0xff67,0xff71,0xff68,0xff72,0xff69,0xff73,0xff6a,0xff74,0xff6b,0xff75,	
		0xff76,,0xff77,,0xff78,,0xff79,,0xff7a,,0xff7b,,0xff7c,,0xff7d,,0xff7e,,0xff7f,,
		0xff80,,0xff81,,0xff6f,0xff82,,0xff83,,0xff84,,0xff85,0xff86,0xff87,0xff88,0xff89,
		0xff8a,,,0xff8b,,,0xff8c,,,0xff8d,,,0xff8e,,,
		0xff8f,0xff90,0xff91,0xff92,0xff93,0xff6c,0xff94,0xff6d,0xff95,0xff6e,0xff96,
		0xff97,0xff98,0xff99,0xff9a,0xff9b,0xff9c,0xff9c,0xff72,0xff74,0xff66,0xff9d,
		,0xff76,0xff79,,,,,0xff65,0xff70];
	var halfConv = {
		0x30ac:[0xff76,0xff9e],0x30ae:[0xff77,0xff9e],0x30b0:[0xff78,0xff9e],0x30b2:[0xff79,0xff9e],0x30b4:[0xff7a,0xff9e],
		0x30b6:[0xff7b,0xff9e],0x30b8:[0xff7c,0xff9e],0x30ba:[0xff7d,0xff9e],0x30bc:[0xff7e,0xff9e],0x30be:[0xff7f,0xff9e],
		0x30c0:[0xff80,0xff9e],0x30c2:[0xff81,0xff9e],0x30c5:[0xff82,0xff9e],0x30c7:[0xff83,0xff9e],0x30c9:[0xff84,0xff9e],
		0x30d0:[0xff8a,0xff9e],0x30d3:[0xff8b,0xff9e],0x30d6:[0xff8c,0xff9e],0x30d9:[0xff8d,0xff9e],0x30dc:[0xff8e,0xff9e],
		0x30d1:[0xff8a,0xff9f],0x30d4:[0xff8b,0xff9f],0x30d7:[0xff8c,0xff9f],0x30da:[0xff8d,0xff9f],0x30dd:[0xff8e,0xff9f],
		0x30f4:[0xff73,0xff9e],0x30f7:[0xff9c,0xff9e],0x30f8:[0xff72,0xff9e],0x30f9:[0xff74,0xff9e],0x30fa:[0xff66,0xff9e]
	};

	var idx, code, prop, fkkSet = {};
	if ( cp['fkktohkk'] )
	{
		for ( idx = 0, code = cp['fkktohkk']['range']['start']; code <= cp['fkktohkk']['range']['end']; code++, idx++ )
			fkkSet[String.fromCharCode(code)] = String.fromCharCode.apply( null, (halfConv[code]!=null?halfConv[code]:[halfcode[idx]]) );
		for ( code in hkkMark )
			fkkSet[String.fromCharCode(code)] = String.fromCharCode( hkkMark[code] );
		cp['fkktohkk']['convSet'] = fkkSet;
	}

	var vsm = 0xff9e;
	var svsm = 0xff9f;
	var fullcode = [0x3002,0x300c,0x300d,0x3001,0x30fb,
		0x30f2,0x30a1,0x30a3,0x30a5,0x30a7,0x30a9,0x30e3,0x30e5,0x30e7,0x30c3,0x30fc,
		0x30a2,0x30a4,0x30a6,0x30a8,0x30aa,0x30ab,0x30ad,0x30af,0x30b1,0x30b3,0x30b5,0x30b7,0x30b9,0x30bb,0x30bd,0x30bf,0x30c1,0x30c4,0x30c6,0x30c8,
		0x30ca,0x30cb,0x30cc,0x30cd,0x30ce,0x30cf,0x30d2,0x30d5,0x30d8,0x30db,0x30de,0x30df,0x30e0,0x30e1,0x30e2,0x30e4,0x30e6,0x30e8,
		0x30e9,0x30ea,0x30eb,0x30ec,0x30ed,0x30ef,0x30f3,0x309b,0x309c];

	var vsmConv = {
		0xff76:{v:0x30ac},0xff77:{v:0x30ae},0xff78:{v:0x30b0},0xff79:{v:0x30b2},0xff7a:{v:0x30b4},0xff7b:{v:0x30b6},0xff7c:{v:0x30b8},0xff7d:{v:0x30ba},0xff7e:{v:0x30bc},0xff7f:{v:0x30be},
		0xff80:{v:0x30c0},0xff81:{v:0x30c2},0xff82:{v:0x30c5},0xff83:{v:0x30c7},0xff84:{v:0x30c9},
		0xff8a:{v:0x30d0,sv:0x30d1},0xff8b:{v:0x30d3,sv:0x30d4},0xff8c:{v:0x30d6,sv:0x30d7},0xff8d:{v:0x30d9,sv:0x30da},0xff8e:{v:0x30dc,sv:0x30dd},
		0xff73:{v:0x30f4},0xff9c:{v:0x30f7},0xff66:{v:0x30fa}
	};

	var hkkSet = {};
	if ( cp['hkktofkk'] )
	{
		for ( idx = 0, code = cp['hkktofkk']['range']['start']; code <= cp['hkktofkk']['range']['end']; code++, idx++ )
			hkkSet[String.fromCharCode(code)] = String.fromCharCode( fullcode[idx] );

		for ( code in vsmConv )
		{
			if ( vsmConv[code]['v'] )
				hkkSet[String.fromCharCode(code,vsm)] = String.fromCharCode( vsmConv[code]['v'] );
			if ( vsmConv[code]['sv'] )
				hkkSet[String.fromCharCode(code,svsm)] = String.fromCharCode( vsmConv[code]['sv'] );
		}
		cp['hkktofkk']['convSetHKK'] = hkkSet;
	}
})();
