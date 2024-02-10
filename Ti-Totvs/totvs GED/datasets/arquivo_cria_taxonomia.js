function defineStructure() {
	addColumn('ERRO');
	addColumn('idPasta');
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	return main(dataset);
}
function createDataset(fields, constraints, sortFields) {
	log.info('arquivo_cria_taxonomia - INICIO');
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn('ERRO');
	dataset.addColumn('idPasta');
	
	return main(dataset);
}
function onMobileSync(user) {}

var ID_PUBLICADOR;
var COMPANY;
var ASSUNTOS;
var UNIDADES_TOTVS;
var ANO_MES;

//Contador para evitar loop infinito
var COUNTER;
//Quantas vezes passou em cada passo
var STEPS;

//Processamento inicial compartilhado entre onsync e online
function main(dataset){
	ID_PUBLICADOR = "adm";
	COMPANY = getValue('WKCompany');
	
	UNIDADES_TOTVS = getUnidadesTotvs();
	if(UNIDADES_TOTVS == null || UNIDADES_TOTVS.length == 0){
		throw 'Não foi possível obter a lista de unidades TOTVS. Não será possível prosseguir.';
	}
	
	ASSUNTOS = getAssuntos();
	STEPS = {};
	
	ANO = getAno();
	ANO_MES = getAnoMes();
	log.info('arquivo_cria_taxonomia - ANO: ' + ANO + ' - mes: ' + ANO_MES);
	
	//Busca as taxonomias cadastradas
	var cabecalho = DatasetFactory.getDataset('arquivo_consulta_taxonomia', ['cd_raiz'], [], []);
	if(cabecalho != null && cabecalho.rowsCount > 0){
		log.info('arquivo_cria_taxonomia - cabecalho.rowsCount: ' + cabecalho.rowsCount);
		
		//Para cada taxonomias, processa a estrutura de pastas
		for(var i = 0; i < cabecalho.rowsCount; i++){
			COUNTER = 0;
			var pastaRaiz = cabecalho.getValue(i, "cd_raiz");
			processarTaxonomia(dataset, pastaRaiz);
		}
	}
	
	log.info('arquivo_cria_taxonomia - processarEstrutura - STEPS: ');
	log.dir(STEPS);
	
	return dataset;
}

/**
	Processa a taxonomia a partir da pasta raiz dela no GED
 */
function processarTaxonomia(dataset, pastaRaiz){
	log.info('arquivo_cria_taxonomia - processarTaxonomia - pastaRaiz: ' + pastaRaiz);
	
	var mapa = {};
	var niveis = { '': { 'row': null, idPasta: {} } };
	niveis[''].idPasta[pastaRaiz] = false;
	
	//Busca a estrutura de taxonomia a partir daquela pasta raiz
	//, conforme definido no cadastro
	var constraints = [ 
		DatasetFactory.createConstraint('pai.cd_raiz', pastaRaiz, null, ConstraintType.MUST )
	];
	var taxonomia = DatasetFactory.getDataset('arquivo_consulta_taxonomia_compl', [], constraints, []);
	if(taxonomia != null && taxonomia.rowsCount > 0){
		for(var i = 0; i < taxonomia.rowsCount; i++){
			var uuid_pai = taxonomia.getValue(i, "uuid_pai");
			var uuid_nivel = taxonomia.getValue(i, "uuid_nivel");
			if(mapa[uuid_pai] == null) mapa[uuid_pai] = { 'row': i, subniveis: {} };
			
			//"mapa" carrrega os dados em um objeto relacionando-os de forma hierarquica
			//O pai tem quais filhos. Um filho pode não ter filhos abaixo
			mapa[uuid_pai].subniveis[uuid_nivel] = { 'row': i };
			
			//"niveis" carrega na forma de objeto para listá-los por chave
			//todos os níveis de pastas estão listados sem relação entre eles
			niveis[uuid_nivel] = { 'row': i, idPasta: {} };
			
			/*A ideia é através do mapa processar a pasta pai e ver quais filhos precisa ter abaixo.
			 *Para saber os detalhes de cada pasta que precisa ser criada respeitando essa relação de pai x filho
			 *, olhamos os detalhes no nível
			 */
		}
	}
	
	//Inicia o processamento da estrutura pelas pastas abaixo da raíz
	var nohRaiz = ''; //abaixo da raiz
	var unidade = null;
	processarEstrutura(dataset, nohRaiz, mapa, niveis, taxonomia, pastaRaiz, unidade);
	
	log.info('arquivo_cria_taxonomia - processarEstrutura - mapa: ');
	log.dir(mapa);
	log.info('arquivo_cria_taxonomia - processarEstrutura - niveis: ');
	log.dir(niveis);
}

