var MyWidget = SuperWidget.extend({

    tabelaPerguntas: null,
    contatos: null,

    // método iniciado quando a widget é carregada
    init: function () {
        this.carregarTemplatePasso1();
    },

    // BIND de eventos
    bindings: {
        local: {
            'open-passo1': ['click_openPasso1'],
            'open-resposta': ['click_openResposta'],
            'open-passo2': ['click_openPasso2'],
            'open-passo3': ['click_openPasso3']
        },
        global: {}
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

    openPasso1: function () {
        FLUIGC.modal({
            title: "Perguntas e Respostas Frequentes !",
            content: {
                widgetCode: 'escalonamentoCloud',
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

    consultarContatos: function (tabela) {
        let that = this;
        let constraint = [];
        constraint.push(DatasetFactory.createConstraint("tablename", tabela, tabela, ConstraintType.MUST));
        DatasetFactory.getDataset("contatos_cloud", null, constraint, null, {
            success: (data) => {
                if (data != null && data.values != null && data.values.length > 0) {
                    that.contatos = data.values;
                    if(tabela == 'contatosPriorizar') {
                        that.carregarTemplatePasso2(that.contatos);
                    } else if (tabela == 'contatosUrgente'){
                        that.carregarTemplatePasso3(that.contatos);
                    }        
                }
            },
            error: (data) => {
                console.log("Erro na consulta ds: " + data);
            }
        });
    },

    openPasso2: function () {
        let that = this
        FLUIGC.modal({
            title: "Contatos (Priorizar)",
            content: {
                widgetCode: 'escalonamentoCloud',
                ftl: 'passo2.ftl'
            },
            id: 'passo2-ftl',
            size: "full",
            actions: [{
                'label': 'Sair',
                'autoClose': true
            }]
        },function () {
            that.consultarContatos('contatosPriorizar');
        });
    },

    openPasso3: function () {
        let that = this
        FLUIGC.modal({
            title: "Contatos (Urgente)",
            content: {
                widgetCode: 'escalonamentoCloud',
                ftl: 'passo3.ftl'
            },
            id: 'passo3-ftl',
            size: "full",
            actions: [{
                'label': 'Sair',
                'autoClose': true
            }]
        },function () {
            that.consultarContatos('contatosUrgente');
        });
    },


    carregarTemplatePasso2: function (data) {
        console.log('templateee')
        console.log(data)
        FLUIGC.datatable('#contatosPriorizar', {
            dataRequest: data,
            renderContent: '#templatePasso2',
            header: [
                { 'title': 'Assunto', 'dataorder': 'assuntoPriorizar' },
                { 'title': 'Área', 'dataorder': 'areaPriorizar' },
                { 'title': 'Nome do responsável', 'dataorder': 'nomePriorizar' },
                { 'title': 'Telefone', 'dataorder': 'telefonePriorizar' },
                { 'title': 'E-mail', 'dataorder': 'emailPriorizar' }
            ], search: {
                enabled: false
            }, navButtons: {
                enabled: false,
            },
        });
    },

    carregarTemplatePasso3: function (data) {
        FLUIGC.datatable('#contatosUrgente', {
            dataRequest: data,
            renderContent: '#templatePasso3',
            header: [
                { 'title': 'Assunto', 'dataorder': 'assuntoUrgente' },
                { 'title': 'Área', 'dataorder': 'areaUrgente' },
                { 'title': 'Nome do responsável', 'dataorder': 'nomeUrgente' },
                { 'title': 'Telefone', 'dataorder': 'telefoneUrgente' },
                { 'title': 'E-mail', 'dataorder': 'emailUrgente' }
            ], search: {
                enabled: false
            }, navButtons: {
                enabled: false,
            },
        });
    },

});


