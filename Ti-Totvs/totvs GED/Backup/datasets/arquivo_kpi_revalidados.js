function defineStructure() {}
function onSync(lastSyncDate) {}
function createDataset(fields, constraints, sortFields) {
	log.info("arquivo_kpi_revalidados - INICIO ##########");
	
	var sql = montaBusca(constraints);
    return DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
}

/**
EXEMPLO de consumo
var cs = [ 
    DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST)
    , DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST)
    , DatasetFactory.createConstraint('et.dtPrevista', '2022-08-01', '2022-08-31', ConstraintType.MUST)
];
DatasetFactory.getDataset('arquivo_kpi_revalidados',[],cs,[]);
 */
function montaBusca(constraints){
	log.info("arquivo_kpi_revalidados - montaBusca - constraints: ");
	log.dir(constraints);
	
	var fields = [];
	var where = "";
	var groupBy = "";
	if (constraints != null && constraints.length > 0 && constraints[0].fieldName != "sqlLimit") {
		where = " WHERE et.idDocumento IS NOT NULL ";
		where += " AND docPrimVers.dt_expiracao <> docUltVers.dt_expiracao ";
		groupBy = " GROUP BY et.raiz ";
		
		for (var c = 0; c < constraints.length; c++) {
			if(constraints[c].fieldName == "sqlLimit") continue;
			
			if(constraints[c].fieldName.indexOf('groupby_') > -1){
				if(groupBy != " GROUP BY ") groupBy += ", ";
				
				var field = constraints[c].fieldName.split('groupby_')[1];
				groupBy += field;
				fields.push(field);
				fields.push("COUNT("+field+") as count_"+field.replace('.','_'));
			}
			else{
				if(where != " WHERE ") where += " AND ";
			
				if(constraints[c].initialValue != constraints[c].finalValue && constraints[c].finalValue != null){
					where += " (" + constraints[c].fieldName + " >= '" + constraints[c].initialValue + "'";
					where += " AND " + constraints[c].fieldName + " <= '" + constraints[c].finalValue + "') ";
				}
				else{
					where += " (" + constraints[c].fieldName + " = '" + constraints[c].initialValue + "'";
					where += " OR " + constraints[c].fieldName + " IS NULL) ";
				}
			}
		}
	}
	
	var company = getValue("WKCompany");
	var select = "SELECT et.raiz, ";
	select += fields.join(',');
	select += " FROM arquivo_entregas_taxonomia et ";
	select += " INNER JOIN documento docUltVers ON docUltVers.cod_empresa = " + company;
	select += "		AND docUltVers.nr_documento = et.idDocumento AND docUltVers.versao_ativa = 1";
	select += " INNER JOIN documento docPrimVers ON docPrimVers.cod_empresa = " + company;
	select += "		AND docPrimVers.nr_documento = et.idDocumento AND docPrimVers.nr_versao = 1000";

	return select + where + groupBy;
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