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
		if(UTILS.getLocale() == "en_US"){
			let enDate = moment(objeto.val(), "MM-DD-YYYY");
			//Se é formato EUA, converte e atualiza o campo
			if(enDate.isValid())
				objeto.val(enDate.format("DD/MM/YYYY"));
		}
		
		let a_date = moment(objeto.val(), 'DD/MM/YYYY', true);
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
	getTableRows: function(tableId){
		return $('table[id='+tableId+'] > tbody > tr:gt(0)');
	},
	getTableFirstRow: function(tableId){
		return $('table[id='+tableId+'] > tbody > tr:nth-child(2)');
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
	moneyParser: function(value){
		if(value == null || value == "") return 0;
		let n1 = value.replace(/\./g, "");
        return parseFloat(n1.replace(",","."));		 
	},
	isReadonly: function(obj){
		return $(obj).is(["readonly"]);
	},
	getColleagueById: function(id){
		let c1 = DatasetFactory.createConstraint("active",true,true,ConstraintType.MUST);
		let c2 = DatasetFactory.createConstraint("colleagueId",id,id,ConstraintType.MUST);
		
		let ds = DatasetFactory.getDataset("colleague", null, [c1,c2], null);
		return ds.values[0];
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