jQuery(document).ready(function() {
	
	// 店舗在庫画面へ遷移
	jQuery("#store_goods_stock_link").bind("click keypress", function(event){
		
		if (event.type == "keypress") {
			// Enter以外では動作をしない
			if (event.which != 13) return;
		}
		
		// 既存イベントを無効化
		event.preventDefault();
		
		// 初期表示時の商品コードの設定
		var url = jQuery(this).attr("_href");
		var goods = jQuery("#hidden_goods").val();
		
		// セレクトボックスから商品コード取得
		var variation = jQuery("select[name='goods']");
		if ( variation.length > 0 ) {
			if ( variation.val() ) {
				// 選択されている商品コード
				goods = variation.val();
			} else {
				// セレクトボックス最上位の商品コード
				variation.find( "option" ).each(function() {
					if ( !jQuery(this).val() ) return true;
					goods = jQuery(this).val()
					return false;
				});
			}
		}
		
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += "goods=" + goods;
		
		location.href = url;
	});
	
	// 商品詳細画面へ遷移
	jQuery("#store_goods_back_link").bind("click keypress", function(event){
		
		if (event.type == "keypress") {
			// Enter以外では動作をしない
			if (event.which != 13) return;
		}
		
		// 既存イベントを無効化
		event.preventDefault();
		
		// ボタンに埋め込まれたURLへ遷移
		location.href = jQuery(this).attr("_href");;
	});
	
	// 店舗在庫でバリエーションを切り替える
	jQuery("select[name='goods'].change_variation_").bind("change", function() {
		
		// 現在のURL（クエリなし）を取得
		var url = window.location.pathname
		
		// 選択された商品コードを追加
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += "goods=" + jQuery(this).val();
		
		location.href = url;
	});
});
