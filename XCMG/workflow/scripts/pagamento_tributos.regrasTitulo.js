function regrasTitulo(){}

function precisaIntegrarTitulo(){
	log.info(_log + " - precisaIntegrarTitulo");
	
	var hasNewPaymentDocument = false;
	var indexes = hAPI.getChildrenIndexes("tbTitulos");
	log.info(_log + " - precisaIntegrarTitulo - indexes:");
	log.dir(indexes);
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var tit = hAPI.getCardValue("titulo___"+row);
		log.info(_log + " - precisaIntegrarTitulo - row: " + row + " - tit: " + tit);
		if(isEmpty(tit)){
			hasNewPaymentDocument = true;
			break;
		}
	}
	log.info(_log + " - precisaIntegrarTitulo - titulo novo: " + hasNewPaymentDocument);
	return hasNewPaymentDocument;
}

function proximoTituloAIntegrar(){
	log.info(_log + " - proximoTituloAIntegrar");
	
	var indexes = hAPI.getChildrenIndexes("tbTitulos");
	log.info(_log + " - precisaIntegrarTitulo - indexes:");
	log.dir(indexes);
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var tit = hAPI.getCardValue("titulo___"+row);
		log.info(_log + " - precisaIntegrarTitulo - row: " + row + " - tit: " + tit);
		if(isEmpty(tit)){
			return row;
		}
	}
	return "";
}

function integrarTitulo(row){
	log.info(_log + " - integrarTitulo");
	var nValor = getRawNumber(hAPI.getCardValue("tit_vl_original___"+row));
	var nJuros = getRawNumber(hAPI.getCardValue("tit_vl_juros___"+row));
	var nMulta = getRawNumber(hAPI.getCardValue("tit_vl_multa___"+row));
	var nTaxa = getRawNumber(hAPI.getCardValue("tit_vl_taxa___"+row));
	var nTaxaMoeda = getRawNumber(hAPI.getCardValue("vl_taxa"));
	
	var constraintsSolicitacao = [
	    DatasetFactory.createConstraint('cdFilial', hAPI.getCardValue("cd_filial"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cPrefixo', "FLG", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cParcela', "1", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cTipo', hAPI.getCardValue("tit_tipo___"+row), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNatureza', hAPI.getCardValue("tit_cd_natureza___"+row), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cFornece', hAPI.getCardValue("cd_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cLoja', hAPI.getCardValue("lj_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dEmissao', hAPI.getCardValue("tit_dt_emissao___"+row), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dVencto', hAPI.getCardValue("tit_dt_vencimento___"+row), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nValor', nValor, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cHist', hAPI.getCardValue("ds_descricao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nJuros', nJuros, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nMulta', nMulta, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxa', nTaxa, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCusto', hAPI.getCardValue("tit_cd_centro_custo___"+row), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cConta', hAPI.getCardValue("cd_conta_contabil"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNumero', hAPI.getCardValue("nr_solicitacao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCDebito', hAPI.getCardValue("cd_centro_custo"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('ctDebito', hAPI.getCardValue("cd_conta_contabil"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasDeb', hAPI.getCardValue("cd_classdeb"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasCre', hAPI.getCardValue("cd_classcred"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cMoeda', hAPI.getCardValue("sl_moeda"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxaMoeda', nTaxaMoeda, "", ConstraintType.MUST)
	];
	var ds = DatasetFactory.getDataset("protheus_escreve_titulos_pagar", null, constraintsSolicitacao, null);
	if(ds == null || ds.rowsCount <= 0){
		throw "Erro ao processar a integração de criação de título, "
			+ " não foi obtido retorno do Protheus."
			+ " Entre em contato com o administrador do sistema";
	}
	
	log.info(_log + " - integrarTitulo - ds: ");
	log.dir(ds);
	var error = ds.getValue(0, "ERROR");
	var msg = ds.getValue(0, "msg");
	if(error != undefined && error != null && error != ""){
		throw "Erro ao processar a integração de criação de título: " + error;
	}
	else if(msg != undefined && msg != null && msg != "Sucesso"){
		throw "Erro ao processar a integração de criação de título: " + msg;
	}
	//Se não houve falha na integração, atualiza campo com o nr título gerado pela integração.
	hAPI.setCardValue("titulo___"+row, ds.getValue(0, "cod_titulo"));
}