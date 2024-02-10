function enableFields(form) {
	var activity = getValue("WKNumState");
	var fieldsEnabled = [];
	var fieldsDisabled = [];

	if(activity == Activity.ABERTURA || activity == Activity.INICIO) {
		fieldsDisabled.push("rd_aprov_gerente_area","ds_obs_gerente_area",
							"rd_aprov_diretor_area","ds_obs_diretor_area",
							"rd_aprov_controladoria","ds_obs_controladoria",
							"rd_aprov_gerente_financeiro","ds_obs_gerente_financeiro",
							"rd_aprov_diretor_financeiro","ds_obs_diretor_financeiro",
							"rd_aprov_presidencia","ds_obs_presidencia",
							"rd_aprov_financeiro","ds_obs_aprov_financeiro",														
							"nm_banco_xcmg");
	}
	else if(activity == Activity.AVALIAR_GERENTE_AREA){
		fieldsEnabled.push("rd_aprov_gerente_area", "ds_obs_gerente_area");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_DIRETOR_AREA){
		fieldsEnabled.push("rd_aprov_diretor_area", "ds_obs_diretor_area");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_CONTROLADORIA){
		fieldsEnabled.push("rd_aprov_controladoria", "ds_obs_controladoria");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_GERENTE_FINANCEIRO){
		fieldsEnabled.push("rd_aprov_gerente_financeiro", "ds_obs_gerente_financeiro");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_DIRETOR_FINANCEIRO){
		fieldsEnabled.push("rd_aprov_diretor_financeiro", "ds_obs_diretor_financeiro");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_PRESIDENTE){
		fieldsEnabled.push("rd_aprov_presidencia", "ds_obs_presidencia");
		disableAllFields(form);
	}else if(activity == Activity.DEFINIR_CONTA_PA){
		fieldsEnabled.push("rd_aprov_financeiro", "ds_obs_aprov_financeiro");
		fieldsEnabled.push("nm_banco_xcmg", "cd_agencia_xcmg", "cd_digito_agencia");
		fieldsEnabled.push("cd_conta_xcmg", "cd_digito_conta");
		fieldsEnabled.push("cd_classdeb", "cd_classcred");
		disableAllFields(form);
	}else if(activity == Activity.VERIFICAR_SITUACAO){
		fieldsEnabled.push("nm_banco_xcmg", "cd_agencia_xcmg", "cd_digito_agencia");
		fieldsEnabled.push("cd_conta_xcmg", "cd_digito_conta", "cd_natureza");
		fieldsEnabled.push("cd_classdeb", "cd_classcred");
		disableAllFields(form);
	}else if(activity == Activity.AGUARDAR_VENCIMENTO){
		disableAllFields(form);
	}else if(activity == Activity.RECEBIDO_CONFERIDO){	
		disableAllFields(form);
	}
	
	
	disabledFieldList(form, fieldsDisabled);
	
	enabledFieldList(form, fieldsEnabled);
}

function disableAllFields(form) {
	var fields = form.getCardData();
	var keys = fields.keySet().toArray();
	for (var k in keys) {
		var field = keys[k];
		form.setEnabled(field, false);
	}
}

function disabledFieldList(form, fields) {
	for (var i = 0; i < fields.length; i++) {
		form.setEnabled(fields[i], false);
	}
}

function enabledFieldList(form, fields) {
	for (var i = 0; i < fields.length; i++) {
		form.setEnabled(fields[i], true);
	}
}