function processarEstrutura(dataset, noh, mapa, niveis, taxonomia, idPastaPai, unidadeEstrutura){
	registraSteps(noh, idPastaPai);
	COUNTER++;
	if(COUNTER > 50000) {
		throw 'Saindo do loop';
	}
	
	var nomePasta = null;
	var idAssunto = null;
	
	//A raiz não precisa ser criada. 
	//Quando a linha é nula é pq é a raiz
	if(niveis[noh].row != null){
		var idPasta = null;
		var tipoPasta = taxonomia.getValue(niveis[noh].row, 'tipo_pasta_nivel');
		
		log.warn('arquivo_cria_taxonomia - processarEstrutura - COUNTER: ' + COUNTER 
		+ ' - idPastaPai: ' + idPastaPai + ' - noh: ' + noh 
		+ ' - unidadeEstrutura: ' + unidadeEstrutura + ' - tipoPasta: ' + tipoPasta);
	
		if(tipoPasta == "unidades_totvs"){
			//Quando estamos processando configuração tipo unidade_totvs
			//é preciso iterar por todas as unidades cadastradas no respectivo formulário
			//Para cada uma delas deve ser criada uma pasta, se necessário
			//dentro da pasta de cada uma, deve ser replicada a estrutura de taxonomia abaixo dela.
			for(var u in UNIDADES_TOTVS){
				var unidade = UNIDADES_TOTVS[u];
				var nomePasta = unidade.cd_coligada + ' - ' + unidade.cd_filial;
				
				unidade.idPasta = buscaPasta(idPastaPai, nomePasta);
				if(unidade.idPasta == null){
					unidade.idPasta = criarPasta(dataset, idPastaPai, nomePasta, tipoPasta, idAssunto);
				}
				niveis[noh].idPasta[unidade.idPasta] = unidade;
			}
		}
		else if(tipoPasta == "ano"){
			nomePasta = ANO;
			idAssunto = null;
		}
		else if(tipoPasta == "ano_mes"){
			nomePasta = ANO_MES;
			idAssunto = null;
		}
		else if(tipoPasta == "especifico"){
			nomePasta = taxonomia.getValue(niveis[noh].row, 'nome_pasta');
			idAssunto = null;
		}
		else if(tipoPasta == 'sobdemanda'){
			log.info('arquivo_cria_taxonomia - processarEstrutura - '
				+'a criação dessa pasta ocorre de forma manual pelo usuário quando necessário');
			//Listar pastas filhas da pai
			//Verificar se tem alguma pasta diferente
			var pastaSobDemanda = verificarPastaSobDemanda(listarPastasFilhas(idPastaPai));
			
			//Se achou a pasta sobdemanda
			if(pastaSobDemanda != null){
				nomePasta = pastaSobDemanda.nome;
				idPasta = pastaSobDemanda.id;
				idAssunto = null;
			}
			else return true;
		}
		else if(tipoPasta == "publicacao"){
		    if(unidadeEstrutura == null || !unidadeEstrutura) return false;
			nomePasta = taxonomia.getValue(niveis[noh].row, 'nm_assunto');
			idAssunto = taxonomia.getValue(niveis[noh].row, 'cd_assunto');
			
			var filial = parseInt(unidadeEstrutura.cd_filial, 10);
			if(ASSUNTOS[idAssunto].centraliza_matriz == 'sim' 
				&& unidadeEstrutura.concentrar_matriz == 'sim' 
				&& filial != 1){
				return false;
			}
		}
		else if(tipoPasta == 'publicacao_diretoria'){
			//Precisa ter unidade definida para aplicar essa regra de criação de pasta
			if(unidadeEstrutura == null || !unidadeEstrutura) return false;
			if(unidadeEstrutura.possui_diretoria != 'sim') return false;
			
			nomePasta = taxonomia.getValue(niveis[noh].row, 'nm_assunto');
			idAssunto = taxonomia.getValue(niveis[noh].row, 'cd_assunto');
			
			var filial = parseInt(unidadeEstrutura.cd_filial, 10);
			if(ASSUNTOS[idAssunto].centraliza_matriz == 'sim' 
				&& unidadeEstrutura.concentrar_matriz == 'sim' 
				&& filial != 1){
				return false;
			}
		}
		
		//Deveria entrar sempre, exceto quando:
		//for uma pasta tipo sobdemanda e essa for encontrada no bloco especifico do tipo
		if(idPasta == null){ 
			idPasta = buscaPasta(idPastaPai, nomePasta); 
		}
		
		log.info('arquivo_cria_taxonomia - processarEstrutura - tipoPasta: ' + tipoPasta 
			+ ' - nomePasta: ' + nomePasta 
			+ ' - niveis[noh].idPasta[idPasta]: ' + niveis[noh].idPasta[idPasta]);
		
		if(idPasta == null && !niveis[noh].idPasta[idPasta]){
			idPasta = criarPasta(dataset, idPastaPai, nomePasta, tipoPasta, idAssunto);
		}
		if(tipoPasta != "unidades_totvs"){
			niveis[noh].idPasta[idPasta] = false;
		}
	}
	
	//Aqui deveria estar com a pasta criada
	if(niveis[noh].idPasta == null || niveis[noh].idPasta == {}) throw "Erro ao criar pasta";
	
	//Processa os subníveis da pasta
	if(mapa[noh] != null){
		for(var nohFilho in mapa[noh].subniveis){
			for(var p in niveis[noh].idPasta){
				log.info('arquivo_cria_taxonomia - processarEstrutura - p: ' + p 
					+ ' - niveis[noh].idPasta[p]: ' + niveis[noh].idPasta[p]);
				log.dir(niveis[noh].idPasta[p]);
				
				var idPasta = p;
				var unidadePasta = niveis[noh].idPasta[p];
				processarEstrutura(dataset, nohFilho, mapa, niveis, taxonomia, idPasta
					, (!unidadePasta) ? unidadeEstrutura : unidadePasta);
			}
		}
	}
}

