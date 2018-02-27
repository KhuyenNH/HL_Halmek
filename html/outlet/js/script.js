;(function($){
$(function(){
	$('.on').hover(function(){
		$(this).attr('src',$(this).attr('src').replace('_off','_on'));
	},function(){
		$(this).attr('src',$(this).attr('src').replace('_on','_off'));
	});
});

$(function(){
	$('.tabpane li').click(function(){
	//.index()を使いクリックされたタブが何番目かを調べ、indexという変数に代入
		var index = $('.tabpane li').index(this);
		$('.content li').css('display','none');
		
		//クリックされたタブと同じ順番のコンテンツを表示します。
		$('.content li').eq(index).css('display','block');
		$('.tabpane li').removeClass('active');
		$(this).addClass('active')
	});
});
})(jQuery);