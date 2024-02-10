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
	log.info("fluig_views");
	var dataset = DatasetBuilder.newDataset();
	
	criarViews(dataset);
	
	log.info("fluig_views - FIM");
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
	//D15
	viewsECM(dataset);
	viewsDemandas(dataset);
	
	//D60
	viewsAceitacao(dataset);
	viewsNF(dataset);
	viewsComprovanteQuitacao(dataset);
	viewsMedicao(dataset);
	viewsEmpenho(dataset);
	
	//D90
	viewsContrato(dataset);
	viewsEtapa(dataset);
	viewsCadastrosD90(dataset);
	
	viewsMudanca(dataset);
	viewsVerificacaoRegra(dataset);
	
	viewsViagens(dataset);
	
	//Cadastros
	viewsCadastrosGerais(dataset);
}

function viewsECM(dataset){ log.warn("fluig_views - viewsECM - não implementado"); }
function viewsDemandas(dataset){ log.warn("fluig_views - viewsDemandas - não implementado"); }

function viewsAceitacao(dataset){ 
	log.info("fluig_views - viewsAceitacao");
	
	//PR 004
	var cod_dataset = "PR004";
	var views = [ { "tipo": "principal", "view": "VIEW_TESTE_ACEITACAO"}
		, { "tipo": "table_item_etapa", "view": "VIEW_TESTE_ACEITACAO_ITEM"}
		, { "tipo": "table_regras", "view": "VIEW_TESTE_ACEITACAO_REGRAS"}
		, { "tipo": "table-table_solucoes", "view": "VIEW_TESTE_ACEITACAO_SOLUCOES"}
	];
	processaViewGenerica(dataset, "viewsAceitacao-004", cod_dataset, views);
	
	//PR 014
	cod_dataset = "PR014";
	views = [ { "tipo": "principal", "view": "VIEW_ACEITACAO_SIMPLIFICADA"}
		, { "tipo": "table_item_etapa", "view": "VIEW_ACEITACAO_SIMPLIFICADA_ITEM"}
		, { "tipo": "table_regras", "view": "VIEW_ACEITACAO_SIMPLIFICADA_REGRAS"}
		, { "tipo": "table_solucoes", "view": "VIEW_ACEITACAO_SIMPLIFICADA_SOLUCOES"}
	];
	processaViewGenerica(dataset, "viewsAceitacao-014", cod_dataset, views);
	
	//FAT PR 015
	cod_dataset = "PR015";
	views = [ { "tipo": "principal", "view": "VIEW_FAT"} ];
	processaViewGenerica(dataset, "viewsAceitacao-FAT", cod_dataset, views);
}
function viewsNF(dataset){ 
	log.info("fluig_views - viewsNF");
	
	var cod_dataset = "medicao_registroNFE";
	var views = [ { "tipo": "principal", "view": "VIEW_REGISTRO_NFE"}
		, { "tipo": "tableEmpenho", "view": "VIEW_REGISTRO_NFE_EMPENHO"}
	];
	processaViewGenerica(dataset, "viewsNF", cod_dataset, views);
}
function viewsComprovanteQuitacao(dataset){
	log.info("fluig_views - viewsComprovanteQuitacao");
	
	var cod_dataset = "medicao_atualizacao_comprovante_quitacao";
	var views = [ { "tipo": "principal", "view": "VIEW_ATUALIZACAO_COMPROVANTE_QUITACAO"} ];
	processaViewGenerica(dataset, "viewsComprovanteQuitacao", cod_dataset, views);
}
function viewsMedicao(dataset){
	log.info("fluig_views - viewsMedicao");
	
	var cod_dataset = "medicao_registro_medicao";
	var views = [ { "tipo": "principal", "view": "VIEW_MEDICAO"}
		, { "tipo": "tb_regras", "view": "VIEW_MEDICAO_REGRAS"}
		, { "tipo": "relacaoNotasFiscais", "view": "VIEW_MEDICAO_RELACAO_NF"}
		, { "tipo": "nfComplementar", "view": "VIEW_MEDICAO_COMPLEMENTAR"}
	];
	processaViewGenerica(dataset, "viewsMedicao", cod_dataset, views);
}
function viewsEmpenho(dataset){
	log.info("fluig_views - viewsEmpenho");
	
	var cod_dataset = "geral_cadastro_empenho";
	var views = [ { "tipo": "principal", "view": "VIEW_CADASTRO_EMPENHO"} ];
	processaViewGenerica(dataset, "viewsEmpenho", cod_dataset, views);
}

