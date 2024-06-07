import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Fetch all products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: 'i'}} : {};

  const count = await Product.countDocuments({...keyword});

  const products = await Product.find({...keyword}).limit(pageSize)
    .skip(pageSize*(page-1));
  res.json({products, page, pages: Math.ceil(count/pageSize)});
});

// Fetch product by ID
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error(`Error fetching product by ID: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new Product (admin access only)
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample Description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Error creating product: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product by ID (admin access only)
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      brand,
      category,
      price,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.countInStock = countInStock || product.countInStock;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error(`Error updating product: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

//delete a product, admin access only
// DELETE/api/products/:id
const deleteProduct = asyncHandler(async(req,res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id }); // Use deleteOne to delete the product
      res.status(200).json({ message: 'Product Deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error deleting product: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// create a review 
// POST/api/products/:id/reviews
const createProductReview = asyncHandler(async(req,res) => {
  const {rating , comment} = req.body;

  const product = await Product.findById(req.params.id);

  if(product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if(alreadyReviewed){
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc,review) => acc + review.rating, 0) / (product.numReviews); 

    await product.save();
    res.status(201).json({message: 'Review added'});
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
})


// Get top rated products
// GET/api/products/top
// public
const getTopProducts = asyncHandler(async(req,res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(3);

  res.status(200).json(products);
})


export { getProductById, getProducts, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts };
