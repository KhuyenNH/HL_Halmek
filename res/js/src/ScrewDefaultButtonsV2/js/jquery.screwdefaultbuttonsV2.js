/*!
 * ScrewDefaultButtons v2.0.4
 * http://screwdefaultbuttons.com/
 *
 * Licensed under the MIT license.
 * Copyright 2012 Matt Solano http://mattsolano.com
 *
 * Date: Tue October 2 2012 
 */

;(function( $, window, document, undefined ){ 
	
	var methods = {
		
	    init : function(options) {
	    
	    	var defaults = jQuery.extend( {
	    	      image:	null,
	    	      width:	50,
	    	      height:	50,
	    	      disabled:	false		
	    	    }, options);
			
			return this.each(function(){
			
		    	var $this = jQuery(this);
		    	
		    	var $thisImage = defaults.image;
		    	var dataImage = $this.data('sdb-image');
		    	if (dataImage){
		    		$thisImage = dataImage;
		    	}
		    	
		    	if (!$thisImage){
		    		 jQuery.error( 'There is no image assigned for ScrewDefaultButtons' );
		    	}
		    	
		    	$this.wrap('<div >').css({'display': 'none'});
		    	
				var buttonClass = $this.attr('class');
		    	var buttonClick = $this.attr('onclick');
		    	
		    	var $thisParent = $this.parent('div');
		    	
		    	$thisParent.addClass(buttonClass);
		    	$thisParent.attr('onclick',buttonClick );
		    	$thisParent.css({
		    		'background-image': $thisImage,
		    		width:	defaults.width,
		    		height: defaults.height,
		    		cursor: 'pointer'
		    	});
		    	
		    	
		    	
		    	var uncheckedPos = 0;
		    	var checkedPos = -(defaults.height);
		    	if ($this.is(':disabled')){
		    		uncheckedPos = -(defaults.height * 2);
		    		checkedPos = -(defaults.height * 3);
		    	}
		    	
		    	$this.on('disableBtn', function(){
		    		$this.attr('disabled', 'disabled');
		    		uncheckedPos = -(defaults.height * 2);
		    		checkedPos = -(defaults.height * 3);
		    		$this.trigger('resetBackground');
		    	});
		    	
		    	$this.on('enableBtn', function(){
		    		$this.removeAttr('disabled');				    		
		    		uncheckedPos = 0;
		    		checkedPos = -(defaults.height);
		    		$this.trigger('resetBackground');
		    	});
		    	
		    	$this.on('resetBackground', function(){
		    		if ($this.is(':checked')){
		    			$thisParent.css({
		    				backgroundPosition: '0 ' + checkedPos + "px" 
		    			});
		    		}
		    		else {
		    			$thisParent.css({
		    				backgroundPosition: '0 ' + uncheckedPos + "px"
		    			});
		    		}
		    	});
		    	
		    	
		    	$this.trigger('resetBackground');
		    	
		    	
		    	if ($this.is(':checkbox')){
		    		
		    		$thisParent.on('click', function(){
		    			if (!($this.is(':disabled'))){
		    				$this.change();
		    			}			    	
		    		})
		    		
		    		$thisParent.addClass('styledCheckbox');
			    	
			    	$this.on('change', function(){
			    		if ($this.prop('checked')){
			    			$this.prop("checked", false);
			    			$thisParent.css({
			    				backgroundPosition: '0 ' + uncheckedPos + "px" 
			    			});
			    		}
			    		else {
			    			$this.prop("checked", true);
			    			$thisParent.css({
			    				backgroundPosition:  '0 ' + checkedPos + "px"
			    			});
			    		}
			    	});
			    	
			    }
			    else if ($this.is(':radio')) {
			    
			    	$thisParent.addClass('styledRadio');
			    	
			    	var $thisName = $this.attr('name');
			    	
			    	$thisParent.on('click', function(){
			    		if (!($this.prop('checked')) && !($this.is(':disabled'))){
			    			$this.change();
			    		}				    	
			    	})
			    	
			    	
			    	$this.on('change', function(){
			    		if ($this.prop('checked')){
			    			$this.prop("checked", false);
			    				$thisParent.css({
			    					backgroundPosition:  '0 ' + uncheckedPos + "px"
			    				});
			    		}
			    		else {
			    			$this.prop("checked", true);
				    			$thisParent.css({
				    				backgroundPosition:  '0 ' + checkedPos + "px"
				    			});
			    			
			    			var otherRadioBtns = jQuery('input[name="'+ $thisName +'"]').not($this);
			    			otherRadioBtns.trigger('radioSwitch');
			    		}
			    	});
			    	
			    	$this.on('radioSwitch', function(){
			    		$thisParent.css({
			    			backgroundPosition: '0 ' + uncheckedPos  + "px"
			    		});
			    	
			    	});
			    }
			    
			    if( jQuery.browser.version == 7.0 || jQuery.browser.version == 8.0 ){
			    	var $thisId = jQuery(this).attr('id');
			    	var $thisLabel = jQuery('label[for="' + $thisId + '"]');
			    	$thisLabel.on('click', function(){
			    		$thisParent.trigger('click');
			    	});
			    }
			    
			});
	    	
	    },
	    check : function() {
	    	return this.each(function(){
	    		var $this = jQuery(this);
		    	if (!methods.isChecked($this)){
		      		$this.change();
		      	}
		     });	
	    },
	    uncheck : function() {
	    	return this.each(function(){
	    		var $this = jQuery(this);
	    		if (methods.isChecked($this)){
	    	  		$this.change();
	    	  	}
	    	 });
	    },
	    toggle: function(){
	    	return this.each(function(){
		    	var $this = jQuery(this);
		    	$this.change();
		    });
	    },
	    disable : function() { 
	    	return this.each(function(){
	    		var $this = jQuery(this);
	    		$this.trigger('disableBtn');
	    	});
	    },
	    enable: function(){			    	
	    	return this.each(function(){
	    		var $this = jQuery(this);
	    		$this.trigger('enableBtn');
	    	});
	    },
	    isChecked: function($this){
		    	if ($this.prop('checked')){
		    		return true;
		    	}
		    	return false;
	    }
	};
	
	jQuery.fn.screwDefaultButtons = function( method, options) {
	    
	    // Method calling logic
	    if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      jQuery.error( 'Method ' +  method + ' does not exist on jQuery.screwDefaultButtons' );
	    }    
	  
	};
	
	return this; 
	
})( jQuery );