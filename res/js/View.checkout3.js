View.onShown = function(){
	
	/**
	 * SP��PC�ύX���́@�M�t�g���W�I�{�^�����̐����\���p�t���O
	 */
	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
	var pcload = 0;
	var spchange = 0;
	if (767 < win_width){
		pcload = 1;
	}
	/**
	 * �M�t�g���W�I�{�^�����̐���
	 */
	var $tooltipTarget = jQuery('#giftTooltipTarget'),
			$radios = jQuery('#string1_������,#string1_�͂�'),
			checked = false,
			$giftRow = $tooltipTarget.closest('tr'),
			errorMarginKlass = 'mb-g6'
	;
	$radios.each(jQuery.proxy(function(i,o) {
		if(jQuery(o).is(':checked')){
			checked = true;
			return false;
		}
	},this));
	if(!checked){
		//�`�F�b�N�������Ƃ��̂݁A�c�[���`�b�v�\��
		$tooltipTarget.tooltip('show');
		$radios.one('change',jQuery.proxy(function(){
			$tooltipTarget.tooltip('hide');
			jQuery('.radios',$giftRow).removeClass(errorMarginKlass);
		},this));
		//�G���[������ꍇ�A�������炷
		// if(jQuery('.error-box',$giftRow).text()){//
		if($giftRow.hasClass('error-bg')){
			jQuery('.radios',$giftRow).addClass(errorMarginKlass);
		}
	}

//�c�[���`�b�v�o���[���̕\���ʒu�̒���
jQuery(function(){

	var timer = false;
	jQuery(window).resize(function() {
		if (timer !== false) {
			clearTimeout(timer);
		}

	var win_width = window.innerWidth;
	if (!win_width) win_width = document.body.clientWidth;
		timer = setTimeout(function() {
			if (767 < win_width){
	
				/**-------------------------------------- */
				// �M�t�g���W�I�{�^�����̐���
				var $tooltipTarget = jQuery('#giftTooltipTarget'),
						$radios = jQuery('#string1_������,#string1_�͂�'),
						checked = false,
						$giftRow = $tooltipTarget.closest('tr'),
						errorMarginKlass = 'mb-g6'
				;
				$radios.each(jQuery.proxy(function(i,o) {
					if(jQuery(o).is(':checked')){
					checked = true;
					return false;
					}
				},this));
				if(!checked){
					//�`�F�b�N�������Ƃ��̂݁A�c�[���`�b�v�\��
					if(pcload == 0 && spchange == 0){
						$tooltipTarget.tooltip('show');
						pcload = 1;
						spchange = 1;
					}
						$radios.one('change',jQuery.proxy(function(){
						$tooltipTarget.tooltip('hide');
						jQuery('.radios',$giftRow).removeClass(errorMarginKlass);
					},this));
					//�G���[������ꍇ�A�������炷
					// if(jQuery('.error-box',$giftRow).text()){//
					if($giftRow.hasClass('error-bg')){
					jQuery('.radios',$giftRow).addClass(errorMarginKlass);
					}
				}
			/* --------------------------------------- */
			}
		}, 10);
	});
});

	// tableRowChecker
	jQuery('.table-selectable').on('click',function(e){
		jQuery.cancelBubble(e);
		jQuery(':radio',jQuery(this)).screwDefaultButtons("check");
	});
};

View.hashchangePage = function(e){
};


jQuery(document).ready(function(){
});
