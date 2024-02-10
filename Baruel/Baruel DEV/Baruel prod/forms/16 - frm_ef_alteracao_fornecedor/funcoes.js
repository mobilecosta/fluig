/**
 * Filtra todos os campos "zoom" com a empresa e a filial
 * selecionadas no campo "#branch"
 */
let filterZoomBranch = function() {
    let company = $('#company').val();
    let branch = $('#branch').val();

    if (branch.length) branch = branch[0];

	let zoomList = $('select.select2-hidden-accessible')
		.not('#branch, #company')
		.toArray()
		.map(function (zoom) {
			return zoom.name
		});	

	zoomList.forEach(function (zoom) {
		if (zoom.includes("COD_MUN")) {
			let state = $('#A2_EST').val();
			let constraint = 'EMPRESA___EST';
			let filter = constraint + ',' +
				company +
				"___" + state;
			
			reloadZoomFilterValues(zoom, filter);
		} else {
			let constraint = 'EMPRESA';
			let filter = constraint + ',' + company;
	
			reloadZoomFilterValues(zoom, filter);
		}
	});

    reloadZoomFilterValues('consulta_Cliente', 'EMPRESA,' + $('#company').val());
}

/**
 * Mostra os erro da última tentativa de integração (se houver)
 */
let showError = function () {
	let err = $('#erro').val();

	if (err == "") {
		$('#div_erro').hide();
	} else {
		$('#div_erro').show();
		$('#div_erro p').html(err);
		$('#btnErrors').on('click', function () {
			if ($('#div_erro .panel').attr('data-showing') == 0) {
				$('#btnErrors').text('Esconder erros da última tentantiva de integração');
				$('#div_erro .panel').attr('data-showing', 1);
				$('#div_erro .panel').slideDown();
			} else {
				$('#btnErrors').text('Exibir erros da última tentantiva de integração');
				$('#div_erro .panel').attr('data-showing', 0);
				$('#div_erro .panel').slideUp();
			}
		});
	}
}

let setSelectedZoomItem = function (selectedItem) {
	const customZoomNames = getCustomZoomNames();

	// Atribui o valor correto (chave primária) ao campo escondido
	if (customZoomNames.indexOf(selectedItem.inputName) > -1) {
		const hiddenInputName = selectedItem.inputName.replace('zoom_', '');
		const hiddenInput = $('[name="' + hiddenInputName + '"]');
		const pkField = hiddenInput.attr('data-pkfield');
		hiddenInput.val(selectedItem[pkField]);
	}

	switch (selectedItem.inputName) {
		case "zoom_A2_COD_MUN":
			$('#A2_MUN').val(selectedItem['CC2_MUN']);
			break;

		case 'zoom_branch':
			let item = JSON.parse( selectedItem["Indices"] )
			$('#company').val(item['EnterpriseGroup']);
			$('#company_desc').val(item['Title']);
			$('#branch_desc').val(item['Description']);
			$('#branch').val(item['Code']);

			filterZoomBranch();

			const setDefaultValue = (field, value, desc) => {
				const hiddenField = $('#' + field);
				if (!hiddenField.val()) {
					hiddenField.val(value);
					try {
						window['zoom_' + field].setValue(desc);
					} catch (error) {
						$('#zoom_' + field).val(desc);
					}
				}
			}

			// Seleção automática de DDI para código do brasil
			setDefaultValue('A2_DDI', '55', '55 | BRASIL');
			// Seleção automática de Cód. País Banco Central para código do brasil
			setDefaultValue('A2_CODPAIS', '01058', '01058 | BRASIL');
			break;

		case "consulta_Cliente":
			loadProvider(selectedItem.A2_COD, selectedItem.A2_LOJA);
			break;

		case "zoom_A2_BANCO":
			$('#A2_AGENCIA').val(selectedItem['A6_AGENCIA']);
			$('#A2_DVAGE').val(selectedItem['A6_DVAGE']);
			$('#A2_NUMCON').val(selectedItem['A6_NUMCON']);
			$('#A2_XDIGCTA').val(selectedItem['A6_DVCTA']);
			break;

		default:
			break;
	}
}

let removedZoomItem = function (removedItem) {
	const customZoomNames = getCustomZoomNames();

	// Remove o valor do campo escondido
	if (customZoomNames.indexOf(removedItem.inputName) > -1) {
		const hiddenInputName = removedItem.inputName.replace('zoom_', '');
		const hiddenInput = $('[name="' + hiddenInputName + '"]');
		hiddenInput.val('');
	}

	switch (removedItem.inputName) {
		case "zoom_A2_COD_MUN":
			$('#A2_MUN').val('');
			break;

		case 'branch':
			$('#company').val('');
			$('#company_desc').val('');
			$('#branch_desc').val('');
			break;

		case "consulta_Cliente":
			$('#dynamicContents').find('input, select').val('');
			$('#dynamicContents')
                .find('.select2-hidden-accessible')
                .each((i, zoom) => window[zoom.name].clear())
			break;

		case "zoom_A2_BANCO":
			$('#A2_AGENCIA').val('');
			$('#A2_XAGENDV').val('');
			$('#A2_NUMCON').val('');
			$('#A2_XDIGCTA').val('');
			break;
	}
}

function initMask() {
    let $cpnj_cpf = $('#A2_CGC');
    let cgc = $('#A2_CGC').val() ? $('#A2_CGC').val() : $('#A2_CGC').text();
    if (cgc.length == 11) {
        let format_cpf = cgc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        if ($cpnj_cpf.is(':input')) {
            $cpnj_cpf.val(format_cpf);
        } else {
            $cpnj_cpf.text(format_cpf);
        }
    } else {
        let format_cnpj = cgc.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
        if ($cpnj_cpf.is(':input')) {
            $cpnj_cpf.val(format_cnpj);
        } else {
            $cpnj_cpf.text(format_cnpj);
        }
    }
}

