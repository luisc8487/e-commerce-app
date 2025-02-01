const express = require("express");
const multer = require("multer");

const {handleErrors, requireAuth} = require("./middlewares");
const ProductsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const prodcutsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const {requireTitle, requirePrice} = require("./validators");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await ProductsRepo.getAll();
  res.send(prodcutsIndexTemplate({products}));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }
    const image = req.file.buffer.toString("base64");
    const {title, price} = req.body;
    await ProductsRepo.create({title, price, image});

    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await ProductsRepo.getOne(req.params.id);

  if (!product) {
    return res.send("Prduct not found");
  }
  res.send(productsNewTemplate({product}));
});

router.post("/admin/products/:id/edit", requireAuth, async (req, res) => {
  
});

module.exports = router;
