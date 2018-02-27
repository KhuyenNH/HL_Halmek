jQuery(document).ready(function() {
	
	// �X�܍݌ɉ�ʂ֑J��
	jQuery("#store_goods_stock_link").bind("click keypress", function(event){
		
		if (event.type == "keypress") {
			// Enter�ȊO�ł͓�������Ȃ�
			if (event.which != 13) return;
		}
		
		// �����C�x���g�𖳌���
		event.preventDefault();
		
		// �����\�����̏��i�R�[�h�̐ݒ�
		var url = jQuery(this).attr("_href");
		var goods = jQuery("#hidden_goods").val();
		
		// �Z���N�g�{�b�N�X���珤�i�R�[�h�擾
		var variation = jQuery("select[name='goods']");
		if ( variation.length > 0 ) {
			if ( variation.val() ) {
				// �I������Ă��鏤�i�R�[�h
				goods = variation.val();
			} else {
				// �Z���N�g�{�b�N�X�ŏ�ʂ̏��i�R�[�h
				variation.find( "option" ).each(function() {
					if ( !jQuery(this).val() ) return true;
					goods = jQuery(this).val()
					return false;
				});
			}
		}
		
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += "goods=" + goods;
		
		location.href = url;
	});
	
	// ���i�ڍ׉�ʂ֑J��
	jQuery("#store_goods_back_link").bind("click keypress", function(event){
		
		if (event.type == "keypress") {
			// Enter�ȊO�ł͓�������Ȃ�
			if (event.which != 13) return;
		}
		
		// �����C�x���g�𖳌���
		event.preventDefault();
		
		// �{�^���ɖ��ߍ��܂ꂽURL�֑J��
		location.href = jQuery(this).attr("_href");;
	});
	
	// �X�܍݌ɂŃo���G�[�V������؂�ւ���
	jQuery("select[name='goods'].change_variation_").bind("change", function() {
		
		// ���݂�URL�i�N�G���Ȃ��j���擾
		var url = window.location.pathname
		
		// �I�����ꂽ���i�R�[�h��ǉ�
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += "goods=" + jQuery(this).val();
		
		location.href = url;
	});
});
