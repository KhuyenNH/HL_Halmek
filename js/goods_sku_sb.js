/// <reference path="../jquery.js" />

var variation_register = {
    raw_json: null,
    color_array: null,
    size_array: null,
    cartEnable: false,
    selected_color: null,
    selected_size: null,
    selected_goods: null,
    isUseColor: false, // variation_name2
    isUseSize: false    // variation_name1
};

jQuery(document).ready(function() {
    if (jQuery("#variation_design_type").val() != "0") {
        return false;
    }

    if (!jQuery("#hidden_variation_group").val() | jQuery("#hidden_variation_group").val() == "") {
        return false;
    }

    if (jQuery("#hidden_goods").val() == ""){
        return false;
    }
    else{
        variation_register.selected_goods = jQuery("#hidden_goods").val();
    }
    
    init();

    var url = "";
    if ("https:" == document.location.protocol) {
        url = EC_WWW_ROOT + "/shop/goods/goodsapissl.aspx";
    }
    else {
        url = EC_WWW_ROOT + "/shop/goods/goodsapi.aspx";
    }

    jQuery.ajax({
        async: false,
        url: url,
        data: { "variation_group": jQuery("#hidden_variation_group").val(), "type": "json", "oldgoods": variation_register.selected_goods },
        dataType: "json",
        type: "post",
        cache: false,
        success: function(data, status) {
            searchIsUseVariation(data);
            variation_register.raw_json = data;
            
            getNowUseVariation();
            
            if (variation_register.isUseSize) {
                variation_register.size_array = getSizeSelectors(data, variation_register.selected_color);
                createSizeSelectorHtml(variation_register.size_array);
            }
            if (variation_register.isUseColor) {
                variation_register.color_array = getColorSelectors(data, variation_register.selected_size);
                createColorSelectorHtml(variation_register.color_array);
            }
            cartButtonJudge();
        }
    }
    );
});

function init() {
    jQuery("div.cartbox_ > span.variationlist_").remove();
    cartButtonJudge();
}

function getNowUseVariation(){
        jQuery.each(variation_register.raw_json, function(i, item) {
            if (variation_register.selected_goods == item.goods){
                variation_register.selected_size = item.variation_name1;
                variation_register.selected_color = item.variation_name2;
                return;
            }
        });
}

function switchCartButton(isDisp) {
    var cartbutton = jQuery("div.cartbox_  > input[type=submit]");
    if (isDisp) {
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

                cartbutton.show();
                return;
            }
        });
    }
    else {
        if (variation_register.raw_json != null){
            if (variation_register.isUseColor | variation_register.isUseSize) {
                cartbutton.hide();
            }
            else {
                jQuery("div.cartbox_").hide();
            }
        }
    }
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
                if (value.sold) {
                  size.addClass("size_Selected_");
                }
                else{
                  size.addClass("size_DisableSelected_");
                }
            }
        }

        if (value.sold) {
            size.addClass("size_EnableStock_");
        }
        else {
            size.addClass("size_DisableStock_");
        }
        
        if (variation_register.selected_size != value.variation_name1){
            size.bind("click", function(event) {
                location.href = value.goods_path;
            });
            
            size.bind("mouseover", function(event) {
                size.addClass("size_Selected_");
            });
            
            size.bind("mouseleave", function(event) {
                size.removeClass("size_Selected_");
            });
        }
        
        sizes.append(size);
    });

    sizes.prepend(jQuery("<p class=\"guide_\">サイズを選択してください</p>").addClass("message_"));
    sizes.append(jQuery("<br>").addClass("break_"));
    sizes.append(jQuery("<span>選択されたサイズ：<strong>" + variation_register.selected_size + "</strong></span>").addClass("message_"));

    sizes.append(jQuery("<br>").addClass("break_"));

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
                if (value.sold) {
                  color.addClass("color_Selected_");
                }else{
                  color.addClass("color_DisableSelected_");
                }
            }
        }

        if (value.sold) {
            color.addClass("color_EnableStock_");
        }
        else {
            color.addClass("color_DisableStock_");
        }
        
        if (value.variation_name2 != variation_register.selected_color){
            color.bind("click", function(event) {
                location.href = value.goods_path;
            });
            
            color.bind("mouseover", function(event) {
                color.addClass("color_Selected_");
            });
            
            color.bind("mouseleave", function(event) {
                color.removeClass("color_Selected_");
            });
        }

        colors.append(color);
    });
    
    colors.prepend(jQuery("<p class=\"guide_\">カラーを選択してください</p>").addClass("message_"));
    colors.append(jQuery("<br>").addClass("break_"));
    colors.append(jQuery("<span>選択されたカラー：<strong>" + variation_register.selected_color + "</strong></span>").addClass("message_"));

    colors.append(jQuery("<br>").addClass("break_"));

    if (jQuery("form div.cartbox_ div.colors_").length > 0) {
        jQuery("form div.cartbox_ div.colors_").replaceWith(colors);
    }
    else {
        jQuery("form div.cartbox_").prepend(colors);
    }
    
    if (variation_register.isUseSize){
        jQuery("form div.cartbox_ div.colors_").after("<br>");
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
    
    var createObj = function(item) {
        var obj = null;
        
        obj = {
            sold: item.sold,
            variation_name1: item.variation_name1,
            goods: item.goods,
            goods_path: item.goods_path
        };
        
        return obj;
    }
    
    var createArray = function(item) {
        if ((item.variation_name2 == selected_color) && (item.variation_name1 != "")) {
            var obj = null;
            
            obj = createObj(item);
            
            size_array[item.variation_name1] = obj;
        }
    }

    jQuery.each(items, function(i, item) {
        createArray(item);
    });
    
    return size_array;
}

function getColorSelectors(items, selected_size) {
    var color_array = new Object();
    
    var createObj = function(item) {
        var obj = null;
        
        obj = {
            sold: item.sold,
            variation_name2: item.variation_name2,
            goods: item.goods,
            goods_path: item.goods_path
        };
        
        return obj;
    }
    
    var createArray = function(item) {
        if ((item.variation_name1 == selected_size) && (item.variation_name2 != "")) {
            var obj = null;
            
            obj = createObj(item);
            
            color_array[item.variation_name2] = obj;
        }
    }
    
    jQuery.each(items, function(i, item) {
        createArray(item);
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
    
}

function setThumbnail() {
    jQuery("div.cartbox_ div.colors_ div.color_").each(function(i, item) {
        var title = item.getAttribute("title");
        
        var src;
        
        jQuery.each(variation_register.raw_json, function(j, c) {
            if (c.variation_name2 == title) {
                if (c.src_n != "") {
                    src =  c.src_n ;
                }
                else {
                    src = "../../../img/sys/sorry9.png";
                }
                return false;
            }
        });
        
        item.style.backgroundImage = "url(" + src + ")";
        
    });
}

function cartButtonJudge() {
    if (canDispCartButton()) {
        maskThumbnail(true);
        switchCartButton(true);
    }
    else {
        switchCartButton(false);
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
        
        jQuery(".goodsproductdetail_ .goodsimg_").append(mask);
        mask.addClass("mask_");
        mask.css("left", left).css("top", top).css("width", width).css("height", height);
    }
    else {
        if (jQuery(".goodsproductdetail_ .goodsimg_ div.mask_")) {jQuery(".goodsproductdetail_ .goodsimg_ div.mask_").remove(); }
    }
}
