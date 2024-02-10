function defineStructure() {
	addColumn('ERRO');
	addColumn('idRaiz');
	addColumn('unidade');
	addColumn('anoMes');
	addColumn('assunto');
	addColumn('validarEm');
	addColumn('idx');
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	return main(dataset);
}
function createDataset(fields, constraints, sortFields) {
	log.info('arquivo_valida_entregas_taxonomia - INICIO');
	
	//para testes apenas
	//efetivarRegistro('DROP TABLE arquivo_entregas_taxonomia');
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn('ERRO');
	dataset.addColumn('idRaiz');
	dataset.addColumn('unidade');
	dataset.addColumn('anoMes');
	dataset.addColumn('assunto');
	dataset.addColumn('validarEm');
	dataset.addColumn('idx');
	dataset.addColumn('pastas')
	
	
	return main(dataset, constraints);
}
function onMobileSync(user) {}

var ID_PUBLICADOR;
var COMPANY;
var ASSUNTOS;
var UNIDADES_TOTVS;
var MAPA;

//Processamento inicial compartilhado entre onsync e online
function main(dataset, constraints){
	MAPA = {};
	ID_PUBLICADOR = "rafael.vanat";
	COMPANY = getValue('WKCompany');
	
	var parametros = getParametros(constraints);
	iniciarControlesTemporais(parametros);
	
	ASSUNTOS = getAssuntos();
	UNIDADES_TOTVS = getUnidadesTotvs();
	if(UNIDADES_TOTVS == null || UNIDADES_TOTVS.length == 0){
		throw 'Não foi possível obter a lista de unidades TOTVS. Não será possível prosseguir.';
	}
	
	log.info('arquivo_valida_entregas_taxonomia - ASSUNTOS: ');
	log.dir(ASSUNTOS);
		 
	log.warn('TODO: Verificar se as configs de assunto batem com as configs de unidades referente diretoria???, e centralização.')
	
	//Busca as taxonomias cadastradas
	var cabecalho = DatasetFactory.getDataset('arquivo_consulta_taxonomia', ['cd_raiz'], [], []);
	if(cabecalho != null && cabecalho.rowsCount > 0){
		log.info('arquivo_valida_entregas_taxonomia - cabecalho.rowsCount: ' + cabecalho.rowsCount);
		
		//Para cada taxonomias, processa a estrutura de pastas
		for(var i = 0; i < cabecalho.rowsCount; i++){
			COUNTER = 0;
			var pastaRaiz = cabecalho.getValue(i, "cd_raiz");
			MAPA[pastaRaiz] = { };
			processarTaxonomia(dataset, pastaRaiz);
		}
		log.info('arquivo_valida_entregas_taxonomia - processarTaxonomia - finalizado');
	}
	return dataset;
}

/**
	Processa a taxonomia a partir da pasta raiz dela no GED
 */
