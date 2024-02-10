function enableFields(form){ 

    var AtividadeAtual = getValue('WKNumState');

    if(AtividadeAtual != 0 && AtividadeAtual != 6) {
        form.setEnabled("telefone", false);
        form.setEnabled("porte", false);
        form.setEnabled("versao_release", false);
        form.setEnabled("titulo_modulos", false);
        form.setEnabled("item_1_1", false);
        form.setEnabled("obs_1_1", false);
        form.setEnabled("item_1_2", false);
        form.setEnabled("obs_1_2", false);
        form.setEnabled("item_1_3", false);
        form.setEnabled("obs_1_3", false);
        form.setEnabled("item_1_4", false);
        form.setEnabled("obs_1_4", false);
        form.setEnabled("item_1_5", false);
        form.setEnabled("obs_1_5", false);
        form.setEnabled("obs_1_6", false);
        form.setEnabled("obs_1_7", false);
        form.setEnabled("obs_1_8", false);
        form.setEnabled("obs_1_5", false);
        
    }
    

   
}