function defineStructure() {
	addColumn('ERRO');
	addColumn('resultado');
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	return main(dataset);
}

function createDataset(fields, constraints, sortFields) {
	log.info('arquivo_valida_entregas_taxonomia - INICIO');
	
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn('ERRO');
	dataset.addColumn('resultado');
	
	return main(dataset, constraints);
}

var COMPANY;

function main(dataset){
	COMPANY = getValue('WKCompany');
	ANO_MES = getAnoMesAtual();
	log.info('arquivo_inicia_alerta_pendencia - INICIO - ANO_MES: ' + ANO_MES);
	
	iniciarControlesTemporais({ 'ANO_MES': ANO_MES });
	
	//Para teste
	hoje = getLocalDate('2022-08-10');
	
	//Busca as taxonomias cadastradas
	var cabecalho = DatasetFactory.getDataset('arquivo_consulta_taxonomia', ['cd_raiz'], [], []);
	if(cabecalho != null && cabecalho.rowsCount > 0){
		log.info('arquivo_inicia_alerta_pendencia - cabecalho.rowsCount: ' + cabecalho.rowsCount);
		
		//Para cada taxonomias, processa a estrutura de pastas
		for(var i = 0; i < cabecalho.rowsCount; i++){
			var config = {
				'raiz': cabecalho.getValue(i, "raiz")
				, 'pastaRaiz': cabecalho.getValue(i, "cd_raiz")
				, 'periodicidade': cabecalho.getValue(i, "periodicidade_alerta")
				, 'grupo': cabecalho.getValue(i, "grupo_alerta")
			}
			try{
				processarPendencias(dataset, config);
			} catch(e){
				dataset.addRow([ e.toString(), '' ]);
			}
		}
		log.info('arquivo_inicia_alerta_pendencia - processarPendencias - finalizado');
	}
	return dataset;
}

function processarPendencias(dataset, config){
	log.info('arquivo_inicia_alerta_pendencia - processarPendencias - config:');
	log.dir(config);
	
	var calendario = getCalendarioUtil(ANO_MES);
	
	if(ehDiaDeLancarAlerta(config, hoje, calendario)){
		var intervaloData = getIntervaloDataAlerta(config, hoje, calendario);
		if(intervaloData.length == 0) {
			return dataset;
		}
		
		var dataInicial = intervaloData[0].format(formatAnoMesDia);
		var dataFinal = intervaloData[1].format(formatAnoMesDia);
		
		log.info('arquivo_inicia_alerta_pendencia - processarPendencias - dataInicial: ' + dataInicial
			+ ' - dataFinal: ' + dataFinal);
		
		if(alertaJaLancado(config.pastaRaiz, dataInicial, dataFinal)){
			return dataset;
		}
		
		var cs = [ DatasetFactory.createConstraint('et.raiz', config.pastaRaiz, config.pastaRaiz, ConstraintType.MUST)
         , DatasetFactory.createConstraint('et.dtPrevista', dataInicial, dataFinal, ConstraintType.MUST)];
		var situacaoEntregas = DatasetFactory.getDataset('arquivo_consulta_entregas',[],cs,[]);
		if(situacaoEntregas != null && situacaoEntregas.rowsCount > 0){
			var possuiPendenciaEntrega = false;
			var campos = {}
			campos["pastaRaiz"] = config.pastaRaiz;
			campos["escopo"] = config.raiz;
			campos["competencia"] = ANO_MES;
			campos["dtInicial"] = dataInicial;
			campos["dtFinal"] = dataFinal;
			for(var i = 0; i < situacaoEntregas.rowsCount; i++){
				var status = String(situacaoEntregas.getValue(i, "status"));
				if(status.toLowerCase() == "pendente"){
					possuiPendenciaEntrega = true;
				}
				
				campos["unidade___" + (i+1)] = String(situacaoEntregas.getValue(i, "idUnidade"));
				campos["caminho___" + (i+1)] = String(situacaoEntregas.getValue(i, "s_path"));
				campos["documento___" + (i+1)] = String(situacaoEntregas.getValue(i, "documento"));
				campos["dataEsperada___" + (i+1)] = String(situacaoEntregas.getValue(i, "dtPrevista"));
				campos["situacao___" + (i+1)] = String(status);
				campos["dataEntrega___" + (i+1)] = String(situacaoEntregas.getValue(i, "dtEntrega"));
				campos["validade___" + (i+1)] = String(situacaoEntregas.getValue(i, "dtValidade"));
			}
			
			if(possuiPendenciaEntrega){
				var clientService = fluigAPI.getAuthorizeClientService();
				var data = {
					companyId : String(getValue("WKCompany")),
					serviceCode : 'fluigAPI',
					endpoint : '/process-management/api/v2/processes/alerta_pendencia_documental/start',
					method : 'POST',
					timeoutService : '100',
					options : {
						mediaType : 'application/json'
					},
					params : {
						"targetState" : 0,
						"targetAssignee" : "Pool:Group:"+config.grupo,
						"subProcessTargetState" : 0,
						"comment" : "Solicitação iniciada automaticamente via validação de pendências de entrega de documentos",
						"formFields" : campos
					}
				}
				log.info('arquivo_inicia_alerta_pendencia - processarPendencias - data: ');
				log.dir(data);
				
				var vo = clientService.invoke(JSONUtil.toJSON(data));
				var result = vo.getResult();
				log.info('arquivo_inicia_alerta_pendencia - processarPendencias - result: ');
				log.dir(result);
				
				if(result == null || result.isEmpty()){
		            dataset.addRow([ "ERRO", "Retorno está vazio" ]);
		        }
		        else if(result.toLowerCase().indexOf("error") > -1 
		        	|| result.toLowerCase().indexOf("exception") > -1){
		            dataset.addRow([ 'ERRO', result ]);
		        }
		        else{
					dataset.addRow([ '', result ]);
				}
			}
		}
	}
	return dataset;
}

