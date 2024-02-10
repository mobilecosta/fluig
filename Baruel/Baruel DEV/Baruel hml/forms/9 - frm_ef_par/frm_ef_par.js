const zoomProcessId = 'processId';

function fnCustomDelete(element) {
    fnWdkRemoveChild(element);
}

function childAdd() {
    // Verifica se há um processo selecionado
    if (!window[zoomProcessId].getSelectedItems()) return;

    // Guarda o nome do dataset de inputs do processo selecionado
    var processId = window[zoomProcessId].getSelectedItems()[0];

    // Adiciona uma nova linha na tabela e filtra os campos de acordo com o processo
    var id = wdkAddChild('table_parametros');
    reloadZoomFilterValues('nomeTab___' + id, 'process,' + processId);
}

function setSelectedZoomItem(selectedItem) {
    if (selectedItem.inputName == zoomProcessId) {
        $('#processName').val(selectedItem.Nome);
        $('#groupOrder').val(getNextGroupOrder(selectedItem.id));
    }
}

function removedZoomItem(removedItem) {
    // Se foi removido o nome do processo
    if (removedItem.inputName == zoomProcessId) {
        var processId = removedItem.id;

        FLUIGC.message.confirm({
            message:  'Tem certeza de que deseja remover o processo selecionado?<br/><b>Todos os campos já configurados serão removidos.</b>',
            title:    'Remover processo selecionado',
            labelYes: 'Remover',
            labelNo:  'Cancelar'
            
        }, function(result) {
            if (result) {
                // Remove todas as linhas
                $('.rowParam [name^="delete___"]').each(function() {
                    $(this).click();
                    $('#groupOrder').val(0);
                });
            } else {
                // Devolve o nome do processo ao campo zoom
                window[zoomProcessId].setValue(removedItem.id);
            }
        });
    } else if (removedItem.inputName.slice(0, 10) == "nomeTab___") {
        var processId = window[zoomProcessId].getSelectedItems()[0];
        var dsProcess = 'ds_ef_inputs_' + processId.slice(6, processId.length);

        reloadZoomFilterValues(removedItem.inputName, 'processId,' + dsProcess);
    }
}

function getNextGroupOrder(processId) {
    var dsPar = DatasetFactory.getDataset('ds_ef_par', null, [
        DatasetFactory.createConstraint('processId', processId, processId, ConstraintType.MUST)
    ], null);
    return dsPar.values.length + 1;
}
