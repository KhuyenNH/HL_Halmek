// fsImageWidth: 画像の最大幅
function initFlipsnap(fsImageWidth) {
	
	// スライドナビゲーション表示
	var fsPointer = jQuery('.fs_pointer');
	if (fsPointer.children().length < 2) {
		// 画像2個未満ならスライド非表示
		return;
	}
	jQuery('.fs_control').show();

	// セレクタ
	var fsLine = '.etc_goodsimg_line_'; // 行エリア
	var fsItem = '.etc_goodsimg_item_'; // 画像+説明エリア
	var fsImage = '.etc_goodsimg_item_ img'; // 画像
	
	// 繰り返す各要素に幅を設定
	jQuery('.fs_viewport').width(fsImageWidth);
	jQuery(fsLine).width(fsImageWidth * fsPointer.children().length);
	jQuery(fsItem).addClass('fs_item').width(fsImageWidth);
	
	// 最大高さを設定
	var modHeight = 0;
	jQuery(fsImage).load(function() {
		
		// 画像+説明エリアを取得
		var item = jQuery(this).parent(fsItem); // 拡大画像なし
		if (!item) item = jQuery(this).parent().parent(fsItem); // 拡大画像あり
		
		// 画像とコメントの高さの合計を取得
		var itemHeight = 0;
		item.children().each(function() {
			itemHeight += jQuery(this).outerHeight();
		});
		
		if (modHeight < itemHeight) {
			modHeight = itemHeight;
			jQuery(fsItem).height(modHeight);
		}
	});
	
	
	// 画像スライド設定
	var fs = Flipsnap(fsLine);
	var fsPrev = jQuery('.fs_prev').click(function() { fs.toPrev(); }); 
	var fsNext = jQuery('.fs_next').click(function() { fs.toNext(); });
	
	// ボタン・ポインタの初期状態を設定
	fsPrev.attr('disabled', !fs.hasPrev());
	fsNext.attr('disabled', !fs.hasNext());
	
	// スライド時
	fs.element.addEventListener('fspointmove', function() {
		// ボタン状態更新
		fsNext.attr('disabled', !fs.hasNext());
		fsPrev.attr('disabled', !fs.hasPrev());
		
		// ポインタ状態更新
		fsPointer.children('.fs_pointer_current').removeClass('fs_pointer_current');
		fsPointer.children().eq(fs.currentPoint).addClass('fs_pointer_current');
	}, false);
	
}