/// <reference path="../jquery.js" />

var variation_register = {
    raw_json: null,
    color_array: null,
    size_array: null,
    cartEnable: false,
    nostockEnable: false,
    selected_color: null,
    selected_size: null,
    isUseColor: false, // variation_name2
    isUseSize: false    // variation_name1
};

var url = "";
var url_goods_set = "";

jQuery(document).ready(function() {

    if (jQuery("#is_cart_dummy").val()) {
        jQuery("div.cartbox_ > input[class=btn_cart_l_]").hide();
    }

    if (!jQuery("#is_backorder").val()) {
        jQuery("div.cartbox_ > a[id=backorderlink_]").hide();
    }

    if (jQuery("#variation_design_type").val() != "0") {
        return false;
    }

    if (!jQuery("#hidden_variation_group").val() | jQuery("#hidden_variation_group").val() == "") {
        return false;
    }

    init();

    if ("https:" == document.location.protocol) {
        url = EC_WWW_ROOT + "/shop/goods/goodsapissl.aspx";
        url_goods_set = EC_WWW_ROOT + "/shop/goods/goodssetapissl.aspx";
    }
    else {
        url = EC_WWW_ROOT + "/shop/goods/goodsapi.aspx";
        url_goods_set = EC_WWW_ROOT + "/shop/goods/goodssetapi.aspx";
    }

    jQuery.ajax({
        url: url,
        data: { "variation_group": jQuery("#hidden_variation_group").val(), "type": "json" },
        dataType: "json",
        type: "post",
        cache: false,
        success: function(data, status) {
            searchIsUseVariation(data);
            variation_register.raw_json = data;
            if (variation_register.isUseSize) {
                variation_register.size_array = getSizeSelectors(data, null);
                createSizeSelectorHtml(variation_register.size_array);
            }
            if (variation_register.isUseColor) {
                variation_register.color_array = getColorSelectors(data, null);
                createColorSelectorHtml(variation_register.color_array);
            }
        }
    }
    );
});

function replaceGoodsSet(goods) {

    jQuery.ajax({
        url: url_goods_set,
        data: { "goods": goods },
        type: "GET",
        cache: false,
        success: function(data, status) {
            jQuery(".goods_set_area_").replaceWith(data);
        }
    }
    );
}

function init() {
    jQuery("div.cartbox_ > span.variationlist_").remove();
    cartButtonJudge();
}

function switchCartButton(isDisp) {
    var cartbutton = jQuery("div.cartbox_ > input[class=btn_cart_l_]");
    var backorderButton = jQuery("div.cartbox_ > a[id=backorderlink_]");
    var nostockbutton = jQuery("div.cartbox_ > input[id=nostock]");
    var nostockmessage = jQuery("p[id=nostock_msg]");

    backorderButton.hide();
    nostockmessage.hide();

    if (!isDisp) {
        cartbutton.hide();
        if (variation_register.nostockEnable) {
            nostockbutton.show();
        }
        else {
            nostockbutton.hide();
        }
    }

    if (!variation_register.raw_json) { return; }

    var color = "";
    var size = "";
    if (variation_register.isUseColor) {
        color = variation_register.selected_color;
    }
    if (variation_register.isUseSize) {
        size = variation_register.selected_size;
    }

    jQuery.each(variation_register.raw_json, function(i, item) {
        if (item.variation_name1 == size && item.variation_name2 == color) {

            var hiddenGoods = jQuery("<input type='hidden' name='goods' value='" + item.goods + "'>");
            jQuery("div.cartbox_ input[type=hidden]").remove();
            jQuery("div.cartbox_").append(hiddenGoods);

            rewriteGoodsSpec(item.goods);

            if (isDisp) {
                cartbutton.show();
                nostockbutton.hide();
                return;
            }
            else {
                if (item.backorder_fg == '1') {
                    var url = backorderButton.attr('href');
                    backorderButton.attr('href', url.replace(/goods=.*&/, 'goods=' + item.goods + '&'));
                    backorderButton.show();
                }
            }
        }
    });
}

function canDispCartButton() {
    var b = false;
    if (variation_register.isUseColor && variation_register.isUseSize) {
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (item.variation_name1 == variation_register.selected_size &&
                item.variation_name2 == variation_register.selected_color) {
                b = item.sold;
                return false;
            }
        });
    }
    if (variation_register.isUseColor && !variation_register.isUseSize) {
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (item.variation_name2 == variation_register.selected_color) {
                b = item.sold;
                return false;
            }
        });
    }
    if (!variation_register.isUseColor && variation_register.isUseSize) {
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (item.variation_name1 == variation_register.selected_size) {
                b = item.sold;
                return false;
            }
        });
    }
    return b;
}

