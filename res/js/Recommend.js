;
/**
 * API設定
 */
if(typeof Conf != 'object')var Conf = {};
Conf.recommend = {
	server:'r.snva.jp'
	,key:'7EPsWEKnhka5i'
};

Recommend = Class.extend({
	// mode:4
	tmplId:null //apiのテンプレid(tmpl)
	,onLoad:null
	,onComplete:null
	,isReady:false
	,RESTparams:{
		k:Conf.recommend.key
		,tmpl:1
		,output_type:2
		,lang_type:'jsonp'
		,format_type:2
		,charset:'Shift_JIS'
		// ,callback:''//'+this.instanceName+'.jsonpCallback'+paramstr
	}
	,init:function(tmplId){//,mode){
		// this.instanceName = instanceName;
		this.RESTparams.tmpl = this.tmplId = tmplId;
		// this.RESTparams.callback = this.instanceName+'.jsonpCallback';
	}

	/**
	 * 関連商品読み込み
	 * @param  {[type]} itemCd [description]
	 * @return {[type]}        [description]
	 */
	// ,load : function(itemCode){
	,load : function(ext_params){
		var params = jQuery.cloneObject(this.RESTparams);
		for(var k in ext_params){
			params[k] = ext_params[k];
		}
		jQuery.ajax({
			//// 本番用 ////
			url:'//'+Conf.recommend.server+'/api/recommend/rule/'
			,data:params
			,type:'get'
			,dataType:'jsonp'
			,jsonp:"callback"//this.RESTparams.callback
			

			,error:jQuery.proxy(this.error_,this)
			,success:jQuery.proxy(this.success_,this)
			,complete:jQuery.proxy(this.compleete_,this)
			,timeout:10000
		});
		// successでも毎回エラーが出る。。 > window.onerrorでハンドリングするか、jquery-jsonpを使うか > complete,success,error関数が必要だったorz
	}


	/**
	 * 関連商品パースと初期化はView.itemDetailにて設定
	 * @param  {[type]} dat [description]
	 * @return {[type]}   [description]
	 */
	,parse : function(dat){}

	,jsonpCallback : function(d){
		jQuery.log('RecommendCallback.['+this.tmplId+']',d);
		if(typeof this.onLoad == 'function')this.onLoad(d);
		this.parse(d);
		if(typeof this.onComplete == 'function')this.onComplete(d);
		this.dat = d;
		this.isReady = true;
	}

	,success_:function(d,type){
		jQuery.log('Recommend::success_ :',d,type);
		this.jsonpCallback(d);
	}
	,complete_:function(xhr,stat){
		jQuery.log('Recommend::complete_ :',xhr,stat);
	}
	,error_:function(xhr,stat,errThrown){
		jQuery.err('Recommend::error_ :',xhr,stat,errThrown);
		//エラーのときもやるよ
		this.jsonpCallback(false);
	}

});

Recommend.parseItem = function(item,tmplId){
	var str = item.url;
	if(!tmplId)tmplId = 1;
	//価格表記の違い
	var price,pprice,discount;
	// //[140214]消費税対応のため、価格表示を一旦除去 > [140401]元に戻す
	// price = '';
	if(item.area){
		//割引前の価格はitem.areaに入っている（一応型変換しとく
		pprice = parseInt(item.area,10);
		//?%OFF ..roundの方が良い?
		discount = Math.floor( 100 - (item.price/pprice) * 100 );
		price = '<p class="price">価格 <strike>'+StringUtil.numberFormat(pprice)+'円</strike> <strong>'+discount+'%OFF</strong> '+StringUtil.numberFormat(item.price)+'円(税込)</p>';
	}else{
		price = '<p class="price">価格 '+StringUtil.numberFormat(item.price)+'円(税込)</p>';
	}
	var index = str.indexOf("/ec/item/cd/")
	if (index !== -1){
	str = str.replace("/ec/item/cd/","/shop/g/g")
	item.url = str
	return '\
				<li>\
					<div class="item">\
						<div class="head"></div>\
						<p class="img"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><img src="'+item.img_url+'" alt=""></a></p>\
						<div class="detail">\
							<p class="iname"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;">'+item.name+'</a></p>\
							'+price+'\
						</div>\
						<p class="permalink"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><i class="icon ico-14 arrowR"></i>この商品を見る</a></p>\
					</div>\
				</li>';
	}else{
	return '\
				<li>\
					<div class="item">\
						<div class="head"></div>\
						<p class="img"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><img src="'+item.img_url+'" alt=""></a></p>\
						<div class="detail">\
							<p class="iname"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;">'+item.name+'</a></p>\
							'+price+'\
						</div>\
						<p class="permalink"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><i class="icon ico-14 arrowR"></i>この商品を見る</a></p>\
					</div>\
				</li>';
	}
};
