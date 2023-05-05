const router = require("express").Router();
const authorized = require("../middlewares/Authorize")
const admin = require("../middlewares/Admin")
const {Products, Warehouse ,Supervisor}= require("../Models/DB")
const { body, validationResult } = require("express-validator");
//upload images
const upload = require("../middlewares/uploadImages")
const fs = require("fs")

//Admin [create, update, delete, List]
                             
//CREATE Product
router.post('/create',

    // authorized,
    // admin,
    upload.single("photo"), //images middleware
    body("name")
        .isString().withMessage("please enter a valid product name!")
        .isLength({ min: 2 })
        .withMessage("please enter a valid product name"),
    body("description")
        .isString()
        .withMessage("please enter a valid description!")
        .isLength({ min: 10 })
        .withMessage("Description should be between 10:20"),
    body("warehouse_id")
        .isLength({ min: 1, max:20 })
        .withMessage("Enter a valid warehouse id"),


    async (req, res) => {
        try {

            //1- Request Validation (express validation)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //validate warehouse existance
        const warehouse = await Warehouse.findOne({
            where: {
                id: req.body.warehouse_id
            }
        });

        if (!warehouse) {
            res.status(404).json({
                error: [
                    {
                        msg: "The warehouse doesn't exist!"
                    }
                ]
            })
        }

        //2- Validate the image
        if (!req.file) {
            return res.status(400).json({
                msg: "Image is required"
            });
        }

        //3- prepare object to be created
        const productData = {
            name: req.body.name,
            description: req.body.description,
            photo: req.file.filename,
            stock: req.body.stock,
            warehouse_id: req.body.warehouse_id
        }

        //4- insert into the table "products"
        const product = await Products.create(productData);
        res.status(200).json(product);

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }

}
)


//Update product
router.put('/update/:id',

    // authorized,
    // admin,
    upload.single("photo"), //images middleware
    body("name")    //validate name
        .isString().withMessage("please enter a valid product name!")
        .isLength({ min: 2 })
        .withMessage("please enter a valid product name"),
    body("description") //validate description
        .isString()
        .withMessage("please enter a valid description!")
        .isLength({ min: 10 })
        .withMessage("Description should be between 10:20"),
    body("warehouse_id")    //validate warehouse forigen key
        .isLength({ min: 1, max:20 })
        .withMessage("Enter a valid warehouse id"),

    async (req, res) => {
        try {
            //1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            //2- check Product existance
            const product = await Products.findByPk(req.params.id)
            if (!product) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "the product doesn't exist!"
                        }
                    ]
                })
            }
    
            //3- prepare object to be created
            const productData = {
                name: req.body.name,
                description: req.body.description,
                stock: req.body.stock,
                warehouse_id:req.body.warehouse_id
            }
            
            if (req.file){
                productData.photo= req.file.filename
                //delete old image
                fs.unlinkSync("./Upload/"+ product.photo)
            }
    
            //4- update product
            await product.update(productData)
            res.status(200).json(productData)
    
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err.message });
        }
    }
)

//delete product
router.delete('/delete/:id',
    authorized,
    admin,
    async (req, res) => {
        try {
            //1- check product existance
            const checkProductExist = await Products.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (!checkProductExist) {
                res.status(404).json({
                    error: [
                        {
                            msg: "the Product doesn't exist!"
                        }
                    ]
                });
            }
    
            //2- remove movie photo from the files
            fs.unlinkSync("./Upload/" + checkProductExist.photo);
    
            //3- delete from the table "Product"
            await Products.destroy({
                where: {
                    id: checkProductExist.id
                }
            });
            
            res.status(200).json({
                msg: "product deleted successfully"
            });
    
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)

//get all products
router.get('', 
// admin, 
// authorized, 
async (req, res) => {
    try {
      const products = await Products.findAll();
      const productsWithPhotoUrl = products.map(product => {
        return {
          ...product.toJSON(),
          photo: `http://${req.hostname}:5000/${product.photo}`
        }
      });
      res.status(200).json({ Products: productsWithPhotoUrl });
    } catch (err) {
      console.log(err);
      res.status(404).json({ err: console.log(err) });
    }
  });

//user [ List] for a specific warehouse
router.get('/warehouse/:id',
    // authorized,

    async (req, res) => {

        try {
    
            //1- check warehouse existence
            const warehouse = await Warehouse.findByPk(req.params.id);
            if (!warehouse) {
                res.status(404).json({
                    error: [
                        {
                            msg: "The warehouse doesn't exist!"
                        }
                    ]
                })
            }
    
            const products = await Products.findAll({
                where: { warehouse_id: req.params.id },
                attributes: ['id', 'name', 'description', 'photo', 'stock'],
                include: {
                    model: Warehouse,
                    attributes: ['id']
                }
            });
    
            products.map(product => {
                product.photo = `http://${req.hostname}:5000/${product.photo}`
            })
    
            res.status(200).json({
                products
            })
    
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)
// get the product of a specific supervisor
router.get('/supervisor/:id', async (req, res) => {
    try {
      const supervisorId = req.params.id;
  
      // Check if supervisor exists
      const supervisor = await Supervisor.findOne({ where: { id: supervisorId } });
      if (!supervisor) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }
  
      // Get all products for the supervisor's warehouse
      const products = await Products.findAll({
        where: { warehouse_id: supervisor.warehouse_id },
        attributes: ['id', 'name', 'description', 'photo', 'stock'],
        include: {
          model: Warehouse,
          attributes: ['id'],
        },
      });
  
      products.forEach((product) => {
        product.photo = `http://${req.hostname}:5000/${product.photo}`;
      });
  
      res.status(200).json({ products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

//user [ List] for a specific product
router.get('/:id',
    authorized,

    async (req, res) => {

        try {
    
            //1- check product existence
            const product = await Products.findByPk(req.params.id);
            if (!product) {
                res.status(404).json({
                    error: [
                        {
                            msg: "The product doesn't exist!"
                        }
                    ]
                })
            }
    
            product.photo = `http://${req.hostname}:5000/${product.photo}`;
    
            res.status(200).json({
                product
            })
    
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)

module.exports = router; 