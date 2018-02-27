(function() {

jQuery(document).ready(function(){
    // �L�����y�[���K�p�\��
	jQuery("a.campaign_detail")
	.on("mouseover", function(){
		showBalloon(jQuery(this));
	})
	.on("mouseout", function(){
		jQuery(this).hideBalloon();
	});
});


/**
 * �o���[���ɂă��b�Z�[�W��\������B
 * �������F�o���[���\���Ώۗv�f
 * �������F�o���[���\�����b�Z�[�W
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
