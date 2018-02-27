/**
 * 商品詳細ページ用
 */
;

	// IE8チェック
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();
	if (userAgent.indexOf("msie") != -1 && appVersion.indexOf("msie 8.") != -1) viewflag = "IE8";

/**
 * naviplusビーコン投下用グローバル関数document.write()の拡張
 */
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

	//#!付きURLの時のSP処理
	//var hashtag = escape_html(location.hash);
	//if (hashtag && hashtag.indexOf("#!") != -1){
	//	if (!escapeflag){
		//ヘッダーアコーディオン
	//	jQuery('.elmSearch .slidebtn').wrap('<a href="javascript:void(0)">');
	//	jQuery(".slideBoxsearch").on("click", function() {
	//		jQuery("#slideBoxsearch_sp").slideToggle(100, 'swing');
	//	});
	//	jQuery(".slideBoxguide").on("click", function() {
	//		jQuery("#slideBoxguide_sp").slideToggle(100, 'swing');
	//	});
		//関連商品「もっと見る」
	//	jQuery("#recommend1_sp ul.slides li").slice(2).wrap('<div class="moreRead"></div>');
	//	jQuery(".morerecommend ").click(function(){
	//		jQuery(".moreRead").css("display","block");
	//		jQuery(this).hide();
	//	});
		//アコーディオンを閉じるボタン
	//	jQuery(".closebtnsearch").on("click", function() {
	//		jQuery("#slideBoxsearch_sp").slideUp(100, 'swing');
	//	});
	//	jQuery(".closebtnguide").on("click", function() {
	//		jQuery("#slideBoxguide_sp").slideUp(100, 'swing');
	//	});
		//ご利用ガイド ヘッダーアコーディオン
	//	jQuery(".guide_item h2").on("click", function() {
	//		jQuery(this).toggleClass("opened");
	//		jQuery(this).next('p').slideToggle(100, 'swing');
	//	});
		//商品を探す
	//	jQuery(".slidebtn4").on("click", function() {
	//		jQuery("#slideBox4_sp").slideToggle(100, 'swing');
	//	});
	//	jQuery(".closebtn4").on("click", function() {
	//		jQuery("#slideBox4_sp").slideUp(100, 'swing');
	//	});
	//	}
	//} else {
	//}
	//タブクリック後に上部へ移動
	jQuery('.tab-nav').on('click','a',function(){
		jQuery('html,body').animate({
			scrollTop : jQuery('#pageTitles').offset().top
		}, 'normal');
	});
	/*jQuery('.tab-nav a').click(function() {
		alert("click a!");
		jQuery('html,body').animate({
			scrollTop : jQuery('#pageTitles').offset().top
		}, 'normal');
	});*/

	//色々読み込み終わるまで止めとく。
	View.waitInitPage = 1;
	View.initCnt = 0;
	View.everyInit = function(){
		View.initCnt++;
		if(View.initCnt >= 4){
			if(View.waitInitPage)View.onInitAll();
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
					items:[{id:NP_VARS.item_id}]
				}
			}
		};
		if(!NP_VARS.user_id) delete o.uid; 
		jQuery.log('naviplusビーコン投下',o);
		View.DocWriteSwitcher.attach();
		recoConstructer(o);
		View.DocWriteSwitcher.detach();
	}
	//高さ分マイナスマージンしてる。（Sp版のとき解除する）
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
			//if (767 < win_width){
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		jQuery('#buyBox').css('margin-top',jQuery('#pageTitles').height()*-1);
	}

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}

		timer = setTimeout(function() {
			var win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			//console.log('resized');
			jQuery.log("topページINIT");
			//if (767 < win_width){
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				jQuery('#buyBox').css('margin-top',jQuery('#pageTitles').height()*-1);
			} else {
				// 高さ分マイナスマージン
				jQuery('#buyBox').css('margin-top','0');
			}
		}, 200);
	});

	//在庫
	View.stocks = new Stocks();

	//在庫json.onloadでdb初期化後実行
	View.stocks.onStock = function(){
		/**
		 * 画像スライダー&カルーセル(初回のみ)
		 */
		if(!View.carSlider){
			//カルーセル、大画像のhtml生成
			var that = View.stocks;
			var $tmpl = jQuery('#carouselTmpl');
			var $liTmpl,$con,$car,$lnk,$li,$thum,i,j,label,optlen,opt,imgs,cars;
			$liTmpl = jQuery('.ifs > .slides > li',$tmpl);
			$liTmpl.remove();
			imgs = [];
			cars = [];

			for (i = 0; i < that.clmlen; i++) {
				label = that.dat.column.label[i];
				label_name = that.dat.column.label_name[i];
				optlen = that.dat.options[label].length;
				$con = $tmpl.clone();
				//
				// ラベル名など初期設定
				//
				jQuery('.title',$con).text(jQuery.trim(label_name) ? label_name : '商品画像');//ラベル名がないときは"商品画像"
				$car= jQuery('.ifs',$con);
				$car
					.attr('id','carousel_'+label)
					.attr('data-option-label',label)
				;
				$carList = jQuery('> .slides',$car);
				
				$li = false;

				for (j = 0; j < optlen; j++) {
					opt = this.dat.options[label][j];
					
					//画像指定がないときは突っ込まない。
					if(!opt || (!opt.img && !opt.thumb))continue;
					
					//
					// サムネ
					//
					$li = $liTmpl.clone();
					$li.attr('data-option-id',opt.uid);
					
					$lnk = ('a',$li);
					$lnk.attr('data-original-title',opt.name);

					// new FixedTooltip($lnk); //マウス追従型ツールチップ
					//sp対応（pc版のみnew） > [150407]振り分けする必要無くなったので↑イキ > が、別の実装で対応するため必要なくなったw。
					if (!get_spflag()) new FixedTooltip($lnk);
					
					$thum = jQuery('img',$li);
					$thum.attr('alt',opt.name);
					if(jQuery.browser.msie && jQuery.browser.version <= 7){
						$thum.get(0).setAttribute('src',opt.thumb);
					}else{
						$thum.attr('src',opt.thumb);
					}
					
					$carList.append($li);

					//大画像
					imgs.push('<li><img src="'+opt.img+'" alt="'+opt.name+'"></li>');
				}//endfor::optlen

				//img,thumbの指定が１つもなかったときは表示しない。
				if($li){
					$tmpl.after($con);
					cars.push($car);
				}
			}//endfor::that.clmlen

			//スライダー内大画像は前に入れる。
			jQuery('#imgSlider > .slides').prepend(jQuery(imgs.join('')));

			//テンプレートは除去。
			$tmpl.remove();

			//
			// slider,carousel初期化。
			//
			View.carSlider = new CarouselSlider('#imgSlider');
			//View.carSlider.addCarousel('#carousel1');
			for (i = 0; i < cars.length; i++) {
				if(cars[i] instanceof jQuery){
					View.carSlider.addCarousel('#'+cars[i].attr('id'));
				}
			}
			View.carSlider.addCarousel('#carousel2');
		}
		View.everyInit();
	};
	//在庫読み込み開始
	View.stocks.load();

	//
	// 関連商品（セクション）;
	//
	
	View.reco1 = new Recommend(1);
	View.reco1.parse = function(d){
		var selector = '#recommend1';
		var selector_sp = '#recommend1_sp';
		
		var htm = '',i,len,$parent;
		var htm_sp = '',i,len,$parent;

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
				htm += Recommend.parseItem(d.items[i],1);
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
				htm_sp += Recommend.parseItem(d.items[i],1);
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
		}
		
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		jQuery(selector_sp).outerHtml(htm_sp);
		
		//cloneはNG
		//var cloneElm = jQuery(selector).outerHtml(htm);;
		//jQuery(cloneElm).clone(true).insertAfter('#recommend1');
		
		View.setRecommendCarousel(jQuery(selector));
		//SP版関連商品を上から２番目までを表示、以下アイテムをdivで囲み非表示処理
		jQuery("#recommend1_sp ul.slides li").slice(2).wrap("<div class='moreRead'></div>");
		jQuery(".morerecommend").click(function(){
			jQuery(".moreRead").css("display","block");
			jQuery(this).hide();
		});




