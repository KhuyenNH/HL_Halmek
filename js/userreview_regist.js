var PostURL = jQuery('#js_post_url').val();
var ImgPath = jQuery('#js_img_path').val();
var starSize = 12;
var mousePositionX = 0;
var starScore = 0;

jQuery(function() {
    jQuery('#star_select').mousemove(function(e) {
        mousePositionX = (e.pageX - jQuery(this).position().left);
        starScore = Math.ceil(mousePositionX / starSize);
        jQuery(this).css('background-position', -1 * (60 - (starScore * starSize)) + 'px -15px');
    }).mouseout(function() {
        jQuery(this).css('background-position', -1 * (60 - (jQuery("[name=score]").val() * starSize)) + 'px -15px');
    }).click(function() {
        jQuery("[name=score]").val(starScore);
    });
});

