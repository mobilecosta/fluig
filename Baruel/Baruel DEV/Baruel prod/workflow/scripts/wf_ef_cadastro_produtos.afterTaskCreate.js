function afterTaskCreate(colleagueId){
	
	var WKNumProces = getValue("WKNumProces");
	var WKNumState = getValue("WKNumState");
	
	if (WKNumState == 0 || WKNumState == 4) {
		hAPI.setCardValue("nrProcesso", WKNumProces);
	}
	
}