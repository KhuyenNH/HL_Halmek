var page = function () {
	var value = jQuery("#js_page").val();
	if(!value.match(/^[0-9]+$/)) {
		return 1;
	}
	return parseInt(value, 10) > 0 ? parseInt(value, 10) : 1;
}();
var minpage = 1;
var maxpage = Math.ceil(eval(jQuery('#js_maxpage').val()));
var review_count = jQuery('#js_review_count').val();

function moderateRequest(titleid, msglayid, layid, user_review, moderate_value) {
    var $form = jQuery("#moderate_form");
    $form.find("input[name='titleid']").val(titleid);
    $form.find("input[name='msglayid']").val(msglayid);
    $form.find("input[name='layid']").val(layid);
    $form.find("input[name='user_review']").val(user_review);
    $form.find("input[name='moderate_value']").val(moderate_value);
    $form.find("input[name='upage']").val(page);
    $form.submit();
}


function initPageChanger() {
    jQuery('#review_read_button').hide();
    var i = 1;
    var pageChanger = '';
    for (i = 1; i <= maxpage; i++) {
        if (page != i) {
            pageChanger += '<span class="pager_ref_"><a href="#" onclick="getRequest(' + i + ');return false;">' + i + '<\/a><\/span> ';
        }
        else {
            pageChanger += '<span class="pager_now_">' + i + '<\/span> ';
        }
    }
    jQuery('#' + 'page_changer_top').html(pageChanger);
}

function getRequest(reqPage) {
    page = reqPage;
    var url = jQuery('#js_shop_root').val() + '/userreview/ajax.aspx';
    var pars = 'goods=' + jQuery('#js_goods').val() + '&page=' + reqPage;

    loadingMessage();
    jQuery.ajax({
        type: "GET",
        cache: false,
        url: url,
        data: pars,
        success: function(data, dataType) { jQuery('#userreview_frame').html(data); }
    });

    initPageChanger();
}

function loadingMessage() {
    jQuery('#' + 'userreview_frame').html('<img src="' + jQuery('#js_path_img').val() + '/usr/user_review/ajax-loader.gif">');
}