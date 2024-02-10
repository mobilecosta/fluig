function afterTaskCreate(colleagueId) {
	log.info("#afterTaskCreate - SEM PO");
	var sequenceId = getValue("WKCurrentState");
	
	if(sequenceId == Activity.AGUARDAR_VENCIMENTO){
		 var numProcess = getValue('WKNumProces');
		 
         var threadProcess = 0; 
         
         var dataPrazo = parseOrFormatDate(hAPI.getCardValue("dt_pagamento"),"parse","dd/MM/yyyy");
         log.info("#dataPrazo: "+dataPrazo);
         dataPrazo.setDate(dataPrazo.getDate()-7);
         log.info("#dataPrazo2: "+dataPrazo);
         var horaPrazo = (24*60*60) - 1;                            
         
         hAPI.setDueDate(numProcess, threadProcess, colleagueId, dataPrazo, horaPrazo);
	}
}