function createSizeSelectorHtml(size_array) {
    var sizes = jQuery("<div></div>");
    sizes.addClass("sizes_");
    jQuery.each(size_array, function(key, value) {
        var size = jQuery("<div>" + ecUtil.htmlspecialchars(value.variation_name1) + "</div>");
        size.addClass("size_");

        if (variation_register.selected_size) {
            if (value.variation_name1 == variation_register.selected_size) {
                size.remove("size_Selected_");
                size.addClass("size_Selected_");
            }
        }

        if (value.sold) {
            size.addClass("size_EnableStock_");
            size.bind("click", function(event) {
                jQuery("form div.cartbox_ .sizes_ .size_Selected_")
                .addClass("size_EnableStock_")
                .removeClass("size_Selected_");
                size.removeClass("size_EnableStock_");
                size.addClass("size_Selected_");

                jQuery("form div.cartbox_ .sizes_ .size_DisableSelected_")
                .removeClass("size_DisableSelected_")
                .addClass("size_DisableStock_");

                variation_register.selected_size = value.variation_name1;

                if (variation_register.isUseColor) {
                    replaceColorSelectorHtml(value.variation_name1);
                }
                cartButtonJudge();
            });
        }
        else {
            size.addClass("size_DisableStock_");
            size.bind("click", function(event) {
                jQuery("form div.cartbox_ .sizes_ .size_DisableSelected_")
                .addClass("size_DisableStock_")
                .removeClass("size_DisableSelected_");
                size.removeClass("size_DisableStock_");
                size.addClass("size_DisableSelected_");

                jQuery("form div.cartbox_ .sizes_ .size_Selected_")
                .removeClass("size_Selected_")
                .addClass("size_EnableStock_");

                variation_register.selected_size = value.variation_name1;

                if (variation_register.isUseColor) {
                    replaceColorSelectorHtml(value.variation_name1);
                }
                cartButtonJudge();
            });
        }

        size.bind("mouseover", function(event) {
            maskThumbnail(value.sold);
        });

        size.bind("mouseleave", function(event) {
            if (variation_register.selected_size) {
                jQuery.each(size_array, function(key, arrayitem) {
                    if (arrayitem.variation_name1 == variation_register.selected_size) {
                        maskThumbnail(arrayitem.sold);
                        return false;
                    }
                });
            }
            else {
                maskThumbnail(value.sold);
            }
        });
        sizes.append(size);
    });


    if (jQuery("form div.cartbox_ div.sizes_").length > 0) {
        jQuery("form div.cartbox_ div.sizes_").replaceWith(sizes);
    }
    else {
        jQuery("form div.cartbox_").prepend(sizes);
    }
}

function createColorSelectorHtml(color_array) {
    var colors = jQuery("<div></div>");
    colors.addClass("colors_");
    jQuery.each(color_array, function(key, value) {
        var color = jQuery("<div title='" + ecUtil.htmlspecialchars(value.variation_name2) + "'></div>");
        color.addClass("color_");

        if (variation_register.selected_color) {
            if (value.variation_name2 == variation_register.selected_color) {
                color.remove("color_Selected_");
                color.addClass("color_Selected_");
            }
        }

        if (value.sold) {
            color.addClass("color_EnableStock_");
            color.bind("click", function(event) {
                jQuery("form div.cartbox_ .colors_ .color_Selected_")
                .addClass("color_EnableStock_")
                .removeClass("color_Selected_");
                color.removeClass("color_EnableStock_");
                color.addClass("color_Selected_");

                jQuery("form div.cartbox_ .colors_ .color_DisableSelected_")
                .removeClass("color_DisableSelected_")
                .addClass("color_DisableStock_");

                variation_register.selected_color = value.variation_name2;

                if (variation_register.isUseSize) {
                    replaceSizeSelectorHtml(value.variation_name2);
                }
                cartButtonJudge();
            });

        }
        else {
            color.addClass("color_DisableStock_");
            color.bind("click", function(event) {
                jQuery("form div.cartbox_ .colors_ .color_DisableSelected_")
                .addClass("color_DisableStock_")
                .removeClass("color_DisableSelected_");
                color.removeClass("color_DisableStock_");
                color.addClass("color_DisableSelected_");

                jQuery("form div.cartbox_ .colors_ .color_Selected_")
                .removeClass("color_Selected_")
                .addClass("color_EnableStock_");

                variation_register.selected_color = value.variation_name2;

                if (variation_register.isUseSize) {
                    replaceSizeSelectorHtml(value.variation_name2);
                }
                cartButtonJudge();
            });
        }

        color.bind("mouseover", function(event) {
            rewriteThumbnail(value.variation_name2, value.sold);
            maskThumbnail(value.sold);
        });

        color.bind("mouseleave", function(event) {
            rewriteThumbnail(variation_register.selected_color, value.sold);
            if (variation_register.selected_color) {
                jQuery.each(color_array, function(key, arrayitem) {
                    if (arrayitem.variation_name2 == variation_register.selected_color) {
                        maskThumbnail(arrayitem.sold);
                        return false;
                    }
                });
            }
            else {
                maskThumbnail(value.sold);
            }
        });
        colors.append(color);
    });


    if (jQuery("form div.cartbox_ div.colors_").length > 0) {
        jQuery("form div.cartbox_ div.colors_").replaceWith(colors);
    }
    else {
        jQuery("form div.cartbox_").prepend(colors);
    }

    setThumbnail();
}

