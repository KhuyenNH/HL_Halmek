/// <reference path="jquery.js"/>

var AJAX_TARGET_PATH = "../search/lookupgoodslistforajax.aspx";
var AJAX_TARGET_PATH_GOODS_DETAIL = "../search/lookupgoodsdetailforajax.aspx";
var AJAX_TARGET_PATH_ADD_FORM = "../quickorder/addgoodslistformajax.aspx";
var LENGTH_FOR_AJAXTRAN1 = 5; //
var LENGTH_FOR_AJAXTRAN2 = 7; // 
var THREAD_LOOP_TIMER = 300; // 入力検知スレッドのwait（ミリ秒）

var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_ENTER = 13;

var executeInputScanThread = false;
var timerCheckInput;
var prevGoodsValue;
var prevQtyValue;
var selectedSuggestID;
var suggestAmount;
var ajaxResult;
var doingAjax = false;
var suggestMaxWidth = 0;
var jQObjGoodsInputBox;
var jQObjQtyInputBox;
var jQObjSuggestArea;
var forceSuggestSelected = false;
var isMSIE = /*@cc_on!@*/false;

var isNoSelectColor = -1;
var isNoSelectSize = -1;

jQuery(function() {
    jQObjSuggestArea = jQuery('#suggestArea');

    jQuery('.delButton')
        .click(function() { ItemRowLine(jQuery(this)).ClearAll();});

    jQuery('input[name=variation]')
        .focus(StartCodeInputScanThread)
        .blur(function () {
            inputcheckvariationCD(this);
            StopCodeInputScanThread();
            jQObjGoodsInputBox = ItemRowLine(jQuery(this)).GetGoodsObj();
            executeInputScanThread = true;
            InputScanLogic();
        });
    
    jQuery('input[name=variation]')
        .keyup(function () {
            inputcheckvariationCD(this);
            StopCodeInputScanThread();
            jQObjGoodsInputBox = ItemRowLine(jQuery(this)).GetGoodsObj();
            executeInputScanThread = true;
            InputScanLogic();
        });

    jQuery('input[name=MediaCd]')
        .keyup(function () {
            inputcheckMediaCD(this);
        });

}); 


function StartCodeInputScanThread() {
    prevGoodsValue = ItemRowLine(jQuery(this)).GetGoodsObj().val();
}

function StopCodeInputScanThread() {
        prevGoodsValue = undefined;
}