function viewsContrato(dataset){
	log.info("fluig_views - viewsContrato");
	
	//Contrato
	//TODO: Tipo principal: Duplicada
	//TODO: Tipo table_regras_obrigacoes: Duplicada
	var cod_dataset = "geral_cadastro_contratos";
	var views = [ { "tipo": "principal", "view": "VIEW_CADASTRO_CONTRATO"}
		, { "tipo": "principal", "view": "VIEW_DS_CADASTRO_CONTRATO"}
		, { "tipo": "table_regras_obrigacoes", "view": "VIEW_CONTRATO_REGRA"}
		, { "tipo": "table_regras_obrigacoes", "view": "VIEW_REGAS_OBRIGACOES"}
		, { "tipo": "table_fiscais_contrato", "view": "VIEW_CADASTRO_CONTRATO_FISCAIS"}
		, { "tipo": "table_obrigacoes_aces", "view": "VIEW_OBRIGACAO_ACESSORIA"}
		, { "tipo": "table_versoes", "view": "VIEW_DS_CADASTRO_CONTRATO_VERSOES"}
	];
	processaViewGenerica(dataset, "viewsContrato", cod_dataset, views);
	
	views = [ { "tipo": "principal", "view": "VIEW_DS_CADASTRO_CONTRATO_TODAS_VERSOES" }
		, { "tipo": "table_versoes", "view": "VIEW_DS_CADASTRO_CONTRATO_VERSOES_TODAS_VERSOES" }
	];
	processaViewTodasVersoes(dataset, "viewsContrato", cod_dataset, views);
	
	
	//PR 022 Encerramento contrato
	cod_dataset = "PR_022_encerramento_contrato";
	views = [ { "tipo": "principal", "view": "VIEW_ENCERRAMENTO_CONTRATO" }
		, { "tipo": "tableAtividadesEncerramento", "view": "VIEW_ENCERRAMENTO_CONTRATO_ATIVIDADES" }
	];
	processaViewGenerica(dataset, "viewsContrato-PR022-encerramento", cod_dataset, views);
}
function viewsEtapa(dataset){ 
	log.info("fluig_views - viewsEtapa");
	
	//Cadastro Etapa
	var cod_dataset = "geral_cadastro_etapa";
	var views = [ { "tipo": "principal", "view": "VIEW_ETAPA" }
		, { "tipo": "table_regras", "view": "VIEW_ETAPA_REGRA" }
		, { "tipo": "table_item_etapa", "view": "VIEW_ETAPA_ITEM" }
		, { "tipo": "table_componente_item", "view": "VIEW_ETAPA_ITEM_COMPONENTE" }
		, { "tipo": "tb_requisito", "view": "VIEW_ETAPA_ITEM_REQUISITO" }
		, { "tipo": "table_riscos", "view": "VIEW_ETAPA_RISCOS" }
		, { "tipo": "table_versoes", "view": "VIEW_ETAPA_VERSOES" }
		, { "tipo": "table_custos_administrativos", "view": "VIEW_ETAPA_CUSTOS_ADMINISTRATIVOS" }
	];
	processaViewGenerica(dataset, "viewsEtapa", cod_dataset, views);
	
	//TODO: Tipo principal: Duplicada
	views = [ { "tipo": "principal", "view": "VIEW_ETAPA_TODAS_VERSOES" }
		, { "tipo": "table_versoes", "view": "VIEW_ETAPA_VERSOES_TODAS_VERSOES" }
		, { "tipo": "table_versoes", "view": "VIEW_DS_CADASTRO_ETAPA_VERSOES_TODAS_VERSOES" }
	];
	processaViewTodasVersoes(dataset, "viewsEtapa", cod_dataset, views);

	//PR021 - Aprovação de Versão
	cod_dataset = "PR_021_aprovacao_versao_etapa";
	views = [ { "tipo": "principal", "view": "VIEW_APROVACAO_VERSAO_ETAPA" } ];
	processaViewGenerica(dataset, "viewsEtapa-PR021-aprovacao", cod_dataset, views);
}
function viewsCadastrosD90(dataset){
	log.info("fluig_views - viewsCadastrosD90");
	
	var cod_dataset = "geral_cadastro_requisito";
	var views = [ { "tipo": "principal", "view": "VIEW_CADASTRO_REQUISITO"}
	];
	
	processaViewGenerica(dataset, "viewsCadastrosD90", cod_dataset, views);
}

