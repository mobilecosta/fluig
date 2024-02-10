function displayFields(form, customHTML) {

    form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
    var activity = getValue("WKNumState");
    var numProcess = getValue('WKNumProces');
    var mode = form.getFormMode();
    var currentUser = fluigAPI.getUserService().getCurrent();
	var currentState = getValue('WKNumState');
	
	var date = getCurrentDate();
	var time = getCurrentTime();
	
	if(mode != "VIEW"){	
		if(activity == Activity.ABERTURA) {
			form.setValue("nm_requisitante", currentUser.getFullName());
			form.setValue("cd_requisitante", currentUser.getCode());
			form.setValue('lg_requisitante', currentUser.getLogin());
			form.setValue("dt_solicitacao", date);
		}
		if(activity == Activity.LANCAR_NOTA) {
			form.setValue("nm_executor_lancar_nota", currentUser.getFullName());
			form.setValue("cd_executor_lancar_nota", currentUser.getCode());
			form.setValue("dt_lancar_nota", date);
		}
				
		if(activity == Activity.RECEBIDO_CONFERIDO_PAGO) {			
			form.setValue("nm_executor_conf_financ", currentUser.getFullName());
			form.setValue("cd_executor_conf_financ", currentUser.getCode());
			form.setValue("dt_aprov_financeiro", date);
		}		
		
	}
	
	customHTML.append('<script type="text/javascript" >');
	customHTML.append('	let CONTEXT = {');
	customHTML.append('		"MODE": "' + form.getFormMode()	+ '"');	
	customHTML.append('		, "ACTIVITY": "' + activity + '"');
	customHTML.append('		, "CURRENT_STATE": ' + currentState );
	customHTML.append('		, "NUM_PROCESS": ' + numProcess );
	customHTML.append('		, "PROCESS": "' + getValue("WKDef") + '"');
	customHTML.append('		, "PROCESS_TYPE": "PRINCIPAL"');
	customHTML.append('		, "USER": "' + currentUser.getLogin() + '"');
	customHTML.append('		, "USER_CODE": "' + currentUser.getCode() + '"');
	customHTML.append('		, "NAME_USER": "' + currentUser.getFullName() + '"');
	customHTML.append('	};');
	customHTML.append('</script>');
}