/*var resizeTimer;
var interval = Math.floor(1000 / 60 * 10);
 
window.addEventListener('resize', function (event) {
	if (resizeTimer !== false) {
		clearTimeout(resizeTimer);
	}
	resizeTimer = setTimeout(function () {
		var win_width = window.innerWidth;
		if (win_width < 768){
			jQuery('#recommend1 .rel-items-carousel').attr('class','rel-items-carousel_sp');
			jQuery('#recommend1').attr('id','recommend1_sp');
		}else{
			View.setRecommendCarousel(jQuery(selector));
		}
	}, interval);
});*/









	};
	View.reco1.onComplete = function(){
		View.everyInit();
	};
	View.reco1.load({'id[]':View.stocks.itemCode});

	//
	// 関連商品（タブ内）;
	//
	View.reco2 = new Recommend(2);
	View.reco2.parse = function(d){
		var selector = '#recommend2';
		var htm = '',i,len,$parent;
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
				htm += Recommend.parseItem(d.items[i],2);
			}
			htm += '\
		</ul>\
	</div>\
</div>';
		}
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		View.initMainTab();
	};
	View.reco2.onComplete = function(){
		View.everyInit();
	};
	View.reco2.load({'id[]':View.stocks.itemCode});

	//
	// 関連商品（カート内）;
	//
	View.reco3 = new Recommend(3);
	View.reco3.parse = function(d){
		var selector = '#recommend3';
		var htm = '',i,len,$parent;
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
				htm += Recommend.parseItem(d.items[i],3);
			}
			htm += '\
		</ul>\
	</div>\
</section>';
		}
		//常に書き換え
		jQuery(selector).outerHtml(htm);
		View.setRecommendCarousel(jQuery(selector));
		//ここで初めて買い物かごの中身をinit
		View.add_cart = new AddToCart();
	};
	View.reco3.onComplete = function(){
		View.everyInit();
	};
	View.reco3.load({'id[]':View.stocks.itemCode});

	/**
	 * 関連商品カルーセル(コンテンツ内、カート内両方)
	 * (カートmodal内のものは開く度に呼ばれる。)
	 */
	View.setRecommendCarousel = function($parent){
		if(!($parent instanceof jQuery) || $parent.length === 0) return;

		//flexsliderの初期化は一回だけ。
		if(!jQuery('.rel-items-carousel',$parent).data('flexslider')){

			jQuery('.rel-items-carousel',$parent).flexslider({
				namespace: Conf.sliderPref,
				animation: "slide",
				controlNav: false,
				// animationLoop: false,
				slideshow: false,
				// itemWidth: 174,
				// itemMargin: 6,
				// itemWidth: 180,
				itemWidth: 178
				// move:5
			});
		}

		//高さ揃え
		jQuery(".rel-items-carousel .item .detail", $parent).tile();
		jQuery("#recommend2 .rel-items .item-list li .item .detail").tile();
		// jQuery(".rel-items-carousel .ifs-direction-nav, .rel-items-carousel .ifs-viewport").tile();
		// カルーセル、(<)(>)の縦中央揃え
		jQuery('.rel-items-carousel .ifs-direction-nav > li > a',$parent).each(function(){
			var $this = jQuery(this);
			var $p = $this.closest('.ifs');
			if($p && $p.length && $p.height()>0){
				//jQuery('.item-list .item .detail').css('height','114px'); //sp対応
				$this.css('top',($p.height()-$this.height())/2);
			}else{
				//高さが0以下だった場合とかは36px固定？（modalの中とか）
				$this.css('top',6*6);
			}
			jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
			//スライダー高さ調節（Sp版のとき解除する）
			var win_width = window.innerWidth;
			var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
			jQuery.log('pnBodyList = ' + pnBodyList);
			//jQuery("#imgSlider .ifs-viewport .slides.large-images li img, #imgSlider .ifs-direction-nav > li > a").tile();
			jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
			
			//関連商品がない場合の商品画像スライダーのボタンサイズ設定
			//ここに記述するとNG
			/*var timer = false;
			jQuery(window).resize(function() {
				if (timer !== false) {
					clearTimeout(timer);
				}
				timer = setTimeout(function() {
					jQuery(".rel-items-carousel .item .detail", $parent).tile();
					var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
					//jQuery("#imgSlider .ifs-viewport .slides.large-images li img, #imgSlider .ifs-direction-nav > li > a").tile();
					jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
					jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
					jQuery("#recommend2 .rel-items .item-list li .item .detail").tile();
				}, 200);
			});*/
			
		});

		//関連商品がない場合の商品画像スライダーのボタンサイズ設定
		//function外に出す。
		var timer = false;
		jQuery(window).resize(function() {
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				jQuery(".rel-items-carousel .item .detail", $parent).tile();
				var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
				//jQuery("#imgSlider .ifs-viewport .slides.large-images li img, #imgSlider .ifs-direction-nav > li > a").tile();
				jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
				jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
				jQuery("#recommend2 .rel-items .item-list li .item .detail").tile();
			}, 200);
		});
	};//View.setRecommendCarousel


	/**
	 * タブの初期化
	 */
	View.initMainTab = function(){
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

	new DuplicateSpTable('#sizeTable').duplicate();

};

