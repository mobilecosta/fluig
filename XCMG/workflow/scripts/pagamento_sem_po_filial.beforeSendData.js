function beforeSendData(customFields,customFacts){
	
	
    customFields[0] = hAPI.getCardValue("dt_pagamento").toString();    
	customFields[1] = hAPI.getCardValue("nm_centro_custo").toString();
    customFields[2] = hAPI.getCardValue("vl_total").toString();
    
    customFacts[0] = 999.99;
    
    var vl_total_aux = hAPI.getCardValue("vl_total").replace(".","").replace(".","").replace(",",".");
	
    customFacts[1]=java.lang.Double.parseDouble(vl_total_aux);
}
