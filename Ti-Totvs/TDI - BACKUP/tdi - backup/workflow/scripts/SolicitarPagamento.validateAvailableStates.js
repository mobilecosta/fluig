function validateAvailableStates(iCurrentState,stateList){
	var ativAtual   = getValue("WKNumState");	
	var processo    = getValue("WKNumProces");    
    var numcompany  = new java.lang.Integer(getValue("WKCompany")); 
	var senha       = getValue("WKUserPassword");
    var usuario     = getValue("WKUser");

	log.info("SOLICPAGAMENTO - FUNCAO validateAvailableStates - INICIO : " +
			 "PROCESSO: " + processo + 
			 "ativ atual: " + ativAtual + 
			 " processo: " + processo +
			 " usuario: " + usuario +
			 "statusCPGeraTitulo: " + hAPI.getCardValue("statusCPGeraTitulo") +
			 "hiddenValidaTitulo: " + hAPI.getCardValue("hiddenValidaTitulo") 
			 );
	
	// foi criada uma condicao nova na atividade 133
	//if(ativAtual == "5"){
	//	 if (hAPI.getCardValue("hiddenValidaTitulo") != "NOK"){
	//		 hAPI.setCardValue("hiddenValidaTitulo","OK"); 
	//	 } 
	//}
	
}