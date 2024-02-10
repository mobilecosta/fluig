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
	 * Mostra o erro da última tentativa de integração, caso exista
	 */
	showError();

	/**
	 * Mostra o grupo atual do fluxo do EasyFlow
	 */
	showGroup();

	/**
	 * Aplica as máscaras de input
	 */
	inputMasks();

	/**
	 * Filtro de estado para o zoom A1_COD_MUN
	 */
	$('#A1_EST').on('change', function() {
		filterZoomBranch($('#company').val(), $('#company').val());
	});

	/**
	 * Verifica se o CPF/CNPJ já foi cadastrado
	 */
	$('#A1_CGC').on('change', function () {
		checkClient();
	});

	/**
	 * Define valores padrão de campos
	 */
	defaultValues();

	/**
	 * Habilita o popover ao passar o mouse
	 */
	FLUIGC.popover('.popover-hover', {trigger: 'hover', placement: 'auto'});
});