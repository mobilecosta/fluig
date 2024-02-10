function defineStructure() {
    addColumn("MSG", DatasetFieldType.STRING);
    addColumn("VIEW_NAME", DatasetFieldType.STRING);
    addColumn("COD_DATASET", DatasetFieldType.STRING);
    addColumn("SUBTIPO", DatasetFieldType.STRING);
    addColumn("METALISTA", DatasetFieldType.STRING);
    setKey(["VIEW_NAME"]);
    addIndex(["COD_DATASET"]);
    addIndex(["COD_DATASET", "SUBTIPO"]);
}
function onSync(lastSyncDate) {
	log.info("arquivo_views");
	var dataset = DatasetBuilder.newDataset();
	
	criarViews(dataset);
	
	log.info("arquivo_views - FIM");
	return dataset;
}
function createDataset(fields, constraints, sortFields) { }

function onMobileSync(user) {
	var sort = [];
	var constraints = [];
	var fields = ['VIEW', 'COD_DATASET', 'SUBTIPO'];
	var result = {
			'fields' : fields,
			'constraints' : constraints,
			'sortingFields' : sort
	};
	return result;
}

function getCreateViewGenerico(viewName, metalista){
	return "CREATE OR REPLACE VIEW " + viewName + " AS  "
	+ "(SELECT t.* FROM " + metalista + " t inner join documento d on d.cod_empresa = t.companyId "
	+ "		and d.nr_documento = t.documentid "
	+ "		and d.nr_versao = t.version "
	+ "		and d.versao_ativa = 1)";
}

function getCreateViewTodasVersoes(viewName, metalista){
	return "CREATE OR REPLACE VIEW " + viewName + " AS  "
	+ "(SELECT t.* FROM " + metalista + " t inner join documento d on d.cod_empresa = t.companyId "
	+ "		and d.nr_documento = t.documentid "
	+ "		and d.nr_versao = t.version)";
}

function criarViews(dataset){
	viewsUnidades(dataset);
	viewsAssuntoTemporalidade(dataset);
	viewsTaxonomia(dataset);
}

function viewsUnidades(dataset){
	log.info("arquivo_views - viewsUnidades");
	
	var cod_dataset = "arquivo_unidades_totvs";
	var views = [ { "tipo": "principal", "view": "VIEW_ARQ_UNIDADES" }
	];
	processaViewGenerica(dataset, "viewsUnidades", cod_dataset, views);
}

function viewsAssuntoTemporalidade(dataset){
	log.info("arquivo_views - viewsAssuntoTemporalidade");
	
	var cod_dataset = "arquivo_assunto_temporalidade";
	var views = [ { "tipo": "principal", "view": "VIEW_ARQ_ASSUNTO_TEMP" }
	];
	processaViewGenerica(dataset, "viewsAssuntoTemporalidade", cod_dataset, views);
}

function viewsTaxonomia(dataset){
	log.info("arquivo_views - viewsTaxonomia");
	
	var cod_dataset = "arquivo_taxonomia";
	var views = [ { "tipo": "principal", "view": "VIEW_ARQ_TAXONOMIA" }
		, { "tipo": "tbl_estrutura", "view": "VIEW_ARQ_TAXONOMIA_ESTR" }
	];
	processaViewGenerica(dataset, "viewsTaxonomia", cod_dataset, views);
}

/**
 * Processa a criação de VIEWS genérica que observam APENAS a versão ATIVA das fichas das ML.
 * @param dataset -> Dataset pra adicionar linhas com processamento
 * @param caller -> Nome para saber a função que executou a chamada
 * @param cod_dataset -> Cod dataset do fichário da ML
 * @param views -> Objeto com tipo (tablename para busca ml) e view (nome da view a criar)
 * @returns
 */
function processaViewGenerica(dataset, caller, cod_dataset, views){
	processaView(dataset, caller, cod_dataset, views, "generica");
}

/**
 * Processa a criação de VIEWS de TODAS as versões das ML.
 * @param dataset -> Dataset pra adicionar linhas com processamento
 * @param caller -> Nome para saber a função que executou a chamada
 * @param cod_dataset -> Cod dataset do fichário da ML
 * @param views -> Objeto com tipo (tablename para busca ml) e view (nome da view a criar)
 * @returns
 */
function processaViewTodasVersoes(dataset, caller, cod_dataset, views){
	processaView(dataset, caller, cod_dataset, views, "todas_versoes");
}

/**
 * Processa a criação de VIEWS genérica que observam APENAS a versão ATIVA das fichas das ML.
 * @param dataset -> Dataset pra adicionar linhas com processamento
 * @param caller -> Nome para saber a função que executou a chamada
 * @param cod_dataset -> Cod dataset do fichário da ML
 * @param views -> Objeto com tipo (tablename para busca ml) e view (nome da view a criar)
 * @param tipo -> generica ou todas_versoes
 * @returns
 */
function processaView(dataset, caller, cod_dataset, views, tipo){
	for(var v in views){
		var view = views[v];
		try{
			log.info("arquivo_views - processaView - view: " + view.view 
					+ " - subtipo: " + view.tipo	+ " - tipo: " + tipo);
			var cs = [
				DatasetFactory.createConstraint("cod_dataset", cod_dataset, cod_dataset, ConstraintType.MUST)
				, DatasetFactory.createConstraint("subtipo", view.tipo, view.tipo, ConstraintType.MUST)
			];
			var metalistaInfo = DatasetFactory.getDataset('fluig_metalistas', [], cs,[]);
			if(metalistaInfo != null && metalistaInfo.rowsCount > 0){
				
				var codLista = ''+parseInt(metalistaInfo.getValue(0,'COD_LISTA'),10);
				var metalista = metalistaInfo.getValue(0,'META_LIST_'+codLista.length);
				var sql = "";
				log.info("arquivo_views - processaView - view: " + view.view + " - subtipo: " + view.tipo
						+ " - tipo: " + tipo  + " - metalista: " + metalista);
				if(tipo == "generica") sql = getCreateViewGenerico(view.view, metalista);
				else if(tipo == "todas_versoes") sql = getCreateViewTodasVersoes(view.view, metalista);
				
				var resp = inserirView(sql);
				if(resp != null && resp.error == ''){
				dataset.addOrUpdateRow([
					"View atualizada: " + resp.result
					, view.view
					, cod_dataset
					, view.tipo
					, metalista]);
				}
			}
		} catch(e){
			log.error("arquivo_views - " + caller + " - e: " + e.toString());
			dataset.addOrUpdateRow([ e.toString(), view.view, cod_dataset, view.tipo, ""]);
		}
	}
}

function inserirView(sql){
	var obj = { 'result': 0, 'error': ''};
	
	var sqlUpdate =  sql;
	var dataSource = "/jdbc/AppDS"; //"/jdbc/FluigDSRO";       

	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	try {
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		var rs = stmt.executeUpdate(sqlUpdate);
		
		obj.result = rs;
				
	} catch(e) {
		log.error("arquivo_atualizaDados - ERROR: " + e.message);
		obj.error = e.message;
	} finally {
		if(stmt != null) stmt.close();
		if(conn != null) conn.close();
	}
	return obj;
}