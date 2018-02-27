var goodscode_    = "";
var deliverydt_   = "";
var cartl_        = "";
var stock_msg_    = "";
var no_colorsize  = "";


var goods_detail_load = function(){
  console.log('goods_detail_load');
	//-- 関連商品・色
	jQuery('#carousel1').flexslider({
		namespace: Conf.sliderPref,
		animation: "slide",
		controlNav: false,
		slideshow: false,
		itemWidth: 90
	});
	//-- 関連商品・商品画像
	jQuery('#carousel2').flexslider({
		namespace: Conf.sliderPref,
		animation: "slide",
		controlNav: false,
		slideshow: false,
		itemWidth: 90
	});
	//-- 関連商品・タブ
	jQuery("#tabTop li:nth-child(5) a").click(function(){
		jQuery("#relatedTab").addClass('active');
		jQuery("#recommend2 .rel-items .item-list li .detail").tile();
		jQuery("#recommend2 .rel-items .item-list li .item").tile();
	});
	//-- 関連商品・下部
	jQuery('#recommend1 .rel-items-carousel').flexslider({
		namespace: Conf.sliderPref,
		animation: "slide",
		controlNav: false,
		slideshow: false,
		itemWidth: 178
	});
	jQuery("#recommend1 .rel-items-carousel .item .detail").tile();
	jQuery("#recommend1 .rel-items-carousel .item").tile();
	jQuery('.rel-items-carousel .ifs-direction-nav > li > a').each(function(){
		var $this = jQuery(this);
		var $p = $this.closest('.ifs');
		if($p && $p.length && $p.height()>0){
			$this.css('top',($p.height()-$this.height())/2);
		}else{
			$this.css('top',6*6);
		}
		jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
		var win_width = window.innerWidth;
		var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
		jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
	});
	
	// ツールチップ初期表示
	var $selectedColor = jQuery('select[name=_colorSelect] option:first-child').val()
	var $selectedSize = jQuery('#sizeSelect option:first-child').val()
	var $tooltip = jQuery('#colorSelectArea .tooltip')
	$selectedColor == '' ? $tooltip.show():$tooltip.remove();


	// サムネイルクリック
	jQuery('#imagesTab .slides.thumbs li').click(function (e) {
		e.preventDefault();
		var eq = jQuery('#imagesTab .slides.thumbs li').index(this)
		jQuery('#imgSlider').flexslider(eq);
		jQuery('#imagesTab .slides.thumbs li').removeClass('thumb-selected')
		jQuery(this).addClass('thumb-selected')
	});
	
	
	$thumbname=jQuery('#carousel1 li').each(function(index, el) {
		var  $thumbname=jQuery(this).attr('data-original-title')
		jQuery(this).find('p').attr('data-original-title',$thumbname);
	});

	jQuery('[rel="fixed-tooltip"]').each(function(i,o){
		new FixedTooltip(jQuery(o));
	});
	
	View.setRecommendCarousel = function($parent){
		if(!($parent instanceof jQuery) || $parent.length === 0) return;
		//flexsliderの初期化は一回だけ。
		if(!jQuery('.rel-items-carousel',$parent).data('flexslider')){
			jQuery('.rel-items-carousel',$parent).flexslider({
				namespace: Conf.sliderPref,
				animation: "slide",
				controlNav: false,
				slideshow: false,
				itemWidth: 178,
				start:function(){
					jQuery('.rel-items-carousel',$parent).animate({'opacity':1},200);
				}
			});
		}

		//高さ揃え
		jQuery(".rel-items-carousel .item .detail", $parent).tile();
		jQuery("#recommend2 .rel-items .item-list li .item .detail").tile();
		// カルーセル、(<)(>)の縦中央揃え
		jQuery('.rel-items-carousel .ifs-direction-nav > li > a',$parent).each(function(){
			var $this = jQuery(this);
			var $p = $this.closest('.ifs');
			if($p && $p.length && $p.height()>0){
				//jQuery('.item-list .item .detail').css('height','114px'); //sp対応
				$this.css('top',($p.height()-$this.height())/2);
			}else{
				//高さが0以下だった場合とかは36px固定？（modalの中とか）
				$this.css('top',6*6);
			}
			jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
			//スライダー高さ調節（Sp版のとき解除する）
			var win_width = window.innerWidth;
			var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
			jQuery.log('pnBodyList = ' + pnBodyList);
			jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
			
		});

		//関連商品がない場合の商品画像スライダーのボタンサイズ設定
		//function外に出す。
		var timer = false;
		jQuery(window).resize(function() {
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				jQuery(".rel-items-carousel .item .detail", $parent).tile();
				var pnBodyList = jQuery("#imgSlider .ifs-viewport .slides.large-images li img").height();
				//jQuery("#imgSlider .ifs-viewport .slides.large-images li img, #imgSlider .ifs-direction-nav > li > a").tile();
				jQuery("#imgSlider .ifs-direction-nav > li > a").css("height", pnBodyList);
				jQuery("#itemDetail #pageTitles .nav-tabs li").tile();
				jQuery("#recommend2 .rel-items .item-list li .item .detail").tile();
			}, 200);
		});
	};//View.setRecommendCarousel

	jQuery('.tab-nav a').click(function(e) {
	var $href = jQuery(this).attr('href').slice(3)
	jQuery('#tabTop a[href=#'+$href+']').click()
		jQuery('html,body').animate({
			scrollTop:jQuery('#pageTitles').offset().top
		});
	});
	
	jQuery('#sizeTableModal').find('.table-bordered').removeClass('showPc');
  
};

