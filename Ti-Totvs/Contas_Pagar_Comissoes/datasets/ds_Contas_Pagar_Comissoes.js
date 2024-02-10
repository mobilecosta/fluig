function createDataset(fields, constraints, sortFields) {
	
	var existeId = true;
	var dataset = DatasetBuilder.newDataset();
	var email_fixo = "henrique.lira@totvs.com.br";
	
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
	dataset.addColumn("EMAIL");
	dataset.addColumn("STATUS");
	dataset.addColumn("COLLEAGUEID");
	dataset.addColumn("PROCESSID");
		
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
		
		 for (var j = 0; j < tipos.length; j++){
			
			var email_ver = email_fixo;
			var cColleague_ver = new Array();
			cColleague_ver.push(DatasetFactory.createConstraint("mail",email_ver,email_ver,ConstraintType.MUST));
			var id_ver = DatasetFactory.getDataset("colleague",null, cColleague_ver,null);
			
			if (id_ver.rowsCount==0){
				existeId = false;
			}
		}
		
		for (var i = 0; i < tipos.length; i++){
			
			var c1 = DatasetFactory.createConstraint("idCanal", tipos[i]["CODIGOAR"], tipos[i]["CODIGOAR"], ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("idCNPJ_TOTVS", tipos[i]["CNPJ_TOTVS"], tipos[i]["CNPJ_TOTVS"], ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("idCNPJ_canal", tipos[i]["CNPJ_FORN"], tipos[i]["CNPJ_FORN"], ConstraintType.MUST);
			var c4 = DatasetFactory.createConstraint("idAGN", tipos[i]["AGN"], tipos[i]["AGN"], ConstraintType.MUST);
			var c5 = DatasetFactory.createConstraint("idFILIAL_TOTVS", tipos[i]["FILIAL"], tipos[i]["FILIAL"], ConstraintType.MUST);
			var c6 = DatasetFactory.createConstraint("idNome_FILIAL_TOTVS", tipos[i]["NOME_FILIA"], tipos[i]["NOME_FILIA"], ConstraintType.MUST);
			var c7 = DatasetFactory.createConstraint("idFornecedor_nome", tipos[i]["NOME"], tipos[i]["NOME"], ConstraintType.MUST);
			var c8 = DatasetFactory.createConstraint("idRazao", tipos[i]["RAZAO_SOCI"], tipos[i]["RAZAO_SOCI"], ConstraintType.MUST);
			var c9 = DatasetFactory.createConstraint("idCompetencia", tipos[i]["EMISSAO"], tipos[i]["EMISSAO"], ConstraintType.MUST);
			var c10 = DatasetFactory.createConstraint("idPedido", tipos[i]["PEDIDO"], tipos[i]["PEDIDO"], ConstraintType.MUST);
			var c11 = DatasetFactory.createConstraint("idValor", tipos[i]["VALOR"], tipos[i]["VALOR"], ConstraintType.MUST);
			var c12 = DatasetFactory.createConstraint("idCodigo_fornecedor", tipos[i]["COD_FORN"], tipos[i]["COD_FORN"], ConstraintType.MUST);
			
			
			var email = email_fixo;
			var cColleague = new Array();
			cColleague.push(DatasetFactory.createConstraint("mail",email,email,ConstraintType.MUST));
			var id = DatasetFactory.getDataset("colleague",null, cColleague,null);
			var idColleague = id.getValue(0,"colleaguePK.colleagueId");
			var c13 = DatasetFactory.createConstraint("colleagueId", idColleague, idColleague, ConstraintType.MUST);
			var c14 = DatasetFactory.createConstraint("userId", idColleague, idColleague, ConstraintType.MUST);
			var cComissoes = new Array(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14);
			var status = null;
			
			var processId = null;
			
			if (existeId){
				var dsStartProcess_C_P_C = DatasetFactory.getDataset("ds_comissoes_start_process", null, cComissoes, null);
				processId = dsStartProcess_C_P_C.getValue(0, "iProcess");
				status = "Ok";
			}else{
				status = "Erro";
			}
			
			
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
					tipos[i]["COD_FORN"],
					tipos[i]["EMAIL"],
					status,
					idColleague,
					processId
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