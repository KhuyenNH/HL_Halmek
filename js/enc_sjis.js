/// <reference path="jquery.js"/>
/// <reference path="encoding.min.js"/>

function getSjisQueryParameters(formName) {
	var valArray = jQuery('[name=' + formName + ']').serializeArray();
	var sjisArray = null;
	for (var i = 0; i < valArray.length; i++) {
		sjisArray = Encoding.convert(str2array(valArray[i].value), {
			to: 'SJIS',
			from: 'UNICODE',
			type: 'array'
		});
		valArray[i].value = Encoding.codeToString(sjisArray);
	}
	return getParams(valArray);
}

function str2array(str) {
	var array = [];
	for (var i = 0; i < str.length; i++) {
		array.push(str.charCodeAt(i));
	}
	return array;
}

function getParams(array) {
	var query = [];
	if (array.constructor == Array || array.jquery) {
		jQuery.each(array, function() {
			query.push(Encoding.urlEncode(this.name) + "=" + Encoding.urlEncode(this.value));
		});
	}
	return query.join('&').replace(/%20/g, '+');
}
