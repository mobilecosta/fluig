/**
 * Máscaras
 */
function inputMasks() {
	// P&D
	$('#B1_CONV').mask('00.00');

	// Fiscal
	$('#B1_PICMENT').mask('000.00');
	$('#B1_PICMRET').mask('000.00');
}

/**
 * Mostra os erro da última tentativa de integração (se houver)
 */
function showError() {
	var err = $('#erro').val();

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

/**
 * Filtra todos os campos "zoom" com a empresa e a filial
 * selecionadas no campo "#branch"
 */
function filterZoomBranch() {
	var company = $('#company').val();
	var zoomList = $('select.select2-hidden-accessible')
		.not('#zoom_branch, #consulta_sb1')
		.toArray()
		.map(zoom => zoom.name);

	var filter = 'EMPRESA,' + company;

	zoomList.forEach(function (zoom) {
		reloadZoomFilterValues(zoom, filter);
	});

	try {
		reloadZoomFilterValues('consulta_sb1', 'EMPRESA,' + $('#company').val());
	} catch (error) {
		console.log('Consulta de produtos readonly');
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
		case 'consulta_sb1':
			loadProduct(selectedItem['B1_COD'], function (result, dsConsulta) {
				if (result) {
					$('#editProduct').prop('checked', true);
					$('#B1_COD').attr('readonly', true);
					applyDatasetFields(dsConsulta);
					FLUIGC.toast({
						title: 'Sucesso!',
						message: 'Produto encontrado, carregando todos os campos...',
						type: 'success'
					});
				} else {
					FLUIGC.toast({
						title: 'Erro:',
						message: 'Houve um erro ao carregar este produto',
						type: 'danger'
					});
				}
				FLUIGC.loading(window).hide();
			})
			break;

		case 'zoom_branch':
			let item = JSON.parse(selectedItem["Indices"]);
			var company = item['EnterpriseGroup'];
			var branch = item['Code'];
			var companyDescription = item['Title'];
			var branchDescription = item['Description'];

			$('#branch').val(branch);
			$('#company').val(company);
			$('#company_desc').val(companyDescription);
			$('#branch_desc').val(branchDescription);

			filterZoomBranch();
			break;

		case 'zoom_B1_TNATREC':
			$('#B1_CNATREC').val(selectedItem['CCZ_COD']);
			break;

		case 'zoom_B1_TIPO':

			if (selectedItem['TODO'] == "PA | PRODUTO ACABADO") {

				$('#zoom_B1_LOCPAD').val('01 | ESTOQUE ATUAL');
				$('#B1_LOCPAD').val('01');
				document.getElementById('B1_TIPOCQ').selectedIndex = 2;
				document.getElementById('B1_CONTRAT').selectedIndex = 2;
				$('#zoom_B1_CONTA').val('1140101001 | PRODUTO ACABADO | 2');
				$('#B1_CONTA').val('1140101001');
				$('#zoom_B1_CONTA2').val('1140102001 | PODER DE TERCEIRO PRODUTO ACABADO | 2');
				$('#B1_CONTA2').val('1140102001');

			} else if (selectedItem['TODO'] == "PP | PROD EM PROCESSO") {

				document.getElementById('B1_CONTRAT').selectedIndex = 2;
				$('#zoom_B1_CONTA').val('1140101004 | PRODUTO EM PROCESSO | 2');
				$('#B1_CONTA').val('1140101004');
				$('#zoom_B1_CONTA2').val('1140102005 | PODER DE TERCEIRO PRODUTO EM PROCESSO | 2');
				$('#B1_CONTA2').val('1140102005');

			} else if (selectedItem['TODO'] == "MP | MATERIA PRIMA") {

				$('#zoom_B1_LOCPAD').val('95 | ARMAZEM PRODUCAO');
				$('#B1_LOCPAD').val('95');
				document.getElementById('B1_TIPOCQ').selectedIndex = 2;
				$('#zoom_B1_CONTA').val('1140101005 | MATERIA PRIMA | 2');
				$('#B1_CONTA').val('1140101005');
				$('#zoom_B1_CONTA2').val('1140102002 | PODER DE TERCEIRO MATERIA PRIMA | 2');
				$('#B1_CONTA2').val('1140102002');

			} else if (selectedItem['TODO'] == "ME | MAT DE EMBALAGEM") {

				$('#zoom_B1_LOCPAD').val('95 | ARMAZEM PRODUCAO');
				$('#B1_LOCPAD').val('95');
				document.getElementById('B1_TIPOCQ').selectedIndex = 2;
				$('#zoom_B1_CONTA').val('1140101006 | MATERIAL DE ACOND./EMBALAGEM | 2');
				$('#B1_CONTA').val('1140101006');
				$('#zoom_B1_CONTA2').val('1140102003 | PODER DE TERCEIRO MATERIAL DE ACOND./EMB | 2');
				$('#B1_CONTA2').val('1140102003');

			} else if (selectedItem['TODO'] == "SA | SEMI ACABADO") {

				$('#zoom_B1_LOCPAD').val('01 | ESTOQUE ATUAL');
				$('#B1_LOCPAD').val('01');
				document.getElementById('B1_TIPOCQ').selectedIndex = 2;
				$('#zoom_B1_CONTA').val('1140101003 | PRODUTO SEMI-ACABADO | 2');
				$('#B1_CONTA').val('1140101003');
				$('#zoom_B1_CONTA2').val('1140102004 | PODER DE TERCEIRO SEMI ACABADO | 2');
				$('#B1_CONTA2').val('1140102004');

			} else if (selectedItem['TODO'] == "MS | MAT SECUNDARIO") {

				$('#zoom_B1_LOCPAD').val('95 | ARMAZEM PRODUCAO');
				$('#B1_LOCPAD').val('95');
				$('#zoom_B1_CONTA').val('1140101007 | MATERIAL SECUNDARIO | 2');
				$('#B1_CONTA').val('1140101007');
				$('#zoom_B1_CONTA2').val('1140102006 | PODER DE TERCEIRO MATERIAL SECUNDARIO | 2');
				$('#B1_CONTA2').val('1140102006');

			} else {

				$('#zoom_B1_LOCPAD').val('');
				$('#B1_LOCPAD').val('');
				document.getElementById('B1_TIPOCQ').selectedIndex = 0;
				document.getElementById('B1_CONTRAT').selectedIndex = 1;
				$('#zoom_B1_CONTA').val('');
				$('#B1_CONTA').val('');
				$('#zoom_B1_CONTA2').val('');
				$('#B1_CONTA2').val('');

			}
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
		case 'consulta_sb1':
			clearAllInputs();
			$('#editProduct').prop('checked', false);
			$('#B1_COD').attr('readonly', false);
			break;

		case 'zoom_branch':
			$('#branch').val('');
			$('#company').val('');
			$('#company_desc').val('');
			$('#branch_desc').val('');
			break;

		case 'zoom_B1_TNATREC':
			$('#B1_CNATREC').val('');
			break;

		default:
			break;
	}
}

function loadProduct(cod, callback) {
	FLUIGC.loading(window).show();
	if (!cod) callback(false);

	var company = $('#company').val();
	var branch = $('#branch').val();

	if (!branch) {
		$('#B1_COD').val('');
		window['consulta_sb1'].clear();
		$('#editProduct').prop('checked', false);
		FLUIGC.toast({
			title: '',
			message: 'Por favor, selecione uma filial primeiro',
			type: 'warning'
		});
		callback(false);
	}

	branch = Array.isArray(branch) ? branch[0] : branch;

	// Recupera todos os campos B1 do formulário
	var allFields = $('[name^="B1_"]').map((i, e) => e.name).toArray()
	// var defaultFields = allFields.filter(name => name[3] !== 'X');
	// var customFields = allFields.filter(name => name[3] === 'X');

	const takingTooLong = setTimeout(() => {
		FLUIGC.toast({
			title: 'Houve um problema inesperado na conexão, causando uma demora maior que o normal.<br>',
			message: 'Recomendamos que recarregue a página e tente novamente.',
			type: 'warning',
			timeout: 'slow'
		});
		FLUIGC.loading(window).hide();
	}, 10000);

	buscarRegistros("ds_protheus_consulta", [
		createConstraint('table', 'SB1'),
		createConstraint('cod', cod),
		createConstraint('branch', branch),
		createConstraint('company', company),
		createConstraint('fields', allFields)
	], true)
		.then(function (result) {
			clearTimeout(takingTooLong);
			let dsConsulta = result.content;

			if (!dsConsulta.values || !dsConsulta.values.length || dsConsulta.values[0].errorCode) {

				return callback(false);
			}




			filterZoomBranch($('#company').val(), $('#branch').val());
			callback(true, dsConsulta);
			FLUIGC.loading(window).hide();
		})
		.catch(function (result) {
			console.error("Ocorreu um erro durante o carregamento do produto")
			callback(false);
			FLUIGC.loading(window).hide();
		})

	// // Pesquisa por todas as informações do produto diretamente do Protheus
	// var dsConsulta = DatasetFactory.getDataset('ds_protheus_consulta', null, [
	// 	DatasetFactory.createConstraint('table', 'SB1', 'SB1', ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('company', company, company, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('branch', branch, branch, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('cod', cod, cod, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('fields', defaultFields, defaultFields, ConstraintType.MUST)
	// ], null);

	// // Se o produto não foi encontrado, retorna
	// if (!dsConsulta.values || !dsConsulta.values.length || dsConsulta.values[0].errorCode) {
	// 	FLUIGC.toast({
	// 		title: 'Erro:',
	// 		message: 'Houve um erro ao carregar este produto',
	// 		type: 'success'
	// 	});
	// 	return false;
	// }

	// FLUIGC.toast({
	// 	title: 'Sucesso!',
	// 	message: 'Produto encontrado',
	// 	type: 'success'
	// });

	// applyDatasetFields(dsConsulta);
	// filterZoomBranch($('#company').val(), $('#branch').val());

	// var dsConsultaCustom = DatasetFactory.getDataset('ds_protheus_consulta', null, [
	// 	DatasetFactory.createConstraint('table', 'SB1', 'SB1', ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('company', company, company, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('branch', branch, branch, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('cod', cod, cod, ConstraintType.MUST),
	// 	DatasetFactory.createConstraint('fields', customFields, customFields, ConstraintType.MUST)
	// ], null);

	// if (!dsConsultaCustom.values || !dsConsultaCustom.values.length || dsConsultaCustom.values[0].errorCode) {
	// 	FLUIGC.toast({
	// 		title: 'Atenção:',
	// 		message: 'Um ou mais campos customizados não configurados para a empresa atual',
	// 		type: 'warning'
	// 	});

	// 	return true;
	// }

	// applyDatasetFields(dsConsultaCustom);
	// return true;
}

function applyDatasetFields(dataset) {
	const isHidden = input => input.attr('type') === 'hidden';
	const isDate = input => input.attr('type') === 'date';
	const isZoom = input => input.is('.select2-hidden-accessible');
	const isSelect = input => input.is('select');

	const fillInput = (field, value) => {
		const input = $('#' + field);

		if (isZoom(input)) {
			window[field].setValue(value);
		} else {
			if (isHidden(input)) {
				try {
					const zoomReadonly = 'zoom_' + field;
					if (!$('#' + zoomReadonly).is('[readonly]'))
						window[zoomReadonly].setValue(value);
					else
						$('#' + zoomReadonly).val(value);
				} catch (error) {
					console.log(error);
				}
			} else if (isDate(input)) {
				value = [
					value.slice(0, 4), '-',
					value.slice(4, 6), '-',
					value.slice(6, 8)
				].join('');
			} else if (isSelect(input)) {
				input
					.val(value)
					.next()
					.val(
						input.find('option:selected').text()
					)
			}
			input.val(value).trigger('input');
		}
	}

	for (let i = 0; i < dataset.columns.length; i++) {
		const field = dataset.columns[i];
		const value = dataset.values[0][field];
		if (value) fillInput(field, value);
	}
}

function clearAllInputs() {
	$('#dynamicContents').find('input, select').val('');
	$('select.select2-hidden-accessible')
		.not('#zoom_branch, #consulta_sb1')
		.toArray()
		.forEach(zoom => {
			window[zoom.name].clear();
		})
}

function testCustomFields(B1_COD, company, branch = '01') {
	var customFields = $('[name^="B1_"]').map((i, e) => e.name).toArray().filter(name => name[3] === 'X');

	console.log('[Teste de campos customizados] --- INICIO');
	for (var i = 0; i < customFields.length; i++) {
		var field = customFields[i];
		var dsCustomFields = DatasetFactory.getDataset('ds_protheus_consulta', null, [
			DatasetFactory.createConstraint('table', 'SB1', 'SB1', ConstraintType.MUST),
			DatasetFactory.createConstraint('company', company, company, ConstraintType.MUST),
			DatasetFactory.createConstraint('branch', branch, branch, ConstraintType.MUST),
			DatasetFactory.createConstraint('cod', B1_COD, B1_COD, ConstraintType.MUST),
			DatasetFactory.createConstraint('fields', [field], [field], ConstraintType.MUST)
		], null);
		if (!dsCustomFields.values || !dsCustomFields.values.length || dsCustomFields.values[0].errorCode) {
			console.warn(`[Empresa ${company}] Não encontrado em SB1: ${field}`);
		} else {
			console.log(`[Empresa ${company}] Encontrado em SB1: ${field}`);
		}
	}
	console.log('[Teste de campos customizados] --- FIM');
}

function forceDisableZoom(zoom, disable) {
	try {
		window[zoom].disable(disable);
	} catch (e) {
		setTimeout(function () {
			forceDisableZoom(zoom, disable);
		}, 1000);
	}
}

function checkEditMode() {
	const editMode = $('#editProduct').prop('checked');

	if (!editMode) {
		$('#B1_X_EXPO')
			.hide()
			.parent()
			.append(`<input type="text" class="form-control" readonly value="${$('#B1_X_EXPO option:selected').text()}">`);

		forceDisableZoom('consulta_sb1', true);
	}
}

function modalOpcionais(B1_COD, EMPRESA, FILIAL) {
	const modalContent = `
		<div class="col-md-2">
			<label for="nivel"><b>Nível</b></label>
			<input type="text" class="form-control" name="nivel" id="nivel" readonly>
		</div>
		<div class="col-md-10">
			<label for="valor"><b>Valor</b></label>
			<input type="text" class="form-control" name="valor" id="valor" readonly>
		</div>
		<table class="table" id="table-opc">
			<thead>
				<th></th>
				<th></th>
				<th></th>
			</thead>
			<tbody></tbody>
		</table>
	`;

	// Abre o modal
	const modal = FLUIGC.modal({
		title: 'Opcionais',
		content: modalContent,
		id: 'modal-opc',
		size: 'large',
		actions: [{
			label: 'OK'
		}, {
			label: 'Fechar',
			autoClose: true
		}]
	}, err => {
		if (err) return console.error(err);

		// Mostra o carregamento do modal
		const modalLoading = FLUIGC.loading('#modal-opc');
		modalLoading.show();

		// Carrega a estrutura
		getDataset('ds_protheus_consulta_estrutura', [
			createConstraint("cod", B1_COD),
			createConstraint("branch", FILIAL),
			createConstraint("company", EMPRESA)
		], result => {
			modalLoading.hide();
			console.log(result);

			let estrutura;

			try {
				estrutura = JSON.parse(result.content.values[0].result)['Registros'];
			} catch (error) {
				return FLUIGC.toast({
					title: 'Erro:',
					message: 'Houve um problema inesperado na conexão. te novamente.',
					type: 'danger'
				});
			}

			if (!estrutura.length) {
				return FLUIGC.toast({
					title: 'Erro:',
					message: 'Este produto não possui estrutura cadastrada.',
					type: 'warning',
					timeout: 'slow'
				});
			}

			const levelField = $('#modal-opc #nivel');
			levelField.val('1');

			let selections = [];
			let currentLevel = 1;
			let currentComp;

			const getSelectionsValue = () => selections.map((selection, i) => {
				const group = selection[0];
				const item = selection[1].padEnd(15, ' ');
				return i === 0 ? parseInt(group).toString() + ' ' + item : group + item;
			}).join('/');

			const isAvailable = endDate => {
				const year = endDate.slice(0, 4);
				const month = endDate.slice(4, 6);
				const day = endDate.slice(6, 8);
				const now = Date.now();
				const end = new Date(`${year}-${month}-${day}`).valueOf();
				return end >= now;
			};

			// Renderiza um novo grupo de componentes selecionáveis por nível
			const renderNewLevel = (level, G1_COD) => {
				levelField.val(level);

				// Filtros de componentes por nível
				const firstLevelFilter = item => item['NIVEL'] == level && item['G1_GROPC'] && item['G1_OPC'];
				const higherLevelsFilter = item => firstLevelFilter(item) && item['G1_COD'] == G1_COD;
				const currentFilter = G1_COD ? higherLevelsFilter : firstLevelFilter;

				// Apaga o corpo anterior da tabela
				$('#modal-opc #table-opc tbody').html('');

				// Itera sobre os componentes filtrados e adiciona-os à tabela do modal
				const levelComps = estrutura.filter(currentFilter);

				const distinct = (value, index, self) => self.indexOf(value) === index;
				const levelGroups = levelComps.map(item => item.G1_GROPC).filter(distinct);

				levelGroups.forEach(group => {
					const DESCGROPC = estrutura.filter(item => item.G1_GROPC == group)[0].DESCGROPC;
					const tr = $('<tr class="opc-table-row">');
					tr.append(`<td></td><td>${group}</td><td>${DESCGROPC}</td>`);
					tr.addClass('group-header');
					$('#modal-opc #table-opc tbody').append(tr);

					levelComps.filter(item => item.G1_GROPC == group).forEach(item => {
						const G1_GROPC = item['G1_GROPC'];
						const G1_OPC = item['G1_OPC'];
						const DESCOPC = item['DESCOPC'];
						const G1_FIM = item['G1_FIM '];

						const available = isAvailable(G1_FIM);

						const tr = $('<tr class="opc-table-row">');
						const disabled = !available ? 'disabled' : '';
						tr.append(`<td><input type="checkbox"${disabled} data-gropc="${G1_GROPC}" data-opc="${G1_OPC}"" /></td>`);
						tr.append(`<td>${G1_OPC}</td>`);
						tr.append(`<td>${DESCOPC}</td>`);

						if (available) {
							tr.addClass('selectable');
						} else {
							tr.addClass('blocked');
						}

						$('#modal-opc #table-opc tbody').append(tr);
					});
				});

				// Não há componentes neste nível
				if (!levelComps.length) {
					$('#modal-opc .modal-body').append('<h3>Não há mais componentes neste nível</h3>');
				}
			}

			// const save = () => {
			// 	$('#B1_OPC').val(getSelectionsValue());
			// 	modal.remove();
			// }

			const getChildren = (level, comp) => estrutura.filter(item => item.NIVEL == level + 1 && item.G1_COD == comp);
			const hasChildren = (level, comp) => getChildren(level, comp).length > 0;
			const getCorrectComp = (level, comp) => {
				let availableComps = estrutura.filter(item => {
					return item.NIVEL == level && isAvailable(item['G1_FIM ']) && hasChildren(item.NIVEL, item.G1_COMP)
				});
				if (comp) availableComps = availableComps.filter(item => item.G1_COD == comp);
				return availableComps.length ? availableComps[0].G1_COMP : null;
			};

			const saveButton = $('#modal-opc .modal-footer .btn-primary');
			const closeButton = $('#modal-opc .modal-footer .btn-default');

			saveButton.on('click', () => {
				const checkedBoxes = $('#modal-opc .modal-body table input[type="checkbox"]:checked');

				if (checkedBoxes.length) {
					const valueField = $('#modal-opc #valor');

					checkedBoxes.each((i, checkbox) => {
						const G1_GROPC = $(checkbox).attr('data-gropc');
						const G1_OPC = $(checkbox).attr('data-opc');

						selections.push([String(G1_GROPC), String(G1_OPC)]);
						valueField.val(getSelectionsValue());
					})

					const comp = getCorrectComp(currentLevel, currentComp);
					currentComp = comp;
					renderNewLevel(++currentLevel, comp);
				} else {
					save();
				}
			});

			closeButton.on('click', () => {
				save();
			})

			renderNewLevel(currentLevel);

		}, error => {
			modalLoading.hide();
			console.error(error);

			const saveButton = $('#modal-opc .modal-footer .btn-primary');
			saveButton.text('Apagar Valor Antigo');
			// saveButton.on('click', () => $('#B1_OPC').val(''));

			return FLUIGC.toast({
				title: 'Erro:',
				message: 'Houve um problema inesperado na conexão. Por favor, tente novamente.',
				type: 'warning',
				timeout: 'slow'
			});
		});
	});
}

function getDataset(dataset, constraints, success, error) {
	constraints = constraints ? constraints : [];

	return $.ajax({
		url: "/api/public/ecm/dataset/datasets",
		type: "POST",
		dataType: "JSON",
		contentType: "application/json",
		data: JSON.stringify({
			"name": dataset,
			"constraints": constraints
		}),
		success: success,
		error: error,
		timeout: 10000
	});
}

function createConstraint(nomeConstraint = "", valueConstraint = "") {
	return {
		"_field": nomeConstraint,
		"_initialValue": valueConstraint,
		"_finalValue": valueConstraint,
		"_type": 1,
		"_likeSearch": false
	}
}

function checkProduct() {
	// Código do produto
	const B1_COD = $('#B1_COD');

	// Inicia a tela de carregamento
	FLUIGC.loading(window).show();

	// Feedback de carregamento
	FLUIGC.toast({
		title: '',
		message: `Procurando código no Protheus...`,
		type: 'info'
	});

	// Carrega o produto
	loadProduct(B1_COD.val(), function (alreadyExists) {
		// Esconde a tela de carregamento
		FLUIGC.loading(window).hide();

		// Se já existe, impede o usuário de prosseguir com o código
		if (alreadyExists) {
			FLUIGC.toast({
				title: 'Atenção:',
				message: `O código ${B1_COD.val()} já está cadastrado.`,
				type: 'warning'
			});
			B1_COD.val('');
		} else {
			FLUIGC.toast({
				title: 'Sucesso:',
				message: `O código ${B1_COD.val()} está disponível!`,
				type: 'success'
			});
		}
	})
}

let ZOOM = {
	interval: {},
	callbacks: {},
	isReady: function (zoomId) {
		return window[zoomId] != undefined && window[zoomId] != null && window[zoomId].open != null;
	}
	, execWhenReady: function (zoomId, callback) {
		ZOOM.interval[zoomId] = setInterval(function () {
			if (ZOOM.interval[zoomId] > 0 && ZOOM.isReady(zoomId)) {
				callback();
				ZOOM.clearInterval(zoomId);
			}
		});
	}
	, clearInterval: function (zoomId) {
		window.clearInterval(ZOOM.interval[zoomId]);
		ZOOM.interval[zoomId] = 0;
	}

}