//表示完了後
View.onShown = function(){

	//属性[0]選択プルダウン横の吹き出し表示(すべてshow()後じゃないと位置がずれる
	if(View.stocks.allStockCnt > 0 && View.stocks.optSelectLabelFirst){
		View.stocks.$sbHolderOpt0.tooltip('show');
		// jQuery(window).on('resize',function(e){
		// 	if(View.stocks.allStockCnt > 0 && View.stocks.optSelectLabelFirst) View.stocks.$sbHolderOpt0.tooltip('show');
		// })
	}

	var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
	jQuery.log('pnBodyList = ' + pnBodyList);
	jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);

}

//ツールチップバルーンの表示位置の調整
jQuery(function(){

	var ttflag = 0;
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}

		timer = setTimeout(function() {
			var win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;

			if (767 < win_width){
				if(View.stocks.allStockCnt > 0 && View.stocks.optSelectLabelFirst){
					if(ttflag == 0){
						View.stocks.$sbHolderOpt0.tooltip('show');
						ttflag = 1;
					}
				}
				//お買い物かごトップから他の商品を探すボタンのイメージをSP版と合わせるために変更
				jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem span.text.tx-btn").css({
					'background-image': 'url(/res/img/tx-btn-searchotheritem_item.png)',
					'background-position': '0px 15px',
					'background-repeat': 'no-repeat',
					'text-indent': '100%',
					'font-size': '14px'
					});
				jQuery(".tx-btn.s16-searchotheritem").css({
					'width': '193px',
					'background-position': 'center middle',
					'background-repeat': 'no-repeat',
					'text-indent': '100%',
					'font-size': '14px'
				});
			}

		}, 200);
	});
});

/**
 * [hashchangePage description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
var first_flag = 0;
View.hashchangePage = function(e){
	var hashstr = location.hash.substr(ReqUtil.HASH_PREF.length);
	if (!first_flag){
		var tmp = hashstr;
		hashstr = "";
		first_flag = 1;
		timer = setTimeout(function() {
			hashchange_run(tmp);	
		//}, 1000);
		}, 250);
	}
	hashchange_run(hashstr);

	function hashchange_run(hashstr){
		if(/Tab$/.test(hashstr)){
			//タブ移動のhashchangeのときの挙動(.tab('show')が2回走ることになるがいいかな。)
			jQuery('#tabTop a').each(jQuery.proxy(function(i,o){
				var $o = jQuery(o);
				//disabledつきのtabには移動しない。
				if($o.closest('li').hasClass('disabled'))return;
				//タブ選択
				if(new RegExp(''+RegExp.escape(hashstr)+'$').test($o.attr('href'))){
					$o.tab('show');
					if(hashstr == 'imagesTab'){
						//画像サイズのstyleを削除
						jQuery('#imgSlider .ifs-viewport .slides.large-images li img').removeAttr('style');
						
						var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
						jQuery.log('hashchange pnBodyList = ' + pnBodyList);
						jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
						
						//#imgSliderをリセット
						var imgSlider = jQuery("#imgSlider");
						imgSlider.resize();
						
					}
					if(hashstr == 'relatedTab'){
						//rel高さ揃え
						jQuery("#recommend2 .item .detail").tile(3);
					}
				}
			},this));
		}
	}
};

/**
 * スマホ表示用にレスポンシブテーブルを生成
 * @param  {String} orig_selector		オリジナルとなるテーブルのセレクタ
 */
var DuplicateSpTable = Class.extend({
	$orig: null
	,$sp_wrap: null
	,$sp: null
	,id_suffix: '_sp'
	,visible_class: {
		pc:'showPc',
		// sp:'showSpTable'
		sp:'showSp'
	}
	,init:function(orig_selector){
		this.$orig = jQuery(orig_selector);
		this.$sp_wrap = jQuery('<div class="table-responsive"></div>')
		this.$sp = this.$orig.clone();
		this.$sp.html('');
		this.$sp_wrap.append(this.$sp);
		this.$sp
			.attr('id',this.$orig.attr('id') + this.id_suffix)
			.removeClass(this.visible_class.pc)
			.addClass('w100p') //常にwidth100%
		;
		this.$sp_wrap
			.addClass(this.visible_class.sp)
		;
		var i,j
			,$thd_heads = jQuery('> thead > tr > th:parent', this.$orig)
			,$tbd_rows = jQuery('> tbody > tr', this.$orig)
			,thead_class = jQuery('> thead', this.$orig).attr('class')
			,tbody_class = jQuery('> tbody', this.$orig).attr('class')
		;
		for (i = 0; i < $thd_heads.length; i++) {
			this.$sp.append('<thead class="'+thead_class+'"><tr><th colspan="2">'+$thd_heads.eq(i).text()+'</th></tr></thead>')
			var $tbd = jQuery('<tbody>').addClass(tbody_class);
			for (j = 0; j < $tbd_rows.length; j++) {
				var $row = $tbd_rows.eq(j)
					,h = jQuery('> th',$row).html()
					,b = jQuery('> td',$row).eq(i).html()
				;
				$tbd.append('<tr><th>'+h+'</th><td>'+b+'</td></tr>')
			}
			this.$sp.append($tbd);
		};
		//.odd/.evenつけとく
		View.setTableOddEven(this.$sp)
	}
	,duplicate:function(){
		this.$orig.after(this.$sp_wrap);
		this.$orig.addClass(this.visible_class.pc);
		return this;
	}
	,kill:function(){
		this.$sp_wrap.remove();
		this.$orig.removeClass(this.visible_class.pc);
		return this;
	}
/* レスポンシブテーブルの完全な対応には下記scssが必要（現状未定義）
.table-responsive{
	width:100%;
	overflow-y: hidden;
	overflow-x: auto;
	-ms-overflow-style: -ms-autohiding-scrollbar;
	-webkit-overflow-scrolling: touch;
	>table{
		>thead>tr>th,
		>thead>tr>td,
		>tbody>tr>th,
		>tbody>tr>td,
		>tfoot>tr>th,
		>tfoot>tr>td{ white-space:nowrap; }
	}
}
*/
});

/**
 * 画像スライダーに複数のカルーセルがついた woothemes.flexslider の拡張クラス
 * @type {[type]}
 */
