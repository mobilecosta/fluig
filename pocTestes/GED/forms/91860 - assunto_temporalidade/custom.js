$( document ).ready(function() {
	MAIN.init();
});

let MAIN = {
	init: function(){
		let $periodicidade = $('#periodicidade');
		$periodicidade.on('change', MAIN.trocaPeriodicidade);
		$periodicidade.trigger('change');
	}
	, trocaPeriodicidade: function(ev){
		let target = $(ev.target).find(':selected').val();
		if(target == 'semanal' || target == 'quinzenal'){
			$('#quando').val('segunda-feira');
			$('#quando').prop('readonly', true);
		}
		else if(target == 'mensal'){
			$('#quando').prop('readonly', false);
			MAIN.periodicidadeMensal();
		}
		else if(target == 'semestral' || target == 'anual' || target == 'mensalAvulso'){
			$('#quando').prop('readonly', false);
			let max = (target == 'semestral') ? 6 : 12;
			MAIN.periodicidadeAnual(max);
		}
		else{
			$('#quando').val('');
			$('#quando').prop('readonly', true);
		}
	}
	
	, periodicidadeMensal: function(){
		let $quando = $('#quando');
		let val = $quando.val();
		$quando.mask('00', {
			onComplete: function(dia) {
				let dt = parseInt(dia, 10);
				if(isNaN(dt) || dt <= 0 || dt > 31){
					$('#quando').val('');
				}
			}
		});
		$quando.val(val).trigger('keyup');
	}
	, periodicidadeAnual: function(mesMax){
		let $quando = $('#quando');
		let val = $quando.val();
		
		let trinta = [4, 6, 9, 11];
		$quando.mask('00/00', {
			onComplete: function(diaMes) {
				let split = diaMes.split('/');
				let dia = parseInt(split[0], 10);
				let mes = parseInt(split[1], 10);
				if(isNaN(dia) || dia <= 0 || dia > 31){
					$('#quando').val('');
					return;
				}
				if(isNaN(mes) || mes <= 0 || mes > mesMax){
					$('#quando').val('');
					return;
				}
				if((trinta.indexOf(mes) > -1 && dia > 30)
					|| (mes == 2 && dia > 29)){
					$('#quando').val('');
					return;
				}
			}
		});
		$quando.val(val).trigger('keyup');
	}
}

function setSelectedZoomItem(selectedItem) {
	let id = "";
	let index = "";
	if(selectedItem.inputId.indexOf("___") > -1){
		id = selectedItem.inputId.split('___')[0];
		index = selectedItem.inputId.split('___')[1];
	}else {
		id = selectedItem.inputId;
	}	
	
	if(id == "nm_assunto"){
		$('#cd_assunto').val(selectedItem.topicId);
	}
}

function removedZoomItem(item) {
	let id = "";
	let index = "";
	if(item.inputId.indexOf("___") > -1){
		id = item.inputId.split('___')[0];
		index = item.inputId.split('___')[1];
	}else {
		id = item.inputId;
	}	
	
	if(id == "nm_assunto"){
		$('#cd_assunto').val('');
	}
}