function viewsMudanca(dataset){ 
	log.info("fluig_views - viewsMudanca");

	//PR006 Solicitação de mudança
	//TODO: Tipo principal: Duplicada
	var cod_dataset = "PR_006_solicitacao_mudanca_contrato";
	var views = [ { "tipo": "principal", "view": "VIEW_SOLICITACAO_MUDANCA" }
		, { "tipo": "principal", "view": "VIEW_SOLICITACAO_MUDANCA_CONTRATO" }
		, { "tipo": "tableEtapas", "view": "VIEW_SOLICITACAO_MUDANCA_CONTRATO_ETAPA" }
	];
	processaViewGenerica(dataset, "viewsMudanca-1", cod_dataset, views)
	
	
	//PR008 Aditivo e apostilamento
	cod_dataset = "PR_008_aditivo_apostilamento";
	views = [ 
		{ "tipo": "principal", "view": "VIEW_ADITIVO_APOSTILAMENTO" }
		, { "tipo": "tb_SMs", "view": "VIEW_SM_ADITIVO_APOSTILAMENTO" }
	];
	processaViewGenerica(dataset, "viewsMudanca-2", cod_dataset, views);
}
function viewsVerificacaoRegra(dataset){
	log.info("fluig_views - viewsVerificacaoRegra");
	
	var cod_dataset = "PR-020.02";
	var views = [ { "tipo": "principal", "view": "VIEW_DISPARO_VERIFICACOES" }
		, { "tipo": "tabelaVerificacaoRegras", "view": "VIEW_DISPARO_VERIFICACOES_REGRAS" }
	];
	processaViewGenerica(dataset, "viewsPR-020.02", cod_dataset, views);
	
	cod_dataset = "PR-020.01";
	views = [ { "tipo": "principal", "view": "VIEW_VERIFICACAO_PLANEJADA" } ];
	processaViewGenerica(dataset, "viewsPR-020.01", cod_dataset, views);
	

	cod_dataset = "PR-020";
	views = [ { "tipo": "principal", "view": "VIEW_NAO_CONFORMIDADES_CONTRATUAIS" } ];
	processaViewGenerica(dataset, "viewsPR-020", cod_dataset, views);
}

