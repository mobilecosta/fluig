function createDataset(fields, constraints, sortFields) {
    // Novo dataset
    var dataset = DatasetBuilder.newDataset();

    // Colunas
    dataset.addColumn("Codigo");
    dataset.addColumn("Mensagem");

    // Autorização do cliente (fluig)
    var clientService = fluigAPI.getAuthorizeClientService();

    // Mapa de endpoints por código de serviço (serviceCode : endpoint)
    var endpoints = {
        "cadastro_produto": "CADASTRO_PRODUTO",
        "complemento_produto": "COMPLEMENTO_PRODUTO",
        "produto_fornecedor": "PRODUTO_FORNECEDOR"
    }

    // Mapa de nomes de array por código de serviço (serviceCode : Operacao)
    var paramFieldsArrayNames = {
        "cadastro_produto": "PRODUTOS",
        "complemento_produto": "COMPLEMENTO",
        "produto_fornecedor": "PRODFORN"
    }

    // Para os dados da requisição
    var serviceCode = "";
    var endpoint = "";
    var operation = "";

    // Constraints
    var dsInputsName = "ds_ef_inputs_alteracao_produtos";
    var dsFormName = "ds_ef_alteracao_produtos";
    var documentId = "";
    var inputPrefix = "";

    // Leitura e aplicação de constraints
    if (constraints && constraints.length) {
        for (var i = 0; i < constraints.length; i++) {
            var c = constraints[i];

            if (c.fieldName == "serviceCode") {
                serviceCode = c.initialValue;
                endpoint = "/rest/" + endpoints[c.initialValue];

            } else if (c.fieldName == "dsInputs") {
                dsInputsName = c.initialValue;

            } else if (c.fieldName == "dsForm") {
                dsFormName = c.initialValue;

            } else if (c.fieldName == "documentId") {
                documentId = c.initialValue;

            } else if (c.fieldName == "inputPrefix") {
                inputPrefix = c.initialValue + "";

            } else if (c.fieldName == "operation") {
                operation = c.initialValue + "";

            }
        }
    }

    // JSON libs
    var gson = new com.google.gson.Gson();
    var parser = new com.google.gson.JsonParser();

    // Resultado da requisição
    var result = null;

    try {
        // Testes gerais de erro
        if (serviceCode == "") {
            throw "[Constraint: serviceCode] ServiceCode não especificado";
        }

        if (endpoint == "") {
            throw "[Constraint: serviceCode] Endpoint não encontrado para o serviceCode especificado";
        }

        if (dsInputsName == "") {
            throw "[Constraint: dsInputs] Dataset de inputs não especificado";
        }

        if (dsFormName == "") {
            throw "[Constraint: dsForm] Dataset de formulário não especificado";
        }

        if (documentId == "") {
            throw "[Constraint: documentId] DocumentId não especificado";
        }

        if (inputPrefix == "") {
            throw "[Constraint: inputPrefix] Prefixo de inputs não especificado";
        }

        if (operation == "") {
            throw "[Constraint: operation] Operação não especificada";
        }

        // Dataset de inputs válidos
        var dsInputs = DatasetFactory.getDataset(dsInputsName, null, null, null);
        log.info('CADASTRO PRODUTO - dsInputs');
        log.info('getRowsCount() -> ' + dsInputs.getRowsCount());
        log.dir(dsInputs);

        if (!dsInputs.getRowsCount()) {
            throw "Dataset de inputs retornou vazio";
        }

        // Dataset de registro de formulário
        var dsForm = DatasetFactory.getDataset(dsFormName, null, [
            DatasetFactory.createConstraint('documentid', documentId, documentId, ConstraintType.MUST),
            DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST)
        ], null);

        log.info('CADASTRO PRODUTO - dsForm')
        // log.dir(dsForm);

        if (!dsForm.getRowsCount()) {
            throw "Dataset de formulario retornou vazio";
        }

        // Dados da requisição
        var data = {
            companyId: getValue("WKCompany") + '',
            serviceCode: 'protheus',
            endpoint: endpoint,
            method: 'post',
            timeoutService: '300', // Segundos
            params: {
                "CABECALHO": [{
                    "Empresa": "" + dsForm.getValue(0, 'company'),
                    "Filial": "" + dsForm.getValue(0, 'branch').split(' | ')[0],
                    "Operacao": "" + operation,
                    "Tipo": "2",
                }],
                "PRODUTOS": [],
                "COMPLEMENTO": [],
                "PRODFORN": []
            },
            options: {
                'encoding': 'UTF-8',
                'mediaType': 'application/json',
                'logMessages': 'true'
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }

        // Produtos a serem inserido no 'data'
        var strProduto0 = '{ "TABELA": "0S' + inputPrefix + '"';
        var strProduto1 = '{ "TABELA": "1S' + inputPrefix + '"';

        var codProd = "";

        // Para cada input válido do formulário
        for (var i = 0; i < dsInputs.getRowsCount(); i++) {
            var inputName = dsInputs.getValue(i, "name");
            var inputValue = dsForm.getValue(0, inputName);

            // Evita erros de replace
            if (inputValue == null || inputValue == undefined) {
                inputValue = '';
            }

            // Se o prefixo for o mesmo e não for vazio
            if (inputName.slice(0, inputPrefix.length) == inputPrefix && inputValue != "") {
                // Construção dos produtos baseado no serviceCode
                if (serviceCode == "produto_fornecedor") {
                    // Filtro de campos
                    if (
                        inputValue != null &&
                        inputName != "A5_PRODUTO" &&
                        inputName != "A5_FILIAL"
                     ) {
                        strProduto1 += (', "' + inputName + '": "' + inputValue + '"');
                        inputValue = semAcentuacao(inputValue);  
                    }
                } else {
                    // Se o input não for vazio
                    if (inputValue != "" && inputValue != "null" && inputValue != null) {
                        inputValue = semAcentuacao(inputValue);     
                        strProduto0 += (', "' + inputName + '": "' + inputValue + '"');
                    }
                }  
            }
            
            if (inputName == "B1_COD") {
                codProd = inputValue;
            }
        }

        // "A5_PRODUTO" precisa ser o mesmo que o "B1_COD"
        if (serviceCode == "produto_fornecedor") {
            strProduto0 += (', "A5_PRODUTO": ' + ' "' + codProd + '"');
            strProduto0 += (', "A5_NOMPROD": ' + ' "FLUIG"');
        }

        // "B5_COD" precisa ser o mesmo que o "B1_COD"
        if (serviceCode == "complemento_produto") {
            strProduto0 += (', "B5_COD": ' + ' "' + codProd + '"');
        }

        strProduto0 += " }";
        strProduto1 += " }";

        // Transforma as strings de produto em formato JSON
        var produto0Obj = parser.parse(strProduto0);
        var produto1Obj = parser.parse(strProduto1);

        // Coloca os produtos nos dados da requisição
        data.params[paramFieldsArrayNames[serviceCode]].push(produto0Obj);
        if (serviceCode == "produto_fornecedor") {
            data.params[paramFieldsArrayNames[serviceCode]].push(produto1Obj);
        }

        log.info('ds_protheus_cadastro_produto - vo');
        log.info(strProduto0);
        log.info(strProduto1);
        var vo;
        // Faz a requisição do data em JSON
        log.info('CADASTRO PRODUTO - VO')
        try {
            log.info('try produto');
            vo = clientService.invoke(gson.toJson(data));
            log.dir(vo);
            log.info(vo.getResult());
            result = voAsArray(vo);
            log.dir(result);
        } catch (error) {
            log.info('catch produto');
            vo = clientService.invoke(gson.toJson(data));
            log.dir(vo);
            log.info(vo.getResult());
            result = voAsArray(vo);
            log.dir(result);
        }
    } catch (err) {
        log.info('CADASTRO PRODUTO - catch');
        log.info(err.message);
        result = [5, err.message];
    }

    dataset.addRow(result);

    return dataset;
}

