View.initPage = function(){
	$tr = jQuery("#anotherAddressTable > tbody > tr");
	$btn = jQuery("#addNewAddressBtn");
	//5件以上はボタンdisable
	if($tr.length>=5){
		$btn
		.tooltip({
			trigger:'hover'
			,html:true
			,placement:'top'
		})
		// .attr('disabled','disabled') //>これではmouse系イベントが発生しない？のでtooltipも出ない。
		.addClass('disabled')
		.on('click',jQuery.proxy(function(e){jQuery.preventDefault(e);return false;},this))
	}
};

View.hashchangePage = function(e){
};