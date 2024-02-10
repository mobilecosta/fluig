/**
 * Filtra todos os campos "zoom" com a empresa e a filial
 * selecionadas no campo "#branch"
 */
var filterZoomBranch = function () {
    var company = $('#company').val();
    let branch = $('#branch').val().split(' | ')[0];

    if (branch.length) branch = branch[0];

    var zoomList = $('select.select2-hidden-accessible')
        .not('#branch, #company, #consulta_Cliente')
        .toArray()
        .map(function (zoom) {
            return zoom.name
        });

    zoomList.forEach(function (zoom) {
        if (zoom.includes("COD_MUN")) {
            var state = $('#A1_EST').val();
            var constraint = 'EMPRESA___EST';
            var filter = constraint + ',' + company + "___" + state;

            reloadZoomFilterValues(zoom, filter);
        } else {
            var constraint = 'EMPRESA';
            var filter = constraint + ',' + company;

            reloadZoomFilterValues(zoom, filter);
        }
    });

    reloadZoomFilterValues('consulta_Cliente', 'EMPRESA,' + $('#company').val());
}

var showError = function () {
    var err = $('#erro').val();

    if (err == "") {
        $('#div_erro').hide();
    } else {
        $('#div_erro').show();
        $('#div_erro p').html(err);
        $('#btnErrors').on('click', function () {
            if ($('#div_erro .panel').attr('data-showing') == 0) {
                $('#btnErrors').text('Esconder erros da última tentantiva de integração');
                $('#div_erro .panel').attr('data-showing', 1);
                $('#div_erro .panel').slideDown();
            } else {
                $('#btnErrors').text('Exibir erros da última tentantiva de integração');
                $('#div_erro .panel').attr('data-showing', 0);
                $('#div_erro .panel').slideUp();
            }
        });
    }
}

var showGroup = function () {
    var grupoAtual = $('#grupoAtual').val().split(':')[2];

    $('#mostraGrupoAtual').text(grupoAtual);
}

function initMask() {
    let $cpnj_cpf = $('#A1_CGC');
    let cgc = $('#A1_CGC').val() ? $('#A1_CGC').val() : $('#A1_CGC').text();
    if (cgc.length == 11) {
        let format_cpf = cgc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        if ($cpnj_cpf.is(':input')) {
            $cpnj_cpf.val(format_cpf);
        } else {
            $cpnj_cpf.text(format_cpf);
        }
    } else {
        let format_cnpj = cgc.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
        if ($cpnj_cpf.is(':input')) {
            $cpnj_cpf.val(format_cnpj);
        } else {
            $cpnj_cpf.text(format_cnpj);
        }
    }
}

/**
 * Aplica as máscaras de input
 */
var inputMasks = function () {
    $('#A1_CEP').mask('00000-000', { reverse: false });
    $('#A1_CEPC').mask('00000-000', { reverse: false });
    $('#A1_XPRZENT').mask('000').on('change', function () {
        this.value = this.value < 1 ? 1 : this.value;
    });

    // Adm/Fin
    $("#A1_LC").mask('000.000.000,99', { reverse: true });

    // Fiscais
    $('#A1_PERCATM').mask('00.00', { reverse: true });
    $('#A1_PERFECP').mask('00.00', { reverse: true });
}

