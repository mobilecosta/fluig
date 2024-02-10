function validateForm(form){

    var msgErro = []

    var AtividadeAtual = getValue('WKNumState')

    if (AtividadeAtual == 5) {
        if(form.getValue("resposta") == '') {
            msgErro.push("Selecione a Resposta Apoiador! \n")
        }
        if(form.getValue("retorno") == '') {
            msgErro.push("Digite o Retorno! \n")
        }
    }

    if (AtividadeAtual == 11) {
        if(form.getValue("respostaDuvida") == '') {
            msgErro.push("Digite a Resposta ESN! \n")
        }
    }


    if (msgErro.length != 0) {
        msgErro = msgErro.join('')
        throw "\n" + msgErro + "<br>"
    }
}