function processarTaxonomia(dataset, pastaRaiz){
	log.info('arquivo_valida_entregas_taxonomia - processarTaxonomia - pastaRaiz: ' + pastaRaiz);
	
	var cs = [ 
		DatasetFactory.createConstraint('pastaRaiz', pastaRaiz, pastaRaiz, ConstraintType.MUST) 
		, DatasetFactory.createConstraint('expand_assuntos', 'true', 'true', ConstraintType.MUST)
		, DatasetFactory.createConstraint('expand_pastas', 'true', 'true', ConstraintType.MUST)
	];
	var publicacoesDs = DatasetFactory.getDataset('arquivo_consulta_publicacoes',[],cs,[]);
	for(var p = 0; p < publicacoesDs.rowsCount; p++){
		var publicacao = {
			'raiz': ''
			, 'unidade': ''
			, 'idUnidade': ''
			, 'ano': ''
			, 'anoMes': ''
			, 'pastaAnoMes': ''
			, 'pastaAssunto': ''
			, 'cdAssunto': ''
			, 'nivel': ''
			, 'idDocumento': ''
			, 'path': publicacoesDs.getValue(p, 'path')
			, 'pastas': publicacoesDs.getValue(p, 'pastas')
		}
		
		log.info('arquivo_valida_entregas_taxonomia - publicacoesDs - ' + publicacoesDs.getValue(p, 'path')
			+ ' - ' + publicacoesDs.getValue(p, 'tipos')+ ' - ' + publicacoesDs.getValue(p, 'assuntos'));
		
		var paths = publicacao.path.split('/ ');
		var tipos = publicacoesDs.getValue(p, 'tipos').split('/ ');
		var assuntos = publicacoesDs.getValue(p, 'assuntos').split('/ ');
		var nomePastas = publicacoesDs.getValue(p, 'pastas').split('/ ');
			
		for(var t = 0; t < tipos.length; t++){
			var tipo = tipos[t].trim();
			var path = paths[t].trim();
			var assunto = assuntos[t].trim();
			var nomePasta = nomePastas[t].trim();
			
			/*Se já identificou o nível na estrutura que deveria ter a publicação
			 e já passou dele e não achou documento publicado
			 , não é necessário continuar */
			if(publicacao.nivel > 0 && t > publicacao.nivel) continue;
			
			if(tipo == 'RAIZ'){
				publicacao.raiz = path;
			}
			if(tipo == 'TIPO_unidades_totvs'){
				publicacao.unidade = path;
				publicacao.idUnidade = nomePasta;
			}
			else if(tipo == 'TIPO_ano'){
				publicacao.ano = path;
			}
			else if(tipo == 'TIPO_ano_mes'){
				publicacao.anoMes = nomePasta;
				publicacao.pastaAnoMes = path;
			}
			else if(tipo == 'TIPO_publicacao' || tipo == 'TIPO_publicacao_diretoria'){
				publicacao.pastaAssunto = path;
				publicacao.cdAssunto = assunto;
				publicacao.nivel = t+1;
				
				//Inicializa a contagem de publicações na pasta do assunto
				if(MAPA[pastaRaiz][publicacao.pastaAssunto] == null){
					MAPA[pastaRaiz][publicacao.pastaAssunto] = { 'docs': [], 'cfg': null};
				}
			}
			else if(publicacao.nivel == t 
				&& path != publicacao.raiz
				&& path != ''){
				publicacao.idDocumento = path;
				
				//Incrementa a contagem de publicações na pasta do assunto
				MAPA[pastaRaiz][publicacao.pastaAssunto].docs.push(publicacao);
			}
		}
		//Se não há assunto, não há o que validar
		if(MAPA[pastaRaiz][publicacao.pastaAssunto] == null) continue;
		MAPA[pastaRaiz][publicacao.pastaAssunto].cfg = publicacao;
	}
	log.info('arquivo_valida_entregas_taxonomia - publicacoes: ');
	log.dir(MAPA[pastaRaiz]);
	
	verificarPendencias(dataset);
}

