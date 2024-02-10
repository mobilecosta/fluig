/**
 * Indica se está na atividade de correção.
 */
function isErrorState() {
	return getWKNumState() == getErrorState();
}

/**
 * Indica se está na atividade de preenchimento do formulário.
 */
function isFormFillState() {
	return getWKNumState() == getFormFillState();
}

/**
 * Mostra o grupo atual do fluxo do Easy Flow.
 */
function showGroup() {
	if (isErrorState()) {
		$('#mostraGrupoAtual').text('[Correção de Integração]');
	} else {
		const grupoAtual = $('#grupoAtual').val().split(':')[2];
		$('#mostraGrupoAtual').text(grupoAtual);
	}
}

/**
 * Função para exibir ou não os campos do formulário.
 */
function configureFields() {

	// Busca o ID do processo atual
	const processo = getWKDef();

	// Busca todos os formulários de campo relacionados ao processo atual
	const dsFields = DatasetFactory.getDataset('ds_ef_fields', null, [
		DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST),
		DatasetFactory.createConstraint('processId', processo, processo, ConstraintType.MUST),
	], null);

	// Percorre os documentos relacionados ao processo atual
	dsFields.values.forEach(doc => {

		// Busca as definições de campo relacionadas ao documento atual
		const dsFieldsTable = DatasetFactory.getDataset('ds_ef_fields', null, [
			DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST),
			DatasetFactory.createConstraint('tablename', 'table_campos_ativos', 'table_campos_ativos', ConstraintType.MUST),
			DatasetFactory.createConstraint('documentid', doc.documentid, doc.documentid, ConstraintType.MUST)
		], null);

		// Percorre as definições de campo
		dsFieldsTable.values.forEach(v => {
			let fieldName = 'div_' + v.nome;
			let fieldSize = v.tamanho;
			if (v.ativo != 'on') {
				$(`#${fieldName}`).hide();
			} else {
				$(`#${fieldName}`).addClass(`col-md-${fieldSize}`);
			}
		});
	});

	const textInputs = $('input:text');
	allowEnglishCharsOnly(textInputs);
	// capitalizeInputs(textInputs);
}

/**
 * Função para configurar as tabs e os modos de alteração.
 */
function enableTabs() {
	// Busca o ID do processo atual
	let processo = getWKDef();
	let grupoAtual = $('#grupoAtual').val().split(':')[2];

	// Se estiver na atividade de correção, mostra todas as abas
	if (isErrorState()) {
		$('#dynamicTabs li').show();
		$('#dynamicTabs li:first() a').click();
		return;
	}

	// Busca no formulário de parâmetros, os grupos configurados
	let dsParTabs = DatasetFactory.getDataset('ds_ef_par', null, [
		DatasetFactory.createConstraint('groupId', grupoAtual, grupoAtual, ConstraintType.MUST),
		DatasetFactory.createConstraint('processId', processo, processo, ConstraintType.MUST)
	], null);

	// Percorre os grupos que o usuário está cadastrado
	dsParTabs.values.forEach((par, idx) => {

		let dsTabs = DatasetFactory.getDataset('ds_ef_par', null, [
			DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST),
			DatasetFactory.createConstraint('tablename', 'table_parametros', 'table_parametros', ConstraintType.MUST),
			DatasetFactory.createConstraint('documentid', par.documentid, par.documentid, ConstraintType.MUST)
		], null);

		for (let i = 0; i < dsTabs.values.length; i++) {
			let v = dsTabs.values[i];
			let currentTab = $('#dynamicTabs a').filter(function () { return $(this).text() == v.nomeTab });
			
			if (i == 0) {
				currentTab.parent().show();
				if (idx == 0) {
					currentTab.click();
				}
			} else {
				currentTab.parent().show();
			}
			if (v.permissao == "L") {
				let tabId = currentTab.attr('href');
				$(tabId + ' input').attr('readonly', '');
				$(tabId + ' button').attr('disabled', '');

				$(tabId + ' select:not([type="zoom"])').each((i, select) => {
					let text = $(select).find('option:selected').text();
					$(select).hide().after(`<input type="text" class="form-control" value="${text}" readonly>`);
				});
			}
		}

	});

}

/**
 * Validação do formulário.
 */
