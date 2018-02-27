  // 初期表示
  jQuery(document).ready(function(){
    var paramsArray = [];
	var url = location.href; 
    parameters = url.split("#");
    var defaultpannel = jQuery( '#defaultpannel' ).val();
    if( parameters.length > 1 ) {
        url = parameters[1];
    } else {
    	url = '';
    }
    
    if (url != '') {
    	openPannel(url);
    } else {
    	openPannel(defaultpannel);
    }
  });
  // 表示ブロックを指定
  function openPannel(panel) {
  
    if (panel == 'credit') {
    	jQuery("#credit").show();
	  	jQuery("#credit_pc").show();
	  	jQuery("#credit_sp").show();
	  	jQuery("#estimate_pc").hide();
	  	jQuery("#estimate_sp").hide();
	  	jQuery("#estimate_header").hide();
	  	jQuery("#estimate_sec_pc").hide();	
	  	jQuery("#estimate_sec_sp").hide();
    } else if (panel == 'estimate') {
    	jQuery("#credit").hide();
	  	jQuery("#credit_pc").hide();
	  	jQuery("#credit_sp").hide();
	  	jQuery("#estimate_pc").show();
	  	jQuery("#estimate_sp").show();
	  	jQuery("#estimate_header").show();
	  	jQuery("#estimate_sec_pc").show();  	
	  	jQuery("#estimate_sec_sp").show();
	}
	    jQuery('html,body').scrollTop(0);
    return false;
  }
