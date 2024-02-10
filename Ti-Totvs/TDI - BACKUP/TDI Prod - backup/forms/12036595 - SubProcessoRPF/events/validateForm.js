function validateForm(form){

    var msgErro = []

    var AtividadeAtual = getValue('WKNumState')

    if (AtividadeAtual == 0 || AtividadeAtual == 6) {

        if(form.getValue('titulo_modulos') == '') {
            msgErro.push(" Descreva o título dos módulos! \n")
        }

        if(form.getValue('item_1_1') == 'sim') {
            if(form.getValue('obs_1_1') == '') {
                msgErro.push(" Descreva a Observação no item da documentação 1.1! \n")
            }
        }
        if(form.getValue('item_1_2') == 'sim') {
            if(form.getValue('obs_1_2') == '') {
                msgErro.push(" Descreva a Observação no item da documentação 1.2! \n")
            }
        }
        if(form.getValue('item_1_3') == 'sim') {
            if(form.getValue('obs_1_3') == '') {
                msgErro.push(" Descreva a Observação no item da documentação 1.3! \n")
            }
        }
        if(form.getValue('item_1_4') == 'sim') {
            if(form.getValue('obs_1_4') == '') {
                msgErro.push(" Descreva a Observação no item da documentação 1.4! \n")
            }
        }
        if(form.getValue('item_1_5') == 'sim') {
            if(form.getValue('obs_1_5') == '') {
                msgErro.push(" Descreva a Observação no item da documentação 1.5! \n")
            }
        }
        if(form.getValue('obs_1_6') == '') {
            msgErro.push(" Descreva a Observação no item da documentação 1.6! \n")
        }
        if(form.getValue('obs_1_7') == '') {
            msgErro.push(" Descreva a Observação no item da documentação 1.7! \n")
        }
        if(form.getValue('obs_1_8') == '') {
            msgErro.push(" Descreva a Observação no item da documentação 1.8! \n")
        }






        var table = form.getChildrenIndexes("tabelaRespostas")
        if ( table.length == 0) {
            msgErro.push(" Adicione pelo menos um grupo de apoio! \n")
        }
        
        for(var i = 0; i < table.length; i++){
            if(form.getValue("grupo___" + table[i]) == ''){
                msgErro.push(" Selecione o grupo de apoio \n")
            }
        }
    }


    if (msgErro.length != 0) {
        msgErro = msgErro.join('')
        throw  "<br>"+ msgErro + "<br>"
    }
}