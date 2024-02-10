function defineStructure() {
    addColumn("MSG", DatasetFieldType.STRING);
    addColumn("COD_DATASET", DatasetFieldType.STRING);
    addColumn("SUBTIPO", DatasetFieldType.STRING);
    addColumn("METALISTA", DatasetFieldType.STRING);
    addColumn("INDEX_NAME", DatasetFieldType.STRING);
    addColumn("CAMPOS", DatasetFieldType.STRING);
    setKey(["INDEX_NAME"]);
    addIndex(["COD_DATASET"]);
    addIndex(["COD_DATASET", "SUBTIPO"]);
}
function onSync(lastSyncDate) {
	log.info("fluig_metalistas_index");
	var dataset = DatasetBuilder.newDataset();
	
	criarIndices(dataset);
	
	log.info("fluig_metalistas_index - FIM");
	return dataset;
}
function createDataset(fields, constraints, sortFields) { }

function onMobileSync(user) {
	var sort = [];
	var constraints = [];
	var fields = [ 'COD_DATASET', 'SUBTIPO', 'METALISTA', 'INDEX_NAME', 'CAMPOS' ];
	var result = {
			'fields' : fields,
			'constraints' : constraints,
			'sortingFields' : sort
	};
	return result;
}

function getCreateIndexBTREE(indexName, metalista, listaCampos){
	return "CREATE INDEX IDX_"+indexName+" USING BTREE " +
			"ON " + metalista + " (" + listaCampos.join() + ");";
}

function criarIndices(dataset){
	indicesContrato(dataset);
	indicesEtapa(dataset);
	indicesRequisito(dataset);
}

function indicesContrato(dataset){ log.warn("fluig_metalistas_index - indicesContrato - não implementado"); }

function indicesEtapa(dataset){ 
	log.info("fluig_metalistas_index - indicesEtapa");
	
	var cod_dataset = "geral_cadastro_etapa";
	var indices = [ 
		{ "tipo": "principal", "nome": "CONTRATO_SITUACAO_ETAPA", "campos": ["cd_contrato(40)","situacao_fisica(14)"] }
		, { "tipo": "principal", "nome": "CD_ETAPA", "campos": ["cd_etapa(40)"] }
		, { "tipo": "table_item_etapa", "nome": "ITEM_ID_ITEM", "campos": ["id_item(40)"] }
		, { "tipo": "table_componente_item", "nome": "ITEM_COMPONENTE_UUID", "campos": ["uuid_item(40)"] }
		, { "tipo": "table_componente_item", "nome": "ITEM_COMPONENTE_ID_COMP", "campos": ["id_componente(40)"] }
		, { "tipo": "tb_requisito", "nome": "ITEM_REQUISITO_UUID", "campos": ["uuid_item_requisito(40)"] }
		, { "tipo": "tb_requisito", "nome": "ITEM_REQUISITO_ID_COMP", "campos": ["id_requisito(40)"] }
	];
	processaIndiceGenerico(dataset, "indicesEtapa", cod_dataset, indices);
}

function indicesRequisito(dataset){ 
	log.info("fluig_metalistas_index - indicesRequisito");
	
	var cod_dataset = "geral_cadastro_requisito";
	var indices = [ 
		{ "tipo": "principal", "nome": "REQ_DS_ID", "campos": ["ds_id(40)"] }
	];
	processaIndiceGenerico(dataset, "indicesRequisito", cod_dataset, indices);
}

/**
 * Processa a criação de INDEX genérico para as MLs obtidas dinamicamente conforme
 * código do dataset e tipo (tablename).
 * @param dataset -> Dataset pra adicionar linhas com processamento
 * @param caller -> Nome para saber a função que executou a chamada
 * @param cod_dataset -> Cod dataset do fichário da ML
 * @param indexes -> Objeto com tipo (tablename para busca ml) e index (nome da index a criar)
 * @returns
 */
function processaIndiceGenerico(dataset, caller, cod_dataset, indices){
	for(var idx in indices){
		var mensagem = "Sem ação";
		var indice = indices[idx];
		try{
			var cs = [
				DatasetFactory.createConstraint("cod_dataset", cod_dataset, cod_dataset, ConstraintType.MUST)
				, DatasetFactory.createConstraint("subtipo", indice.tipo, indice.tipo, ConstraintType.MUST)
			];
			var metalistaInfo = DatasetFactory.getDataset('fluig_metalistas', [], cs,[]);
			if(metalistaInfo != null && metalistaInfo.rowsCount > 0){
				
				var metalista = metalistaInfo.getValue(0,'META_LIST');
//				var sql = getCreateViewGenerico(view.view, metalistaInfo.getValue(0,'META_LIST'));
				var sql = getCreateIndexBTREE(indice.nome, metalista, indice.campos);
				var update = DatasetFactory.getDataset("fluig_sqlAtualizaFluig", [sql], [], []);
				if(update != null && update.rowsCount > 0){
					mensagem = "Indíce atualizado: " + update.getValue(0,'RESULT');
				}
				dataset.addOrUpdateRow([
					mensagem
					, cod_dataset
					, indice.tipo
					, metalista
					, indice.nome
					, indice.campos.join()
				]);
			}
		} catch(e){
			log.error("fluig_metalistas_index - " + caller + " - e: " + e.toString());
			dataset.addOrUpdateRow([ e.toString(), cod_dataset, indice.tipo
				, metalista, indice.nome, indice.campos]);
		}
	}
}