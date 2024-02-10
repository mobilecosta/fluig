function enableFields(form) {
	var activity = getValue("WKNumState");
	var fieldsEnabled = [];
	var fieldsDisabled = [];

	if(activity == Activity.ABERTURA || activity == Activity.INICIO) {
		var indexes = form.getChildrenIndexes("tb_parcelas");
		for (var i = 0; i < indexes.length; i++) {
			form.setEnabled("rd_pago___" + indexes[i], false);
		}
		
		fieldsDisabled.push("rd_lancado","ds_obs_lancar_nota",
							"rd_aprov_gerente_area","ds_obs_gerente_area",
							"rd_aprov_diretor_area","ds_obs_diretor_area",
							"rd_aprov_controladoria","ds_obs_controladoria",
							"rd_aprov_diretor_geral","ds_obs_diretor_geral",
							/* "rd_aprov_diretor_financeiro","ds_obs_diretor_financeiro", */
							"rd_aprov_presidencia","ds_obs_presidencia",
							"rd_aprov_financeiro","ds_obs_aprov_financeiro");
	}
	else if(activity == Activity.LANCAR_NOTA){
		fieldsEnabled.push("rd_lancado", "ds_obs_lancar_nota");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_GERENTE_AREA){
		fieldsEnabled.push("rd_aprov_gerente_area", "ds_obs_gerente_area");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_DIRETOR_AREA){
		fieldsEnabled.push("rd_aprov_diretor_area", "ds_obs_diretor_area");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_CONTROLADORIA){
		fieldsEnabled.push("rd_aprov_controladoria", "ds_obs_controladoria");
		disableAllFields(form);
	}else if(activity == Activity.AVALIAR_DIRETOR_GERAL){
		fieldsEnabled.push("rd_aprov_diretor_geral", "ds_obs_diretor_geral");
		disableAllFields(form);
	}/* else if(activity == Activity.AVALIAR_DIRETOR_FINANCEIRO){
		fieldsEnabled.push("rd_aprov_diretor_financeiro", "ds_obs_diretor_financeiro");
		disableAllFields(form);
	} */else if(activity == Activity.AVALIAR_PRESIDENTE){
		fieldsEnabled.push("rd_aprov_presidencia", "ds_obs_presidencia");
		disableAllFields(form);
	}else if(activity == Activity.AGUARDAR_VENCIMENTO){
		disableAllFields(form);
	}else if(activity == Activity.RECEBIDO_CONFERIDO_PAGO){
		
		fieldsEnabled.push("rd_aprov_financeiro", "ds_obs_aprov_financeiro");
		
		var indexes = form.getChildrenIndexes("tb_parcelas");
		for (var i = 0; i < indexes.length; i++) {
			
			if(form.getValue("nm_pago___" + indexes[i]) == "atual")
				fieldsEnabled.push("rd_pago___" + indexes[i]);
		}
		
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