var CarouselSlider = Class.extend({
	$slider:null
	,cars:[]
	,sliderPref:Conf.sliderPref
	,activeKlass:'thumb-selected'
	,optIdAttr:'data-option-id'
	,optLabelAttr:'data-option-label'
	,fsInited:false

	,$selectedList:null

	,init:function(slider_selector){
		this.$slider = jQuery(slider_selector);

		//画像スライダーの方init
		this.$slider.flexslider({
			namespace: this.sliderPref
			// ,selector: ".slides > li"
			,animation: "slide"
			,controlNav: false
			,animationLoop: 1
			,slideshow: false
			,before: jQuery.proxy(this.sliderSlideBefore_,this)
			,after: jQuery.proxy(this.sliderSlideAfter_,this)
			// ,itemWidth: 438+2
			// ,itemMargin: 0
			// ,sync: carousel_selector//"#carousel1"
		});

	}

	/**
	 * スライド変更アニメーション前の挙動。
	 * サムネイルに対する.activecss追加は（すべてのパターンで）ここで実行。
	 * @param  {[type]} ifx [description]
	 * @return {[type]}     [description]
	 */
	,sliderSlideBefore_:function(ifx){
		this.selectedIndex = ifx.animatingTo;
		//ifx.getTarget(ifx.direction);//ifx.currentSlide;
		//.cloneCount,ifx.cloneOffset,this.selectedIndex,ifx.currentSlide);
		
		// jQuery.log(ifx);

		//サムネ選択解除(前に選択したやつのみ)
		if(this.$selectedList && this.$selectedList.length)
			this.$selectedList.removeClass(this.activeKlass)
		;
		
		//現在のcarouselIndex取得
		var idx = 0;
		for (var i = 0; i < this.cars.length; i++) {
			if(this.cars[i].length()-1 < this.selectedIndex-idx){
				idx += this.cars[i].length();
			}else{
				break;
			}
		}
		// if(i>=this.cars.length)i=0;
		if(i>=this.cars.length) return;
		
		var thumbId = this.selectedIndex-idx;
		//画像スライド側で移動した時にカルーセルから選択中のthumbがはみ出した際、変更
		// jQuery.log('carousel:',i)
		var carousel = this.cars[i].jQuery.data('flexslider');
		//carouselがinitされているときのみ
		if(carousel && carousel.last>0){
			// jQuery.log(carousel.currentSlide,carousel.move,carousel.count);
			var nextSlide = Math.floor(thumbId/carousel.move);
			if(carousel.currentSlide != nextSlide){
				// jQuery.log("スライド違うよ！",carousel.currentSlide,nextSlide,carousel)
				carousel.flexAnimate(nextSlide);
			}
		}

		// サムネ選択と保持
		this.$selectedList = this.cars[i].$lists.eq(thumbId).addClass(this.activeKlass);

		this.setSpTooltip();
	}

	,setSpTooltip:function(){
		// (sp用)画像下ツールチップのやつ
		if (this.$selectedList.length <= 0) return;
		var $tip = jQuery('.ifs-sp-tooltip'), active = 0;
		if(get_spflag()){
			var t = this.$selectedList.attr('data-original-title'); //this.$selectedList.attr('title') || 
			active = typeof t != 'undefined' && t.replace(/[\s　]/g,'').length > 0;
		}
		if(active){
			$tip.addClass('active').find('.inner').text(t);
		}else{
			$tip.removeClass('active').find('.inner').text('');
		}
	}

	,sliderSlideAfter_:function(ifx){}

	// ,setCarouselSelection():

	,addCarousel:function(carousel_selector){
		var c = new CarouselSlider.Carousel(carousel_selector,this);

		this.cars.push(c);

		//カルーセルinit.
		c.jQuery.flexslider({
			namespace: this.sliderPref
			// ,selector: ".slides > li"
			,animation: "slide"
			,controlNav: false
			,animationLoop: true
			,slideshow: false
			,itemWidth: 90
			// ,itemMargin: 10
			// ,move:5
			// ,asNavFor: slider_selector//'#slider1'
		});

		c.$lists.on('click',jQuery.proxy(this.onCarList_,this));
		if(this.cars.length === 1){
			//最初は一番初めのやつ選択しまっせ。
			c.$lists.eq(0).addClass(this.activeKlass);
			this.$selectedList = c.$lists;
			this.setSpTooltip();
		}
	}

	,onCarList_:function(e){
		jQuery.preventDefault(e);

		//前選択していたlistの選択解除と新しいの選択はsliderの動作が始まる前に統一しました。
		// if(this.$selectedList && this.$selectedList.length)
		// 	this.$selectedList.removeClass(this.activeKlass)
		// ;
		var $sList =  jQuery(e.target).closest('li');
		var sIdx = 0;

		for (var i = 0; i < this.cars.length; i++) {
			var idx = this.cars[i].$lists.index($sList);
			if(idx == -1){
				sIdx += this.cars[i].length();
			}else{
				sIdx += idx;
				break;
			}
		}
		// $sList.addClass(this.activeKlass);
		// 画像スライダの選択を変更
		this.$slider.flexslider(sIdx);
	}

	/**
	 * オプション（selectbox）選択と連動した画像選択。
	 * html内カルーセルのwrapperにata-option-label、
	 * liにdata-option-idを設定必須
	 * @param  {String} label オプション選択の該当label
	 * @param  {String} oid オプション選択の該当id 
	 * @return {[type]}   [description]
	 */
	,activeSlideByOptionId:function(label,oid){
		if(!StringUtil.isString(oid))return;
		var $l, i, sIdx, n=this.cars.length;
		
		for (i = 0; i < n; i++) {
			//まずラベルチェック
			if(this.cars[i].jQuery.attr(this.optLabelAttr) != label) continue;
			//uidチェック
			$l = jQuery('li['+this.optIdAttr+'="'+oid+'"]',this.cars[i].$);
			if($l.length){
				//選択するのは最初の一個のみ
				if($l.length>1)$l = $l.eq(0);
				$l.trigger('click');
				//sIdx = this.cars[i].$lists.index($l);
				// jQuery.log('CarouselSlider.activeSlideByOptionId()','sIdx:',sIdx);
				// break;
				return;
			}
		}
		// if(typeof sIdx != 'undefined'){
		// 	sIdx
		// }
	}

});
CarouselSlider.Carousel = Class.extend({
	$:null
	,$lists:null
	,length:/*get*/function(){return this.$lists ? this.$lists.length : 0}
	,$prev:null
	,$next:null
	,cs:null //CarouselSliderInstance
	// ,html:

	,init:function(selector,carouselSliderInstance){
		this.cs = carouselSliderInstance;
		this.$ = jQuery(selector);
		this.$lists = jQuery('.slides > li',this.$);
	}
});


/**
 * 在庫数を読み込んでパース、配置設定などをするよ
 */
