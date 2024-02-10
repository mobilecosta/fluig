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
		var company = $('#company').val();
		if (company) {
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
	 * Mostra os erro da última tentativa de integração (se houver)
	 */
	showError();

	/**
	 * Mostra o grupo atual do fluxo do Easy Flow
	 */
	showGroup();

	/**
	 * Máscaras
	 */
	inputMasks();

	/**
	 * Não permite mudar o estado do switch manualmente
	 */
	$('#editProduct').click(function (e) { e.preventDefault(); })

	/**
	 * Habilita o popover ao passar o mouse
	 */
	FLUIGC.popover('.popover-hover', { trigger: 'hover', placement: 'auto' });

	const currentState = getWKNumState();
	const isFirstState = currentState == 0 || currentState == 4;

	if (!isFirstState) {
		checkEditMode();
		if (!isErrorState()) {
			forceDisableZoom('zoom_branch', true);
		}
	}

	/** Modal para seleção de opcionais - G1_OPC */
	// if (!$('#B1_OPC').attr('readonly')) {
	// 	$('#B1_OPC').on('click', function() {
	// 		const company = $('#company').val();
	// 		const branch = $('#branch').val();
	// 		const B1_COD = $('#B1_COD').val().trim();

	// 		// Verifica se uma filial já foi selecionada
	// 		if (!company || !branch) {
	// 			return FLUIGC.toast({
	// 				title: 'Atenção:',
	// 				message: 'Selecione uma filial primeiro.',
	// 				type: 'warning'
	// 			});
	// 		}

	// 		// Verifica se uma filial já foi selecionada
	// 		if (!B1_COD) {
	// 			return FLUIGC.toast({
	// 				title: 'Atenção:',
	// 				message: 'Selecione um produto primeiro.',
	// 				type: 'warning'
	// 			});
	// 		}

	// 		modalOpcionais(B1_COD, company, branch);
	// 	});
	// }
	// $('#B1_OPC').attr('readonly', true);

	// if($('#B1_RASTRO').val() != "" && $('#mostraGrupoAtual').text() == "ESTOQUE"){
	// 	$('#B1_RASTRO').prop('disabled', true);
	// }

	$('#B1_COD').on('blur', function (e) {
		if ($("#consulta_sb1").length > 0 && $("#consulta_sb1").val() != null && $("#consulta_sb1").val().length > 0)
			return false;
		// Código digitado pelo usuário
		const B1_COD = e.target.value;

		// Definição automática do código de  barras
		$('#B1_CODBAR').val(B1_COD ? B1_COD : '0');
		$('#B1_COD_READONLY').val(B1_COD ? B1_COD : '');
		
		
		// Verificação do código no Protheus
		if (B1_COD) checkProduct();
		if ($('#B1_TIPO').val() === 'PA') {
			const CODVEN = B1_COD.substring(2)
			$('#B1_CODVEN').val(CODVEN ? CODVEN : '');
		}
	});

	$('#B1_DESC').on('blur', function (e) {
		// Descrição digitada pelo usuário
		const B1_DESC = e.target.value;
		$('#B1_DESC_READONLY').val(B1_DESC ? B1_DESC : '');
	});

	ZOOM.execWhenReady("zoom_branch", function () {

		window["zoom_branch"].setValue("01 | GUARULHOS | 01 | BARUEL");
		window["zoom_branch"].disable(true);
		$('#branch').val('01');
		$('#company').val('01');
		$('#branch_desc').val('GUARULHOS');
		$('#company_desc').val('BARUEL');

	});


});
