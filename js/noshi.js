/// <reference path="jquery.js" />
	var textboxes = new Array();
	textboxes[0] = "comp";
	textboxes[1] = "post";
	textboxes[2] = "name1_1";
	textboxes[3] = "name1_2";
	textboxes[4] = "name2_1";
	textboxes[5] = "name2_2";
	textboxes[6] = "name3_1";
	textboxes[7] = "name3_2";
	
	var inputnames = new Array();
	inputnames[0] = "use";
	inputnames[1] = "noshi_purpose";
	inputnames[2] = "noshi_paper";
	inputnames[3] = "noshi_nameprint";
	inputnames[4] = "noshi_covertype";
	inputnames[5] = "noshi_wrap";
	inputnames[6] = "noshi_bag";
	inputnames[7] = "noshi_gonext";
	
	var haveCommentArea = new Array();
	haveCommentArea[0] = "noshi_paper";
	haveCommentArea[1] = "noshi_nameprint";
	haveCommentArea[2] = "noshi_covertype";
	haveCommentArea[3] = "noshi_wrap";
	haveCommentArea[4] = "noshi_bag";
	
	var noshiUseNow = "";
	var purposeNow = "";
	
	if (!Array.indexOf) {
		Array.prototype.indexOf = function(o) {
			for (var i in this) {
				if (this[i] == o) {
					return i;
				}
			}
			return -1;
		}
	}
	
jQuery(document).ready(function(){
	if(jQuery("#divnoshiuse").length == 1){
		jQuery("#divnoshiuse").show();
	}else if(jQuery("#divwrap").length == 1){
		jQuery("#divwrap").show();
	}else if(jQuery("#divbag").length == 1){
		jQuery("#divbag").show();
	}else{}
	
	if ( jQuery("input[name=use]:checked").length > 0 ){
		noshiUseNow = jQuery("input[name=use]:checked").attr("id");
	}
	
	jQuery("input[name='use']").bind("change",function(){
		var boolAction = false;
		if(noshiUseNow.length == 0 ){
			boolAction = true;
		}
		
		if(boolAction == false){
			if(window.confirm("現在設定中の情報が初期化されます。よろしいですか？")){
				jQuery('.thum_info_').hide();
				purposeNow = "";
				boolAction = true;
			}
		}
		
		if(boolAction){
			resetNoshiUse(this);
			noshiUseNow = jQuery("input[name=use]:checked").attr("id");
		}else{
			if(noshiUseNow == ""){
				jQUery("[name=use]").prop("checked", false);
			}else{
				jQuery("#" + noshiUseNow).prop("checked", true);
			}
		}
		
	});
	
	if ( jQuery("input[name=noshi_purpose]:checked").length > 0 ){
		purposeNow = jQuery("input[name=noshi_purpose]:checked").attr("id");
	}

	jQuery("input[name='noshi_purpose']").bind("change",function(){
		var boolAction = false;
		if(purposeNow.length == 0){
			boolAction = true;
		}
		
		if(boolAction == false){
			if(window.confirm("設定中の用途以下の情報が初期化されます。よろしいですか？")){
				jQuery('.thum_info_').hide();
				boolAction = true;
			}
		}
		
		if(boolAction){
			changePaper(false);
			purposeNow = jQuery("input[name=noshi_purpose]:checked").attr("id");
		}else{
			if(purposeNow == ""){
				jQuery("[name=noshi_purpose]").prop("checked", false);
			}else{
				jQuery("#" + purposeNow).prop("checked", true);
			}
		}
	});
	
	jQuery('.thum_info_').hide();
	changePaper(true);
	
	jQuery("input[name='noshi_nameprint']").bind("click",changeNameprintInput);
	changeNameprintInput();
	
	for(i = 0;i <= 7;i++){
		if( jQuery("input[name='" + inputnames[i] + "']:visible").length > 0 ){
			judgNextActiveArea(jQuery("input[name='" + inputnames[i] + "']"),true);
		}
	}
	
	dispComment();
	
});

function resetNoshiUse(obj){
	
	jQuery("#noshisettingfrm input:radio:not([name=use])").prop("checked", false);
	
	jQuery(".divpurpose").hide();
	jQuery(".divpaper").hide();
	jQuery(".divnameprint").hide();
	jQuery(".divcovertype").hide();
	jQuery(".divwrap").hide();
	jQuery(".divbag").hide();
	jQuery(".divgonext").hide();
	
	judgNextActiveArea(obj,true);
	
	return true;
}

function judgNextActiveArea(obj,preload){
	if ( jQuery("[name=" + jQuery(obj).attr("name") + "]:checked").length == 0 ){
		return true;
	}
	
	var nowActiveAreaNo = inputnames.indexOf(jQuery(obj).attr("name"));
	if (nowActiveAreaNo == -1){
		return true;
	}
	
	if((nowActiveAreaNo == 0) && (jQuery("[name=" + jQuery(obj).attr("name") + "]:checked").val() == 1)){
		nowActiveAreaNo = 4;
	}
	
	var nextAreaName = "";
	do{
		nowActiveAreaNo ++;
		
		nextAreaName = inputnames[nowActiveAreaNo];
		nextAreaName = nextAreaName.replace("noshi_","div");
		
		if(jQuery("." + nextAreaName).length != 0){
			break;
		}
	}while(nowActiveAreaNo != 8);
	
	jQuery("." + nextAreaName).show();
	
	if(preload == false){
		if(jQuery(obj).attr("name") == 'noshi_paper' && jQuery("#paper_input:visible").length != 0){
			jQuery("html,body").animate({scrollTop:jQuery("#paper_input").offset().top},"fast");
		}else if(jQuery(obj).attr("name") == 'noshi_nameprint' && jQuery("#nameprint_input:visible").length != 0){
			jQuery("html,body").animate({scrollTop:jQuery("#nameprint_input").offset().top},"fast");
		}else{
			jQuery("html,body").animate({scrollTop:jQuery("." + nextAreaName).offset().top},"fast");
		}
	
	}
	
	return true;
}