function InputScanLogic() {

    if (jQObjGoodsInputBox.val().match(/['<>]/)) {
        jQObjGoodsInputBox.val(jQObjGoodsInputBox.val().replace(/['<>]/g,''));
        alert('入力値に当サイトでは使用できない文字が含まれています。');
     }

    if (jQObjGoodsInputBox.val().length == LENGTH_FOR_AJAXTRAN1 || jQObjGoodsInputBox.val().length == LENGTH_FOR_AJAXTRAN2) {
        if (InputValueHasChanged()) {
            if (!doingAjax) {
                KeepInputValue();
                GetDataAndRefreshScreen();
            }
        }
    } else {

    }
}

function getBrowserVersion() { // @return Number:
    return window.opera ? (opera.version().replace(/\d$/, "") - 0) // Opera10 shock
                      : parseFloat((/(?:IE |fox\/|ome\/|ion\/)(\d+\.\d)/.
                                   exec(navigator.userAgent) || [, 0])[1]);
}


function GetDataAndRefreshScreen() {
    doingAjax = true;
    suggestMaxWidth = 0;
    
    
    jQuery.ajax({
        type: 'GET',
        cache: false,
        url: AJAX_TARGET_PATH,
        dataType: 'json',
        data: { Variation: jQObjGoodsInputBox.val(), line: jQObjGoodsInputBox.parent().parent().attr("name") },
        complete: function() { doingAjax = false; },
        error: function() {
            alert('セッションの有効期間がきれました。\n誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。');
        },
        success: function(data) {
            ajaxResult = data;

            if (ajaxResult.HasTargetItem == '1') {

                
                switch (mode) {
                    case "fb":
                        ItemRowLine(jQObjGoodsInputBox)
                            .Qty(ajaxResult.TargetItem.QtyList)
                            .Name('<a href="' + EC_WWW_ROOT + '/shop/g/g' + ajaxResult.TargetItem.GoodsCode + '/">' + ajaxResult.TargetItem.Name + '</a><span class="price_">' + ajaxResult.TargetItem.Price + '</span>')
                            .Price(ajaxResult.TargetItem.Price)
                            .Color(ajaxResult.TargetItem.VariationList1)
                            .Size(ajaxResult.TargetItem.VariationList2)
                            .Comment(ajaxResult.TargetItem.Comment)
                            .HideError()
                            .ShowImg()
                            .Img(GetImgHTMLCode(ajaxResult.TargetItem.ImagePath,ajaxResult.TargetItem.GoodsCode,ajaxResult.TargetItem.GoodsDecision));
                        
                        break;
                    case "sb":
                        jQObjGoodsInputBox.parents('li:first')
                            .find(':hidden').show().end()
                            .find('figure img').attr('src', ajaxResult.TargetItem.ImagePath).end()
                            .find('.price_').html(ajaxResult.TargetItem.Price).end()
                            .find('.name1_').html(ajaxResult.TargetItem.Name).end()
                            .find('.stock_ > dd').html(ajaxResult.TargetItem.Comment).end()
                            .find('.amt_ > dd').html(ajaxResult.TargetItem.Amount).end();
                        
                        jQObjQtyInputBox.prop("readonly",false);
                        jQObjQtyInputBox.css("background-color","#FFFFFF");
                        break;
                }

                if (ajaxResult.SuggestList.length == 1) { jQObjSuggestArea.hide(); }

            } else {
                
                
                ItemRowLine(jQObjGoodsInputBox).ClearLoadData();
                ItemRowLine(jQObjGoodsInputBox).HideImg();
                ItemRowLine(jQObjGoodsInputBox).ShowError();
            }

            if (forceSuggestSelected) {
                forceSuggestSelected = false;
                jQObjSuggestArea.hide();
            }
            
            jQuery('table[name$=quickorderlist_]').on('change', '[name$=sizelist]', (function () { ItemRowLine(jQuery(this)).ChangeGoodsVal(); }));
            jQuery('table[name$=quickorderlist_]').on('change', '[name$=colorlist]', (function () { ItemRowLine(jQuery(this)).ChangeGoodsVal(); }));
            

        }
    });
}

function ItemRowLine(obj) {
    this.jQueryObj = obj;
    this.GetGoodsObj = function () { return this.jQueryObj.parent().parent().find("input[name=variation]"); }
    this.Variation = function(val) { this.jQueryObj.parent().parent().find("input[name=variation]").val(val); return this; }
    this.Qty = function (val) { this.jQueryObj.parent().parent().find("td[class$=qty2_]").html(val); return this; }
    this.Name = function (val) { this.jQueryObj.parent().parent().parent().find("tr[name$=" + this.jQueryObj.parent().parent().attr("name") + "]").find("td[class$=name_]").html(val); return this; }
    this.Price = function (val) { this.jQueryObj.parent().parent().parent().find("tr[name$=" + this.jQueryObj.parent().parent().attr("name") + "]").find("td[class$=price_]").html(val); return this; }
    this.Amount = function(val) { this.jQueryObj.parent().parent().find("td[class$=amt_]").html(val); return this; }
    this.Comment = function(val) { this.jQueryObj.parent().parent().find("td[class$=msg_]").html(val); return this; }
    this.Color = function(val) { this.jQueryObj.parent().parent().find("td[class$=color_]").html(val); return this; }
    this.Size = function (val) { this.jQueryObj.parent().parent().find("td[class$=size_]").html(val); return this; }
    this.ShowImg = function () { this.jQueryObj.parent().parent().parent().find("tr[class$=under" + this.jQueryObj.parent().parent().attr("name") + "]").show(); return this; }
    this.ShowError = function () { this.jQueryObj.parent().parent().parent().find("tr[class$=error" + this.jQueryObj.parent().parent().attr("name") + "]").show(); return this; }
    this.HideImg = function () { this.jQueryObj.parent().parent().parent().find("tr[class$=under" + this.jQueryObj.parent().parent().attr("name") + "]").hide(); return this; }
    this.HideError = function () { this.jQueryObj.parent().parent().parent().find("tr[class$=error" + this.jQueryObj.parent().parent().attr("name") + "]").hide(); return this; }
    this.Img = function (val) { this.jQueryObj.parent().parent().parent().find("tr[name$=" + this.jQueryObj.parent().parent().attr("name")+"]").find("td[class$=img_]").html(val); return this; }
    this.ClearAll = function() {
        switch (mode) {
            case "fb":
                this.Variation('').Name('').Price('').Amount('').Comment('').Img('');
                this.Color('<select name="colorlist" disabled="disabled"></select>');
                this.Size('<select name="sizelist" disabled="disabled"></select>');
                this.Qty('<select name="qty" disabled="disabled"></select>');
                this.HideImg();
                this.HideError();
                break;
            case "sb":
                this.jQueryObj.parents('li:first')
                    .find('.code_').val('').end()
                    .find('figure, .name_, .stock_, .amt_, .delButton').hide().end()
                    .find('input[name=qty]').val('').prop("readonly",true).css("background-color","#e6e6e6");
                break;
        }

        return this;
    }

    this.ClearLoadData = function() {

        switch (mode) {
            case "fb":
                this.Name('').Price('').Img('');
                break;
            case "sb":
                this.jQueryObj.parents('li:first')
                    .find('figure, .name_, .stock_, .amt_, .delButton').hide();
                break;
        }
        return this;
    }
    this.ChangeGoodsVal = function() {
        GetGoodsDetailScreen(this,this.jQueryObj.parent().parent().find("input[name=variation]").val(),this.jQueryObj.parent().parent().find("[name$=colorlist]").val(),this.jQueryObj.parent().parent().find("[name$=sizelist]").val());
        return this;
    }
    
    
    return this;
}




function InputValueHasChanged() {
    return (prevGoodsValue != jQObjGoodsInputBox.val()) ;
}

function KeepInputValue() {
    prevGoodsValue = jQObjGoodsInputBox.val();
}


function GetImgHTMLCode(src,goodscode,goodsDecision) {
    if(goodsDecision == null){
    	return '<a href="' + EC_WWW_ROOT + '/shop/g/g' + goodscode + '/"><img src="' + src + '" height="50" alt="商品画像"></a>';
    }
    else{
    	return '<a href="' + EC_WWW_ROOT + '/shop/g/g' + goodscode + '/"><img src="' + src + '" height="50" alt="商品画像"></a><input type="hidden" name="goods" value="' + goodscode + '">';
    }

}


function GetGoodsDetailScreen(this_,Variation,colorvalue,sizevalue) {
    
    doingAjax3 = true;
    suggestMaxWidth = 0;
    colorvalue = this.jQueryObj.parent().parent().find("[name$=colorlist]").val();
    sizevalue = this.jQueryObj.parent().parent().find("[name$=sizelist]").val();
    if (colorvalue == isNoSelectColor || sizevalue == isNoSelectColor) {

        //色またはサイズが未選択のため表示変更なし
        return true;
    } else {
        jQuery.ajax({
            type: 'GET',
            cache: false,
            url: AJAX_TARGET_PATH_GOODS_DETAIL,
            dataType: 'json',
            data: { Variation: this.jQueryObj.parent().parent().find("input[name=variation]").val(), line: jQObjGoodsInputBox.parent().parent().attr("name"),color:colorvalue, size:sizevalue  },
            complete: function () { doingAjax = false; },
            error: function () {
                alert('セッションの有効期間がきれました。\n誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。');
            },
            success: function (data) {
                ajaxResult = data;

                if (ajaxResult.HasTargetItem == '1') {


                    switch (mode) {
                        case "fb":
                                this_.Qty(ajaxResult.TargetItem.QtyList)
                                this_.Name('<a href="/shop/g/g' + ajaxResult.TargetItem.GoodsCode + '/">' + ajaxResult.TargetItem.Name + '</a><span class="price_">' + ajaxResult.TargetItem.Price + '</span>')
                                this_.Price(ajaxResult.TargetItem.Price)
                                this_.Img(GetImgHTMLCode(ajaxResult.TargetItem.ImagePath,ajaxResult.TargetItem.GoodsCode,ajaxResult.TargetItem.GoodsDecision));
                            break;
                        case "sb":
                                this_.find(':hidden').show().end()
                                this_.find('figure img').attr('src', ajaxResult.TargetItem.ImagePath).end()
                                this_.find('.price_').html(ajaxResult.TargetItem.Price).end()
                                this_.find('.name1_').html(ajaxResult.TargetItem.Name).end()
                                this_.find('.stock_ > dd').html(ajaxResult.TargetItem.Comment).end()
                                this_.find('.amt_ > dd').html(ajaxResult.TargetItem.Amount).end();

                            jQObjGoodsInputBox.prop("readonly", false);
                            jQObjGoodsInputBox.css("background-color", "#FFFFFF");
                            break;
                    }
                }
            }
        });

    } 
}


function AddGoodsListForm(obj) {

    doingAjax3 = true;
        jQuery.ajax({
            type: "GET",
            url: AJAX_TARGET_PATH_ADD_FORM,
            data: { "linecnt": jQuery(obj).attr("value") },
            cache: false,
            success: function (data) {
                jQuery('table[name$=quickorderlist_]').append(data);
                jQuery(obj).attr("value", parseInt(jQuery(obj).attr("value")) + 1);
                jQuery('table[name$=quickorderlist_]').on('keyup', '[name$=variation]',
                    (function () {
                        jQObjGoodsInputBox = ItemRowLine(jQuery(this)).GetGoodsObj();
                        executeInputScanThread = true;
                        InputScanLogic();
                    }));
                jQuery('table[name$=quickorderlist_]').on('change', '[name$=sizelist]', (function () { ItemRowLine(jQuery(this)).ChangeGoodsVal(); }));
                jQuery('table[name$=quickorderlist_]').on('change', '[name$=colorlist]', (function () { ItemRowLine(jQuery(this)).ChangeGoodsVal(); }));
 
            },
            error: function () {
                alert('セッションの有効期間がきれました。\n誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。');
            },
            complete: function () {
                doingAjax = false;
            }
        });


}

function lengthcheckMediaCD(obj) {
	var str = obj.value;
	if(str.length >= 4){
		obj.value = str.substring(0,3);
	}
}

function lengthcheckVariationCD(obj) {
	var str = obj.value;
	if(str.length >= 8){
		obj.value = str.substring(0,7);
	}
}

function remove_placefolder(count) {
	var result_count = 0;
	if (count - 1 >= 0){
		result_count = count - 1;
	}
	
	var id = '#catalogInputs_' + result_count +' input[type=text]';
	
	jQuery(id).addClass("placeholder");
}