function beforeSendValidate(numState, nextState) {
	// Inputs marcados cujos labels contêm '*'
	const requiredInputs = getCurrentRequiredFields();
	let errorMessage = '';

	for (let i = 0; i < requiredInputs.length; i++) {
		const inputName = requiredInputs[i];
		const input = $('[name="' + inputName + '"]');
		const label = input.siblings('label').text().replace('*', '');

		if (
			!input.val() && // Não foi preenchido
			!input.attr('readonly') && // Não é input readonly
			!input.attr('disabled') && // Não é select disabled
			input.css('display') != 'none' // Não está escondido
		) {
			if (errorMessage === '') {
				errorMessage += 'Por favor, preencha os campos obrigatório:\n';
			} 
			errorMessage += '- ' + label + ' (' + inputName + ')\n';
		}
	}

	if (errorMessage !== '') {
		throw errorMessage;
	}

	// Atualiza os grupos apenas se estiver na atividade de preenchimento
	if (isFormFillState()) switchToNextGroup();

	return true;
}

/**
 * Retorna uma lista de campos obrigatórios para o grupo atual.
 */
function getCurrentRequiredFields() {
	return $('#dynamicTabs a:visible')
		.map((i, a) => $(a.hash).find("label:contains('*')").toArray())
		.toArray()
		.flat()
		.map(label => label.htmlFor);
}

/**
 * Retorna uma lista de campos zoom que não pesquisam
 * pela chave primária.
 */
function getCustomZoomNames() {
	return $('[name^="zoom_"]')
		.toArray()
		.map(field => field.name);
}

/**
 * Permite apenas letras inglesas e alguns caracteres
 * especiais, mas não acentos.
 */
function allowEnglishCharsOnly(elem) {
	elem.keypress(function (event) {
		const charCode = event.which;

		if (charCode == 32)
			return true;
		if (48 <= charCode && charCode <= 57)
			return true;
		if (65 <= charCode && charCode <= 90)
			return true;
		if (97 <= charCode && charCode <= 122)
			return true;

		const char = String.fromCharCode(charCode);

		switch (char) {
			case ',':
			case '.':
			case ':':
			case ';':
			case '(':
			case ')':
			case '[':
			case ']':
			case '{':
			case '}':
			case '!':
			case '@':
			case '#':
			case '$':
			case '%':
			case '&':
			case '*':
			case '-':
			case '+':
			case '_':
			case '=':
			case '/':
			case '|':
				return true;
		
			default:
				return false;
		}
	});
}

/**
 * Obriga os caracteres do input a se tornarem maiúsculos.
 * @param {*} elem Input
 */
function capitalizeInputs(elem) {
	elem.keyup(function() {
        this.value = this.value.toLocaleUpperCase();
    });
}

/**
 * Realiza a troca de grupos. Antes feita no backend, certas limitações
 * impediam a lógica de ocorrer apenas ao "enviar" a tarefa. Não mais.
 */
function switchToNextGroup() {
	// Salva o estado original dos campos de controle de grupos
	var originalState = {
		grupoAtual: $("#grupoAtual").val(),
		proximoGrupo: $("#proximoGrupo").val(),
		gruposRestantes: $("#gruposRestantes").val(),
		existemMaisGrupos: $("#existemMaisGrupos").val()
	};

	var restoreOriginalState = function() {
		$("#grupoAtual").val(originalState.grupoAtual);
		$("#proximoGrupo").val(originalState.proximoGrupo);
		$("#gruposRestantes").val(originalState.gruposRestantes);
		$("#existemMaisGrupos").val(originalState.existemMaisGrupos);
	}

	var updateGroupsExistance = function(hasMoreGroups) {
		$("#existemMaisGrupos").val(hasMoreGroups ? "SIM" : "NAO");
	}

	try {
		// Verifica se ainda existe grupos restantes
		var groupsLeft = $("#gruposRestantes").val();
		if (groupsLeft == "") return updateGroupsExistance(false);

		// Se existem, transforma-os em array
		groupsLeft = groupsLeft.split(",");

		if(groupsLeft.length == 4){
			groupsLeft.shift();
			
		}
		if(groupsLeft.length <= 1 ){
			$("#existemMaisGrupos").val("NAO");
		}
		
		// Define o grupo para a próxima tarefa imediata
		var proximoGrupo = "Pool:Group:" + groupsLeft[0];
		$("#grupoAtual").val(proximoGrupo);
		$("#proximoGrupo").val(proximoGrupo);

		// Atualiza quais serão os próximos grupos
		groupsLeft = groupsLeft.slice(1);

		// Atualiza os campos
		$("#gruposRestantes").val(groupsLeft.join(','));
		updateGroupsExistance(true);

	} catch (error) {
		restoreOriginalState();
		throw "Erro ao atribuir próximo grupo: " + error;
	}
}
