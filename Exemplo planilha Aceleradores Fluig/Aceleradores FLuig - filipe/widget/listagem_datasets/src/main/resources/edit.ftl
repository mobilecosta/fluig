<div id="ListagemDatasets_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="ListagemDatasets.instance({'nmFichario': '${nmFichario!""}','nrFichario': '${nrFichario!""}','camposTela': '${camposTela!""}','nmCamposTela': '${nmCamposTela!""}'})">
	<div class="row">
		<div class="col-md-3 form-group">
			<label for="nmFichario_${instanceId}">Nome do Fichário</label>
			<input type="text" id="nmFichario_${instanceId}" class="form-control" value="${nmFichario!''}">
		</div>
	</div>
	<div class="row">
		<div class="col-md-3 form-group">
			<label for="nrFichario_${instanceId}">Número do Fichário</label>
			<input type="text" id="nrFichario_${instanceId}" class="form-control" value="${nrFichario!''}">
		</div>
	</div>
	<div class="row">
		<div class="col-md-3 form-group">
			<label for="camposTela_${instanceId}">Código campos exibidos em tela (separados por vírgula)</label>
			<input type="text" id="camposTela_${instanceId}" class="form-control" value="${camposTela!''}">
		</div>
	</div>
	<div class="row">
		<div class="col-md-3 form-group">
			<label for="nmCamposTela_${instanceId}">Nome campos exibidos em tela (separados por vírgula)</label>
			<input type="text" id="nmCamposTela_${instanceId}" class="form-control" value="${nmCamposTela!''}">
		</div>
	</div>
	<div class="row">
		<div class="col-md-3">
			<button class="btn btn-primary" data-save-params>Salvar</button>
		</div>
	</div>
</div>

