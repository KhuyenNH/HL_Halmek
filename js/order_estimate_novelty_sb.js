(function() {

jQuery(document).ready(function(){
    // キャンペーン適用表示
	jQuery("#campaign_detail").on("click", function(){
		showBalloon("#campaign_detail", jQuery("#campaign_detail").attr("title"));
	});
});


/**
 * バルーンにてメッセージを表示する。
 * 第一引数：バルーン表示対象要素
 * 第二引数：バルーン表示メッセージ
 **/
function showBalloon(obj, msg) {

    jQuery(obj).showBalloon({
        contents: msg,
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

    setTimeout(function() {
        jQuery(obj).hideBalloon();
    }, 4000); // バルーン表示時間
}


}());
