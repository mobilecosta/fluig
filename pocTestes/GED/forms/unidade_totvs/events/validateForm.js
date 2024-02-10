function validateForm(form) {
	log.info("Unidades TOTVS - validateForm - mode: " + form.getFormMode());
	
	var msgError = "";
	var lineBreaker = "<br/>";
	if (isEmpty(form, "cd_coligada")) {
		msgError += "Código da coligada é obrigatorio." + lineBreaker;
	}
	if (isEmpty(form, "cd_filial")) {
		msgError += "Código da filial é obrigatório." + lineBreaker;
	}
	if (isEmpty(form, "nm_filial")) {
		msgError += "Nome é obrigatório." + lineBreaker;
	}
	if (isEmpty(form, "possui_diretoria")) {
		msgError += "Possui diretoria é obrigatório." + lineBreaker;
	}
	if (isEmpty(form, "concentrar_matriz")) {
		msgError += "Permite concentrar a publica&ccedil;&atilde;o na matriz da coligada? é obrigatório." + lineBreaker;
	}
	
	if (form.getFormMode() == "ADD") {
		if (isDuplicated(form.getValue("cd_coligada"), form.getValue("cd_filial"))) {
			msgError += "Unidade já cadastrada!" + lineBreaker;
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
 * @param coligada
 * @param filial
 * @returns verdadeiro ou falso
 */
function isDuplicated(coligada, filial) {
	var cf1 = DatasetFactory.createConstraint('cd_coligada', coligada, coligada, ConstraintType.MUST);
	var cf2 = DatasetFactory.createConstraint('cd_filial', filial, filial, ConstraintType.MUST);
	var cf3 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
	var constraints = [ cf1, cf2, cf3 ];
	var dataset = DatasetFactory.getDataset('arquivo_unidades_totvs'
		, ['cd_filial'], constraints, null);

	return (dataset != null && dataset.rowsCount > 0);
}