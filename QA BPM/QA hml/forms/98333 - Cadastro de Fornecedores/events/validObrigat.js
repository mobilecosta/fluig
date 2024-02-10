function validObrigat(form){
	validaItens(form);
}

/*
 * Função responsável pela validação dos campos de item
 */
 function validaItens(form){
 	var item = 0;
 	var itens = form.getChildrenIndexes("Fornecedores");
 	var listCampo = [];
 	var campo = [];
 	var i = 0;
 	
 	for(var i = 0;i<itens.length;i++)
 	{
 		item++;
 		var pos = itens[i];
 		
 		campo = [];
 		campo.push('nm_codFornecedor___'+pos,'Código do Fornecedor' + " Item "+ item);
 		listCampo.push(campo);

 		campo = [];
 		campo.push('nm_razaoSocial___'+pos,'Razão Social' + " Item "+ item);
 		listCampo.push(campo);

 		campo = [];
 		campo.push('nm_cnpj___'+pos,'CNPJ' + " Item "+ item);
 		listCampo.push(campo);
 		
// 		campo = [];
// 		campo.push('nm_email___'+pos,'E-mail' + " Item "+ item);
// 		listCampo.push(campo);
 		
 		campo = [];
 		campo.push('nm_telefone___'+pos,'Telefone' + " Item "+ item);
 		listCampo.push(campo);
 		
 		campo = [];
 		campo.push('nm_endereco___'+pos,'Endereço' + " Item "+ item);
 		listCampo.push(campo);
 		
 		campo = [];
 		campo.push('nm_bairro___'+pos,'Bairro' + " Item "+ item);
 		listCampo.push(campo);
 		
 		campo = [];
 		campo.push('nm_municipio___'+pos,'Município' + " Item "+ item);
 		listCampo.push(campo);
 		
 		campo = [];
 		campo.push('cb_uf___'+pos,'UF' + " Item "+ item);
 		listCampo.push(campo);
 		
 		validFields(listCampo,form);
 	}
 }