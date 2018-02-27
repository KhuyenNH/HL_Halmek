var need_point_list = "";
var not_need_point_list = "";
var need_tr2_flg = false;
var not_need_tr2_flg = false;

  // 初期表示
  jQuery(document).ready(function(){
    // ▼ポイント使用必須・不可リストデータ取得▼
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
	// ポイント使用不可リストの代引の有無
	for(var i=0 ; i< not_need_point_list.length ; i++) {
		if(not_need_point_list[i] == "2"){
			not_need_tr2_flg = true;
		}
	}
	// ポイント使用必須リストの代引の有無
	for(var i=0 ; i< need_point_list.length ; i++) {
		if(need_point_list[i] == "2"){
			need_tr2_flg = true;
		}
	}
	// ▲ポイント使用必須・不可リストデータ取得▲
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

    // ギフト選択時
	jQuery( '#deliveryForm input[name="string1"]:radio' ).change( function() {
		toggle_method_r2_gift(jQuery(this).val() , false);
		check_top_method();
	});
	jQuery( '#deliveryForm_sp input[name="string1"]:radio' ).change( function() {  
	    toggle_method_r2_gift(jQuery(this).val() , true);
	    check_top_method();
	});
    
	//紹介者入力を開くボタン
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
    
	// ポイント選択時
	jQuery( '#deliveryForm input[name="pointpay"]:radio' ).change( function() {
		toggle_point(false);
		check_top_method();
	});
	jQuery( '#deliveryForm_sp input[name="pointpay"]:radio' ).change( function() {  
	    toggle_point(true);
	    check_top_method();
	});
  });
    
    // 代金引換 表示・非表示の切り替え ギフト選択時
  function toggle_method_r2_gift(value , IsSp){
    var form_name = ""
    var sp = "";
    if ( IsSp ) {
    	form_name = "#deliveryForm_sp";
    	sp = "_sp";
    } else {
    	form_name = "#deliveryForm";
    }
  
    //ギフト選択が「はい」のとき
    if( value == "はい" ){

		jQuery( '#method_tr2_Sp' ).hide();
		jQuery( '#method_tr2' ).hide();


    // ギフト選択が「いいえ」のとき
    }else if( value == "いいえ" ){
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

  // 代金引換 表示・非表示の切り替え お届け先変更時
  function toggle_method_r2_dest(value , IsSp){
    var form_name = ""
    if ( IsSp ) {
    	form_name = "#deliveryForm_sp";
    } else {
    	form_name = "#deliveryForm";
    }
    
    //自宅が選択されたとき
    if( value == "0" ){
      if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "はい" ){
      		if ( IsSp ) {
				jQuery( '#method_tr2_Sp' ).hide();
			} else {
				jQuery( '#method_tr2' ).hide();
			}      // 支払方法:代金引換を表示
      } else {
			if ( IsSp ) {
				jQuery( '#method_tr2_Sp' ).show();
			} else {
				jQuery( '#method_tr2' ).show();
			}
      }
    }else{
      // 支払方法:代金引換を非表示
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
  // 代金引換 表示・非表示の切り替え ギフト選択時
  function toggle_method_r2_gift_open(){
    var form_name_sp = "#deliveryForm_sp";
   	var form_name = "#deliveryForm";
  
    //ギフト選択が「はい」のとき
    if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "はい" ){
      // 支払方法:代金引換を非表示
      jQuery( '#method_tr2' ).hide();

    // ギフト選択が「いいえ」のとき
    }else if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "いいえ" ){
      // 支払方法:代金引換を表示
      if( jQuery(form_name + ' input[name="dest"]' ).val() == "0" ){
	      jQuery( '#method_tr2' ).show();
      }
    }

    //ギフト選択が「はい」のとき（スマホ）
    if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "はい" ){
      // 支払方法:代金引換を非表示
      jQuery( '#method_tr2_Sp' ).hide();

    // ギフト選択が「いいえ」のとき
    }else if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "いいえ" ){
      // 支払方法:代金引換を表示
      if( jQuery(form_name_sp + ' input[name="dest"]' ).val() == "0" ){
	      jQuery( '#method_tr2_Sp' ).show();
      }
    }
  }

  //未使用
  // 代金引換 表示・非表示の切り替え お届け先変更時
  function toggle_method_r2_dest_open(){
    var form_name_sp = "#deliveryForm_sp";
   	var form_name = "#deliveryForm";
   	
    //自宅が選択されたとき
    if( jQuery(form_name + ' input[name="dest"]' ).val() == "0" ){
      // 支払方法:代金引換を表示
      if( jQuery(form_name + ' input[name="string1"]:checked' ).val() == "はい" ){
      	jQuery( '#method_tr2' ).hide();
	      if( jQuery(form_name + ' input[name="method"]:eq(0)' ).val()  == "2" ){
	        // 支払方法:代金引換を選択されていた場合、先頭のプルダウンを選択する
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
      // 支払方法:代金引換を非表示
      jQuery( '#method_tr2' ).hide();
      if( jQuery(form_name + ' input[name="method"]:eq(0)' ).val()  == "2" ){
        // 支払方法:代金引換を選択されていた場合、先頭のプルダウンを選択する
        jQuery( form_name + ' input[name="method"]:eq(1)' ).parent().trigger("click");
        jQuery( form_name + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
      }else{
		jQuery( form_name + ' input[name="method"]:eq(0)').parent().trigger("click");
		jQuery( form_name + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
      }
    }
    
    //自宅以外が選択されたとき（スマホ）
    if( jQuery(form_name_sp + ' input[name="dest"]' ).val() == "0" ){
      // 支払方法:代金引換を表示
      if( jQuery(form_name_sp + ' input[name="string1"]:checked' ).val() == "はい" ){
	      jQuery( '#method_tr2_Sp' ).hide();
	      if( jQuery(form_name_sp + ' input[name="method"]:eq(0)' ).val()  == "2" ){
	        // 支払方法:代金引換を選択されていた場合、先頭のプルダウンを選択する
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
      // 支払方法:代金引換を非表示
      jQuery( '#method_tr2_Sp' ).hide();
      if( jQuery(form_name_sp + ' input[name="method"]:eq(0)' ).val()  == "2" ){
        // 支払方法:代金引換を選択されていた場合、先頭のプルダウンを選択する
        jQuery( form_name_sp + ' input[name="method"]:eq(1)' ).parent().trigger("click");
        jQuery( form_name_sp + ' input[name="method"]:eq(1)').parent().css({backgroundPosition: '0 -36px'});
      }else{
        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().trigger("click");
        jQuery( form_name_sp + ' input[name="method"]:eq(0)').parent().css({backgroundPosition: '0 -36px'});
      }
    }
  }
  
  // 表示ブロックを指定
  function openPannel(panel) {
  
  //check_top_method()を2回呼ぶ必要がある。削除厳禁。
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

  // お届け先追加
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
  
  // お届け先変更
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
  
  // エラーメッセージクリア
  function alertMessageClear() {
  	jQuery('#customernumberplace_sp').empty();
	jQuery('#customernumberplace').empty();
	jQuery('#sales_append_sp').empty();
	jQuery('#sales_append').empty();
  }

  // 入力チェック
  function checkData(IsSp) {
  
    var str_coupon = ""
    // クーポンチェック
    // 全角文字が入力された場合、アラートを表示する
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
        /* 1文字ずつ文字コードをエスケープし、その長さが4文字以上なら全角 */
        var len=escape(str_coupon.charAt(i)).length;
        if(len>=4){
            alert("クーポン番号は半角英数字のみとなります。\n入力内容を再度ご確認ください。");
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
            jQuery('#sales_append_sp').html("<ul class='error error-box small'  ><li>「ギフト・プレゼントとして送る」は必須です。</li></ul>"); 
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
            jQuery('#sales_append').html("<ul class='error error-box small'  ><li>「ギフト・プレゼントとして送る」は必須です。</li></ul>"); 
        }
    }
    return false;
  }

  // お届け先選択
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

  // ご紹介者様のお客様番号入力チェック
  function checkintroducerData(IsSp) {
    if (IsSp === true) {
    	var str =jQuery('#customerNumberInput_sp').val();
	    if (str!=="" && str.length < 8 || 9 < str.length) {
	          jQuery('#customernumberplace_sp').html("<ul class='error error-box small'  ><li>ハルメクお客様番号が不正です。</li></ul>"); 
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
	    	jQuery('#customernumberplace').html("<br><br><ul class='error error-box small'  ><li>ハルメクお客様番号が不正です。</li></ul>"); 
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
		// ポイント「使用する」の時
		if(jQuery('#pointpay_1').prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i]).show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i]).hide();
			}
		}
		// ポイント「使用しない」の時
		if(jQuery('#pointpay_0').prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i]).show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i]).hide();
			}
		}
		if((jQuery('#deliveryForm input[name="string1"]:checked' ).val() == "はい" ) || ( jQuery('#deliveryForm input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2').hide();
		}
		
		//SP
		// ポイント「使用する」の時
		if(jQuery('#pointpay_1_sp').prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + '_Sp').show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + '_Sp').hide();
			}
		}
		// ポイント「使用しない」の時
		if(jQuery('#pointpay_0_sp').prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + '_Sp').show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + '_Sp').hide();
			}
		}
		if((jQuery('#deliveryForm_sp input[name="string1"]:checked' ).val() == "はい" ) || ( jQuery('#deliveryForm_sp input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2_Sp').hide();
		}
	}
	
	// ポイント選択時の支払方法選別
	function toggle_point(IsSp) {
		var sp = "";
		var l_sp = "";
		if ( IsSp ) {
			sp = "_sp";
			l_sp = "_Sp";
		}
		// ポイント「使用する」の時（変更前の値を見ているためtoggle_point_open()とは逆の処理）
		if(jQuery('#pointpay_1' + sp).prop('checked')) {
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + l_sp).show();
			}
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + l_sp).hide();
			}
		}
		
		// ポイント「使用しない」の時（変更前の値を見ているためtoggle_point_open()とは逆の処理）
		if(jQuery('#pointpay_0' + sp).prop('checked')) {
			for(var i=0 ; i< need_point_list.length ; i++) {
				jQuery('#method_tr' + need_point_list[i] + l_sp).show();
			}
			for(var i=0 ; i< not_need_point_list.length ; i++) {
				jQuery('#method_tr' + not_need_point_list[i] + l_sp).hide();
			}
		}
		
		// ギフト使用、または自宅以外の配送先の場合、代引を隠す
		if((jQuery('#deliveryForm' + sp + ' input[name="string1"]:checked' ).val() == "はい") || ( jQuery('#deliveryForm' + sp + ' input[name="dest"]' ).val() != "0" ) ) {
			jQuery('#method_tr2' + l_sp).hide();
		}
	}
	
	// 利用可能な支払方法から一番上をチェックする
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
	
	// 雑誌商品でポイント全額支払い時は、ポイント「使用しない」
	function rules_regularly() {
		//PC
		// ポイント「使用しない」
		for(var i=0 ; i< not_need_point_list.length ; i++) {
			jQuery('#method_tr' + not_need_point_list[i]).show();
		}
		for(var i=0 ; i< need_point_list.length ; i++) {
			jQuery('#method_tr' + need_point_list[i]).hide();
		}
		if((jQuery('#deliveryForm input[name="string1"]:checked' ).val() == "はい" ) || ( jQuery('#deliveryForm input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2').hide();
		}
		
		//SP
		// ポイント「使用しない」
		for(var i=0 ; i< not_need_point_list.length ; i++) {
			jQuery('#method_tr' + not_need_point_list[i] + '_Sp').show();
		}
		for(var i=0 ; i< need_point_list.length ; i++) {
			jQuery('#method_tr' + need_point_list[i] + '_Sp').hide();
		}
		if((jQuery('#deliveryForm_sp input[name="string1"]:checked' ).val() == "はい" ) || ( jQuery('#deliveryForm_sp input[name="dest"]' ).val() != "0" )){
			jQuery('#method_tr2_Sp').hide();
		}
	}

