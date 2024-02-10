/* function involvesFinancialManager(){
	return involvesApproverByTrigger("gatilho_diretor_financeiro");
} */
function involvesPresident(){
	return involvesApproverByTrigger("gatilho_presidente");
}

function involvesApproverByTrigger(trigger){
	/* if(regraBypassEnvolvimento()) return false; */

	var involves = false;
	var total = ""+hAPI.getCardValue("vl_total");	
	total = total.replaceAll(".", "");	    			
	total = parseFloat(total.replaceAll(",", ".")).toFixed(2);
	
	var target = ""+hAPI.getAdvancedProperty(trigger);
	target = target.replaceAll(".", "");
	target = parseFloat(target.replaceAll(",", ".")).toFixed(2);
	
	if(parseFloat(total) > 100000.00){
		involves = true;
	}
	return involves;
}

/* function regraBypassEnvolvimento(){
	return hAPI.getCardValue("cd_filial") == "1006";
} */

String.prototype.replaceAll = function(from, to){ 
	var str = this.split(from).join(to); 
	return (str); 
};