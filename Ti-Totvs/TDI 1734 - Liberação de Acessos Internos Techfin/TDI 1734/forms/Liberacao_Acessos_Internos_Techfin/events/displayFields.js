function displayFields(form, customHTML) {
    form.setShowDisabledFields(true); // removendo o botão imprimir
	form.setHidePrintLink(true);
    var atividadeAtual = getValue("WKNumState");
    var user = fluigAPI.getUserService().getCurrent().getFullName();
    form.setValue("atividadeAtual", atividadeAtual);

    if (atividadeAtual == 0 || atividadeAtual == 4) {
        form.setValue("solicitante", user);
        form.setVisibleById("ativ5", false);
        form.setVisibleById("ativ12", false);
    };

    if (atividadeAtual == 5) {
        form.setVisibleById("ativ12", false);
    }

    if (atividadeAtual == 12) {
        var usuarioResponsavel = fluigAPI.getUserService().getCurrent().getFullName();
        form.setValue("usuarioResponsavel", usuarioResponsavel);
    }



}