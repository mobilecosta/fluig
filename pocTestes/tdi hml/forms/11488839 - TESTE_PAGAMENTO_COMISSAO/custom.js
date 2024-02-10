$("document").ready(function () {

	//"ADD", "MOD", "VIEW"
	var formMode = getFormMode();
	var currentStatus = getWKNumState();

	if (formMode = "ADD" || formMode == "MOD" || formMode == "VIEW") {
		if (currentStatus == ABERTURA || currentStatus == INICIO) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").hide();
			$("#panelAprovFiscal").hide();
			$("#panelAprovPagamento").hide();
		}
		if (currentStatus == CONFERE_INFORMACOES) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").show();
		}
		if (currentStatus == CONFERE_DADOS_FISCAIS) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").show();
			$("#panelAprovFiscal").show();
		}
		if (currentStatus == VERIFICA_INCON) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").show();
		}
		if (currentStatus == PROCESSA_PAGTO) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").show();
			$("#panelAprovFiscal").show();
			$("#panelAprovPagamento").show();
		}
		if (currentStatus == FIM) {
			$("#panelDadosNotaFiscal").show();
			$("#panelAprovContasPagar").show();
			$("#panelAprovFiscal").show();
			$("#panelAprovPagamento").show();
		}


	}


});