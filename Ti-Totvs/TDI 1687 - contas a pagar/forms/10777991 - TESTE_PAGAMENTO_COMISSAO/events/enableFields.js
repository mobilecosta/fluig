function enableFields(form){
	
	var numAtividade = getValue("WKNumState");
	var numUser = getValue("WKUser");
	
	form.setShowDisabledFields(true);
	
	if (numAtividade == 0 || numAtividade == 4) {
		form.setEnabled("idCanal", true);
	}
	
	if (numAtividade == 4 || numAtividade == 14) {
		form.setEnabled("idCanal", true);
		form.setEnabled("idRazao", true);
		form.setEnabled("idCNPJ", true);
		form.setEnabled("idFornecedor", true);
		form.setEnabled("idPedido", true);
	}

    if (numAtividade == 12 ) {
        form.setEnabled("nomeAprovador", true);
        form.setEnabled("idAprovado", true);
      
   }
    
	if (numAtividade == 17 ) {
	    form.setEnabled("nomeAprovadorFiscal", true);
	    form.setEnabled("idAprovadorFiscal", true);
	
	}
    
	if (numAtividade == 20 ) {
		form.setEnabled("idCanal", true);
	    form.setEnabled("idRazao", true);
	    form.setEnabled("idCNPJ", true);
	    form.setEnabled("idFornecedor", true);
	    form.setEnabled("idPedido", true);
		form.setEnabled("nomeAprovador", true);
	    form.setEnabled("idAprovado", true);         
	    form.setEnabled("nomeAprovadorFiscal", true);
	    form.setEnabled("idAprovadorFiscal", true);
	}
}