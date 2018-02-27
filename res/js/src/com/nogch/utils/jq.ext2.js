/**
 * jquery ARUTOBENRI extentions!
 * @version 0.2.2
 * @author nogch
 */

/**
 * console shortcuts
 */
jQuery.log = function(){if(typeof console != 'undefined'){console.log.apply(console,arguments);}};
jQuery.err = function(){if(typeof console != 'undefined'){console.error.apply(console,arguments);}};

/**
 * object clone
 */
jQuery.cloneObject = function(source,isDeep) {
	if(isDeep){
		return jQuery.extend(true,{},source);
	}
	return jQuery.extend({},source);
};

/**
 * preventDefault(CrossBrowser)
 */
jQuery.preventDefault =  function(e){if(e){if(e.preventDefault){e.preventDefault()} else {e.returnValue = false}}};

/**
 * cancel event bubbles(CrossBrowser)
 */
jQuery.cancelBubble = function(e){
	if(e.stopPropagation){e.stopPropagation();
	}else if(window.event){window.event.cancelBubble = true;}
};

/**
 * extention jquery.outerHtml()
 * @param  {String or null} s ラッピングするhtmlか空
 * @return {Object or String}   引数が空だった時は中身(String)が返る
 */
jQuery.fn.outerHtml = function(s){
return (s) ? this.before(s).remove() : jQuery("<i>").append(this.eq(0).clone()).html();};
