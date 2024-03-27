const fs = require('fs');
getProductById = async (id) => { 
    try {
        const result = await fs.promises.readFile("./productos.json", 'utf-8')
        const contenido = JSON.parse(result)
        console.log (contenido);
        const indice = contenido.findIndex(prod => prod.id === 1);
        console.log (indice)
        //console.log (`El producto Id ${id} fue ingresado corectamente`)
    } catch (error) {
        console.log(error.message)
    }
}

getProductById(2)
