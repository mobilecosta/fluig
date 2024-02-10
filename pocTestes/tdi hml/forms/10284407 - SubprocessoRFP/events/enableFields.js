function enableFields(form){ 

    var AtividadeAtual = getValue('WKNumState');
    

    if (AtividadeAtual == 11){
        form.setEnabled("resposta", false);
        form.setEnabled("retorno", false);
        form.setEnabled("duvidaApoio", true);

    }
    if (AtividadeAtual == 17){
        
        form.setEnabled("respostaDuvida", false);

    }


}