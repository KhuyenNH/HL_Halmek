// fsImageWidth: �摜�̍ő啝
function initFlipsnap(fsImageWidth) {
	
	// �X���C�h�i�r�Q�[�V�����\��
	var fsPointer = jQuery('.fs_pointer');
	if (fsPointer.children().length < 2) {
		// �摜2�����Ȃ�X���C�h��\��
		return;
	}
	jQuery('.fs_control').show();

	// �Z���N�^
	var fsLine = '.etc_goodsimg_line_'; // �s�G���A
	var fsItem = '.etc_goodsimg_item_'; // �摜+�����G���A
	var fsImage = '.etc_goodsimg_item_ img'; // �摜
	
	// �J��Ԃ��e�v�f�ɕ���ݒ�
	jQuery('.fs_viewport').width(fsImageWidth);
	jQuery(fsLine).width(fsImageWidth * fsPointer.children().length);
	jQuery(fsItem).addClass('fs_item').width(fsImageWidth);
	
	// �ő卂����ݒ�
	var modHeight = 0;
	jQuery(fsImage).load(function() {
		
		// �摜+�����G���A���擾
		var item = jQuery(this).parent(fsItem); // �g��摜�Ȃ�
		if (!item) item = jQuery(this).parent().parent(fsItem); // �g��摜����
		
		// �摜�ƃR�����g�̍����̍��v���擾
		var itemHeight = 0;
		item.children().each(function() {
			itemHeight += jQuery(this).outerHeight();
		});
		
		if (modHeight < itemHeight) {
			modHeight = itemHeight;
			jQuery(fsItem).height(modHeight);
		}
	});
	
	
	// �摜�X���C�h�ݒ�
	var fs = Flipsnap(fsLine);
	var fsPrev = jQuery('.fs_prev').click(function() { fs.toPrev(); }); 
	var fsNext = jQuery('.fs_next').click(function() { fs.toNext(); });
	
	// �{�^���E�|�C���^�̏�����Ԃ�ݒ�
	fsPrev.attr('disabled', !fs.hasPrev());
	fsNext.attr('disabled', !fs.hasNext());
	
	// �X���C�h��
	fs.element.addEventListener('fspointmove', function() {
		// �{�^����ԍX�V
		fsNext.attr('disabled', !fs.hasNext());
		fsPrev.attr('disabled', !fs.hasPrev());
		
		// �|�C���^��ԍX�V
		fsPointer.children('.fs_pointer_current').removeClass('fs_pointer_current');
		fsPointer.children().eq(fs.currentPoint).addClass('fs_pointer_current');
	}, false);
	
}