var Stocks = ItemSelectView.extend({
	//apiのパス
	api:Conf.PATH.json.item_stock
	,itemCode:''
	//load時一緒に投げるパラメータ
	,apiParams:{}
	//dbの用意ができたら実行
	,onStock:null
	//joinした完全な在庫表のクエリ。TAFFY().innerJoin()
	// ,joinedStocks:null
	//qty以外のselectboxの元html.wrapped.
	,htm_opt_select_area:''
+'<div id="optSelectAreaTmpl" class="mb-g2">'
+'	<h3 class="rhead18"><span class="opt-name"></span><span class="rh-bg-r"></span></h3>'
+'	<select name="" id="" onchange="selected_test(this)">'
+'		<option value="">－</option>'
+'	</select>'
+'</div>'

	,init:function(){
		
		this._super();

		this.$table = jQuery('#stockTable');

		//オプション用selectboxが入るとこ
		this.$optSelectsWrap = jQuery('#optSelects');

		//数量セレクトボックス
		this.$qtySelect = jQuery('#qtySelect');

		this.$btnWrap = jQuery('#addToCartBtns');
		// this.$btnWrap.css('position','relative');
		this.$btn_inStock = jQuery('.in-stock > button',this.$btnWrap);
		this.$btn_noStock = jQuery('.no-stock > button',this.$btnWrap);
		this.$btn_noStockAll = jQuery('.no-stock-all > button',this.$btnWrap);
		this.$deliveryDate = jQuery('#deliveryDate');
		this.$badgeTarget = jQuery('#buyBox .stock-badges'); //badgeを突っ込むエリア
		this.$hideByNoStock = jQuery('#buyBox .hb-stock-0');
		this.$hideByNoStockAll = jQuery('#buyBox .hb-stock-0a');

		//商品コードを取得してパース
		var $itemCodeHidden = jQuery('#itemCodeHidden');
		//this.apiParams[$itemCodeHidden.attr('name')] = $itemCodeHidden.val();//View.$body.attr('data-item-code');
		this.itemCode = this.apiParams['itemCd'] = $itemCodeHidden.val();

		//イベント関連に渡すfn作っとく。
		this.onOptSelects_ = jQuery.proxy(this.onOptSelects__,this);

		// newのあとに実行
		// this.load();
	}

	,load:function(){
		jQuery.ajax({
			url:ReqUtil.makeUniqueUrl(this.api)
			,dataType:'json'
			,type:Conf.ajaxMeth
			,data:this.apiParams
			,success:jQuery.proxy(this.success_,this)
			,error:jQuery.proxy(this.ajax_error_,this)
		});
	}


	,success_:function(dat){
		this.dat = dat;
		if(this.dat.error){
			this.showError(this.dat.error.title,this.dat.error.content);
			return;
		}
		
		this.stockDBInit(); //<<<

		if(this.onStock){
			this.onStock.apply(this);
		}
		this.setAllView();
	}

	/**
	 * html表示内容変更
	 */
	,setAllView:function(){
		
		if(this._super() === false)return false;

		//
		// 在庫表
		//
		
		// var q = this.db.stock();
		// var supp_tmpl ='<tr>';
		// var i,j;
		// // try{
		// for (i = 0; i < this.clmlen; i++) {
		// 	var label = this.dat.column.label[i];
			
		// 	q = q.innerJoin(this.db.options[label],[label,'uid'],label+'_');
		// 	supp_tmpl += '<td>{'+label+'_name}<span class="num">({'+label+'_num})</span></td>';
		// }

		var htm = '';
		for (i = 0; i < this.stocklen; i++) {
			htm += '<tr>';
			for (j = 0; j < this.clmlen; j++) {
				var label = this.dat.column.label[j];
				//選択の必要がないときは表には入れない
				if(this.optHasOneEmptyNameField(label)) continue;
				var uid = this.dat.stock[i][label];
				var opt = this.dbGetOpt(label,uid);
				// htm += '<td>'+opt.name+'<span class="num">('+opt.num+')</span></td>';
				htm += '<td>'+opt.name+'</td>';
			}
			htm += '<td data-stock="'+this.dat.stock[i].stock+'">stock count:'+this.dat.stock[i].stock+'</td></tr>';
		}

		// supp_tmpl += '<td data-stock="{stock}">stock count:{stock}</td></tr>';

		// var htm_table_rows = q.supplant(supp_tmpl);

		// this.joinedStocks = q;//使わないか。

		// jQuery.log(q.stringify());
		// jQuery.log(htm_table_rows);
		// jQuery.log(htm);
		// jQuery.log(htm_table_rows==htm);
	
		// return;
		// this.$stock_rows = jQuery(htm_table_rows);
		this.$stock_rows = jQuery(htm);
		
		//バッヂ作成
		jQuery('[data-stock]',this.$stock_rows).each(function(i,o){
			var $o = jQuery(o);
			$o.html(
				View.stockBadge.get(Number($o.attr('data-stock')))
			);
		});
		
		this.setStockTable();
		this.setOptSelects();
		
		return true;
	}

	,$stock_rows:null
	/**
	 * サイズ表の内容差し替え
	 */
	,setStockTable:function(){
		//表内容差し替え
		var htm_thead_rows = '<tr>';
		for (var i = 0; i < this.clmlen; i++) {
			//選択の必要がないときは表には入れない
			if(!this.optHasOneEmptyNameField(this.dat.column.label[i]))
				htm_thead_rows += '<th>'+this.dat.column.label_name[i]+'</th>';
		}
		htm_thead_rows += '<th>在庫状況</th></tr>';
		jQuery('thead',this.$table).html(htm_thead_rows);
		jQuery('tbody',this.$table).html(this.$stock_rows);
		//odd,even追加
		View.setTableOddEven(this.$table);
	}

	/**
	 *数量以外のselectboxの初期化。イベントも。
	 */
	,setOptSelects:function(){
		var i,l,ln,htm_opt_pref,htm_opts,$selectArea,$select,flgFirst=false;

		// var htm_opt_pref = '<option value="" disabled="disabled" selected="selected">▼選択してください</option>';
		// htm_opt_pref = '<option value="" disabled="disabled">▼選択してください</option>';
		
		this.$optSelectAreas = new Array();
		this.$optSelects = new Array();

		//
		this.$optSelectsWrap.empty();

		for (i = 0; i < this.clmlen; i++) {
			var isHidden;
			l = this.dat.column.label[i];
			ln = this.dat.column.label_name[i];
			$selectArea = jQuery(this.htm_opt_select_area);
			this.$optSelectsWrap.append($selectArea);
			$select = jQuery('select',$selectArea);
			$selectArea.attr('id',l+'SelectArea');
			$select
				.selectbox({'speed':Conf.selectOpenSpeed})
				.attr('id',l+'Select')
				.attr('name',l)
			;
			jQuery('.opt-name',$selectArea).text(ln);
			this.$optSelectAreas.push($selectArea);
			this.$optSelects.push($select);

			if(this.optEnables(l)){//フィールドがあるかチェックelse{
				if(this.optHasOneEmptyNameField(l)){
					jQuery.log(l,"選択しなくていい、空の名前フィールドがある : ",l);
					//選択しなくていい、空の名前フィールドをもっているとき。
					//セレクトボックスは表示しないが値は投げられるようにしておく
					$selectArea.addClass('hidden-box');
					htm_opt_pref = ''; //初期値ナシ。
					isHidden = true;
				}else{
					//完全なデータがあるときは選択を表示。
					$selectArea.removeClass('hidden-box');
					htm_opt_pref = '<option value="">▼選択してください</option>';
					isHidden = false;
				}
				$selectArea.show();
				htm_opts = this.dbGetSelectOptionHtm(l);
				//this.db.options[l]().supplant('<option value="{num}" '+this.attr_uid+'="{uid}">{name}({num})</option>');
				$select
					.off('change',this.onOptSelects_)
					.selectbox("detach")
					.html(htm_opt_pref+htm_opts)
					.html(htm_opt_pref+htm_opts+'<optgroup label=""></optgroup>')
					.selectbox("attach")
					.on('change',this.onOptSelects_)
				;
				//[140822] 'まずはここをお選びください'なツールチップ初期化
				// if(l === 'color'){
				// if(i === 0){
				if(!flgFirst && !isHidden){
					var sbx = $select.data('selectbox');
					var $sbHolder = $select.next('.sbHolder');
					// console.log(sbx,$sbHolder)
					$sbHolder
						.tooltip({
							'title':'まずはここをお選びください'
							,'placement':'left'
							,'trigger':'manual'
						})
						// .tooltip('show')
					;
					this.optSelectLabelFirst = l;
					this.$sbHolderOpt0 = $sbHolder;
					//表示テスト
					// setTimeout(jQuery.proxy(function(){this.$sbHolderOpt0.tooltip('show');},this),600);
					flgFirst = true;
				}
			}else{
				$selectArea.hide();
			}
		}
		
		// selectの中身変更

		//一回表示修正しておく。
		this.switchBuyBoxView();
	}

	/**
	 * いろ/サイズが選択される毎に実行。
	 * 数量の設定やボタンのdisable解除などの挙動も。
	 */
	,onOptSelects_:null
	,onOptSelects__:function(e){
		this.switchBuyBoxView();
	}

	/**
	 * 内容修正。qtySelectの<option>設定もここで。
	 * @return {[type]} [description]
	 */
	,switchBuyBoxView:function(){

		var stockCnt = 0, nums = [], uids = [], cond = {}, dcnt=0, disablesAll=false,
		i,ln,$opt,num,uid,badge,delivDate;
		
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
		if(dcnt >= this.clmlen)disablesAll = true;

		this.optSelectedNow = cond;

		//属性選択値による挙動変更
		if(this.optSelectedNow){
			
			//属性（色）選択があった場合
			if(this.optSelectedNow.color){
				// jQuery.log('色選択がありました',this.optSelectedNow.color)
				// カルーセルつきスライダの該当サムネを選択(一方通行
				if(View.carSlider){
					View.carSlider.activeSlideByOptionId('color',this.optSelectedNow.color);
				}
			}

			//属性選択があり、ひとつめの選択肢が選択された場合(colorじゃなくても
			if(this.optSelectedNow[this.optSelectLabelFirst]){
				this.$sbHolderOpt0.tooltip('hide');
			}else{
				// this.$sbHolderOpt0.tooltip('show');
			}
		}

		//数量設定
		//
		if(disablesAll){
			stockCnt = this.db.stock().select("stock");
			delivDate = this.db.stock().select("delivery_date");
		}else{
			stockCnt = this.db.stock(cond).select("stock");
			delivDate = this.db.stock(cond).select("delivery_date");
		}
		stockCnt = stockCnt[0];//Number(stockCnt);//stockCnt.length ? stockCnt[0] : -1;
		delivDate = delivDate[0];//delivDate.length ? delivDate[0] : -1;
		
		jQuery.log('選択商品のストック数:',stockCnt,nums,this.optSelectedNow);
		jQuery.log('配送日時:',delivDate);

		//必要な値が足りていない場合?
		// if((this.colorEnables() && !cid) || (this.sizeEnables() && !sid)){
		// }
		
		// 表示初期化
		// 
		this.$qtySelect
			.selectbox("detach")
			.html('<option value="">－</option>')
			.prop('disabled',true)
		;
		//「買い物かごに入れる」ボタンを隠す(IE8の時は)
		this.$btn_inStock
			.prop('disabled',true)
			.hide()
		;
		//IE8のとき、PIEで作ったタグを消す
		var $vmlAddToCartBtn = jQuery('#addToCartBtns css3-container');
		$vmlAddToCartBtn.hide();

		//通常は表示しておくもの
		this.$hideByNoStock.show();
		this.$hideByNoStockAll.show();
		
		//通常は隠しておくもの
		this.$deliveryDate.hide();
		this.$btn_noStock.hide();
		this.$btn_noStockAll.hide();
		this.$badgeTarget.empty();
		// this.$colorSelect.prop('disabled',false);
		// this.$sizeSelect.prop('disabled',false);
		// this.$qtySelect.prop('disabled',false);

		// 振り分けて表示
		//
		// if(this.allStockCnt<=0 && stockCnt <=0){
		if(this.allStockCnt === 0){
			//全在庫なし(ページがロードされてから絶対一回しか通らないわけでもない。)
			jQuery.log('-- 完売 --');
			this.$qtySelect.selectbox("attach").selectbox("disable");
			//スマホ版在庫なし処理
			jQuery('#colorSelect').css('border','1px dotted #CCC2B7');
			jQuery('#sizeSelect').css('border','1px dotted #CCC2B7');
			jQuery('#qtySelect').css('border','1px dotted #CCC2B7');
			jQuery('#colorSelect').css('color','#B1ADAB');
			jQuery('#sizeSelect').css('color','#B1ADAB');
			jQuery('#qtySelect').css('color','#B1ADAB');
			this.$btn_noStockAll.show();
			badge = View.stockBadge.get(0);
			this.$hideByNoStock.hide();
			this.$hideByNoStockAll.hide();

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
			};

		}else{
			if(stockCnt == null){ //
				//初期状態（色/サイズ選択がある場合 & それぞれが選択されていないとき）& 必要なselectの未選択時
				this.$qtySelect.selectbox("attach").selectbox("disable");
				jQuery('#qtySelect').css('border','1px dotted #CCC2B7');
				jQuery('#qtySelect').css('color','#B1ADAB');
				this.$btn_inStock.show().prop('disabled',false); //ボタンは押させたいらしい
				$vmlAddToCartBtn.show();
				// this.$sbHolderOpt0.tooltip('show');

			}else if(stockCnt === 0){
				//選択商品のみ在庫なし
				this.$qtySelect.selectbox("attach").selectbox("disable");
				jQuery('#qtySelect').css('border','1px dotted #CCC2B7');
				jQuery('#qtySelect').css('color','#B1ADAB');
				this.$btn_noStock.show();
				badge = View.stockBadge.get(stockCnt);
				this.$hideByNoStock.hide();
				
			}else if(stockCnt == -1){
				//必要なselectの未選択(初期状態？)
				this.$qtySelect.selectbox("attach").selectbox("disable");
				jQuery('#qtySelect').css('border','1px dotted #CCC2B7');
				this.$btn_inStock.show();
				$vmlAddToCartBtn.show();
			}else{
				//在庫あり（|残り僅か）
				var htm_opt = '';
				for (i = 1; i <= Math.min(stockCnt,Conf.qtySelectMax); i++) {
					htm_opt += '<option value="'+i+'">'+i+'</option>';
				}
				this.$qtySelect
					.prop('disabled',false)
					//.html(htm_opt + '<optgroup label=""></optgroup>')
					.html(htm_opt)
					.selectbox("attach")
				;
				badge = View.stockBadge.get(stockCnt);
				this.$btn_inStock
					.show()
					.prop('disabled',false)
				;
				$vmlAddToCartBtn.show();
				//配送日時設定は在庫ありでfbのdeliveryDateに文字列が入っていた時のみ
				if(delivDate){
					jQuery('[data-replacement]',this.$deliveryDate).html(delivDate);
					this.$deliveryDate.show();
				}
				jQuery('#qtySelect').css('border','1px solid #A39687');
				jQuery('#qtySelect').css('color','#1A0F08');
			}
		}
		
		//バッジappend
		if(badge){
			$badge = jQuery(badge);
			this.$badgeTarget.append($badge);
			$badge.hide().fadeIn(320);//addClass('fade in');
		}

	}

});