let inputMasks = function () {
	// $('.cgc').mask('00.000.000/0000-00', { reverse: false });
	$(".cep").mask('00000-000', { reverse: false });
	$(".tel").mask('00000-0000', { reverse: true });

	// let cgcMask = $('#A2_CGC').val().replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009';
	// $('#A2_CGC').mask(cgcMask, {
	// 	onKeyPress: function(cgc, e, field, options) {
	// 		const masks = ['000.000.000-009', '00.000.000/0000-00'];
	// 		const digits = cgc.replace(/[^0-9]/g, "").length;
	// 		const mask = digits <= 11 ? masks[0] : masks[1];
	// 		$('#A2_CGC').mask(mask, options)
	// 	}
	// });
}

function loadProvider(codigo, loja) {
	let branch = $('#branch').val();
	let company = $('#company').val();

	// Recupera todos os campos do formulário
	let fields = $('[name^="A2_"]').map((i, e) => e.name).toArray();

	// // Pesquisa por todas as informações diretamente do Protheus
	// let dsConsulta = DatasetFactory.getDataset("ds_protheus_consulta", null, [
	// 	DatasetFactory.createConstraint('table', 'SA2', null, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('cod', codigo, null, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('loja', loja, null, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('branch', branch, null, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('company', company, null, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('fields', fields, null, ConstraintType.MUST)
	// ], null);

	FLUIGC.loading(window).show();
	buscarRegistros("ds_protheus_consulta", [
		createConstraint('table', 'SA2'),
		createConstraint('cod', codigo),
		createConstraint('loja', loja),
		createConstraint('branch', branch),
		createConstraint('company', company),
		createConstraint('fields', fields)
	], true)
	.then(function(result){
		applyDatasetFields(result.content);
		filterZoomBranch($('#company').val(), $('#company').val());
		initMask();
		atribuiValoresReadOnly();
		FLUIGC.loading(window).hide();
	})
	.catch(function(error){
		FLUIGC.loading(window).hide();
		console.error(error);
		FLUIGC.toast({
			title: 'Erro: ',
			message: 'Ocorreu um erro ao carregar o registro selecionado',
			type: 'danger'
		});
	});
}

function applyDatasetFields(dataset) {
	const isDate = input => input.attr('type') === 'date';
	const isZoom = input => input.is('.select2-hidden-accessible') || input.attr('data-zoom');
	const isSelect = input => input.is('select');
	
	const fillInput = (field, value) => {
		const input = $('#' + field);

		if (isZoom($('[name="zoom_' + $(input).attr('name') + '"]'))) {
			if ($('#zoom_' + field).attr('readonly')) {
				$('#zoom_' + field).val(value);
			} else {
				window['zoom_' + field].setValue(value);
			}
			input.val(value);
		} else if(isSelect(input)){
			input
			.val(value)
			.next()
			.val(
				input.find('option:selected').text()
			)
		} else {
            if (isDate(input)) {
                value = [value.slice(0, 4), '-', value.slice(4, 6), '-', value.slice(6, 8)].join('');
            }
			input.val(value).trigger('input');
		}
    }

	for (let i = 0; i < dataset.columns.length; i++) {
		let field = dataset.columns[i];
        let value = dataset.values[0][field];
		if (value) fillInput(field, value);
	}
}

function forceKeyPressUppercase(e) {
	const charInput = e.keyCode;
	if ((charInput >= 97) && (charInput <= 122)) { // Lowercase
		if (!e.ctrlKey && !e.metaKey && !e.altKey) { // Não é modificador
			const newChar = charInput - 32;
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
			e.target.setSelectionRange(start + 1, start + 1);
			e.preventDefault();
		}
	}
}

function setUppercaseFields(fieldIdArray) {
	fieldIdArray.forEach(fieldId => {
		document
			.getElementById(fieldId)
			.addEventListener('keypress', forceKeyPressUppercase, false);
	});
}


function forceKeyPressSpaceless(e) {
	// e.target.value = e.target.value.replace(/ /g, '');
	const charInput = e.keyCode;
	if (charInput == 32) { // Lowercase
		if (!e.ctrlKey && !e.metaKey && !e.altKey) { // Não é modificador
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			e.target.value = e.target.value.substring(0, start) + e.target.value.substring(end);
			e.target.setSelectionRange(start + 1, start + 1);
			e.preventDefault();
		}
	}
}

function forceChangeSpaceless(e) {
	e.target.value = e.target.value.replace(/ /g, '');
}

function setSpacelessFields(fieldIdArray) {
	fieldIdArray.forEach(fieldId => {
		document
			.getElementById(fieldId)
			.addEventListener('keypress', forceKeyPressSpaceless, false);
		document
			.getElementById(fieldId)
			.addEventListener('change', forceChangeSpaceless, false);
	});
}

function atribuiValoresReadOnly(){
	// atribuindo valores READONLY para consulta no contabil
	const COD_FORNECEDOR_READONLY = $('#A2_COD').val();
	const LOJA_READONLY = $('#A2_LOJA').val();
	const NOME_READONLY = $('#A2_NOME').val();
	const CNPJ_READONLY = $('#A2_CGC').val();

	$('#COD_FORNECEDOR_READONLY').val(COD_FORNECEDOR_READONLY);
	$('#LOJA_READONLY').val(LOJA_READONLY);
	$('#NOME_READONLY').val(NOME_READONLY);
	$('#CNPJ_READONLY').val(CNPJ_READONLY);
}