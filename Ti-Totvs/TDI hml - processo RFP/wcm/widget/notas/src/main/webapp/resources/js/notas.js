var WidgetNotas = SuperWidget.extend({
	fluighub: null,
	modalAnexo: null,
	loading: FLUIGC.loading(window, { textMessage: "" }),
	loadingExecutando: false,
	loadingFuncao: null,
	sessao: null,
	pastaTemporaria: 10251004,
	tipoLabelStatus: {
		"Processo cancelado": "danger",
		"Pendente anexar a nota fiscal": "primary",
		"Processando pagamento": "info",
		"Processo finalizado": "success",
		"Processo em validação": "info",
		"Lançamento fiscal": "info",
		"Verificar Inconsistências": "warning"
	},

	init: function () {
		if (!this.isEditMode) {
			this.fluighub = new FluigHub();
			this.verificaSessao();
			window.onresize = () => {
				this.ajustarTamanhoTabela();
			}
		}
	},

	bindings: {
		local: {
			'execute': ['click_executeAction']
		},
		global: {
			"login": ['click_login'],
			"anexar-modal": ['click_abrirModalAnexo'],
			"anexar": ['change_anexar'],
			"enviar-solicitacao": ['click_enviarSolicitacao'],
			"logout": ['click_logout'],
			"editar-pagina": ['click_editarPagina'],
			"cancelar-envio": ['click_cancelarEnvio'],
			"remove-anexo": ['click_removeAnexo']
		}
	},

	enviarSolicitacao: function (elemento) {
		if (!this.verificaSessaoAtiva()) return false;
		if ($("#arquivos").val() == "") {
			FLUIGC.toast({ message: "Adicione um ou mais anexos.", type: "danger" });
			return false;
		}

		this.executaLoading("Enviando notas...", "show", "enviarSolicitacao");
		let dados = this.solicitacaoConstraints();
		let solicitação = $("#solicitacao").val();
		let observacaoUsuario = $("#observacaoUsuario").val();
		this.atualizaCampos(solicitação, observacaoUsuario);


		try {
			this.fluighub.execute(2, "POST", JSON.stringify(dados), (data) => {
				if (data != null && data.error == false) {
					this.solicitacaoSuccessCallback(data);
				}
				this.executaLoading("", "hide", "enviarSolicitacao");
			});
		} catch (e) {
			this.executaLoading("", "hide", "enviarSolicitacao");
			console.error("Erro ao movimentar solicitacao:", e);
		}
	},

	solicitacaoConstraints: function () {
		return {
			"name": "ds_comissoes_movimenta_solicitacao",
			"fields": ["erro", "solicitacao"],
			"constraints": [{
				"_field": "solicitacao",
				"_initialValue": $("#solicitacao").val(),
				"_finalValue": $("#solicitacao").val(),
				"_type": 1,
				"_likeSearch": false
			}, {
				"_field": "arquivos",
				"_initialValue": $("#arquivos").val(),
				"_finalValue": $("#arquivos").val(),
				"_type": 1,
				"_likeSearch": false
			}]
		}
	},

	solicitacaoSuccessCallback: function (data) {
		if (JSON.parse(data.result).content.values.length > 0 && JSON.parse(data.result).content.values[0].erro != "true") {
			let arquivos = $("#arquivos").val().split(";");
			for (let i = 0; i < arquivos.length; i++) {
				this.removeArquivo(arquivos[i], false);
			}
			this.modalAnexo.remove();
			this.carregaConteudoPedido();
		}
	},

	abrirModalAnexo: function (elemento) {
		if (!this.verificaSessaoAtiva()) return false;
		let that = this;
		let solicitacao = elemento.getAttribute("solicitacao");
		let localizacao = elemento.getAttribute("localizacao");
		let observacao = elemento.getAttribute("observacao");
		this.modalAnexo = FLUIGC.modal({
			title: 'Anexar Nota Fiscal',
			content: Mustache.render($("#tplModalAnexo").html(), { solicitacao, observacao }),
			id: 'modalNotas',
			actions: [{
				'label': 'Salvar',
				'bind': 'data-enviar-solicitacao',
			}, {
				'label': 'Cancelar',
				'bind': 'data-cancelar-envio'
			}]
		}, function (err, data) {
			FLUIGC.utilities.parseInputFile("#anexoProcesso");
			$($("#modalNotas .close")[0]).on("click", () => {
				that.cancelarEnvio();
			});
			if (localizacao == "Verificar Inconsistências" && observacao != "")
				$(".alerta-inconsistencia").removeClass("fs-display-none");
		});
	},

	logout: function () {
		window.localStorage.removeItem("notasStorage");
		this.verificaSessao();
	},

	anexar: function (fileUploadElement) {
		if (!this.verificaSessaoAtiva()) return false;
		let that = this;
		let reader = new FileReader();
		reader.onload = function () {
			let arrayBuffer = this.result;
			that.enviarArquivo(arrayBuffer);
		}
		reader.readAsArrayBuffer(fileUploadElement.files[0]);
	},

	enviarArquivo: function (buffer) {
		this.executaLoading("Enviando arquivo...", "show", "enviarArquivo");
		let arquivo = this.retornaMilissegundo() + "_" + $("#anexoProcesso").val().split(/(\\|\/)/g).pop();
		try {
			this.fluighub.uploadStream(buffer, arquivo, data => {
				if (data) {
					this.publicarArquivo(arquivo);
				} else {
					FLUIGC.toast({ message: "Ocorreu um erro ao enviar o arquivo, tente novamente mais tarde.", type: "danger" });
				}
				this.executaLoading("", "hide", "enviarArquivo");
			});
		} catch (e) {
			this.executaLoading("", "hide", "enviarArquivo");
			FLUIGC.toast({ message: "Ocorreu um erro ao enviar o arquivo, tente novamente mais tarde.", type: "danger" });
			console.error("Erro ao enviar Nota Fiscal: ", e);
		}
	},

	publicarArquivo: function (arquivo) {
		this.executaLoading("Enviando arquivo...", "show", "publicarArquivo");
		let dados = {
			"description": arquivo.substr(14, arquivo.length - 1),
			"parentId": this.pastaTemporaria,
			"attachments": [{
				"fileName": arquivo
			}]
		}
		try {
			this.fluighub.execute(6, "POST", JSON.stringify(dados), (data) => {
				if (data != null && data.code == 200) {
					let documento = JSON.parse(data.result).content;
					let arquivoCampo = $("#arquivos").val() == "" ? documento.id : $("#arquivos").val() + ";" + documento.id;
					$("#arquivos").val(arquivoCampo);
					this.adicionaLabelAnexo(documento.id, documento.description);
				} else {
					FLUIGC.toast({ message: "Ocorreu um erro ao enviar o arquivo, tente novamente mais tarde.", type: "danger" });
				}
				this.executaLoading("", "hide", "publicarArquivo");
			});
		} catch (e) {
			this.executaLoading("", "hide", "publicarArquivo");
			FLUIGC.toast({ message: "Ocorreu um erro ao enviar o arquivo, tente novamente mais tarde.", type: "danger" });
			console.error("Erro ao publicar documento: ", e);
		}
	},

	adicionaLabelAnexo: function (idDocumento, documento) {
		let html = Mustache.render($("#tplAnexo").html(), { idDocumento, documento });
		$("#listaAnexos").append(html);
	},

	removeAnexo: function (elemento) {
		let idArquivo = elemento.parentNode.getAttribute("idDocumento");
		this.removeArquivo(idArquivo, true);
		if (!this.verificaSessaoAtiva()) return false;
	},

	cancelarEnvio: function () {
		let arquivos = $("#arquivos").val().split(";");
		if ($("#arquivos").val() != "") {
			this.executaLoading("", "show", "cancelarEnvio");
			for (let i in arquivos) {
				this.removeArquivo(arquivos[i], false);
			}
			this.executaLoading("", "hide", "cancelarEnvio");
		}
		this.modalAnexo.remove();
		this.verificaSessaoAtiva();
	},

	removeArquivo: function (idArquivo, label) {
		try {
			this.fluighub.execute(7, "POST", `/${idArquivo}`, (data) => {
				if (label)
					this.removeArquivoCampo(idArquivo);
			});
		} catch (e) {
			console.error("Erro ao excluir documento: ", e);
		}
		if (label) $(`.anexo-${idArquivo}`).remove();
	},

	removeArquivoCampo: function (idArquivo) {
		let arquivos = $("#arquivos").val().split(";");
		let arquivosRestantes = [];

		for (let i in arquivos) {
			if (arquivos[i] != idArquivo)
				arquivosRestantes.push(arquivos[i]);
		}
		$("#arquivos").val(arquivosRestantes.join(";"));
	},

	retornaMilissegundo: function () {
		return new Date().getTime();
	},

	carregaConteudoPedido: function () {
		let html = Mustache.render($("#tplListaPedidosConteudo").html(), {});
		$("#listaPedidosConteudo").html(html).promise().done(() => {
			html = Mustache.render($("#tplTitulo").html(), {});
			$("#tituloNotas").html(html);
			document.querySelector("#visualizacaoPagina").style.backgroundColor = "#f0f0f0";
			this.consultarPedidos();
		});
	},

	carregaLogin: function () {
		let html = Mustache.render($("#tplLogin").html(), {});
		$("#listaPedidosConteudo").html(html).promise().done(() => {
			document.querySelector("#visualizacaoPagina").style.backgroundColor = "#3291cf";
			$("#tituloNotas").html("");
			$("#CNPJ").mask("99.999.999/9999-99");
		});
		this.ajustarTamanhoTabela();
	},

	login: function () {
		if ($("#senha").val().length == 0) {
			FLUIGC.toast({ message: "Informe uma senha", type: "warning" });
			return false;
		}
		if ($("#CNPJ").val().length < 18) {
			FLUIGC.toast({ message: "Informe um CNPJ válido", type: "warning" });
			return false;
		}

		let dados = this.loginConstraints();

		this.executaLoading("", "show", "login");

		try {
			this.fluighub.execute(2, "POST", JSON.stringify(dados), (data) => {
				if (data != null && data.error == false) {
					this.loginSuccessCallback(data);
				}
				this.executaLoading("", "hide", "login");
			});
		} catch (e) {
			console.error("Erro ao realizar login:", e);
			this.executaLoading("", "hide", "login");
		}
	},

	loginConstraints: function () {
		return {
			"name": "DSTESTE_PAGAMENTO_COMISSAO",
			"fields": ["identificador"],
			"constraints": [{
				"_field": "acesso",
				"_initialValue": $("#senha").val(),
				"_finalValue": $("#senha").val(),
				"_type": 1,
				"_likeSearch": true
			}, {
				"_field": "idCNPJ_canal",
				"_initialValue": $("#CNPJ").val().replace(/\D/g, ""),
				"_finalValue": $("#CNPJ").val().replace(/\D/g, ""),
				"_type": 1,
				"_likeSearch": false
			}]
		}
	},

	loginSuccessCallback: function (data) {
		if (JSON.parse(data.result).content.values.length > 0) {
			window.localStorage.setItem("notasStorage", JSON.parse(data.result).content.values[0].identificador);
			$("#listaPedidosConteudo").html("");
			this.carregaConteudoPedido();
		} else {
			FLUIGC.toast({ message: "Nenhum cliente encontrato com o CNPJ e senha informada", type: "warning" });
		}
	},

	consultarPedidos: function () {
		let dados = this.pedidosConstraints();
		this.executaLoading("Carregando notas...", "show", "consultarPedidos");
		try {
			this.fluighub.execute(2, "POST", JSON.stringify(dados), (data) => {
				if (data != null && data.error == false) {
					this.pedidosSuccessCallback(data);
				}
				this.executaLoading(null, "hide", "consultarPedidos");
			});
		} catch (e) {
			this.executaLoading(null, "hide", "consultarPedidos");
			console.error("Erro ao consultar pedidos:", e);
		}
	},

	pedidosConstraints: function () {
		return {
			"name": "DSTESTE_PAGAMENTO_COMISSAO",
			"constraints": [{
				"_field": "identificador",
				"_initialValue": window.localStorage.getItem("notasStorage"),
				"_finalValue": window.localStorage.getItem("notasStorage"),
				"_type": 1,
				"_likeSearch": true
			}, {
				"_field": "metadata#active",
				"_initialValue": "true",
				"_finalValue": "true",
				"_type": 1,
				"_likeSearch": false
			}]
		}
	},

	pedidosSuccessCallback: function (data) {
		let pedidos = JSON.parse(data.result).content.values;
		let pedidosValidos = [];
		for (let i = 0; i < pedidos.length; i++) {
			pedidos[i].tipoLabel = this.tipoLabelStatus[pedidos[i].localizacao];
			if (pedidos[i].solicitacao != null && pedidos[i].solicitacao != "") {
				pedidos.splice(i, 0);
				if (pedidos[i].localizacao == "Pendente anexar a nota fiscal" || pedidos[i].localizacao == "Verificar Inconsistências")
					pedidos[i].anexo = true;
				pedidosValidos.push(pedidos[i]);
				continue;
			}
		}
		this.populaCabecalho(pedidosValidos[0]);
		this.carregaLista(pedidosValidos);
	},

	populaCabecalho: function (pedidos) {
		let html = Mustache.render($("#tplCabecalho").html(), pedidos);
		$("#cabecalhoPedidos").html(html);
	},

	carregaLista: function (dados) {
		let that = this;
		FLUIGC.datatable('#listaPedidos', {
			dataRequest: dados,
			renderContent: "#tplListaPedidos",
			header: this.cabecalhoPedidos(),
			search: {
				enabled: false
			},
			navButtons: {
				enabled: false
			},
			tableStyle: 'table-hover'
		}, function (err, data) {
			that.formataDadosNota();
			that.ajustarTamanhoTabela();
		});
	},

	cabecalhoPedidos: function () {
		return [
			{ 'title': 'CNPJ canal', 'display': false },
			{ 'title': 'Código fornecedor', 'display': false },
			{ 'title': 'Razão social', 'display': false },
			{ 'title': 'Solicitação' },
			{ 'title': 'Competência' },	
			{ 'title': 'CNPJ TOTVS' },
			{ 'title': 'Filial TOTVS' },
			{ 'title': 'Descrição filial TOTVS' },
			{ 'title': 'Código' },
			{ 'title': 'Nome Canal' },
			{ 'title': 'Pedido' },
			{ 'title': 'Data do PG' },
			{ 'title': 'Valor (R$)' },
			{ 'title': 'Status' },
			{ 'title': '' }
	
		]
	},

	executaLoading: function (mensagem, tipo, funcao) {
		if (tipo == "show") {
			if (this.loadingExecutando) {
				this.loading.setMessage(mensagem);
				this.loadingFuncao = funcao;
			} else {
				this.loading.show();
				this.loading.setMessage(mensagem);
				this.loadingFuncao = funcao;
				this.loadingExecutando = true;
			}
		} else {
			if (this.loadingFuncao == funcao) {
				this.loading.hide();
				this.loadingFuncao = null;
				this.loadingExecutando = false;
			}
		}
	},

	ajustarTamanhoTabela: function () {
		let height = parseFloat(window.innerHeight);
		if (window.localStorage.getItem("notasStorage") != null)
			$("#listaPedidos").height(height - 181 - $("#cabecalhoPedidos").height());
		else
			$(".box-login-parent").css("margin-top", ((window.innerHeight - $(".box-login-parent").height()) / 2.5) + "px");
	},

	formataDadosNota: function () {
		$(".cnpj, .data, .moeda").unmask();
		$(".cnpj").mask("99.999.999/9999-99");
		$(".data").mask("0000/00/00");
		$(".moeda").mask("#.##0,00", { reverse: true });
		$(".moeda").map((indice, elemento) => {
			elemento.innerHTML = elemento.innerHTML.length <= 2 ? `${elemento.innerHTML},00` : elemento.innerHTML;
		});
	},

	verificaSessao: function () {
		if (window.localStorage.getItem("notasStorage") != null) {
			this.carregaConteudoPedido();
		} else {
			this.carregaLogin();
		}
	},

	verificaSessaoAtiva: function () {
		if (window.localStorage.getItem("notasStorage") == null) {
			if (this.modalAnexo != null) this.modalAnexo.remove();
			this.carregaLogin();
			return false;
		}
		return true;
	},

	editarPagina: function () {
		WCMSpaceAPI.PageService.CREATEUNPUBLISHEDPAGE({
			async: false
		}, WCMAPI.pageId);
		window.location.href = currentUrlWithEdit();
	},

	atualizaCampos: function (solicitacao, observacaoUsuario) {

		var constraint = DatasetFactory.createConstraint("solicitacao", solicitacao, solicitacao, ConstraintType.MUST);

		var resultado = DatasetFactory.getDataset("DSTESTE_PAGAMENTO_COMISSAO", null, [constraint], null);

		if (resultado != null && resultado.values != null && resultado.values.length > 0) {
			var cardid = resultado.values[0]["cardid"];
			var documentid = resultado.values[0]["documentid"];
		}

		fetch(
			`/ecm-forms/api/v2/cardindex/${cardid}/cards/${documentid}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json;charset=utf-8",
				},
				cache: "no-cache",
				async: true,
				body: JSON.stringify(
					{
						"values": [
							{
								"fieldId": "idObs",
								"value": observacaoUsuario
							}
						]
					}
				)
			})
	}


});