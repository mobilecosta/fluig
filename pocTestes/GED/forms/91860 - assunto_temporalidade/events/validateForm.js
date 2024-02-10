function validateForm(form) {
	log.info("Temporalidade TOTVS - validateForm - mode: " + form.getFormMode());
	
	var msgError = "";
	var lineBreaker = "<br/>";
	if (isEmpty(form, "cd_assunto")) {
		msgError += "Assunto é obrigatorio." + lineBreaker;
	}
	if (isEmpty(form, "validade")) {
		msgError += "Validade é obrigatória." + lineBreaker;
	}
	if (isEmpty(form, "prazo_expiracao")) {
		msgError += "Expiração é obrigatória." + lineBreaker;
	}	
	
	var periodicidade = form.getValue("periodicidade");
	if (isEmpty(form, "periodicidade")) {
		msgError += "Periodicidade é obrigatória." + lineBreaker;
	}
	else if((periodicidade == "semanal" || periodicidade == "quinzenal"
		|| periodicidade == "mensal" || periodicidade == "anual")
		&& isEmpty(form, "quando")) {
		msgError += "Quando é obrigatório." + lineBreaker;
	}
	else if(periodicidade == "anual" || periodicidade == "mensalAvulso"){
		var quando = form.getValue("quando");
		var quandoSplit = quando.split("/");
		if(quandoSplit.length < 2 || quandoSplit[1].length < 2){
			msgError += "Quando deve ser no formato DD/MM." + lineBreaker;
		}
	}
	
	if (form.getFormMode() == "ADD") {
		if (isDuplicated('assunto', form.getValue("assunto"))) {
			msgError += "Assunto com temporalidade já cadastrada!" + lineBreaker;
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
	var dataset = DatasetFactory.getDataset('arquivo_temporalidade'
		, [campo], constraints, null);

	return (dataset != null && dataset.rowsCount > 0);
}