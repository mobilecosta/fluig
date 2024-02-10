function displayFields(form,customHTML){

    var formMode = form.getFormMode();
	var mobile = form.getMobile();
	var activity = getValue("WKNumState");
	var user = getValue("WKUser");
	var processo = getValue("WKNumProces");
    var userFluig =  getUsuarioCorrente(user);


	customHTML.append("<script>");
	customHTML.append("		function getFormMode(){ return '" + formMode + "'};");
	customHTML.append("		function getMobile(){ return '" + mobile + "'};");
	customHTML.append("		function getWKNumState(){ return " + activity + "};");
	customHTML.append("		function getWKUser(){ return '" + user + "'};");
	customHTML.append("		function getWKNumProces(){ return " + processo + "};");
	customHTML.append("</script>");

	if (formMode == 'ADD') {
        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth() + 1;
        var ano = data.getFullYear();

        dia = (dia <= 9 ? "0" + dia : dia);
        mes = (mes <= 9 ? "0" + mes : mes);

        var newData = dia + "/" + mes + "/" + ano;
        form.setValue('data_solicitacao', newData);
        form.setValue('solicitante', userFluig);
        form.setValue('idSolicitante', user);

    }
	

    form.setShowDisabledFields(true); // removendo o botão imprimir
	form.setHidePrintLink(true);
}

function getUsuarioCorrente (userFunc){
    filter = new java.util.HashMap();
    filter.put('colleaguePK.colleagueId',userFunc);
    colaborador = getDatasetValues('colleague',filter);
    return colaborador.get(0).get('colleagueName');
}