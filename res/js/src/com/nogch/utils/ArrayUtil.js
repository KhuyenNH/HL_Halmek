/**
 * versions history:
 * [0.1.1]
 * forinループとかででObjectとして拾ったりしちゃうのでprototypeなArrayクラスの拡張はやめました。
 * [0.1.0]
 * 必要最低限。
 */
;
// if(typeof ArrayUtil =="undefined")return;
var ArrayUtil = {};
ArrayUtil.clone = function(a){ return Array.apply(null,a);};
ArrayUtil.indexOf = function(a,o){
	for(var i in a){
		if(a[i] == o) return i;
	}
	return -1;
};
ArrayUtil.swapMatrixs = function(a){
	var i,j,swaps = [];
	for(i = 0; i < a[0].length; i++) {
		swaps[i] = [];
		for(j=0; j < a.length; j++) {
			swaps[i][j] = a[j][i];
		}
	}
	return swaps;
};