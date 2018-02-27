/**
 * �S�y�[�W����Initialize
 */
;
/*-------------------------------- Dom Leady. --------------------------------*/
//$(function(){
jQuery.event.add(window, ("onpageshow" in window && window.onpageshow === null) ? "pageshow" : "load", function(){
	// if(Conf.isLocal){
		//js�ɂ��parts�̓ǂݍ��݁B> src,href,�����N��ȂǕύX > �u��
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
 * mayaa�̂����Ƀp�[�c��ǂݍ��ށBinit�̓R�����I���������s
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
		// jQuery.attr('key','val')��ie7�ł̃G���[�������ςȂ��ƂɁB
		// > �ʂɎw�肵�悤�Ƃ���
		// > attr(href)���ݒ�ł��Ȃ��B�ݒ肷��ɂ͐V�����v�f����č����ւ��Ă�邵������
		// > ���������T�u�p�X�ŋL�q���ĂĂ�html�����_�����O���Ƀt���p�X�o�͂���̂�ie7�ȍ~�͏������Ȃ��B
		if(jQuery.browser.msie && jQuery.browser.version<=7){
			//IE7�ȉ��̏���
			//..
		}else{
			$a.attr(atr,ReqUtil.sp2fp(p,this.src_full));
		}
	}
	,everySuccess:function(htm,type,xhr){
		var $t = this.$targets.eq(this._now);
		//html5��jqueryobj�ɁB
		var $htm = ReqUtil.html5str2jqo(htm);
		//�ǂݍ���html�̃p�X��ύX
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
		//�L���b�V���ɒǉ�
		this.caches.push(
			new PartsCache($t.attr(this.attr_src),this._dat)
		);
	}
	,everyError:function(xhr, stat, error){
		jQuery.log('LoadParts :: [err]ajax�ǂݍ��݃G���[');
		this._dat = jQuery('<p class="error"><i class="icon ico-16 caution"></i>�p�[�c��ǂݍ��߂܂���ł����B</p>');
		var $t = this.$targets.eq(this._now);
		//�L���b�V���ɒǉ�
		this.caches.push(
			new PartsCache($t.attr(this.attr_src),this._dat)
		);
	}
	,everyComplete:function(xhr, stat){
		//�p�[�X�I
		var $t = this.$targets.eq(this._now);
		var $htm = this._dat;
		// jQuery.log('#'+$t.attr(this.attr_id),$htm)
		var $parts = jQuery('#'+$t.attr(this.attr_id),$htm);

		/**
		 * mayaa��doRender�̉��ߊԈႦ�Ă���replace�Œ��g�����`�悩
		 */
		// if(t.attr(this.attr_replace) = 'true'){
		// 	// $t.attr('id','');//id�����Ȃ��悤�ɁB
		// 	// $t.after($parts);
		// 	// $t.remove();
		// 	$t.replaceWith($parts);
		// }else{
		// 	$t.html($parts.children());//.get(0)
		// }

		switch($t.attr(this.attr_replace)){
			case 'true':
			case 'children':
				//���g�̂ݕ`��
				$t.after($parts.children());
				$t.remove();
				break;
			case 'false':
			case 'replace':
			default :
				//�����ւ�
				$t.replaceWith($parts);
				break;
			case 'append':
				//���b�p�ȊO�����ւ�
				$t.html($parts.children());
				break;
		}

		//����
		this._now++;
		this.loadstart(this._now);
	}
	//���X�g
	,finish:function(){
		jQuery.log('LoadParts :: finised!','�u�������p�[�c�F length('+this.$targets.length+')', this._urls);
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

// �X�}�z���Ή��y�[�W�΍�
// �uuseragent.js�v�y�сucatalog-sp.js�v�Ŏg�p�����ϐ��uviewflag�v����`����Ă��Ȃ���΁A
// �X�}�z���Ή��y�[�W�Ƃ��āu#change_view_btm�v�������B
if (typeof(viewflag) == 'undefined'){
	document.write('<style type="text/css">#change_view_btm{ display:none }</style>');
}


//���i�ꗗLayzuload�Ή�
/*jQuery(window).load(function(){
  jQuery(".lazyload").lazyload({
    effect : "fadeIn"
  });
});*/
