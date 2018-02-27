jQuery.noConflict();

jQuery("#hideButton").click(function() {
	jQuery("#switchObject").hide();
	jQuery.cookie("smartphoneBanner", "0", { expires: 365, path: '/' });
});

if (jQuery.cookie("smartphoneBanner") != "0") {
	jQuery("#switchObject").show();
}
