function validateForm(form){

    var currentStatus = getValue("WKNumState");

    if(currentStatus == 20) {
        if(form.getValue('DataPagamento') == '') {
            throw " Selecione uma data para Pagamento! "
        }
    }

}