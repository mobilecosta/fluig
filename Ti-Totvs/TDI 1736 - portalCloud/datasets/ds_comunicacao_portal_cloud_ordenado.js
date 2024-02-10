function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("documentDescription");
    dataset.addColumn("documentPK.documentId");
    dataset.addColumn("documentPK.version");


    var c1 = DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("documentType", "2", "2", ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("parentDocumentId", 11500272, 11500272, ConstraintType.MUST);
    var constraints = new Array(c1, c2, c3);
    var sortingFields = new Array("documentPK.documentId");
    var dataset2 = DatasetFactory.getDataset("document", null, constraints, sortingFields);

    for(var i=0; i <dataset2.rowsCount;i++){
        dataset.addRow(new Array(dataset2.getValue(i, "documentDescription"),dataset2.getValue(i, "documentPK.documentId"),dataset2.getValue(i, "documentPK.version")));    
    } 

    return dataset;
}
