/*
    ###################################################################################################
    # CONFIGURAÇÃO GLOBAL - EASYFLOW & PROTHEUS         #    MINI DOCUMENTAÇÃO/DESCRIÇÃO DO PROJETO   #
    ###################################################################################################

    ARQUIVOS DO PROJETO                                 DESCRIÇÃO
    # Datasets
    - EasyFlow
        ds_ef_processos                                 Lista de processos do EasyFlow
        ds_ef_tabs                                      Lista de abas para cada processo do EasyFlow
    - Inputs
        - Cliente
            ds_ef_inputs_alteracao_cliente              Inputs do processo de Alteração de Cliente
            ds_ef_inputs_cadastro_cliente               Inputs do processo de Cadastro de Cliente
        - Estrutura
            ds_ef_inputs_alteracao_estrutura_produto    Inputs do processo de Alteração de Cliente
            ds_ef_inputs_cadastro_estrutura_produto     Inputs do processo de Cadastro de Cliente
        - Fornecedor
            ds_ef_inputs_alteracao_fornecedor           Inputs do processo de Alteração de Cliente
            ds_ef_inputs_cadastro_fornecedor            Inputs do processo de Cadastro de Cliente
        - Produto
            ds_ef_inputs_cadastro_produto               Inputs do processo de Alteração de Cliente
        - Outros
            ds_ef_inputs_all                            Todos os inputs acima (para campos zoom filtráveis)
    - Misc
        ds_ef_protheus_config                           Este arquivo -- JSON de configuração
        ds_updateCardData                               Força a modificação de registros de formulário
    - Protheus
        - Consulta (geral)
            ds_protheus_consulta                        Consulta genéria (qualquer tabela)
            ds_protheus_consulta_a2                     Consulta SA2
            ds_protheus_consulta_cc2                    Consulta CC2
            ds_protheus_consulta_cch                    Consulta CCH
            ds_protheus_consulta_ct1                    Consulta CT1
            ds_protheus_consulta_da0                    Consulta DA0
            ds_protheus_consulta_ed_codigo              
            ds_protheus_consulta_estrutura
            ds_protheus_consulta_nnr                    Consulta NNR
            ds_protheus_consulta_sa4                    Consulta SA4
            ds_protheus_consulta_sa6                    Consulta SA6
            ds_protheus_consulta_sah                    Consulta SAH
            ds_protheus_consulta_se4                    Consulta SE4
            ds_protheus_consulta_sx5_a2_codmun
            ds_protheus_consulta_sx5_b1_tipo
        - Cliente                                       Tabela SA1 do Protheus
            ds_protheus_alteracao_cliente
            ds_protheus_cadastro_cliente
        - Estrutura                                     Tabela SG1 do Protheus
            ds_protheus_alteracao_estrutura_produto
            ds_protheus_cadastro_estrutura_produto
        - Fornecedor                                    Tabela SA2 do Protheus
            ds_protheus_alteracao_fornecedor
            ds_protheus_cadastro_fornecedor
        - Produto                                       Tabelas SB1, SB5 e SA5 do Protheus
            ds_protheus_cadastro_produto
    # Formulários                                       Formulários de configuração (EasyFlow)
    frm_ef_fields                                       Campos que serão exibidos nos processos
    frm_ef_par                                          Parâmetros - Grupos, suas abas e permissões em processos
    

    PROCESSOS                                           FORMULÁRIO
    wf_ef_alteracao_cliente                             frm_ef_alteracao_cliente
    wf_ef_alteracao_estrutura_produto                   frm_ef_alteracao_estrutura_produto
    wf_ef_alteracao_fornecedor                          frm_ef_alteracao_fornecedor
    wf_ef_cadastro_cliente                              frm_ef_cadastro_cliente
    wf_ef_cadastro_estrutura_produto                    frm_ef_cadastro_estrutura_produto
    wf_ef_cadastro_fornecedor                           frm_ef_cadastro_fornecedor
    wf_ef_cadastro_produtos                             frm_ef_cadastro_produtos
    

    SERVIÇOS                                            DESCRIÇÃO
    cadastro_cliente                                    SA1 - Inclusão e alteração
    cadastro_estrutura_produto                          SG1 - Inclusão e alteração
    cadastro_fornecedor                                 SA2 - Inclusão e alteração
    cadastro_produto                                    SB1 - Inclusão
    complemento_produto                                 SB5 - Inclusão
    produto_fornecedor                                  SA5 - Inclusão
    consulta_protheus                                   Consulta genérica
    ECMCardService                                      Serviço para "ds_updateCardData"

*/

function createDataset(fields, constraints, sortFields) {
    var config = {
        "admin": {
            "username": "admin",
            "password": "adm"
        },
        "services": {
            "cadastro": {
                "cliente": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/CADASTRO_CLIENTE"
                },
                "estruturaProduto": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/ESTRUTURA_PRODUTO"
                },
                "fornecedor": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/CADASTRO_FORNECEDOR"
                },
                "produto": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/CADASTRO_PRODUTO"
                },
                "produtoComplemento": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/COMPLEMENTO_PRODUTO"
                },
                "produtoFornecedor": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/PRODUTO_FORNECEDOR"
                },
            },
            "consulta": {
                "empresas": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/api/framework/environment/v1/branches"
                },
                "protheus": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/CONSULTA_PROTHEUS"
                },
                "estrutura": {
                    "serviceCode": "protheus",
                    "endpoint": "/rest/CONSULTA_ESTRUTURA"
                }
            }
        }
    }

    var dataset = DatasetBuilder.newDataset();
    
    var gson = new com.google.gson.Gson();
    var json = gson.toJson(config);

    dataset.addColumn("config");
    dataset.addRow([json]);

    return dataset;
}

// Função a ser copiada para os outros arquivos
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