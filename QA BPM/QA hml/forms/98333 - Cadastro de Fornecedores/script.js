$(document).ready( function(){
	 /*
	 * Pega o retorno do arquivo selecionado.
	 */	 

	$("#uploadBtn").click(function(){
		$("#uploadBtn").val("");
	});
	document.getElementById("uploadBtn").addEventListener('change', carregando, false);
	
});

/*
 * Função utilizada para validar digitação do codigo
 */
$(document).on('change', ".nm_codFornecedor", function () {
	var numId = retIdCampo($(this).attr("name"));
	var codigo = $(this).val();
	
	if(!podeIncluir(codigo, numId)){
		$(this).val("");
	}
	
});

/*
 * Função utilizada para validar digitação do cnpj
 */
$(document).on('change', ".nm_cnpj", function () {
	var numId = retIdCampo($(this).attr("name"));
	var codigo = $(this).val();
	
	if(!podeIncluir(codigo, numId)){
		$(this).val("");
	}
	
});


/*
 * Função utilizada para exibição o icone de loading durante a carga do arquivo.
 */
function carregando(evt){
	var myLoading1 = FLUIGC.loading(window,{
		textMessage:  "Carregando arquivo..."
	});
	$.ajax({
	    url: '',
	    beforeSend: function() { 
	     myLoading1.show();  
	     },
	    complete: function() { 
	     upload(evt);
	     myLoading1.hide(); 
	     }
	});
}

/*
* Lê e processa o arquivo.
*/
function upload(evt) {
	if (!browserSupportFileUpload()) {
		fluigAlert("Biblioteca de importação de CSV não suportada no Navegador Web.", "Aviso","OK")
    } else {	
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
        	var csvData = event.target.result;
            
        	data = $.csv.toArrays(csvData,{
            	  separator:';' //Define qual caracter utilizado para quebra. ", ou ;"
            });
            	  
            if (data && data.length > 0) {
            	preencheGrid(data);
//            	toastMessage("", (data.length - 1) + " registro(s) importado(s).", "success");
            }else{
            	fluigAlert("Verifique o conteúdo do arquivo.", "Aviso","Alert")
            }
        };
        reader.onerror = function() {
        	fluigAlert("Falha ao ler o arquivo " + file.fileName, "Aviso","Alert")
        };
    }
}

/*
 * Verifica se o navegador suporta
 */
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    	isCompatible = true;
    }
    return isCompatible;
}

/*
 * Função utilizada para percorrer o retorno da leitura do arquivo.
 */
function preencheGrid(itens){
	
	var i = 0;
	var POS_CODIGO = 0;
	var POS_RAZAO = 1;
	var POS_CNPJ = 2;
	var POS_MAIL = 3;
	var POS_TELEFONE = 4;
	var POS_ENDERECO = 5;
	var POS_BAIRRO = 6;
	var POS_MUNICIPIO = 7;
	var POS_UF = 8;
	var POS_OBS = 9;
	var classTable	= ".Fornecedores tr";
	var tableName = "Fornecedores";
	var tamItens = itens.length;
	
	for (var i = 1 ; i < tamItens;i++){
			
		var codigo 		= itens[i][POS_CODIGO];
		var razao 		= itens[i][POS_RAZAO];
		var cnpj 		= itens[i][POS_CNPJ];
		var mail 		= itens[i][POS_MAIL];
		var telefone 	= itens[i][POS_TELEFONE];
		var endereco 	= itens[i][POS_ENDERECO];
		var municipio 	= itens[i][POS_MUNICIPIO];
		var bairro	 	= itens[i][POS_BAIRRO];
		var uf 			= itens[i][POS_UF];
		var obs			= itens[i][POS_OBS];
		
		if (podeIncluir(cnpj, i) && podeIncluir(codigo, i)){
			
			var id = wdkAddChild(tableName);
			$("#nm_codFornecedor___"+id).val(codigo);
			$("#nm_razaoSocial___"+id).val(razao);
			$("#nm_cnpj___"+id).val(cnpj);
			$("#nm_email___"+id).val(mail);
			$("#nm_telefone___"+id).val(telefone);
			$("#nm_endereco___"+id).val(endereco);
			$("#nm_municipio___"+id).val(municipio);
			$("#nm_bairro___"+id).val(bairro);
			$("#cb_uf___"+id).val(uf);
			$("#nm_obs___"+id).val(obs);
		}
	}
}

/*
 * Função utilizada para validar a inclusão para nao gerar duplicidade
 */
function podeIncluir(chave, linha){
	
	var constraints = new Array();
	var codigo = DatasetFactory.createConstraint("codigo",chave,chave, ConstraintType.MUST);
	var existeChave = false;
	var retorno = true;
	
	constraints.push(codigo);
	
	var dataset = DatasetFactory.getDataset("Fornecedores", null, constraints, null);
	
	if (dataset != null){	
		for(var i=0;i < dataset.values.length;i++){
			existeChave = true;
			retorno = false;
		}
	}
	
	if(existeChave){
		FLUIGC.toast({
            message: 'Codigo ou CNPJ: ' + chave + ' informado na linha ' +linha+' já está cadastrado e não será importado',
            type: 'danger'
        });
	}
	return retorno;
}

/*
 * Função utilizada para retornar o id do campo.
 */
function retIdCampo(campo)
{
	var array = campo.split("___");
	return array[1];
}

/*
 * Função utilizada para retornar o name do campo.
 */
function retNameInput(campo)
{
	var array = campo.split("___");
	return array[0];
}

/*
 * Função utilizada para formatar CNPJ
 */
function formataCNPJ(campo,teclapres){
    var tecla = teclapres.keyCode;
    var vr = new String(campo.value);

    vr = vr.replace(".", "");
    vr = vr.replace("/", "");
    vr = vr.replace("-", "");
    tam = vr.length + 1;
    if (tecla != 14)
    {
        if (tam == 3)
            campo.value = vr.substr(0, 2) + '.';
        if (tam == 6)
            campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 5) + '.';
        if (tam == 10)
            campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(6, 3) + '/';
        if (tam == 15)
            campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(6, 3) + '/' + vr.substr(9, 4) + '-' + vr.substr(13, 2);
    }
}