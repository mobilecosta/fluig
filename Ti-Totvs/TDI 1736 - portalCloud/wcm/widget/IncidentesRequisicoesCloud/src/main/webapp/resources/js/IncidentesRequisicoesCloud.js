var MyWidget = SuperWidget
	.extend({

		tabelaPerguntas: null,

		// método iniciado quando a widget é carregada
		init: function () {
			this.carregarTemplatePasso1();
		},

		// BIND de eventos
		bindings: {
			local: {
				'open-monitoramento-cloud': ['click_monitoramentoCloud'],
				'open-cloud-insights': ['click_openCloudInsights'],
				'open-cherwell': ['click_openCherwell'],
				'open-zendesk': ['click_openZendesk'],
				'open-tcloud': ['click_openTcloud'],
				'open-faq': ['click_OpenFAQ'],
				'open-search-contato': ['click_SearchContato'],
				'open-utils': ['click_openUtils'],
				'open-resposta': ['click_openResposta']
			},
			global: {}
		},
		monitoramentoCloud: function () {
			window.open("https://tcloudwatch.cloudtotvs.com.br/Home/Login?ReturnUrl=%2F", "_blank");
		},
		openCloudInsights: function () {
			window.open("https://tcloud.totvs.com.br/insights", "_blank");
		},
		openCherwell: function () {
			window.open("https://itsm.cloudtotvs.com.br/CherwellAPI/Account/Login", "_blank");
		},
		openZendesk: function () {
			window.open("https://totvssuporte.zendesk.com/", "_blank");
		},
		openTcloud: function () {
			window.open("https://tcloud.totvs.com.br/", "_blank");
		},
		OpenFAQ: function () {
			FLUIGC.modal({
				title: "Perguntas e Respostas Frequentes !",
				content: {
					widgetCode: 'IncidentesRequisicoesCloud',
					ftl: 'passo1.ftl'
				},
				id: 'passo1-ftl',
				size: "full",
				actions: [{
					'label': 'Sair',
					'autoClose': true
				}]
			})
			setTimeout(() => {
				document.querySelector(".table-datatable").children[1].children[0].children[0].click();
			}, 400);

		},
		SearchContato: function () {
			var myModal = FLUIGC
				.modal(
					{
						title: 'Pontos de Contato',
						content: `<div style="width:100%;border:1px solid #c0c0c0; height:300%;border-radius:15px">
									<a href="https://prefluig14.totvs.com/portal/p/10097/pontos_contato_cloud" target="_blank">
									<button class="btn-details" style="background-color:transparent;font-weight:bold;border:1px solid #c0c0c0; border-radius:15px;text-align:center;width:90%;margin-left:5%;margin-top:15px;margin-bottom:15px;height:40px">INFRAESTRUTURA</button>
									</a>
								</div>`,
						id: 'fluig-modal',
						size: "large",

					}, function (err, data) {
						if (err) {
							// do error handling
						} else {
							// do something with data
						}
					});
		},
		openUtils: function () {
			let that = this
			FLUIGC.modal({
				title: "Links Úteis",
				content: {
					widgetCode: 'IncidentesRequisicoesCloud',
					ftl: 'links_uteis.ftl'
				},
				id: 'links_uteis-ftl',
				size: "large",
				actions: [{
					'label': 'Sair',
					'autoClose': true
				}]
			}, function () {
				that.consultarLinks();
			});
		},


		consultarLinks: function () {
			let that = this;
			let constraint = [];
			constraint.push(DatasetFactory.createConstraint("tablename", 'linkCloud', 'linkCloud', ConstraintType.MUST));
			DatasetFactory.getDataset("cloud_links_uteis", null, constraint, null, {
				success: (data) => {
					if (data != null && data.values != null && data.values.length > 0) {
						that.carregarTabelaLink(data.values)
					}
				},
				error: (data) => {
					console.log("Erro na consulta ds: " + data);
				}
			});
		},

		carregarTabelaLink: function (data) {
			console.log(data);

			for (let i = 0; i < data.length; i++) {
				$("#tabelaLinks").append(`
				<tr>
					<td class="col-md-2">${data[i]['tituloLink']}</td>
					<td class="col-md-4">
					<a href="${data[i]['linkTitulo']}" target="_blank">${data[i]['linkTitulo']}</a>
					</td>
				</tr>
				`)
			}			
		},

		carregarTemplatePasso1: function () {
			let that = this;
			that.tabelaPerguntas = FLUIGC.datatable('#perguntas', {
				dataRequest: {
					url: '/api/public/ecm/dataset/search?datasetId=perguntas_frequentes_cloud&',
					options: {
						contentType: 'application/json',
						dataType: 'json'
					},
					root: 'content',
					limit: 30,
					offset: 0,
					patternKey: 'text',
					limitkey: 'per_page',
					offsetKey: 'page',
					formatData: function (data) {
						return data;
					}
				},
				renderContent: '#templatePasso1',
				header: [{
					'dataorder': 'pergunta',
					'size': 'col-md-1',
				}, {
					'dataorder': 'resposta',
					'size': 'col-md-1',
					'display': false,
				},{
					'dataorder': 'ativo',
					'size': 'col-md-1',
					'display': false,
				}],
				search: {
					enabled: false
				},
			});
		},

		openResposta: function () {
			let that = this;
			let index = that.tabelaPerguntas.selectedRows()[0];
			let linhaSelecionada = this.tabelaPerguntas.getRow(index);
			$("#respostas").html(`
			<table>
				<thead>
					<tr>
						<th><h1 style="font-size: 40px;margin-bottom: 50px;color: #076077;"><img src="/escalonamentoCloud/resources/images/element.png" alt="">${linhaSelecionada['pergunta']}</h1></th>
					</tr>
				</thead>
				<tbody>
					 <tr>
						<td><p style="font-size: 20px;font-weight: bold !important;">${linhaSelecionada['resposta']}</p></td>
					</tr>
				</tbody>
			</table>
			`)
		},

	});
