function enableFields(form){ 
    
    var currentStatus = getValue("WKNumState");

    if(currentStatus == 14) {
        form.setEnabled("ObsContasPagar", false);
        form.setEnabled("idAprovado", false);
    }
    if(currentStatus == 17) {
        form.setEnabled("ObsContasPagar", false);
        form.setEnabled("idAprovado", false);
    }
    if(currentStatus == 20) {
        form.setEnabled("ObsContasPagar", false);
        form.setEnabled("idAprovado", false);
        form.setEnabled("ObsFiscal", false);
        form.setEnabled("idAprovadorFiscal", false);
    }



}