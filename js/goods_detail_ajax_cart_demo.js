var goods_detail_ajax_cart_ready = function(){
    var s_width = 60;
    var l_width = 200;

    if (document.URL.match("cart.aspx")) {
        return false;
    }
    var $btn_cart = jQuery(".btn btn-orange btn-large inner-icon-m2 btn_cart_l_");

    //AddCart�I���W�i��
    var addCartOriginal = function(goodscode_, obj, detail) {
        jQuery.ajaxSetup({ cache: false });
        var qty = 1
        var spec = ""
        var cref = ""
        var $btn_cart = obj;
        if (detail) { //�ڍׂ̏ꍇ�́A�o���G�[�V����������Ώ��i�R�[�h��ς���
        /*
            if (document.getElementById('variationselect') != null) {
                goods = jQuery('#variationselect').val();
            }
        */    
            if (document.getElementsByName('qty').length > 0) { //���ʂ��擾
                qty = jQuery('select[name="_qtySelect"]').val();
            }
        }
        /*
        if (jQuery('#error_size').length > 0){
        jQuery('#error_size').remove();
        }
         */            
        jQuery.ajax({
            async: true,
            type: "POST",
            url: EC_WWW_ROOT + "/res/json/addcart.json",
            contentType:"application/x-www-form-urlencoded; charset=utf-8",
            data: {
                "goods": goodscode_,
                "crsirefo_hidden": js_crsirefo,
                "qty": qty,
                "spec": spec,
                "cref": cref
            },
            cache: false,
            ifModified: false,
            dataType: "text",
            success: function(msg) {
                //�G���[���Ԃ��Ă����Ƃ��i�J�[�g�ɓ�����Ȃ����i�j
                //�u�S�p�������������܂��i���p�J�^�J�i�܂ށj�v����ȊO�̃G���[�����͑ΏۂɂȂ�܂���
                if (msg.match(/[^\x01-\x7E]/)) {
    				msg = msg.substring(msg.indexOf("[") + 2 ,msg.indexOf("]") - 1 );
                    if (jQuery("#jscart_replace_").length > 0) {
                                jQuery("#jscart_replace_").load(EC_WWW_ROOT + "/res/json/modalcart.json?msg=" + msg, function (){ return true;});
                	}
                }else{
        			if (jQuery("#jscart_replace_").length > 0) {
        					//naviplus�r�[�R������(�J�[�g����)
    						if(
    							typeof __snahost !== 'undefined' &&
    							typeof NP_VARS === 'object' &&
    							NP_VARS.key &&
    							typeof recoConstructer === 'function'
    						){
    							var o = {
    							k:NP_VARS.key,
    							uid:NP_VARS.user_id || void(0),
    							bcon:{
    								heavy:{
    									items:[{id:jQuery('#hidden_variation_group').val()}]
    								}
    							}
    							};
    						if(!NP_VARS.user_id) delete o.uid;
    						jQuery.log('naviplus�r�[�R������',o);
    						View.DocWriteSwitcher.attach();
    						recoConstructer(o);
    						View.DocWriteSwitcher.detach();
    						}
        			
                                jQuery("#jscart_replace_").load(EC_WWW_ROOT + "/res/json/modalcart.json?goods=" + goodscode_, function (){ return true;});
                	}
                	if (jQuery("div.cart-body div.elm02").length > 0) {
                		jQuery("div.cart-body div.elm02").empty();
                		/* 2016.03.11  kobayayo �s��Ή��F#10276 */
                		jQuery("div.cart-body div.elm02").load(EC_WWW_ROOT + '/res/json/cart.json' , 'div.cart-body div.elm02');
                		jQuery("#cart_list").load(EC_WWW_ROOT + '/res/json/cart.json' , '#cart_list');
                	}
                }	
                if (jQuery("select[name='_qtySelect']").length > 0) {
                	 	jQuery("select[name='_qtySelect']").load(EC_WWW_ROOT + "/res/json/getstockqtyutil.json?goods=" + goodscode_, function (){ return true;});
                }

            },
            error: function(xhr, status, thrown) {
                alert("�Z�b�V�����̗L�����Ԃ�����܂����B\n" +
                    "���ɋ������܂����ēx�g�b�v�y�[�W���̃A�N�Z�X�����肢�������܂��B\n\n" +
                    "�����T�C�g�ł͂��q�l�̏��ی�̂��߁A��莞�Ԍo�ߌ�ɐڑ��������������Ă��������Ă���܂��B");
            }
        });
    }
       // �J�[�g�ǉ�(���i�ڍ�)
		jQuery('.btn_cart_l_').on('click', function() {
		if (no_colorsize != '') {
			addCartOriginal(no_colorsize, jQuery(this), true);
		}else {
			addCartOriginal(goodscode_, jQuery(this), true);
		}
		 return true;
		});
        
        return false;
  
};

jQuery(document).ready(function () {
  goods_detail_ajax_cart_ready();
});