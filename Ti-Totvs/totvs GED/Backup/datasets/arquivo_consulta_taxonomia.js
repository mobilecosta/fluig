function createDataset(fields, constraints, sortFields) {
	log.info("arquivo_consulta_taxonomia - INICIO ##########");
	
	var sql = montaBusca(constraints);
    return DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
}

function montaBusca(constraints){
	log.info("arquivo_consulta_taxonomia - montaBusca - constraints: ");
	log.dir(constraints);
	
	var select = "SELECT * FROM VIEW_ARQ_TAXONOMIA ";

	var where = "";
	if (constraints != null && constraints.length > 0) {
		where = " WHERE ";
		for (var c = 0; c < constraints.length; c++) {
			if(constraints[c].fieldName == "sqlLimit") continue;
			
			if(where != " WHERE ") where += " AND ";
			
			where += " (" + constraints[c].fieldName + " = '" + constraints[c].initialValue + "'";
			where += " OR " + constraints[c].fieldName + " IS NULL) ";
		}
	}
	return select + where;
}

/**
 * Verificar se o valor é nulo ou vazio
 * @param valor
 * @returns
 */
function isEmpty(valor){
	if(valor == null) return true;
	
	var teste = "" + valor;
	return teste.trim() == "";
}