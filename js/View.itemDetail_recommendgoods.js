/**
 * 商品詳細ページ用
 */
;

	// IE8チェック
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";

View.DocWriteSwitcher = (function(w){

	var _C = Class.extend({
		d:null
		,page_is_loaded:false
		,placeholder_id : "docWritePlaceholder"
		,alts:[]
		,_original:null
		,proxy:function(f,t){ return function() {return f.apply(t,arguments);}}
		,_extend:function(s){
			this.alts.push(s);
			if(this.page_is_loaded){
				this._extendPl_();
			}
		}
		,_extendPl_:function(){
			this.el = this.d.getElementById(this.placeholder_id);
			if(!this.el){
				this.el = this.d.createElement('div');
				this.d.body.appendChild(this.el);
				this.el.id = this.placeholder_id;
				this.el.style.height = '1px';
				this.el.style.width = '1px';
				this.el.style.top = '0px';
				this.el.style.position = 'absolute';
				this.el.style.overflow = 'hidden';
			}
			var t = '&nbsp;';
			if(this.alts.length>0){
				t = this.alts.join("");
				this.alts = [];
			}
			this.el.innerHTML = t;

			//pageLoad用イベントできた場合はイベント解除
			this._removeEvents();
			//走らせるのは一回だけでOK
			this.detach();
		}
		,init:function(){
			this.d = w.document;
			this._original = this.d.write; //オリジナル保持
			// pageOnLoadイベント監視用
			if(typeof this.d.addEventListener === 'function'){
				// w.addEventListener("pageshow", this.proxy(this._pl_,this)); //スマホ対応の際、ブラウザバックへの対応でloadのタイミングが変わったためpageshowイベントは不可になった？
				w.addEventListener("load", this.proxy(this._pl_,this));
			}else{
				w.attachEvent("onload", this.proxy(this._pl_,this));
			}
		}
		,_pl_:function(){this.page_is_loaded = true}

		,_addEvents:function(){
			if(typeof this.d.addEventListener === 'function'){
				w.addEventListener("load", this.proxy(this._extendPl_,this));
			}else{
				w.attachEvent("onload", this.proxy(this._extendPl_,this));
			}
		}
		,_removeEvents:function(){
			if(typeof this.d.addEventListener === 'function'){
				w.removeEventListener("load", this.proxy(this._extendPl_,this));
			}else{
				w.detachEvent("onload", this.proxy(this._extendPl_,this));
			}
		}
		,attach:function(){
			this._addEvents();
			this.alts = [];
			this.d.write = this.proxy(this._extend,this);
		}
		//document.write()関数のみオリジナルに戻す。attach<->detach間に実行されたdocument.writeに関しては退避機能が保持される。
		,detach:function(){ this.d.write = this._original; }

	});

	return new _C();

})(window);

