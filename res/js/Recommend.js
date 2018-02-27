;
/**
 * API�ݒ�
 */
if(typeof Conf != 'object')var Conf = {};
Conf.recommend = {
	server:'r.snva.jp'
	,key:'7EPsWEKnhka5i'
};

Recommend = Class.extend({
	// mode:4
	tmplId:null //api�̃e���v��id(tmpl)
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
	 * �֘A���i�ǂݍ���
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
			//// �{�ԗp ////
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
		// success�ł�����G���[���o��B�B > window.onerror�Ńn���h�����O���邩�Ajquery-jsonp���g���� > complete,success,error�֐����K�v������orz
	}


	/**
	 * �֘A���i�p�[�X�Ə�������View.itemDetail�ɂĐݒ�
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
		//�G���[�̂Ƃ�������
		this.jsonpCallback(false);
	}

});

Recommend.parseItem = function(item,tmplId){
	var str = item.url;
	if(!tmplId)tmplId = 1;
	//���i�\�L�̈Ⴂ
	var price,pprice,discount;
	// //[140214]����őΉ��̂��߁A���i�\������U���� > [140401]���ɖ߂�
	// price = '';
	if(item.area){
		//�����O�̉��i��item.area�ɓ����Ă���i�ꉞ�^�ϊ����Ƃ�
		pprice = parseInt(item.area,10);
		//?%OFF ..round�̕����ǂ�?
		discount = Math.floor( 100 - (item.price/pprice) * 100 );
		price = '<p class="price">���i <strike>'+StringUtil.numberFormat(pprice)+'�~</strike> <strong>'+discount+'%OFF</strong> '+StringUtil.numberFormat(item.price)+'�~(�ō�)</p>';
	}else{
		price = '<p class="price">���i '+StringUtil.numberFormat(item.price)+'�~(�ō�)</p>';
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
						<p class="permalink"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><i class="icon ico-14 arrowR"></i>���̏��i������</a></p>\
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
						<p class="permalink"><a href="'+item.url+'" onclick="apiSetCtr(\''+item.item_code+'\',\''+tmplId+'\',this,\''+Conf.recommend.key+'\');return false;"><i class="icon ico-14 arrowR"></i>���̏��i������</a></p>\
					</div>\
				</li>';
	}
};
