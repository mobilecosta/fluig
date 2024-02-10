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
	, prepareCostCenterZoom: function () {
		let branch = $("#cd_filial").val();
		reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,' + CONTEXT.USER + ',cd_filial,' + branch);
	}
	, loadProductZoom: function () {
		let indexes = UTILS.getChildrenIndexes("tb_produtos");

		for (let i = 0; i < indexes.length; i++) {
			ZOOM.execWhenReady("cd_produto___" + indexes[i], function () {
				ZOOM.prepareProductZoom(indexes[i]);
			});
		}
	}
	, prepareProductZoom: function (index) {
		let branch = $("#cd_filial").val();
		console.log('prepareProductZoom')
		console.log('reloadZoomFilterValues(cd_produto)' + branch)
		console.log('reloadZoomFilterValues(cd_produto) ' + index)

		
		reloadZoomFilterValues("cd_produto___" + index, 'branch,' + branch);
	}
	, clearProductZoom: function () {
		let indexes = UTILS.getChildrenIndexes("tb_produtos");

		for (let i = 0; i < indexes.length; i++) {
			window["cd_produto___" + indexes[i]].clear();
			$("#nm_produto___" + indexes[i]).val("");
			reloadZoomFilterValues("cd_produto___" + indexes[i], 'branch,99999999');
		}
	}
	, loadLedgerAccountZoom: function () {
		let indexes = UTILS.getChildrenIndexes("tb_produtos");

		for (let i = 0; i < indexes.length; i++) {
			ZOOM.execWhenReady("cd_conta_contabil___" + indexes[i], function () {
				ZOOM.prepareLedgerAccountZoom(indexes[i]);
			});
		}
	}
	, prepareLedgerAccountZoom: function (index) {
		let branch = $("#cd_filial").val();
		let costCenter = $("#cd_centro_custo").val()[0];
		reloadZoomFilterValues("cd_conta_contabil___" + index, 'cd_matricula,' + CONTEXT.USER + ',cd_filial,' + branch + ',cd_centro_custo,' + costCenter);
	}
	, clearLedgerAccountZoom: function () {
		let indexes = UTILS.getChildrenIndexes("tb_produtos");

		for (let i = 0; i < indexes.length; i++) {
			window["cd_produto___" + indexes[i]].clear();
			$("#nm_produto___" + indexes[i]).val("");
			reloadZoomFilterValues("cd_produto___" + indexes[i], 'branch,99999999');

			window["cd_conta_contabil___" + indexes[i]].clear();
			$("#nm_conta_contabil___" + indexes[i]).val("");
			reloadZoomFilterValues("cd_conta_contabil___" + indexes[i], 'cd_matricula,,cd_filial,,cd_centro_custo,');
		}
	}
	, loadFilialZoom: function () {

		if (CONTEXT.MODE != "VIEW") {
			if (CONTEXT.ACTIVITY == Activity.ABERTURA || CONTEXT.ACTIVITY == Activity.INICIO) {
				ZOOM.execWhenReady("nm_filial", function () {

					window["nm_filial"].setValue("1006 - XCMG BRASIL INDUSTRIA SP");
					window["nm_filial"].disable(true);
					$('#cd_filial').val("1006");
					$('#cd_empresa').val("10");
					ZOOM.loadProductZoom();
					ZOOM.reloadSupplierZoom();
					reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,' + CONTEXT.USER + ',cd_filial,' + "1006");
				})
			}
		}

	}

}



function setSelectedZoomItem(selectedItem) {
	let id = "";
	let index = "";
	if (selectedItem.inputId.indexOf("___") > -1) {
		id = selectedItem.inputId.split('___')[0];
		index = selectedItem.inputId.split('___')[1];
	} else {
		id = selectedItem.inputId;
	}

	if (id == "nm_filial") {

	} else if (id == "cd_centro_custo") {
		$('#nm_centro_custo').val(selectedItem['NomeCC']);
		ZOOM.loadLedgerAccountZoom();
		APPROVERS.reloadApprovers();
	} else if (id == "fornecedor") {
		$("#cd_fornecedor").val(selectedItem['A2_COD']);
		$("#nm_razao_social").val(selectedItem['A2_NREDUZ']);
		$("#nm_banco").val(selectedItem['A2_BANCO']);
		$("#cd_agencia").val(selectedItem['A2_AGENCIA']);
		$("#cd_conta").val(selectedItem['A2_NUMCON']);
		$("#loja_fornecedor").val(selectedItem['A2_LOJA']);
		$("#cgc_fornecedor").val(selectedItem['A2_CGC']);
	} else if (id == "cd_produto") {
		$("#nm_produto___" + index).val(selectedItem['B1_DESC']);
		let account = (selectedItem['B1_CONTA'] == null)
			? "" : selectedItem['B1_CONTA'].replace(/\"/g, "");
		TABLES.setProductDefaultAccount(index, account);
	} else if (id == "cd_conta_contabil") {
		$("#nm_conta_contabil___" + index).val(selectedItem['NomeCT']);
		TABLES.calculateProductBudget($("#cd_conta_contabil___" + index));
	}
}

function removedZoomItem(removedItem) {
	let id = "";
	let index = "";
	if (removedItem.inputId.indexOf("___") > -1) {
		id = removedItem.inputId.split('___')[0];
		index = removedItem.inputId.split('___')[1];
	} else {
		id = removedItem.inputId;
	}

	if (id == "nm_filial") {
		$('#cd_filial').val('');
		$('#cd_empresa').val('');

		window["cd_centro_custo"].clear();
		$("#nm_centro_custo").val('');
		ZOOM.reloadSupplierZoom();
		reloadZoomFilterValues("cd_centro_custo", 'cd_matricula,,cd_filial,');
		ZOOM.clearProductZoom();
		ZOOM.clearLedgerAccountZoom();

		APPROVERS.clearAllApprovers();

	} else if (id == "cd_centro_custo") {
		$('#nm_centro_custo').val('');
		ZOOM.clearLedgerAccountZoom();
		APPROVERS.clearAllApprovers();
	} else if (id == "fornecedor") {
		$("#cd_fornecedor").val('');
		$("#nm_razao_social").val('');
		$("#nm_banco").val('');
		$("#cd_agencia").val('');
		$("#cd_conta").val('');
	} else if (id == "cd_produto") {
		$("#nm_produto___" + index).val('');
	} else if (id == "cd_conta_contabil") {
		$("#nm_conta_contabil___" + index).val('');
	}
}
ZOOM.reloadSupplierZoom = function () {
	let cd_empresa = $('#cd_empresa').val();
	reloadZoomFilterValues("fornecedor", "branch," + cd_empresa);
}

