var PREF_ICON_ID = "isErrorIcon_";
var REQUIRED_SELECTOR =  ".efo.is_required ";
var REQUIRED_CLASS_NAME =  "classrequired";
var ERROR_CLASS_NAME = "classerror";
var DISABLE_BROWSER =  ["msie 6.","msie 7."]; //対象外ブラウザ設定
var isMailAsUid =  false;
var requestArray = [];
var isRunning = false;
var illegalChars = '\'<'; // 禁止する文字

function initEFO(is_mailasuid) {
	if (disableBrowser()) { return false; }
	isMailAsUid = is_mailasuid;
	
	addClass();
	bindInput();
}

function addClass() {
	addClassRequiredText();
	addClassRequiredNumber();
	addClassRequiredTel();
	addClassRequiredEmail();
	addClassRequiredPassword();
	addClassRequiredSelect();
	addClassRequiredRadio();
	addClassRequiredCheckbox();
}

function addClassRequiredText() {
	var obj = jQuery(REQUIRED_SELECTOR + ":text");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" | obj[i].value == obj[i].title) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredNumber() {
	var obj = jQuery(REQUIRED_SELECTOR + "[type=number]");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" | obj[i].value == obj[i].title) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredTel() {
	var obj = jQuery(REQUIRED_SELECTOR + "[type=tel]");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" | obj[i].value == obj[i].title) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredEmail() {
	var obj = jQuery(REQUIRED_SELECTOR + "[type=email]");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" | obj[i].value == obj[i].title) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredPassword() {
	var obj = jQuery(REQUIRED_SELECTOR + ":password");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" | obj[i].value == obj[i].title) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredSelect() {
	var obj = jQuery(REQUIRED_SELECTOR + "select");
	for (var i = 0; i < obj.length; i++) {
		if ( obj[i].value == "" ) {
			addClassRequired(obj[i]);
		}
	}
}

function addClassRequiredRadio() {
	var obj = jQuery(REQUIRED_SELECTOR + ":radio");
	var name = "";
	for (var i = 0; i < obj.length; i++) {
		name = jQuery(obj[i]).attr("name");
		if (jQuery("input[name='" + name + "']:checked").length <= 0) {
			addClassRequired(jQuery("input[name='" + name  + "']").next("label"));
		}
	}
}

function addClassRequiredCheckbox(obj) {
	var obj = jQuery(REQUIRED_SELECTOR + ":checkbox");
	var name = "";
	for (var i = 0; i < obj.length; i++) {
		name = jQuery(obj[i]).attr("name");
		if (jQuery("input[name='" + name + "']:checked").length <= 0) {
			addClassRequired(jQuery("input[name='" + name  + "']").next("label"));
		}
	}
}

function bindInput() {
	bindText();
	bindNumber();
	bindTel();
	bindEmail();
	bindPassword();
	bindSelect();
	bindRadio();
	bindCheckbox();
}

function bindText() {
	jQuery(".efo input:text").bind("keyup blur", function(event) {
		delayInputValidate(this, getCheckType(this), event);
		if (jQuery(this).val() == "") {
			removeClassError(this);
			changeClassRequired(this);
		}
	});
}

function bindNumber() {
	jQuery(".efo input[type=number]").bind("keyup blur", function(event) {
		delayInputValidate(this, getCheckType(this), event);
		if (jQuery(this).val() == "") {
			removeClassError(this);
			changeClassRequired(this);
		}
	});
}

function bindTel() {
	jQuery(".efo input[type=tel]").bind("keyup blur", function(event) {
		delayInputValidate(this, getCheckType(this), event);
		if (jQuery(this).val() == "") {
			removeClassError(this);
			changeClassRequired(this);
		}
	});
}

function bindEmail() {
	jQuery(".efo input[type=email]").bind("keyup blur", function(event) {
		delayInputValidate(this, getCheckType(this), event);
		if (jQuery(this).val() == "") {
			removeClassError(this);
			changeClassRequired(this);
		}
	});
}

function bindPassword() {
	jQuery(".efo input:password").bind("keyup blur", function(event) {
		delayInputValidate(this, getCheckType(this), event);
		if (jQuery(this).val() == "") {
			removeClassError(this);
			changeClassRequired(this);
		}
	});
}

