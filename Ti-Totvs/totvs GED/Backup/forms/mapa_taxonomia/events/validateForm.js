function validateForm(form) {
	log.info("Taxonomia TOTVS - validateForm - mode: " + form.getFormMode());
	
	var msgError = "";
	var lineBreaker = "<br/>";
	if (isEmpty(form, "cd_raiz")) {
		msgError += "Raiz é obrigatoria." + lineBreaker;
	}
	if (isEmpty(form, "grupo_alerta")) {
		msgError += "Grupo de alerta é obrigatório." + lineBreaker;
	}
	if (isEmpty(form, "periodicidade_alerta")) {
		msgError += "Periodicidade de alerta é obrigatória." + lineBreaker;
	}
	
	if (form.getFormMode() == "ADD") {
		if (isDuplicated('cd_raiz', form.getValue("cd_raiz"))) {
			msgError += "Taxonomia já cadastrada para essa pasta raiz!" + lineBreaker;
		}
	}
	
	var array = form.getChildrenIndexes("tbl_estrutura")
	if(array.length != 0){
	for(var i = 0; i < array.length ; i++){
		if(array[i] != 0){
			var indice = array[i]
			if (isEmpty(form, 'tipo_pasta_nivel___'+ indice)){
				msgError += "Pelo menos um nivel de pasta deve ser informado";
			   }
			}
		}
	}else{
		if (isEmpty(form, 'tipo_pasta_nivel')){
			msgError += "Pelo menos um nivel de pasta deve ser informado";
		   }
	}

	if (msgError != "") {
		throw msgError;
	}

	
}

/**
 * Facilitador que evita você precisar repetir a condição completa
 * verificando se o campo está undefined, null ou se está vazio
 * @param objeto form
 * @param nomeCampo
 * @returns verdadeiro ou falso
 */
function isEmpty(form, field) {
	return ((form.getValue(field) == null) 
			|| (form.getValue(field) == undefined) 
			|| (form.getValue(field).trim() == ""));
}

/**
 * Verifica se identificador do registro já foi cadastrado
 * @param campo
 * @param chave
 * @returns verdadeiro ou falso
 */
function isDuplicated(campo, chave) {
	var cf1 = DatasetFactory.createConstraint(campo, chave, chave, ConstraintType.MUST);
	var cf2 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
	var constraints = [ cf1, cf2 ];
	var dataset = DatasetFactory.getDataset('arquivo_taxonomia'
		, [campo], constraints, null);

	return (dataset != null && dataset.rowsCount > 0);
}