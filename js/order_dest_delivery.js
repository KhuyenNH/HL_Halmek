var need_point_list = "";
var not_need_point_list = "";
var need_tr2_flg = false;
var not_need_tr2_flg = false;

  // �����\��
  jQuery(document).ready(function(){
    // ���|�C���g�g�p�K�{�E�s���X�g�f�[�^�擾��
  	var need_point = "";
	var not_need_point = "";
	need_point = jQuery('#need_point').val();
	not_need_point = jQuery('#not_need_point').val();
	if(need_point != "") {
		need_point_list = need_point.split(',');
	}
	if(not_need_point != "") {
		not_need_point_list = not_need_point.split(',');
	}
	// �|�C���g�g�p�s���X�g�̑���̗L��
	for(var i=0 ; i< not_need_point_list.length ; i++) {
		if(not_need_point_list[i] == "2"){
			not_need_tr2_flg = true;
		}
	}
	// �|�C���g�g�p�K�{���X�g�̑���̗L��
	for(var i=0 ; i< need_point_list.length ; i++) {
		if(need_point_list[i] == "2"){
			need_tr2_flg = true;
		}
	}
	// ���|�C���g�g�p�K�{�E�s���X�g�f�[�^�擾��
	//toggle_method_r2_dest_open();    
    toggle_method_r2_gift_open();
    toggle_point_open();
    
    if((jQuery('#rules_regularly').val() == "true")) {
    	rules_regularly();
    }
    
    var paramsArray = [];
	var url = location.href; 
	var defaultpannel = jQuery( '#defaultpannel' ).val();
    parameters = url.split("#");
    
    if( parameters.length > 1 ) {
        url = parameters[1];
    } else {
    	url = '';
    }
    
    if (url != '') {
    	openPannel(url);
    } else {
    	openPannel(defaultpannel);
    }

    // �M�t�g�I����
	jQuery( '#deliveryForm input[name="string1"]:radio' ).change( function() {
		toggle_method_r2_gift(jQuery(this).val() , false);
		check_top_method();
	});
	jQuery( '#deliveryForm_sp input[name="string1"]:radio' ).change( function() {  
	    toggle_method_r2_gift(jQuery(this).val() , true);
	    check_top_method();
	});
    
	//�Љ�ғ��͂��J���{�^��
	var $ifBtn = jQuery('#openIntroducerFormBtn');
	var $ifBody = jQuery('#introducerFormBody');
	$ifBtn.on('click',jQuery.proxy(function(e){
		$ifBtn.hide();
		$ifBody.slideDown(720);
	},this));
	$ifBody.slideUp(0);
	if(jQuery('#introducerFormBody ul.error.error-box.small').size()) {
		$ifBtn.hide();
		$ifBody.slideDown(720);
	}
    
	// �|�C���g�I����
	jQuery( '#deliveryForm input[name="pointpay"]:radio' ).change( function() {
		toggle_point(false);
		check_top_method();
	});
	jQuery( '#deliveryForm_sp input[name="pointpay"]:radio' ).change( function() {  
	    toggle_point(true);
	    check_top_method();
	});
  });
    
    // ������� �\���E��\���̐؂�ւ� �M�t�g�I����
  function toggle_method_r2_gift(value , IsSp){
    var form_name = ""
    var sp = "";
    if ( IsSp ) {
    	form_name = "#deliveryForm_sp";
    	sp = "_sp";
    } else {
    	form_name = "#deliveryForm";
    }
  
    //�M�t�g�I�����u�͂��v�̂Ƃ�
    if( value == "�͂�" ){

		jQuery( '#method_tr2_Sp' ).hide();
		jQuery( '#method_tr2' ).hide();


    // �M�t�g�I�����u�������v�̂Ƃ�
    }else if( value == "������" ){
      if( jQuery(form_name + ' input[name="dest"]' ).val() == "0" ){
		
		if((need_tr2_flg && jQuery('#pointpay_0' + sp).prop('checked')) || (not_need_tr2_flg && jQuery('#pointpay_1' + sp).prop('checked') )) {
			jQuery( '#method_tr2_Sp' ).hide();
			jQuery( '#method_tr2' ).hide();
		}else {
			jQuery( '#method_tr2_Sp' ).show();
			jQuery( '#method_tr2' ).show();
		}
      } else {
		jQuery( '#method_tr2_Sp' ).hide();
		jQuery( '#method_tr2' ).hide();
      }
    }
  }

  // ������� �\���E��\���̐؂�ւ� ���͂���ύX��
  function toggle_method_r2_dest(value , IsSp){
    var form_name = ""
    if ( IsSp ) {
    	form_name = "#deliveryForm_sp";
    } else {
    	form_name = "#deliveryForm";
    }
    
    //����I�����ꂽ�Ƃ�
    if( value == "0" ){
      if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "�͂�" ){
      		if ( IsSp ) {
				jQuery( '#method_tr2_Sp' ).hide();
			} else {
				jQuery( '#method_tr2' ).hide();
			}      // �x�����@:���������\��
      } else {
			if ( IsSp ) {
				jQuery( '#method_tr2_Sp' ).show();
			} else {
				jQuery( '#method_tr2' ).show();
			}
      }
    }else{
      // �x�����@:����������\��
      jQuery( function(){ jQuery( form_name + ' input[name="method"]').each( function() {
   		if(jQuery(this).val() == "2"){
   			if ( IsSp ) {
      			jQuery( '#method_tr2_Sp' ).hide();
      		} else {
				jQuery( '#method_tr2' ).hide();
      		}	
   	    }
   	  });});
    }
  }
  // ������� �\���E��\���̐؂�ւ� �M�t�g�I����
  function toggle_method_r2_gift_open(){
    var form_name_sp = "#deliveryForm_sp";
   	var form_name = "#deliveryForm";
  
    //�M�t�g�I�����u�͂��v�̂Ƃ�
    if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "�͂�" ){
      // �x�����@:����������\��
      jQuery( '#method_tr2' ).hide();

    // �M�t�g�I�����u�������v�̂Ƃ�
    }else if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "������" ){
      // �x�����@:���������\��
      if( jQuery(form_name + ' input[name="dest"]' ).val() == "0" ){
	      jQuery( '#method_tr2' ).show();
      }
    }

    //�M�t�g�I�����u�͂��v�̂Ƃ��i�X�}�z�j
    if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "�͂�" ){
      // �x�����@:����������\��
      jQuery( '#method_tr2_Sp' ).hide();

    // �M�t�g�I�����u�������v�̂Ƃ�
    }else if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "������" ){
      // �x�����@:���������\��
      if( jQuery(form_name_sp + ' input[name="dest"]' ).val() == "0" ){
	      jQuery( '#method_tr2_Sp' ).show();
      }
    }
  }

  //���g�p
  // ������� �\���E��\���̐؂�ւ� ���͂���ύX��
  function toggle_method_r2_dest_open(){
    var form_name_sp = "#deliveryForm_sp";
   	var form_name = "#deliveryForm";
   	
    //����I�����ꂽ�Ƃ�
    if( jQuery(form_name + ' input[name="dest"]' ).val() == "0" ){
      // �x�����@:���������\��
      if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "�͂�" ){
      	jQuery( '#method_tr2' ).hide();
	      if( jQuery(form_name + ' input[name="method"]:eq(0)' ).val()  == "2" ){
	        // �x�����@:���������I������Ă����ꍇ�A�擪�̃v���_�E����I������
	        jQuery( form_name + ' input[name="method"]:eq(1)' ).parent().trigger("click");
	        jQuery( form_name + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
	      }else{
			jQuery( form_name + ' input[name="method"]:eq(0)').parent().trigger("click");
			jQuery( form_name + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
	      }
      } else {
      	jQuery( '#method_tr2' ).show();
      }
    }else{
      // �x�����@:����������\��
      jQuery( '#method_tr2' ).hide();
      if( jQuery(form_name + ' input[name="method"]:eq(0)' ).val()  == "2" ){
        // �x�����@:���������I������Ă����ꍇ�A�擪�̃v���_�E����I������
        jQuery( form_name + ' input[name="method"]:eq(1)' ).parent().trigger("click");
        jQuery( form_name + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
      }else{
		jQuery( form_name + ' input[name="method"]:eq(0)').parent().trigger("click");
		jQuery( form_name + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
      }
    }
    
    //����ȊO���I�����ꂽ�Ƃ��i�X�}�z�j
    if( jQuery(form_name_sp + ' input[name="dest"]' ).val() == "0" ){
      // �x�����@:���������\��
      if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "�͂�" ){
	      jQuery( '#method_tr2_Sp' ).hide();
	      if( jQuery(form_name_sp + ' input[name="method"]:eq(0)' ).val()  == "2" ){
	        // �x�����@:���������I������Ă����ꍇ�A�擪�̃v���_�E����I������
	        jQuery( form_name_sp + ' input[name="method"]:eq(1)' ).parent().trigger("click");
	        jQuery( form_name_sp + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
	      }else{
	        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().trigger("click");
	        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
	      }
	  } else {
	  	  jQuery( '#method_tr2_Sp' ).show();
      }
    }else{
      // �x�����@:����������\��
      jQuery( '#method_tr2_Sp' ).hide();
      if( jQuery(form_name_sp + ' input[name="method"]:eq(0)' ).val()  == "2" ){
        // �x�����@:���������I������Ă����ꍇ�A�擪�̃v���_�E����I������
        jQuery( form_name_sp + ' input[name="method"]:eq(1)' ).parent().trigger("click");
        jQuery( form_name_sp + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
      }else{
        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().trigger("click");
        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
      }
    }
  }
  
  // �\���u���b�N���w��
  function openPannel(panel) {
  
  //check_top_method()��2��ĂԕK�v������B�폜���ցB
  check_top_method();
  check_top_method();
  
    if (panel == 'address') {
    	jQuery("#dest_address").show();
	  	jQuery("#dest_address_sp").show();
	  	jQuery("#dest_list_block").hide();
	  	jQuery("#dest_list_block_sp").hide();
	  	jQuery("#other").hide();
	  	jQuery("#other_sp").hide();  	
	  	jQuery("#other_append").hide();
	  	jQuery("#other_append_sp").hide();
	    jQuery("#payment_block").hide();
	    jQuery("#payment_block_sp").hide();
    } else if (panel == 'dest_list') {
    	jQuery("#dest_address").hide();
	  	jQuery("#dest_address_sp").hide();
	  	jQuery("#dest_list_block").show();
	  	jQuery("#dest_list_block_sp").show();
	  	jQuery("#other").hide();
	  	jQuery("#other_sp").hide();
	  	jQuery("#other_append").hide();
	  	jQuery("#other_append_sp").hide();
	    jQuery("#payment_block").hide();
	    jQuery("#payment_block_sp").hide();
	} else if (panel == 'other') {
    	jQuery("#dest_address").hide();
	  	jQuery("#dest_address_sp").hide();
	  	jQuery("#dest_list_block").hide();
	  	jQuery("#dest_list_block_sp").hide();
	  	jQuery("#other").show();
	  	jQuery("#other_sp").show();
	  	View.onShown();
	  	jQuery("#other_append").hide();
	  	jQuery("#other_append_sp").hide();
	    jQuery("#payment_block").hide();
	    jQuery("#payment_block_sp").hide();
	} else if (panel == 'other_append') {
    	jQuery("#dest_address").hide();
	  	jQuery("#dest_address_sp").hide();
	  	jQuery("#dest_list_block").hide();
	  	jQuery("#dest_list_block_sp").hide();
	  	jQuery("#other").hide();
	  	jQuery("#other_sp").hide();
	  	jQuery("#other_append").show();
	  	jQuery("#other_append_sp").show();
	    jQuery("#payment_block").hide();
	    jQuery("#payment_block_sp").hide();
	} else if (panel == 'payment') {
    	jQuery("#dest_address").hide();
	  	jQuery("#dest_address_sp").hide();
	  	jQuery("#dest_list_block").hide();
	  	jQuery("#dest_list_block_sp").hide();
	  	jQuery("#other").hide();
	  	jQuery("#other_sp").hide();
	  	jQuery("#other_append").hide();
	  	jQuery("#other_append_sp").hide();
	    jQuery("#payment_block").show();
	    jQuery("#payment_block_sp").show();
    }
    jQuery('html,body').scrollTop(0);
    alertMessageClear();
    return false;
  }

  // ���͂���ǉ�
  function sendAddAddress(IsSp) {
  var dest = '';
  jQuery('#method_address_addActionForm input[name="dest"]').val(dest);
  
    if(IsSp){	//form submit(SP)
    	if(jQuery('#dest_address_sp').attr("style") != 'display: none;'){
    		jQuery('#method_address_addActionForm').submit();
    	}else{
    		if(jQuery('#dest_list_block_sp').attr("style") != 'display: none;'){
    		openPannel('other');
      	}else{checkintroducerData(IsSp);}
      		}
    }else{ 	//form submit(PC)
    	if(jQuery('#dest_address').attr("style") != 'display: none;'){
    		jQuery('#method_address_addActionForm').submit();
    	}else{
    		if(jQuery('#dest_list_block').attr("style") != 'display: none;'){
    		openPannel('other');
      			}else{checkintroducerData(IsSp);}
      				}
    }
    return false;
  }
  
  // ���͂���ύX
  function sendEditAddress(dest,IsSp) {
    
    //form submit
    if(IsSp){	//form submit(SP)
    	if(jQuery('#dest_address_sp').attr("style") != 'display: none;'){
    		jQuery('#method_address_addActionForm input[name="dest"]').val(dest);
   			document.method_address_addActionForm.submit();
    	}else{
    		if(jQuery('#dest_list_block_sp').attr("style") != 'display: none;'){
    		openPannel('other')
    			}else{checkintroducerData(IsSp);}
    				}
    }else{	//form submit(PC)
    	if(jQuery('#dest_address').attr("style") != 'display: none;'){
    		jQuery('#method_address_addActionForm input[name="dest"]').val(dest);
   			document.method_address_addActionForm.submit();
    	}else{
    		if(jQuery('#dest_list_block').attr("style") != 'display: none;'){
    		openPannel('other')
    			}else{checkintroducerData(IsSp);}
    				}
    }
    return false;
  }
  
  // �G���[���b�Z�[�W�N���A
  function alertMessageClear() {
  	jQuery('#customernumberplace_sp').empty();
	jQuery('#customernumberplace').empty();
	jQuery('#sales_append_sp').empty();
	jQuery('#sales_append').empty();
  }

  // ���̓`�F�b�N
  function checkData(IsSp) {
  
    var str_coupon = ""
    // �N�[�|���`�F�b�N
    // �S�p���������͂��ꂽ�ꍇ�A�A���[�g��\������
    if (IsSp === true) {
        if (jQuery('#coupon_sp').val()) {
            str_coupon = jQuery('#coupon_sp').val();
        }
    } else {
        if (jQuery('#coupon_pc').val()) {
            str_coupon = jQuery('#coupon_pc').val();
        }
    }

    for(var i=0; i<str_coupon.length; i++){
        /* 1�����������R�[�h���G�X�P�[�v���A���̒�����4�����ȏ�Ȃ�S�p */
        var len=escape(str_coupon.charAt(i)).length;
        if(len>=4){
            alert("�N�[�|���ԍ��͔��p�p�����݂̂ƂȂ�܂��B\n���͓��e���ēx���m�F���������B");
            return false;
        }
    }

    if (IsSp === true) {
        if (jQuery('#deliveryForm_sp input[name=string1]:eq(0)').prop('checked') || jQuery('#deliveryForm_sp input[name=string1]:eq(1)').prop('checked')) {
            if (jQuery('#allpoint_pay').val()=='true' && jQuery('#deliveryForm_sp input[name=pointpay]:eq(1)').prop('checked')) {
        		if (jQuery('#rules_regularly').val()=='true'){
        			openPannel('other_append');
				}else{
					jQuery("<input>", {type: 'hidden',name: 'submit.x',value: '1'}).appendTo('#deliveryForm_sp');
					jQuery('#deliveryForm_sp').submit();

				}
            	return true;
        	}else{
        		if (jQuery('#rules_regularly').val()=='true') {
        			openPannel('other_append');
        		}else{
    				openPannel('payment');
        		}
        	}	
			return false;
        } else {
            jQuery('#sales_append_sp').html("<ul class='error error-box small'  ><li>�u�M�t�g�E�v���[���g�Ƃ��đ���v�͕K�{�ł��B</li></ul>"); 
        }
    } else {
        if (jQuery('#deliveryForm input[name=string1]:eq(0)').prop('checked') || jQuery('#deliveryForm input[name=string1]:eq(1)').prop('checked')) {
	    	if (jQuery('#allpoint_pay').val()=='true' && jQuery('#deliveryForm input[name=pointpay]:eq(1)').prop('checked')) {
        		if (jQuery('#rules_regularly').val()=='true'){
        			openPannel('other_append');
				}else{
					jQuery("<input>", {type: 'hidden',name: 'submit.x',value: '1'}).appendTo('#deliveryForm');
					jQuery('#deliveryForm').submit();

				}
            	return true;
        	}else{
        		if (jQuery('#rules_regularly').val()=='true') {
        			openPannel('other_append');
        		}else{
    				openPannel('payment');
        		}
        	}
        		return true;
        } else {
            jQuery('#sales_append').html("<ul class='error error-box small'  ><li>�u�M�t�g�E�v���[���g�Ƃ��đ���v�͕K�{�ł��B</li></ul>"); 
        }
    }
    return false;
  }

  // ���͂���I��
  function setDest(dest) {
    jQuery("#dest").val(dest);   
    jQuery("#dest_sp").val(dest);
    
    toggle_method_r2_dest(jQuery("#dest").val() , false);
    toggle_method_r2_dest(jQuery("#dest_sp").val() , true);
    if (jQuery('#rules_regularly').val()=='true') {
    openPannel('other');
    }else{
      if (jQuery('#rules_freecatalog').val()=='true') {
      
      }else{
        openPannel('dest_list');
      }
    }
    return false;
  }

  // ���Љ�җl�̂��q�l�ԍ����̓`�F�b�N
  function checkintroducerData(IsSp) {
    if (IsSp === true) {
    	var str =jQuery('#customerNumberInput_sp').val();
	    if (str!=="" && str.length < 8 || 9 < str.length) {
	          jQuery('#customernumberplace_sp').html("<ul class='error error-box small'  ><li>�n�����N���q�l�ԍ����s���ł��B</li></ul>"); 
	          jQuery('.pagetop > a').trigger("click");
			return false;
	    }else{
	    	if (jQuery('#allpoint_pay').val()=='true' && jQuery('#deliveryForm_sp input[name=pointpay]:eq(1)').prop('checked')) {
    			jQuery("<input>", {type: 'hidden',name: 'submit.x',value: '1'}).appendTo('#deliveryForm_sp');
				jQuery('#deliveryForm_sp').submit();
			}else{	
	    		openPannel('payment');
	    	}
	    }
    } else {
    	var str =jQuery('#customerNumberInput').val();
	    if (str!=="" && str.length < 8 || 9 < str.length) {
	    	jQuery('#customernumberplace').html("<br><br><ul class='error error-box small'  ><li>�n�����N���q�l�ԍ����s���ł��B</li></ul>"); 
			jQuery('.pagetop > a').trigger("click");
			return false;
	    }else{
	    	if (jQuery('#allpoint_pay').val()=='true' && jQuery('#deliveryForm input[name=pointpay]:eq(1)').prop('checked')) {
    			jQuery("<input>", {type: 'hidden',name: 'submit.x',value: '1'}).appendTo('#deliveryForm');
				jQuery('#deliveryForm').submit();
			}else{	
	    		openPannel('payment');
	    	}
    	}	
  	}	
  	}	

	function toggle_point_open() {
		//PC
		// �|�C���g�u�g�p����v�̎�
		if(jQuery('#pointpay_1').prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i]).show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i]).hide();
			}
		}
		// �|�C���g�u�g�p���Ȃ��v�̎�
		if(jQuery('#pointpay_0').prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i]).show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i]).hide();
			}
		}
		if((jQuery('#deliveryForm input[name="string1"]:checked' ).val() == "�͂�" ) || ( jQuery('#deliveryForm input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2').hide();
		}
		
		//SP
		// �|�C���g�u�g�p����v�̎�
		if(jQuery('#pointpay_1_sp').prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + '_Sp').show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + '_Sp').hide();
			}
		}
		// �|�C���g�u�g�p���Ȃ��v�̎�
		if(jQuery('#pointpay_0_sp').prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + '_Sp').show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + '_Sp').hide();
			}
		}
		if((jQuery('#deliveryForm_sp input[name="string1"]:checked' ).val() == "�͂�" ) || ( jQuery('#deliveryForm_sp input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2_Sp').hide();
		}
	}
	
	// �|�C���g�I�����̎x�����@�I��
	function toggle_point(IsSp) {
		var sp = "";
		var l_sp = "";
		if ( IsSp ) {
			sp = "_sp";
			l_sp = "_Sp";
		}
		// �|�C���g�u�g�p����v�̎��i�ύX�O�̒l�����Ă��邽��toggle_point_open()�Ƃ͋t�̏����j
		if(jQuery('#pointpay_1' + sp).prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + l_sp).show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + l_sp).hide();
			}
		}
		
		// �|�C���g�u�g�p���Ȃ��v�̎��i�ύX�O�̒l�����Ă��邽��toggle_point_open()�Ƃ͋t�̏����j
		if(jQuery('#pointpay_0' + sp).prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + l_sp).show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + l_sp).hide();
			}
		}
		
		// �M�t�g�g�p�A�܂��͎���ȊO�̔z����̏ꍇ�A������B��
		if((jQuery('#deliveryForm' + sp + ' input[name="string1"]:checked' ).val() == "�͂�") || ( jQuery('#deliveryForm' + sp + ' input[name="dest"]' ).val() != "0" ) ) {
			jQuery('#method_tr2' + l_sp).hide();
		}
	}
	
	// ���p�\�Ȏx�����@�����ԏ���`�F�b�N����
	function check_top_method() {
		var length_pc = 0;
		var length_sp = 0;
		length_pc = jQuery('#deliveryForm input[name="method"]').length;
		length_sp = jQuery('#deliveryForm_sp input[name="method"]').length;
		for(var i=0 ; i< length_pc ; i++) {
			if(jQuery('#deliveryForm input[name="method"]').eq(i).parents('tr.table-selectable').css('display') != 'none') {
				jQuery('#deliveryForm input[name="method"]').eq(i).parent().trigger("click");
				jQuery('#deliveryForm input[name="method"]').eq(i).parent().css({backgroundPosition: '0 -36px'});
				break;
			}
		}
		for(var i=0 ; i< length_sp ; i++) {
			if(jQuery('#deliveryForm_sp input[name="method"]').eq(i).parents('div.checkout_form_wrap').css('display') != 'none') {
				jQuery('#deliveryForm_sp input[name="method"]').eq(i).parent().trigger("click");
				jQuery('#deliveryForm_sp input[name="method"]').eq(i).parent().css({backgroundPosition: '0 -36px'});
				break;
			}
		}
	}
	
	// �G�����i�Ń|�C���g�S�z�x�������́A�|�C���g�u�g�p���Ȃ��v
	function rules_regularly() {
		//PC
		// �|�C���g�u�g�p���Ȃ��v
		for(var i=0 ; i< not_need_point_list.length ; i++) {
			jQuery('#method_tr' + not_need_point_list[i]).show();
		}
		for(var i=0 ; i< need_point_list.length ; i++) {
			jQuery('#method_tr' + need_point_list[i]).hide();
		}
		if((jQuery('#deliveryForm input[name="string1"]:checked' ).val() == "�͂�" ) || ( jQuery('#deliveryForm input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2').hide();
		}
		
		//SP
		// �|�C���g�u�g�p���Ȃ��v
		for(var i=0 ; i< not_need_point_list.length ; i++) {
			jQuery('#method_tr' + not_need_point_list[i] + '_Sp').show();
		}
		for(var i=0 ; i< need_point_list.length ; i++) {
			jQuery('#method_tr' + need_point_list[i] + '_Sp').hide();
		}
		if((jQuery('#deliveryForm_sp input[name="string1"]:checked' ).val() == "�͂�" ) || ( jQuery('#deliveryForm_sp input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2_Sp').hide();
		}
	}