View.initPage = function(){

	jQuery('.tab-nav').on('click','a',function(){
		jQuery('html,body').animate({
			scrollTop : jQuery('#pageTitles').offset().top
		}, 'normal');
	});

	//色々読み込み終わるまで止めとく。
	View.waitInitPage = 1;
	View.initCnt = 0;
	View.everyInit = function(){
		View.initCnt++;
		if(View.initCnt >= 3){
		    if (View.waitInitPage) View.onInitAll();
		}
	}
	//naviplusビーコン投下(閲覧)
	if(
		typeof __snahost !== 'undefined' &&
		typeof NP_VARS === 'object' &&
		NP_VARS.key &&
		typeof recoConstructer === 'function'
	){
		var o = {
			k:NP_VARS.key,
			uid:NP_VARS.user_id || void(0),
			bcon:{
				basic:{
					items:[{id:jQuery('#hidden_variation_group').val()}]
				}
			}
		};
		if(!NP_VARS.user_id) delete o.uid; 
		jQuery.log('naviplusビーコン投下',o);
		View.DocWriteSwitcher.attach();
		recoConstructer(o);
		View.DocWriteSwitcher.detach();
	}
	//
	// 関連商品（セクション）;
	//
	
	View.reco1 = new Recommend(1);
	View.reco1.parse = function(d){
		var selector = '#recommend1';
		var selector_sp = '#recommend1_sp';
		
		var htm = '',i,len,$parent;
		var htm_sp = '',i,len,$parent;
		var recommend_category = true;

		if(!d.items || !d.items.length){
			// ヒットした商品がないとき
		}else{
			htm += '<section id="recommend1" class="mb-g7">\
	<div class="w978c ofh">\
		<header class="section-header">\
			<h1>関連商品</h1>\
			<p class="description">この商品を見ている方は、こちらも見ています！</p>\
			<p class="pagetop"><a href="#"><i class="icon ico-16 arrowT"></i>このページの先頭に戻る</a></p>\
		</header>\
		<div class="section-content">\
			<div class="rel-items-carousel ifs ifs-size-M ifs-wi5">\
				<ul class="slides cfx item-list size-S">';
			len = d.items.length;
			for(i=0;i<len;i++){
				if( d.items[i].mb_name !== '99' ) {
					htm += Recommend.parseItem(d.items[i],1);
					recommend_category = false;
				}
			}
			htm += '\
				</ul>\
			</div>\
		</div>\
	</div>\
</section>';

			htm_sp += '<section id="recommend1_sp" class="mb-g7 showSp">\
	<div class="w978c ofh">\
		<header class="section-header">\
			<h1>関連商品</h1>\
		</header>\
		<p class="description">この商品を見ている方は、こちらも見ています！</p>\
		<div class="section-content">\
			<div class="rel-items-carousel ifs ifs-size-M ifs-wi5">\
				<ul class="slides cfx item-list size-S">';
			len = d.items.length;
			for(i=0;i<len;i++){
				if( d.items[i].mb_name !== '99' ) {
					htm_sp += Recommend.parseItem(d.items[i],1);
				}
			}
			htm_sp += '\
				</ul>\
			</div>\
		</div>\
	</div>\
	<div class="morerecommend">\
		<div class="sec-inner-footer">\
			<p><a href="javascript:void(0)">関連商品をもっと見る</a></p>\
		</div>\
	</div>\
	<p class="pagetop"><a href="#"><i class="icon ico-16 arrowT"></i>このページの先頭に戻る</a></p>\
</section>';
			if(recommend_category == true) {
				htm = '',i,len,$parent;
				htm_sp = '',i,len,$parent;
			}
		}
		
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		jQuery(selector_sp).outerHtml(htm_sp);
		

		View.setRecommendCarousel(jQuery(selector));
		//SP版関連商品を上から２番目までを表示、以下アイテムをdivで囲み非表示処理
		jQuery("#recommend1_sp ul.slides li").slice(2).wrap("<div class='moreRead'></div>");
		jQuery(".morerecommend").click(function(){
			jQuery(".moreRead").css("display","block");
			jQuery(this).hide();
		});
	};
	View.reco1.onComplete = function(){
		View.everyInit();
	};
	View.reco1.load({ 'id[]': jQuery('#hidden_variation_group').val()});

	//
	// 関連商品（タブ内）;
	//
	View.reco2 = new Recommend(2);
	View.reco2.parse = function(d){
		var selector = '#recommend2';
		var htm = '',i,len,$parent;
		var recommend_category = true;
		if(!d.items || !d.items.length){
			// ヒットした商品がないとき
		}else{
			htm += '<div id="recommend2" class="tab-inner">\
	<div class="text-section">\
		<h2>この商品を見ている方は、こちらも見ています！</h2>\
	</div>\
	<div class="rel-items">\
		<ul class="item-list size-S clm3">';
			len = d.items.length;
			for(i=0;i<len;i++){
				if( d.items[i].mb_name !== '99' ) {
					htm += Recommend.parseItem(d.items[i],2);
					recommend_category = false;
				}
			}
			htm += '\
		</ul>\
	</div>\
</div>';
			if(recommend_category == true) {
				htm = '',i,len,$parent;
			}
		}
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		View.setRecommendCarousel(jQuery(selector));
		View.initMainTab();
	};
	View.reco2.onComplete = function(){
		View.everyInit();
	};
	View.reco2.load({ 'id[]': jQuery('#hidden_variation_group').val()});

	//
	// 関連商品（カート内）;
	//
	View.reco3 = new Recommend(3);
	View.reco3.parse = function(d){
		var selector = '#recommend3';
		var htm = '',i,len,$parent;
		var recommend_category = true;
		if(!d.items || !d.items.length){
			// ヒットした商品がないとき
		}else{
			htm += '<section id="recommend3">\
	<div class="text-section">\
		<h2>関連商品 <span class="description">この商品を見ている方は、こちらも見ています！</span></h2>\
	</div>\
	<div class="rel-items-carousel ifs ifs-size-M ifs-wi4 mh-auto">\
		<ul class="slides cfx item-list size-S">';
			len = d.items.length;
			for(i=0;i<len;i++){
				if( d.items[i].mb_name !== '99' ) {
					htm += Recommend.parseItem(d.items[i],3);
					recommend_category = false;
				}
			}
			htm += '\
		</ul>\
	</div>\
</section>';
			if(recommend_category == true) {
				htm = '',i,len,$parent;
			}
		}
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		View.setRecommendCarousel(jQuery(selector));
		//ここで初めて買い物かごの中身をinit
	};
	View.reco3.onComplete = function(){
		View.everyInit();
	};
	View.reco3.load({ 'id[]': jQuery('#hidden_variation_group').val()});//View.stocks.itemCode


	/**
	 * タブの初期化
	 */
	View.initMainTab = function(){
	  // タブの内容（テキスト）が空の時、非表示に
		var $tab = jQuery('#tabTop > li');
			  // タブの内容（テキスト）が空の時、非表示に
		var $tab = jQuery('#tabTop > li');
		$tab.each(jQuery.proxy(function(i,o){
			var $li = jQuery(o);
			var $a = jQuery('> a',$li);
			var contentId = ReqUtil.getAnchor($a.attr('href'),true);
			var tabIdx = $tab.index($li);
			var $content = jQuery('#'+contentId);
			//次で使うので保持
			$li.data('$a',$a);
			$li.data('contentId',contentId);
			$li.data('tabIdx',tabIdx);
			$li.data('$content',$content);
			if(!jQuery.trim(jQuery('.tab-inner',$content).text())){
				$li.addClass('disabled');
			}
	  },this));
	  
	  
	  //タブが既に関連商品タブだった時のために最初だけ高さを揃えておく。
	  jQuery("#recommend2 .item .detail").tile(3);

		//min>maxの間でconditionFnがtrueになるindexを探す
		//これ、view系だと割と汎用的な関数かも。
		var walkCondIdSearch = function(startId,min,max,conditionFn,incr){
			var id = startId + incr;
			if(id<min)id=max;
			if(id>max)id=min;
			if(conditionFn(id)){
				return id;
			}else{
				return arguments.callee(id,min,max,conditionFn,incr);
			}
	  };

		/**
		 * タブ内ナビゲーションの生成
		 */
		$tab.each(jQuery.proxy(function(i,o){
			var $li = jQuery(o);
			var tabIdx = $li.data('tabIdx');
			var conditionFn = jQuery.proxy(function(id){
					return !$tab.eq(id).hasClass('disabled');
				},this);
			var bid = walkCondIdSearch(tabIdx,0,$tab.length-1,conditionFn,-1);
			var nid = walkCondIdSearch(tabIdx,0,$tab.length-1,conditionFn,1);
			var $b = $tab.eq(bid);
			var $n = $tab.eq(nid);
			var htm = '';
			if(tabIdx !== 0){ //最初のタブはbackを作らない。
				//back
				htm += '<a href="#!/'+$b.data('contentId')+'" class="left"><i class="icon ico-14 arrowL"></i>'+$b.data('$a').text()+'</a>';
			}
			//next
			htm += '<a href="#!/'+$n.data('contentId')+'" class="right">'+$n.data('$a').text()+'<i class="icon ico-16 arrowR margin-left"></i></a>';

			jQuery('#'+$li.data('contentId')+' .tab-nav').html(htm);
			
		},this));
		
		jQuery('.tab-nav a').click(function(e) {
			var $href = jQuery(this).attr('href').slice(3)
			jQuery('#tabTop a[href=#'+$href+']').click()
			jQuery('html,body').animate({
			scrollTop:jQuery('#pageTitles').offset().top
			});
		});

		/**
		 * tabのhashchange初期化
		 */
		jQuery('.nav-tabs a').click(function(e){
			// View.$w.trigger('hashchange');
			// タブアンカーをハッシュチェンジに変更
			location.hash = ReqUtil.HASH_PREF + ReqUtil.getAnchor(this.href || e.target.href, true);
			//IE8だったらURLにハッシュを追加しない
			//if (!ie8flag) location.hash = ReqUtil.HASH_PREF + ReqUtil.getAnchor(this.href || e.target.href, true);
		});
	}//View.initMainTab

};




