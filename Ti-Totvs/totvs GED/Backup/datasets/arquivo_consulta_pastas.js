function createDataset(fields, constraints, sortFields) {
	var ds = DatasetBuilder.newDataset();
	
    log.info('arquivo_consulta_pastas - inicio');
    log.dir(constraints);

    var empresa = getValue("WKCompany");
    if(constraints == null || constraints.length == 1) {
		ds.addColumn('ERRO');
		ds.addColumn('docId_docDesc');
		ds.addRow(['Adicione ao menos uma constraint', 'Preencha o campo para iniciar a busca']);
		return ds;
	}
	
	var parametro = constraints[1].initialValue;

    var cs = [
		DatasetFactory.createConstraint('documentPK.companyId', empresa, empresa, ConstraintType.MUST)
		, DatasetFactory.createConstraint("documentType", "1", "1", ConstraintType.MUST)
		, DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST)
		, DatasetFactory.createConstraint("deleted", "false", "false", ConstraintType.MUST)
    	, DatasetFactory.createConstraint('sqlLimit', '100', '100', ConstraintType.MUST)
    ];

    if (parseInt(parametro)) {
        cs.push(DatasetFactory.createConstraint('documentPK.documentId', parametro, parametro, ConstraintType.MUST));
    } else {
		parametro += '%';
		var csDescricao = DatasetFactory.createConstraint('documentDescription', parametro, parametro, ConstraintType.MUST);
		csDescricao.setLikeSearch(true);
        cs.push(csDescricao);
    }
    log.dir(cs);

    //Define os campos para ordenação
    var fields = [ "documentPK.documentId", "documentDescription", "documentType"
    	, "publisherId", "accessCount", "version", "phisicalFile"
    	, "topicId", "relatedFiles" ];
    var sortingFields = [ "accessCount", "documentDescription" ];
	var documentDs = DatasetFactory.getDataset("document", fields, cs, sortingFields);
	for(var d = 0; d < documentDs.rowsCount; d++){
		if(d == 0){
			for(var c = 0; c < fields.length; c++) ds.addColumn(fields[c]);
			ds.addColumn('docId_docDesc');
		}
		var row = [];
		for(var c = 0; c < fields.length; c++){
			row.push(documentDs.getValue(d, fields[c]));
		}
		
		var docId = documentDs.getValue(d, "documentPK.documentId");
		var docDesc = documentDs.getValue(d, "documentDescription");
		row.push(docId + '-' + docDesc);
		
		ds.addRow(row);
	}
	return ds;
}