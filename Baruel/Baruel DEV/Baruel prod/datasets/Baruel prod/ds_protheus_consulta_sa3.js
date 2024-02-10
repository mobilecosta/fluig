function defineStructure() {
    // Colunas
    addColumn("A3_COD", DatasetFieldType.STRING);
    addColumn("A3_NOME", DatasetFieldType.STRING);
    addColumn("A3_EMAIL", DatasetFieldType.STRING);

    addColumn("ALLS", DatasetFieldType.STRING);
    addColumn("EMPRESA", DatasetFieldType.STRING);

    // Chave primária
    setKey(["EMPRESA", "A3_COD"]);
}

function onSync(lastSyncDate) {
    // Tabela-alvo
    var table = {
        name: "SA3",
        fields: {
            "C1": "A3_COD",
            "C2": "A3_NOME",
            "C3": "A3_EMAIL"
        },
        where: "A3_MSBLQL<>\'1\' AND A3_ATIVO<>\'N\'",
        order: "A3_NOME"
    };

    // Nova sincronização
    var dataset = DatasetBuilder.newDataset();

    // Empresa cujos clientes serão sincronizados
    var companies = getCompanies();

    for (var i = 0; i < companies.length; i++) {
        var info = companies[i];
        var company = info.company;
        var branch = info.branch;

        // Consulta a tabela-alvo
        var dsQuery = protheusQuery(
            company,
            branch,
            table.name,
            table.fields,
            table.where
        );
        if (dsQuery) {
            for (var j = 0; j < dsQuery.size(); j++) {
                var record = dsQuery.get(j).getAsJsonObject();
                var row = [
                    record.get("A3_COD").getAsString(),
                    record.get("A3_NOME").getAsString(),
                    record.get("A3_EMAIL").getAsString()
                ];
                row.push(row.join(' | '));
                row.push(company);

                // Adiciona ou atualiza cada registro
                dataset.addOrUpdateRow(row);
            }
        }
    }

    return dataset;
}

function createDataset(fields, constraints, sortFields) {
    var company = '';
    var branch = '';

    if (constraints && constraints.length) {
        for (var i = 0; i < constraints.length; i++) {
            var c = constraints[i];

            if (c.fieldName == 'branch___company') {
                var branchCompany = c.initialValue.split("___");

                branch = branchCompany[0];
                company = branchCompany[1];
            }
        }
	}
	
	return DatasetFactory.getDataset("ds_protheus_consulta", null, [
		DatasetFactory.createConstraint('table', 'SA3', null, ConstraintType.MUST),
		DatasetFactory.createConstraint('where', 'A3_MSBLQL<>\'1\'', null, ConstraintType.MUST),
		DatasetFactory.createConstraint('fields', ['A3_COD','A3_NOME','A3_EMAIL'], null, ConstraintType.MUST),
        DatasetFactory.createConstraint('branch', branch, null, ConstraintType.MUST),
        DatasetFactory.createConstraint('company', company, null, ConstraintType.MUST)
    ], null);
}

function getCompanies() {
    return [
        { company: '01', branch: '01' },
        { company: '07', branch: '05' },
        // { company: '20', branch: '20' },
        { company: '30', branch: '30' },
        // { company: '50', branch: '01' }
    ];
}

function protheusQuery(company, branch, table, fields, where) {
    // Se houver where
    if (where) {
        where = "AND " + where;
    }

    // Dados da requisição
    var data = {
        companyId: '' + getValue("WKCompany"),
        serviceCode: 'protheus',
        endpoint: '/rest/CONSULTA_PROTHEUS',
        method: 'post',
        timeoutService: '100',
        params: {
            "CABECALHO": [{
                "EMPRESA": '' + company,
                "FILIAL": '' + branch
            }],
            "INFORMACOES": [{
                "TABELA": '' + table,
                "WHERE": "D_E_L_E_T_='' " + where,
                "CAMPOS": fields
            }]
        }
    }

    // Faz a requisição do data em JSON
    return queryAsJsonObject(data);
}

function queryAsJsonObject(data) {
    // Autorização do cliente (fluig)
    var clientService = fluigAPI.getAuthorizeClientService();

    // Gson/Parser
    var gson = new com.google.gson.Gson();
    var parser = new com.google.gson.JsonParser();

    // Resultado da requisição
    var vo = null;
    var result = null;

    var consulta = function () {
        // Faz a requisição do data em JSON
        vo = clientService.invoke(gson.toJson(data));
        // Recupera o resultado como JsonObject
        result = parser.parse(vo.getResult()).getAsJsonArray("Registros");
        log.info("gato do protheus");
        log.dir(vo.getResult());
    }

    try {
        consulta();
    } catch (error) {
        log.info('[ds_protheus_consulta_sa3] FALHA');
        log.dir(data);
        log.dir(vo);
        log.info(error.message);
    }

    // Gato para fazer webservice do protheus funcionar
    if (result == null) {
        consulta();
    }

    // Resposta
    return result;
}