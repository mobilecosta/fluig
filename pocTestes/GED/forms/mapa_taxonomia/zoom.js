const ZOOM = {
	interval: {},
	callbacks: {},
	isReady: function(zoomId){
		return window[zoomId] != undefined && window[zoomId] != null && window[zoomId].open != null;
	}
	, execWhenReady: function(zoomId, callback){
		ZOOM.interval[zoomId] = setInterval(function(){
			if(ZOOM.interval[zoomId] > 0 && ZOOM.isReady(zoomId)){
				callback(function(zoomId){
					window[zoomId].setValue( { cd_assunto : dados.cd_assunto, nm_assunto : dados.nm_assunto } );
				});
				ZOOM.clearInterval(zoomId);
			}
		});
	}
		
	, clearInterval: function(zoomId){
		window.clearInterval(ZOOM.interval[zoomId]);
		ZOOM.interval[zoomId] = 0;
	}
	
	, getValue:function(zoomId, qual){
		
		if (CONTEXT.MODE == "VIEW" || window[zoomId].getSelectedItems == undefined){
			return $("#"+zoomId).val();
		}
		else if (qual == undefined || qual == "todos"){
			return window[zoomId].getSelectedItems();
		}
		else if (qual != undefined){
			let values = window[zoomId].getSelectedItems();
			return values != null && values.length > qual ? values[qual] : "";
		}
		return "";
	}
		
	,clear:function(zoomId){
		if (window[zoomId].clear == undefined){
			return $("#"+zoomId).val("");
		} else window[zoomId].clear();
		
		removedZoomItem( { "inputId": zoomId } );
	}
}

function setSelectedZoomItem(item) {
	let name = "";
	let index = "";
	if(item.inputName.indexOf('___') > -1){
		let splittedName = item.inputName.split('___');
		name = splittedName[0];
		index = '___'+splittedName[1];
	} 
	else if(item.inputName.indexOf('_modal_') > -1){
		let splittedName = item.inputName.split('_modal_');
		name = splittedName[0];
		index = '_modal_'+splittedName[1];
	}
	else {
		name = item.inputName;
	}
	
	if(name == "zoom_raiz"){
		$('#cd_raiz').val(item.documentId);
		$('#raiz').val(item.documentDescription);
	}
	else if(name == "nm_assunto"){
		$('[name="cd_assunto'+index+'"]').val(item.cd_assunto);
	}
}

function removedZoomItem(item) {
	let name = "";
	let index = "";
	if(item.inputName.indexOf('___') > -1){
		let splittedName = item.inputName.split('___');
		name = splittedName[0];
		index = '___'+splittedName[1];
	} 
	else if(item.inputName.indexOf('_modal_') > -1){
		let splittedName = item.inputName.split('_modal_');
		name = splittedName[0];
		index = '_modal_'+splittedName[1];
	}
	else {
		name = item.inputName;
	}
	
	if(name == "raiz"){
		$('#cd_raiz').val('');
	}
	else if(name == "nm_assunto"){
		$('[name="cd_assunto'+index+'"]').val('');
	}
}