function createDataset(fields, constraints, sortFields) {
	// var ds_cadastro = DatasetFactory.getDataset('ds_ef_cadastro_produtos', null, null, null);
	var ds_cadastro = DatasetFactory.getDataset('ds_ef_alteracao_produtos', null, null, null);
	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn('name');
	dataset.addColumn('text');

	for (var i = 0; i < ds_cadastro.getColumnsCount(); i++) {
		var columnName = ds_cadastro.getColumnName(i);

		switch (columnName) {
			case "cardid":
			case "companyid":
			case 'documentid':
			case 'metadata#active':
			case 'metadata#card_index_id':
			case 'metadata#card_index_version':
			case 'metadata#id':
			case 'metadata#parent_id':
			case 'metadata#version':
			case 'tableid':
			case 'version':
			case 'id':
			case 'existemMaisGrupos':
			case 'grupoAtual':
			case 'gruposRestantes':
			case 'nrProcesso':
				break;

			default:
				if (columnName == 'branch' || columnName.slice(0, 2) == 'B1') {
					dataset.addRow(new Array(columnName, columnName));
				}
				break;
		}
	}

	return dataset;
}