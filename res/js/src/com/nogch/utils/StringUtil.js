;/**
 * 正規表現文字列エスケープ
 */
if(typeof RegExp.escape != "function"){
	RegExp.escape = function(str){
		var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
		return str.replace(specials, "\\$&");
	}
};


// if(typeof StringUtil != "undefined")return;
var StringUtil = {};

/**
 * 相対パスから絶対パスを取得する
 * @param p パス。相対でも絶対でも。 > recHelperに。
 */
// StringUtil.getFullPath = function(p){
//   var e = document.createElement('span');
//   e.innerHTML = '<a href="' + p + '" />';
//   var r = e.firstChild.href;
//   e = null;
//   return r;
// };

/**
 * 文字列かね？
 */
StringUtil.isString = function (obj){return ( typeof obj == "string" || obj instanceof String );};

StringUtil.isEmpty = function(str){return str.length === 0;};
StringUtil.isBlank = function(str){return str.trim().length === 0;};
StringUtil.eq = function(str1,str2){return str1 === str2;};

/**
 * 最後の1行除去
 */
StringUtil.deleteLastLine = function(str){
	if(str.length==0 || str.indexOf('\n')==-1) return str;
	var i = str/*.substr(0,str.length-1)*/.lastIndexOf('\n');
	return str.substr(0,i);
};
/**
 * 最後からn行除去
 */
StringUtil.deleteLastLines = function(str,n){
	while(n>0){
		str = StringUtil.deleteLastLine(str);
		n--;
	}
	return str;
};

/**
 * 桁補完 fillZeros
 * @param  {String|Number} str      [description]
 * @param  {Number} len         [description]
 * @param  {String} flag         default:"0"
 * @return {String}                 [description]
 */
StringUtil.fillZeros = function(str, len, flag){
	str+='';
	if(typeof flag == 'undefined') flag = "0";
	while (str.length < len) str = flag + str;
	return str;
};

StringUtil.numberFormat = function(num,len,replace){
	num+='';
	if(typeof len == 'undefined')len = 3;
	if(typeof replace == 'undefined')replace = ',';
	return num.replace(new RegExp('([0-9]+?)(?=(?:[0-9]{'+len+'})+$)','g'), '$1'+replace);
};