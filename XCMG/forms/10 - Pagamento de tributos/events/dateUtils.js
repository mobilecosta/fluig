//FORMATOS
//Formato brasileiro
var LOCALE_PT_BR = new java.util.Locale("pt", "br");
var dataFormaBrasileira = java.time.format.DateTimeFormatter
		.ofLocalizedDate(java.time.format.FormatStyle.MEDIUM)
		.withLocale(LOCALE_PT_BR);
var FORMATO_SIMPLES = {
		DATA_EN_US: new java.text.SimpleDateFormat("yyyy/MM/dd")
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

function isValidDate(year, month, day) {
	var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
	}
    return false;
}