function verificarPendencias(dataset){
	log.info('arquivo_valida_entregas_taxonomia - verificarPendencias - INI');
	
	for(var pr in MAPA){
		var raiz = MAPA[pr];
		for(var pa in raiz){
			try{
				var pastaAssunto = raiz[pa];
				var cfgAssunto = ASSUNTOS[pastaAssunto.cfg.cdAssunto];
				if(cfgAssunto == null){
					throw 'Nâo há configuração de assunto para o assunto: ' + pastaAssunto.cfg.cdAssunto;
				}
				
				var periodicidade = cfgAssunto.periodicidade;
				if(periodicidade == 'sobdemanda'){
					registrarEntrega(pastaAssunto);
					continue;
				}
				
				//"diário" deve haver 1 documento para cada dia do mês publicado até o dia subsequente
				//"semanal" ou quinzenal deve haver 1 documento para cada semana/quinzena, publicado na semana posterior no dia da semana especificado. Quando for feriado, o prazo é postergado para o próximo dia útil. 
				//"mensal" sistema valida se foi publicado 1 documento com o assunto previsto até data 10, 15, 25 do mês subsequente a competência conforme configurado, após esse dia será considerado pendente. Quando mensal, será considerado o dia útil posterior no caso de feriado.
				//"semestral" sistema valida se foi publicado 1 documento com o assunto previsto no dia/mês definido e também após 6 meses. 
				//"anual" o sistema valida se até o dia/mês do ano corrente foi publicado do documento com assunto determinado.  
	
				//Verifica quando o assunto deveria validado naquele anoMes
				
				//if(periodicidade != 'semanal') continue;
				
				var validarEmArr = getDataValidacao(cfgAssunto, pastaAssunto.cfg.anoMes, hoje);
				log.info('arquivo_valida_entregas_taxonomia - verificarPendencias - validarEmArr: ' + validarEmArr
					+ ' - validarEmArr.len: ' + validarEmArr.length);
				log.dir(pastaAssunto);
				log.dir(cfgAssunto);
				
				if(validarEmArr == null || validarEmArr.length == 0){
					log.warn('arquivo_valida_entregas_taxonomia - verificarPendencias - '
						+ 'Não há data de validação esperada nesse anoMes: ' + pastaAssunto.cfg.anoMes + ' para o Assunto: ');
					log.dir(cfgAssunto);
					continue;
				}
				
				for(var i = 0; i < validarEmArr.length; i++){
					var validarEm = validarEmArr[i];
					verificarPendenciaNaData(dataset, pastaAssunto, hoje, validarEm, i+1);
				}
			}
			catch(e){
				dataset.addRow( [ 'verificarPendencias'+e.toString(), '', '', '', '', '', '' ] );
			}
		}
	}
}

function verificarPendenciaNaData(dataset, pastaAssunto, hoje, validarEm, idx){
	//Se assunto deveria ser validado antes de hoje
	if(validarEm.isBefore(hoje) || validarEm.isEqual(hoje)){
		if(pastaAssunto.docs[idx-1] == null || pastaAssunto.docs[idx-1].idDocumento == null){
			pastaAssunto.cfg.idDocumento = null;
			log.info('arquivo_valida_entregas_taxonomia - registrarPendencia - ');
			log.dir(registrarPendencia(pastaAssunto.cfg, idx, validarEm));
		}
		else{
			log.info('arquivo_valida_entregas_taxonomia - registrarEntrega - '); 
			log.dir(registrarEntrega(pastaAssunto.docs[idx-1], idx, validarEm));
		}
		dataset.addRow( [ '', pastaAssunto.cfg.raiz
			, pastaAssunto.cfg.unidade
			, pastaAssunto.cfg.pastaAnoMes
			, pastaAssunto.cfg.pastaAssunto
			, validarEm.format(formatAnoMesDia), idx ] );
	}
}

