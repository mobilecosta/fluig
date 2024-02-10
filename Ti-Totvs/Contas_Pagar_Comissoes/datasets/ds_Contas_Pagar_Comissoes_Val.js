function createDataset(fields, constraints, sortFields) {
	
	var existeId = true;
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("CODIGOAR");
	dataset.addColumn("GERADO");
	dataset.addColumn("CNPJ_TOTVS");
	dataset.addColumn("CNPJ_FORN");
	dataset.addColumn("AGN");
	dataset.addColumn("FILIAL");
	dataset.addColumn("NOME_FILIA");
	dataset.addColumn("NOME");
	dataset.addColumn("RAZAO_SOCI");
	dataset.addColumn("EMISSAO");
	dataset.addColumn("PEDIDO");
	dataset.addColumn("VALOR");
	dataset.addColumn("COD_FORN");
		
	var codigo_ar_de = "TSE107";
	var codigo_ar_ate = "TSE107";
	var dtRef = "20210601";
	var tpforn = 1;
	var tpagn = "";
	
	for (var c in constraints){
		if (constraints[c].fieldName == "codigo_ar_de"){
			codigo_ar_de = String(constraints[c].initialValue);
		}else if (constraints[c].fieldName == "codigo_ar_ate"){
			codigo_ar_ate = String(constraints[c].initialValue);
		}else if (constraints[c].fieldName == "dtRef"){
			dtRef = String(constraints[c].initialValue);
		}else if (constraints[c].fieldName == "tp_forn"){
			tpforn = Number(constraints[c].initialValue);
		}else if (constraints[c].fieldName == "tp_agn"){
		 	tpagn = String(constraints[c].initialValue);
	    }
	}
	
	try{
		
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
				companyId : 10097 + '',
				serviceCode : 'wscorpfluig-rest',
				endpoint : "TIINTERCEPTORWS/api/v1/000030",
				method : 'post',
				timeoutService: '100',
				params: {
				    "codigo_ar_de": codigo_ar_de,
				    "codigo_ar_ate": codigo_ar_ate,
				    "dtRef":dtRef,
				    "tp_forn": tpforn,
				    "lst_gerados": 1,
				    "tp_agn": tpagn
				},
		}
		
		var vo = clientService.invoke(JSON.stringify(data));
		
		var retorno = vo.getResult();
		var objData = JSON.parse(retorno);
		var tipos = objData["pedidos"];
		
		for (var i = 0; i < tipos.length; i++){		
			
			var status = null;
			
			dataset.addRow(new Array(
					tipos[i]["CODIGOAR"],
					tipos[i]["GERADO"],
					tipos[i]["CNPJ_TOTVS"],
					tipos[i]["CNPJ_FORN"],
					tipos[i]["AGN"],
					tipos[i]["FILIAL"],
					tipos[i]["NOME_FILIA"],
					tipos[i]["NOME"],
					tipos[i]["RAZAO_SOCI"],
					tipos[i]["EMISSAO"],
					tipos[i]["PEDIDO"],
					tipos[i]["VALOR"],
					tipos[i]["COD_FORN"]
					));
		}
		
	}catch(error){
		dataset.addRow(new Array(
					"erro",
					error.message,
					"erro",
					"erro"
				));
	}
	
	return dataset;
}