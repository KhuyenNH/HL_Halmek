function locationJump(url) {
    if (url == "" || url == undefined) {
        return false;
    }

    location.href = url;

}
/* 検索フォーム */
jQuery(function() {
    var inputKeyword = jQuery('.search_form_ input#keyword')
    inputKeyword.after('<p class="placeholder_">キーワードから探す</p>');
    var PHKeyword = jQuery('.search_form_ .placeholder_')

    inputKeyword.focus(function() {
        PHKeyword.css('display', 'none');
    });
    PHKeyword.click(function() {
        jQuery(this).css('display', 'none');
        inputKeyword.focus();
    });
    inputKeyword.blur(function() {
        var inputKeywordValue = jQuery('.search_form_ input#keyword').val();
        if (inputKeywordValue == '') {
            PHKeyword.css('display', 'block');
        } else {
            PHKeyword.css('display', 'none');
        }
    });
});


/* マイページ　アドレス帳の変更用 */
jQuery(function() {
    jQuery("#dest_change #destnav").css("display", "none");
    jQuery("#dest_change a").click(function() {
        jQuery("#dest_change #destnav").slideToggle("fast", function() {
            if (jQuery("#dest_change #destnav").css("display") == "none") {
                jQuery("#dest_change a.menu_").css("background-image", "url('../../img/usr/link_mypage.png')");
            } else if (jQuery("#dest_change #destnav").css("display") == "block") {
                jQuery("#dest_change a.menu_").css("background-image", "url('../../img/usr/down_mypage.png')");
            }
        });
    });
});

/*
jQuery(document).ready(function() {
    jQuery("#goods_class_filter_ select").bind("change", function(event) {
        location.href = jQuery(this).val();
    });
    jQuery("#goods_class_filter_").css("display", "block");
	var listWidth = jQuery('body').width()+"px";
	jQuery('nav.CategoryStyleG_ ul li').css('width', listWidth);

    jQuery(window).bind('load orientationchange', function() {
        if (Math.abs(window.orientation) === 90) {
            jQuery('meta[name=viewport]').attr('content', 'width=device-height, height=' + jQuery('body').height() + ', user-scalable=no, initial-scale=1, maximum-scale=1');
			var listWidth = jQuery('body').width()+"px";
			jQuery('nav.CategoryStyleG_ ul li').css('width', listWidth);
        } else {
            jQuery('meta[name=viewport]').attr('content', 'width=device-width, height=' + jQuery('body').height() + ', user-scalable=no, initial-scale=1, maximum-scale=1');
			var listWidth = jQuery('body').width()+"px";
			jQuery('nav.CategoryStyleG_ ul li').css('width', listWidth);
        }
    })
	jQuery(window).resize(function(){
		var listWidth = jQuery('body').width()+"px";
		jQuery('nav.CategoryStyleG_ ul li').css('width', listWidth);
	});
});
*/

/* 孫カテゴリ用 */
jQuery(function() {
    if (jQuery('#c_open').val() == '0') { /* カテゴリ展開時のセット */
        jQuery('nav.CategoryStyleG_').find('ul.layer1_, ul.layer2_, ul.layer3_').css('display', 'block');
        jQuery('nav.CategoryStyleG_ .parent_').toggleClass("img_hidden_");
    } else { /* カテゴリ非展開時のセット */
        jQuery('nav.CategoryStyleG_').find('ul.layer1_, ul.layer2_, ul.layer3_').css('display', 'none');
    }

    if (jQuery('#g_open').val() == '0') { /* カテゴリ展開時のセット */
        jQuery('nav.GenreStyle_').find('ul.layer1_, ul.layer2_, ul.layer3_').css('display', 'block');
        jQuery('nav.GenreStyle_ .parent_').toggleClass("img_hidden_");
    } else { /* カテゴリ非展開時のセット */
        jQuery('nav.GenreStyle_').find('ul.layer1_, ul.layer2_, ul.layer3_').css('display', 'none');
    }

    jQuery('nav.CategoryStyleG_ li, nav.GenreStyle_ li').each(function() {
        if (jQuery(this).children().get(0).tagName != 'P') {
            /* カテゴリ展開時のセット */
            jQuery(this).children('ul').css('display', 'block');
            jQuery(this).children('.parent_').toggleClass("img_hidden_");
        }
    });

    jQuery('nav.CategoryStyleG_ .parent_, nav.GenreStyle_ .parent_').click(function() {
        var _thisMenu = jQuery(this).parent().children("ul");
        _thisMenu.slideToggle('fast');
        jQuery(this).toggleClass("img_hidden_");
        return false;
    });
});

/* 画面幅に合わせて商品表示 */
function liquidizeGoodsList(itemNode,eachMinWidth) {
	if (jQuery(itemNode).length < 1){return;} //要素が見つからない場合は、処理を終了

	var padding = parseInt(jQuery(itemNode).css('padding-left'));
	var itemWidth = eachMinWidth + padding * 2;

	jQuery(document).ready(function() {
		fixWidth();
	});
	jQuery(window).on('orientationchange resize', function() {
		fixWidth();
	});
	
	function fixWidth() {
		var parentWidth = jQuery(itemNode).parent().width();
		var itemCount = parseInt(parentWidth  / itemWidth ); // １行あたりの商品表示数
		var change_width =  (parentWidth  / itemCount) - padding * 2 ; //１商品あたりの表示幅
		jQuery(itemNode).css("width",change_width + "px" );
    	jQuery('br.liquidizeGoodsList').remove();
		jQuery(itemNode + ':nth-child(' + itemCount + 'n)').after("<br class='liquidizeGoodsList' clear='both'>");
	}
}

/* 名前の高さを行ごとにそろえる */
function tileGoodsList(itemArea, itemNode, itemName) {
	if (jQuery(itemNode).length < 1) return; // 要素が見つからない場合は、処理を終了
	
	jQuery(document).ready(function() {
		fixHeight();
	});
	jQuery(window).on('orientationchange resize', function() {
		fixHeight();
	});
	
	function fixHeight() {
		jQuery(itemArea).each(function() {
			var frame = jQuery(this);
			var item = frame.find(itemNode + ':first');
			var maxColumn = Math.floor(frame.width() / item.width());
			if (!maxColumn || maxColumn == 0) return true;
			frame.find(itemName).tile(maxColumn);
		});
	}

}

/* 会員規約表示 */
jQuery(document).ready(function () {
    jQuery("#agree_contents dt").on("click", function() {
        jQuery(this).next().slideToggle();
        jQuery("#agree_contents dt").remove();
    });
});