jQuery(window).load(function() {
  goods_detail_load();
});

var goods_detail_ready = function(){
  console.log('goods_detail_ready');
	if((jQuery('select[name=_sizeSelect] option:first').val() == '') && (jQuery('select[name=_sizeSelect] option:selected').val() != '')) {
		jQuery('select[name=_sizeSelect] option:first').remove();
	}
	if((jQuery('select[name=_colorSelect] option:first').val() == '') && (jQuery('select[name=_colorSelect] option:selected').val() != '')) {
		jQuery('select[name=_colorSelect] option:first').remove();
	}
	
	//数量Selectの非活性化
	if ((jQuery('select[name=_qtySelect]').val() == '') || (jQuery('select[name=_sizeSelect]').val() == '') || (jQuery('select[name=_colorSelect]').val() == '') || (jQuery('select[name=_qtySelect]').text() == '－')) {
		qtyselect_disable();
		jQuery('#deliveryDate,#deliveryDate_sp').css("display", "none");
	}
	
	jQuery('#no-stock-btn').css("display", "block");
  
  /*     */
  
	//色選択プルダウン
		var gurl = window.location.href.substring(0,window.location.href.indexOf("?"));
		
	jQuery('select[name=_colorSelect]').change(function() {
		if (jQuery('select[name=_colorSelect]').val() != '') {
			jQuery('select[name=_colorSelect] option[value=""]').remove();
			jQuery('select[name=_colorSelect]').selectbox('detach');
            jQuery('select[name=_colorSelect]').selectbox('attach');

			var varicode = jQuery('#hidden_variation_group').val();
			var variname1 = jQuery('select[name=_sizeSelect]').val();
			var variname2 = jQuery('select[name=_colorSelect]').val();
			GetVariationGoodsCode(varicode,variname1,variname2);
			jQuery('#colorSelectArea .tooltip').remove();
		}
		
		jQuery('#imagesTab .slides.thumbs li').find('p[data-original-title=' + jQuery("select[name=_colorSelect]").val() + ']').click();
		if ((jQuery('select[name=_qtySelect]').val() == '') || (jQuery('select[name=_qtySelect]').text() == '－')) {
			qtyselect_disable();
		}
	});

	//サイズ選択プルダウン
	jQuery('select[name=_sizeSelect]').change(function() {
		if (jQuery('select[name=_sizeSelect]').val() != '') {
			jQuery('select[name=_sizeSelect] option[value=""]').remove();
			jQuery('select[name=_sizeSelect]').selectbox('detach');
            jQuery('select[name=_sizeSelect]').selectbox('attach');

			var varicode = jQuery('#hidden_variation_group').val();
			var variname1 = jQuery('select[name=_sizeSelect]').val();
			var variname2 = jQuery('select[name=_colorSelect]').val();
			GetVariationGoodsCode(varicode,variname1,variname2);
		}
		if ((jQuery('select[name=_qtySelect]').val() == '') || (jQuery('select[name=_qtySelect]').text() == '－')) {
			qtyselect_disable();
		}
	});

	jQuery('#dummybtn').click(function(e){
		e.preventDefault();
		jQuery('#modal1').modal('show');
	});
	
	jQuery('#goodsnullbtn').click(function(e){
		e.preventDefault();
		jQuery('#goodsnullmodal').modal('show');
	});
  
};
jQuery(document).ready( function(){
  goods_detail_ready();
});

