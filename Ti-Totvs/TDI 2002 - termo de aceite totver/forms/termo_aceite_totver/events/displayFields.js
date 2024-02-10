function displayFields(form, customHTML) {

    var atividade = getValue("WKNumState");
    var formMode = form.getFormMode();

    customHTML.append("<script>");
	customHTML.append("function getWKNumState(){ return " + atividade + "};");
	customHTML.append("</script>");
    

    if (formMode == 'ADD') {
        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth() + 1;
        var ano = data.getFullYear();

        dia = (dia <= 9 ? "0" + dia : dia);
        mes = (mes <= 9 ? "0" + mes : mes);

        var newData = dia + "/" + mes + "/" + ano;
        form.setValue('dataSolicitacao', newData);
       
    }

    if (atividade == 0 || atividade == 4){
        form.setVisibleById("termo", false);
    }

    if (atividade == 5){
        form.setEnabled("nomeTotver", false);
    }


    form.setShowDisabledFields(true); // removendo o botão imprimir
	form.setHidePrintLink(true);
}