function replaceSizeSelectorHtml(selected_color) {
    createSizeSelectorHtml(getSizeSelectors(variation_register.raw_json, selected_color));
}

function replaceColorSelectorHtml(selected_size) {
    createColorSelectorHtml(getColorSelectors(variation_register.raw_json, selected_size));
}

function getSizeSelectors(items, selected_color) {
    var size_array = new Object();
    var createArray = function(item) {
        if (item.variation_name1 != "") {
            if (!size_array[item.variation_name1]) {
                var obj = null;
                if (item.sold) {
                    obj = {
                        sold: true,
                        variation_name1: item.variation_name1
                    };
                }
                else {
                    obj = {
                        sold: false,
                        variation_name1: item.variation_name1
                    };
                }
                size_array[item.variation_name1] = obj;
            }
            else {
                if (item.sold) {
                    size_array[item.variation_name1].sold = true;
                }
            }
        }
    }

    jQuery.each(items, function(i, item) {
        if (selected_color) {
            if (item.variation_name2 == selected_color) {
                createArray(item);
            }
        }
        else {
            createArray(item);
        }

    });
    return size_array;
}

function getColorSelectors(items, selected_size) {
    var color_array = new Object();
    var createArray = function(item) {
        if (item.variation_name2 != "") {
            if (!color_array[item.variation_name2]) {
                var obj = null;
                if (item.sold) {
                    obj = {
                        sold: true,
                        variation_name2: item.variation_name2
                    };
                }
                else {
                    obj = {
                        sold: false,
                        variation_name2: item.variation_name2
                    };
                }
                color_array[item.variation_name2] = obj;
            }
            else {
                if (item.sold) {
                    color_array[item.variation_name2].sold = true;
                }
            }
        }
    }

    jQuery.each(items, function(i, item) {
        if (selected_size) {
            if (item.variation_name1 == selected_size) {
                createArray(item);
            }
        }
        else {
            createArray(item);
        }
    });
    return color_array;
}

function searchIsUseVariation(items) {
    jQuery.each(items, function(i, item) {
        if (item.variation_name1) {
            if (item.variation_name1 != "") { variation_register.isUseSize = true; }
        }
        if (item.variation_name2) {
            if (item.variation_name2 != "") { variation_register.isUseColor = true; }
        }
    });
    var message = ""
    if (variation_register.isUseColor && variation_register.isUseSize) {
        message = "カラーとサイズを選択してください。";
    }
    else if (variation_register.isUseColor && !variation_register.isUseSize) {
        message = "カラーを選択してください。"
    }
    else if (!variation_register.isUseColor && variation_register.isUseSize) {
        message = "サイズを選択してください。";
    }
    else {
    }
    if (message != "") {
        jQuery("div.goodsspec_ > form").prepend("<span>" + message + "</span>");
    }
}

