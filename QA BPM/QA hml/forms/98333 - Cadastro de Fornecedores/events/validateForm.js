function validateForm(form){
	
	//Valida Campos
	validObrigat(form);
	
	//Valida inclusão
	// if (form.getFormMode() == "ADD"){
	// 	var b1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
	// 	var constraints = new Array(b1);
	// 	var dataset = DatasetFactory.getDataset("cadFornecedores", null, constraints, null);
	// 	if (dataset.rowsCount > 0){
	// 		throw "Não é possivel gerar mais de uma ficha de formulários de cadastro";
	// 	}
	// }
	
}