function displayFields(form,customHTML) {
	var currentState = getValue("WKNumState");
	var isFirstState = currentState == 0 || currentState == 4;
	var isErrorState = currentState == getErrorState();

	setupFrontedFunctions(customHTML);

	if (isFirstState) {
		form.setValue("usuarioInicio", getValue("WKUser"));
		setupGroups(form);
	} else if (isErrorState) {
		setupGroupsFromError(form);
	} else {
		form.setEnabled('branch', false);
		form.setEnabled('consulta_Cliente', false);

		// Caso o usuário transfira, mantém o grupo atual
		form.setValue('grupoAtual', form.getValue('proximoGrupo'));
	}
	
}