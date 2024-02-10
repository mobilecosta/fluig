function geraLogCondSPagtoGest(){
	//FAZ LOG DE QUAL CONDICAO ENTRARA - NAO HA REGRA DE NEGOCIO!!	

	log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - INICIO");
	
	log.info ("DADOS: " +
			" - hiddenRetornouRevisao" + hAPI.getCardValue('hiddenRetornouRevisao') +
			" - hiddenNumTotAprovac" + hAPI.getCardValue("hiddenNumTotAprovac")+
			" - hiddenNumeroDaVez" + hAPI.getCardValue("hiddenNumeroDaVez") +
			" - idStatusAprov___" + hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) 
			);
	
	
	if (hAPI.getCardValue('hiddenRetornouRevisao') != ""){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 2 - corrigir");
	}
	else if (hAPI.getCardValue("hiddenNumTotAprovac") >= hAPI.getCardValue("hiddenNumeroDaVez") &&  
			 hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) =="3"){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 3 - corrigir");
	}
	else if (hAPI.getCardValue("hiddenNumTotAprovac") >= hAPI.getCardValue("hiddenNumeroDaVez") &&  
			 hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) =="2"){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 4 - reprovado");
	}
	else if (hAPI.getCardValue("hiddenNumTotAprovac") == hAPI.getCardValue("hiddenNumeroDaVez") &&  
			 hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) =="1"){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 5 - ativ autom 43 - item eh pa?");
	}
	else if (hAPI.getCardValue("hiddenNumTotAprovac") < hAPI.getCardValue("hiddenNumeroDaVez")){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 6 - ativ autom - item eh pa?");
	}
	// condicao 7 - funcao valida gestor
	
	else if (hAPI.getCardValue("hiddenNumTotAprovac") != hAPI.getCardValue("hiddenNumeroDaVez")){
		log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - CONDICAO 8 - gestor");
	}
	
	log.info ("SOLICPAGAMENTO - FUNCAO geraLogCondSPagtoGest - FIM");

	return false; // sempre retornara false

}