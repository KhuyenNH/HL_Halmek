(function() {

jQuery(document).ready(function(){
    // �L�����y�[���K�p�\��
	jQuery("#campaign_detail").on("click", function(){
		showBalloon("#campaign_detail", jQuery("#campaign_detail").attr("title"));
	});
});


/**
 * �o���[���ɂă��b�Z�[�W��\������B
 * �������F�o���[���\���Ώۗv�f
 * �������F�o���[���\�����b�Z�[�W
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
    }, 4000); // �o���[���\������
}


}());
