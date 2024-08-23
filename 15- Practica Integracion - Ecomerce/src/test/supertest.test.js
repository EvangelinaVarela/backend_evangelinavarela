import { expect, assert } from 'chai'
import supertest from 'supertest'

//const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('E-Commerce - Products', function() {
    let pid
    it('El endpoint GET /api/products debe traer todos los productos correctamente', async ()=>{
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/products')
       // console.log (statusCode,_body)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
    })

    it('El endpoint POST /api/products debe traer grabar un producto correctamente', async ()=>{
        const productMock =  {
            title: 'Prod MOCK', 
            description: 'Descripcion producto MOCK', 
            price: 500, 
            thumbnail: 'Sin Imagen', 
            code: 'ABX-01',
            stock: 25,
            category: 'Categoria 3',
            owner:'66a39d08ae0d846fefbf785c'
        } 

        const {
            statusCode,
            _body
        } = await requester.post('/api/products').send(productMock)
        console.log ('Producto creado',_body.payload._id)
        pid=_body.payload._id
        expect(_body.payload).to.have.property('_id')
    })

    it('El endpoint DELETE /api/products debe eliminar el producto correctamente', async ()=>{
        console.log ('Producto a eliminar',pid)
        const {
            statusCode,
            _body
        } =  await requester.delete(`/api/products/${pid}`)
        
        expect(statusCode).to.be.equal(200)
    })

 });

 describe('E-Commerce- CART', function() {
    const cid='6686dc042b28a1636f6b0d84'
    it('El endpoint GET /api/carts debe traer todos los productos del cart ingresado', async ()=>{
        const {
            statusCode,
            ok,
            _body
        } = await requester.get(`/api/carts/${cid}`)
        console.log (statusCode,_body)
        expect(statusCode).to.be.equal(200)
    })
   
    it('El endpoint POST /api/carts debe agregar el producto al cart ingresado', async ()=>{
        const pid='66a96b699022075ebbd15c75'
        const {
            statusCode,
            ok,
            _body
        } = await requester.post(`/api/carts/${cid}/product/${pid}`)
        console.log (statusCode,_body)
        expect(statusCode).to.be.equal(200)
    })

    it('El endpoint DELETE /api/carts debe eliminar el producto del cart', async ()=>{
        const pid='66a96b699022075ebbd15c75'
        const {
            statusCode,
            ok,
            _body
        } = await requester.delete(`/api/carts/${cid}/product/${pid}`)
        console.log (statusCode,_body)
        expect(_body.payload).to.be.ok.and.eql('El producto ID 66a96b699022075ebbd15c75 fue eliminado del carrito Id 6686dc042b28a1636f6b0d84')
        
    })
 });

 describe('E-Commerce- sessions', function() {
    let cookie
    it('El endpoint post sessions/register debe registrar un nuevo usuario', async ()=>{
        const usertMock =  {
            firts_name: 'User', 
            last_name: 'Mock', 
            age: 55, 
            email: 'mock@gmail.com', 
            password: '123456',
            role: 'user'
        } 
        const result = await requester.post('/api/sessions/register').send(usertMock)
        const cookieResult = result.headers['set-cookie'][0]
        
        expect(cookieResult).to.be.ok
    })


    it('Debe loguear correctamente a un usuario y DEVOLVER UNA COOKIE', async ()=>{
        const mockUser = {
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123'
        }

        const result = await requester.post('/api/sessions/login').send(mockUser)
        
        const cookieResult = result.headers['set-cookie'][0]
        
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        console.log ('Result', cookie)
        expect(cookie.name).to.be.ok.and.eql('token')
        expect(cookie.value).to.be.ok
    })
    
    it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async ()=>{
        console.log('Cookie', cookie)
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/sessions/current').set('cookie', [`${cookie.name}=${cookie.value}`])

         console.log(_body)
         expect(statusCode).to.be.equal(200)
    })
 });