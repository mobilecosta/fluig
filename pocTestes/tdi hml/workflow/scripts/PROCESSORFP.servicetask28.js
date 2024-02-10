function servicetask28(attempt, message) {

	try {

		var valoresForm = new java.util.HashMap();

		valoresForm.put("IDsolicitante", hAPI.getCardValue("IDsolicitante"));
		valoresForm.put("solicitante", hAPI.getCardValue("solicitante"));
		valoresForm.put("razao_social", hAPI.getCardValue("razao_social"));
		valoresForm.put("data_solicitacao", hAPI.getCardValue("data_solicitacao"));
		valoresForm.put("telefone", hAPI.getCardValue("telefone"));
		valoresForm.put("porte", hAPI.getCardValue("porte"));
		valoresForm.put("versao_release", hAPI.getCardValue("versao_release"));
		valoresForm.put("titulo_modulos", hAPI.getCardValue("titulo_modulos"));
		valoresForm.put("item_1_1", hAPI.getCardValue("item_1_1"));
		valoresForm.put("obs_1_1", hAPI.getCardValue("obs_1_1"));
		valoresForm.put("item_1_2", hAPI.getCardValue("item_1_2"));
		valoresForm.put("obs_1_2", hAPI.getCardValue("obs_1_2"));
		valoresForm.put("item_1_3", hAPI.getCardValue("item_1_3"));
		valoresForm.put("obs_1_3", hAPI.getCardValue("obs_1_3"));
		valoresForm.put("item_1_4", hAPI.getCardValue("item_1_4"));
		valoresForm.put("obs_1_4", hAPI.getCardValue("obs_1_4"));
		valoresForm.put("item_1_5", hAPI.getCardValue("item_1_5"));
		valoresForm.put("obs_1_5", hAPI.getCardValue("obs_1_5"));
		valoresForm.put("obs_1_6", hAPI.getCardValue("obs_1_6"));
		valoresForm.put("obs_1_7", hAPI.getCardValue("obs_1_7"));
		valoresForm.put("obs_1_8", hAPI.getCardValue("obs_1_8"));


		var table = hAPI.getChildrenIndexes("tabelaRespostas");
		for (var i = 0; i < table.length; i++) {

			hAPI.setCardValue("nomeApoiador___"+ table[i], "Aguardando Retorno!")
			hAPI.setCardValue("retornoApoio___"+ table[i], "Aguardando Retorno!")

			valoresForm.put("grupoApoiador", hAPI.getCardValue("grupo___" + table[i]));
			valoresForm.put("produtoApoio", hAPI.getCardValue("produtoApoio___" + table[i]));
			valoresForm.put("areaApoio", hAPI.getCardValue("areaApoio___" + table[i]));

			var listaColab = new java.util.ArrayList();
			listaColab.add("Pool:Group:" + hAPI.getCardValue("idGrupo___" + table[i]));

			var retorno = hAPI.startProcess("SUBPROCESSORFP", 5, listaColab, "iniciou SubProcesso", true, valoresForm, false);
			hAPI.setCardValue("subprocessoID___" + table[i], retorno.get("iProcess"));

		}

		return true;

	} catch (error) {

		throw error;
	}
}

