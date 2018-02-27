jQuery(document).ready(function() {
	
	var timer;           // Ajaxリクエストのタイマー変数
	var startAt;         // Ajaxリクエストの開始時間
	var waitTime = 1000; // Ajax結果出力の待機時間（読み込み中画像が表示される最小時間）
	
	// ステータスをクリア
	var anchor = jQuery('#goods_list_auto_load');
	anchor.data('loading', false);
	anchor.data('autoload', true);
	
	// 次のページ番号初期化：2
	var page = jQuery('#goods_list_auto_load_form input[name=\'p\']');
	if (page && page.length > 0) page.val(2);
	
	// スクロール時に画面位置をチェック
	// ▼▼▼自動で次ページ読み込みしないときにコメントアウト▼▼▼
	jQuery(window).on('scroll', function() {
		
		// 次ページ読み込み中は処理しない
		if( anchor.data('loading') ) return;
		
		// キャンセルしていれば読み込まない
		if ( !anchor.data('autoload') ) return;
		
		// ウィンドウ下辺が一覧の末尾を越えると起動
		var windowBottom = jQuery(window).scrollTop() + jQuery(window).height();
		var anchorTop = anchor.offset().top;
		if (windowBottom > anchorTop) {
			loadGoodsList();
		}
	});
	// ▲▲▲自動で次ページ読み込みしないときにコメントアウト▲▲▲
	
	// ボタン：読み込み中
	jQuery('#goods_list_loading_button').on('click', function() {
		anchor.data('autoload', false);
		jQuery.removeData(anchor, 'result');
		if (timer) clearTimeout(timer);
		toggleLoadingButton();
	});
	
	// ボタン：つづきを見る
	jQuery('#goods_list_load_button').on('click', function() {
		jQuery.removeData(anchor, 'result');
		anchor.data('autoload', true);
		anchor.data('loading', false);
		loadGoodsList();
	});
	
	// 次ページ読み込み
	function loadGoodsList() {
		
		// すでに読込中なら中止
		if ( anchor.data('loading') ) return;
		anchor.data('loading', true);
		
		// 処理状態「start」を設定
		jQuery('#goods_list_auto_load_status').val('start').trigger('change');
		
		toggleLoadingButton();
		
		// Ajax読み込み開始
		jQuery.ajax({
			url: EC_WWW_ROOT + '/shop/goods/listloadapi.aspx' + GetQueryString() ,
			async: true,
			cache: false,
			dataType: 'xml',
			beforeSend: function() {
				// Ajaxレスポンス待機開始
				startAt = (new Date()).getTime();
			}
		})
		.done(function(data) {
			anchor.data('result', data);
			
			// 残りの待機時間を計算
			var now = (new Date()).getTime();
			var timeout = waitTime + startAt - now;
			if (timeout < 0) timeout = 0;
			
			// 待機時間後に画面に追加
			timer = setTimeout('appendResultContent()', timeout);
		})
		.fail(function(data) {
			toggleLoadingButton();
			alert('セッションの有効期間がきれました。\n' +
				'誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n' +
				'※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。');
		})
		.always(function(data) { });
	}
	
	// クエリ作成メソッド
	function GetQueryString() {
		var query = '';
		jQuery('#goods_list_auto_load_form input[value!=\'\']').each(function() {
			query += (query.length > 0) ? '&' : '?';
			query += jQuery(this).attr('name');
			query += '=';
			query += jQuery(this).val();
		});
		return query;
	}
});

// 読み込み中/つづきを見る を切り替える
function toggleLoadingButton() {
	jQuery('#goods_list_loading_button').toggle();
	jQuery('#goods_list_load_button').toggle();
}

// Ajax取得データを画面に追加
function appendResultContent() {
	var anchor = jQuery('#goods_list_auto_load');
	if ( !anchor.data('autoload') ) return;
	
	// 取得したXML
	var result = jQuery( anchor.data('result') );
	
	// エラーを取得⇒処理終了
	if ( result.find('error').length > 0 ) {
		anchor.data('autoload', false);
		jQuery('#goods_list_loading_button').hide(); // 非表示：「つづきを見る」
		jQuery('#goods_list_load_button').hide();    // 非表示：「読み込み中」
		jQuery.removeData(anchor, 'result');         // キャッシュを削除
		anchor.data('loading', false);               // 読み込み中ステータスをOFF
		jQuery('#goods_list_auto_load_status').val('end').trigger('change'); // 処理状態「end」を設定
		
		// エラーメッセージを表示
		var errorMessage = result.find('error').text();
		if ( errorMessage.length > 0 ) alert(errorMessage);
		
		return false;
	}
	
	// 一覧のHTMLを追加
	if ( result.find('body').length > 0 ) {
		var body = result.find('body').text();
		jQuery('#goods_list_auto_load_area .goods_list_wrapper_').append(body);
	}
	
	// [1～*件] を更新
	if ( result.find('navipage').length > 0 ) {
		var navipage = result.find('navipage').text();
		jQuery('.navipage_range_').text(navipage);
	}
	
	// 最終ページか
	if ( result.find('lastpage').length > 0 ) {
		// 非表示：「つづきを見る」
		// 非表示：「読み込み中」
		anchor.data('autoload', false);
		jQuery('#goods_list_loading_button').hide();
		jQuery('#goods_list_load_button').hide();
	} else {
		// 表示：「つづきを見る」
		// 非表示：「読み込み中」
		toggleLoadingButton();
	}
	
	// ページの番号をカウントアップ
	var page = jQuery('#goods_list_auto_load_form input[name=\'p\']');
	page.val( parseInt(page.val()) + 1 );
	
	// キャッシュを削除
	jQuery.removeData(anchor, 'result');
	
	// 読み込み中ステータスをOFF
	anchor.data('loading', false);
	
	// 処理状態「end」を設定
	jQuery('#goods_list_auto_load_status').val('end').trigger('change');
	
	// Google Analyticsが有効化か
	if ( result.find('googleanalytics').length > 0) {
		// ページ閲覧を送信
		var pageURL = result.find('pageurl');
		if (ga && pageURL.length > 0) ga('send', 'pageview', pageURL.text());
	}
}
