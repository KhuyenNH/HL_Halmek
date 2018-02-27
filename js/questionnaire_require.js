/// <reference path="jquery.js"/>

jQuery(function() {
	changeView();
	jQuery("input[type=checkbox]").change(function(){changeView();});
	jQuery("select").change(function(){changeView();});
	jQuery("input[type=radio]").change(function(){changeView();});
});

function changeView() {

	jQuery(".option_").hide();
	jQuery("input[type=checkbox]").each(function(){
		if (jQuery(this).is(":checked")) {
			var name =this.name +'_' + this.value;
			jQuery("."+name).show();
		}
	});

	jQuery("select").each(function(){
		var name =this.name +'_' + this.value;
		jQuery("."+name).show();
	});
	
	jQuery("input[type=radio]").each(function(){
		if (jQuery(this).is(":checked")) {
			var name =this.name +'_' + this.value;
			jQuery("."+name).show();
		}
	});

}	
