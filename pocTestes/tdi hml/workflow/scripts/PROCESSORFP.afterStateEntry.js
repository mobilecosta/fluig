function afterStateEntry(sequenceId){

	var user = getValue("WKUser");
    hAPI.setCardValue("IDsolicitante", user);

	
	if (sequenceId == 7) {

		//busca no formulário campo do zoom que armazena o código da pasta
		var folderToAttach = "10251801";
		//var folderDescription = "Processo: 3741906";
		var folderDescription = "Processo: "+hAPI.getCardValue("processoPai");;
			
		//cria as constraints necessárias e consulta o dataset 
		var c1 = DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("documentType", "2", "2", ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("parentDocumentId", folderToAttach, folderToAttach, ConstraintType.MUST);
		var c4 = DatasetFactory.createConstraint("versionDescription", folderDescription, folderDescription, ConstraintType.MUST);
		var constraints   = new Array(c1, c2, c3, c4);
		var sortingFields = new Array("documentPK.documentId");	    
		var dataset = DatasetFactory.getDataset("document", null, constraints, sortingFields);

	    if (dataset.rowsCount > 0){
		    for (var i = 0; i < dataset.rowsCount; i++) {
				try {
					hAPI.attachDocument(dataset.getValue(i, "documentPK.documentId"));
				} catch (e) {
					throw "Não foi possível anexar os documentos da pasta informada. Verifique as permissões e tente novamente."
				}
			}
	    } else {
	    	throw "A pasta informada não possui documentos publicados. Verifique a pasta informada e tente novamente."
	    }
	}
}