function buscaPasta(idPastaPai, nomePasta){
	log.info('arquivo_cria_taxonomia - buscaPasta - idPastaPai: ' + idPastaPai + " - nomePasta: " + nomePasta);
	
	var constraints = [ 
		DatasetFactory.createConstraint('documentPK.companyId', COMPANY, COMPANY, ConstraintType.MUST )
		, DatasetFactory.createConstraint('parentDocumentId', idPastaPai, idPastaPai, ConstraintType.MUST )
		, DatasetFactory.createConstraint('activeVersion', true, true, ConstraintType.MUST )
		, DatasetFactory.createConstraint('documentDescription', nomePasta, nomePasta, ConstraintType.MUST )
	];
	var pasta = DatasetFactory.getDataset('document', ['documentPK.documentId'], constraints, []);
	if(pasta == null || pasta.rowsCount == 0) return null;
	
	return pasta.getValue(0, 'documentPK.documentId');
}

function buscaListaPastas(idPastaPai, nomePasta, like){
	log.info('arquivo_cria_taxonomia - buscaListaPastas - idPastaPai: ' + idPastaPai + " - nomePasta: " + nomePasta);
	var pastas = [];
	
	var docDescConstraint = DatasetFactory.createConstraint('documentDescription', nomePasta, nomePasta, ConstraintType.MUST );
	docDescConstraint.setLikeSearch(like);
	var constraints = [ 
		DatasetFactory.createConstraint('documentPK.companyId', COMPANY, COMPANY, ConstraintType.MUST )
		, DatasetFactory.createConstraint('parentDocumentId', idPastaPai, idPastaPai, ConstraintType.MUST )
		, DatasetFactory.createConstraint('activeVersion', true, true, ConstraintType.MUST )
		, docDescConstraint
	];
	var fields = ['documentPK.documentId', 'documentDescription', 'keyWord', 'additionalComments'];
	var pastaDS = DatasetFactory.getDataset('document', fields, constraints, []);
	if(pastaDS == null || pastaDS.rowsCount == 0) return pastas;
	
	for(var i = 0; i < pastaDS.rowsCount; i++){
		var pasta = { 
			'id': pastaDS.getValue(i, 'documentPK.documentId')
			, 'nome': pastaDS.getValue(i, 'documentDescription')
			, 'keyWord': pastaDS.getValue(i, 'keyWord')
		};
		if(pasta.keyWord == '' || pasta.keyWord == null){
			pasta.keyWord = pastaDS.getValue(i, 'additionalComments');
		}
		pastas.push(pasta);
	}
	return pastas;
}

