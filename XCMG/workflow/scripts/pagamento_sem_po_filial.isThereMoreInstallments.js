function isThereMoreInstallments(){
	log.info("#isThereMoreInstallments - SEM PO");
	var thereIs = false;
	var indexes = hAPI.getChildrenIndexes("tb_parcelas");
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var paid = hAPI.getCardValue("nm_pago___"+row);
		log.info("#paid: "+paid);
		
		if(paid != "sim"){
			thereIs = true;
			break
		}
		
	}
	log.info("#thereIs: "+thereIs);
	return thereIs;
}