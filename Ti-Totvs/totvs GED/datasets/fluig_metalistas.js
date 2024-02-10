function defineStructure() {
    addColumn("META_LIST_3", DatasetFieldType.STRING);
    addColumn("META_LIST_4", DatasetFieldType.STRING);
    addColumn("META_LIST_5", DatasetFieldType.STRING);
    addColumn("COD_DATASET", DatasetFieldType.STRING);
    addColumn("NR_DOCUMENTO", DatasetFieldType.NUMBER);
    addColumn("TIPO", DatasetFieldType.STRING);
    addColumn("SUBTIPO", DatasetFieldType.STRING);
    addColumn("COD_LISTA", DatasetFieldType.STRING);
//    setKey(["META_LIST"]);
    setKey(["NR_DOCUMENTO", "COD_DATASET", "SUBTIPO"]);
    addIndex(["COD_DATASET"]);
    addIndex(["COD_DATASET", "SUBTIPO"]);
}
function onSync(lastSyncDate) {
	log.info("fluig_metalistas");
	var dataset = DatasetBuilder.newDataset();
	
	var mapaDeMetalistas = { 'x' : []}; //NR_DOCUMENTO : [franquias] 
	
	var sql = getMySQLSyntax(getValue("WKCompany"));
	
	log.info("fluig_metalistas - sql: " + sql);
	var metalistInfo = DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], [], []);
	for(var i = 0; i < metalistInfo.rowsCount; i++){
		var document = metalistInfo.getValue(i,'NR_DOCUMENTO');
		mapaDeMetalistas[document] = '';
		
		dataset.addOrUpdateRow([
						metalistInfo.getValue(i,'META_LIST_3'),
						metalistInfo.getValue(i,'META_LIST_4'),
						metalistInfo.getValue(i,'META_LIST_5'),
						metalistInfo.getValue(i,'COD_DATASET'),
						document,
						metalistInfo.getValue(i,'TYPE'),
						metalistInfo.getValue(i,'DETAIL'),
						metalistInfo.getValue(i,'COD_LISTA')]);
	}
	return limparVinculos(dataset, mapaDeMetalistas);
}
function createDataset(fields, constraints, sortFields) { }

function onMobileSync(user) {
	var sort = [];
	var constraints = [];
	var fields = ['META_LIST', 'COD_DATASET', 'NR_DOCUMENTO', 'TIPO', 'SUBTIPO'];
	var result = {
			'fields' : fields,
			'constraints' : constraints,
			'sortingFields' : sort
	};
	return result;
}

