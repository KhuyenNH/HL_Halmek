jQuery(document).ready(function () {

    var wait_class = 'ajax_wait_button_';
    var wait_value = 'お待ちください...';
    var s_width = 60;
    var l_width = 200;

    if (document.URL.match("cart.aspx")) {
        return false;
    }

    var $btn_cart = jQuery(".goods_ .btn_cart_");
    var noraml_class = $btn_cart.attr("class");
    var normal_value = $btn_cart.attr("value");
    jQuery(".goods_").off("click", ".btn_cart_");
    jQuery(".goods_").on("click", ".btn_cart_", function (e) {
        var loadStart = function (elem) {
            jQuery(elem).attr({
                class: noraml_class + ' ' + wait_class,
                value: wait_value
            });
            return elem;
        }

        var loadEnd = function (elem, iserror) {
            if (!iserror) {
                jQuery(elem).showBalloon({
                    contents: '買い物かごに入れました',
                    classname: "balloons",
                    hideAnimation: function(d) { this.slideUp(d); },
                    offsetX: 0,
                    css: {
                        maxWidth: "280px",
                        fontWeight: "bold",
                        backgroundColor: "#ffffcc",
                        color: "#000000",
                        opacity: "1",
                        border: "solid 2px #ffa500"
                    }
                });
                setTimeout(function() {
                    jQuery(elem).hideBalloon();
                    jQuery(elem).attr({
                        class: noraml_class,
                        value: normal_value
                    });
                }, 2000); //バルーン表示時間
            }
            else {
                jQuery(elem).attr({
                    class: noraml_class,
                    value: normal_value
                });
            }
        }

        var addCart = function (b, g) {
            var o = loadStart(b);
            jQuery.ajax({
                async: true,
                type: "POST",
                url: EC_WWW_ROOT + "/shop/js/addcart.aspx",
                data: { "goods": goods, "crsirefo_hidden": crsirefo_jscart },
                cache: false,
                ifModified: false,
                dataType: "json",
                success: function (msg) {
                    if ("loadABtest" in window) {
                        saveBlockClickLog("jscart");
                    }
                    if (typeof(ga) == "function") {
                        ga('send','pageview',{'page': EC_WWW_ROOT + '/shop/cart/addcart.aspx?goods=' + goods,'title':'AddCart'});
                    }
                    if (msg && msg.length > 0) {
                        alert(msg.join("\r\n").replace(/<\/?[^>]+>/gi, ""));
                        loadEnd(o, true);
                        return false;
                    }

                    if (jQuery("#jscart_replace_").length > 0) {
                        jQuery("#jscart_replace_").load(EC_WWW_ROOT + "/shop/js/cart.aspx", function () {
                            setTimeout(function () {
                                loadEnd(o, false);
                            }, 400);
                        });
                    }
                    else {
                        setTimeout(function () {
                            loadEnd(o, false);
                        }, 400);
                    }
                },
                error: function (xhr, status, thrown) {
                    loadEnd(o, true);
                    alert("セッションの有効期間がきれました。\n" +
                          "誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n" +
                          "※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。");
                    return false;
                }
            });
            return true;
        }

        if (jQuery(this).attr("class").indexOf(wait_class) != -1) {
            return false;
        }

        var href = jQuery(this).parent().attr("href");
        var re = new RegExp("goods=([0-9A-Za-z_\-]+)");
        var matches = href.match(re);
        var goods = "";
        if (matches && matches.length == 2) {
            goods = matches[1];
        }
        else {
            return true;
        }
        if (jQuery("#agree_" + goods).length > 0) {
            var btn = this;
            jQuery("#dialog").dialog("destroy");
            jQuery("#agree_" + goods).dialog({
                resizable: false,
                height: 'auto',
                modal: false,
                position: {
                    of: btn,
                    at: 'center',
                    my: 'center'
                },
                buttons: {
                    '　同意する　': function () {
                        jQuery(this).dialog('close');
                        addCart(btn, goods);
                        return false;
                    },
                    '同意しない': function () {
                        jQuery(this).dialog('close');
                        return false;
                    }
                }
            });
        }
        else {
            addCart(this, goods);
            return false;
        }
        return false;
    });
});
