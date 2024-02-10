function beforeStateEntry(sequenceId) {

    if (sequenceId == 7) {

        // Parâmetros
        var grupoAtual = hAPI.getCardValue("proximoGrupo").substring(11);
        var ASSUNTO = "O cadastro do cliente se encontra no " + grupoAtual;
        var numSolicitacao = hAPI.getCardValue("nrProcesso");
        var A1_NOME = hAPI.getCardValue("A1_NOME");
        var A1_CGC = hAPI.getCardValue("A1_CGC");
        var TEMPLATE = "email_aviso_vendedor";
        var REMETENTE = "admin";

        // Parametros do e-mail
        var parametros = new java.util.HashMap();
        parametros.put('subject', ASSUNTO);
        parametros.put('grupoAtual', grupoAtual);
        parametros.put('numSolicitacao', numSolicitacao);
        parametros.put('A1_NOME', A1_NOME);
        parametros.put('A1_CGC', A1_CGC);

        // Lista de destinatários
        var email =  hAPI.getCardValue("email_vendedor")

        var destinatarios = new java.util.ArrayList();
        destinatarios.add(email);
        

        try {
            // Envia e-mail
            notifier.notify(REMETENTE, TEMPLATE, parametros, destinatarios, "text/html");

        } catch (error) {
            throw error
        }
    }

}