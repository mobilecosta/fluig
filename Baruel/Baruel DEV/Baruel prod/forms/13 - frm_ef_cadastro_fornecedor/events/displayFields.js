function displayFields(form,customHTML) {
	var currentState = getValue("WKNumState");
	var isFirstState = currentState == 0 || currentState == 4;

	setupFrontedFunctions(customHTML);

	if (isFirstState) {
		form.setValue("usuarioInicio", getValue("WKUser"));
		setupGroups(form);
		form.setValue('grupoAtual', 'Pool:Group:COMPRAS');
	} else {
		form.setEnabled('branch', false);
		form.setEnabled('consulta_Cliente', false);

		// Caso o usuário transfira, mantém o grupo atual
		form.setValue('grupoAtual', form.getValue('proximoGrupo'));
	}
	
}