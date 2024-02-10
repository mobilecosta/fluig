function validateForm(form){
    var atividadeAtual = getValue("WKNumState");
    var msgErro = []
    
    if (atividadeAtual == 0 || atividadeAtual == 4) {
        if(form.getValue("email")== ''){
            msgErro.push(" Selecione o usuário que receberá o acesso ! \n")
        }
        if(form.getValue("motivo")== ''){
            msgErro.push(" Selecione o motivo ! \n")
        }
        if(form.getValue("acesso")== ''){
            msgErro.push(" Selecione a opção de acesso ! \n")
        }
        if(form.getValue("acesso")== 'Outro'){
            if(form.getValue("outros")== ''){
                msgErro.push(" Informe o Acesso que deseja ! \n")
            }
        }
        if(form.getValue("justificativa")== ''){
            msgErro.push(" justifique ou complemente o seu chamado ! \n")
        }
    }

    if (atividadeAtual == 5) {
        if(form.getValue("aprovacao") == ''){
            msgErro.push(" Selecione se foi aprovado ou não ! \n")
        }
        if(form.getValue("aprovacao") == 'reprovado'){
            if(form.getValue("obs") == ''){
                msgErro.push(" Digite o motivo para não aprovar ! \n")
            }
        } 
    }

    if (atividadeAtual == 12) {
        if(form.getValue("obsExecucao") == ''){
            msgErro.push(" Detalhe a descrição da Execução ! \n")
        }
    }

    if (msgErro.length != 0) {
        msgErro = msgErro.join('')
        throw "Erro :\n " + msgErro
    }
}