function bindSelect() {
	jQuery(".efo select").change(function(event) {
		if (jQuery(this).attr("name").match(/^yy_|^mm_|^dd_/) != null) {
			bindSelectDate(this,event);
		}else if (jQuery(this).attr("name").match(/^favstore/) != null) {
			bindSelectFavStore(this,event);
		}else{
			bindSelectNormal(this);
		}
	});
}

function bindSelectDate(obj,event) {
	var tmp = obj.name.replace(/^yy_|^mm_|^dd_/,"");
	
	if (isSelectedDate(tmp)) {
		createOKIcon(jQuery("[name='" + obj.name + "']"));
		hideErrorMessage(tmp);
		removeClassErrorSelectDate(tmp);
		removeClassRequiredSelectDate(tmp);
		delayInputValidate(obj, getCheckType(obj), event);
	}else{
		removeIcon(obj);
		removeClassError(obj);
		changeClassRequired(obj);
	}
}

function bindSelectFavStore(obj,event) {
	var tmp = obj.name.substring(obj.name.length - 1);
	var objName = "favstore" + tmp
	
	if (obj.name.indexOf('favstorediv') == -1 && isSelectedFavStore(tmp)) {
		createOKIcon(jQuery("[name='" + objName + "']"));
		hideErrorMessage(objName);
	}else{
		removeIcon(jQuery("[name='" + objName + "']"));
	}

	removeClassError(jQuery("[name='" + objName + "']"));
	removeClassRequired(jQuery("[name='" + objName + "']"));
}

function bindSelectNormal(obj) {
	if (jQuery(obj).val() !="") {
		createOKIcon(jQuery("[name='" + obj.name + "']"));
		hideErrorMessage(obj.name);
		removeClassError(jQuery("[name='" + obj.name + "']"));
		removeClassRequired(jQuery("[name='" + obj.name + "']"));
	}else{
		removeIcon(obj);
		removeClassError(obj);
		changeClassRequired(obj);
	}
}

function bindRadio() {
	jQuery(REQUIRED_SELECTOR + ":radio").click(function() {
		var name = jQuery(this).attr("name");
		if (jQuery("input[name='" + name + "']:checked").length <= 0) {
			addClassRequired(jQuery("input[name='" + name + "']").next("label"));
		}else{
			removeClassRequired(jQuery("input[name='" + name + "']").next("label"));
			hideErrorMessage(name);
		}
	});
}

function bindCheckbox() {
	jQuery(REQUIRED_SELECTOR + ":checkbox").click(function() {
		var name = jQuery(this).attr("name");
		if (jQuery("input[name='" + name + "']:checked").length <= 0) {
			addClassRequired(jQuery("input[name='" + name + "']").next("label"));
		}else{
			removeClassRequired(jQuery("input[name='" + name + "']").next("label"));
			hideErrorMessage(name);
		}
	});
}

function delayInputValidate(obj, checktype, event){
	var eventtype = event.type;
	setTimeout(function(event) {
		inputValidate(obj, checktype, eventtype);
	},1000);
}

function inputValidate(obj, checktype, event) {
	if (event == undefined) { return false; }
	if ((jQuery(obj).attr("placeholder") != undefined) &&
		(jQuery(obj).val() == jQuery(obj).attr("placeholder"))) {
		return false;
	}
	if (jQuery(obj).val() == "") {
		removeIcon(obj);
		return false;
	}

	var inp_name = jQuery(obj).attr("name");

	if (inp_name.indexOf("CustAppendKey") != -1) {
		inp_name = getCustomerAppendColumnValue(inp_name);
	}
	
	var inp_values = [getObjValue(obj, checktype)];
	var inp_title = jQuery(obj).attr("placeholder");
	var isonblurcheck = (event == "blur");

	if (isonblurcheck && jQuery(obj).attr("onblur") != undefined) {
		inp_values[0] = jQuery(obj).trigger("onblur").val();
	}
	
	addInputValues(inp_name, inp_values);
	trimInpvalues(inp_values);
	
	requestArray[inp_name] = [obj, 
								inp_name, 
								inp_values, 
								inp_title, 
								isonblurcheck, 
								checktype];

	return doInputValidate(inp_name);
}

