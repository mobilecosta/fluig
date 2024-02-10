function beforeTaskSave(colleagueId,nextSequenceId,userList){
	var atividade = getValue("WKNumState");
	
	if(atividade == 14)
		hAPI.setCardValue("localizacao", "Verificar Inconsistencias");
	if(atividade == 12)
		hAPI.setCardValue("localizacao", "Processando pagamento");
	if(atividade == 17)
		hAPI.setCardValue("localizacao", "Processando pagamento");
	if(atividade == 20)
		hAPI.setCardValue("localizacao", "Processando pagamento");
}