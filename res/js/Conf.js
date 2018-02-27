/**
 * いろいろ設定
 * ※商品詳細ページなどで使うAjaxリクエスト用のパスもここに記載しています。
 * ローカルモード|サーバー動作モードの切り替えは<script>タグ内src属性値で制御。
 * ローカルモード :
 * <script src="path/to/Conf.js?mode=local"></script>
 * サーバー動作モード :
 * <script src="path/to/Conf.js"></script>
 * @type {Object}
 */
;if(typeof Conf != 'object') var Conf = {};

Conf.me = ReqUtil.getJSPaths('Conf.js',true);
Conf.isLocal = Conf.me.params ? (Conf.me.params.mode && Conf.me.params.mode == 'local' ? true : false) : false;

//ダミー画像置換やconsole.log()の出力切り替え。開発中はフラグをtrueに。
Conf.isDevMode = 0;

/**
 * パス設定
 * urlservices dummyの切り替え
 */
Conf.PATH = {};
Conf.PATH.js = 'res/js/';
//ルートのurlはjsのパスから判別するようにしました。いちいち設定しなくてOKです。
// Conf.PATH.root = Conf.isLocal ? "/ec/" : "/ec/";
Conf.PATH.root =  Conf.me.path.replace(new RegExp(RegExp.escape(Conf.PATH.js)+'$'),'');
Conf.PATH.http = Conf.PATH.root;
Conf.PATH.img = Conf.PATH.http + EC_WWW_ROOT +"res/img/";
Conf.PATH.json = {
	//ajax読み込み外部ファイル(json)
	//ルートからのパスを記載
	//(Conf.isLocal ? "path/to/local" : "path/to/server")
	item_stock : Conf.PATH.http + (Conf.isLocal ? "item/stock.json" : "api/item/findByItemCd")
	,add_to_cart : Conf.PATH.http + (Conf.isLocal ? "item/add2cart.json" : "api/item/addToCart")
	,item_by_catalog : Conf.PATH.http + (Conf.isLocal 
		? "item/item_by_catalog.json" 
		: EC_WWW_ROOT + "shop/search/lookupgoodslistforajax.aspx")
	//[TEST]input１個目と２個目の戻り値を別に
	// ,item_by_catalog2 : Conf.PATH.http + (Conf.isLocal  
	// 	? "item/ibc2.json" 
	// 	: "api/item/findByCatalogItemCd")
	,attentions : Conf.PATH.http + EC_WWW_ROOT +"res/json/attentions.json"
	,research : Conf.PATH.http + EC_WWW_ROOT +"res/json/research.json"
};
Conf.PATH.html = {
	//ajax読み込み外部ファイル(html)
};

/**
 * 在庫数の表示設定。badge表示に使ったりする。
 * @type {Object}
 */
Conf.stockCnt = {
	many:Infinity //在庫あり <=
	,less:2 //残り僅か <= (在庫*個以下でbadgeの表記が変わる)
	,empty:0 //在庫なし <=
};

//一度にショッピングカートに入れられる数量の最大値
Conf.qtySelectMax = 10;

//スライダ用cssクラスprefix
Conf.sliderPref = 'ifs-';

//selectboxを開くスピード
Conf.selectOpenSpeed = 280;

//誕生日セレクトボックスの通常時の値。現在から何年引くか。
Conf.defBirthdayYearSelectDiff = 55;

//配送日のセレクトボックスの初期値。現在時から?日後
Conf.deliveryDateStart = 10;
//配送日のセレクトボックスで選択できる最終日。現在時から?日後
Conf.deliveryDateEnd = (7*6)+10;

//ajaxリクエストのメソッドは常にこれで。各formのmethod優先。
Conf.ajaxMeth = 'post';

/**
 * 開発モード|公開モードの挙動
 */
if(!Conf.isDevMode){
	jQuery(function(){
		jQuery.log = function(){};
	});
}else{
	//developing mode.
	//ダミー画像用
	Holder.add_theme("gM",{background:"#DEDAD7", foreground:"#FFFFFF", size:20, font: "Helvetica"});
	// Holder.add_theme("gM",{background:"#FFFFFF", foreground:"#DEDAD7", size:20, font: "Helvetica"});
	// Holder.add_theme("gM",{background:"#0000FF", foreground:"#DEDAD7", size:20, font: "Helvetica"});
}
