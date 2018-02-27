jQuery(document).ready(function(){
	jQuery('select[name=yy_birth]').on('change', function() {
		SearchCustomer();
	});
	
	jQuery('select[name=mm_birth]').on('change', function() {
		SearchCustomer();
	});

	jQuery('select[name=dd_birth]').on('change', function() {
		SearchCustomer();
	});
	
	jQuery('input[name=name]').change(function() {
		SearchCustomer();
	});	
	
	jQuery('input[name=name2]').change(function() {
		SearchCustomer();
	});	

	jQuery('input[name=mail]').change(function() {
		SearchCustomer();
	});
	
	
});

//会員検索
function existsCustomer(name, name2, mail, yy_birth, mm_birth, dd_birth) {

	jQuery.ajax({
		type: "POST",
		url: EC_WWW_ROOT + "/shop/search/searchcustomer.aspx",
		data: { "name": name, "name2": name2, "mail": mail, "yy_birth": yy_birth, "mm_birth": mm_birth, "dd_birth": dd_birth },
		cache: false,
		dataType: "json",
		async: true,
		ifModified: false,
		success: function (rslt) {
			if(rslt){
				jQuery('#existsmsg_').css("display", "block");
			}else{
				removemsg();
			}
		},
		error: function (xhr, status, thrown) {
			removemsg();
		}
	});
}

function SearchCustomer() {
	var name = jQuery('input[name=name]').val();
	var name2 = jQuery('input[name=name2]').val();
	var mail = jQuery('input[name=mail]').val();
	var yy_birth = jQuery('select[name=yy_birth]').val();
	var mm_birth = jQuery('select[name=mm_birth]').val();
	var dd_birth = jQuery('select[name=dd_birth]').val();

	if(name == ''){
		removemsg();
		return true;
	}
	
	if(name2 == ''){
		removemsg();
		return true;
	}
	
	if(mail == ''){
		removemsg();
		return true;
	}
	
	if(yy_birth == ''){
		removemsg();
		return true;
	}

	if(mm_birth == ''){
		removemsg();
		return true;
	}
	
	if(dd_birth == ''){
		removemsg();
		return true;
	}
	
	existsCustomer(name, name2, mail, yy_birth, mm_birth, dd_birth);
	return true;
}

//メッセージ非表示
function removemsg() {
	jQuery('#existsmsg_').css("display", "none");
}