function doInputValidate(inp_name) {
	var tmprequestArray = []
	
	if (isRunning) { return false; }
	isRunning = true;
	
	if (requestArray[inp_name] == undefined) { 
		isRunning = false;
		return false; 
	}else{
		tmprequestArray[inp_name] = requestArray[inp_name];
	}
	
	// 使用できない文字が含まれているか
	var inputValue = tmprequestArray[inp_name][2].join();
	for (var i = 0; i < illegalChars.length; i++) {
		var ic = illegalChars.charAt(i);
		if ( inputValue.indexOf(ic) == -1 ) continue;
		
		// エラーメッセージ・エラーアイコンを表示
		var data = {
			hasError: true,
			message: '使用できない入力値があります。'
		}
		callBalloon(
			tmprequestArray[inp_name][0],
			data,
			tmprequestArray[inp_name][2],
			tmprequestArray[inp_name][3],
			tmprequestArray[inp_name][4]
		);
		
		if (requestArray[inp_name][2] == tmprequestArray[inp_name][2]) {
			delete requestArray[inp_name];
			isRunning = false;
		
			for (var key in requestArray) {
				doInputValidate(key);
				break;
			}
		
		} else {
			isRunning = false;
			doInputValidate(inp_name);
		}
		
		return false;
	}
	
	jQuery.ajax({
		type: "POST",
		url: "../check/inputcheck.aspx",
		data: {
			input_name: tmprequestArray[inp_name][1],
			input_value: tmprequestArray[inp_name][2],
			isonblurcheck: tmprequestArray[inp_name][4],
			check_type: tmprequestArray[inp_name][5]
		},
		dataType: "json",
		cache: false,
		traditional: true,
		success: function(data) {
			callBalloon(
				tmprequestArray[inp_name][0],
				data,
				tmprequestArray[inp_name][2],
				tmprequestArray[inp_name][3],
				tmprequestArray[inp_name][4]
			);
			
			if (requestArray[inp_name][2] == tmprequestArray[inp_name][2]) {
				delete requestArray[inp_name];
				isRunning = false;

				for (var key in requestArray) {
					doInputValidate(key);
					break;
				}
			}else{
				isRunning = false;
				doInputValidate(inp_name);
			}
		},
		error: function() {
			delete requestArray[inp_name];
			isRunning = false;
			return false;
		}
	});
	
	return true;
}

function callBalloon(obj, data, inp_values, inp_title, isonblurcheck) {
	if (data.message) {
		jQuery(obj).showBalloon({
			contents: data.message.replace(/\r?\n/g, "<br />") ,
			classname: "balloons" ,
			hideAnimation: function(d) { this.slideUp(d); },
			offsetX: 20,
			css: {
				maxWidth:"280px",
				fontWeight: "bold",
				backgroundColor: "#000000",
				color: "#fff",
				opacity: "0.7"
			}
		});
		
		setTimeout(function() {
			jQuery("[name='" + jQuery(obj).attr("name") + "']").hideBalloon();
		},4000); //バルーン表示時間
	}

	if (data.hasError) {
		addClassError(obj);
		createErrorIcon(obj);
	}else{
		removeClassError(obj);
		removeClassRequired(obj);
		
		if ((inp_values != "") && (inp_values != inp_title)) {
			createOKIcon(obj);
		}
		if (isonblurcheck) {
			hideErrorMessage(jQuery(obj).attr("name"));
		}
	}
}

function addInputValues(inp_name, inp_values) {
	switch(inp_name.replace(/^s_|^d_/,"")) {
		case "cmail":
			if (jQuery("input[name='mail']").val() != undefined) {
				inp_values.push(jQuery("input[name='mail']").val());
			}else{
				inp_values.push(jQuery("input[name='s_mail']").val());
			}
			break;
		case "pwd":
			if (isMailAsUid) {
				inp_values.push(jQuery("input[name='mail']").val());
			}else{
				inp_values.push(jQuery("input[name='uid']").val());
			}
			break;
		case "cpwd":
			inp_values.push(jQuery("input[name='pwd']").val());
			break;
		default:
			break;
	}
}

