function displayFields(form, customHTML) {
	//form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	setFormattedDate(form);

	// DADOS DO ECM 
	var usuarcorrente = getValue("WKUser");
	var numAtividade = getValue("WKNumState");
	var numSolicitacao = getValue("WKNumProces");
	var cdSolicitacao = form.getValue("cdSolicitacao");
	var mode = form.getFormMode();
	var matriculaUsuario = form.getValue("matriculaUsuario");
	var numcompany = +(getValue("WKCompany"));
	var diaSemana = 0;
	var numDias = 0;
	var valorPagar = form.getValue('valorPagar');

	form.setValue('numAtiv', numAtividade);

	log.info("SOLICPAGAMENTO - FUNCAO DISPLAY FIELDS- PROCESSO: " + numSolicitacao + "numAtividade: " + numAtividade);

	// setando a variavel mode parao custom
	customHTML.append("<script>");
	customHTML.append("    var numAtividadeSolicPag = '" + numAtividade + "';");
	customHTML.append("    var mode = '" + mode + "';");
	customHTML.append("</script>");

	log.info("SOLICPAGAMENTO - FUNCAO DISPLAY FIELDS - mode:" + mode);

	if (mode != "VIEW") {
		form.setValue("usuarioCorrente", getValue("WKUser"));
		form.setHidePrintLink(true);
	}
	else {
		form.setHidePrintLink(false);
	}

	var constraints;
	var colaborador;

	if (mode == "ADD") {
		form.setValue('hiddenCriouFichaPasta', "");
	}

	// A HORA SALVA NA TELA - SEGUNDO A SEGUNDO - E GRAVADA AO ENVIAR
	if (((parseInt(numAtividade) == 0) || numAtividade == null) && mode == "ADD") {

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE inicial");
		form.setValue('codDepartamento', "Buscando...");
		form.setValue('nomeDepartamento', "Buscando...");
		form.setValue("gerouManual", "2");

		form.setValue('dtRegistro', buscaDataAtual());
		form.setValue('matriculaUsuario', getValue("WKUser"));
		form.setValue('dataSolicitacao', buscaDataAtual());

		form.setValue('dataSolicitacao', buscaDataAtual());

		form.setValue('valorInss', "0,00");
		form.setValue('valorIss', "0,00");
		form.setValue('valorIrrf', "0,00");
		form.setValue('valorCsll', "0,00");
		form.setValue('valorPis', "0,00");
		form.setValue('valorCofins', "0,00");

		form.setValue('valorBruto', "0,00");
		form.setValue('acrescimo', "0,00");
		form.setValue('decrescimo', "0,00");
		form.setValue('valorMulta', "0,00");
		form.setValue('valorJuros', "0,00");
		form.setValue('valorCMon', "0,00");
		form.setValue('valorTaxas', "0,00");
		form.setValue('valorPagar', "0,00");

		if (form.getValue("secao") == "") {
			form.setValue("secao", "existente");
		}

		var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c1);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('nmUsuario', colaborador.getValue(0, "colleagueName"));

		//novo 18/08
		form.setValue('emailUsuarioCorrente', colaborador.getValue(0, "mail"));

		form.setValue('matriculabeneficiario', getValue("WKUser"));
		form.setValue('nomebeneficiario', colaborador.getValue(0, "colleagueName"));
		form.setValue('emailbeneficiario', colaborador.getValue(0, "mail"));

		// para sugerir a data de pagamento para a data de hoje + 4 dias, sem considerar o final de semana - sabado e domingo. Obs: nao trata feriados.
		verificaDiaSemana();

		form.setValue('nomeEmpresa', "Digite nome do Fornecedor/Participante (aceita parcial)");

	}
	//correcao
	else if (numAtividade == "6") {
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 6");

		form.setValue('hiddenRetornouRevisaoPri', "Sim");
		form.setValue('hiddenRetornouRevisao', "Sim"); // usando na condicao e outros - para aprovadores
		//form.setValue('hiddenRetornouRevisao', ""); // usando na condicao e outros - para aprovadores

		form.setValue('statusCPGeraTitulo', 'x');

	}
	else if (numAtividade == "155" && mode != "VIEW") {

		//Tratamento para corrigir solicitacoes para pool/papeis
		var numAprVez = form.getValue("idTipoAprovac___1");
		if (numAprVez.indexOf("POOL") > -1) {
			form.setValue("hiddenNumeroDaVez", "1");
		};

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 155");

		var fields = new Array("colleaguePK.colleagueId", "mail", "colleagueName");
		var c2 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c2);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);

		if (form.getValue('hiddenRetornouRevisao') == "Sim") {
			form.setValue('statusCPGeraTitulo', 'x');
		}

		var numAprovacDavez = form.getValue("hiddenNumeroDaVez");

		log.info("SOMBRIO APROVACAO displayFields: " + numAprovacDavez + ":" + colaborador.getValue(0, "colleagueName"));

		/*	form.setValue("idMatrAprovador___" + numAprovacDavez,colaborador.getValue(0, "colleaguePK.colleagueId"));
			form.setValue("idNomeAprovador___" + numAprovacDavez,colaborador.getValue(0, "colleagueName"));
			form.setValue("idEmailAprovador___" + numAprovacDavez,colaborador.getValue(0, "mail"));*/


		log.info("SOMBRIO APROVACAO displayFields - dados-tela:" +
			form.getValue("idMatrAprovador___" + numAprovacDavez) + " - " +
			form.getValue("idNomeAprovador___" + numAprovacDavez) + " - " +
			form.getValue("idEmailAprovador___" + numAprovacDavez)
		);

		var fullDate = new Date();

		var hrs = fullDate.getHours();
		var min = fullDate.getMinutes();
		var sec = fullDate.getSeconds();

		var hora = " " + ((hrs < 10) ? "0" : "") + hrs + ":";
		hora += ((min < 10) ? "0" : "") + min + ":";
		hora += ((sec < 10) ? "0" : "") + sec + " ";

		var areaSolic = form.getValue('areaSolic');

		if (areaSolic != 8 && areaSolic != 9 && areaSolic != 10) {
			form.setValue("idDataAprov___" + numAprovacDavez, buscaDataAtual());
			form.setValue("idHoraAprov___" + numAprovacDavez, hora);
		}

	}
	else if (numAtividade == "55") {
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 55");

		var c3 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c3);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('nmFiscal', colaborador.getValue(0, "colleagueName"));
		form.setValue('hiddenMatrFiscal', getValue("WKUser"));
		form.setValue('dtFiscal', buscaDataAtual());

		var fullDate = new Date();
		var hrs = fullDate.getHours();
		var min = fullDate.getMinutes();
		var sec = fullDate.getSeconds();

		var hora = " " + ((hrs < 10) ? "0" : "") + hrs + ":";
		hora += ((min < 10) ? "0" : "") + min + ":";
		form.setValue('hrFiscal', hora);
	}
	else if (numAtividade == "247") {
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 257");

		var c3 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c3);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('nmAvalPrimNivel', colaborador.getValue(0, "colleagueName"));
		form.setValue('dtAvalPrimNivel', buscaDataAtual());

		var fullDate = new Date();
		var hrs = fullDate.getHours();
		var min = fullDate.getMinutes();
		var sec = fullDate.getSeconds();

		var hora = " " + ((hrs < 10) ? "0" : "") + hrs + ":";
		hora += ((min < 10) ? "0" : "") + min + ":";
		hora += ((sec < 10) ? "0" : "") + sec + " ";

		form.setValue('hrAvalPrimNivel', hora);
	}
	else if (numAtividade == "142") {
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 142");

		var c4 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c4);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('nmContasPagar', colaborador.getValue(0, "colleagueName"));
		form.setValue('hiddenMatrContasPagar', getValue("WKUser"));

		form.setValue('dtContasPagar', buscaDataAtual());

		var fullDate = new Date();
		var hrs = fullDate.getHours();
		var min = fullDate.getMinutes();
		var sec = fullDate.getSeconds();

		var hora = " " + ((hrs < 10) ? "0" : "") + hrs + ":";
		hora += ((min < 10) ? "0" : "") + min + ":";
		hora += ((sec < 10) ? "0" : "") + sec + " ";

		form.setValue("hrContasPagar", hora);

	}
	else if (numAtividade == "5") {
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 5");

		var c5 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
		constraints = new Array(c5);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
		form.setValue('nmCPGeraTitulo', colaborador.getValue(0, "colleagueName"));
		form.setValue('hiddenMatrContasPagar', getValue("WKUser"));

		form.setValue('dtCPGeraTitulo', buscaDataAtual());

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 5");
		form.setHidePrintLink(false);

		//para setar - chama apenas uma vez o dataset
		var retorno = setaAmbiente();
		var LOGININTEGRADOR = retorno.getValue(0, "login");
		var PASSWORDINTEGRADOR = retorno.getValue(0, "password");
		var pastaOrigem = retorno.getValue(0, "pastaOrigem");
		var pastaDestino = retorno.getValue(0, "pastaDestino");
		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIVIDADE 5 - setaAmbiente -  LOGININTEGRADOR: " + LOGININTEGRADOR +
			" - PASSINTEGRADOR : " + PASSWORDINTEGRADOR +
			" pastaOrigem: " + pastaOrigem +
			" pastaDestino: " + pastaDestino);

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIV 5 - BUSCA PERMISSAO USUARIO NA PASTA DA AREA (DESTINO) - INICIO");

		var retornoPermissao = docAPI.getUserPermissions(parseInt(pastaDestino), 1000);

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIV 5 - DEPOIS retornoPermissao:  " + retornoPermissao);

		log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIV 5 - BUSCA PERMISSAO USUARIO NA PASTA DA AREA (DESTINO) - FIM");

		// SE RETORNO DA PERMISSAO FOR -1 EH PORQUE NAO TEM ACESSO, DE 0 EM DIANTE ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° LEITURA EM DIANTE
		if (retornoPermissao < 0) {

			log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIV 5 - BUSCA GRUPO DO USUARIO - INICIO");

			// BUSCA GRUPOS DO USUARIO
			var lEncontrouGroup = false;

			lEncontrouGroup = docAPI.isUserInGroup('PASTASOLICPAGTO');

			if (lEncontrouGroup == false) {
				form.setValue('hiddenEncontrouGroupSolicPag', "Nao");
				log.info("SOLICPAGAMENTO - DISPLAY FIELDS - ATIV 5 - FALSE - NAO ENCONTROU PASTASOLICPAGTO");
			}
			else {
				form.setValue('hiddenEncontrouGroupSolicPag', "Sim");
			}
			//FIM BUSCA GRUPO USUARIO

		} // RETORNO PERMISSAO
		else {
			form.setValue('hiddenEncontrouGroupSolicPag', "Sim");
		}
		// FIM VERIFICACAO PERMISSAO 

		log.info("AUXILIOCRECHE - DISPLAY FIELDS - ATIV 4 - BUSCA GRUPO DO USUARIO - FIM");

	}

	form.setValue("hiddenValorBrutoAnterior", form.getValue("valorBruto"));
	form.setValue("hiddenAcrescimoAnterior", form.getValue("acrescimo"));
	form.setValue("hiddenDecrescimoAnterior", form.getValue("decrescimo"));
	form.setValue("hiddenValorInssAnterior", form.getValue("valorInss"));
	form.setValue("hiddenValorIssAnterior", form.getValue("valorIss"));
	form.setValue("hiddenValorIrrfAnterior", form.getValue("valorIrrf"));
	form.setValue("hiddenValorCsllAnterior", form.getValue("valorCsll"));
	form.setValue("hiddenValorPisAnterior", form.getValue("valorPis"));
	form.setValue("hiddenValorCofinsAnterior", form.getValue("valorCofins"));
	form.setValue("hiddenValorMultaAnterior", form.getValue("valorMulta"));
	form.setValue("hiddenValorJurosAnterior", form.getValue("valorJuros"));
	form.setValue("hiddenValorCMonAnterior", form.getValue("valorCMon"));
	form.setValue("hiddenValorTaxasAnterior", form.getValue("valorTaxas"));
	form.setValue("hiddenValorPagarAnterior", form.getValue("valorPagar"));


	log.info("SOLICPAGAMENTO - DISPLAY FIELDS - FIM");

	function verificaDiaSemana() {

		// para sugerir a data de pagamento para a data de hoje + 4 dias, sem considerar o final de semana - sabado e domingo. Obs: nao trata feriados.

		var data = new Date();

		diaSemana = data.getDay();

		//dom
		if (diaSemana == 0) { data.setDate(data.getDate() + 4); numDias = "4"; }
		//seg
		if (diaSemana == 1) { data.setDate(data.getDate() + 4); numDias = "4"; }
		//ter
		if (diaSemana == 2) { data.setDate(data.getDate() + 6); numDias = "4"; }
		//qua
		if (diaSemana == 3) { data.setDate(data.getDate() + 6); numDias = "6"; }
		//qui
		if (diaSemana == 4) { data.setDate(data.getDate() + 6); numDias = "6"; }
		//sex
		if (diaSemana == 5) { data.setDate(data.getDate() + 6); numDias = "6"; }
		//sab
		if (diaSemana == 6) { data.setDate(data.getDate() + 5); numDias = "5"; }

		var dia = data.getDate().toString();
		if (dia.length == 1) { dia = 0 + dia; }
		var mes = (data.getMonth() + 1).toString();
		if (mes.length == 1) { mes = 0 + mes; }
		var ano = data.getFullYear().toString();

		var dataPagto = dia + "/" + mes + "/" + ano;

		form.setValue("dataPagamento", dataPagto);

	} // fim function

	function setaAmbiente() {
		log.info("cris - setaAmb 1");
		// retorna um array com todos os dados do ambiente
		var c1 = DatasetFactory.createConstraint("cod_def_proces", "SolicitarPagamento", "SolicitarPagamento", ConstraintType.MUST);
		constraints = new Array(c1);
		var res = DatasetFactory.getDataset("dsParamAmbFormWkf", null, constraints, null);
		if (res) {
			if (res.values.length > 0) { return res; }
			else { return "erro ao retornar dados de ambiente - nao retorou registro"; }
		}
		else { return "erro ao retornar dados de ambiente - retornou nulo"; }
	}

} // fim display fields 

function buscaDataAtual() {
	var data = new Date();
	var formatoData = new java.text.SimpleDateFormat("dd/MM/yyyy");

	return formatoData.format(data);
}