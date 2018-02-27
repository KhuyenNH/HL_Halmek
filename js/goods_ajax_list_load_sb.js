jQuery(document).ready(function() {
	
	var timer;           // Ajax���N�G�X�g�̃^�C�}�[�ϐ�
	var startAt;         // Ajax���N�G�X�g�̊J�n����
	var waitTime = 1000; // Ajax���ʏo�͂̑ҋ@���ԁi�ǂݍ��ݒ��摜���\�������ŏ����ԁj
	
	// �X�e�[�^�X���N���A
	var anchor = jQuery('#goods_list_auto_load');
	anchor.data('loading', false);
	anchor.data('autoload', true);
	
	// ���̃y�[�W�ԍ��������F2
	var page = jQuery('#goods_list_auto_load_form input[name=\'p\']');
	if (page && page.length > 0) page.val(2);
	
	// �X�N���[�����ɉ�ʈʒu���`�F�b�N
	// �����������Ŏ��y�[�W�ǂݍ��݂��Ȃ��Ƃ��ɃR�����g�A�E�g������
	jQuery(window).on('scroll', function() {
		
		// ���y�[�W�ǂݍ��ݒ��͏������Ȃ�
		if( anchor.data('loading') ) return;
		
		// �L�����Z�����Ă���Γǂݍ��܂Ȃ�
		if ( !anchor.data('autoload') ) return;
		
		// �E�B���h�E���ӂ��ꗗ�̖������z����ƋN��
		var windowBottom = jQuery(window).scrollTop() + jQuery(window).height();
		var anchorTop = anchor.offset().top;
		if (windowBottom > anchorTop) {
			loadGoodsList();
		}
	});
	// �����������Ŏ��y�[�W�ǂݍ��݂��Ȃ��Ƃ��ɃR�����g�A�E�g������
	
	// �{�^���F�ǂݍ��ݒ�
	jQuery('#goods_list_loading_button').on('click', function() {
		anchor.data('autoload', false);
		jQuery.removeData(anchor, 'result');
		if (timer) clearTimeout(timer);
		toggleLoadingButton();
	});
	
	// �{�^���F�Â�������
	jQuery('#goods_list_load_button').on('click', function() {
		jQuery.removeData(anchor, 'result');
		anchor.data('autoload', true);
		anchor.data('loading', false);
		loadGoodsList();
	});
	
	// ���y�[�W�ǂݍ���
	function loadGoodsList() {
		
		// ���łɓǍ����Ȃ璆�~
		if ( anchor.data('loading') ) return;
		anchor.data('loading', true);
		
		// ������ԁustart�v��ݒ�
		jQuery('#goods_list_auto_load_status').val('start').trigger('change');
		
		toggleLoadingButton();
		
		// Ajax�ǂݍ��݊J�n
		jQuery.ajax({
			url: EC_WWW_ROOT + '/shop/goods/listloadapi.aspx' + GetQueryString() ,
			async: true,
			cache: false,
			dataType: 'xml',
			beforeSend: function() {
				// Ajax���X�|���X�ҋ@�J�n
				startAt = (new Date()).getTime();
			}
		})
		.done(function(data) {
			anchor.data('result', data);
			
			// �c��̑ҋ@���Ԃ��v�Z
			var now = (new Date()).getTime();
			var timeout = waitTime + startAt - now;
			if (timeout < 0) timeout = 0;
			
			// �ҋ@���Ԍ�ɉ�ʂɒǉ�
			timer = setTimeout('appendResultContent()', timeout);
		})
		.fail(function(data) {
			toggleLoadingButton();
			alert('�Z�b�V�����̗L�����Ԃ�����܂����B\n' +
				'���ɋ������܂����ēx�g�b�v�y�[�W���̃A�N�Z�X�����肢�������܂��B\n\n' +
				'�����T�C�g�ł͂��q�l�̏��ی�̂��߁A��莞�Ԍo�ߌ�ɐڑ��������������Ă��������Ă���܂��B');
		})
		.always(function(data) { });
	}
	
	// �N�G���쐬���\�b�h
	function GetQueryString() {
		var query = '';
		jQuery('#goods_list_auto_load_form input[value!=\'\']').each(function() {
			query += (query.length > 0) ? '&' : '?';
			query += jQuery(this).attr('name');
			query += '=';
			query += jQuery(this).val();
		});
		return query;
	}
});

// �ǂݍ��ݒ�/�Â������� ��؂�ւ���
function toggleLoadingButton() {
	jQuery('#goods_list_loading_button').toggle();
	jQuery('#goods_list_load_button').toggle();
}

// Ajax�擾�f�[�^����ʂɒǉ�
function appendResultContent() {
	var anchor = jQuery('#goods_list_auto_load');
	if ( !anchor.data('autoload') ) return;
	
	// �擾����XML
	var result = jQuery( anchor.data('result') );
	
	// �G���[���擾�ˏ����I��
	if ( result.find('error').length > 0 ) {
		anchor.data('autoload', false);
		jQuery('#goods_list_loading_button').hide(); // ��\���F�u�Â�������v
		jQuery('#goods_list_load_button').hide();    // ��\���F�u�ǂݍ��ݒ��v
		jQuery.removeData(anchor, 'result');         // �L���b�V�����폜
		anchor.data('loading', false);               // �ǂݍ��ݒ��X�e�[�^�X��OFF
		jQuery('#goods_list_auto_load_status').val('end').trigger('change'); // ������ԁuend�v��ݒ�
		
		// �G���[���b�Z�[�W��\��
		var errorMessage = result.find('error').text();
		if ( errorMessage.length > 0 ) alert(errorMessage);
		
		return false;
	}
	
	// �ꗗ��HTML��ǉ�
	if ( result.find('body').length > 0 ) {
		var body = result.find('body').text();
		jQuery('#goods_list_auto_load_area .goods_list_wrapper_').append(body);
	}
	
	// [1�`*��] ���X�V
	if ( result.find('navipage').length > 0 ) {
		var navipage = result.find('navipage').text();
		jQuery('.navipage_range_').text(navipage);
	}
	
	// �ŏI�y�[�W��
	if ( result.find('lastpage').length > 0 ) {
		// ��\���F�u�Â�������v
		// ��\���F�u�ǂݍ��ݒ��v
		anchor.data('autoload', false);
		jQuery('#goods_list_loading_button').hide();
		jQuery('#goods_list_load_button').hide();
	} else {
		// �\���F�u�Â�������v
		// ��\���F�u�ǂݍ��ݒ��v
		toggleLoadingButton();
	}
	
	// �y�[�W�̔ԍ����J�E���g�A�b�v
	var page = jQuery('#goods_list_auto_load_form input[name=\'p\']');
	page.val( parseInt(page.val()) + 1 );
	
	// �L���b�V�����폜
	jQuery.removeData(anchor, 'result');
	
	// �ǂݍ��ݒ��X�e�[�^�X��OFF
	anchor.data('loading', false);
	
	// ������ԁuend�v��ݒ�
	jQuery('#goods_list_auto_load_status').val('end').trigger('change');
	
	// Google Analytics���L������
	if ( result.find('googleanalytics').length > 0) {
		// �y�[�W�{���𑗐M
		var pageURL = result.find('pageurl');
		if (ga && pageURL.length > 0) ga('send', 'pageview', pageURL.text());
	}
}
