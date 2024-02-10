function afterProcessCreate(processId) {
	var identificador = hAPI.getCardValue("idCNPJ_canal") + hAPI.getCardValue("idCodigo_fornecedor");
	var dataset = DatasetFactory.getDataset("ds_sql_consulta_fluig", [ "SELECT MD5('" + identificador + "') AS MD5" ], null, null);
	var MD5 = dataset.getValue(0, "MD5");
	hAPI.setCardValue("identificador", MD5);
	hAPI.setCardValue("acesso", MD5.substring(0, 2) + MD5.substring(10, 12) + MD5.substring(20, 22) + MD5.substring(29, 31));
	hAPI.setCardValue("localizacao", "Pendente anexar a nota fiscal");
	hAPI.setCardValue("solicitacao", processId);
}