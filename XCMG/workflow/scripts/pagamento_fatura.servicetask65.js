function servicetask65(attempt, message) {
	log.info(_log + " - servicetask65 - pagar");
	var quais = precisaIntegrarQuaisTitulos();
	if(quais.pagar){
		integrarRecibos();
	}
	else{
		log.info(_log + " - servicetask65 - não gera títulos a pagar");
	}
}