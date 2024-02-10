function displayFields(form,customHTML){
	   form.setShowDisabledFields(true);
	   form.setHidePrintLink(true);
	   
	customHTML.append("<script>function getFormMode(){ return '" + form.getFormMode() + "' ;}</script>");
	customHTML.append("<script>function getWKUser(){ return '" + getValue('WKUser') + "';}</script>");
	customHTML.append("<script>function getWKNumState(){ return '" + getValue('WKNumState') + "';}</script>");

}


//    //Monta as constraints para consulta
//    var c1 = DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST);
//    var c2 = DatasetFactory.createConstraint("publisherId", "adm", "adm", ConstraintType.MUST_NOT);
//    var c3 = DatasetFactory.createConstraint("documentType", "1", "1", ConstraintType.SHOULD);
//    var c4 = DatasetFactory.createConstraint("documentType", "2", "2", ConstraintType.SHOULD);
//    var c5 = DatasetFactory.createConstraint("documentDescription", "%teste%", "%teste%", ConstraintType.MUST_NOT);
//    c5.setLikeSearch(true);
//    var constraints   = new Array(c1, c2, c3, c4, c5);
//     
//    //Define os campos para ordenação
//    var sortingFields = new Array("documentPK.documentId");
//     
//    //Busca o dataset
//    var dataset = DatasetFactory.getDataset("document", null, constraints, sortingFields);
//     
//    for(var i = 0; i < dataset.rowsCount; i++) {
//        log.info("LOG TESTE FLUXO APROVACAO" + dataset.getValue(i, "documentPK.documentId"));
//    }
//    