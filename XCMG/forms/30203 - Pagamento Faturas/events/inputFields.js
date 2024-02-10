function inputFields(form){
	var dt_pagamento = form.getValue("dt_pagamento");
	log.info(_log+ "#inputFields - dt_pagamento: "+dt_pagamento);
	if(!isEmpty(form, "dt_pagamento") && dt_pagamento.indexOf("-") > -1){
		form.setValue("dt_pagamento", dataPadraoBrasileiro(dt_pagamento));
	}
	log.info(_log+ "#inputFields - dt_pagamento: "+dataPadraoBrasileiro(dt_pagamento));
}