function getCheckType(obj) {
	var checktype_str = "checktype_";
	var targetElement = jQuery(obj).parents("span[class*='" + checktype_str + "']");
	var checktypeArray = new Array();
	
	if (targetElement == undefined) { return ''; }
	
	checktypeArray = targetElement.attr("class").split(" ")
	for (var i = 0; i < checktypeArray.length; i++) {
		if (checktypeArray[i].match("^" + checktype_str + "")) {
			return checktypeArray[i].replace(checktype_str,"");
		}
	}
	return '';
}

function getObjValue(obj, checktype) {
	if (checktype == "date") {
		var tmp = obj.name.replace(/^yy_|^mm_|^dd_/,"");
		return jQuery("[name='yy_" + tmp + "']").val() + jQuery("[name='mm_" + tmp + "']").val() + jQuery("[name='dd_" + tmp + "']").val();
	}else{
		return jQuery(obj).val()
	}
}

function disableBrowser() {
	var userAgent = window.navigator.userAgent.toLowerCase();
	var isDisableBrowser = false;

	for (var i = 0; i < DISABLE_BROWSER.length; i++) {
		if (userAgent.indexOf(DISABLE_BROWSER[i]) != -1) {
			isDisableBrowser = true;
		}
	}
	return isDisableBrowser;
}

function isSelectedDate(name) {
	if (jQuery("[name='yy_" + name + "']").val() == "") { return false;} 
	if (jQuery("[name='mm_" + name + "']").val() == "") { return false;} 
	if (jQuery("[name='dd_" + name + "']").val() == "") { return false;} 
	return true;
}

function isSelectedFavStore(name) {
	if (jQuery("[name='favstorediv" + name + "']").val() == "") { return false;} 
	if (jQuery("[name='favstore" + name + "']").val() == "") { return false;} 
	return true;
}

function removeClassErrorSelectDate(name) {
	removeClassError(jQuery("[name='yy_" + name + "']"));
	removeClassError(jQuery("[name='mm_" + name + "']"));
	removeClassError(jQuery("[name='dd_" + name + "']"));
}

function removeClassRequiredSelectDate(name) {
	removeClassRequired(jQuery("[name='yy_" + name + "']"));
	removeClassRequired(jQuery("[name='mm_" + name + "']"));
	removeClassRequired(jQuery("[name='dd_" + name + "']"));
}

function changeClassRequired(obj) {
	if (jQuery(obj).parent("span" + REQUIRED_SELECTOR).length > 0) {
		addClassRequired(obj);
	}else{
		removeClassRequired(obj);
	}
}

function trimInpvalues(inp_values) {
	for (var i = 0; i < inp_values.length; i++) {
		inp_values[i] = jQuery.trim(inp_values[i]);
	}
}

function getCustomerAppendColumnValue(inp_name) {
	var appendkeynumber = inp_name.replace("CustAppendKey","").replace(/^yy_|^mm_|^dd_/,"");
	return jQuery("[name='customerAppendColumn" + appendkeynumber + "']").val();
}

function addClassRequired(obj) {
	jQuery(obj).addClass(REQUIRED_CLASS_NAME);
}

function removeClassRequired(obj) {
	jQuery(obj).removeClass(REQUIRED_CLASS_NAME);
}

function addClassError(obj) {
	jQuery(obj).addClass(ERROR_CLASS_NAME);
}

function removeClassError(obj) {
	jQuery(obj).removeClass(ERROR_CLASS_NAME);
}

function createIcon(obj, src, altMsg) {
	removeIcon(obj);
	jQuery(obj).parent("span").after("<img id='" + PREF_ICON_ID + jQuery(obj).attr("name").replace(/^yy_|^mm_|^dd_/,"") + "' src='" + EC_WWW_ROOT + src + "' alt='" + altMsg + "' class='efo_icon_'>");
}

function removeIcon(obj) {
	jQuery("#"+ PREF_ICON_ID + jQuery(obj).attr("name").replace(/^yy_|^mm_|^dd_/,"")).remove();
}


function createOKIcon(obj) {
	createIcon(obj, "/img/sys/input_ok.gif", "入力内容に問題有りません。");
}

function createErrorIcon(obj) {
	createIcon(obj, "/img/sys/input_error.gif", "入力内容に誤りがあります。");
}

function hideErrorMessage(name) {
	jQuery("." + name + "_error_").hide();
}
