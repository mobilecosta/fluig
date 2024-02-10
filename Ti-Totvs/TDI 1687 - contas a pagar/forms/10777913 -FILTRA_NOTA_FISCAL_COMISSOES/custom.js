/*$(document).ready(function(){
	buscaPedidos();
});*/

function buscaPedidos(){
	var constraints = [];
	
	var de = $("#de").val();
	var ate = $("#ate").val();
	var data = $("#datapedido").val();
	var forn = $("#forn").val();
	var agn = $("#agn").val();
	
	constraints.push(DatasetFactory.createConstraint("codigo_ar_de", de, de, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("dtRef", data, data, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("codigo_ar_ate", ate, ate, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("tp_forn", forn, forn, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("tp_agn", agn, agn, ConstraintType.MUST));
	
	var dataset = DatasetFactory.getDataset("ds_Contas_Pagar_Comissoes", null, constraints, null);
	$("#tabelaPedidos").html("");
	
	console.log(dataset);
	
	for (var i = 0; i < dataset.values.length; i++){
		var linhaTabela = "<tr>";
		linhaTabela += "<td>" + dataset.values[i].CODIGOAR + "</td>";
		linhaTabela += "<td>" + dataset.values[i].GERADO + "</td>";
		linhaTabela += "<td>" + dataset.values[i].CNPJ_TOTVS + "</td>";
		linhaTabela += "<td>" + dataset.values[i].CNPJ_FORN + "</td>";
		linhaTabela += "<td>" + dataset.values[i].AGN + "</td>";
		linhaTabela += "<td>" + dataset.values[i].FILIAL + "</td>";
		linhaTabela += "<td>" + dataset.values[i].NOME_FILIA + "</td>";
		linhaTabela += "<td>" + dataset.values[i].NOME + "</td>";
		linhaTabela += "<td>" + dataset.values[i].RAZAO_SOCI + "</td>";
		linhaTabela += "<td>" + dataset.values[i].EMISSAO + "</td>";
		linhaTabela += "<td>" + dataset.values[i].PEDIDO + "</td>";
		linhaTabela += "<td>" + dataset.values[i].VALOR + "</td>";
		linhaTabela += "<td>" + dataset.values[i].COD_FORN + "</td>";
		linhaTabela += "<td>" + dataset.values[i].EMAIL + "</td>";
		linhaTabela += "<td>" + dataset.values[i].STATUS + "</td>";
		linhaTabela += "<td>" + dataset.values[i].COLLEAGUEID + "</td>";
		linhaTabela += "<td>" + dataset.values[i].PROCESSID + "</td>";
		linhaTabela += "<td>" + dataset.values[i].SENHA + "</td>";
		linhaTabela += "</tr>";
		$("#tabelaPedidos").append(linhaTabela);
	}

}



