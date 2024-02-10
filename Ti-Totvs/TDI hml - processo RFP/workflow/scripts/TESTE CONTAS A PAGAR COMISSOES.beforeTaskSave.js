function beforeTaskSave(colleagueId,nextSequenceId,userList){
	var atividade = getValue("WKNumState");
	
	if(nextSequenceId == 14)
		hAPI.setCardValue("localizacao", "Verificar Inconsistências");
	if(nextSequenceId == 12)
		hAPI.setCardValue("localizacao", "Processo em validação");
	if(nextSequenceId == 17)
		hAPI.setCardValue("localizacao", "Lançamento fiscal");
	if(nextSequenceId == 20)
		hAPI.setCardValue("localizacao", "Processando pagamento");
}