function ehDiaDeLancarAlerta(config, dataReferencia, calendario){
	var lancarAlerta = false;
	
	var periodicidade = config.periodicidade;
	var splitAnoMes = ANO_MES.split('-');
	var ano = splitAnoMes[0];
	var mes = splitAnoMes[1];
	
	log.info('arquivo_inicia_alerta_pendencia - ehDiaDeLancarAlerta - periodicidade: ' + periodicidade);
	
	if(periodicidade == 'semanal' || periodicidade == 'quinzenal'){
		//a unidade de periodo é em semana, logo semana vale 1 e quinzena 2
		var periodo = (periodicidade == 'semanal') ? 1 : 2;
		//quantidade de semanas ou quinzenas que podem ter no mês
		var limite = (periodicidade == 'semanal') ? 6 : 2;
		
		var primeiroDoMes = getLocalDate(ANO_MES+'-01');
		var ultimoDiaUtilMes = getUltimoDiaUtilMes(ANO_MES, calendario);
		
		var primeiraSegunda = primeiroDoMes['with'](AJ_PRIMEIRA_SEGUNDA);
		var dataUtil = getDataUtil(ano, mes, primeiraSegunda, calendario);
		
		//Se a data de referência for igual a primeira segunda ou primeiro dia útil 
		//após a primeira segunda do mês, é dia de lançar pendencias de entrega.
		if(dataReferencia.isEqual(dataUtil)){
			lancarAlerta = true;
		}
		else{
			for(var s = 1; s < limite; s++){
				var proximaSegunda = primeiraSegunda.plusWeeks(periodo * s);
				//Próxima segunda deve ser igual ou antes do fim do mês avaliado, e antes da data referencia limite
				dataUtil = getDataUtil(ano, mes, proximaSegunda, calendario);
				if((dataUtil.isEqual(ultimoDiaUtilMes) || dataUtil.isBefore(ultimoDiaUtilMes))
					&& (dataReferencia.isEqual(proximaSegunda) || dataReferencia.isAfter(proximaSegunda))){
					lancarAlerta = true;
					break;
				}
			}
		}
	}
	else if(periodicidade == 'mensal'){
		var dataUtil = getDataUtil(ano, mes, dataReferencia, calendario);
		var ultimoDiaUtilMes = dataReferencia; //calendario[calendario.length-1];
		lancarAlerta = (dataUtil == ultimoDiaUtilMes);
	}
	else throw 'Periodicidade (' + periodicidade + ') não implementada.';
	
	log.info('arquivo_inicia_alerta_pendencia - ehDiaDeLancarAlerta - lancarAlerta: ' + lancarAlerta);
	
	return lancarAlerta;
}

