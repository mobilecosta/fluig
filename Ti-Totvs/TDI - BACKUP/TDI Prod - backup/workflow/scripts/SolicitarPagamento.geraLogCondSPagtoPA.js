function geraLogCondSPagtoPA(){
	
	//FAZ LOG DE QUAL CONDICAO ENTRARA - NAO HA REGRA DE NEGOCIO!!	
	log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - INICIO");

	

	log.info (" %% DADOS: " +
			" - hiddenVaiParaAprovPA: " + hAPI.getCardValue('hiddenVaiParaAprovPA') +
			" - descricaoItem : " + hAPI.getCardValue("descricaoItem")+
			" - statusFiscal : " + hAPI.getCardValue("statusFiscal") +
			" - statusContasPagar : " + hAPI.getCardValue("statusContasPagar") +
			" %% "
			);
	
	
	if ( hAPI.getCardValue("hiddenVaiParaAprovPA") == "Nao" || hAPI.getCardValue("descricaoItem") != "00"){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 2 - VAI PARA ATIV 133 - DECISAO CTAS A PAGAR");
	}
	if (hAPI.getCardValue("descricaoItem") == "00"  && hAPI.getCardValue("statusFiscal") == "1" && 
		hAPI.getCardValue("statusContasPagar") == "1"){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 3 - VAI PARA ATIV 133 - DECISAO CTAS A PAGAR");
	}
	if (hAPI.getCardValue("statusContasPagar") == "2"){
			log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 4 - REPROVADO");
	}
	if (hAPI.getCardValue("statusContasPagar") == "3"){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 5 - REVISAR");
	}
	if (hAPI.getCardValue("statusFiscal") == "2"){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 6 - REPROVADO");
	}
	if (hAPI.getCardValue("statusFiscal") == "3"){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 7- REVISAR");
	}
	if (hAPI.getCardValue("descricaoItem") == "00"  && 
		(hAPI.getCardValue("statusFiscal") == "x" || hAPI.getCardValue("statusFiscal") == null)){
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 8- 55 APROVAC FISCAL PA");
	}
	if (hAPI.getCardValue("descricaoItem") == "00"  && 
		hAPI.getCardValue("statusFiscal") != "x" && hAPI.getCardValue("statusFiscal") != null && hAPI.getCardValue("statusFiscal") != "" &&
		(hAPI.getCardValue("statusContasPagar") == "x" || hAPI.getCardValue("statusContasPagar") == null || hAPI.getCardValue("statusContasPagar") == "")) {
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 9 - 142 CONTAS A PAGAR PA");
	}
	if (true){		
		log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - CONDICAO 10 - 142 CONTAS A PAGAR PA");
	}

	
	log.info("SOLICPAGAMENTO - geraLogCondSPagtoPA - FIM");
	
	return false; // sempre retornara false

}