/**
 * カートに入れる関連
 * @type {[type]}
 */
var AddToCart = AjaxErrorImpl.extend({
	api:''
	,dat:{}
	,thumbSrcDef:""
	// ,thumbAltDef:""
	,init:function(){
		this.$form = jQuery('#addToCartForm');
		this.$itemTotal = jQuery('.item-total'); //全
		this.$amountTotal = jQuery('.amount-total'); //全
		this.$modal = jQuery('#added2cartModal');

		//modalが開いた時にカルーセル内itemの高さを合わせる。
		this.$modal.on('shown', jQuery.proxy(function(e){
			View.setRecommendCarousel(this.$modal);
			//[150721]何故か#recommend3カルーセル上のitemが重なって表示されてしまうのでしゃーなしの適当処置
			jQuery(window).trigger('resize');
		},this));

		//サムネを変更するための保持値
		this.$thumb = jQuery('.item-box .img img',this.$modal);
		this.thumbSrcDef = this.$thumb.attr('src');
		// this.thumbAltDef = this.$thumb.attr('alt');

		this.api = Conf.PATH.json.add_to_cart; //this.$form.attr('action');
		
		this.helper = new FormHelper(this.$form,true);
		this.helper.setSelectedValues();
		this.helper.setDefaults();
		this.$form.on(FormHelper.AjaxSubmitEvent, jQuery.proxy(this.submitForm_,this));
	}
	,submitForm_:function(evt,api,meth,values){
		// jQuery.log(arguments);
		jQuery.ajax({
			url:ReqUtil.makeUniqueUrl(this.api)
			,dataType:'json'
			,type:meth ? meth : Conf.ajaxMeth
			,data:values
			,success:jQuery.proxy(this.success_,this)
			,error:jQuery.proxy(this.ajax_error_,this)
		});
	}
	,success_:function(dat,xhr){
		this.dat = dat;
		if(this.dat.error){
			//jsonのエラーが帰ってきた時。
			this.showError(this.dat.error.title,this.dat.error.content);
			return;
		}

		//view修正
		this.setViews();
		
		//イベント関連ぶっ殺し
		this.kill();

		//在庫をリロード。
		if(View.stocks)View.stocks.load();

		//naviplusビーコン投下(カート投入)
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
					heavy:{
						items:[{id:NP_VARS.item_id}]
					}
				}
			};
			if(!NP_VARS.user_id) delete o.uid;
			jQuery.log('naviplusビーコン投下',o);
			View.DocWriteSwitcher.attach();
			recoConstructer(o);
			View.DocWriteSwitcher.detach();
		}

		//復帰
		this.init();
	}

	,showError:function(title,content,disableModal){

		//impl.
		this._super(title,content,disableModal);

		//イベント関連ぶっ殺し
		this.kill();

		//在庫をリロード。せんでもよい？かと思ったけど、在庫なくなった時には必要か。
		if(View.stocks)View.stocks.load();
		
		//復帰
		this.init();
	}

	,setViews:function(){
		this.$itemTotal.text(this.dat.fmt_item_total);
		this.$amountTotal.text(this.dat.fmt_amount_total);

		//スマホ表示でカート数量から「点」を削除
		jQuery('.cntWrap').each(function(){
			var txt = jQuery(this).text();
			jQuery(this).text(
				txt.replace(/点/g,"")
			);
		});

		//カートに追加した商品の詳細取得
		var optFormat = View.stocks.getPostedOptionsHtml();
		jQuery('.item-box .options',this.$modal).html(optFormat);

		//thumbnailの切り替え
		var thumb = this.thumbSrcDef;
		// var alt = this.thumbAltDef;
		var that = View.stocks;
		var l,uid,clmidx,newThumb;
		for(l in that.optSelectedNow){
			if(!that.optEnables(l) || !that.optSelectedNow[l]){
				continue;
			}else{
				uid = that.optSelectedNow[l];
				q = that.db.options[l]({'uid':uid});
				clmidx = ArrayUtil.indexOf(that.dat.column.label,l);
				hn = clmidx === -1 ? '' : that.dat.column.label_name[clmidx];
				newThumb = q.select('thumb').toString();
				alt = q.select('name').toString();
				if(!newThumb){
					continue;
				}else{
					//最初に見つかったサムネを指定。
					thumb = newThumb;
					// alt = ;
					break;
				}
			}
		}
		if(jQuery.browser.msie && jQuery.browser.version <= 7){
			this.$thumb.get(0).setAttribute('src',thumb);
		}else{
			this.$thumb.attr('src',thumb);
		}
		// jQuery.log(this.$thumb,thumb)
		//altはできるだけ処理を軽くするためになしの方向で。
		// this.$thumb.attr('alt',alt);
		
		this.$modal.modal('show');
		// this.$modal.data('modal').show();
	}

	,kill:function(){
		this.helper.kill();
		this.$form.off(FormHelper.AjaxSubmitEvent);
	}
});

