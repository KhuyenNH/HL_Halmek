jQuery(function() {
    if ((jQuery('#pointpay_1').size() == 1)&&(jQuery('#pointpay_1')[0].checked)) {
        jQuery('#pointpay_num').readOnly = "";
        jQuery('#pointpay_num').css("backgroundColor", "#ffffff");
    }
});

function focus_UsePointNum() {
    if (document.getElementById('pointpay_0') != null) {
        if (document.getElementById('pointpay_0').checked) {
            document.getElementById('pointpay_num').blur();
        }
    }
}

function click_UsePointRadio() {
    if (document.getElementById('pointpay_0') != null) {
        if (document.getElementById('pointpay_0').checked) {
            document.getElementById('pointpay_num').style.backgroundColor = "#dedede";
            document.getElementById('pointpay_num').readOnly = "readonly";
        }
    }

    if (document.getElementById('pointpay_1') != null) {
        if (document.getElementById('pointpay_1').checked) {
            document.getElementById('pointpay_num').style.backgroundColor = "#ffffff";
            document.getElementById('pointpay_num').readOnly = "";
        }
    }
}