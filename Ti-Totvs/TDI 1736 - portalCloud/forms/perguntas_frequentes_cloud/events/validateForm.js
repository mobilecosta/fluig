function validateForm(form){
    if(form.getValue("pergunta") == ''){
        throw "Digite uma pergunta !"
    }
    if(form.getValue("resposta") == ''){
        throw "Digite a resposta !"
    }
}