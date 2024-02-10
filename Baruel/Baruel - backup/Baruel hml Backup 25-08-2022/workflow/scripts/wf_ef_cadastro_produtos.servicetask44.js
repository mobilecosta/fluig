function servicetask44(attempt, message) {
    var dataset = DatasetFactory.getDataset('ds_ef_email_fim', null, [
        DatasetFactory.createConstraint('processId', getValue('WKDef'), null, ConstraintType.MUST),
        DatasetFactory.createConstraint('processInstanceId', getValue('WKNumProces'), null, ConstraintType.MUST)
        
    ], null);

    var result = dataset.getValue(0, 'result');
    var message = dataset.getValue(0, 'message');
    if (result != 'OK') {
    throw message;
    }
}