function getDataValidacao(cfgAssunto, anoMes, dataReferencia){
	var dataValidacao = [];
	var periodicidade = cfgAssunto.periodicidade;
	var calendario = getCalendarioUtil(anoMes);
	
	//Recupera último dia útil do mês
	var ultimoDiaUtilMes = getUltimoDiaUtilMes(anoMes, calendario);
	
	var ano = anoMes.split('-')[0];
	var mes = parseInt(anoMes.split('-')[1], 10);
	
	log.info('arquivo_valida_entregas_taxonomia - getDataValidacao - anoMes: ' + anoMes 
		+ ' - dataReferencia: ' + dataReferencia + ' - periodicidade: ' + periodicidade + " - cfgAssunto:");
	log.dir(cfgAssunto);
	
	if(periodicidade == 'diario'){
		for(var i = 0; i < calendario.length; i++){
			var dataUtil = calendario[i];
			if(dataUtil.isAfter(dataReferencia)){
				break;
			}
			dataValidacao.push(dataUtil);
		}
	}
	else if(periodicidade == 'semanal' || periodicidade == 'quinzenal'){
		//a unidade de periodo é em semana, logo semana vale 1 e quinzena 2
		var periodo = (periodicidade == 'semanal') ? 1 : 2;
		//quantidade de semanas ou quinzenas que podem ter no mês
		var limite = (periodicidade == 'semanal') ? 6 : 2;
		
		//Entregas semanais ou quinzenais são para as segundas-feiras
		var primeiraSegunda = getLocalDate(anoMes+'-01');
		primeiraSegunda = primeiraSegunda['with'](AJ_PRIMEIRA_SEGUNDA);
		var dataUtil = getDataUtil(ano, mes, primeiraSegunda, calendario);
		
		var ultimoDiaUtilMes = getUltimoDiaUtilMes(anoMes, calendario);
		
		//Se a primeira segunda do mês é igual ou anterior a data atual de referência, então esta é a pendente validação entrega.
		if(dataReferencia.isEqual(dataUtil) || dataReferencia.isAfter(dataUtil)){
			dataValidacao.push(dataUtil);
		}
		for(var s = 1; s < limite; s++){
			var proximaSegunda = primeiraSegunda.plusWeeks(periodo * s);
			//Próxima segunda deve ser igual ou antes do fim do mês avaliado, e antes da data referencia limite
			dataUtil = getDataUtil(ano, mes, proximaSegunda, calendario);
			if((proximaSegunda.isEqual(ultimoDiaUtilMes) || proximaSegunda.isBefore(ultimoDiaUtilMes))
				&& (dataReferencia.isEqual(proximaSegunda) || dataReferencia.isAfter(proximaSegunda))){
				dataValidacao.push(dataUtil);
				break;
			}
		}
	}
	else if(periodicidade == 'mensal' || periodicidade == 'anual'){
		var quando = cfgAssunto.quando;
		var quandoComplemento = (periodicidade == 'mensal') ? anoMes : ano;
		dataValidacao.push(getDataUtil(ano, mes, getLocalDate(quandoComplemento + '-' + quando), calendario));
	}
	else if(periodicidade == 'semestral'){
		var quando = cfgAssunto.quando.split('/');
		var mesH1 = parseInt(quando[1], 10);
		var mesH2 = mesH1 + 6;
		
		if(mes == mesH1){
			var quandoH1 = getLocalDate(ano + '-' + mesH1 + '-' + parseInt(quando[0], 10));
			dataValidacao.push(getDataUtil(ano, mes, quandoH1, calendario));
		}
		else if(mes == mesH2){
			var quandoH2 = getLocalDate(ano + '-' + mesH2 + '-' + parseInt(quando[0], 10));
			dataValidacao.push(getDataUtil(ano, mes, quandoH2, calendario));
		}
	}
	
	log.info('arquivo_valida_entregas_taxonomia - getDataValidacao FIM - dataValidacao: ' + dataValidacao);
	return dataValidacao;
}

function registrarPendencia(pastaAssunto, idxEntregaMes, dtPrevista){
	return registrar('Pendente', pastaAssunto, idxEntregaMes, dtPrevista);
}
function registrarEntrega(pastaAssunto, idxEntregaMes, dtPrevista){
	return registrar('Entregue', pastaAssunto, idxEntregaMes, dtPrevista);
}

function registrar(status, pastaAssunto, idxEntregaMes, dtPrevista){
	var obj = pastaAssunto;
	log.info("Aqui $$$$$$$$$$$$$" + obj.pastas)
	if(obj.idDocumento == '' || obj.idDocumento == null) obj.idDocumento = 'null';
	
	var existe = existeRegistro(obj, dtPrevista);
	if(!existe){
		var sql = "INSERT INTO arquivo_entregas_taxonomia ";
		sql += " (raiz, unidade, idUnidade, nmUnidade, ano, anoMes, pastaAnoMes, pastaAssunto, cdAssunto, nmAssunto, idDocumento, status, idxEntregaMes, dtPrevista, s_path, pastas) ";
		sql += " VALUES(" + obj.raiz + "," + obj.unidade + ",'" + obj.idUnidade + "','" + UNIDADES_TOTVS[obj.idUnidade].nm_filial;
		sql += "'," + obj.ano + ",'" + obj.anoMes + "'," + obj.pastaAnoMes;
		sql += "," + obj.pastaAssunto + "," + obj.cdAssunto + ", '" + ASSUNTOS[obj.cdAssunto].nm_assunto;
		sql += "'," + obj.idDocumento + ", '" + status + "', " + idxEntregaMes;
		sql += ", '" + dtPrevista + "', '" + obj.path + "', '" + obj.pastas + "')";
	}
	else{
		var sql = "UPDATE arquivo_entregas_taxonomia ";
		sql += " SET status = '" + status + "',  idDocumento = " + obj.idDocumento;
		sql += " WHERE pastaAssunto = " + obj.pastaAssunto + " AND dtPrevista = '" + dtPrevista + "'";
	}
	return efetivarRegistro(sql);
}

