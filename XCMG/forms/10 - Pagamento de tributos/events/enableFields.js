function enableFields(form) {
	var CURRENT_STATE = getValue("WKNumState");
	var fieldsEnabled = [];
	var fieldsDisabled = [];

	fieldsDisabled.push("rd_lancado", "ds_obs_lancar_nota",
		"rd_aprov_gerente_area", "ds_obs_gerente_area",
		"rd_aprov_direto_area", "ds_obs_diretor_area",
		"rd_aprov_controladoria", "ds_obs_controladoria",
		"rd_aprov_gerente_financeiro", "ds_obs_gerente_financeiro",
		"rd_aprov_diretor_financeiro", "ds_obs_diretor_financeiro",
		"rd_aprov_presidencia", "ds_obs_presidencia",
		"rd_aprov_financeiro", "ds_obs_aprov_financeiro");

	//Títulos são manipulados apenas na atividade de abertura.
	if (CURRENT_STATE != Activity.ZERO && CURRENT_STATE != Activity.INICIO) {
		var indexes = form.getChildrenIndexes("tbTitulos");
		for (var i = 0; i < indexes.length; i++) {
			fieldsDisabled.push("titulo___" + indexes[i]);
			fieldsDisabled.push("tit_dt_emissao___" + indexes[i]);
			fieldsDisabled.push("tit_dt_vencimento___" + indexes[i]);
			fieldsDisabled.push("tit_centro_custo___" + indexes[i]);
			fieldsDisabled.push("tit_natureza___" + indexes[i]);
			fieldsDisabled.push("tit_vl_original___" + indexes[i]);
			fieldsDisabled.push("tit_vl_juros___" + indexes[i]);
			fieldsDisabled.push("tit_vl_multa___" + indexes[i]);
		}

		fieldsDisabled.push("filial");
		fieldsDisabled.push("cd_centro_custo");
		fieldsDisabled.push("cd_conta_contabil");
		fieldsDisabled.push("ds_descricao");
		fieldsDisabled.push("fornecedor");
		fieldsDisabled.push("nm_forma_pagamento");
		fieldsDisabled.push("ds_outras_informacoes");
		fieldsDisabled.push("ds_justificativa_politica");

		if (CURRENT_STATE == Activity.AVALIAR_GER_AREA) {
			fieldsEnabled.push("rd_aprov_gerente_area", "ds_obs_gerente_area");
		}
		else if (CURRENT_STATE == Activity.AVALIAR_CONTROLADORIA) {
			fieldsEnabled.push("rd_aprov_controladoria", "ds_obs_controladoria");
		}
		else if (CURRENT_STATE == Activity.AVALIAR_GER_FINANCEIRO) {
			fieldsEnabled.push("rd_aprov_gerente_financeiro", "ds_obs_gerente_financeiro");
		}
		else if (CURRENT_STATE == Activity.AVALIAR_DIR_FINANCEIRO) {
			fieldsEnabled.push("rd_aprov_diretor_financeiro", "ds_obs_diretor_financeiro");
		}
		else if (CURRENT_STATE == Activity.AVALIAR_PRESIDENTE) {
			fieldsEnabled.push("rd_aprov_presidencia", "ds_obs_presidencia");
		}
		else if (CURRENT_STATE == Activity.RECEBIDO_CONFERIDO) {
			fieldsEnabled.push("rd_aprov_financeiro", "ds_obs_aprov_financeiro");
		}

	}

	disableFieldList(form, fieldsDisabled);

	enableFieldList(form, fieldsEnabled);
}

function disableAllFields(form) {
	var fields = form.getCardData();
	var keys = fields.keySet().toArray();
	for (var k in keys) {
		var field = keys[k];
		form.setEnabled(field, false);
	}
}

function disableFieldList(form, fields) {
	for (var i = 0; i < fields.length; i++) {
		form.setEnabled(fields[i], false);
	}
}

function enableFieldList(form, fields) {
	for (var i = 0; i < fields.length; i++) {
		form.setEnabled(fields[i], true);
	}
}

