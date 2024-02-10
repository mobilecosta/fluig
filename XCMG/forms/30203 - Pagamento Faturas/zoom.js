let ZOOM = {
	interval: {},
	callbacks: {},
	isReady: function(zoomId){
		return window[zoomId] != undefined && window[zoomId] != null && window[zoomId].open != null;
	}
	, execWhenReady: function(zoomId, callback){
		ZOOM.interval[zoomId] = setInterval(function(){
			if(ZOOM.interval[zoomId] > 0 && ZOOM.isReady(zoomId)){
				callback();
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

function setSelectedZoomItem(selectedItem) {

	if(selectedItem.inputId == "zoom_natureza"){
		$("#cd_natureza").val(selectedItem['ED_CODIGO']);
	}



	let id = "";
	let index = "";
	if(selectedItem.inputId.indexOf("___") > -1){
		id = selectedItem.inputId.split('___')[0];
		index = selectedItem.inputId.split('___')[1];
	}else {
		id = selectedItem.inputId;
	}	
	
	if(id == "nm_filial"){
		 $('#cd_filial').val(selectedItem['Code']);	
		 $('#cd_empresa').val(selectedItem['CompanyCode']);
		 reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,'+CONTEXT.USER+',cd_filial,'+selectedItem['Code']);
		 reloadZoomFilterValues("cd_conta_contabil", 'cd_matricula,'+CONTEXT.USER);
		 
		 ZOOM.reloadSupplierZoom();
		 ZOOM.reloadNatureZoom();
		 ZOOM.reloadClassZoom();
		 ZOOM.reloadAdvancesZoom();
	}
	else if(id == "cd_centro_custo"){
		 $('#nm_centro_custo').val(selectedItem['NomeCC']);	
		 let cd_filial = $('#cd_filial').val();
		 reloadZoomFilterValues("cd_conta_contabil", 'cd_matricula,'+CONTEXT.USER+',cd_filial,'+cd_filial+',cd_centro_custo,'+selectedItem['CodCC']);
		 APPROVERS.reloadApprovers();
		 
		 ZOOM.reloadAdvancesZoom();
	}
	else if(id == "cd_conta_contabil"){
		$("#ds_conta_contabil").val(selectedItem['NomeCT']);
		
		
		var contaAux = $("#cd_conta_contabil").val()+'';
				
		
		console.log("contaAux = " + contaAux);
		console.log("contaAux.substring(0,1) = " + contaAux.substring(0,1));
		
		//contas pagamento RH
		if(contaAux.substring(0,1) == "2"){
			//importacao/exportacao não validade orcamento
			$("#nm_situacao_budget").val("Não valida Budget");
			
			
		}else{
		
			MAIN.calculateBudget();
			
		}
		
	}
	else if(id == "fornecedor"){
		$("#cd_fornecedor").val(selectedItem['A2_COD']);
		$("#lj_fornecedor").val(selectedItem['A2_LOJA']);
		$("#cgc_fornecedor").val(selectedItem['A2_CGC']);
		$("#nm_razao_social").val(selectedItem['A2_NREDUZ']);
		$("#nm_banco").val(selectedItem['A2_BANCO']);
		$("#cd_agencia").val(selectedItem['A2_AGENCIA']+"-"+selectedItem['A2_DVAGE']);
		$("#cd_conta").val(selectedItem['A2_NUMCON']+"-"+selectedItem['A2_DVCTA']);
		window["cd_natureza"].setValue({'ED_CODIGO': selectedItem['A2_NATUREZ'] });
	}
	else if(id == "cd_solicitacao_adiantamento"){
		$("#vl_adiantamento").val(selectedItem['vl_total']);
		$("#vl_adiantado").val(selectedItem['vl_total']);
		$("#dt_adiantamento").val(selectedItem['dt_pagamento']);
	}
	else if(id == "nm_banco_xcmg"){
		$("#cd_banco_xcmg").val(selectedItem['A6_COD']);
		$("#cd_agencia_xcmg").val(selectedItem['A6_AGENCIA']);
		$("#cd_digito_agencia").val(selectedItem['A6_DVAGE']);
		$("#cd_conta_xcmg").val(selectedItem['A6_NUMCON']);
		$("#cd_digito_conta").val(selectedItem['A6_DVCTA']);
	}   
}

function removedZoomItem(removedItem) {
	let id = "";
	let index = "";
	if(removedItem.inputId.indexOf("___") > -1){
		id = removedItem.inputId.split('___')[0];
		index = removedItem.inputId.split('___')[1];
	}else {
		id = removedItem.inputId;
	}			
	
	if(id == "nm_filial"){
		 $('#cd_filial').val('');	
		 $('#cd_empresa').val('');
		 
		 window["cd_centro_custo"].clear();
		 $("#nm_centro_custo").val('');
		 reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,,cd_filial,');
		 
		 window["cd_conta_contabil"].clear();
		 $("#ds_conta_contabil").val('');
		 reloadZoomFilterValues("cd_conta_contabil", 'cd_matricula,,cd_filial,,cd_centro_custo,');
		 
		 MAIN.calculateBudget();
		 APPROVERS.clearAllApprovers();
		 
		 ZOOM.reloadSupplierZoom();
		 ZOOM.reloadNatureZoom();
		 ZOOM.reloadClassZoom();
		 ZOOM.reloadAdvancesZoom();
	}
	else if(id == "cd_centro_custo"){
		 $('#nm_centro_custo').val('');	
		
		 window["cd_conta_contabil"].clear();
		 $("#ds_conta_contabil").val('');
		 reloadZoomFilterValues("cd_conta_contabil", 'cd_matricula,,cd_filial,,cd_centro_custo,');
		 
		 MAIN.calculateBudget();
		 APPROVERS.clearAllApprovers();
		 
		 ZOOM.reloadAdvancesZoom();
	}
	else if(id == "cd_conta_contabil") {
		$("#ds_conta_contabil").val("");
		MAIN.calculateBudget();
	}
	else if(id == "fornecedor"){
		$("#cd_fornecedor").val("");
		$("#lj_fornecedor").val("");
		$("#cgc_fornecedor").val("");
		$("#nm_razao_social").val("");
		$("#nm_banco").val("");
		$("#cd_agencia").val("");
		$("#cd_conta").val("");
		$("#cd_natureza").val("");
	}
	else if(id == "cd_solicitacao_adiantamento"){
		$("#vl_adiantamento").val("");
		$("#dt_adiantamento").val("");
	}
	else if(id == "nm_banco_xcmg"){
		$("#cd_banco_xcmg").val("");
		$("#cd_agencia_xcmg").val("");
		$("#cd_digito_agencia").val("");
		$("#cd_conta_xcmg").val("");
		$("#cd_digito_conta").val("");
	}   
}

ZOOM.prepareCostCenterZoom = function(){
	let branch = $("#cd_filial").val();
	reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,'+CONTEXT.USER+',cd_filial,'+branch);
}
ZOOM.reloadAdvancesZoom = function(){
	let cd_filial = $('#cd_filial').val();
	let cd_centro_custo = ZOOM.getValue('cd_centro_custo', 0);
	
	
}
ZOOM.reloadSupplierZoom = function(){
	let cd_empresa = $('#cd_empresa').val();
	reloadZoomFilterValues("fornecedor", "branch,"+cd_empresa);
}
ZOOM.reloadNatureZoom = function(){
	let filial = $('#cd_filial').val();
	reloadZoomFilterValues("zoom_natureza", `branch,${filial}`);
};
ZOOM.reloadClassZoom = function(){
	let filial = $('#cd_filial').val();
	reloadZoomFilterValues("cd_classdeb", `branch,${filial}`);
	reloadZoomFilterValues("cd_classcred", `branch,${filial}`);
};