function utils(){}

var _codigoProcesso = getValue("WKDef");
var _solicitacao = getValue("WKNumProces");
var _log = _codigoProcesso + " - _solicitacao: " + _solicitacao + " - ";

function isEmpty(valor){
	return valor == null || valor == '';
}

/**
 * Recupera valor sem formatação
 * @param valor
 * @return string
 */
function getRawValue(valor){
	return (""+valor).replace(/\D/g,"");
}
/**
 * Recupera numero com separação decimal
 * @param valor
 * @return string
 */
function getRawNumber(valor){
	return (""+valor).replace(/\./g,"").replace(/\//g,"").replace(/-/g,"").replace(",",".");
}

//Regex ddd
var dddPattern = java.util.regex.Pattern.compile("\((\d+)\)");

/**
 * Converte string número brasileiro em número em formato americano
 * @param string -> "2.000,00"
 * @return float -> 2000
 */
function numeroAmericano(valor){
	if(valor == null || valor == "") return 0;
	
	return parseFloat(getRawNumber(valor));
}

/**
 * Verificar valor e retorna um boolean conforme regra:
 * "nao" = false; "sim" = true;
 * 0 = false; 1 = true;
 * "false" = false; "true" = true;
 * @param input
 * @returns
 */
function getBooleanOf(input){
	if(input == null || input == "") return false;
	
	return (input == "sim" 
		|| input == "true" || input == true 
		|| input == "1" || input == 1);
}

/**
 * Preenche com zeros a esquerda
 * @param valor que sera tratado
 * @param tamanho alvo do resultado
 * @return String 
 */
function leftPad(n, w) {
	var an = Math.abs(n);
	var digitCount = 1 + Math.floor(Math.log(an) / Math.LN10);
	if (digitCount >= w) {
		return n;
	}
	var zeroString = Math.pow(10, w - digitCount).toString().substr(1);
	return n < 0 ? '-' + zeroString + an : zeroString + an;
}

//FORMATOS
//Formato brasileiro
var LOCALE_PT_BR = new java.util.Locale("pt", "br");
var dataFormaBrasileira = java.time.format.DateTimeFormatter
		.ofLocalizedDate(java.time.format.FormatStyle.MEDIUM)
		.withLocale(LOCALE_PT_BR);
var FORMATO_SIMPLES = {
		DATA_EN_US: new java.text.SimpleDateFormat("yyyy-MM-dd")
		, DATA_PT_BR: new java.text.SimpleDateFormat("dd/MM/yyyy")
		, HH_MM: new java.text.SimpleDateFormat("HH:mm")
}

//FUNCOES DATA E HORA
function getCurrentDate(locale){
	return (!locale || locale == undefined || locale == null || locale == "PT_BR") 
		? FORMATO_SIMPLES.DATA_PT_BR.format(new Date()) : FORMATO_SIMPLES.DATA_EN_US.format(new Date());
}
function getCurrentTime(){
	return FORMATO_SIMPLES.HH_MM.format(new Date());
}

/**
 * Recebe uma data qualquer e formata padrão americano.
 * @Example: YYYY-MM-DD => YYYY-MM-DD
 * @Example: DD/MM/YYYY => YYYY-MM-DD
 * @param data : string
 * @return dataPadraoAmericano : string
 */
function dataPadraoAmericano(input){
    log.info("dataPadraoAmericano - input: " + input);
    if(input == null || input == "") return "";
    
    if(input.indexOf("T") > -1) input = input.replace("T", " ");
    var dataHora = input.split(" ");
    var data = dataHora[0];
    
    var americana = (data.indexOf("-") > 3);
    var split = (americana) ? data.split("-") : data.split("/");
    
    return (americana) 
        ? java.time.LocalDate.of(parseInt(split[0], 10), parseInt(split[1], 10), parseInt(split[2], 10)).toString()
        : java.time.LocalDate.of(parseInt(split[2], 10), parseInt(split[1], 10), parseInt(split[0], 10)).toString();
}
/**
 * Recebe uma data em milisegundos e formata padrão americano.
 * @Example: DD/MM/YYYY => YYYY-MM-DD
 * @param data : int
 * @return dataMilisPadraoAmericano : string
 */
function dataMilisPadraoAmericano(intMilis){
	return FORMATO_SIMPLES.DATA_EN_US.format(new java.util.Date(intMilis));
}
/**
 * Recebe uma data qualquer e formata padrão brasileiro.
 * @Example: YYYY-MM-DD => DD/MM/YYYY
 * @Example: DD/MM/YYYY => DD/MM/YYYY
 * @param data : string
 * @return dataPadraoBrasileiro : string
 */
function dataPadraoBrasileiro(input){
	log.info("dataPadraoBrasileiro - input: " + input);
	if(input == null || input == "") return "";
    
	log.info("dataPadraoBrasileiro - go: " + input);
    var dataHora = input.split(" ");
    var data = dataHora[0];
    
    var americana = (data.indexOf("-") > 3);
    var split = (americana) ? data.split("-") : data.split("/");
    
    var localDate = (americana) 
        ? java.time.LocalDate.of(parseInt(split[0], 10), parseInt(split[1], 10), parseInt(split[2], 10))
        : java.time.LocalDate.of(parseInt(split[2], 10), parseInt(split[1], 10), parseInt(split[0], 10));
    
    log.info("dataPadraoBrasileiro - localDate: " + localDate.toString());
    return localDate.format(dataFormaBrasileira);
}