function validaGestor(){
	
	if (hAPI.getCardValue("hiddenNumTotAprovac") == hAPI.getCardValue("hiddenNumeroDaVez") && 
	    (hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) =="x" || 
	     hAPI.getCardValue("idStatusAprov___" + hAPI.getCardValue("hiddenNumeroDaVez")) == null)){
		return true;
	}
	else{
		return false;		
	}

	//return false;

}