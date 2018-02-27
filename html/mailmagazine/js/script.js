var escapeflag;
	jQuery(function() {
	var escapeflag;
		if (!escapeflag){
			jQuery('.tabpane li').click(function(){
				//.index()を使いクリックされたタブが何番目かを調べ、indexという変数に代入
				var index = jQuery('.tabpane li').index(this);
				jQuery('.content li').css('display','none');
		
				//クリックされたタブと同じ順番のコンテンツを表示します。
				jQuery('.content li').eq(index).css('display','block');
				jQuery('.tabpane li').removeClass('active');
				jQuery(this).addClass('active')
			});
		}
	});

jQuery(function(){
	//jQuery("#slideBox2_sp").css("display","none");
	//jQuery("#slideBox2_sp").hide();
	if (!escapeflag){
		jQuery(".slidebtnMagazine").on("click", function() {
		jQuery("#slidebtnMagazine").slideToggle(800, 'swing');
		});
	}
});

jQuery(function(){
	jQuery("button.close").on("click", function() {
	jQuery("#slidebtnMagazine").slideUp(800, 'swing');
	});
});