function criarPasta(dataset, idPastaPai, nomePasta, tipoPasta, idAssunto){
	log.info('arquivo_cria_taxonomia - criarPasta - idPastaPai: ' +idPastaPai
		+ ', nomePasta: ' + nomePasta +', tipoPasta: ' + tipoPasta + ', idAssunto: ' + idAssunto);
	var idPasta = null;
	var keyWord = 'TIPO_'+tipoPasta;
	var pasta = {
		"parentFolderId": ""+idPastaPai,
		"iconId": "23",
		"documentDescription": ""+nomePasta,
		"additionalComments": keyWord,
		"versionDescription": "",
		"expires": "false",
		"keyWord": keyWord,
		"publisherId": ""+ID_PUBLICADOR,
		"volumeId": "Default",
		"permissionType": "",
		"restrictionType": "",
		"inheritSecurity": true,
		"approvalAndOr": "false",
		"permissions": [],
		"restrictions": [],
		"publisherApprovers": [],
		"downloadEnabled": true,
		"documentTypeId": "1",
		"internalVisualizer": "true"
	};
	if(idAssunto != null){
		pasta['topicId'] = ""+idAssunto;
	}
	 
	try {
		var data = {
			companyId: COMPANY + '',
            serviceCode: 'fluigAPI_autenticacao', //  Nome do serviço cadastrado no Fluig
            endpoint: encodeURI('/api/public/2.0/folderdocuments/create'),
            method: 'POST', // 'delete', 'patch', 'put', 'get'     
            timeoutService: '120', // segundos
            params : pasta,    //  Parametros da API
            options: {
                encoding: 'UTF-8',
                mediaType: 'application/json'
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        
        //log.info('#### arquivo_cria_taxonomia - data');
        //log.dir(data);

        var clientService = fluigAPI.getAuthorizeClientService();
        var response = clientService.invoke(JSON.stringify(data));

        //log.info('#### arquivo_cria_taxonomia - response');
        //log.dir(response);

        var httpStatus = response.getHttpStatusResult();
        var result = response['result'];
        if (httpStatus == 200) {
            var obj = JSON.parse(result);
            idPasta = obj.content.documentId;
            
            if(idAssunto != null){
				var resultadoAssunto = atualizarAssunto(idPasta, idAssunto);
				if(resultadoAssunto.error != '') throw resultadoAssunto.error;
			}
            
            dataset.addRow([ '', obj.content.documentId ]);
        } else {
			dataset.addRow([ '', result ]);
        }

	} catch (error) {
        log.error('#### arquivo_cria_taxonomia - Falha ao processar: ' + error);
        log.dir(error);

        dataset.addRow([ error.toString(), '' ]);
    }
    
    return idPasta;
}

function getUnidadesTotvs(){
	var mapaUnidades = null;
	var campos = ['cd_coligada', 'cd_filial', 'possui_diretoria', 'concentrar_matriz'];
	//var unidades = DatasetFactory.getDataset('arquivo_consulta_unidades', ['cd_coligada', 'cd_filial'], [],[]);
	var unidades = DatasetFactory.getDataset('arquivo_unidades_totvs', campos, [],[]);
	if(unidades != null && unidades.rowsCount > 0){
		mapaUnidades = {};
		
		for(var i = 0; i < unidades.rowsCount; i++){
			var unidade = { 'idPasta': null	};
			for(var c = 0; c < campos.length; c++){
				var campo = campos[c];
				unidade[campo] = unidades.getValue(i, campo);
			}
			var chave = unidade.cd_coligada + ' - ' + unidade.cd_filial;
			mapaUnidades[chave] = unidade;
		}
	}
	return mapaUnidades;
}

/** Obtém um objeto mapa com os assuntos e configurações relacionadas */
function getAssuntos(){
	var mapaAssuntos = null;
	var campos = [ 'cd_assunto', 'nm_assunto', 'centraliza_matriz', 'quando'];
	var assuntos = DatasetFactory.getDataset('arquivo_assunto_temporalidade', campos, [],[]);
	if(assuntos != null && assuntos.rowsCount > 0){
		mapaAssuntos = {};
		
		for(var i = 0; i < assuntos.rowsCount; i++){
			var assunto = {};
			for(var c = 0; c < campos.length; c++){
				var campo = campos[c];
				assunto[campo] = assuntos.getValue(i, campo);
			}
			mapaAssuntos[assunto.cd_assunto] = assunto;
		}
	}
	return mapaAssuntos;
}

/**Como a API não permite definir as propriedades herdadas
	e não há API ou WS para isso, foi implementado via banco.
	Em paralelo foi solicitada a melhoria */
function atualizarAssunto(idPasta, idAssunto){
	var sql = "INSERT INTO default_propried_docto ";
	sql += " (NOM_ATRIBUTO, COD_EMPRESA, NR_DOCUMENTO, NR_VERSAO, FORMAT_ATRIBUTO, DES_VAL_ATRIBUIC) ";
	sql += " VALUES('Subject', "+COMPANY+", "+idPasta+", 1000, 'INTEGER', "+idAssunto+")";
	
	return inserirPropriedade(sql);
}

function inserirPropriedade(sql){
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

function listarPastasFilhas(idPastaPai){
	var like = true;
	return buscaListaPastas(idPastaPai, '%', like);
}
function verificarPastaSobDemanda(pastas){
	log.info("arquivo_atualizaDados - verificarPastaSobDemanda - pastas: ");
	log.dir(pastas);
	
	//Quando não houver sob demanda retornará nulo
	var sobDemanda = null;
	for(var i = 0; i < pastas.length; i++){
		//Se tiver uma sobdemanda, sai do laço.
		//Só deveria haver uma sobdemanda por nível
		var pasta = pastas[i];
		if(pasta.keyWord.indexOf('TIPO_') == -1){
			sobDemanda = pasta;
			break;
		}
	}
	return sobDemanda;
}

function registraSteps(noh, idPasta){
	if(STEPS[noh] == null) STEPS[noh] = {};
	if(STEPS[noh][idPasta] == null) STEPS[noh][idPasta] = 0;
	STEPS[noh][idPasta]++;
}

//DATE UTILS
var hoje = java.time.LocalDate.now();
var LOCALE_PT_BR = new java.util.Locale("pt", "br");
var formatAno = java.time.format.DateTimeFormatter
	.ofPattern("yyyy")
	.withLocale(LOCALE_PT_BR);
var formatAnoMes = java.time.format.DateTimeFormatter
	.ofPattern("yyyy-MM")
	.withLocale(LOCALE_PT_BR);

/**
 * Obter objeto LocalDate do Java para usar API de data
 * @param date: String 
 */
function getLocalDate(date){
	log.info("regras_aviso_recorrencia - getLocalDate - date: " + date);
	if(date == undefined || date == null || date == "") return null;
	
	var split = date.split('/');
	return java.time.LocalDate.of(parseInt(split[2], 10), parseInt(split[1], 10), parseInt(split[0], 10));
}

function getAno(){
	return hoje.format(formatAno);
}

function getAnoMes(){
	return hoje.format(formatAnoMes);
}