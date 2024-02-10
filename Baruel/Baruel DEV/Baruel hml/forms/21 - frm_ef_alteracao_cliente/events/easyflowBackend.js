/**
 * Funções javascript utilizadas no front-end
 * para que não seja usado o WCMAPI, pois existem problemas
 * no app mobile do fluig
 */
function setupFrontedFunctions(customHTML) {
	customHTML.append("<script>function getWKUser() { return '" + getValue("WKUser") + "' }</script>");
    customHTML.append("<script>function getWKDef() { return '" + getValue("WKDef") + "' }</script>");
    customHTML.append("<script>function getWKNumState() { return '" + getValue("WKNumState") + "' }</script>");
    customHTML.append("<script>function getErrorState() { return '" + getErrorState() + "' }</script>");
    customHTML.append("<script>function getFormFillState() { return '" + getFormFillState() + "' }</script>");
}

function setupGroups(form, customHTML) {
    var WKDef = getValue("WKDef");

    // Limpa os campos para controle de grupos
    form.setValue("grupoAtual", "");
    form.setValue("gruposRestantes", "");
    form.setValue("existemMaisGrupos", "");
    form.setValue("proximoGrupo", "");
    
    // Busca no formulário de parâmetros, os grupos configurados
    var cstProcessId = DatasetFactory.createConstraint('processId', WKDef, WKDef, ConstraintType.MUST);
    var dsParTabs = DatasetFactory.getDataset('ds_ef_par', null, [cstProcessId], ['groupOrder']);

    // Reordena os grupos corretamente
    var sortedGroups = getSortedGroups(dsParTabs);
    
    /**
     * Percorre os grupos
     */
    if (sortedGroups.length > 1) {
        var firstGroup = dsParTabs.getValue(0, "groupId");
        var groupsLeft = "";

        for (var i = 1; i < sortedGroups.length; i++) {
            var group = sortedGroups[i];
            if (groupsLeft == "") {
                groupsLeft += group;
            } else {
                groupsLeft += "," + group;
            }
        }

        form.setValue("existemMaisGrupos", "SIM");
        form.setValue("grupoAtual", "Pool:Group:" + firstGroup);
        form.setValue("gruposRestantes", groupsLeft);
        form.setValue("proximoGrupo", "Pool:Group:" + groupsLeft.split(',')[0]);
    } else if (sortedGroups.length == 1) {
        var firstGroup = dsParTabs.getValue(0, "groupId");

        form.setValue("existemMaisGrupos", "NAO");
        form.setValue("grupoAtual", "Pool:Group:" + firstGroup);
    }
}

/**
 * Retorna os grupos ordenados do dataset de parametrização
 * A ordenação padrão de datasets por campo entende números como string,
 * então uma reordenação é necessária.
 * @param {dataset} dataset 
 */
function getSortedGroups(dataset) {
    var rowsCount = 5;
    var groups = [];

    for (var i = 0; i < rowsCount; i++) {
        groups.push({
            groupId: dataset.getValue(i, 'groupId'),
            groupOrder: parseInt(dataset.getValue(i, 'groupOrder'))
        });
    }

    groups.sort(function(a, b) {
        groupOrderA = a.groupOrder;
        groupOrderB = b.groupOrder;
        return groupOrderA - groupOrderB;
    });

    for (var i = 0; i < rowsCount; i++) {
        groups[i] = groups[i].groupId;
    }

    return groups;
}
