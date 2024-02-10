function displayFields(form,customHTML){
	form.setHidePrintLink(true);
	form.setShowDisabledFields(true);
	
	var currentState = getValue('WKNumState');
	var numProcess = getValue('WKNumProces');
	var emEdicao = (form.getFormMode() == "ADD" || form.getFormMode() == "MOD") 
	var currentUser = fluigAPI.getUserService().getCurrent();
	var mobile = form.getMobile();
	
	customHTML.append('<script type="text/javascript" >');
	customHTML.append('	let CONTEXT = {');
	customHTML.append('		"MODE": "' + form.getFormMode()	+ '"');
	customHTML.append('		, "IS_EDITING": ' + emEdicao);
	customHTML.append('		, "CURRENT_STATE": ' + currentState );
	customHTML.append('		, "NUM_PROCESS": ' + numProcess );
	customHTML.append('		, "PROCESS_TYPE": "PRINCIPAL"');
	customHTML.append('		, "USER": "' + currentUser.getCode() + '"');
	customHTML.append('		, "NAME_USER": "' + currentUser.getFullName() + '"');
	customHTML.append('		, "IS_ADMIN": ' + ehAdmin(currentUser));
	customHTML.append('		, "IS_MOBILE": ' + mobile);
	customHTML.append('		, "NEW_LINE": ' + ((mobile) ? "' \\n'" : "' <br/>'")); 
	customHTML.append('	};');
	customHTML.append('</script>');
	
	form.setValue('usuarioIntegrador', "fluigapi");
	
	if(emEdicao && (currentState == Activity.ZERO || currentState == Activity.SOLICITAR_MUDANCA)){
		form.setValue('cdSolicitante', currentUser.getCode());
		form.setValue('solicitante', currentUser.getFullName());
		form.setValue('dataAbertura', getCurrentDate('PT_BR'));
		form.setValue('horaAbertura', getCurrentTime());
	}
	else if(emEdicao && currentState == Activity.ELABORAR_PLANO_TECNICO){
		form.setValue('cdElaborador', currentUser.getCode());
		form.setValue('elaborador', currentUser.getFullName());
	}
	else if(emEdicao && currentState == Activity.AVALIAR_SDM){
		form.setValue('cdRepresentante', currentUser.getCode());
		form.setValue('representante', currentUser.getFullName());
		form.setValue('dt_aprovacao_cgm', getCurrentDate('PT_BR'));
		form.setValue('hora_aprovacao_cgm', getCurrentTime());
		
		if(form.getValue("tipo_de_mudanca") == "Emergencial"){
			form.setValue('apreciadaEmergencia', 'sim');
		}
	}
	else if(emEdicao && currentState == Activity.VALIDAR_MUDANCA){
		form.setValue('cdValidador', currentUser.getCode());
		form.setValue('validador', currentUser.getFullName());
		form.setValue('dt_validacao_mudanca', getCurrentDate('PT_BR'));
		form.setValue('hr_validacao_mudanca', getCurrentTime());
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