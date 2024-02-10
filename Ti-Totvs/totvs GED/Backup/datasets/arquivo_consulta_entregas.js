function defineStructure() {}
function onSync(lastSyncDate) {}
function createDataset(fields, constraints, sortFields) {
	log.info("arquivo_consulta_entregas - INICIO ##########");
	
	var sql = montaBusca(constraints);
    return DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
}

function montaBusca(constraints){
	log.info("arquivo_consulta_entregas - montaBusca - constraints: ");
	log.dir(constraints);
	
	var company = getValue("WKCompany");
	var select = "SELECT et.raiz, et.unidade, et.idUnidade, et.nmUnidade, ";
	select += "		et.ano, et.anoMes, et.pastaAnoMes, et.pastaAssunto, et.cdAssunto, et.nmAssunto, et.status, ";
	select += "		et.idDocumento, COALESCE(dDocumento.DS_PRINCIPAL_DOCUMENTO, dAssunto.DS_PRINCIPAL_DOCUMENTO) as 'documento', ";
	select += "		et.dtPrevista, et.idxEntregaMes, et.s_path, et.pastas , ";
	select += "		COALESCE(dDocumento.DT_ATUALIZACAO, '') as dtEntrega, COALESCE(dDocumento.DT_EXPIRACAO, '') as dtValidade ";
	select += " FROM arquivo_entregas_taxonomia et ";
	select += " INNER JOIN documento dAssunto ON dAssunto.cod_empresa = " + company + " AND dAssunto.nr_documento = et.pastaAssunto AND dAssunto.versao_ativa = 1";
	select += " LEFT JOIN documento dDocumento ON dDocumento.cod_empresa = " + company + " AND dDocumento.nr_documento = et.idDocumento AND dDocumento.versao_ativa = 1";
	
	var where = "";
	if (constraints != null && constraints.length > 0 && constraints[0].fieldName != "sqlLimit") {
		where = " WHERE ";
		for (var c = 0; c < constraints.length; c++) {
			if(constraints[c].fieldName == "sqlLimit") continue;
			
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
	//else throw "Informe ao menos uma constraint";
	
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