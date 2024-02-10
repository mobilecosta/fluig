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
		if ($('#company').val()) {
			// Filtro dos campos zoom
			filterZoomBranch();
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
		filterZoomBranch();
	});

	/**
	 * Habilita o popover ao passar o mouse
	 */
	FLUIGC.popover('.popover-hover', {trigger: 'hover', placement: 'auto'});
});