function getIntervaloDataAlerta(config, dataReferencia, calendario){
	var intervalo = [];
	
	var periodicidade = config.periodicidade;
	var splitAnoMes = ANO_MES.split('-');
	var ano = splitAnoMes[0];
	var mes = splitAnoMes[1];
	
	if(periodicidade == 'semanal' || periodicidade == 'quinzenal'){
		//a unidade de periodo é em semana, logo semana vale 1 e quinzena 2
		var periodo = (periodicidade == 'semanal') ? 1 : 2;
		//quantidade de semanas ou quinzenas que podem ter no mês
		var limite = (periodicidade == 'semanal') ? 6 : 2;
		
		var primeiroDoMes = getLocalDate(ANO_MES+'-01');
		var ultimoDiaUtilMes = getUltimoDiaUtilMes(ANO_MES, calendario);
		
		var primeiraSegunda = primeiroDoMes['with'](AJ_PRIMEIRA_SEGUNDA);
		var dataUtil = getDataUtil(ano, mes, primeiraSegunda, calendario);
		
		//Se a data de referência for igual a primeira segunda ou primeiro dia útil 
		//após a primeira segunda do mês, é dia de lançar pendencias de entrega.
		if(dataReferencia.isEqual(dataUtil) || dataReferencia.isAfter(dataUtil)){
			intervalo.push(primeiraSegunda.minusDays(7));
			intervalo.push(primeiraSegunda.minusDays(1));
		}
		for(var s = 1; s < limite; s++){
			var proximaSegunda = primeiraSegunda.plusWeeks(periodo * s);
			//Próxima segunda deve ser igual ou antes do fim do mês avaliado, e antes da data referencia limite
			dataUtil = getDataUtil(ano, mes, proximaSegunda, calendario);
			if(dataReferencia.isEqual(dataUtil) || dataReferencia.isAfter(dataUtil)){
				intervalo = [];
				intervalo.push(proximaSegunda.minusDays(7*periodo));
				intervalo.push(proximaSegunda.minusDays(1*periodo));
				break;
			}
		}
	}
	else if(periodicidade == 'mensal'){
		var primeiroDoMes = getLocalDate(ano+'-'+mes+'-01');
		intervalo.push(primeiroDoMes);
		
		var ultimoDiaUtilMes = primeiroDoMes['with'](AJ_ULTIMO_DIA_MES);
		intervalo.push(ultimoDiaUtilMes);
	}
	else throw 'Periodicidade (' + periodicidade + ') não implementada.';
	
	log.info('arquivo_inicia_alerta_pendencia - getIntervaloDataAlerta - intervalo: ');
	log.dir(intervalo);
	return intervalo;
}

function alertaJaLancado(pastaRaiz, dataInicial, dataFinal){
	var cs = [ DatasetFactory.createConstraint('pastaRaiz', pastaRaiz, pastaRaiz, ConstraintType.MUST)
    	, DatasetFactory.createConstraint('dtInicial', dataInicial, dataInicial, ConstraintType.MUST)
    	, DatasetFactory.createConstraint('dtFinal', dataFinal, dataFinal, ConstraintType.MUST)
    	, DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST)
    ];
	var pendenciasLancadas = DatasetFactory.getDataset('alerta_pendencia',['pastaRaiz'],cs,[]);
	return (pendenciasLancadas != null && pendenciasLancadas.rowsCount > 0);
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