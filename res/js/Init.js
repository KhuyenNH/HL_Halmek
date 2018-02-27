/**
 * 全ページ共通Initialize
 */
;
/*-------------------------------- Dom Leady. --------------------------------*/
//$(function(){
jQuery.event.add(window, ("onpageshow" in window && window.onpageshow === null) ? "pageshow" : "load", function(){
	// if(Conf.isLocal){
		//jsによるpartsの読み込み。> src,href,リンク先など変更 > 置換
		var loader = new LoadParts();
		loader.dispatcher.bind(LoadParts.EVT_LOAD_COMPLETE, View.initAll);
		loader.load();
	// }else{
	// 	View.initAll();
	// }

});
/*---------------------- Window.onLoad (Images Leady!) ----------------------*/
jQuery.event.add(window, "load", function(){

});

/**
 * mayaaのかわりにパーツを読み込む。initはコレが終わったら実行
 * @type {[type]}
 */
var LoadParts = Class.extend({
	$targets:null
	,attr_src:"data-include-src"
	,attr_id:"data-include-id"
	,attr_replace:"data-include-replace"
	,dispatcher:null
	,caches:[]
	,init:function(){
		this.dispatcher = jQuery('<i>');
		this.$targets = jQuery('['+this.attr_src+']');
		// this.$targets.each(jQuery.proxy(this.load,this);
		this.locPath = ReqUtil.getLocationPath();
	}
	,load:function(){
		if(this.$targets.length){
			this.loadstart(this._now);
		}else{
			this.finish();
		}
	}
	,_now:0
	,_urls:[]
	,loadstart:function(idx){
		if(idx >= this.$targets.length){
			this.finish();
			return;
		}
		var $t = this.$targets.eq(idx);
		var u = $t.attr(this.attr_src);
		var cache = this.getCache(u);

		this._urls.push(u);

		if(!cache){
			jQuery.ajax({
				url: Conf.isDevMode ? ReqUtil.makeUniqueUrl(u) : u
				,dataType: 'html'
				,success: jQuery.proxy(this.everySuccess,this)
				,error: jQuery.proxy(this.everyError,this)
				,complete: jQuery.proxy(this.everyComplete,this)
			})
		}else{
			this._dat = cache.dat;
			this.everyComplete();
		}
	}
	,getCache:function(url){
		var cache = false;
		for (var i = 0; i < this.caches.length; i++) {
		 	if(this.caches[i].url == url){
		 		cache = this.caches[i];
		 		break;
		 	}
		};
		 return cache;
	}
	,setPath:function($a,atr){
		var p = $a.attr(atr);
		// jQuery.attr('key','val')のie7でのエラー回避が大変なことに。
		// > 個別に指定しようとした
		// > attr(href)が設定できない。設定するには新しく要素作って差し替えてやるしか無い
		// > そもそもサブパスで記述しててもhtmlレンダリング時にフルパス出力するのでie7以降は処理しない。
		if(jQuery.browser.msie && jQuery.browser.version<=7){
			//IE7以下の処理
			//..
		}else{
			$a.attr(atr,ReqUtil.sp2fp(p,this.src_full));
		}
	}
	,everySuccess:function(htm,type,xhr){
		var $t = this.$targets.eq(this._now);
		//html5をjqueryobjに。
		var $htm = ReqUtil.html5str2jqo(htm);
		//読み込んだhtmlのパスを変更
		this.src_full = ReqUtil.sp2fp($t.attr(this.attr_src));
		jQuery('[href]',$htm).each(jQuery.proxy(function(i,o){
			this.setPath(jQuery(o),'href');
			// var $o = jQuery(o);
			// var p = $o.attr('href');
			// $o.attr({'href':ReqUtil.sp2fp(p,this.src_full)});
		},this));
		jQuery('[src]',$htm).each(jQuery.proxy(function(i,o){
			this.setPath(jQuery(o),'src');
			// var $o = jQuery(o);
			// var p = $o.attr('src');
			// var fp = ReqUtil.sp2fp(p,this.src_full);
			// jQuery('body').append(fp+"<br>");
			// $o.attr('src',fp);
			// $o.attr({'src':ReqUtil.sp2fp(p,this.src_full)});
		},this));
		jQuery('[action]',$htm).each(jQuery.proxy(function(i,o){
			this.setPath(jQuery(o),'action');
			// var $o = jQuery(o);
			// var p = $o.attr('action');
			// $o.get(0).action = ReqUtil.sp2fp(p,this.src_full);
		},this));
		this._dat = $htm;
		//キャッシュに追加
		this.caches.push(
			new PartsCache($t.attr(this.attr_src),this._dat)
		);
	}
	,everyError:function(xhr, stat, error){
		jQuery.log('LoadParts :: [err]ajax読み込みエラー');
		this._dat = jQuery('<p class="error"><i class="icon ico-16 caution"></i>パーツを読み込めませんでした。</p>');
		var $t = this.$targets.eq(this._now);
		//キャッシュに追加
		this.caches.push(
			new PartsCache($t.attr(this.attr_src),this._dat)
		);
	}
	,everyComplete:function(xhr, stat){
		//パース！
		var $t = this.$targets.eq(this._now);
		var $htm = this._dat;
		// jQuery.log('#'+$t.attr(this.attr_id),$htm)
		var $parts = jQuery('#'+$t.attr(this.attr_id),$htm);

		/**
		 * mayaaのdoRenderの解釈間違えてたｗreplaceで中身だけ描画か
		 */
		// if(t.attr(this.attr_replace) = 'true'){
		// 	// $t.attr('id','');//idが被らないように。
		// 	// $t.after($parts);
		// 	// $t.remove();
		// 	$t.replaceWith($parts);
		// }else{
		// 	$t.html($parts.children());//.get(0)
		// }

		switch($t.attr(this.attr_replace)){
			case 'true':
			case 'children':
				//中身のみ描画
				$t.after($parts.children());
				$t.remove();
				break;
			case 'false':
			case 'replace':
			default :
				//差し替え
				$t.replaceWith($parts);
				break;
			case 'append':
				//ラッパ以外差し替え
				$t.html($parts.children());
				break;
		}

		//次へ
		this._now++;
		this.loadstart(this._now);
	}
	//ラスト
	,finish:function(){
		jQuery.log('LoadParts :: finised!','置換したパーツ： length('+this.$targets.length+')', this._urls);
		this.dispatcher.trigger(LoadParts.EVT_LOAD_COMPLETE);
	}
});
LoadParts.EVT_LOAD_COMPLETE = 'complete';

var PartsCache = Class.extend({
	url:null
	,dat:null
	,init:function(url,dat){
		this.url = url;
		this.dat = dat;
	}
});

// スマホ未対応ページ対策
// 「useragent.js」及び「catalog-sp.js」で使用される変数「viewflag」が定義されていなければ、
// スマホ未対応ページとして「#change_view_btm」を消す。
if (typeof(viewflag) == 'undefined'){
	document.write('<style type="text/css">#change_view_btm{ display:none }</style>');
}


//商品一覧Layzuload対応
/*jQuery(window).load(function(){
  jQuery(".lazyload").lazyload({
    effect : "fadeIn"
  });
});*/
