function beforeStateEntry(sequenceId) {

    if (sequenceId == 7) {

        // var tenand = getValue("WKCompany");
        // var processInstanceId = getValue("WKCompany");

        // Parâmetros
        var ASSUNTO = "Processo Cadastro de Cliente";
        // var processName = 'Cadastro de clientes'
        var TEMPLATE = "Email-aviso-atividade";
        var REMETENTE = "admin";
        // var SERVER = "http://fluig.baruel.com.br:50300/portal/p/Baruel/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + processInstanceId;
        var grupoAtual = hAPI.getCardValue("proximoGrupo").substring(11);

        // Parametros do e-mail
        var parametros = new java.util.HashMap();
        parametros.put('subject', ASSUNTO);
        // parametros.put('PROCESS_ID', processName);
        // parametros.put('TENANT_ID', tenand);
        // parametros.put('URL_PROCESS_INSTANCE', SERVER);
        parametros.put('grupoAtual', grupoAtual);

        // Lista de destinatários
        var destinatarios = new java.util.ArrayList();
        destinatarios.add('filipe.psantos@totvs.com.br');


        try {
            // Envia e-mail
            notifier.notify(REMETENTE, TEMPLATE, parametros, destinatarios, "text/html");

        } catch (error) {
            throw error
        }


    }

}