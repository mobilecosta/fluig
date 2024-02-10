$("document").ready(function (){
	
	//"ADD", "MOD", "VIEW"
	var formMode = getFormMode();
	var currentStatus = getWKNumState();
	
	if(formMode = "ADD" || formMode == "MOD"){
		if(currentStatus == ABERTURA || currentStatus == INICIO){
			$("#panelDadosNotaFiscal").show();
			
			
		}
		
		if(currentStatus == CONFERE_INFORMACOES){
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").hide();
			
		}
		
		if(currentStatus == VERIFICA_INCON){
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovFiscal").hide();
			
		}
		
		if(currentStatus == PROCESSA_PAGTO){
			
		}
		
		if(currentStatus == CONFERE_DADOS_FISCAIS){
			
		}
	}
	
	
});