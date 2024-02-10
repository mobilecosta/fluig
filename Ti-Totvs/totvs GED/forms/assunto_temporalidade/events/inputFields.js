function inputFields(form){
	var cd_assunto = form.getValue("cd_assunto");
	var nm_assunto = form.getValue("nm_assunto");
	var periodicidade = form.getValue("periodicidade");
	
	form.setValue("descritor", cd_assunto + ' - ' + nm_assunto + ' - ' + periodicidade);
}