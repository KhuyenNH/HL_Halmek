(function() {

jQuery(document).ready(function(){
    // キャンペーン適用表示
	jQuery("a.campaign_detail")
	.on("mouseover", function(){
		showBalloon(jQuery(this));
	})
	.on("mouseout", function(){
		jQuery(this).hideBalloon();
	});
});


/**
 * バルーンにてメッセージを表示する。
 * 第一引数：バルーン表示対象要素
 * 第二引数：バルーン表示メッセージ
 **/
function showBalloon(obj) {

    obj.showBalloon({
        contents: obj.attr("title"),
        classname: "balloons",
        showDuration: 0,
        hideDuration: 0,
        position: "bottom",
        offsetX: 0,
        css: {
            fontSize: "12px",
            minWidth: "150px",
            borderRadius: "0px;",
            backgroundColor: "#787878",
            color: "#fff",
            opacity: "1.0"
        }
    });

}


}());
