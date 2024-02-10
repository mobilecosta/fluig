$(document).ready(function () {

	events();

});

function events() {

	$(document).on('change', "#grupo", function () {
		setSelectedZoomItem(this);
		removedZoomItem(this);
	});

	enableField();
};

function adicionarLinha() {
	wdkAddChild('tabelaRespostas');
};

function deletaLinha(element) {
	fnWdkRemoveChild(element)
};

function setSelectedZoomItem(selectedItem) {

	if (selectedItem.inputId.indexOf("grupo___") != -1) {
		let id = selectedItem.inputId.split("___");
		$("#areaApoio___" + id[1]).val(selectedItem['Area'])
		$("#produtoApoio___" + id[1]).val(selectedItem['produto'])
		$("#idGrupo___" + id[1]).val(selectedItem['idGrupo'])
		$("#nomeApoiador___" + id[1]).val(selectedItem['grupo'])
	}
};

function removedZoomItem(removedItem) {

	if (removedItem.inputId.indexOf("grupo___") != -1) {
		let id = removedItem.inputId.split("___");
		$("#areaApoio___" + id[1]).val('')
		$("#produtoApoio___" + id[1]).val('')
		$("#idGrupo___" + id[1]).val('')
		$("#nomeApoiador___" + id[1]).val('')
	}
};

function enableField() {

	var AtividadeAtual = getWKNumState();
	var formMode = getFormMode()

	if (formMode == "VIEW") {

		$('#btn_addResposta').hide()
		var rows = $('table tbody tr:not(:first-child)')
		rows.each((index, element) => {
			$($(element).find('.fluigicon-trash')[0]).hide()

		});
	}

	if (AtividadeAtual != 0 && AtividadeAtual != 6) {

		$('#btn_addResposta').hide();
		$('.divGrupo').hide();
		var rows = $('table tbody tr:not(:first-child)')
		rows.each((index, element) => {
			$($(element).find('.fluigicon-trash')[0]).hide();
			$('#nomeApoiador___' + (index+1)).show();
		});

	}
};





