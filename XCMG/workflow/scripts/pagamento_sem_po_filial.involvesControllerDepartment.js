function involvesControllerDepartment(){
	var involves = true;
	/*var indexes = hAPI.getChildrenIndexes("tb_produtos");
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var cc = ""+hAPI.getCardValue("cd_conta_contabil___"+row);
		log.info("#cc: "+cc);
		if(cc.charAt(0) == "4"){
			involves = true;
			break
		}
		
	}*/
	log.info("#involves: "+involves);
	return involves;
}