var loadClient = function (cod) {
    var branch = $('#branch').val();
    var company = $('#company').val();

    // Recupera todos os campos do formulário
    var fields = $('[name^="A1_"]').map((i, e) => e.name).toArray();

    const ignoreField = field => fields.splice(fields.indexOf(field), 1);

    if (company == '01') {
        ignoreField('A1_XRCISP');
        ignoreField('A1_XDTCISP');
    }

    // Pesquisa por todas as informações diretamente do Protheus
    // var dsConsulta = DatasetFactory.getDataset("ds_protheus_consulta", null, [
    //     DatasetFactory.createConstraint('table', 'SA1', null, ConstraintType.MUST),
    //     DatasetFactory.createConstraint('cod', cod, null, ConstraintType.MUST),
    //     DatasetFactory.createConstraint('branch', branch, null, ConstraintType.MUST),
    //     DatasetFactory.createConstraint('company', company, null, ConstraintType.MUST),
    //     DatasetFactory.createConstraint('fields', fields, null, ConstraintType.MUST)
    // ], null);

    FLUIGC.loading(window).show()

    buscarRegistros("ds_protheus_consulta", [
        createConstraint('table', 'SA1'),
        createConstraint('cod', cod),
        createConstraint('branch', branch),
        createConstraint('company', company),
        createConstraint('fields', fields)
    ], true)
        .then(function (result) {
            applyDatasetFields(result.content)
            filterZoomBranch()
            initMask();
            FLUIGC.loading(window).hide()
        })
        .catch(function (result) {
            FLUIGC.loading(window).hide()
            console.error("Ocorreu um erro durante a requisição")
            FLUIGC.toast({
                title: 'Erro: ',
                message: 'Ocorreu um erro ao carregar o registro selecionado',
                type: 'danger'
            });
            filterZoomBranch()
        })
}

/**
 * Aplica os valores de um dataset aos campos do formulário
 * @param {object} dataset dataset
 */
function applyDatasetFields(dataset) {
    console.log(JSON.stringify(dataset.values[0]));
    const isHidden = input => input.attr('type') === 'hidden';
    const isDate = input => input.attr('type') === 'date';
    const isZoom = input => input.is('.select2-hidden-accessible');
    const isSelect = input => input.is('select');

    const toBRL = n => parseFloat(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).slice(3);

    const fillInput = (field, value) => {
        const input = $('#' + field);

        if (isZoom(input)) {
            window[field].setValue(value);
            if ($('#zoom_' + field).attr('readonly')) {
                $('#zoom_' + field).val(value);
            } else {
                window['zoom_' + field].setValue(value);
            }
            input.val(value);
        } else {
            if (isHidden(input)) {
                try {
                    const zoomReadonly = 'zoom_' + field;
                    if (!$('#' + zoomReadonly).is('[readonly]'))
                        window[zoomReadonly].setValue(value);
                    else
                        $('#' + zoomReadonly).val(value);
                } catch (error) {
                    console.log(error);
                }
            } else if (isDate(input)) {
                value = [
                    value.slice(0, 4), '-',
                    value.slice(4, 6), '-',
                    value.slice(6, 8)
                ].join('');
            } else if (isSelect(input)) {
                input.val(value).next().val(input.find('option:selected').text())
            }
            if (field == 'A1_LC') {
                console.log(value)
                value = toBRL(value);
                console.log(value)
            }
            input.val(value).trigger('input');
        }
    }

    for (let i = 0; i < dataset.columns.length; i++) {
        const field = dataset.columns[i];
        const value = dataset.values[0][field];
        if (value) fillInput(field, value);
    }
}

function setSelectedZoomItem(selectedItem) {
    const customZoomNames = getCustomZoomNames();

    // Atribui o valor correto (chave primária) ao campo escondido
    if (customZoomNames.indexOf(selectedItem.inputName) > -1) {
        const hiddenInputName = selectedItem.inputName.replace('zoom_', '');
        const hiddenInput = $('[name="' + hiddenInputName + '"]');

        if (selectedItem.inputName == 'zoom_A1_FILTRF') {
            const pkField = 'Indices';
            const filial = JSON.parse(selectedItem[pkField])['Code'];
            hiddenInput.val(filial);

        } else {
            const pkField = hiddenInput.attr('data-pkfield');
            hiddenInput.val(selectedItem[pkField]);
        }
    }

    switch (selectedItem.inputName) {
        case "zoom_A1_COD_MUN":
            $('#A1_MUN').val(selectedItem['CC2_MUN']);
            break;

        case 'zoom_branch':
            let item = JSON.parse(selectedItem["Indices"])

            $('#company').val(item['EnterpriseGroup']);
            $('#company_desc').val(item['Title']);

            $('#branch').val(item['Code']);
            $('#branch_desc').val(item['Description']);
            $('#zoom_A1_FILTRF').val(item['Code']);
            $('#A1_FILTRF').val(item['Code']);

            filterZoomBranch();

            const setDefaultValue = (field, value, desc) => {
                const hiddenField = $('#' + field);
                if (!hiddenField.val()) {
                    hiddenField.val(value);
                    try {
                        window['zoom_' + field].setValue(desc);
                    } catch (error) {
                        $('#zoom_' + field).val(desc);
                    }
                }
            }

            // Seleção automática de DDI para código do brasil
            setDefaultValue('A1_DDI', '55', '55 | BRASIL');
			setDefaultValue('A1_CONTA', '1120103001', '1120103001');
			setDefaultValue('A1_NATUREZ', '200101', '200101');
            break;

        case 'consulta_Cliente':
            loadClient(selectedItem.A1_COD);
            break;

        default:
            break;
    }
}