function viewsViagens(dataset){
	log.info("fluig_views - viewsViagens");
	
	var cod_dataset = "ds_controle_viagens";
	var views = [ 
		//TODO: Remover duplicidade de views, avaliar impactos
		{ "tipo": "principal", "view": "VIEW_CONTROLE_DE_VIAGENS" }
		, { "tipo": "principal", "view": "VIEW_CONTROLE_VIAGEM" }
		, { "tipo": "tabelaEtapas", "view": "VIEW_CONTROLE_DE_VIAGENS_ETAPAS" }
		, { "tipo": "tabelaDetalhamentoViagem", "view": "VIEW_DETALHAMENTO_VIAGEM" }
	];
	processaViewGenerica(dataset, "viewsViagens-1", cod_dataset, views);
	
	cod_dataset = "viagens_controle_apoiadora";
	views = [ 
		{ "tipo": "principal", "view": "VIEW_CONTROLE_DE_VIAGENS_APOIADORA" }
		, { "tipo": "tb_etapa", "view": "VIEW_CONTROLE_DE_VIAGENS_APOIADORA_ETAPAS" }
	];
	processaViewGenerica(dataset, "viewsViagens-2", cod_dataset, views);
	
	cod_dataset = "D90_cancelamento_viagem";
	views = [ { "tipo": "principal", "view": "VIEW_CANCELAMENTO_VIAGENS" } ];
	processaViewGenerica(dataset, "viewsViagens-3", cod_dataset, views);
}

function viewsCadastrosGerais(dataset){
	log.info("fluig_views - viewsCadastrosGerais");
	
	//OM
	var cod_dataset = "geral_cadastro_om";
	var views = [ { "tipo": "principal", "view": "VIEW_ORGANIZACAO_MILITAR" } ];
	processaViewGenerica(dataset, "views-geral_cadastro_om", cod_dataset, views);
	
	//Fornecedor
	cod_dataset = "geral_cadastro_fornecedor";
	views = [ { "tipo": "principal", "view": "VIEW_CADASTRO_FORNECEDOR" } 
		, { "tipo": "tb_fornecedores_consorcio", "view": "VIEW_CADASTRO_FORNECEDOR_CONSORCIADOS" } 
	];
	processaViewGenerica(dataset, "views-geral_cadastro_fornecedor", cod_dataset, views);
	
	//Cadastro de tipo certidão
	cod_dataset = "geral_cadastro_certidao";
	views = [ { "tipo": "principal", "view": "VIEW_CADASTRO_CERTIDAO" } ];
	processaViewGenerica(dataset, "views-geral_cadastro_certidao", cod_dataset, views);
	
	//Informações profissionais
	cod_dataset = "profissional_cadastro_info";
	views = [ { "tipo": "principal", "view": "VIEW_PROFISSIONAL_CADASTRO_INFO" } ];
	processaViewGenerica(dataset, "views-profissional_cadastro_info", cod_dataset, views);
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
			log.info("fluig_views - processaView - view: " + view.view 
					+ " - subtipo: " + view.tipo	+ " - tipo: " + tipo);
			var cs = [
				DatasetFactory.createConstraint("cod_dataset", cod_dataset, cod_dataset, ConstraintType.MUST)
				, DatasetFactory.createConstraint("subtipo", view.tipo, view.tipo, ConstraintType.MUST)
			];
			var metalistaInfo = DatasetFactory.getDataset('fluig_metalistas', [], cs,[]);
			if(metalistaInfo != null && metalistaInfo.rowsCount > 0){
				
				var metalista = metalistaInfo.getValue(0,'META_LIST');
				var sql = "";
				log.info("fluig_views - processaView - view: " + view.view + " - subtipo: " + view.tipo
						+ " - tipo: " + tipo  + " - metalista: " + metalista);
				if(tipo == "generica") sql = getCreateViewGenerico(view.view, metalista);
				else if(tipo == "todas_versoes") sql = getCreateViewTodasVersoes(view.view, metalista);
				
				var update = DatasetFactory.getDataset("fluig_sqlAtualizaFluig", [sql], [], []);
				if(update != null && update.rowsCount > 0){
				dataset.addOrUpdateRow([
					"View atualizada: " + update.getValue(0,'RESULT')
					, view.view
					, cod_dataset
					, view.tipo
					, metalista]);
				}
			}
		} catch(e){
			log.error("fluig_views - " + caller + " - e: " + e.toString());
			dataset.addOrUpdateRow([ e.toString(), view.view, cod_dataset, view.tipo, ""]);
		}
	}
}