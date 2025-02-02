const express = require("express");
const CartsRepo = require("../repositories/carts");
const router = express.Router();

router.post("/cart/products", async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // we do not have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await CartsRepo.create({items: []});
    req.session.cartId = cart.id;
  } else {
    // we have a cart! LEts get it from the repository
    cart = await CartsRepo.getOne(req.session.cartId);
  }
  const existingProduct = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingProduct) {
    // increase quantity and save cart
    existingProduct.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({id: req.body.productId, quantity: 1});
  }
  await CartsRepo.update(cart.id, {items: cart.items});

  res.send("Product added to cart");
});

// router.get("/", async (req, res) => {});

// router.post("/", async (req, res) => {});

module.exports = router;
