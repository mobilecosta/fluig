function validateForm(form) {
    var header = 'Não é possível salvar o formulário.<br/>';
    var msg = '';
    var tableIndexes = form.getChildrenIndexes('table_parametros');

    var documentid = form.getDocumentId();
    var datasetForm = DatasetFactory.getDataset('ds_ef_par', null, null, null);
    var groupAvailable = true;

    if (!form.getValue('groupId')) {
        msg += '- O campo <b>Grupo</b> não foi informado.<br/>';
    }

    if (!form.getValue('processId')) {
        msg += '- O campo <b>Processo</b> não foi informado.<br/>';
    }

    if (isEmpty(form.getValue('groupOrder'))) {
        msg += '- O campo <b>Ordem</b> não foi informado.<br/>';
    }

    for (var i = 0; i < datasetForm.getRowsCount(); i++) {
        if (
            datasetForm.getValue(i, 'documentid') != documentid &&
            groupAvailable &&
            datasetForm.getValue(i, 'processId') == form.getValue('processId') &&
            datasetForm.getValue(i, 'groupId') == form.getValue('groupId')
        ) {
            groupAvailable = false;
            msg += '- O grupo <b>' + form.getValue('groupId') + '</b> já foi configurado em outro registro ('+
            datasetForm.getValue(i, 'documentid') + ').<br/>';
        }
    }

    if (tableIndexes.length > 0) {
        for (var i = 0; i < tableIndexes.length; i++) {
            if (!form.getValue('nomeTab___'   + tableIndexes[i]) ||
                !form.getValue('permissao___' + tableIndexes[i])
            ) {
                msg += '- A linha ' + (i + 1) + ' da tabela não foi preenchida corretamente.<br/>';
            }
        }
    }

    if (msg) {
        throw (header + msg);
    }
}

function isEmpty(value) {
    return value == undefined || value == null || value == '';
}