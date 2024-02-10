function afterStateEntry(sequenceId) {
    var nome = fluigAPI.getUserService().getCurrent().getFullName();
    hAPI.setCardValue("nomeApoiador", nome);

    var processoPai = hAPI.getCardValue("processoPai");
    var constraints = [];
    constraints.push(DatasetFactory.createConstraint("versionDescription", "Processo: " + processoPai, "Processo: " + processoPai, ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("document", null, constraints, null)

    for (var i = 0; i < dataset.rowsCount; i++) {

        hAPI.attachDocument(dataset.getValue(i, "documentPK.documentId"));
    }

}