
//Desafio entregable 01- Evangelina Varela
class ProductManager
{
    /**@type {Array<producto>} */
    #productos;

     constructor()
    {
        //se crea arreglo vacio.
        this.#productos=[];
    }

    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {string} thumbnail 
     * @param {string} code 
     * @param {number} stock 
     */
    addProduct(title, description,price, thumbnail,code,stock)
    {
        if(title.trim().length === 0) {
           throw new Error("Debe ingresar un valor para Title");
        }

        if(description.trim().length === 0) {
           throw new Error("Debe ingresar un valor para Description");
        }

        if(price === 0) {
            throw new Error("Debe ingresar un valor para price");
        }

        if(thumbnail.trim().length === 0) {
            throw new Error("Debe ingresar un valor para thumbnail");
        }

        if(code.length === 0) {
            throw new Error("Debe ingresar un valor para Code");
        }

        if(stock === 0) {
            throw new Error("Debe ingresar un valor para Stock");
        }
   
        //validar que el campo code no este repetido
        //const existeCode = this.#productos.some(
        const existeCode = this.#productos.some(
            (producto) => producto.code === code
          );
          if (existeCode) {
            throw new Error("El campo Code ingresado ya existe");
          }

        /** @type {producto} */
       const producto= {
        id: this.#getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock
       } ;
       this.#productos.push(producto);
    }

    /** @returns {Array<producto>} */
    getProducts(){
        return this.#productos;
    }

    /** @returns {Array<producto>} */
    getProductById(idProducto){
        const producto = this.#productos.find((producto) => producto.id === idProducto);
        if (!producto)
        {
            try {
                throw new Error("Not Found")
              } catch (e) {
                console.log(e.name, e.message); 
              }
        }
        return producto;
    }

    /** @returns {number} */
    #getNextId() {
        if (this.#productos.length === 0) {
        return 1;
        }
        return this.#productos.at(-1).id + 1;
    }
}

//Pruebas 
//Se creará una instancia de la clase “ProductManager”
const productManager= new ProductManager();

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log (productManager.getProducts());

//Se llamará al método “addProduct” con los campos:
productManager.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25);
console.log (productManager.getProducts());

//Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
productManager.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25);

//Se evaluará que getProductById devuelva el producto en caso de encontrarlo
console.log (productManager.getProductById(1));

//Se evaluará que getProductById devuelva error....
console.log (productManager.getProductById(100));