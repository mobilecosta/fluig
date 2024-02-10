function enableFields(form) {

	// DADOS DO FLUIG
	var numAtividade = getValue("WKNumState");
	var numSolicitacao = getValue("WKNumProces");
	var cdSolicitacao = form.getValue("cdSolicitacao");
	var mode = form.getFormMode();
	var matriculaUsuario = form.getValue("matriculaUsuario");
	var usuarioCorrente = form.getValue("usuarioCorrente");

	log.info("SOLICPAGAMENTO - ENABLE FIELDS - ATIVIDADE: " + numAtividade + " PROCESSO: " + numSolicitacao);

	if ((numAtividade == 0 && mode == "ADD") || (numAtividade == 1) || (numAtividade == 6)) {
		form.setEnabled("btGerarTitulo", false);
		form.setEnabled("gerouManual", false);
	}
	else {
		form.setEnabled("codCentroCusto", false);
		form.setEnabled("codItemContabil", false);
		form.setEnabled("codClasse", false);

		form.setEnabled("nomeEmpresa", false);
		form.setEnabled("cpfCnpjFornec", false);

		form.setEnabled("IdBanco", false);
		form.setEnabled("nmBanco", false);
		form.setEnabled("IdAg", false);
		form.setEnabled("conta", false);
		form.setEnabled("Inform", false);
		form.setEnabled("dataPagamento", false);

		form.setEnabled("codNatureza", false);
		form.setEnabled("justificativaItem", false);

		//desabilita selects
		form.setEnabled("areaSolic", false);
		form.setEnabled("tipoFornec", false);
		form.setEnabled("formaPagto", false);
		form.setEnabled("descricaoItem", false);
		form.setEnabled("mesReferencia", false);
		form.setEnabled("anoReferencia", false);
	}

	if (numAtividade == 247) {
		form.setEnabled("obsAvalPrimNivel", true);
	} else {
		form.setEnabled("obsAvalPrimNivel", false);
	}

	// aprovacao gestores
	if (numAtividade == 155) {
		log.info("SOLICPAGAMENTO - ENABLE FIELDS - ATIVIDADE ");

		// var indexes = form.getChildrenIndexes("tbAprovacoes");
		// for (var i = 1; i <= indexes; i++) {

		// 	if (usuarioCorrente == form.getValue("idMatrAprovador___" + indexes)) {
		// 		form.setEnabled("idObsAprov___" + indexes, true);
		// 	} else {
		// 		form.setEnabled("idObsAprov___" + indexes, false);
		// 	}

		// }

		// para mobile!!
	}

	// aprovacao Fiscal - essa atividade preenche os dados de pagamento
	if (numAtividade == 55) {
		log.info("SOLICPAGAMENTO - ENABLE FIELDS - ATIVIDADE 55");
		form.setEnabled("nomeEmpresa", false);

		var current = +form.getValue("hiddenNumeroDaVez");
		var last = +form.getValue("hiddenNumTotAprovac");

		log.info("VALIDAPORVGESTOR::::CURRENT:::" + current);
		log.info("VALIDAPORVGESTOR::::LAST:::" + last);

		for (var i = 1; i <= last; i++) {
			if (i != current) {
				log.info("VALIDAPORVGESTOR::::" + current);
				form.setEnabled("idObsAprov___" + i, false);
			}
		}
	} else {
		form.setEnabled("observacoesFiscalAprovacao", false);
	}

	if (numAtividade == 142) {
		log.info("SOLICPAGAMENTO - ENABLE FIELDS - ATIVIDADE 142");
		form.setEnabled("nomeEmpresa", false);

		if (form.getValue("descricaoItem").value == "00") {
			form.setEnabled("observacoesFiscalAprovacao", false);
		}
	}
	// para mobile!!
	else {
		form.setEnabled("observacoesContasPagarAprovac", false);
	}

	if (numAtividade == 5) {
		log.info("SOLICPAGAMENTO - ENABLE FIELDS - ATIVIDADE 5");

		form.setEnabled("observacoesFiscalAprovacao", false);
		form.setEnabled("codNatureza", true);

		if (form.getValue("descricaoItem").value == "00") {
			form.setEnabled("observacoesFiscalAprovacao", false);
		}

		// solicitacao da Bianca que ficasse habilitado.
		form.setEnabled("justificativaItem", true);
		form.setEnabled("nomeEmpresa", false);
		form.setEnabled("dataPagamento", true);
	}


	log.info("SOLICPAGAMENTO - ENABLE FIELDS - FIM");
}