function existeRegistro(obj, dtPrevista){
	var sql = "SELECT idDocumento, dtPrevista, status FROM arquivo_entregas_taxonomia ";
	sql += " WHERE pastaAssunto = " + obj.pastaAssunto + " AND dtPrevista = '" + dtPrevista + "'";
	var select = DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
	log.info("arquivo_valida_entregas_taxonomia - existeRegistro:");
	log.dir(select);
	return (select != null && select.rowsCount > 0);
}

function efetivarRegistro(sql){
	var obj = { 'result': 0, 'error': ''};
	
	var sqlUpdate =  sql;
	var dataSource = "/jdbc/AppDS"; //"/jdbc/FluigDSRO";       

	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	try {
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		log.info("arquivo_valida_entregas_taxonomia - efetivarRegistro - sql: " + sqlUpdate);
		var rs = stmt.executeUpdate(sqlUpdate);
		
		obj.result = rs;
				
	} catch(e) {
		log.error("arquivo_valida_entregas_taxonomia - ERROR: " + e.message);
		if(e.message.indexOf("arquivo_entregas_taxonomia' doesn't exist") > -1){
			criarTabela();
		}
		else{
			obj.error = e.message;
		}
	} finally {
		if(stmt != null) stmt.close();
		if(conn != null) conn.close();
	}
	return obj;
}

function criarTabela(){
	var result = [];
	var sql = "CREATE TABLE arquivo_entregas_taxonomia (";
	sql += "	raiz BIGINT NOT NULL, ";
	sql += " 	unidade BIGINT NOT NULL, ";
	sql += " 	idUnidade varchar(10), ";
	sql += " 	nmUnidade varchar(400), ";
	sql += " 	ano BIGINT NOT NULL, ";
	sql += " 	anoMes VARCHAR(7) NOT NULL, ";
	sql += " 	pastaAnoMes BIGINT NOT NULL, ";
	sql += " 	pastaAssunto BIGINT NOT NULL, ";
	sql += "	cdAssunto INT NOT NULL, ";
	sql += "	nmAssunto varchar(250), ";
	sql += " 	idDocumento BIGINT NULL, ";
	sql += " 	status varchar(20) NOT NULL, ";
	sql += " 	idxEntregaMes INT NOT NULL, ";
	sql += " 	dtPrevista varchar(10) NOT NULL, ";
	sql += " 	s_path varchar(2000) NOT NULL, ";
	sql += " 	pastas varchar(2000) NOT NULL, ";
	sql += " 	CONSTRAINT arquivo_entregas_taxonomia_pk PRIMARY KEY (dtPrevista, pastaAssunto) ";
	sql += " ) ";
	sql += " ENGINE=InnoDB ";
	sql += " DEFAULT CHARSET=utf8 ";
	sql += " COLLATE=utf8_general_ci; ";
	result.push(efetivarRegistro(sql));
	
	var idx = " CREATE INDEX arquivo_entregas_taxonomia_s_path_IDX USING BTREE ON arquivo_entregas_taxonomia (s_path(400)) ";
	result.push(efetivarRegistro(idx));
	
	var idx = " CREATE INDEX arquivo_entregas_taxonomia_pastas_IDX USING BTREE ON arquivo_entregas_taxonomia (pastas(400)) ";
	result.push(efetivarRegistro(idx));

	
	idx = " CREATE INDEX arquivo_entregas_taxonomia_raiz_dt_IDX USING BTREE ON arquivo_entregas_taxonomia (raiz,dtPrevista) ";
	result.push(efetivarRegistro(idx));
	
	idx = " CREATE INDEX arquivo_entregas_taxonomia_raiz_dt_fili_IDX USING BTREE ON arquivo_entregas_taxonomia (raiz,dtPrevista,cdAssunto) ";
	result.push(efetivarRegistro(idx));
	
	idx = " CREATE INDEX arquivo_entregas_taxonomia_raiz_dt_assunto_IDX USING BTREE ON arquivo_entregas_taxonomia (raiz,dtPrevista,idUnidade) ";
	result.push(efetivarRegistro(idx));
	
	idx = " CREATE INDEX arquivo_entregas_taxonomia_r_d_f_a_IDX USING BTREE ON arquivo_entregas_taxonomia (raiz,dtPrevista,idUnidade,cdAssunto) ";
	result.push(efetivarRegistro(idx));
	
	return result;
}

