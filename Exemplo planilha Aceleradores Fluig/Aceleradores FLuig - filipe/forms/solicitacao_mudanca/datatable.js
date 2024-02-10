function retornaIndice(tablename, uuid) {
	let tbody = $("table[tablename='" + tablename + "']").find("tbody")[0];
	let inputs = $(tbody).find("input");
	let indice = -1;
	for(let i = 0; i < inputs.length; i++) {
		if($(inputs[i]).val() == uuid)
			indice = $(inputs[i]).attr("id").split("___")[1];
	}
	return indice;
}

function retornaIndicesTabela(tablename) {
	let indices = [];
	let linhas = $("table[tablename='" + tablename + "'] tbody tr");

	for(var i = 1; i < linhas.length; i++) {
		let input = $(linhas[i]).find("input")[0];
		let campo = input == undefined ? $(linhas[i]).find("span")[0] : input;
		if(campo !== undefined)
			indices.push(campo.id.split("___")[1]);
	}
	return indices;
}