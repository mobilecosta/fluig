function validFields(fields,form)
{   
	for(var i = 0 ;i < fields.length ;i++){
		var campo = fields[i];
		var idCampo = campo[0];
		var lblCampo = campo[1];
		
		if (form.getValue(idCampo) == null || form.getValue(idCampo) == 0 || form.getValue(idCampo) == '' || form.getValue(idCampo) == "" || form.getValue(idCampo) == "SEL"){
			throw "O campo " + lblCampo + " não foi informado.";
			break;
			
		}else{
			/*
			if(idCampo.indexOf("nm_codFornecedor") != -1){
				if (!podeIncluir(form.getValue(idCampo), i)){
					throw "O campo " + lblCampo + " não já está gravado no cadastro. Exclua o registro anterior, salve, e em seguida repita a operação. Ou atuiialize a linha já existente";
					break;
				}
			}
			if(idCampo.indexOf("nm_cnpj") != -1){
				if (!podeIncluir(form.getValue(idCampo), i)){
					throw "O campo " + lblCampo + " não já está gravado no cadastro. Exclua o registro anterior, salve, e em seguida repita a operação. Ou atuiialize a linha já existente";
					break;
				}
			}*/
		}
		
	}

}
/*
 * Função utilizada para validar a inclusão para nao gerar duplicidade
 */
function podeIncluir(chave, linha){
	var constraints = new Array();
	var codigo = DatasetFactory.createConstraint("codigo",chave,chave, ConstraintType.MUST);
	var retorno = true;
	
	constraints.push(codigo);
	
	// var dataset = DatasetFactory.getDataset("Fornecedores", null, constraints, null);
	
	// if (dataset != null){	
	// 	for(var i=0;i < dataset.values.length;i++){
	// 		retorno = false;
	// 	}
	// }
	
	return retorno;
}