function GetVariationGoodsCode(varicode,variname1,variname2){
  
  //デモ用処理
  var path = "getgoodscodeutil";
  if(variname1 != "" && variname2 != ""){
    path = "getgoodscodeutil_2";
  }
  
	jQuery.ajax({
		async: true,
		type: "POST",
		url: EC_WWW_ROOT + "/res/json/"+path+".json",
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		data: {
			"variation_group": varicode,
			"variation_name1": variname1,
			"variation_name2": variname2
		},
		cache: false,
		ifModified: false,
		dataType: "text",
		success: function(code) {
			//エラーが返ってきたとき（カートに入れられない商品）
			//「全角文字を検索します（半角カタカナ含む）」それ以外のエラー文言は対象になりません
			split_goods_stock_items(code);
			if (goodscode_ !== '') {
				//商品が取得できた場合
				if (jQuery("select[name='_qtySelect']").length > 0) {
					jQuery("select[name='_qtySelect']").load(EC_WWW_ROOT + "/res/json/getstockqtyutil.json?goods=" + goodscode_, function (){
					 	jQuery("select[name='_qtySelect']").selectbox('detach');
						jQuery("select[name='_qtySelect']").selectbox('attach');
						return true;
					});
					
					
					if ((jQuery('select[name=_sizeSelect]').val() == '') || (jQuery('select[name=_colorSelect]').val() == '')) {
					 	jQuery('.sales_view').css("display", "none");
					 	jQuery('#ajax-cart-btn').css("display", "none");
					 	jQuery('#no-stock-btn').css("display", "none");
						jQuery('.dummy_view').css("display", "block");
					}else {
						jQuery('.sales_view').css("display", "block");
						jQuery('.dummy_view').css("display", "none");
						if (cartl_ != '') {
							//購入可能
							jQuery('.sales_view').css("display", "block");
							jQuery('#ajax-cart-btn').css("display", "block");
							jQuery('#no-stock-btn').css("display", "none");
							//数量プルダウン活性化
							jQuery("select[name='_qtySelect']").removeAttr("disabled");
							jQuery("select[name='_qtySelect']").removeAttr('style');
						}else {
						 	jQuery('.sales_view').css("display", "block");
							jQuery('#ajax-cart-btn').css("display", "none");
							jQuery('#no-stock-btn').css("display", "block");
							jQuery(function(){
								setTimeout(function(){
									qtyselect_disable();
								},100);
							});
						}
					}
				 	
				 	//お届け予定日
				 	if (deliverydt_ != '' && cartl_ != '') {
				 		jQuery('#deliveryDate,#deliveryDate_sp').css("display", "block");
				 		jQuery('#delivery_comment').text(deliverydt_ + '頃');
				 	}else {
				 		jQuery('#deliveryDate,#deliveryDate_sp').css("display", "none");
				 	}
				 	
				 	//在庫コメント
					switch (stock_msg_){
						case '2':
							jQuery('#goods-badge-stock2').css("display", "block");
							jQuery('#goods-badge-stock1').css("display", "none");
							jQuery('#goods-badge-stock0').css("display", "none");
							break;
						case '1':
							jQuery('#goods-badge-stock2').css("display", "none");
							jQuery('#goods-badge-stock1').css("display", "block");
							jQuery('#goods-badge-stock0').css("display", "none");
							break;
						case '0':
							jQuery('#goods-badge-stock2').css("display", "none");
							jQuery('#goods-badge-stock1').css("display", "none");
							jQuery('#goods-badge-stock0').css("display", "block");
							break;
						default:
							jQuery('#goods-badge-stock2').css("display", "none");
							jQuery('#goods-badge-stock1').css("display", "none");
							jQuery('#goods-badge-stock0').css("display", "none");
					}
				}
			}else {
				//商品が取得できなかった場合
				jQuery('select[name=_qtySelect] option:selected').text('－');
				jQuery("select[name='_qtySelect']").selectbox('detach');
				jQuery("select[name='_qtySelect']").selectbox('attach');
				jQuery('.sales_view').css("display", "none");
				jQuery('#ajax-cart-btn').css("display", "none");
				jQuery('#no-stock-btn').css("display", "none");
				jQuery('.dummy_view').css("display", "block");
				if ((jQuery('select[name=_sizeSelect]').val() == '') || (jQuery('select[name=_colorSelect]').val() == '')) {
					jQuery('#dummybtn').css("display", "block");
					jQuery('#goodsnullbtn').css("display", "none");
				}else {
					jQuery('#dummybtn').css("display", "none");
					jQuery('#goodsnullbtn').css("display", "block");
				}
				qtyselect_disable();
			}
		},
		error: function(xhr, status, thrown) {
			alert("セッションの有効期間がきれました。\n" +
				"誠に恐れ入りますが再度トップページよりのアクセスをお願いいたします。\n\n" +
				"※当サイトではお客様の情報保護のため、一定時間経過後に接続情報を解除させていただいております。");
		}
	});
}

function split_goods_stock_items(code){

    var code_list = code.split(',');

	goodscode_  = code_list[0];
	deliverydt_ = code_list[1];
	cartl_      = code_list[2];
	stock_msg_  = code_list[3];
}

//数量プルダウン非活性化
function qtyselect_disable() {
	//PC
	jQuery('select[name=_qtySelect] option:selected').text('－');
	jQuery('#qtySelectArea select').addClass('no-init');
	jQuery('#qtySelectArea select').selectbox("attach").selectbox("disable");
	//スマホ
	jQuery('#qtySelectArea select').attr("disabled", "disabled");
	jQuery('#qtySelectArea select').css("border","1px dotted rgb(204, 194, 183)");
	jQuery('#qtySelectArea select').css("color","rgb(177, 173, 171)");
}
