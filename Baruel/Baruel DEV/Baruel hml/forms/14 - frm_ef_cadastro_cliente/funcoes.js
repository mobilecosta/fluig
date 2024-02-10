/**
 * Filtra todos os campos "zoom" com a empresa e a filial
 * selecionadas no campo "#branch"
 */
let filterZoomBranch = function () {
	let company = $('#company').val();
	let branch = $('#branch').val()[0].split(' | ')[0];

	if (branch.length) branch = branch[0];

	let zoomList = $('select.select2-hidden-accessible')
		.not('#branch, #company')
		.toArray()
		.map(function (zoom) {
			return zoom.name
		});

	zoomList.forEach(function (zoom) {
		if (zoom.includes("COD_MUN")) {
			var state = $('#A1_EST').val();
			var constraint = 'EMPRESA___EST';
			var filter = constraint + ',' + company + "___" + state;


			console.log(filter);

			reloadZoomFilterValues(zoom, filter);
		} else {
			var constraint = 'EMPRESA';
			var filter = constraint + ',' + company;

			reloadZoomFilterValues(zoom, filter);
		}
	});
}

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

/**
 * Aplica as máscaras de input
 */
let inputMasks = function () {
	$('#A1_CEP').mask('00000-000', { reverse: false });
	$('#A1_CEPC').mask('00000-000', { reverse: false });
	$('#A1_DESCFI').mask('00.00', { reverse: true });
	$('#A1_XPRZENT').mask('000').on('change', function () {
		this.value = this.value < 1 ? 1 : this.value;
	});

	// Adm/Fin
	$("#A1_LC").mask('000.000.000,99', { reverse: true });

	// Fiscais
	$('#A1_PERCATM').mask('00.00', { reverse: true });
	$('#A1_PERFECP').mask('00.00', { reverse: true });

	// Máscara CPF/CNPJ
	let cgc = $('#A1_CGC').val() ? $('#A1_CGC').val() : $('#A1_CGC').text();
	let cgcMask = cgc.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009';
	$('#A1_CGC').mask(cgcMask, {
		onKeyPress: function (cgc, e, field, options) {
			const masks = ['000.000.000-009', '00.000.000/0000-00'];
			const digits = cgc.replace(/[^0-9]/g, "").length;
			const mask = digits <= 11 ? masks[0] : masks[1];
			$('#A1_CGC').mask(mask, options)
		}
	});
}