function getUnidadesTotvs(){
	var mapaUnidades = null;
	var campos = ['cd_coligada', 'cd_filial', 'nm_filial', 'possui_diretoria'];
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
	var campos = [ 'cd_assunto', 'nm_assunto', 'centraliza_matriz'
		, 'periodicidade', 'quando'];
	var assuntos = DatasetFactory.getDataset('arquivo_assunto_temporalidade', campos, [],[]);
	if(assuntos != null && assuntos.rowsCount > 0){
		mapaAssuntos = {};
		
		for(var i = 0; i < assuntos.rowsCount; i++){
			var assunto = {};
			for(var c = 0; c < campos.length; c++){
				var campo = campos[c];
				assunto[campo] = String(assuntos.getValue(i, campo));
			}
			mapaAssuntos[assunto.cd_assunto] = assunto;
		}
	}
	return mapaAssuntos;
}

function getParametros(constraints){
	var obj = {};
	if(constraints != null && constraints.length >= 1 && constraints[0].fieldName != 'sqlLimit'){
		for(var i = 0; i < constraints.length; i++){
			if(constraints[i].fieldName == 'ANO'){
				obj['ANO'] = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == 'ANO_MES'){
				obj['ANO_MES'] = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == 'ANO_MES_ANTERIOR'){
				obj['ANO_MES_ANTERIOR'] = constraints[i].initialValue;
			}
		}
	}
	return obj;
}


//DATE UTILS INI
var ANO_MES;
var ANO_MES_ANTERIOR;
var CALENDARIO_ATUAL;
var CALENDARIO_ANTERIOR;
var AJ_PRIMEIRA_SEGUNDA;
var AJ_ULTIMO_DIA_MES;

var hoje = java.time.LocalDate.now();
var LOCALE_PT_BR = new java.util.Locale("pt", "br");
var formatAno = java.time.format.DateTimeFormatter
	.ofPattern("yyyy")
	.withLocale(LOCALE_PT_BR);
var formatAnoMes = java.time.format.DateTimeFormatter
	.ofPattern("yyyy-MM")
	.withLocale(LOCALE_PT_BR);
var formatAnoMesDia = java.time.format.DateTimeFormatter
	.ofPattern("yyyy-MM-dd")
	.withLocale(LOCALE_PT_BR);

/**
 * Obter objeto LocalDate do Java para usar API de data
 * @param date: String 
 */
function getLocalDate(date){
	log.debug("arquivo_valida_entregas_taxonomia - getLocalDate - date: " + date);
	if(date == undefined || date == null || date == "") return null;
	
	var split = date.split('-');
	return java.time.LocalDate.of(parseInt(split[0], 10), parseInt(split[1], 10), parseInt(split[2], 10));
}

function getAno(){
	return hoje.format(formatAno);
}
function getAnoMesAtual(){
	return hoje.format(formatAnoMes);
}
function getAnoMesAnterior(){
	var antecedencia = 1;
	var unidade = java.time.temporal.ChronoUnit.valueOf("MONTHS");
	return hoje.minus(antecedencia, unidade).format(formatAnoMes);
}

