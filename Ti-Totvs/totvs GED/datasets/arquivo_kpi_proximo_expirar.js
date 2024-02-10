function defineStructure() {}
function onSync(lastSyncDate) {}
function createDataset(fields, constraints, sortFields) {
	log.info("arquivo_kpi_proximo_expirar - INICIO ##########");
	
	var sql = montaBusca(constraints);
    return DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
}

/**
EXEMPLO de consumo
var cs = [ 
    DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST)
    , DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST)
    , DatasetFactory.createConstraint('dDocumento.dt_criacao', '2022-08-01', '2022-08-31', ConstraintType.MUST)
];
DatasetFactory.getDataset('arquivo_kpi_proximo_expirar',[],cs,[]);
 */
function montaBusca(constraints){
	log.info("arquivo_kpi_proximo_expirar - montaBusca - constraints: ");
	log.dir(constraints);
	
	var fields = [];
	var where = "";
	var groupBy = "";
	if (constraints != null && constraints.length > 0 && constraints[0].fieldName != "sqlLimit") {
		var where = " WHERE et.idDocumento IS NOT NULL ";
		where += " 	AND CURDATE() <= dDocumento.dt_expiracao ";
		where += "	AND CURDATE() >= DATE_SUB(dDocumento.dt_expiracao, INTERVAL vAss.prazo_expiracao DAY) ";
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
	var select = "";
	//Para teste, sem agrupamento, para analisar os dados
	if(groupBy == " GROUP BY et.raiz "){
		groupBy = "";
		select = "SELECT dDocumento.nr_documento, dDocumento.dt_expiracao,";
		select += " vAss.prazo_expiracao, CURDATE() as hoje, ";
		select += " CURDATE() <= dDocumento.dt_expiracao as antesExpiracao, "
		select += " DATE_SUB(dDocumento.dt_expiracao, INTERVAL vAss.prazo_expiracao DAY) as dataProximoExpiracao, "
		select += " CURDATE() >= DATE_SUB(dDocumento.dt_expiracao, INTERVAL vAss.prazo_expiracao DAY) as expirando ";
	}
	else {
		select = "SELECT et.raiz, ";
		select += fields.join(',');
	}
	select += " FROM arquivo_entregas_taxonomia et ";
	select += " INNER JOIN documento dDocumento ON dDocumento.cod_empresa = " + company;
	select += "		AND dDocumento.nr_documento = et.idDocumento AND dDocumento.versao_ativa = 1";
	select += " INNER JOIN VIEW_ARQ_ASSUNTO_TEMP vAss ON vAss.cd_assunto = et.cdAssunto";
	select += " INNER JOIN documento dAss ON dAss.cod_empresa = " + company;
	select += "		AND dAss.nr_documento = vAss.documentid AND dAss.nr_versao = vAss.version AND dAss.versao_ativa = 1";
	
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