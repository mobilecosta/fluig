function inputFields(form){
	var cd_coligada = form.getValue("cd_coligada");
	var cd_filial = form.getValue("cd_filial");
	var nm_filial = form.getValue("nm_filial");
	
	form.setValue("descritor", cd_coligada + ' - ' + cd_filial + ' - ' + nm_filial);
}