var r_btn = document.getElementById('sns_fg');
var r_mail = document.getElementById("mailInput").value;
var r_btn_sp = document.getElementById('sns_fg_sp');
var r_mail_sp = document.getElementById("mailInput_sp").value;
var sex = document.getElementsByName("sex");
for (i = 0; i < sex.length; i++) {
	if (sex[i].checked) {
		val = sex[i].value;
	}
}
if(val == "M"){
    r_btn.setAttribute('disabled', 'disabled');
    r_btn.checked = false;
    r_btn_sp.setAttribute('disabled', 'disabled');
    r_btn_sp.checked = false;
}

function rCheck(chkID) { //男女チェック1
	if(r_mail_sp.indexOf('halmek.jp') != -1){
		var num = 1;
	}else if(r_mail.indexOf('halmek.jp') != -1){
		var num = 1;
	}else{
		var num = 2;
	}
	if(num == 1){
        r_btn.removeAttribute('disabled');
        r_btn_sp.removeAttribute('disabled');
    }else if(chkID == '1'){
        r_btn.setAttribute('disabled', 'disabled');
        r_btn.checked = false;
        r_btn_sp.setAttribute('disabled', 'disabled');
        r_btn_sp.checked = false;
    } else {
        r_btn.removeAttribute('disabled');
        r_btn_sp.removeAttribute('disabled');
    }
}
function isRegNum(obj){ //メールチェック
    var str=obj.value;
    var r_btn = document.getElementById('sns_fg');
    var r_btn_sp = document.getElementById('sns_fg_sp');
	var r_chk = document.frmCustomer.sex_M.checked;
	var r_chk_sp = document.frmCustomer_sp.sex_sp_M.checked;
   if ( (str.indexOf('halmek.jp') == -1) && (r_chk_sp == true)) {
		r_btn_sp.setAttribute('disabled', 'disabled');
		r_btn_sp.checked = false;        
    }else if ( (str.indexOf('halmek.jp') == -1) && (r_chk == true)) {
		r_btn.setAttribute('disabled', 'disabled');
		r_btn.checked = false;        
    }else{
        r_btn.removeAttribute('disabled');
        r_btn_sp.removeAttribute('disabled');
    }
}
