// GA Functions 1.4.2 http://murak.net/ MIT License

var gaFunc = gaFunc || {};

jQuery(function($) {
	var defaults = {
		xdomain:true,
		xdomainDomain:'e-ikiiki.net',
		locationSearch:true
	};
	
	var setting = jQuery.extend(defaults, gaFunc);
	var loc = location.pathname + (setting.locationSearch ? location.search : '');
	
	// cross domain link
	if(setting.xdomain) {
		var d = setting.xdomainDomain.split('|');
		var q = [];
		for(var i = 0; i < d.length; i++) {
			q.push('a[href*="'  + d[i] + '"]');
		}
		var g = setting.xdomainDomain.replace(/\./g, '\\.');
		jQuery(q.join(',')).on('click', function () {
			if(this.href.match(RegExp('^https?://[^/]*(' + g + ')'))) {
				var pageTracker = _gat._getTrackerByName(setting.tracker);
				this.href = pageTracker._getLinkerUrl(this.href);
			}
		});
	}
});
