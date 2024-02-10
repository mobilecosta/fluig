function validateForm(form){

    var msgErro = []

    var AtividadeAtual = getValue('WKNumState')

    if (AtividadeAtual == 0 || AtividadeAtual == 6) {
        var table = form.getChildrenIndexes("tabelaRespostas")
        if ( table.length == 0) {
            msgErro.push(" Adicione pelo menos um grupo de apoio! \n")
        }

        for(var i = 0; i < table.length; i++){
            if(form.getValue("grupo___" + table[i]) == ''){
                msgErro.push(" Selecione o grupo de apoio na linha " + table[i] + "\n")
            }
        }


    }


    if (msgErro.length != 0) {
        msgErro = msgErro.join('')
        throw msgErro + "<br>"
    }
}