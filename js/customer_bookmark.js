/// <reference path="jquery.js" />
jQuery(document).ready(function() {

    jQuery(".comment_ > a").each(function(i) {
        var bookmark;
        bookmark = jQuery(this).attr("id").split("_")[1];

        jQuery("#comment_val_" + bookmark).bind("focus", function() {
            jQuery(this).css("background-color", "#ffffc0");
            jQuery("#btnupdate_" + bookmark).get(0).disabled = false;
            countCommentLength(bookmark, this);
        });
        jQuery("#comment_val_" + bookmark).bind("blur", function() {
            jQuery(this).css("background-color", "white");
            jQuery("#btnupdate_" + bookmark).get(0).disabled = false;
            countCommentLength(bookmark, this);
        });
        jQuery("#comment_val_" + bookmark).bind("keyup", function() {
            countCommentLength(bookmark, this);
        });


        jQuery("#btncancel_" + bookmark).bind("click", function() {
            var labelcomment;
            var comment_hidden = "#comment_hidden_" + bookmark;
            labelcomment = jQuery(comment_hidden).val();

            jQuery("#comment_val_" + bookmark).val(labelcomment);
            jQuery("#comment_val_" + bookmark).css("display", "none");
            jQuery("#comment_label_" + bookmark).css("display", "block");
            jQuery("#btnupdate_" + bookmark).css("display", "none");
            jQuery("#btncancel_" + bookmark).css("display", "none");
            jQuery("#comment_" + bookmark).click();

            countCommentLength(bookmark, comment_hidden);
            jQuery("#comment_count_msg_" + bookmark).hide();
            jQuery("#err_comment_" + bookmark).hide();
        });

    });



    jQuery('.comment_ > a').on('click', function(event) {
        
        // デフォルトのリンク押下の処理を無効化
        (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
        
        // 表示・非表示を切り替える
        var link = jQuery(this);
        var visible = link.data('link-visible');
        if (visible) {
            hide();
        } else {
            show();
        }
        
        // メモ入力欄を表示
        function show() {
            var bookmark;
            bookmark = link.attr("id").split("_")[1];
            jQuery("#comment_val_" + bookmark).css("display", "block");
            jQuery("#comment_label_" + bookmark).css("display", "none");
            jQuery("#btnupdate_" + bookmark).css("display", "inline");
            jQuery("#btncancel_" + bookmark).css("display", "inline");

            if (jQuery("#comment_val_" + bookmark).text() != "") {
                jQuery("#btnupdate_" + bookmark).get(0).disabled = false;
            }
            else {
                jQuery("#btnupdate_" + bookmark).get(0).disabled = true;
            }

            var comment_val = "#comment_val_" + bookmark
            countCommentLength(bookmark, comment_val);
            jQuery("#comment_count_msg_" + bookmark).show();
            link.data('link-visible', true);
        }

        // メモ入力欄を非表示
        function hide() {
            var bookmark;
            bookmark = link.attr("id").split("_")[1];
            jQuery("#comment_val_" + bookmark).css("display", "none");
            jQuery("#comment_label_" + bookmark).css("display", "block");
            jQuery("#btnupdate_" + bookmark).css("display", "none");
            jQuery("#btncancel_" + bookmark).css("display", "none");
            jQuery("#comment_count_msg_" + bookmark).hide();
            link.data('link-visible', false);
        }
    });
    
});


function updatedeletebookmark(id, bookmark, del_bookmark) {
    var change_status = "";
    if (jQuery("#" + id).show()) {
        change_status = "0";
    }
    else {
        change_status = "D";
    }

    jQuery.ajax({
        url: "updatedeletebookmark.aspx",
        data: {
            bookmark: bookmark,
            del_bookmark: del_bookmark,
            status: change_status,
            crsirefo_hidden: jQuery("[name='crsirefo_hidden']").val()
        },
        dataType: "text",
        cache: false,
        success: function() {
        	location.reload(true)
        }
    });
}

function updatecommentbookmark(bookmark, comment_bookmark, title_updt, this_) {
    if (checkComment(bookmark) == false) {
        jQuery("#err_comment_" + bookmark).show();
        return false;
    }

    jQuery("#comment_" + bookmark).click();

    var input_comment;
    var comment;

    input_comment = jQuery("#comment_val_" + bookmark).val();
    comment = input_comment.replace(/\n|\r/g, "");

    jQuery.ajax({
        type: "POST",
        url: "updatedeletebookmark.aspx",
        data: {
            bookmark: bookmark,
            comment_bookmark: comment_bookmark,
            comment: comment,
            crsirefo_hidden: jQuery("[name='crsirefo_hidden']").val()
        },
        dataType: "text",
        cache: false,
        success: function(data) {

            var return_dt = data;

            if (!return_dt.match(/^20[0-9][0-9]\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])\s([0-9]|[0-1][0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/)) {
                alert("メモが更新できません。使用できない文字が含まれているか、セッションあるいは、ログインの有効期限が切れている可能性があります。");
            }
            else {
                jQuery("#updt_" + bookmark).text(title_updt + ": " + return_dt);

                jQuery("#comment_val_" + bookmark).val(comment);
                jQuery("#comment_val_" + bookmark).hide();

                jQuery("#comment_hidden_" + bookmark).val(comment);

                jQuery("#comment_label_" + bookmark).text(comment);
                jQuery("#comment_label_" + bookmark).show();

                jQuery(this_).hide();
                jQuery("#btncancel_" + bookmark).hide();
                jQuery("#comment_count_msg_" + bookmark).hide();
                jQuery("#err_comment_" + bookmark).hide();
            }
        }
    });
}

function countCommentLength(bookmark, obj) {
    var max = 200;
    var len = max - jQuery(obj).val().length;

    if (len >= 0) {
        jQuery("#comment_count_msg_" + bookmark).css("color", "#6666FF");
        jQuery("#comment_count_msg_" + bookmark).text("残り" + String(len) + "文字記述できます。");
        jQuery("#err_comment_" + bookmark).hide();
    }
    else {
        jQuery("#comment_count_msg_" + bookmark).css("color", "#FF6666");
        jQuery("#comment_count_msg_" + bookmark).text(String(max) + "文字以内で記述してください");
    }
}

function checkComment(bookmark) {
    //if( jQuery("#comment_val_" + bookmark).text().replace(/(\r\n){1}/g, "\n").replace(/(\n){1}/g, "@").length > 200){
    if (jQuery("#comment_val_" + bookmark).val().length > 200) {
        jQuery("#err_comment_" + bookmark).html("<br>メモが長すぎます。");
        return false;
    }
    else {
        return true;
    }
}