function iniciarControlesTemporais(parametros){
	//ANO e ANO MES
	ANO = (parametros.ANO != null) 
		? parametros.ANO : getAno();
	ANO_MES = (parametros.ANO_MES != null) 
		? parametros.ANO_MES : getAnoMesAtual();
	ANO_MES_ANTERIOR = (parametros.ANO_MES_ANTERIOR != null) 
		? parametros.ANO_MES_ANTERIOR : getAnoMesAnterior();
		
	log.info('arquivo_valida_entregas_taxonomia - ANO: ' + ANO
		 + ' - mes: ' + ANO_MES + ' - mes anterior: ' + ANO_MES_ANTERIOR);
	
	//AJUSTES TEMPORAIS
	AJ_PRIMEIRA_SEGUNDA = java.time.temporal.TemporalAdjusters.firstInMonth(java.time.DayOfWeek.MONDAY);
	AJ_ULTIMO_DIA_MES = java.time.temporal.TemporalAdjusters.lastDayOfMonth();
	
	//CALENDARIOS
	CALENDARIO_ATUAL = getCalendarioUtil(ANO_MES);
	CALENDARIO_ANTERIOR = getCalendarioUtil(ANO_MES_ANTERIOR);
}

/**Recupera lista de dias úteis de um dado mês de um ano específico
	@param anoMes:String no formato YYYY-mm
	@returns Array
 */
function getCalendarioUtil(anoMes){
	log.info('arquivo_valida_entregas_taxonomia - getCalendarioUtil - anoMes: ' + anoMes);
	
	if(anoMes == ANO_MES && CALENDARIO_ATUAL != null && CALENDARIO_ATUAL.length > 0){
		return CALENDARIO_ATUAL;
	}
	if(anoMes == ANO_MES_ANTERIOR && CALENDARIO_ANTERIOR != null && CALENDARIO_ANTERIOR.length > 0){
		return CALENDARIO_ANTERIOR;
	}
	
	log.info('arquivo_valida_entregas_taxonomia - getCalendarioUtil - CARREGANDO: calendário desse mês não estava em cache.');
	var calendario = [];
	
	var split = anoMes.split('-');
	var ano = parseInt(split[0], 10);
	var mes = parseInt(split[1], 10);
	
	var expediente = 'Default';
	var matutino = 1;
	var csBp = [
		DatasetFactory.createConstraint('businessPeriodPK.companyId', COMPANY, COMPANY, ConstraintType.MUST )
		, DatasetFactory.createConstraint('businessPeriodPK.periodId', expediente, expediente, ConstraintType.MUST )
		, DatasetFactory.createConstraint('businessPeriodPK.sequence', matutino, matutino, ConstraintType.MUST )
	];
	var fieldsBp = [ 'businessPeriodPK.weekDay' ];
	var businessPeriodDs = DatasetFactory.getDataset('businessPeriod', fieldsBp, csBp, null);
	if(businessPeriodDs == null || businessPeriodDs.rowsCount == 0){
		throw 'Não foi possível obter o cadastro de expediente';
	}
	
	var diasSemana = {};
	for(var bp = 0; bp < businessPeriodDs.rowsCount; bp++){
		//DayOfWeek do java considera from 1 (Monday) to 7 (Sunday)
		//No fluig, segunda é 2.
		var diaDaSemana = businessPeriodDs.getValue(bp, fieldsBp[0])-1;
		if(diaDaSemana == 0) diaDaSemana = 7;
		diasSemana[diaDaSemana] = true;
	}
	
	var csH = [
		DatasetFactory.createConstraint('businessPeriodPK.companyId', COMPANY, COMPANY, ConstraintType.MUST )
	];
	var fieldsH = [ 'holidayDay', 'holidayMonth', 'holidayYear' ];
	var holidayDs = DatasetFactory.getDataset('holiday', fieldsH, csH, null);
	if(holidayDs == null || holidayDs.rowsCount == 0){
		throw 'Não foi possível obter o cadastro de feriados';
	}
	
	var feriados = {};
	for(var h = 0; h < holidayDs.rowsCount; h++){
		var dd = parseInt(holidayDs.getValue(h, 'holidayDay'), 10);
		var mm = parseInt(holidayDs.getValue(h, 'holidayMonth'), 10);
		var yyyy = holidayDs.getValue(h, 'holidayYear');
		if(yyyy == 0) yyyy = ano;
		
		var yyyy_mm_dd = yyyy+'-'+mm+'-'+dd;
		feriados[yyyy_mm_dd] = getLocalDate(yyyy_mm_dd);
	}
	log.info('arquivo_valida_entregas_taxonomia - getCalendarioUtil - feriados: ');
	log.dir(feriados);
	
	var ultimoDiaMes = getLocalDate(anoMes+'-01');
	ultimoDiaMes = ultimoDiaMes['with'](AJ_ULTIMO_DIA_MES);
	ultimoDiaMes = ultimoDiaMes.getDayOfMonth();
	for(var d = 1; d <= ultimoDiaMes; d++){
		//Só adicionar na lista de dias úteis quando
		//-Esse dia do mês não for um feriado
		//-O dia da semana da data for um dia de expediente
		var anoMesDia = ano+'-'+mes+'-'+d;
		if(feriados[anoMesDia] != null) continue;
		
		var data = getLocalDate(anoMesDia);
		if(!diasSemana[data.getDayOfWeek().getValue()]) continue;

		calendario.push(data);
	}
	log.info('arquivo_valida_entregas_taxonomia - getCalendarioUtil - calendario: ');
	log.dir(calendario);
	return calendario;
}
/**Verifica se a data inicial é data útil, se for retorna ela, do contrário busca a próxima data útil dentro do calendário
	Caso o mes inicial se encerre sem achar a data útil, pega o calendário do próximo mês
	@param ano:int Ano (YYYY)
	@param mes:int Mês do ano (mm)
	@param dataInicial:LocalDate inicial ponto de partida
	@param calendarioInicial:Array com a lista de dias úteis daquele anoMes
	@returns dataUti:LocalDate
 */