function changeNameprintInput(){
	var name = jQuery("input[name='noshi_nameprint']:checked").val();
	if(name==undefined){
		return;
	}
	
	if(name==''){
		jQuery("#nameprint_input").hide();
		return;
	}

	var values = jQuery("#nameprintinput_" + name).val().split(",");
	if(values == undefined){
		return
	}else{
		jQuery("#nameprint_input").show();
	}
	
	for (i = 0; i < 8; i++){
		if (i in values){
			if(values[i] == 0){
				jQuery("input[name='" + textboxes[i] + "']").attr("disabled","disabled");
				if (jQuery("input[name='" + textboxes[i] + "']").hasClass("disabled_") == false){
					jQuery("input[name='" + textboxes[i] + "']").addClass("disabled_");
				}
			}else{
				jQuery("input[name='" + textboxes[i] + "']").removeAttr("disabled");
				if (jQuery("input[name='" + textboxes[i] + "']").hasClass("disabled_") == true){
					jQuery("input[name='" + textboxes[i] + "']").removeClass("disabled_");
				}
			}
		}
	}

}

function changePaper(preload){
	var purpose = jQuery("input[name='noshi_purpose']:checked").val();
	if (purpose == undefined) {
		return;
	}
	
	var selectedpaper = "";
	if(preload){
		selectedpaper = jQuery("#selectedpaper").val();
	}
	
	jQuery.ajax({
		type: 'GET',
		cache: false,
		url: "./lookupnoshipaperajax.aspx" ,
		dataType: 'html',
		data: { 'noshi_purpose': purpose, 'selectedpaper': selectedpaper },
		complete: function() { doingAjax = false; },
		error: function() {
			alert('表書き・水引情報の取得に失敗しました。');
		},
		success: function(data) {
			jQuery("#noshi_paper").html(data);
			if(data == ""){
				jQuery("#divpaper").hide();
			}else{
				jQuery("#divpaper").show();
			}
			
			if (jQuery("[name=noshi_paper]:checked").length == 0){
				jQuery("#noshisettingfrm input:radio:not([name=use]):not([name=noshi_purpose])").prop("checked", false);
				jQuery(".divnameprint").hide();
				jQuery(".divcovertype").hide();
				jQuery(".divwrap").hide();
				jQuery(".divbag").hide();
				jQuery(".divgonext").hide();
			}
			
			changePaperInput();
			jQuery("#divpaper").find('.thum_box_wrapper_').find('.thum_info_').html('');
			jQuery("#divpaper").find('.thum_box_wrapper_').find('.thum_info_').hide();
			outputCommentBind('divpaper');
			
			for(i = 2;i <= 7;i++){
				if( jQuery("input[name='" + inputnames[i] + "']:visible").length > 0 ){
					judgNextActiveArea(jQuery("input[name='" + inputnames[i] + "']"),preload);
				}
			}
			
			dispComment();
			
		}
	});
}

function changePaperInput(){
	var paper = jQuery("input[name='noshi_paper']:checked").val();
	if (paper == undefined){
		return;
	}
	
	if (jQuery("#paperinput_" + paper).val() == 0 ){
		jQuery("#paper_input").hide();
	}
	else{
		jQuery("#paper_input").show();
	}
	
}

/* 説明文の表示 */
function outputCommentBind(name){
	jQuery("." + name).find('.thum_box_wrapper_').each(function(){
		var obj = jQuery("." + name).find('.thum_box_wrapper_');
		jQuery(this).find('label').each(function(){
			jQuery(this).click(function(){
				var txt = jQuery(this).find('.thum_info_text_').text();
				obj.find('.thum_info_').html(txt);
				if (txt != "") {
					obj.find('.thum_info_').show();
				} else {
					obj.find('.thum_info_').hide();
				}
				judgNextActiveArea(jQuery(this).find("input"),false);
			});
		});
	});
}

outputCommentBind('divnameprint');
outputCommentBind('divcovertype');
outputCommentBind('divwrap');
outputCommentBind('divbag');

function dispComment(){
	for(i = 0;i <= 4;i++){
		var divname = haveCommentArea[i].replace("noshi_","div");
		if (jQuery("." + divname + ":visible").length > 0 ){
			if (jQuery("[name=" + haveCommentArea[i] + "]:checked").length > 0){
				var obj = jQuery("." + divname).find('.thum_box_wrapper_');
				obj.find('.thum_info_').html(jQuery("[name=" + haveCommentArea[i] + "]:checked").parent().find('.thum_info_text_').text());
				
			}
		}
	}
}
