const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./model/product');
const Farm = require('./model/farm');
const path = require('path');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/farms', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.log('DB error!');
    console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/', (req, res) => {
    res.redirect('/farms')
})

// Farm Routes
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
    res.render('farms/new');
});

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
});

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', { farm });
});

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id)
    res.render('products/new', { farm })
});

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id)
    const product = new Product(req.body);
    farm.products.push(product);
    product.farms = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);
});

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
});

// Product Routes
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: `${category}` })
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category });
    }
});

app.get('/products/new', (req, res) => {
    res.render('products/new');
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products')
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farms', 'name');
    res.render('products/show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
});

app.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true, useFindAndModify: false });
    res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    await Product.findByIdAndDelete(id);
    res.redirect(`/farms/${product.farms._id}`);

});

/*
class AppError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message
    }
}

app.get('/error', (req, res) => {
    // throw new AppError(300, 'Error!')
    chicken.fly();
})

app.use((err, req, res, next) => {
    const { status = 700, message = 'Something went wrong' } = err
    console.log(status, err.message);
    next(err.message)
    // res.status(status).send('Error!')
})
*/

app.listen(3000, () => {
    console.log('listening to port 3000');
});