function formataCNPJ(campo,teclapres){
	var tecla = teclapres.keyCode;
	var vr = new String(campo.value);
	vr = vr.replace(".","");
	vr = vr.replace("/","");
	vr = vr.replace("-","");
	tam = vr.length + 1;
	if(tecla != 14){
		if(tam == 3)
			campo.value = vr.substr(0,2) + '.';
		if(tam == 6)
			campo.value = vr.substr(0,2) + '.' + vr.substr(2,5) + '.';
		if(tam == 10)
			campo.value = vr.substr(0,2) + '.' + vr.substr(2,3) + '.' + vr.substr(6,3) + '/';
		if(tam == 15)
			campo.value = vr.substr(0,2) + '.' + vr.substr(2,3) + '.' + vr.substr(6,3) + '/' + vr.substr(9,4) + '-' + vr.substr(13,2);
	}
	function addRowInteractions(){
		var row = wdkAddChild('Fornecedores');
	}
}