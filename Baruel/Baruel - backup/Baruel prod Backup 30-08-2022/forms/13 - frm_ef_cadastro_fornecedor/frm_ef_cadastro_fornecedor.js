$(document).ready(function () {
	
	/**
	 * parâmetros para funcionamento do formulário
	 */
	let vParTimeout = 1000;
	
	FLUIGC.loading(window).show();
	
	/**
	 * Mostra o loading do fluig para resolver as visões de tela
	 */
	setTimeout(() => {
		FLUIGC.loading(window).hide();

		var branch = $('#branch').val();
		var company = $('#company').val();

		if (branch) {
			// Filtro dos campos zoom
			filterZoomBranch(company, branch[0]);
		}
	}, vParTimeout);

	/**
	 * Oculta todas as tabs por padrão
	 */
	enableTabs();
	
	/**
	 * Oculta os campos não utilizados pelo cliente
	 */
	configureFields();

	/**
	 * Mostra os erro da última tentativa de integração (se houver)
	 */
	showError();

	/**
	 * Mostra o grupo atual do fluxo do Easy Flow
	 */
	showGroup();

	/**
	 * Aplica as máscaras de input
	 */
	inputMasks();

	/**
	 * Filtro de estado para o zoom A2_COD_MUN
	 */
	$('#A2_EST').on('change', function() {
		filterZoomBranch($('#company').val(), $('#branch').val());
	});

	$('#A2_COD').on('change', function () {
		// checkSupplierCode();
	});

	/**
	 * Verifica se o CPF/CNPJ já foi cadastrado
	 */
	$('#A2_CGC').on('change', function () {
		checkProvider();
	});

	setUppercaseFields(['A2_INSCR']);
	setSpacelessFields(['A2_INSCR']);
	
	/**
	 * Habilita o popover ao passar o mouse
	 */
	FLUIGC.popover('.popover-hover', {trigger: 'hover', placement: 'auto'});

});
