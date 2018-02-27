/// <reference path="jquery.js" />

function deletebutton(id, backorder, del_backorder){
if(window.confirm("íœ‚µ‚Ä‚æ‚ë‚µ‚¢‚Å‚·‚©H")){
        updatedeletebackorder(id, backorder, del_backorder);
    }else{
       return false;
    }
}

function updatedeletebackorder(id, backorder, del_backorder) {
    var change_status = "";
    if (jQuery("#" + id).show()) {
        change_status = "0";
    }
    else {
        change_status = "D";
    }

    jQuery.ajax({
        url: "updatedeletebackorder.aspx",
        data: {
            backorder: backorder,
            del_backorder: del_backorder,
            status: change_status,
            crsirefo_hidden: jQuery("[name='crsirefo_hidden']").val()
        },
        dataType: "text",
        cache: false,
        success: function(data) {
        var return_val = data;
        if (return_val != ""){
        alert(return_val)
        }
        	location.reload(true)
        }
    });
}