function get_spflag(){
	var flag = 0;
	var ua = navigator.userAgent;
	
	if (ua.indexOf('iPhone') != -1) {
		flag = 1;	//iPhone
	}else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
		flag = 1;	// Android
	}else if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || ua.indexOf('A1_07') > 0 || ua.indexOf('SC-01C') > 0 ){
		flag = 1;	// Android tablet
	}else if(ua.indexOf('iPad') != -1){
		flag = 1;	// iPad
	}
	
	return flag;
}

jQuery(function(){
	//jQuery("#recommend1_sp ul.slides li").slice(2).wrap("<div class='moreRead'></div>");
	//SPアイテムをdivで囲み非表示にしたアイテムを表示するボタン処理
	//jQuery(".morerecommend").click(function(){
	//	jQuery(".moreRead").css("display","block");
	//	jQuery(this).hide();
	//});

	var win_width = window.innerWidth;
	if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
		//お買い物かごトップから他の商品を探すボタンのイメージをSP版と合わせるために変更
		jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem span.text.tx-btn").css({
			'background-image': 'url(/res/img/tx-btn-searchotheritem_item.png)',
			'background-position': '0px 0px',
			'background-repeat': 'no-repeat',
			'padding': '0',
			'text-indent': '100%',
			'font-size': '14px',
			'-webkit-box-sizing': 'border-box',
			'-moz-box-sizing': 'border-box',
			'-webkit-box-sizing': 'border-box',
			'-ms-box-sizing': 'border-box',
			'box-sizing': 'border-box'
		});
		jQuery(".tx-btn.s16-searchotheritem").css({
			'width': '193px',
			'height': '17px',
			'background-position': 'center middle',
			'background-repeat': 'no-repeat',
			'text-indent': '100%',
			'font-size': '14px'
		});
	}


	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}

		timer = setTimeout(function() {
			var win_width = window.innerWidth;
			if (!win_width) win_width = document.body.clientWidth;
			if ((viewflag == "defult" && 767 < win_width) || viewflag == "PC" || viewflag == "iPad" || viewflag == "Android tablet"  || viewflag == "IE8"){
				jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem").css({
					'width': '252px',
					'height': '42px',
					'margin': '9px 0 12px 12px',
					'padding': '12px 0 0 0',
					'-webkit-box-sizing': 'border-box',
					'-moz-box-sizing': 'border-box',
					'-webkit-box-sizing': 'border-box',
					'-ms-box-sizing': 'border-box',
					'box-sizing': 'border-box',
					'border-radius': '10px'
				});
				jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem span.text.tx-btn").css({
					'background-image': 'url(/res/img/tx-btn-searchotheritem_item.png)',
					'background-position': '0px 0px',
					'background-repeat': 'no-repeat',
					'padding': '0',
					'text-indent': '100%',
					'font-size': '14px',
					'-webkit-box-sizing': 'border-box',
					'-moz-box-sizing': 'border-box',
					'-webkit-box-sizing': 'border-box',
					'-ms-box-sizing': 'border-box',
					'box-sizing': 'border-box'
				});
				jQuery(".tx-btn.s16-searchotheritem").css({
					'width': '193px',
					'height': '17px',
					'background-position': 'center middle',
					'background-repeat': 'no-repeat',
					'text-indent': '100%',
					'font-size': '14px'
				});
			} else {
				jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem span.text.tx-btn").css({
					'background-image': 'none',
					'background-position': '0px 0px',
					'background-repeat': 'no-repeat',
					'margin': '0',
					'padding': '0',
					'width': '100%',
					'height': 'auto',
					'text-indent': '0',
					'-webkit-box-sizing': 'border-box',
					'-moz-box-sizing': 'border-box',
					'-webkit-box-sizing': 'border-box',
					'-ms-box-sizing': 'border-box',
					'box-sizing': 'border-box',
					'font-size': '20px'
				});
				jQuery("#added2cartModal .cart-box a.btn.btn-green.btn-searchotheritem").css({
					'width': '100%',
					'height': '54px',
					'display': 'block',
					'margin': '0',
					'padding': '0 10px 0 0',
					'border': '1px solid #1D3D26',
					'font-size': '20px',
					'font-weight': 'bold',
					'text-align': 'center',
					'text-decoration': 'none',
					'background': 'url(/res/img/sp_itemadd_btn.png) repeat-x left top',
					'text-shadow': 'none',
					'position': 'relative',
					'-webkit-box-sizing': 'border-box',
					'-moz-box-sizing': 'border-box',
					'-webkit-box-sizing': 'border-box',
					'-ms-box-sizing': 'border-box',
					'box-sizing': 'border-box',
					'border-radius': '5px'
				});
			}
		}, 200);
	});
});