function rewriteGoodsSpec(goods) {
    jQuery.each(variation_register.raw_json, function(i, item) {
        if (item.goods == goods) {
            jQuery("#spec_goods_name").get(0).innerHTML = ecUtil.htmlspecialchars(item.name);
            jQuery("#spec_goods").get(0).innerHTML = ecUtil.htmlspecialchars(item.goods);
            if (item.variation_name1 && jQuery("#spec_variation_name1").get().length > 0) {
                jQuery("#spec_variation_name1").get(0).innerHTML = ecUtil.htmlspecialchars(item.variation_name1);
            }
            if (item.variation_name2 && jQuery("#spec_variation_name2").get().length > 0) {
                jQuery("#spec_variation_name2").get(0).innerHTML = ecUtil.htmlspecialchars(item.variation_name2);
            }

            if (jQuery("#spec_price .price_pop_").get().length > 0) {
                jQuery("#spec_price .price_pop_").get(0).innerHTML = ecUtil.htmlspecialchars(item.sales_comment);
            }

            if (jQuery("#spec_price .price_").get().length > 0) {
                jQuery("#spec_price .price_").get(0).innerHTML = ecUtil.htmlspecialchars(item.format_price);
            }
            
            if (jQuery("#spec_price .small_").get().length > 0) {
                if (item.sales) {
                    jQuery("#spec_price .small_").get(0).innerHTML = ecUtil.htmlspecialchars("(通常価格 " + item.format_original_price + ")");
                }
                else {
                    if (item.net) {
                        jQuery("#spec_price .small_").get(0).innerHTML = ecUtil.htmlspecialchars("(税抜価格 " + item.format_net + ")");
                    }
                    else {
                        jQuery("#spec_price .small_").get(0).innerHTML = "";
                    }
                }
            }

            if (jQuery("#spec_point").get().length > 0) {
                jQuery("#spec_point").get(0).firstChild.data = item.point;
            }
            if (jQuery("#spec_stock_msg").get().length > 0) {
                jQuery("#spec_stock_msg").get(0).innerHTML = ecUtil.htmlspecialchars(item.stock_message);
            }
            if (jQuery("#spec_item_code").get().length > 0) {
                jQuery("#spec_item_code").get(0).innerHTML = ecUtil.htmlspecialchars(item.item_code);
            }

            if (jQuery("#spec_goods_comment").get().length > 0) {
                jQuery("#spec_goods_comment").get(0).innerHTML = ecUtil.htmlspecialchars(item.comment);
            }

            if (!variation_register.isUseColor) {
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("src", item.src_l);
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("alt", item.name);

                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("name", item.goods);
                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("title", item.variation_name2);

                if (item.src_n2 && item.src_n2 != "") {
                    jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("href", item.src_n2);
                }

            }

            if (item.set_fg == "1") {
                replaceGoodsSet(goods);
            } else {
                jQuery(".goods_set_area_").hide();
            }

            return false;
        }
    });
}

function setThumbnail() {
    jQuery("div.cartbox_ div.colors_ div.color_").each(function(i, item) {
        var title = item.getAttribute("title");

        jQuery.each(variation_register.raw_json, function(j, c) {
            if (c.variation_name2 == title) {
                if (c.src_n != "") {
                    item.style.backgroundImage = "url(" + c.src_n + ")";
                }
                else {
                    item.style.backgroundImage = "url(" + "../../../img/sys/sorry9.png" + ")";
                }
                return false;
            }
        });
    });
}

function cartButtonJudge() {
    if (variation_register.isUseColor) {
        rewriteThumbnail(null, null);
    }
    if (canDispCartButton()) {
        maskThumbnail(true);
        switchCartButton(true);
    }
    else {
        switchCartButton(false);
    }
}

function rewriteThumbnail(color, sold) {
    if (color) {
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (item.variation_name2 == color) {
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("src", item.src_l);
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("alt", item.name);

                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("name", item.goods);
                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("title", item.variation_name2);

                if (item.src_n2 && item.src_n2 != "") {
                    jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("href", item.src_n2);
                }

                return false;
            }
        });
    }
    else {
        if (!variation_register.selected_color) { return false; }
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (item.variation_name2 == variation_register.selected_color) {
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("src", item.src_l);
                jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").attr("alt", item.name);

                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("name", item.goods);
                jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("title", item.variation_name2);

                if (item.src_n2 && item.src_n2 != "") {
                    jQuery(".goodsproductdetail_ .goodsimg_ a.info:first").attr("href", item.src_n2);
                }

                return false;
            }
        });
    }
}


function maskThumbnail(sold) {
    if (jQuery(".goodsproductdetail_ .goodsimg_ div.mask_")) { jQuery(".goodsproductdetail_ .goodsimg_ div.mask_").remove(); }
    if (!sold) {
        var top = jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").position().top;
        var left = jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").position().left;
        var width = jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").width();
        var height = jQuery(".goodsproductdetail_ .goodsimg_ img.src_l_").height();
        var mask = jQuery("<div>在庫がありません</div>");
        variation_register.nostockEnable = true;
        
        jQuery(".goodsproductdetail_ .goodsimg_").append(mask);
        mask.addClass("mask_");
        mask.css("left", left).css("top", top).css("width", width).css("height", height);
    }
    else {
        if (jQuery(".goodsproductdetail_ .goodsimg_ div.mask_")) {jQuery(".goodsproductdetail_ .goodsimg_ div.mask_").remove(); }
        variation_register.nostockEnable = false;
    }
}