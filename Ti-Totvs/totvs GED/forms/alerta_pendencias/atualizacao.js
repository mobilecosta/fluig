function fnCustomDelete(oElement){
	$('#tabelaSituacao tbody tr').not(':first').each(function(count,tr)
			{ 
			    fnWdkRemoveChild($(this).find('i')[0]); 
			});
 }
function carregaPaiFilho() {
    var dataset = DatasetFactory.getDataset("arquivo_consulta_entregas", ["s_path","idUnidade", "status",
		"dtPrevista","documento","dtEntrega" ,"dtValidade", "raiz"], null, null);

    for (var i=0;i<dataset.values.length;i++){
        let newId = wdkAddChild('tabelaSituacao');
        $("#unidade___"+newId).val(dataset.values[i].idUnidade);
        $("#caminho___"+newId).val(dataset.values[i].s_path);
        $("#documento___"+newId).val(dataset.values[i].documento);
        $("#dataEsperada___"+newId).val(dataset.values[i].dtPrevista);
        $("#situação___"+newId).val(dataset.values[i].status);
        $("#dataEntrega___"+newId).val(dataset.values[i].dtEntrega);
        $("#validade___"+newId).val(dataset.values[i].dtValidade);
    }
}

