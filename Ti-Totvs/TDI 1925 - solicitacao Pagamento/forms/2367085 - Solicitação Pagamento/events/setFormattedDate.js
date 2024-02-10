function setFormattedDate(form){
	var regEx = /^\d{4}-\d{2}-\d{2}$/;
	
	if (form.getValue("dtRegistro").match(regEx)) {
		var split = form.getValue("dtRegistro").split('-');
		form.setValue("dtRegistro", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dataPagamento").match(regEx)) {
		var split = form.getValue("dataPagamento").split('-');
		form.setValue("dataPagamento", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dtAvalPrimNivel").match(regEx)) {
		var split = form.getValue("dtAvalPrimNivel").split('-');
		form.setValue("dtAvalPrimNivel", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dtFiscal").match(regEx)) {
		var split = form.getValue("dtFiscal").split('-');
		form.setValue("dtFiscal", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dtContasPagar").match(regEx)) {
		var split = form.getValue("dtContasPagar").split('-');
		form.setValue("dtContasPagar", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dtCPGeraTitulo").match(regEx)) {
		var split = form.getValue("dtCPGeraTitulo").split('-');
		form.setValue("dtCPGeraTitulo", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	if (form.getValue("dtCPGeraTitulo").match(regEx)) {
		var split = form.getValue("dtCPGeraTitulo").split('-');
		form.setValue("dtCPGeraTitulo", split[2] + '/' + split[1] + '/' + split[0]);
	}
	
	var indexes = form.getChildrenIndexes("tbAprovacoes");
	
    for (var i = 0; i < indexes.length; i++) {    
    	var ambiente = form.getValue("idDataAprov___" + indexes[i]);
   
    	if (form.getValue("idDataAprov___" +indexes[i]).match(regEx)) {
    		var split = form.getValue("idDataAprov___"+indexes[i]).split('-');
    		form.setValue("idDataAprov___"+indexes[i], split[2] + '/' + split[1] + '/' + split[0]);
    	}
    }
}