function afterTaskComplete(colleagueId,nextSequenceId,userList){
	var numcompany  = new java.lang.Integer(getValue("WKCompany")); 
	var processo 	= getValue("WKNumProces");    
	var ativAtual 	= getValue("WKNumState"); // onde esta antes de entrar na proxima atividade
	var usuario 	= getValue("WKUser");
	var isMobile = getValue("WKMobile");
	var comentario  = "";
	var observacoes ;
	
	log.info ("*************************SOLICPAGTOCRIS - AFTER TASK COMPLETE **********************" + 
			  " - processo: " + processo + " - ATIVIDADE: " + ativAtual + " - PROXIMA ATIVIDADE: "+nextSequenceId);

	if(nextSequenceId == 247){
		var papel = "SOLIC_PAGAMENTO_VALIDACAO_PRIMEIRO_NIVEL";
		var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.companyId", getValue("WKCompany"), getValue("WKCompany"), ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", papel, papel,ConstraintType.MUST);
		var dataset = DatasetFactory.getDataset("workflowColleagueRole",null,[c1,c2],null);
		log.info("dataset.rowCount: "+dataset.rowsCount);
		if(dataset && dataset.rowsCount > 0){
			if(dataset.rowsCount == 1){
				userList.clear();
				userList.add(dataset.getValue(0,"workflowColleagueRolePK.colleagueId"));
				log.info("colleagueId: "+dataset.getValue(0,"workflowColleagueRolePK.colleagueId"));
			}
		}
	}
	
	if (ativAtual == "155"){
		
		hAPI.setCardValue("hiddenGestorPassou","sim");	
		if(nextSequenceId == 2)
			hAPI.setCardValue("hiddenGestorAprovou","sim");						
		
		var numAprovacDavez = hAPI.getCardValue("hiddenNumeroDaVez");
		
		if(hAPI.getCardValue("idDataAprov___"+numAprovacDavez) == ""){
			 var today = new Date();
			 var formatoData = new java.text.SimpleDateFormat("dd/MM/yyyy");
			 var formatoHora = new java.text.SimpleDateFormat("HH:mm:ss");
			 
			 var data = formatoData.format(today);
			 var hora = formatoHora.format(today);
			 
			 hAPI.setCardValue("idDataAprov___"+numAprovacDavez,data);
			 hAPI.setCardValue("idHoraAprov___"+numAprovacDavez,hora);
			 
			 var formatoDataHora = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
				
			 var c1 = DatasetFactory.createConstraint("processInstanceId", processo, processo, ConstraintType.MUST);
			 var c2 = DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST);
			
			 var ds = DatasetFactory.getDataset("processTask", null, [c1,c2], null);
			
			 var deadline = ds.getValue(0, "deadline");
			 var pDeadline = formatoDataHora.format(deadline);
			 log.info("#pDeadline: "+pDeadline);
			
			 var dataAtual = new Date();
			 var pDataAtual = formatoDataHora.format(dataAtual);
			 log.info("#pDataAtual: "+pDataAtual);	
			 
			 log.info("Solicitacao "+processo+" aprovada via mobile? = "+isMobile);
			 
			 if((pDataAtual>pDeadline)){
				 if (isMobile == null || isMobile==false){
					 hAPI.setCardValue("idObsAprov___"+numAprovacDavez,"Aprovação compulsória, sem recusa do aprovador.");
			 }} 
		}
	} 
	else if (ativAtual == "55"){
		hAPI.setCardValue("hiddenFiscalPassou","sim");
		if(nextSequenceId == 43)
			hAPI.setCardValue("hiddenFiscalAprovou","sim");	
	}
	else if (ativAtual == "142"){
		hAPI.setCardValue("hiddenContasPagarPassou","sim");		
		if(nextSequenceId == 43)
			hAPI.setCardValue("hiddenContasPagarAprovou","sim");	
	}
	else if (ativAtual == "5"){
		hAPI.setCardValue("hiddenCPGeraTituloPassou","sim");
		if(nextSequenceId == 133)
			hAPI.setCardValue("hiddenCPGeraTituloAprovou","sim");	
	}
	
	// COMPARANDO VALORES E ALIMENTANDO O HISTORICO
	if (ativAtual == "155" || ativAtual == "55" || ativAtual == "142" || ativAtual == "5" || ativAtual == "6"){ 

		log.info ("SOLICPAGTO - AFTER TASK COMPLETE - atividade " + ativAtual);

		var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so

		
		if (form.get("hiddenValorBrutoAnterior") != form.get("valorBruto")) {
			comentario = comentario +
						"VALOR BRUTO de: " + form.get("hiddenValorBrutoAnterior") + " Para: " + form.get("valorBruto") + "<br>";
		}
		if (form.get("hiddenAcrescimoAnterior") != form.get("acrescimo")) {
			comentario = comentario +
						"ACRESCIMO de: " + form.get("hiddenAcrescimoAnterior") + " Para: " + form.get("acrescimo") + "<br>";
		}
		if (form.get("hiddenDecrescimoAnterior") != form.get("decrescimo")) {
			comentario = comentario +
						"DECRESCIMO de: " + form.get("hiddenDecrescimoAnterior") + " Para: " + form.get("decrescimo") + "<br>";
		}
		if (form.get("hiddenValorInssAnterior") != form.get("valorInss")) {
			comentario = comentario +
						"Valor Inss de: " + form.get("hiddenValorInssAnterior") + " Para: " + form.get("valorInss") + "<br>";
		}
		if (form.get("hiddenValorIssAnterior") != form.get("valorIss")) {
			comentario = comentario +
						"Valor Iss de: " + form.get("hiddenValorIssAnterior") + " Para: " + form.get("valorIss") + "<br>";
		}
		if (form.get("hiddenValorIrrfAnterior") != form.get("valorIrrf")) {
			comentario = comentario +
						"Valor Irrf de: " + form.get("hiddenValorIrrfAnterior") + " Para: " + form.get("valorIrrf") + "<br>";
		}
		if (form.get("hiddenValorCsllAnterior") != form.get("valorCsll")) {
			comentario = comentario +
						"Valor Csll de: " + form.get("hiddenValorCsllAnterior") + " Para: " + form.get("valorCsll") + "<br>";
		}
		if (form.get("hiddenValorPisAnterior") != form.get("valorPis")) {
			comentario = comentario +
						"Valor Pis de: " + form.get("hiddenValorPisAnterior") + " Para: " + form.get("valorPis") + "<br>";
		}
		if (form.get("hiddenValorCofinsAnterior") != form.get("valorCofins")) {
			comentario = comentario +
						"Valor Cofins de: " + form.get("hiddenValorCofinsAnterior") + " Para: " + form.get("valorCofins") + "<br>";
		}
		if (form.get("hiddenValorMultaAnterior") != form.get("valorMulta")) {
			comentario = comentario +
						"Valor Multa de: " + form.get("hiddenValorMultaAnterior") + " Para: " + form.get("valorMulta") + "<br>";
		}
		if (form.get("hiddenValorJurosAnterior") != form.get("valorJuros")) {
			comentario = comentario +
						"Valor Juros de: " + form.get("hiddenValorJurosAnterior") + " Para: " + form.get("valorJuros") + "<br>";
		}
		if (form.get("hiddenValorCMonAnterior") != form.get("valorCMon")) {
			comentario = comentario +
						"Valor Correcao Mon. de: " + form.get("hiddenValorCMonAnterior") + " Para: " + form.get("valorCMon") + "<br>";
		}
		if (form.get("hiddenValorTaxasAnterior") != form.get("valorTaxas")) {
			comentario = comentario +
						 "Valor Taxas de: " + form.get("hiddenValorTaxasAnterior") + " Para: " + form.get("valorTaxas") + "<br>";
		}
		if (form.get("hiddenValorPagarAnterior") != form.get("valorPagar")) {
			comentario = comentario + 
						"O VALOR A PAGAR ficou De: " + form.get("hiddenValorPagarAnterior") + " Para: " + form.get("valorPagar") + "<br>";
		}

		
		// testa so no final, se alterou alguma coisa a variavel comentario estara dif de branco
		if (comentario == ""){
			if (ativAtual == "6"){
				hAPI.setCardValue("hiddenSolicCorrecaoAlterouVal","Nao");		
			} 
			else if (ativAtual == "155"){
				hAPI.setCardValue("hiddenGestorAlterouValor","Nao");		
			} 
			else if (ativAtual == "55"){
				hAPI.setCardValue("hiddenFiscalAlterouValor","Nao");
			}
			else if (ativAtual == "142"){
				hAPI.setCardValue("hiddenContasPagarAlterouValor","Nao");				
			}
			else if (ativAtual == "5"){
				hAPI.setCardValue("hiddenCPGeraTituloAlterouValor","Nao");
			}
		} 
		else{
			comentario = "Nesta atividade foram alterados os seguintes campos: <br>" +
						 comentario ;
			
			if (ativAtual == "6"){
				hAPI.setCardValue("hiddenSolicCorrecaoAlterouVal","Sim");		
			} 
			else if (ativAtual == "155"){
				hAPI.setCardValue("hiddenGestorAlterouValor","Sim");		
			} 
			else if (ativAtual == "55"){
				hAPI.setCardValue("hiddenFiscalAlterouValor","Sim");
			}
			else if (ativAtual == "142"){
				hAPI.setCardValue("hiddenContasPagarAlterouValor","Sim");				
			}
			else if (ativAtual == "5"){
				hAPI.setCardValue("hiddenCPGeraTituloAlterouValor","Sim");
			}
		}
		
		log.info ("SOLICPAGTOCRIS - AFTER TASK COMPLETE - INICIO OBSERVACOES ");
		
		observacoes = "";
		
		if (ativAtual == "155"){
			var numAprovacDavez = form.get("hiddenNumeroDaVez");
			observacoes = "Observacoes Aprovacao Gestor - responsavel : " + form.get("idNomeAprovador___" + numAprovacDavez) + 
						  " -- " + form.get("idObsAprov___" + numAprovacDavez);
		}
		else if (ativAtual == "55"){
			observacoes = "Observacoes Aprovacao Area Fiscal - responsavel : " + form.get("nmFiscal") + " -- " + form.get("observacoesFiscalAprovacao");
		}
		else if (ativAtual == "142"){
			observacoes = "Observacoes Aprovacao Gestor Contas a Pagar - responsavel : " + form.get("nmContasPagar") + " -- " + form.get("observacoesContasPagarAprovac");
		}
		else if(ativAtual == "5"){
			observacoes = "Observacoes Aprovacao Area Contas a Pagar  - responsavel : " + form.get("nmCPGeraTitulo") + " -- " + form.get("observacoesCPGeraTituloAprovac");
		}

		if (observacoes != ""){
			comentario = observacoes + "<br><br>" + comentario;
		}
		
		log.info ("SOLICPAGTO - comentario: " + comentario);
		
		if(comentario != "")
			hAPI.setTaskComments(usuario,processo,0,comentario);
		
	} // if (ativAtual == "155" || ativAtual == "55" || ativAtual == "142" || ativAtual == "5" || ativAtual == "6"){
	
	
	// PROCESSO APRVACOES GESTORES GRAVACAO DO PROXIMO
	if (ativAtual == "155" ){
		
		log.info ("SOLICPAGTO - AFTER TASK COMPLETE - atividade " + ativAtual);
		
		log.info ("ANTES: hAPI.getCardValue(hiddenAprovadorDaVez): " + hAPI.getCardValue("hiddenAprovadorDaVez") +
				  "hAPI.getCardValue(hiddenNumTotAprovac): " + hAPI.getCardValue("hiddenNumTotAprovac") +
				  "hAPI.getCardValue(hiddenNumeroDaVez): " + hAPI.getCardValue("hiddenNumeroDaVez")
				  );
		
		var numAprovacDavez = hAPI.getCardValue("hiddenNumeroDaVez");
		
		/* PATRICIA SOLICITOU RETIRADA DA EXPIRACAO DE TAREFAS QUANDO CHEGASSE NA DATA DE PAGAMENTO - DE TODAS AS ATIVIDADES*/
		/* POREM ESTA LOGICA ? QUANDO ? DIF DE 222, ENTAO MELHOR NAO RETIRAR*/
		//Se diferente n?o soma hiddenNumeroDaVez
		if(nextSequenceId == "2") {

			log.info("SOLICPAGTO - AFTER TASK COMPLETE - nextSequenceId diferente 222");
			
			if (parseInt(numAprovacDavez) <= parseInt(hAPI.getCardValue("hiddenNumTotAprovac"))) { 
			
				hAPI.setCardValue("hiddenNumeroDaVez", (parseInt(numAprovacDavez) + 1).toString());
				
				if (parseInt(numAprovacDavez) < parseInt(hAPI.getCardValue("hiddenNumTotAprovac"))) {
					hAPI.setCardValue("hiddenAprovadorDaVez", "USUAR:" + hAPI.getCardValue("idMatrAprovador___" + (parseInt(numAprovacDavez) + 1).toString()));
				}
			}
		
		}
		
		log.info ("DEPOIS: hAPI.getCardValue(hiddenAprovadorDaVez): " + hAPI.getCardValue("hiddenAprovadorDaVez") +
				  "hAPI.getCardValue(hiddenNumTotAprovac): " + hAPI.getCardValue("hiddenNumTotAprovac") +
				  "hAPI.getCardValue(hiddenNumeroDaVez): " + hAPI.getCardValue("hiddenNumeroDaVez")
				  );
		
	}
	
	if (ativAtual != "5" ){
		// nao retirar - algumas solicitacoes colocaram este hidden como "sim" na ativ 155 de forma incorreta.
		hAPI.setCardValue("hiddenCriouFichaPasta","");
		log.info ("SOLICPAGTO - AFTER TASK COMPLETE - atividade # 5 - zera hiddenficha- ativ atual:" + ativAtual);
	}

	if (ativAtual == "5" ){
		//se for aprovado (1) entao gera o doc espelho e encerra a solicitacao.
		// se for revisar e reprovado nao gera a ficha - validacao do status tambem no validate-forms
		
		var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so

		log.info ("SOLICPAGTO - AFTER TASK COMPLETE - atividade igual a  5 - statusCPGeraTitulo:" + form.get("statusCPGeraTitulo"));
		if (form.get("statusCPGeraTitulo") == "1") {
			hAPI.setCardValue("hiddenCriouFichaPasta","Sim");
			log.info ("SOLICPAGTO - AFTER TASK COMPLETE - atividade igual a  5 - hiddenCriouFichaPasta:" + form.get("hiddenCriouFichaPasta"));
		}
	}

	log.info ("SOLICPAGTO - AFTER TASK COMPLETE - FIM ");
}