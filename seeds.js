const mongoose = require('mongoose');
const Product = require('./model/product')

mongoose.connect('mongodb://localhost:27017/products', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log('DB error!');
    console.log(err);
})

const seedData = [
    {
        name: 'Banana',
        price: 3,
        category: 'fruit'
    },
    {
        name: 'spinach',
        price: 6,
        category: 'vegetable'
    }
]

const seed = async function () {
    await Product.deleteMany({});
    await Product.insertMany(seedData).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
}

seed();
