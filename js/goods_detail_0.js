jQuery(window).load(function() {
	//-- 関連商品・メイン
	slider = jQuery('#imgSlider').flexslider({
		namespace: Conf.sliderPref,
		animation: "slide",
		controlNav: false,
		slideshow: false,
		itemWidth: 450,
		start: function(){
			jQuery('#imgSlider li').eq(0).addClass('ifs-active-slide')
			jQuery('#imagesTab .slides.thumbs li').eq(0).addClass('thumb-selected')
		},
		before: function(slider){
			var num = slider.currentSlide,
			$li = jQuery('#imgSlider li'),
			$thumli=jQuery('#imagesTab .slides.thumbs li');
			$li.removeClass('ifs-active-slide')
			$li.eq(num).addClass('ifs-active-slide')
			$thumli.removeClass('thumb-selected')
			$thumli.eq(num).addClass('thumb-selected')
		},
		after: function(slider){
			var num = slider.currentSlide;
			if (num==slider.count) {
				var num = 0
			}
			var $li = jQuery('#imgSlider li'),
			$thumli=jQuery('#imagesTab .slides.thumbs li')
			$li.removeClass('ifs-active-slide')
			$li.eq(num).addClass('ifs-active-slide')
			$thumli.removeClass('thumb-selected')
			$thumli.eq(num).addClass('thumb-selected')
			$paentsUl=jQuery('#imagesTab .slides.thumbs li.thumb-selected').parents('ul')
			$siblingsli=$paentsUl.find('li').length
			var tar = Math.floor($paentsUl.find('li.thumb-selected').index()/5)
			$paentsUl.parents('.ifs').flexslider(tar);
		}
	});
});