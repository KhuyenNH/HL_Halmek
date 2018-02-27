/// <reference path="jquery.js"/>

function getRequest() {
    jQuery('#confirm_').html('').css('color', '').removeClass('error_');
    loadingMessage();

    jQuery.ajax({
        type: "POST",
        url: PostURL,
        data: jQuery('#reviewFrm').serialize(),
        error: function() {
            jQuery('#userreview_frame').show();
            jQuery('#userreview_frame_loading').addClass('error_').html('通信中に問題が発生しました。再度確認ボタンを押してください。');
        },
        complete: loadingComplete,
        success: loadingSuccess
    });
}

function reEdit() {
    jQuery('#userreview_frame').show();
    jQuery('#confirm_').hide();
    jQuery('html,body').scrollTop(0);
}

function loadingSuccess(data, dataType) {
    if (data.toUpperCase().indexOf('<DUMMY></DUMMY>') == -1) {
        return false;
    }else{
        jQuery('#confirm_').html(data);
    }    
}

function loadingComplete() {
    if (jQuery('#confirm_').html().toUpperCase().indexOf('<DUMMY></DUMMY>') == -1) {
        jQuery('#userreview_frame').show();
        jQuery('#confirm_')
            .html('<>')
            .addClass('error_')
            .html('送信を受け付けられませんでした。HTMLタグなどが利用されていないかご確認ください。')
            .show();
        jQuery('#userreview_frame_loading').hide();

        return false;
    } else {
        jQuery('#userreview_frame_loading, #userreview_frame').hide();
        jQuery('#confirm_').show();
        jQuery('html,body').scrollTop(0);
    }
}

function loadingMessage() {
    jQuery('#userreview_frame_loading').html('<img src="' + ImgPath + '/usr/user_review/ajax-loader.gif">');
    jQuery('#userreview_frame').hide();
}

function previewForm() {
    removeErrorMessage();
    if (submitForm() == false) {
        return false;
    }
    else {
        getRequest();
    }
}

function removeErrorMessage() {
    jQuery('#err_reviewer_name, #err_reviewer_name_exists, #err_score, #err_title, #err_comment').html('');
}

function submitForm() {
    var isError = false;

    if (!jQuery('#score_form').val().match(/[12345]/)) {
        jQuery('#err_score').html('<br>評価に誤りがあります。');
        isError = true;
    }

    if (jQuery('#title_form').val().length == 0) {
        jQuery('#err_title').html('<br>レビューの要約が未入力です。');
        isError = true;
    }

    if (jQuery('#title_form').val().length > 50) {
        jQuery('#err_title').html('<br>レビューの要約が長すぎます。');
        isError = true;
    }

    if (jQuery('#comment_form').val().length == 0) {
        jQuery('#err_comment').html('<br>レビュー内容が未入力です。');
        isError = true;
    }
    
    if (jQuery('#comment_form').val().replace(/(\r\n){1}/g, "\n").replace(/(\n){1}/g, "@").length > 800) {
        jQuery('#err_comment').html('<br>レビュー内容が長すぎます。');
        isError = true;
    }

    if (jQuery('#reviewer_name_form').val().length == 0) {
        jQuery('#err_reviewer_name').html('<br>ニックネームが未入力です。');
        isError = true;
    }
    if (jQuery('#reviewer_name_form').val().length > 20) {
        jQuery('#err_reviewer_name_exists').html('<br>ニックネームが長すぎます。');
        isError = true;
    }

    if (isError == true) {
        return false;
    }
    else {
        removeErrorMessage();
        return true;
    }
}

function countTitleLength() {
    var len = 50 - jQuery('#title_form').val().length;
    if (len >= 0) {
        jQuery('#title_count_msg')
            .css('color', '#6666FF')
            .html('残り' + String(len) + '文字記述できます。');
    }
    else {
        jQuery('#title_count_msg')
            .css('color', '#FF6666')
            .html('50文字以内で記述してください');
    }
}

function countCommentLength() {
    var len = 800 - jQuery('#comment_form').val().replace(/(\r\n){1}/g, "\n").replace(/(\n){1}/g, "@").length;

    if (len >= 0) {
        jQuery('#comment_count_msg')
            .css('color', '#6666FF')
            .html('残り' + String(len) + '文字記述できます。');
    }
    else {
        jQuery('#comment_count_msg')
            .css('color', '#FF6666')
            .html('800文字以内で記述してください');
    }
}

function countReviewerNameLength() {
    var len = 20 - jQuery('#reviewer_name_form').val().length;
    if (len >= 0) {
        jQuery('#reviewer_name_count_msg')
            .css('color', '#6666FF')
            .html('残り' + String(len) + '文字記述できます。');
    }
    else {
        jQuery('#reviewer_name_count_msg')
            .css('color', '#FF6666')
            .html('20文字以内で記述してください');
    }
}

countReviewerNameLength();
countTitleLength();
countCommentLength();