var ua = 
	(
		function() {
			return {
				isAndroid:navigator.userAgent.toLowerCase().search(/android/) != -1
			}
		}
	)();

function getStorageKeyForSelectedStore(idx) {
	return location.pathname + "_selectedStore_" + idx;
}

function getStorageKeyForStoreDiv(storediv) {
	return "storeDiv_" + storediv;
}

function getSelectedStore(idx) {
	if (ua.isAndroid) {
		var key = getStorageKeyForSelectedStore(idx);
		var store = sessionStorage.getItem(key);
		
		if (store != null) {
			return store;
		}
	}
	return jQuery(".selected_store").eq(idx).val();
}

function setSelectedStore(idx, store) {
	jQuery(".selected_store").eq(idx).val(store);
}

function setFavStoreHtml(idx, html) {
	jQuery(".favstore").eq(idx).html(html);

	var store = getSelectedStore(idx);

	if (store != "") {
		jQuery(".favstore").eq(idx).val(store);
	}
}

jQuery(document).ready(function(){
	jQuery(".favstorediv").change(function() {
		var storeIndex = jQuery(".favstorediv").index(this);
		var storediv = jQuery(this).val();
		var storeHtml = "<option value=\"\"></option>";
		
		if (storediv != "") {
			var key = getStorageKeyForStoreDiv(storediv);
			
			if (ua.isAndroid && sessionStorage.getItem(key) != null) {
				setFavStoreHtml(storeIndex, sessionStorage.getItem(key));
			} else {
				jQuery.ajax({
					type: "POST",
					url: "../search/lookupstore.aspx",
					data: {storediv: storediv},
					dataType: "json",
					cache: false,
					success: function (data, status, XMLHttpRequest) {
						jQuery.each(data, function(idx, entity) {
							storeHtml+= "<option value=\"" + entity.store + "\">" +  entity.name + "</option>";
						});
						if (ua.isAndroid) {
							sessionStorage.setItem(getStorageKeyForStoreDiv(storediv), storeHtml)
						}
						setFavStoreHtml(storeIndex, storeHtml);
					},
					error: function() {
						setFavStoreHtml(storeIndex, storeHtml);
					}
				});
			}
		} else {
			setSelectedStore(storeIndex, "");
			setFavStoreHtml(storeIndex, storeHtml);
		}
	});

	if (ua.isAndroid) {
		jQuery("[name='frmCustomer']").submit(function() {
			jQuery(".favstore").each(function(index) {
				var key = getStorageKeyForSelectedStore(index);
				sessionStorage.setItem(key, jQuery(this).val())
			});
		});
	}
	
	jQuery(".favstore").change(function() {
		var index = jQuery(".favstore").index(this);
		setSelectedStore(index, jQuery(this).val());
	});

	jQuery(".favstorediv").each(function(index) {
		if (jQuery(this).val() != "" || getSelectedStore(index) != "") {
			jQuery(this).trigger("change");
		}
	});
});
