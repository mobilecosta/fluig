function beforeSendData(customFields,customFacts){
	
    customFields[0] = hAPI.getCardValue("dt_pagamento").toString();    
	customFields[1] = hAPI.getCardValue("nm_centro_custo").toString();
    
	customFields[2] = hAPI.getCardValue("vl_total_tributos").toString();
	customFields[3] = hAPI.getCardValue("vl_total_tributos_bruto").toString();
        
    var vl_total_tributos_aux = hAPI.getCardValue("vl_total_tributos").replace(".","").replace(".","").replace(",",".");	
    customFacts[0]=java.lang.Double.parseDouble(vl_total_tributos_aux);

    var vl_total_tributos_bruto_aux = hAPI.getCardValue("vl_total_tributos_bruto").replace(".","").replace(".","").replace(",",".");	
    customFacts[1]=java.lang.Double.parseDouble(vl_total_tributos_bruto_aux);
    
}
