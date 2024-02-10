let ZOOMS = {
	interval: {},
	callbacks: {}

	, isReady(zoomId){
		return window[zoomId] != undefined && window[zoomId] != null && window[zoomId].open != null;
	}
	, executeQuandoPronto: function(zoomId, callback){
		if(ZOOMS.callbacks[zoomId] == null) ZOOMS.callbacks[zoomId] = [];
		
		ZOOMS.callbacks[zoomId].push(callback);
		ZOOMS.interval[zoomId] = setInterval(function(){
			if(ZOOMS.interval[zoomId] > 0 && ZOOMS.isReady(zoomId)){
				while (_callback = ZOOMS.callbacks[zoomId].pop()){
					//console.log("ZOOMS.callbacks",zoomId,_callback);
					_callback();
				}
				ZOOMS.clearInterval(zoomId);
			}
		});
	}
	
	, clearInterval: function(zoomId){
		window.clearInterval(ZOOMS.interval[zoomId]);
		ZOOMS.interval[zoomId] = 0;
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
}

//CUSTOM
function setSelectedZoomItem(item) {
	if(item.inputId == "zoom_plano_referencia") {
		$("#idPlanoReferencia").val(item.identificacaoPlano);
		consultaPlanosTecnicos(item);
	} else if(item.inputId == "cnpjCliente") {
		$("#cliente").val(item.nomeFantasia);
		reloadZoomFilterValues("ambiente", `cnpj,${item.cnpj}`);
	} else if(item.inputId == "ambiente"){
		$("#codigoAmbiente").val(item.codigoAmbiente);
	}
}

function removedZoomItem(item) {
	if(item.inputId == "cnpjCliente") {
		$("#cliente").val("");
		reloadZoomFilterValues("ambiente", "");
		window.ambiente.clear();
	}
	else if(item.inputId == "ambiente") {
		$("#codigoAmbiente").val("");
	}
	else if(item.inputId == "zoom_plano_referencia") {
		let $idPlano = $("#idPlanoReferencia");
		removeAtividadesPlanoTecnico( $idPlano.val() );
		$idPlano.val("");
	}
}

function prepareClientZoom(){
	reloadZoomFilterValues("cnpjCliente", `cdMatricula,${parent.WCMAPI.userCode},ehAdmin,${CONTEXT.IS_ADMIN}`);
	
	let constraints = [ DatasetFactory.createConstraint("cdMatricula", `${parent.WCMAPI.userCode}`, "", ConstraintType.MUST) ];
	let dataset = DatasetFactory.getDataset("cheasy_usuario_cliente", [], constraints, []);
	if(dataset != null && dataset.values.length == 1){
		window.cnpjCliente.setValue({ 
			'cnpj': dataset.values[0].cnpj
			, 'nomeFantasia': dataset.values[0].nomeFantasia
		});
	}
};

function prepareZoomPlano(){
	let cnpj = $('#cnpjCliente').val();
	reloadZoomFilterValues("zoom_plano_referencia", 'cnpj,'+cnpj);
};