

function setPlaceholder(){

    // ブラウザがPlaceholderをサポートしている場合は、ブラウザの処理に任せる
    if (issupportPlaceholder())
    {
      jQuery("input[type='text']").each(function() {
         var titlevalue = jQuery(this).attr("title");
         if(titlevalue&&titlevalue != '') {
             jQuery(this).attr("placeholder", titlevalue);
         }
      });
      return;
    }

	jQuery("input[type='text']")
	.blur(function(){
		var inp=jQuery(this);
		var titlevalue = jQuery(this).attr("title");
		if(inp.val() == '' || inp.val()==titlevalue){
			inp.css('color', '#999')
			.val(titlevalue);
		}
	})
	.focus(function(){
		var inp=jQuery(this);
		var titlevalue = jQuery(this).attr("title");
		if(inp.val()==titlevalue){
			inp.val('');
			if(typeof(inp[0].selectionStart) != "undefined"){
				inp[0].selectionStart = 0;
			}
		}
		inp.css('color', '#000');
	}).blur();
}

function removePlaceholder() {
    // ブラウザがPlaceholderをサポートしている場合は、何も処理しない
    if (issupportPlaceholder())
    {
      return true;
    }

	var inp=jQuery("input[type='text']");
	for (var i = 0; i < inp.length; i = i + 1) {
		if(inp[i].value==inp[i].title){
			inp[i].value = '';
		}
	}

	return true;
}

function issupportPlaceholder(){
  var inputObj = jQuery("<input />")[0];
  return "placeholder" in inputObj;
}