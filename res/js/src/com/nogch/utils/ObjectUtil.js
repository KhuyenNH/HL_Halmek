// if(typeof ObjectUtil != "undefined")return;
var ObjectUtil = {}
/**
 * 複製
 */
ObjectUtil.clone = function(source,isDeep) {
	if(isDeep){return jQuery.extend(true,{},source);}
	return jQuery.extend({},source);
}