function setSelectedZoomItem(item) {
	const customZoomNames = getCustomZoomNames();

	// Atribui o valor correto (chave primária) ao campo escondido
	if (customZoomNames.indexOf(item.inputName) > -1) {
		const hiddenInputName = item.inputName.replace('zoom_', '');
		const hiddenInput = $('[name="' + hiddenInputName + '"]');

		if (item.inputName == 'zoom_A1_FILTRF') {
			const pkField = 'Indices';
			const filial = JSON.parse(item[pkField])['Code'];
			hiddenInput.val(filial);

		} else {
			const pkField = hiddenInput.attr('data-pkfield');
			hiddenInput.val(item[pkField]);
		}
	}

	switch (item.inputName) {
		case "zoom_A1_COD_MUN":
			$('#A1_MUN').val(item['CC2_MUN']);
			break;

		case 'zoom_branch':
			let items = JSON.parse(item["Indices"]);
			$('#company').val(items['EnterpriseGroup']);
			$('#company_desc').val(items['Title']);
			$('#branch_desc').val(items['Description']);
			$('#zoom_A1_FILTRF').val(items['Code']);
			$('#A1_FILTRF').val(items['Code']);

			// let result = DatasetFactory.getDataset('ds_protheus_ultimo_registro', null, [
			// 	DatasetFactory.createConstraint('Empresa', items['EnterpriseGroup'], null, ConstraintType.MUST),
			// 	DatasetFactory.createConstraint('Filial', items['Code'], null, ConstraintType.MUST),
			// 	DatasetFactory.createConstraint('AliasMk', 'SA1', null, ConstraintType.MUST),
			// 	DatasetFactory.createConstraint('Opcao', '1', null, ConstraintType.MUST),
			// 	DatasetFactory.createConstraint('CampoChave', 'A1_COD', null, ConstraintType.MUST),
			// ], null);

			FLUIGC.loading(window).show();
			buscarRegistros("ds_protheus_ultimo_registro", [
				createConstraint('Empresa', items['EnterpriseGroup']),
				createConstraint('Filial', items['Code']),
				createConstraint('AliasMk', 'SA1'),
				createConstraint('Opcao', '1'),
				createConstraint('CampoChave', 'A1_COD')
			], true)
				.then(function (result) {
					let content = result.content

					if (content.values || content.values.length > 0 && content.values[0]['status'] == 'OK') {
						$('#A1_COD').val(content.values[0]['result']);
						FLUIGC.loading(window).hide();
					} else {
						FLUIGC.toast({
							title: 'Erro: ',
							message: 'Dados não encontrados ao consultas o dataset: ds_protheus_ultimo_registro',
							type: 'danger'
						});
						FLUIGC.loading(window).hide();
					}
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
			setDefaultValue('A1_DDI', '55', '55 | BRASIL');
			setDefaultValue('A1_CONTA', '1120103001', '1120103001');
			setDefaultValue('A1_NATUREZ', '200101', '200101');
			setDefaultValue('A1_PAIS', '105', '105 | BRASIL');
			setDefaultValue('A1_CODPAIS', '01058', '01058 | BRASIL');
			break;

		case 'zoom_A1_VEND':
			console.log(item);
		break;
		default:
			break;
	}
}

function removedZoomItem(item) {
	const customZoomNames = getCustomZoomNames();

	// Remove o valor do campo escondido
	if (customZoomNames.indexOf(item.inputName) > -1) {
		const hiddenInputName = item.inputName.replace('zoom_', '');
		const hiddenInput = $('[name="' + hiddenInputName + '"]');
		hiddenInput.val('');
	}

	switch (item.inputName) {
		case "zoom_A1_COD_MUN":
			$('#A1_MUN').val('');
			break;

		case 'branch':
			$('#company').val('');
			$('#company_desc').val('');
			$('#branch_desc').val('');
			break;

		default:
			break;
	}
}

function defaultValues() {
	const date = new Date();
	const today = date.getFullYear().toString() + '-'
		+ (date.getMonth() + 1).toString().padStart(2, 0) + '-'
		+ date.getDate().toString().padStart(2, 0);

	$('#A1_CADAST').val(today);
}

function checkClient() {
	const cgcField = $('#A1_CGC');
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
	const dsConsulta = DatasetFactory.getDataset('ds_protheus_consulta_sa1_mirror', null, [
		DatasetFactory.createConstraint('EMPRESA', company, company, ConstraintType.MUST),
		DatasetFactory.createConstraint('A1_CGC', cgc, cgc, ConstraintType.MUST),
	], null);

	// Se o produto não foi encontrado, retorna
	if (!dsConsulta || !dsConsulta.values || !dsConsulta.values.length || dsConsulta.values[0].errorCode) {
		return FLUIGC.toast({
			title: '',
			message: 'Código ' + cgc + ' disponível',
			type: 'success'
		});;
	}

	const { A1_COD, A1_NOME } = dsConsulta.values[0];

	FLUIGC.toast({
		title: 'Atenção!',
		message: 'O CNPJ informado já foi utilizado no cliente ' + A1_COD + ' - ' + A1_NOME,
		type: 'danger'
	});

	cgcField.val('').focus();

}

async function GetCEP(param, item) {

	if (param.length != 9) {
		FLUIGC.toast({
			title: 'CEP: ',
			message: 'Por favor digite um CEP válido.',
			type: 'warning'
		});
	} else {
		await fetch(`https://viacep.com.br/ws/${param}/json/`).then(res => res.json()).then(async data => {
			if (data.logradouro == undefined) {
				FLUIGC.toast({
					title: 'CEP: ',
					message: 'Por favor digite um CEP válido.',
					type: 'warning'
				});

			} else {

				if (item === 'A1_CEP') {
					$('#A1_END').val((data.logradouro).toUpperCase());
					$('#A1_EST').val(data.uf);
					filterZoomBranch($('#company').val(), $('#company').val());
					$('#A1_MUN').val(data.localidade);
					$('#A1_BAIRRO').val((data.bairro).toUpperCase());
				}
				if (item === 'A1_CEPC') {
					$('#A1_ENDCOB').val((data.logradouro).toUpperCase());
					$('#A1_ESTC').val(data.uf);
					$('#A1_MUNC').val(data.localidade);
				}
			};
		});
	}
};

async function GetCNPJ(param) {

	if (param.length == 18) {
		param = param.match(/\d/g).join("");
		await fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${param}`).then(res => res.json()).then(async data => {

			console.log(data);
			let cep = data.CEP.replace(/^([\d]{5})-*([\d]{3})/, "$1-$2");
			$('#A1_CEP').val(cep);
			GetCEP(cep, 'A1_CEP');
			$('#A1_NOME').val(data['RAZAO SOCIAL']);
			$('#A1_NOME_READONLY').val(data['RAZAO SOCIAL']);
			$('#A1_TEL').val(data.TELEFONE);
			$('#A1_EMAIL').val(data.EMAIL);
			$('#A1_DDD').val(data.DDD);

		});
	}
};
