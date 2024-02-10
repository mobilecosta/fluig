/**
 * Filtra todos os campos "zoom" com a empresa e a filial
 * selecionadas no campo "#branch"
 */
let filterZoomBranch = function () {
	let company = $('#company').val();

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
			let filter = constraint + ','
				+ company +
				"___" + state;

			reloadZoomFilterValues(zoom, filter);
		} else {
			let constraint = 'EMPRESA';
			let filter = constraint + ',' + company;

			reloadZoomFilterValues(zoom, filter);
		}
	});
}

/**
 * Mostra os erro da última tentativa de integração (se houver)
 */
function showError() {
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

function setSelectedZoomItem(selectedItem) {
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

		case "A2_CLIENTE":
			$('#A2_LOJCLI').val(selectedItem['A1_LOJA']);
			break;

		case 'zoom_branch':
			let item = JSON.parse(selectedItem["Indices"]);
			$('#company').val(item['EnterpriseGroup']);
			$('#company_desc').val(item['Title']);
			$('#branch_desc').val(item['Description']);
			$('#branch').val(item['Code'])

			FLUIGC.loading(window).show();

			buscarRegistros("ds_protheus_ultimo_registro", [
				createConstraint('Empresa', item['EnterpriseGroup']),
				createConstraint('Filial', item['Code']),
				createConstraint('AliasMk', 'SA2'),
				createConstraint('Opcao', '1'),
				createConstraint('CampoChave', 'A2_COD')
			], true)
				.then(function (result) {
					let content = result.content

					if (content.values || content.values.length > 0 && content.values[0]['status'] == 'OK') {
						$('#A2_COD').val(content.values[0]['result']);
						$('#A2_COD_READONLY').val(content.values[0]['result']);
						FLUIGC.loading(window).hide();
					} else {
						FLUIGC.toast({
							title: 'Erro: ',
							message: 'Dados não encontrados ao consultas o dataset: ds_protheus_ultimo_registro',
							type: 'danger'
						});
						FLUIGC.loading(window).hide();
					}

					window['zoom_A2_DDI'].setValue("55 | BRASIL");
					window['zoom_A2_PAIS'].setValue("105 | BRASIL");

					filterZoomBranch();
				})
				.catch(function (error) {
					console.error(error);
					FLUIGC.loading(window).hide();
				});

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
			// Seleção automática de Cód. País do Fornecedor
			setDefaultValue('A2_PAIS', '105', '105 | BRASIL');
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

function removedZoomItem(removedItem) {
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

		case "A2_CLIENTE":
			$('#A2_LOJCLI').val('');
			break;

		case 'branch':
			$('#company').val('');
			$('#company_desc').val('');
			$('#branch_desc').val('');
			break;

		case "zoom_A2_BANCO":
			$('#A2_AGENCIA').val('');
			$('#A2_XAGENDV').val('');
			$('#A2_NUMCON').val('');
			$('#A2_XDIGCTA').val('');
			break;
	}
}

let inputMasks = function () {
	$('.cep').mask('00000-000', { reverse: false });
	$('.tel').mask('00000-0000', { reverse: false });

	// Máscara CPF/CNPJ
	let cgc = $('#A2_CGC').val() ? $('#A2_CGC').val() : $('#A2_CGC').text();
	let cgcMask = cgc.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009';
	$('#A2_CGC').mask(cgcMask, {
		onKeyPress: function (cgc, e, field, options) {
			const masks = ['000.000.000-009', '00.000.000/0000-00'];
			const digits = cgc.replace(/[^0-9]/g, "").length;
			const mask = digits <= 11 ? masks[0] : masks[1];
			$('#A2_CGC').mask(mask, options)
		}
	});
}

function checkSupplierCode() {
	let table = 'SA2';

	let codeField = $('#A2_COD');
	let code = codeField.val();

	let company = $('#company').val();
	let branch = $('#branch').val();

	if (code == '') return;

	if (!branch) {
		codeField.val('');
		return FLUIGC.toast({
			title: '',
			message: 'Por favor, selecione uma filial primeiro',
			type: 'warning'
		});
	}

	// Valor correto do zoom de filiais
	branch = branch.length ? branch[0] : branch;

	// Pesquisa por todas as informações diretamente do Protheus
	let dsConsulta = DatasetFactory.getDataset('ds_protheus_consulta', null, [
		DatasetFactory.createConstraint('table', table, table, ConstraintType.MUST),
		DatasetFactory.createConstraint('company', company, company, ConstraintType.MUST),
		DatasetFactory.createConstraint('branch', branch, branch, ConstraintType.MUST),
		DatasetFactory.createConstraint('cod', code, code, ConstraintType.MUST),
		DatasetFactory.createConstraint('fields', 'A2_COD', 'A2_COD', ConstraintType.MUST)
	], null);

	// Se o produto não foi encontrado, retorna
	if (!dsConsulta.values || !dsConsulta.values.length || dsConsulta.values[0].errorCode) {
		return FLUIGC.toast({
			title: '',
			message: 'Código ' + code + ' disponível',
			type: 'success'
		});;
	}

	FLUIGC.toast({
		title: 'Atenção!',
		message: 'Código ' + code + ' já cadastrado',
		type: 'danger'
	});

	codeField.val('').focus();

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

function checkProvider() {
	const cgcField = $('#A2_CGC');
	const cgc = cgcField.val().replace(/\D/g, '');

	const company = $('#company').val();
	const branch = $('#branch').val().split(' | ')[0];

	if (cgc == '') return;

	if (cgc.length != 11 && cgc.length != 14) {
		return FLUIGC.toast({
			title: '',
			message: 'Por favor, digite um CPF/CNPJ válido',
			type: 'warning'
		});
	}

	if (!branch) {
		cgcField.val('');
		return FLUIGC.toast({
			title: '',
			message: 'Por favor, selecione uma filial primeiro',
			type: 'warning'
		});
	}

	// Pesquisa por todas as informações diretamente do Protheus
	const dsConsulta = DatasetFactory.getDataset('ds_protheus_consulta_sa2_mirror', null, [
		DatasetFactory.createConstraint('EMPRESA', company, company, ConstraintType.MUST),
		DatasetFactory.createConstraint('A2_CGC', cgc, cgc, ConstraintType.MUST),
	], null);

	// Se o produto não foi encontrado, retorna
	if (!dsConsulta || !dsConsulta.values || !dsConsulta.values.length || dsConsulta.values[0].errorCode) {
		return FLUIGC.toast({
			title: '',
			message: 'Código ' + cgc + ' disponível',
			type: 'success'
		});;
	}

	const { A2_COD, A2_NOME } = dsConsulta.values[0];

	FLUIGC.toast({
		title: 'Atenção!',
		message: 'O CNPJ informado já foi utilizado no fornecedor ' + A2_COD + ' - ' + A2_NOME,
		type: 'danger'
	});

	cgcField.val('').focus();

}

async function GetCEP(param) {

	if (param.length != 9) {
		FLUIGC.toast({
			title: 'CEP: ',
			message: 'Por favor digite um CEP válido.',
			type: 'warning'
		});
	} else {
		await fetch(`https://viacep.com.br/ws/${param}/json/`).then(res => res.json()).then(async data => {
			console.log(data);
			if (data.logradouro == undefined) {
				FLUIGC.toast({
					title: 'CEP: ',
					message: 'Por favor digite um CEP válido.',
					type: 'warning'
				});

			} else {
				$('#A2_END').val((data.logradouro).toUpperCase());
				$('#A2_EST').val(data.uf);
				filterZoomBranch($('#company').val(), $('#company').val());
				$('#A2_MUN').val(data.localidade);
				$('#A2_BAIRRO').val((data.bairro).toUpperCase());
			};
		});
	}
};

async function GetCNPJ(param) {

	if (param.length == 18) {
		param = param.match(/\d/g).join("");
		await fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${param}`).then(res => res.json()).then(async data => {

			if (data.error) {
				FLUIGC.toast({
					title: 'CEP: ',
					message: data.error,
					type: 'warning'
				});
			} else {
				let cep = data.CEP.replace(/^([\d]{5})-*([\d]{3})/, "$1-$2");
				$('#A2_CEP').val(cep);
				GetCEP(cep);
				$('#A2_NOME').val(data['RAZAO SOCIAL']);
				$('#A2_NOME_READONLY').val(data['RAZAO SOCIAL']);
				$('#A2_TEL').val(data.TELEFONE);
				$('#A2_EMAIL').val(data.EMAIL);
				$('#A2_DDD').val(data.DDD);
				$('#A2_NREDUZ').val(data['NOME FANTASIA']);
			}
		});
	}
};


