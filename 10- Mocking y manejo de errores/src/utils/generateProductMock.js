import { faker } from '@faker-js/faker'


export const generateProduct = () => {

    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
       // code: faker.code.code(),
        stock: parseInt(faker.string.numeric()),
        //category: faker.category.category()
    }
}