function getMySQLSyntax(company){
	var empLen = (''+company).length;
	var len = (empLen < 3) ? 3 : empLen;
	var sql = "SELECT COD_DATASET, '0' AS NR_DOCUMENTO ";
	sql += "	, CONVERT(CONCAT('MD',CONCAT(LPAD(COD_EMPRESA,"+len+",0),LPAD(COD_LISTA,3,0))), CHAR CHARACTER SET utf8) AS META_LIST_3 ";
	sql += "	, CONVERT(CONCAT('MD',CONCAT(LPAD(COD_EMPRESA,"+len+",0),LPAD(COD_LISTA,4,0))), CHAR CHARACTER SET utf8) AS META_LIST_4 ";
	sql += "	, CONVERT(CONCAT('MD',CONCAT(LPAD(COD_EMPRESA,"+len+",0),LPAD(COD_LISTA,5,0))), CHAR CHARACTER SET utf8) AS META_LIST_5 ";
	sql += " 	, TYPE, 'jornalizado' as DETAIL, COD_LISTA ";
	sql += "FROM SERV_DATASET WHERE COD_EMPRESA = "+company+" AND TYPE = 'CUSTOM' AND COD_LISTA IS NOT NULL ";
	sql += "UNION ALL ";
	sql += "SELECT DS.COD_DATASET, D.NR_DOCUMENTO ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(D.COD_EMPRESA,"+len+",0),LPAD(D.COD_LISTA,3,0))), CHAR CHARACTER SET utf8) AS META_LIST_3 ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(D.COD_EMPRESA,"+len+",0),LPAD(D.COD_LISTA,4,0))), CHAR CHARACTER SET utf8) AS META_LIST_4 ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(D.COD_EMPRESA,"+len+",0),LPAD(D.COD_LISTA,5,0))), CHAR CHARACTER SET utf8) AS META_LIST_5 ";
	sql += "	, TYPE, 'principal' as TIPO, D.COD_LISTA ";
	sql += "FROM SERV_DATASET DS ";
	sql += "INNER JOIN DOCUMENTO D ON DS.COD_EMPRESA = D.COD_EMPRESA AND DS.DSL_DATASET = D.NR_DOCUMENTO AND D.VERSAO_ATIVA = 1 ";
	sql += "WHERE DS.COD_EMPRESA = "+company+"  and DS.IS_ACTIVE = 1 AND DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DS.TYPE = 'BUILTIN' ";
	sql += "UNION all ";
	sql += "SELECT DAD_DS.COD_DATASET, MLR.COD_LISTA_PAI as NR_DOCUMENTO ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(MLR.COD_EMPRESA,"+len+",0),LPAD(MLR.COD_LISTA_FILHO,3,0))), CHAR CHARACTER SET utf8) AS META_LIST_3 ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(MLR.COD_EMPRESA,"+len+",0),LPAD(MLR.COD_LISTA_FILHO,4,0))), CHAR CHARACTER SET utf8) AS META_LIST_4 ";
	sql += "	, CONVERT(CONCAT('ML',CONCAT(LPAD(MLR.COD_EMPRESA,"+len+",0),LPAD(MLR.COD_LISTA_FILHO,5,0))), CHAR CHARACTER SET utf8) AS META_LIST_5 ";
	sql += "	, TYPE, MLR.COD_TABELA as TIPO, MLR.COD_LISTA_FILHO ";
	sql += "FROM meta_lista_rel MLR ";
	sql += "INNER JOIN documento DAD on MLR.COD_EMPRESA = DAD.COD_EMPRESA and MLR.COD_LISTA_PAI = DAD.COD_LISTA and DAD.VERSAO_ATIVA = 1 ";
	sql += "INNER JOIN SERV_DATASET DAD_DS on MLR.COD_EMPRESA = DAD_DS.COD_EMPRESA and DAD.NR_DOCUMENTO = DAD_DS.DSL_DATASET and DAD_DS.IS_ACTIVE = 1 ";
	sql += "	AND DAD_DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DAD_DS.TYPE = 'BUILTIN' ";
	sql += "WHERE MLR.COD_EMPRESA="+company;
	sql += " order by 1 DESC;";
	return sql;
}
function getSQLServerSyntax(company){
	var sql = "SELECT COD_DATASET, '0' AS NR_DOCUMENTO ";
	sql += " 	, right(replicate('0',3)+cast(rtrim(ltrim(COD_EMPRESA)) as varchar(3)), 3) ";
	sql += "	+ right(replicate('0',3)+cast(rtrim(ltrim(COD_LISTA)) as varchar(3)), 3)  AS META_LIST ";
	sql += " 	, TYPE, 'jornalizado' as DETAIL ";
	sql += "FROM SERV_DATASET WHERE COD_EMPRESA = "+company+" AND TYPE = 'CUSTOM' AND COD_LISTA IS NOT NULL ";
	sql += "UNION ALL ";
	sql += "SELECT DS.COD_DATASET, D.NR_DOCUMENTO ";
	sql += "	, right(replicate('0',3)+cast(rtrim(ltrim(D.COD_EMPRESA)) as varchar(3)), 3) ";
	sql += "	+ right(replicate('0',3)+cast(rtrim(ltrim(D.COD_LISTA)) as varchar(3)), 3)  AS META_LIST ";
	sql += "	, TYPE, 'principal' as TIPO ";
	sql += "FROM SERV_DATASET DS ";
	sql += "INNER JOIN DOCUMENTO D ON DS.COD_EMPRESA = D.COD_EMPRESA AND DS.DSL_DATASET = D.NR_DOCUMENTO AND D.VERSAO_ATIVA = 1 ";
	sql += "WHERE DS.COD_EMPRESA = "+company+"  and DS.IS_ACTIVE = 1 AND DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DS.TYPE = 'BUILTIN' ";
	sql += "UNION all ";
	sql += "SELECT DAD_DS.COD_DATASET, MLR.COD_LISTA_PAI as NR_DOCUMENTO ";
	sql += "	, right(replicate('0',3)+cast(rtrim(ltrim(MLR.COD_EMPRESA)) as varchar(3)), 3) ";
	sql += "	+ right(replicate('0',3)+cast(rtrim(ltrim(MLR.COD_LISTA_FILHO)) as varchar(3)), 3)  AS META_LIST ";
	sql += "	, TYPE, MLR.COD_TABELA as TIPO ";
	sql += "FROM meta_lista_rel MLR ";
	sql += "INNER JOIN documento DAD on MLR.COD_EMPRESA = DAD.COD_EMPRESA and MLR.COD_LISTA_PAI = DAD.COD_LISTA and DAD.VERSAO_ATIVA = 1 ";
	sql += "INNER JOIN SERV_DATASET DAD_DS on MLR.COD_EMPRESA = DAD_DS.COD_EMPRESA and DAD.NR_DOCUMENTO = DAD_DS.DSL_DATASET and DAD_DS.IS_ACTIVE = 1 ";
	sql += "	AND DAD_DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DAD_DS.TYPE = 'BUILTIN' ";
	sql += "WHERE MLR.COD_EMPRESA="+company;
	sql += " order by 1 DESC;";
	return sql;
}
function getOracleSyntax(company){
	var sql = " SELECT TO_CHAR(COD_DATASET) AS COD_DATASET, '0' AS NR_DOCUMENTO ";
	sql += " 	, CONVERT(CONCAT('MD',CONCAT(LPAD(COD_EMPRESA,3,0),LPAD(COD_LISTA,3,0))), 'UTF8') AS META_LIST ";
	sql += " 	, TYPE, 'jornalizado' as DETAIL ";
	sql += " FROM SERV_DATASET WHERE COD_EMPRESA = "+company+" AND TYPE = 'CUSTOM' AND COD_LISTA IS NOT NULL ";
	sql += " UNION ALL ";
	sql += " SELECT TO_CHAR(DS.COD_DATASET), TO_CHAR(D.NR_DOCUMENTO) ";
	sql += " 	, CONVERT(CONCAT('ML',CONCAT(LPAD(D.COD_EMPRESA,3,0),LPAD(D.COD_LISTA,3,0))), 'UTF8') AS META_LIST ";
	sql += " 	, TYPE, 'principal' as TIPO ";
	sql += " FROM SERV_DATASET DS ";
	sql += " INNER JOIN DOCUMENTO D ON DS.COD_EMPRESA = D.COD_EMPRESA AND TO_CHAR(DS.DSL_DATASET) = D.NR_DOCUMENTO AND D.VERSAO_ATIVA = 1 ";
	sql += " WHERE DS.COD_EMPRESA = "+company+" and DS.IS_ACTIVE = 1 AND DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DS.TYPE = 'BUILTIN' ";
	sql += " UNION all ";
	sql += " SELECT TO_CHAR(DAD_DS.COD_DATASET), TO_CHAR(MLR.COD_LISTA_PAI) as NR_DOCUMENTO ";
	sql += " 	, CONVERT(CONCAT('ML',CONCAT(LPAD(MLR.COD_EMPRESA,3,0),LPAD(MLR.COD_LISTA_FILHO,3,0))), 'UTF8') AS META_LIST ";
	sql += " 	, TYPE, MLR.COD_TABELA as TIPO ";
	sql += " FROM meta_lista_rel MLR ";
	sql += " INNER JOIN documento DAD on MLR.COD_EMPRESA = DAD.COD_EMPRESA and MLR.COD_LISTA_PAI = DAD.COD_LISTA and DAD.VERSAO_ATIVA = 1 ";
	sql += " INNER JOIN SERV_DATASET DAD_DS on MLR.COD_EMPRESA = DAD_DS.COD_EMPRESA and DAD.NR_DOCUMENTO = TO_CHAR(DAD_DS.DSL_DATASET) and DAD_DS.IS_ACTIVE = 1 ";
	sql += " 	AND DAD_DS.DSL_BUILDER = 'com.datasul.technology.webdesk.dataset.MetaListDatasetBuilder' AND DAD_DS.TYPE = 'BUILTIN' ";
	sql += " WHERE MLR.COD_EMPRESA="+company;
	sql += " 	order by 1 DESC; ";
	return sql;
}

function limparVinculos(_this, mapaDeMetalistas){
	log.info("fluig_metalistas - limparVinculos");
	log.dir(mapaDeMetalistas);
	var metalistas = DatasetFactory.getDataset("fluig_metalistas", [], [], []);
	if (metalistas != null && metalistas.rowsCount > 0) {
		for (var e = 0; e < metalistas.rowsCount; e++) {
			var nrDocumento = "" + metalistas.getValue(e, "NR_DOCUMENTO").intValue();
			if((mapaDeMetalistas[nrDocumento] == undefined)) {
				log.info("fluig_metalistas - limparVinculos - NR_DOCUMENTO: " + nrDocumento);
				_this.deleteRow([''
					, metalistas.getValue(e, "COD_DATASET")
					, metalistas.getValue(e, "NR_DOCUMENTO")
					, ''
					, metalistas.getValue(e, "SUBTIPO")]);
			}
		}
	}
	return _this;
}