function voAsArray(vo) {
    var parser = new com.google.gson.JsonParser();
    var response = parser.parse(normalizeResult(vo.getResult()));
    var codigo = "";
    var mensagem = "";

    if (response.has("errorCode")) {
        codigo = response.get("errorCode").getAsString();
        mensagem = response.get("errorMessage").getAsString();

    } else if (response.has("Codigo")) {
        codigo = response.get("Codigo").getAsString();
        mensagem = response.get("Mensagem").getAsString();
        
    }

    return [codigo, mensagem];
}

function semAcentuacao(inputValue){
    inputValue = inputValue.replace("á","a");
    inputValue = inputValue.replace('é','e');
    inputValue = inputValue.replace('í','i');
    inputValue = inputValue.replace('ó','o');
    inputValue = inputValue.replace('ú','u');
    inputValue = inputValue.replace('â','a');
    inputValue = inputValue.replace('ê','e');
    inputValue = inputValue.replace('î','i');
    inputValue = inputValue.replace('ô','o');
    inputValue = inputValue.replace('û','u');
    inputValue = inputValue.replace('à','a');
    inputValue = inputValue.replace('è','e');
    inputValue = inputValue.replace('ì','i');
    inputValue = inputValue.replace('ò','o');
    inputValue = inputValue.replace('ù','u');
    inputValue = inputValue.replace('ã','a');
    inputValue = inputValue.replace('õ','o');
    inputValue = inputValue.replace('ç','c');    
    inputValue = inputValue.replace('Á','A');
    inputValue = inputValue.replace('É','E');
    inputValue = inputValue.replace('Í','I');
    inputValue = inputValue.replace('Ó','O');
    inputValue = inputValue.replace('Ú','U');
    inputValue = inputValue.replace('Â','A');
    inputValue = inputValue.replace('Ê','E');
    inputValue = inputValue.replace('Î','I');
    inputValue = inputValue.replace('Ô','O');
    inputValue = inputValue.replace('Û','U');
    inputValue = inputValue.replace('À','A');
    inputValue = inputValue.replace('È','E');
    inputValue = inputValue.replace('Ì','I');
    inputValue = inputValue.replace('Ò','O');
    inputValue = inputValue.replace('Ù','U');
    inputValue = inputValue.replace('Ã','A');
    inputValue = inputValue.replace('Õ','O');
    inputValue = inputValue.replace('Ç','C');

    return inputValue;
}

function normalizeResult(result) {
    // Trata as quebras de linha
    result = result
        .replaceAll("\n", " QUEBRA ")
        .replaceAll("\r", "")
        .replaceAll("\r\n", " QUEBRA ");

    return result
}

function getConfig() {
    var CONFIG_DATASET = {
        name: "ds_ef_protheus_config",
        column: "config"
    };

    var configDataset = DatasetFactory.getDataset(CONFIG_DATASET.name, null, null, null);
    var configString = configDataset.getValue(0, CONFIG_DATASET.column);

    var parser = new com.google.gson.JsonParser();
    var configObj = parser.parse(configString).getAsJsonObject();

    // Gson -> JsonObject:
    // https://javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/JsonObject.html
    return configObj;
}