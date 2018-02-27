function showNewCard(){
    jQuery('#newcard').show();
    jQuery('#keepcard').hide();
}

function hideNewCard(){
    jQuery('#newcard').hide();
    jQuery('#keepcard').show();
}

jQuery(document).ready(function(){
    jQuery(function(){
        jQuery("input[type=text]").keypress(function(ev) {
            if ((ev.which && ev.which === 13) || (ev.keyCode && ev.keyCode === 13)) {
                return false;
            } else {
                return true;
            }
        });
        jQuery("input[type=tel]").keypress(function(ev) {
            if ((ev.which && ev.which === 13) || (ev.keyCode && ev.keyCode === 13)) {
                return false;
            } else {
                return true;
            }
        });
    });
  
    if(jQuery('[name="selectcard"]:checked').val() == 'new')
    {
        showNewCard();
    }
});
