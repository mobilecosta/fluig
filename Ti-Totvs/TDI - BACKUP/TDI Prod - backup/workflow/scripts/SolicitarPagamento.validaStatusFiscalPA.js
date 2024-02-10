function validaStatusFiscalPA(){
	if (hAPI.getCardValue("descricaoItem") == "00"  && 
	    hAPI.getCardValue("hiddenFiscalPassou") == "") {
		return true;
	}
	else{
		return false;
	}

	//return false;
}