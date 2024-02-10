function validateForm(form){

    var atividade = getValue("WKNumState");

    if(atividade == 0|| atividade ==4){
        if(form.getValue("matriculaTotver") == ''){
            throw "Selecione o nome do Totver"
        }
    }

}