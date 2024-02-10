function servicetask20(attempt, message) {

	try {

		var table = hAPI.getChildrenIndexes("tabelaRespostas");
		for (var i = 0; i < table.length; i++) {

			var SubProcessoID = hAPI.getCardValue("subprocessoID___" + table[i]);

			var Constraint = DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", SubProcessoID, SubProcessoID, ConstraintType.MUST);

			var ds = DatasetFactory.getDataset("workflowProcess", null, [Constraint], null);

			if (ds.getValue(0, "active") == false) {

				var documentid = ds.getValue(0, "cardDocumentId");

				var ConstraintForm = DatasetFactory.createConstraint("documentid", documentid, documentid, ConstraintType.MUST)

				var dsForm = DatasetFactory.getDataset("ds_SubProcessoRFP", null, [ConstraintForm], null);

				var retorno = dsForm.getValue(0, "retorno");

				var nomeApoiador = dsForm.getValue(0, "nomeApoiador")


				hAPI.setCardValue("retornoApoio___" + table[i], retorno);
				hAPI.setCardValue("nomeApoiador___" + table[i], nomeApoiador);
			}

		}


		verificaSubprocessos();
		return true;

	} catch (error) {

		throw error;
	}
}

function verificaSubprocessos() {
	var table = hAPI.getChildrenIndexes("tabelaRespostas");
	var index = table.length
	var respondido = 0

	for (var i = 0; i < index; i++) {
		if (hAPI.getCardValue("retornoApoio___" + table[i]) != 'Aguardando Retorno!') {
			respondido++;
		}
	}

	if(respondido == index){
		hAPI.setCardValue("statusRetorno", 'true');
	}
}