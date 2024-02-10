const numberFormatter = new Intl.NumberFormat('pt-BR', {
	minimumFractionDigits: 2,
});

let UTILS = {
	validateDateDifference: function(obj,startDate,endDate,msg){
		let inicio = startDate.val();
		let fim = endDate.val();
		
		if(inicio != "" && fim != ""){
			let mi = moment(inicio,"DD/MM/YYYY");
			let mf = moment(fim,"DD/MM/YYYY");
			if(mi > mf){
				FLUIGC.toast({
				   title: 'Data: ',
				   message: msg,
				   type: 'warning'
			     });
				
				obj.val("");
				obj.focus();
				return false;
			}else{
				return true;
			}
		}
	},
	validateDate: function(objeto){
		let a_date   = moment(objeto.val(), 'DD/MM/YYYY', true);
		let is_valid = a_date.isValid();
		
		if(!is_valid){
			FLUIGC.toast({
				title: 'Data: ',
				message: 'Data Inválida',
				type: 'warning'
			});
			objeto.val("");
			objeto.focus();
			return false;
		}
		return true;
	},
	validateTime: function(objeto){
		let a_time   = moment(objeto.val(), 'HH:mm', true);
		let is_valid = a_time.isValid();
		
		if(!is_valid){
			FLUIGC.toast({
			   title: 'Horário: ',
			   message: 'Horário inválido',
			   type: 'warning'
			   });
		   objeto.val("");
		   objeto.focus();
		}
	},
	validateEmail: function(email) {
		let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return regex.test(email);
	},
	validateCpf: function(field){
	    let exp = /\.|\-/g;
	    
	    let cpf = field.replace(exp,'').toString();
	    
	    if(cpf.length != 11){
	    	return false;
	    }
	    	
		// Elimina CPFs invalidos conhecidos, ex.: 00000000000
    	if (cpf.split(cpf[0]).join("").length == 0){
    		return false;
    	}
    	
	    let v = [];

	    //Calcula o primeiro dígito de verificação.
	    v[0] = 1 * cpf[0] + 2 * cpf[1] + 3 * cpf[2];
	    v[0] += 4 * cpf[3] + 5 * cpf[4] + 6 * cpf[5];
	    v[0] += 7 * cpf[6] + 8 * cpf[7] + 9 * cpf[8];
	    v[0] = v[0] % 11;
	    v[0] = v[0] % 10;

	    //Calcula o segundo dígito de verificação.
	    v[1] = 1 * cpf[1] + 2 * cpf[2] + 3 * cpf[3];
	    v[1] += 4 * cpf[4] + 5 * cpf[5] + 6 * cpf[6];
	    v[1] += 7 * cpf[7] + 8 * cpf[8] + 9 * v[0];
	    v[1] = v[1] % 11;
	    v[1] = v[1] % 10;

	    //Retorna Verdadeiro se os dígitos de verificação são os esperados.
	    return v[0] == cpf[9] && v[1] == cpf[10];
	},
	validateCNPJ:function(cnpj) {
		cnpj = cnpj.replace(/[^\d]+/g,'');
		
		if(cnpj == '' || cnpj.length != 14) return false;
		
		// Elimina CNPJs invalidos conhecidos, ex.: 00000000000000
		if (cnpj.split(cnpj[0]).join("").length == 0)
			return false;
				
		// Valida DVs
		var tamanho = cnpj.length - 2
		var numeros = cnpj.substring(0,tamanho);
		var digitos = cnpj.substring(tamanho);
		var soma = 0;
		var pos = tamanho - 7;
		for (var i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0))
			return false;
				
		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
			soma += numeros.charAt(tamanho - i) * pos--;
			if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1))
				return false;
				
		return true;
	},
	getTableRows: function(tableId){
		return $('table[id='+tableId+'] > tbody > tr:gt(0)');
	},
	clearTableRows: function(tableId){
		$('table[id='+tableId+'] > tbody > tr:gt(0)').remove();
	},
	getChildrenIndexes: function(tableId){
		let indexes = [];
		$('table[id='+tableId+'] > tbody > tr:gt(0)').each(function(){
			let input = $(this).find('input[type="text"],input[type="hidden"]')[0];
			if(input == null) return;

			indexes.push($(input).attr("id").split("___")[1]);
		});
		return indexes;
	},
	leftPad: function(value, length) { 
		return ('0'.repeat(length) + value).slice(-length); 
	},
	parseFloat: function(value, defaultVal){
		let fallBack = (defaultVal != undefined && defaultVal != null) 
			? defaultVal : "0"; 
		let n1 = (value != null && value != "") ? value.replace(/\./g, "") : fallBack;
        return parseFloat(n1.replace(",","."));		 
	},
	formatNumber: function(value){
		return numberFormatter.format(value);
	},
	
	setTableOrder: function(tableId,orderField){
		let indexes = UTILS.getChildrenIndexes(tableId);
		let order = 1;
		
		for(let i=0;i<indexes.length;i++){
			$("#"+orderField+"___"+indexes[i]).val(order++);
		}
	},
	calculateTotalValueTable: function(tableId,fieldToSum){
		let indexes = UTILS.getChildrenIndexes(tableId);
		let total = 0;
		
		for(let i=0;i<indexes.length;i++){
			let value = ($("#"+fieldToSum+"___"+indexes[i]).val() == "") ? 0 : UTILS.floatParser($("#"+fieldToSum+"___"+indexes[i]).val());
			total += value;
		}
		
		return total;
	}
	, getLocale: function(){
		try { return parent.WCMAPI.locale; }
		catch(e) { 
			return navigator.languages
			    ? navigator.languages[0]
			    : (navigator.language || navigator.userLanguage);
		}
	}
}