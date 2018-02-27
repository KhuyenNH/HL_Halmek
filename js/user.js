jQuery(window).load(function() {

	jQuery('div.goods_').each(function(a){

		jQuery(this).attr('id','goods_box' + (a+1));
		idname = "#goods_box" + (a+1) + " ";
		
		//--- 高さ調整：ランキング表示
		jQuery(idname + "div.StyleR_Item_ div.name_").tile(3);
		jQuery(idname + "div.StyleR_Item_ div.price_").tile(3);
		jQuery(idname + "div.StyleR_Item_").tile(3);

		//--- 高さ調整：ピックアップ表示
		jQuery(idname + "div.StyleP_Item_ div.img_").tile(2);
		jQuery(idname + "div.StyleP_Item_ div.price_").tile(2);
		jQuery(idname + "div.StyleP_Item_").tile(2);

		//--- 高さ調整：サムネイル表示
		jQuery("div.contents_ " + idname + "div.StyleT_Item_ div.icon_").tile(3);
		jQuery("div.contents_ " + idname + "div.StyleT_Item_ div.img_").tile(3);
		jQuery("div.contents_ " + idname + "div.StyleT_Item_ div.name_").tile(3);
		jQuery("div.contents_ " + idname + "div.StyleT_Item_ div.price_").tile(3);
		jQuery("div.contents_ " + idname + "div.StyleT_Item_").tile(3);

		//--- 高さ調整：レコメンド表示
		jQuery(idname + "div.StyleW_Item_ div.icon_").tile(5);
		jQuery(idname + "div.StyleW_Item_ div.img_").tile(5);
		jQuery(idname + "div.StyleW_Item_ div.name_").tile(5);
		jQuery(idname + "div.StyleW_Item_ div.price_").tile(5);
		jQuery(idname + "div.StyleW_Item_").tile(5);
				
	});
});