jQuery(function(){
  var toggles = jQuery('.toggle a'),
      codes = jQuery('.code');
  
  toggles.on("click", function(event){
    event.preventDefault();
    var $this = jQuery(this);
    
    if (!$this.hasClass("active")) {
      toggles.removeClass("active");
      $this.addClass("active");
      codes.hide().filter(this.hash).show();
    }
  });
  toggles.first().click();
});