jQuery(function($){
  $('a[href^="#"]').on('click', function(){
    var speed = 400;
    var href= $(this).attr('href');
    var target = $(href == '#' || href == '' ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
});


function navigation(){
	var $elem = $(".nav_outer"), //表示の操作をするオブジェクト(フッター)
	$content = $("#nav"), //表示を変更する基準となるオブジェクト
	$win = $(window); //windowオブジェクト
	
	var contentTop = 0; //表示変更をする基準点
	$win
		.load(function(){
				 updatePosition();
				 update();
		})
		.resize(function(){
				 updatePosition();
				 update();
		})
		.scroll(function(){
				 update();
		});
	// HTMLが動的に変わることを考えて、contentTopを最新の状態に更新します
	function updatePosition(){
		contentTop = $content.offset().top + $elem.outerHeight();
	}
	// スクロールのたびにチェック
	function update(){
		// 現在のスクロール位置 + 画面の高さで画面下の位置を求めます
		if( $win.scrollTop() + $win.height() > contentTop ){
			$elem.addClass("static");
		}else if( $elem.hasClass("static") ){
			$elem.removeClass("static");
		}
	}
}
function roll_over(){
	/* roll over */
	$(document).on('mouseenter','.imgover',function(){
		$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
	});
	$(document).on('mouseleave','.imgover',function(){
		$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
	});
}
function smooth_scroll(){
	/* smooth scroll */
	$("a[href^=#]").click(function(){
		var Hash = $(this.hash);
		var HashOffset = $(Hash).offset().top;
		$("html,body").animate({ scrollTop: HashOffset}, 'slow','swing');
		return false;
	});
}

$(function(){
	roll_over();
	navigation();
	smooth_scroll();
	/*lazyload*/
	$('.lazy, .bgLoad').lazyload({
		threshold: 250,
		effect: 'fadeIn',
		effectspeed: 800
	});
	/*
	$("a.colorbox").colorbox({
		returnFocus: false
	});
	*/
	$('a.swipe').photoSwipe({
		hideAnimationDuration:0,
		showAnimationDuration:0,
		animationDuration:0
	});
});

  $('#map_secret').mapster({
    singleSelect : true,
    clickNavigate : true,
    render_highlight : { altImage : '/img/event/3/117021_pc_02_on.jpg' },
    mapKey: 'region',
    fillOpacity : 1
  });
    $('#map_item').mapster({
    singleSelect : true,
    clickNavigate : true,
    render_highlight : { altImage : '/img/event/3/117021_pc_03_on.jpg' },
    mapKey: 'region',
    fillOpacity : 1
  });
    $('#map_bihaku').mapster({
    singleSelect : true,
    clickNavigate : true,
    render_highlight : { altImage : '/img/event/3/117032_pc_02_on.jpg' },
    mapKey: 'region',
    fillOpacity : 1
  });
    
  