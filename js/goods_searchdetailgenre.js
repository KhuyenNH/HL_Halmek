jQuery(".wrapper_ ul.genre_ li input:checkbox").click(function() {
    var maxchk = 20;
    var chkall = jQuery(".wrapper_ ul.genre_ li input:checkbox[checked]").size();
    var chksub = jQuery(".wrapper_ ul.genre_ li input:checkbox[id^=" + jQuery(this).attr("id") + "]").size();
    var unchksub = chksub - jQuery(".wrapper_ ul.genre_ li input:checked[id^=" + jQuery(this).attr("id") + "]").size();

    if ((chkall + unchksub) <= maxchk) {
        jQuery(".wrapper_ ul.genre_ li input:checkbox[id^=" + jQuery(this).prop("id") + "]").prop("checked", this.checked);
        return true;
    } else {
        alert("�W�������̑I���͍ő�" + maxchk + "�܂łƂȂ�܂�");
        return false;
    }
});