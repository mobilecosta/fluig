function validateForm(form){

    var currentStatus = getValue("WKNumState");

    if(currentStatus == 20) {
        if(form.getValue('DataPagamento') == '') {
            throw " Selecione uma data para Pagamento! "
        }
    }

    if(currentStatus == 12) {
        if(form.getValue('DataVencimento') == '') {
            throw " Selecione uma data de Vencimento! "
        }
    }
}