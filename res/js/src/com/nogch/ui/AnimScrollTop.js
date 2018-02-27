/**
 * アニメーションスクロール。[^scrollTop]などに。
 * スクロールアニメーション中にmousewheelイベントがあるとpurgeされます。
 *
 * @require jq,jq.easing
 * 
 * [usage]
	var aScrollTop = new AnimScrollTop(jQuery('body'));
	jQuery('.scrolltop').click(function(){
		if(e.preventDefault)e.preventDefault();
		aScrollTop.to(0);
		return false;
	});
 */
;
 var AnimScrollTop = (function(){
	var ClassName = 'com.nogch.AnimScrollTop';
	// if(typeof AnimScrollTop!="undefined")throw(ClassName+' : は既に定義されています。');
	var isNumber = function(a){ return + a == a };
	var isString = function (obj){return ( typeof(obj) == "string" || obj instanceof String );};
	
	var C = function($target,duration,easing){
		this.init($target,duration,easing);
	};
	C.prototype = {
		$:null
		,animation:{
			duration:720
			,easing:'easeOutQuart'
		}
		,init:function($target,duration,easing){
			//targetの指定がない場合はあwindow全体のscroll(ie,mozilla,webkit対応には htmlとbodyを設定してやる必要あり。)
			if(!$target) $target= jQuery('html,body');
			this.$ = $target;
			if(isNumber(duration))this.animation.duration = duration;
			if(isString(easing))this.animation.easing = easing;
			this._purgeWhileAnimation = jQuery.proxy(this._purgeWhileAnimation_,this);
		}
		/**
		 * スクロールします
		 * @param  {Number|String} n Numberの場合はページ上端からの位置。Stringの場合はjQuery(n)の位置。指定しなければ0
		 * @return {[type]}   [description]
		 */
		,to:function(n){
			// n = isString(n) && !isNumber(n) ? this.$.offset().top : n;
			if(typeof n == "undefined") n = this.$.offset().top;
			if(isString(n) && !isNumber(n)){
				var $tar = jQuery(n,this.$);
				// jQuery.log($tar,$tar.offset())
				if($tar.length){
					// jQuery.log($tar.offset().top ,this.$.offset().top);
					n = $tar.offset().top - this.$.offset().top;
				}else{
					n = 0;
				}
			}
			//スクロール先のターゲットとの差分
			// n = n - $tar.offset().top;

			var ap = jQuery.extend({},this.animation);
			ap.complete = jQuery.proxy(function(){
				this._isMove = false;
				this.$.unbind('mousewheel',this._purgeWhileAnimation);
			},this);

			// this.$.bind('scroll',jQuery.proxy(function(){console.log(this.$.position().top);},this)); //windowでないとあかんか。
			this.$.bind('mousewheel',this._purgeWhileAnimation);
			this._isMove = true;
			this.$.animate({'scrollTop':n},ap);
			// alert('ScrollTo => '+n)
			// alert(this.$.get(0).tagName);
		}
		,_isMove:true
		//自動スクロール中にスクロールイベント監視してあったらアニメーションpurge.
		,_purgeWhileAnimation:null
		,_purgeWhileAnimation_:function(){
			if(!this._isMove)return;
				this.$.stop();
				this._isMove = false;
				this.$.unbind('mousewheel',this._purgeWhileAnimation);
		}
	};
	return C;
})();