function getDataUtil(ano, mes, dataInicial, calendarioInicial){
	log.info('arquivo_valida_entregas_taxonomia - getDataUtil - dataInicial: ' + dataInicial 
		+ ' - calendarioInicial: ' + calendarioInicial);
	var CT = 0;
	
	//Recupera último dia útil do mês
	var ultimoDiaUtilMes = getUltimoDiaUtilMes((ano+'-'+mes), calendarioInicial);
	
	var dataUtil = dataInicial;
	var calendario = calendarioInicial;
	while(calendario.indexOf(dataUtil) < -1){
		CT++;
		if(CT > 10) return dataUtil;
		
		//Se passou do fim do mes, preciso recuperar o calendário de dias úteis do mes subsequente
		if(dataUtil.isEqual(ultimoDiaUtilMes) || dataUtil.isAfter(ultimoDiaUtilMes)){
			if(mes == 12) {
				ano++;
				mes = 1;
			}
			else{
				mes++;
			}
			calendario = getCalendarioUtil(ano + '-' + mes);
			ultimoDiaUtilMes = getUltimoDiaUtilMes((ano+'-'+mes), calendario);
		}
		dataUtil = dataUtil.plus(1, 'DAYS');
	}
	log.info('arquivo_valida_entregas_taxonomia - getDataUtil - dataUtil: ' + dataUtil);
	return dataUtil;
}
function getUltimoDiaUtilMes(anoMes, calendario){
	var CT = 0;
	
	var ultimoDiaUtilMes = getLocalDate(anoMes+'-01');
	ultimoDiaUtilMes = ultimoDiaUtilMes['with'](AJ_ULTIMO_DIA_MES);
	while(calendario.indexOf(ultimoDiaUtilMes) < -1){
		ultimoDiaUtilMes = ultimoDiaUtilMes.minusDays(1);
		
		CT++;
		if(CT > 30) break;
	}
	return ultimoDiaUtilMes;
}
//DATE UTILS FIM