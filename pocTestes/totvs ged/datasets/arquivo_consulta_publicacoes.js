function defineStructure() {}
function onSync(lastSyncDate) {}
function createDataset(fields, constraints, sortFields) {
	log.info("arquivo_consulta_publicacoes - INICIO ##########");
	if(constraints == null || constraints.length == 0
		 || (constraints.length == 1 && constraints[0].name == 'sqlLimit')){
		throw "Informe uma constraint";
	}
	
	var pastaRaiz = 0;
	var unidade = 0;
	var anoMes = 0;
	var expandAssuntos = false;
	var expandPastas = false;
	for(var i = 0; i < constraints.length; i++){
		if(constraints[i].fieldName == 'pastaRaiz'){
			pastaRaiz = constraints[i].initialValue;
		}
		else if(constraints[i].fieldName == 'unidade'){
			unidade = constraints[i].initialValue;
		}
		else if(constraints[i].fieldName == 'anoMes'){
			anoMes = constraints[i].initialValue;
		}
		else if(constraints[i].fieldName == 'expand_assuntos'){
			expandAssuntos = constraints[i].initialValue == 'true';
		}
		else if(constraints[i].fieldName == 'expand_pastas'){
			expandPastas = constraints[i].initialValue == 'true';
		}
	}
	
	log.info("arquivo_consulta_publicacoes - pastaRaiz: " + pastaRaiz);
	var sql = getCaminhoPastas(getValue('WKCompany'), pastaRaiz, unidade, anoMes, expandAssuntos, expandPastas);
    return DatasetFactory.getDataset("fluig_sqlConsultaFluig", [sql], null, null);
}
function onMobileSync(user) {}

function getCaminhoPastas(empresa, pastaRaiz, unidade, anoMes, expandAssuntos, expandPastas){
	var sql = "select * from (select CONCAT(COALESCE(nivel1.nr_documento,''),' / ',";
	sql += "COALESCE(nivel2.nr_documento,''),' / ',";
	sql += "COALESCE(nivel3.nr_documento,''),' / ',";
	sql += "COALESCE(nivel4.nr_documento,''),' / ',";
	sql += "COALESCE(nivel5.nr_documento,''),' / ',";
	sql += "COALESCE(nivel6.nr_documento,''),' / ',";
	sql += "COALESCE(nivel7.nr_documento,''),' / ',";
	sql += "COALESCE(nivel8.nr_documento,''),' / ',";
	sql += "COALESCE(nivel9.nr_documento,''),' / ',";
	sql += "COALESCE(nivel10.nr_documento,''),' / ') as path, ";
	sql += "CONCAT('RAIZ',' / ',";
	sql += "COALESCE(nivel2.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel3.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel4.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel5.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel6.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel7.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel8.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel9.DS_COMENTARIO_ADICIONAL,''),' / ',";
	sql += "COALESCE(nivel10.DS_COMENTARIO_ADICIONAL,''),' / ') as tipos, ";
	if(expandAssuntos){
		sql += "CONCAT('RAIZ',' / ',";
		sql += "COALESCE(nivel2.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel3.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel4.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel5.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel6.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel7.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel8.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel9.CD_ASSUNTO,''),' / ',";
		sql += "COALESCE(nivel10.CD_ASSUNTO,''),' / ') as assuntos, ";
	}
	if(expandPastas){
		sql += "CONCAT(COALESCE(nivel1.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel2.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel3.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel4.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel5.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel6.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel7.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel8.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel9.DS_PRINCIPAL_DOCUMENTO,''),' / ',";
		sql += "COALESCE(nivel10.DS_PRINCIPAL_DOCUMENTO,''),' / ') as pastas, ";
	}
	sql += "nivel1.NR_VERSAO, nivel1.NR_DOCUMENTO as RAIZ from documento nivel1 ";
	sql += " left outer join documento nivel2 on (nivel2.NR_DOCUMENTO_PAI = nivel1.nr_documento and nivel1.COD_EMPRESA = nivel2.COD_EMPRESA and nivel2.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel3 on (nivel3.NR_DOCUMENTO_PAI = nivel2.nr_documento and nivel2.COD_EMPRESA = nivel3.COD_EMPRESA and nivel3.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel4 on (nivel4.NR_DOCUMENTO_PAI = nivel3.nr_documento and nivel3.COD_EMPRESA = nivel4.COD_EMPRESA and nivel4.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel5 on (nivel5.NR_DOCUMENTO_PAI = nivel4.nr_documento and nivel4.COD_EMPRESA = nivel5.COD_EMPRESA and nivel5.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel6 on (nivel6.NR_DOCUMENTO_PAI = nivel5.nr_documento and nivel5.COD_EMPRESA = nivel6.COD_EMPRESA and nivel6.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel7 on (nivel7.NR_DOCUMENTO_PAI = nivel6.nr_documento and nivel6.COD_EMPRESA = nivel7.COD_EMPRESA and nivel7.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel8 on (nivel8.NR_DOCUMENTO_PAI = nivel7.nr_documento and nivel7.COD_EMPRESA = nivel8.COD_EMPRESA and nivel8.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel9 on (nivel9.NR_DOCUMENTO_PAI = nivel8.nr_documento and nivel8.COD_EMPRESA = nivel9.COD_EMPRESA and nivel9.VERSAO_ATIVA = 1) ";
	sql += " left outer join documento nivel10 on (nivel10.NR_DOCUMENTO_PAI = nivel9.nr_documento and nivel9.COD_EMPRESA = nivel10.COD_EMPRESA and nivel10.VERSAO_ATIVA = 1) ";
	sql += " where nivel1.cod_empresa = " + empresa + " and nivel1.nr_documento = " + pastaRaiz + " and nivel1.versao_ativa = 1 ";
	sql += " ) temp ";
	return sql;
}