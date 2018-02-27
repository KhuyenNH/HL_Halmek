jQuery(document).ready(function () {

    var wait_class = 'ajax_wait_sub_button_';
    var wait_value = '���҂���������...';

    var $btn_bookmark = jQuery(".btn_bookmark_");
    var bookmark_width = $btn_bookmark.width();
    var noraml_class = $btn_bookmark.attr("class");
    var normal_value = $btn_bookmark.attr("value");
    var url = $btn_bookmark.attr("onclick");
    $btn_bookmark.attr({onclick: ""});
    $btn_bookmark.unbind("click");
    $btn_bookmark.bind("click", function (e) {
        var loadStart = function (elem) {
            jQuery(elem).attr({
                class: noraml_class + ' ' + wait_class,
                value: wait_value
            });
            return elem;
        }

        var loadEnd = function (elem, iserror, msg) {
            if (!iserror) {
                jQuery(elem).showBalloon({
                    contents: msg,
                    classname: "balloons",
                    hideAnimation: function(d) { this.slideUp(d); },
                    offsetX: 0,
                    css: {
                        fontWeight: "bold",
                        backgroundColor: "#000000",
                        color: "#fff",
                        opacity: "0.7",
                        width: bookmark_width + "px"
                    }
                });
                setTimeout(function() {
                    jQuery(elem).hideBalloon();
                    jQuery(elem).attr({
                        class: noraml_class,
                        value: normal_value
                    });
                }, 2000); //�o���[���\������
            }
            else {
                jQuery(elem).attr({
                    class: noraml_class,
                    value: normal_value
                });
            }
        }

        var addBookmark = function (b, g) {
            var o = loadStart(b);
            jQuery.ajax({
                async: true,
                type: "POST",
                url: EC_WWW_ROOT + "/shop/customer/bookmarkajax.aspx",
                data: { "goods": goods, "crsirefo_hidden": add_crsirefo },
                cache: false,
                ifModified: false,
                dataType: "json",
                success: function (msg) {
                    setTimeout(function () {
                        loadEnd(o, false, msg);
                    }, 400);
                },
                error: function (xhr, status, thrown) {
                    loadEnd(o, true);
                    alert("�Z�b�V�����̗L�����Ԃ�����܂����B\n" +
                          "���ɋ������܂����ēx�g�b�v�y�[�W���̃A�N�Z�X�����肢�������܂��B\n\n" +
                          "�����T�C�g�ł͂��q�l�̏��ی�̂��߁A��莞�Ԍo�ߌ�ɐڑ��������������Ă��������Ă���܂��B");
                    return false;
                }
            });
            return true;
        }

        if (jQuery(this).attr("class").indexOf(wait_class) != -1) {
            return false;
        }

        var re = new RegExp("goods=([0-9A-Za-z_\-]+)");
        var matches = url.match(re);
        var goods = "";
        if (matches && matches.length == 2) {
            goods = matches[1];
        }
        else {
            return true;
        }

        addBookmark(this, goods);
        return false;
    });
});
