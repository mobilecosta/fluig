function createConstraint(nomeConstraint = "", valueConstraint = "") {
    return {
      "_field": nomeConstraint,
      "_initialValue": valueConstraint,
      "_finalValue": valueConstraint,
      "_type": 1,
      "_likeSearch": false
    }
  }
  
  async function buscarRegistros(datasetName, filtros = [], async = false) {

    let url = "/api/public/ecm/dataset/datasets"
  
    var header = {
      async,
      method: "POST",
      mode: "cors",
      cache: "default",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: datasetName,
        fields: [],
        "constraints": filtros
      })
    }
  
    let registrosDataset = await fetch(url, header)
      .then(res => res.json())
      .then(registros => registros)

      
      
  
    return registrosDataset;
  }