function removedZoomItem(removedItem) {
    const customZoomNames = getCustomZoomNames();

    // Remove o valor do campo escondido
    if (customZoomNames.indexOf(removedItem.inputName) > -1) {
        const hiddenInputName = removedItem.inputName.replace('zoom_', '');
        const hiddenInput = $('[name="' + hiddenInputName + '"]');
        hiddenInput.val('');
    }

    switch (removedItem.inputName) {
        case "zoom_A1_COD_MUN":
            $('#A1_MUN').val('');
            break;

        case 'zoom_branch':
            $('#company').val('');
            $('#company_desc').val('');
            $('#branch').val('');
            $('#branch_desc').val('');
            break;

        case 'consulta_Cliente':
            $('#dynamicContents').find('input, select').val('');
            $('#dynamicContents')
                .find('.select2-hidden-accessible')
                .each((i, zoom) => window[zoom.name].clear())
            break;

        default:
            break;
    }
}

function protheusConsultaIE(inscricao, estado) {
    return DatasetFactory.getDataset('ds_protheus_consulta_ie', null, [
        DatasetFactory.createConstraint('Inscricao', inscricao, null, ConstraintType.MUST),
        DatasetFactory.createConstraint('Estado', estado, null, ConstraintType.MUST)
    ], null);
}

function checkInscr(event) {
    const A1_INSCR = $('#A1_INSCR');
    const A1_EST = $('#A1_EST');

    const inscricao = A1_INSCR.val();
    const estado = A1_EST.val();

    const loading = FLUIGC.loading(window);
    loading.show();

    try {
        if (!inscricao) throw 'Inscrição Estadual';
        if (!estado) throw 'Estado';
    } catch (error) {
        A1_INSCR.val('');
        loading.hide();
        return FLUIGC.toast({
            title: 'Campo não preenchido:',
            message: error,
            type: 'warning'
        });
    }

    let codigo, mensagem;

    try {
        const ds = protheusConsultaIE(inscricao, estado);

        if (!ds.values.length) throw "Sem resposta do Protheus.";

        console.log('ds_protheus_consulta_ie', ds);

        codigo = ds.values[0].status || '';
        mensagem = ds.values[0].result || '';

    } catch (error) {
        A1_INSCR.val('');
        loading.hide();
        return FLUIGC.toast({
            title: 'Erro ao consultar Inscrição Estadual:',
            message: error,
            type: 'danger'
        });
    }

    loading.hide();

    if (codigo == '001') {
        return FLUIGC.toast({
            title: 'Inscrição Estadual válida.',
            message: '',
            type: 'success'
        });
    } else if (codigo == '002') {
        FLUIGC.toast({
            title: 'Inscrição Estadual inválida',
            message: mensagem,
            type: 'danger'
        });
    } else {
        FLUIGC.toast({
            title: 'Erro:',
            message: mensagem,
            type: 'danger'
        });
    }

    A1_INSCR.val('');

}
