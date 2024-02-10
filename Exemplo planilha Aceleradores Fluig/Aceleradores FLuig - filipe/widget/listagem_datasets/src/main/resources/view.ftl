<div id="ListagemDatasets_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide listagem_datasets_widget" data-params="ListagemDatasets.instance({'nmFichario': '${nmFichario!""}','nrFichario': '${nrFichario!""}','camposTela': '${camposTela!""}','nmCamposTela': '${nmCamposTela!""}'})">
	<div class="panel panel-default">
		<div class="panel-body">
			<h1>Exibição dos dados</h1>

			<div id="dados_dataset" class="col-md-12">
			</div>
		</div>
	</div>
</div>

<script class="template_area_buttons" type="text/template">
	<div class="col-md-12">
		<div class="col-md-4">
			<button class="btn btn-primary" data-datatable-add-row id="datatable-add-row" >
	            Novo
	        </button>
	        <button class="btn btn-default" disabled="disabled" data-datatable-edit-row id="datatable-edit-row">
	            Editar
	        </button>
	        <button class="btn btn-default" disabled="disabled" data-datatable-del-row id="datatable-del-row" >
	            Excluir
	        </button>
		</div>
		<div class="col-md-3">
			<div class="input-group">
		        <input type="number" name="limite_registros" id="limite_registros" class="form-control"></input>
		        <span class="input-group-btn">
		        	<button type="button" class="btn btn-default" data-load-registros>Limitar</button>
		      	</span>
	      	</div>
		</div>
		<div class="col-md-5">
			<div class="col-md-12">
				<div class="col-md-5 no_padding_right">
					<label for="sl_filtro_busca">Campo Filtro</label>
				</div>
				<div class="col-md-7 no_padding_left">
					<select name="sl_filtro_busca" id="sl_filtro_busca" class="form-control">
						<option value=""></option>
					</select>
				</div>
			</div>
		</div>
	</div>
</script>
<script src="/webdesk/vcXMLRPC.js"></script>