function displayFields(form,customHTML){ 

    var formMode = form.getFormMode();
	var mobile = form.getMobile();
	var activity = getValue("WKNumState");
	var user = getValue("WKUser");
	var processo = getValue("WKNumProces");


	customHTML.append("<script>");
	customHTML.append("		function getFormMode(){ return '" + formMode + "'};");
	customHTML.append("		function getMobile(){ return '" + mobile + "'};");
	customHTML.append("		function getWKNumState(){ return " + activity + "};");
	customHTML.append("		function getWKUser(){ return '" + user + "'};");
	customHTML.append("		function getWKNumProces(){ return " + processo + "};");
	customHTML.append("</script>");


    form.setShowDisabledFields(true); // removendo o botão imprimir
	form.setHidePrintLink(true);
}