/* ボタンクリックでスライドダウン */
jQuery('.btn_add_goods_ a').each(function(){
	jQuery(this).click(function(){
		if(jQuery.data(this, "open")){
			jQuery(this).closest('.select_dest_goods_box_').find('.add_goods_list_').slideUp('fast');
			jQuery.data(this, "open", 0);
		} else {
			jQuery(this).closest('.select_dest_goods_box_').find('.add_goods_list_').slideDown('fast');
			jQuery.data(this, "open", 1);
		}
	});
});


/* 件数10件以上でスクロール表示 */
var address_max_count = 5;
if(jQuery('.address_book_list_ .address_item_').length > address_max_count){
	jQuery('.address_book_list_').css({
		'overflow-y':'auto',
		'overflow-x':'hidden',
		'height':'500px'
	}).find('.address_item_').css({
		'width':'900px'
	});
};

var add_goods_list_max_count = 5;
jQuery('.add_goods_list_table_').each(function(){
	if(jQuery(this).find('tr').length > add_goods_list_max_count){
		jQuery(this).css({
			'overflow-y':'auto',
			'overflow-x':'hidden',
			'height':'200px'
		})
	}
});
