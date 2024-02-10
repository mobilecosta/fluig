function regrasTitulo(){}

function precisaIntegrarQuaisTitulos(){
	log.info(_log + " - precisaIntegrarTitulo");
	
	var precisaIntegrar = { "antecipado": false, "pagar": false, "receber": false };
	
	precisaIntegrar.pagar = true;
	
	var processo = hAPI.getCardValue("rd_processo");
	var tipo = hAPI.getCardValue("rd_tipo");
	
	precisaIntegrar.antecipado = (tipo == "adiantamento");
		
	var jaGerouAPagar = !isEmpty(hAPI.getCardValue("nr_titulo_pagar"));
	if(jaGerouAPagar) precisaIntegrar.pagar = false;

	log.info(_log + " - precisaIntegrarTitulo - jaGerouAPagar: " + jaGerouAPagar);
	log.info(_log + " - precisaIntegrarTitulo - result: ");
	log.dir(precisaIntegrar);
	return precisaIntegrar;
}

/**
* Integra titulos a pagar referente a pagamentos antecipados (PA)
*/
function integrarAdiantamento(){
	log.info(_log + " - integrarAdiantamento");
	var nValor = getRawNumber(hAPI.getCardValue("vl_adiantado"));
	var nJuros = 0;
	var nMulta = 0;
	var nTaxa = 0;
	var nTaxaMoeda = getRawNumber(hAPI.getCardValue("vl_taxa"));
	
	var naturezaFornecedor = hAPI.getCardValue("cd_natureza");
	var processo = hAPI.getCardValue("rd_processo");
	var natureza = naturezaFornecedor;
	if(isEmpty(naturezaFornecedor)){
		natureza = (processo == "fornecedor") ? "51101": "51103";
	}
	var constraints = [
	    DatasetFactory.createConstraint('cdFilial', hAPI.getCardValue("cd_filial"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cPrefixo', "FLG", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cParcela', "1", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cTipo', "PA", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNatureza', natureza, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cFornece', hAPI.getCardValue("cd_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cLoja', hAPI.getCardValue("lj_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dEmissao', getCurrentDate("PT_BR"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dVencto', hAPI.getCardValue("dt_pagamento"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nValor', nValor, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cHist', hAPI.getCardValue("ds_descricao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nJuros', nJuros, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nMulta', nMulta, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxa', nTaxa, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCusto', hAPI.getCardValue("cd_centro_custo"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cConta', hAPI.getCardValue("cd_conta_contabil"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNumero', hAPI.getCardValue("nr_solicitacao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCDebito', "", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('ctDebito', "", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cBanco', hAPI.getCardValue("cd_banco_xcmg"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cAgencia', hAPI.getCardValue("cd_agencia_xcmg"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cContaBanco', hAPI.getCardValue("cd_conta_xcmg"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasDeb', hAPI.getCardValue("cd_classdeb"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasCre', hAPI.getCardValue("cd_classcred"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cMoeda', hAPI.getCardValue("sl_moeda"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxaMoeda', nTaxaMoeda, "", ConstraintType.MUST)
	];
	integrarTituloAPagar(constraints);
}

/**
* Integra titulos a pagar referente a recibos de pagamentos (RC)
*/
function integrarRecibos(){
	log.info(_log + " - integrarRecibos");
	
	var nValor = numeroAmericano(hAPI.getCardValue("vl_total"));
	var nJuros = 0;
	var nMulta = 0;
	var nTaxa = 0;
	var nTaxaMoeda = getRawNumber("0");
	
	
	var naturezaFornecedor = hAPI.getCardValue("cd_natureza");
	var natureza = (isEmpty(naturezaFornecedor)) ? "31251" : naturezaFornecedor;
	var constraints = [
	    DatasetFactory.createConstraint('cdFilial', hAPI.getCardValue("cd_filial"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cPrefixo', "FLG", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cParcela', "1", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cTipo', "RC", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNatureza', natureza, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cFornece', hAPI.getCardValue("cd_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cLoja', hAPI.getCardValue("lj_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dEmissao', getCurrentDate("PT_BR"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dVencto', hAPI.getCardValue("dt_pagamento"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nValor', nValor, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cHist', hAPI.getCardValue("ds_descricao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nJuros', nJuros, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nMulta', nMulta, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxa', nTaxa, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCusto', hAPI.getCardValue("cd_centro_custo"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cConta', hAPI.getCardValue("cd_conta_contabil"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNumero', hAPI.getCardValue("nr_solicitacao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCDebito', "", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('ctDebito', "", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasDeb', hAPI.getCardValue("cd_classdeb"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cClasCre', hAPI.getCardValue("cd_classcred"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cMoeda', "1", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nTaxaMoeda', nTaxaMoeda, "", ConstraintType.MUST)
	];
	integrarTituloAPagar(constraints);
}

/**
* Integra titulos a pagar
* @param constraints lista de parâmetros necessários para executar a criação do título
*/
function integrarTituloAPagar(constraints){
	log.info(_log + " - integrarTituloAPagar");
	
	var ds = DatasetFactory.getDataset("protheus_escreve_titulos_pagar", null, constraints, null);
	if(ds == null || ds.rowsCount <= 0){
		throw "Erro ao processar a integração de criação de título, "
			+ " não foi obtido retorno do Protheus."
			+ " Entre em contato com o administrador do sistema";
	}
	
	log.info(_log + " - integrarTituloAPagar - ds: ");
	log.dir(ds);
	var error = ds.getValue(0, "ERROR");
	var msg = ds.getValue(0, "msg");
	if(error != undefined && error != null && error != ""){
		throw "Erro ao processar a integração de criação de título a pagar: " + error;
	}
	else if(msg != undefined && msg != null && msg != "Sucesso"){
		throw "Erro ao processar a integração de criação de título a pagar: " + msg;
	}
	//Se não houve falha na integração, atualiza campo com o nr título gerado pela integração.
	hAPI.setCardValue("nr_titulo_pagar", ds.getValue(0, "cod_titulo"));
}

/**
* Integra titulos a receber
*/
function integrarTitulosAReceber(){
	log.warn(_log + " - integrarTitulosAReceber");
	
	var total = parseFloat(getModuleRawNumber(hAPI.getCardValue("vl_total")));
	var natureza = "31251";
	var constraints = [
	    DatasetFactory.createConstraint('cdFilial', hAPI.getCardValue("cd_filial"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cPrefixo', "FLG", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cParcela', "1", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cTipo', "BOL", "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNatureza', natureza, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCliente', hAPI.getCardValue("cd_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cLoja', hAPI.getCardValue("lj_fornecedor"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dEmissao', getCurrentDate("PT_BR"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('dVencto', hAPI.getCardValue("dt_pagamento"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('nValor', total, "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cHist', hAPI.getCardValue("ds_descricao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cConta', hAPI.getCardValue("cd_conta_contabil"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cNumero', hAPI.getCardValue("nr_solicitacao"), "", ConstraintType.MUST)
	    , DatasetFactory.createConstraint('cCusto', hAPI.getCardValue("cd_centro_custo"), "", ConstraintType.MUST)
	];
	
	var ds = DatasetFactory.getDataset("protheus_escreve_titulos_receber", null, constraints, null);
	if(ds == null || ds.rowsCount <= 0){
		throw "Erro ao processar a integração de criação de título a receber, "
			+ " não foi obtido retorno do Protheus."
			+ " Entre em contato com o administrador do sistema";
	}
	
	log.info(_log + " - integrarTitulosAReceber - ds: ");
	log.dir(ds);
	var error = ds.getValue(0, "ERROR");
	var msg = ds.getValue(0, "msg");
	if(error != undefined && error != null && error != ""){
		throw "Erro ao processar a integração de criação de título a receber: " + error;
	}
	else if(msg != undefined && msg != null && msg != "Sucesso"){
		throw "Erro ao processar a integração de criação de título a receber: " + msg;
	}
	//Se não houve falha na integração, atualiza campo com o nr título gerado pela integração.
	hAPI.setCardValue("nr_titulo_receber", ds.getValue(0, "cod_titulo"));
}