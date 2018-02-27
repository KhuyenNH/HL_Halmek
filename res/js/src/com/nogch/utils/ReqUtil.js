/**
 * ajaxなどのリクエスト用UTILITY
 */
;
var ReqUtil = Class.extend({});

//StringUtilにあるけど一応。
if(typeof RegExp.escape != "function"){
	RegExp.escape = function(str){
		var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
		return str.replace(specials, "\\$&");
	};
};

//static variables.
// ReqUtil.hashprefix = "#!/";
ReqUtil.HASH_PREF = "#!/";

// static methods

/**
 * @param {String} paramstr : key1=val1&key2=val2
 * @return Object
 */
ReqUtil.params2object = function(paramstr){
	//var o = '{' + paramstr.replace(/\&/g, '\',').replace(/\=/g, ':\'') + '\'}';
	var o = '{\'' + paramstr.replace(/\&/g, '\',\'' ).replace(/\=/g, '\':\'') + '\'}';
	eval('var obj = '+o);
	return obj;
}

/**
 * ユニークURLをつくる
 * @param  {String} url [description]
 * @return {String}     [description]
 */
ReqUtil.makeUniqueUrl = function(url){
	var uq=new Date().getTime();
	if(url.indexOf('?')==-1){
		return url+'?uniq'+uq+'=1';
	}else{
		return url+'&uniq'+uq+'=1';
	}
};


/**
 * urlからパラメータをobjectで取得。
 * @param {String} urlstr
 * @return Object
 */
ReqUtil.getRestParams = function(urlstr){
	if(typeof urlstr != "string") return {};
	return urlstr.indexOf('?')!= -1 ? ReqUtil.params2object(urlstr.substr(urlstr.indexOf('?')+1)) : {};
};

/**
 * （リンクしとる）urlをハッシュ値に変換して新しいURLを取得。何度通してもOK。デフォでは同じドメインのみ変換
 * @param {String} url
 * @param {Boolean} domainLock 
 */