//optgroup選択時の回避処理

function selected_test(select){
	if (viewflag == "iPad" || viewflag == "iPhone"){
		var select_name = jQuery(select).attr("name");
		if (select_name == "color"){
			if (!jQuery("option:selected",select).text()){
				jQuery(select).val(colorVal);
			}else{
				colorVal = select.value;
			}
		}else if (select_name == "size"){
			if (!jQuery("option:selected",select).text()){
				jQuery(select).val(sizeVal);
			}else{
				sizeVal = select.value;
			}
		}
	}
}

var colorVal;
var sizeVal;
var qtyVal = 1;

jQuery(function(){

	if (viewflag == "iPad" || viewflag == "iPhone"){
		jQuery('#optSelects').on('focusout','#colorSelect',function(){
			if (!jQuery("option:selected",this).text()){
				jQuery(this).val(colorVal);
			}else{
				colorVal = this.value;
			}
		});

		jQuery('#optSelects').on('focusout','#sizeSelect',function(){
			if (!jQuery("option:selected",this).text()){
				jQuery(this).val(sizeVal);
			}else{
				sizeVal = this.value;
			}
		});

		jQuery('#optSelects').on('focusout','#qtySelect',function(){
			if (!jQuery("option:selected",this).text()){
				jQuery(this).val(qtyVal);
			}else{
				qtyVal = this.value;
			}
		});
	}
});
