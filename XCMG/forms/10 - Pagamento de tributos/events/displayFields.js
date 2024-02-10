function displayFields(form,customHTML){
	form.setHidePrintLink(true);
	form.setShowDisabledFields(true);
	
	var currentState = getValue('WKNumState');
	var numProcess = getValue('WKNumProces');
	var editing = (form.getFormMode() == "ADD" || form.getFormMode() == "MOD") 
	var currentUser = fluigAPI.getUserService().getCurrent();
	var mobile = form.getMobile();
	
	customHTML.append('<script type="text/javascript" >');
	customHTML.append('	let CONTEXT = {');
	customHTML.append('		"MODE": "' + form.getFormMode()	+ '"');
	customHTML.append('		, "IS_EDITING": ' + editing);
	customHTML.append('		, "CURRENT_STATE": ' + currentState );
	customHTML.append('		, "PROCESS": "' + getValue("WKDef")+ '"');
	customHTML.append('		, "NUM_PROCESS": ' + numProcess );
	customHTML.append('		, "PROCESS_TYPE": "PRINCIPAL"');
	customHTML.append('		, "USER": "' + currentUser.getLogin() + '"');
	customHTML.append('		, "USER_CODE": "' + currentUser.getCode() + '"');
	customHTML.append('		, "NAME_USER": "' + currentUser.getFullName() + '"');
	customHTML.append('		, "IS_ADMIN": ' + ehAdmin(currentUser));
	customHTML.append('		, "IS_MOBILE": ' + mobile);
	customHTML.append('		, "NEW_LINE": ' + ((mobile) ? "' \\n'" : "' <br/>'")); 
	customHTML.append('	};');
	customHTML.append('</script>');
	
	log.info("XCMG - Pagamentro de tributos - displayFields - editing: " + editing
		+ " - currentState: " + currentState);
	if(editing && (currentState == Activity.ZERO || currentState == Activity.INICIO)){
		form.setValue('cd_requisitante', currentUser.getCode());
		form.setValue('lg_requisitante', currentUser.getLogin());
		form.setValue('nm_requisitante', currentUser.getFullName());
		form.setValue('dt_solicitacao', getCurrentDate('PT_BR'));
	}
	
	if(editing && currentState == Activity.RECEBIDO_CONFERIDO){						
		form.setValue("nm_executor_conf_financ", currentUser.getFullName());
		form.setValue("cd_executor_conf_financ", currentUser.getCode());
		form.setValue("dt_aprov_financeiro", getCurrentDate('PT_BR'));
	}	
		
}

function ehAdmin(usuario){
	return estaNoPapel("admin", usuario);
}

function estaNoPapel(papelAlvo, usuario){
	var papeis = usuario.getRoles();
	return (papeis == null || papeis.isEmpty()) 
		? false : papeis.contains(papelAlvo);
}