ReqUtil.url2hashlnk = function(url, domainLock){
	if (typeof domainLock == "undefined") domainLock = true;
	// #.*(リンクアンカー)と / ,現在のURLと同じ場合は置換しない。
	if (url == ReqUtil.URL_HOME || /^#.*$/.test(url) || url == "/") return url;
	if (domainLock) {
		if (url.match(/^javascript:|^ftp:\/\//)) return url;
		if (url.match(/^http:\/\//) && url.match(ReqUtil.REGEXP_URL_HOME)) return url;
	}
	var hashpos = url.indexOf(ReqUtil.HASH_PREF);
	url = (hashpos == -1 ? url : decodeURIComponent(url.substr(hashpos + ReqUtil.HASH_PREF.length)));
	return ReqUtil.HASH_PREF + encodeURIComponent(url);
};

ReqUtil.hashlnk2url = function(hashlnk){
	var hashpos = hashlnk.indexOf(ReqUtil.HASH_PREF)
	,url = (hashpos == -1 ? hashlnk : decodeURIComponent(hashlnk.substr(hashpos + ReqUtil.HASH_PREF.length)));
	return url;
};

ReqUtil.gethash = function(url){
	var hashpos = url.indexOf(ReqUtil.HASH_PREF)
	,hash = (hashpos == -1 ? '' : decodeURIComponent(url.substr(hashpos)));
	return hash;
};

ReqUtil.removehash = function(hashlnk){
	var hashpos = hashlnk.indexOf(ReqUtil.HASH_PREF)
	,url = (hashpos == -1 ? hashlnk : decodeURIComponent(hashlnk.substr(0, hashpos)));
	return url;
};


ReqUtil.URL_HOME = ReqUtil.removehash(location.href); //'http://'+SITE_DOMAIN+'/'
ReqUtil.REGEXP_URL_HOME = new RegExp('/^' + RegExp.escape(ReqUtil.URL_HOME) + '/');
ReqUtil.IS_LOCALHOST = ReqUtil.URL_HOME.indexOf('://localhost') != -1 || ReqUtil.URL_HOME.indexOf('://192.168.') != -1;
/**
 * アンカー文字列を取得。
 * @param  {String} url "../hoge/index.html#ABC"
 * @param {String} no_pref "#"を抜く？通常はつける。
 * @return {String}     "#ABC"
 */
ReqUtil.getAnchor = function(url,no_pref){
	var anchorPos = url.indexOf("#")
	,str = (anchorPos == -1 ? '' : decodeURIComponent(url.substr(anchorPos+(no_pref ? 1:0))));
	return str;
};

/**
 * #ではじまるhashやRestParamを除去
 * @param  {String} urlstr [description]
 * @return {String}        [description]
 */
ReqUtil.removeParams = function(urlstr){
	var i = urlstr.lastIndexOf('?');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	i = urlstr.lastIndexOf('#');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	return urlstr;
};

ReqUtil.removeJavaParams = function(urlstr){
	var i = urlstr.lastIndexOf(';');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	return urlstr;
};

/**
 * #ではじまるhashやRestParam、javaでつけた;hoge=fugaを除去
 * @param  {String} urlstr [description]
 * @return {String}        [description]
 */
ReqUtil.removeParamsAll = function(urlstr){
	var i = urlstr.lastIndexOf('?');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	i = urlstr.lastIndexOf('#');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	i = urlstr.lastIndexOf(';');
	urlstr = i!= -1 ? urlstr.substr(0,i) : urlstr;
	return urlstr;
};


/**
 * urlstringのファイル名除去。拡張子を検出する場合、第２引数にtrueをぶち込む。
 * @param  {[type]} urlstr [description]
 * @param {Boolean} ext_detection 拡張子を検出する？
 * @return {[type]}        [description]
 */
ReqUtil.removeFileName = function(urlstr,ext_detection){
	if(ext_detection){
		return urlstr.replace(/\/[^\.|\/]+\..+$/,'').replace(/\/$/,'');
	}else{
		return urlstr.substr(0,urlstr.lastIndexOf('/'));
	}
};

/**
 * 相対パスから絶対パスを取得する
 * @param p パス。相対でも絶対でも。
 */
ReqUtil.getFullPath = function(p){
  var e = document.createElement('span');
  e.innerHTML = '<a href="' + p + '"></a>';
  var r = e.firstChild.href;
  e = null;//消す
  return r;
};

/**
 * ファイル名を抜いたフルパスを得る。
 * @param {String} path 指定がない場合はlocation.href。
 * @return {[type]} /localhost/hoge など。
 */
ReqUtil.getLocationPath = function(path){
	var p = ReqUtil.removeParams(path ? path : location.href);
	p = p.replace(/^htt(p|ps):\/\/[^/]*/,'');
	p = ReqUtil.removeFileName(p,true);
	return p;
};

/**
 * "./"とか"../"とかで始まるstrを現在の場所からのフルパスにする。
 * ★IE7以下はDOMにサブパス入力しててもレンダリング時にフルパスになるから注意が必要。
 * @param  {[type]} subpath "../path/file.html"とか。フルパスやurl(http://.*)の場合はなにもしない。
 * @param {String} base_path 基準となるパス。ない場合はlocation.hrefの(file名を抜いた)パスが使われる。
 * @return {[type]}         /localhost/hoge/path/file.html
 */
ReqUtil.sp2fp = function(subpath,base_path){
	//既にフルパスの時は何もしない。
	if(/^\//.test(subpath) || /^(htt(p|ps)|ft(p|ps)):/.test(subpath)){
		return subpath;
	}
	var loc = ReqUtil.getLocationPath(base_path);
	var revFn = function(p,np){
		if(/^\.\//.test(p)){
			//"./"で始まる場合
			return arguments.callee(p.substr(2),np);
		}else if(/^\.\.\//.test(p)){
			//"../"で始まる場合
			var npa = np.split('/');
			npa.pop();
			// jQuery.log(npa.join('/'))
			return arguments.callee(p.substr(3),npa.join('/'));
		}
		return np+'/'+p;
	};
	return revFn(subpath,loc);
};


/**
 * jQuery.ajax()とかで帰ってきたhtml5なstringをjqueryObjectにパース。
 * 結構処理重だろうから乱打しない。
 * @param  {String} html5 [description]
 * @return {Object}     jquery object.
 */
ReqUtil.html5str2jqo = function(html5str){
	var body = html5str.match(/<body[\s\S]*<\/body>/i);
	body = body ? body[0] : false;
	if(!body){
		throw 'htmlのパースに失敗しました';
		// return new Object();
	}
	var jqo = jQuery('<div class="html5str2jqo-body-replacement">'+jQuery.trim(body.replace(/\n|\r|\t/g,''))+'</div>');
	//配列だった時の処理(scriptタグやiframeが入ってたりしてるときとか？)
	var r = jqo.length > 1 ? jqo.eq(0) : jqo;
	return r;//jQuery(jQuery.trim(body.replace(/\n|\r|\t/g,''))).eq(0);
};
/**
 * htmlなstringからタイトルのみ取得。
 * @param  {[type]} htm [description]
 * @return {[type]}     [description]
 */
ReqUtil.getHtmlTitle = function(htm){
	var title = htm.match(/<title.*\/title>/i);
	title = title ? title[0] : false;
	return title ? jQuery(title).text() :"";
};

/**
 * htmlに読み込んでいるjs自身のパスを取得。
 * @param  {String} filename ファイル名(のみ)
 * @param {Boolean} remJavaParams ;jssessionid= とかのjavaパラメータがついてきている場合true
 * @return {Object}          {path,fn,params}
 */
ReqUtil.getJSPaths = function(filename,remJavaParams){
	var path,fn,params;
	var scripts = document.getElementsByTagName("script");
	var i = scripts.length;
	var matchPtn = remJavaParams ? 
		new RegExp('(^|.*\/)('+RegExp.escape(filename)+')([\?]{0,1}[^;]*)([;]{0,1}[^\?]*)([\?]{0,1}.*)$') :
		new RegExp('(^|.*\/)('+RegExp.escape(filename)+')([\?]{0,1}.*)$');
	while (i--) {
		var match = scripts[i].src.match(matchPtn);
		if (match) {
			path = match[1];
			fn = match[2];
			params = match[3] || match[5];
			break;
		}
	}
	var paramsObj = params ? ReqUtil.getRestParams(params) : {};
	return {
		'path':path
		,'fn':fn
		,'params':paramsObj
	};
}
