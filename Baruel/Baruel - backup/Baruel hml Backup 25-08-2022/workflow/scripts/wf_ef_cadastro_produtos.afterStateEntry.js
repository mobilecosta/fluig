function afterStateEntry(sequenceId) {
	return;
	if (sequenceId == 18) {
		
		var gruposRestantes = "" + hAPI.getCardValue("gruposRestantes");
		
		if (gruposRestantes != "") {
			var arrGruposRestantes = gruposRestantes.split(",");
			var arraySize = arrGruposRestantes.length;
			var axGroup = "Pool:Group:" + arrGruposRestantes[0];

			hAPI.setCardValue("grupoAtual", axGroup);
			hAPI.setCardValue("existemMaisGrupos", "SIM");
			hAPI.setCardValue("proximoGrupo", "Pool:Group:" + arrGruposRestantes[1]);

			var axStr = "";
			for (var i = 1; i < arraySize; i++) {
				axStr += arrGruposRestantes[i];
				if ((i+1) < arraySize) {
					axStr += ",";
				}
			}
			
			hAPI.setCardValue("gruposRestantes", axStr);
		} else {
			hAPI.setCardValue("existemMaisGrupos", "NAO");
		}
		
	}
}