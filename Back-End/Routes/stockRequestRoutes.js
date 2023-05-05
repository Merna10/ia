const router = require("express").Router();
const authorized = require("../middlewares/Authorize");
const admin = require("../middlewares/Admin");
const { body, validationResult } = require("express-validator");
const { Supervisor, StockRequest, Products, Warehouse, User } = require("../Models/DB"); // Importing Warehouse model

//Admin [create, update, delete, List]

//create Stockrequest
router.post(
  "/create",
  authorized,

  body("supervisor_id")
    .isNumeric()
    .withMessage("please enter a valid supervisor id !")
    .isLength({ min: 1 })
    .withMessage("please enter a valid supervisor id"),
  body("products_id")
    .isNumeric()
    .withMessage("please enter a valid product id !")
    .isLength({ min: 1 })
    .withMessage("please enter a valid product id"),
  body("quantity").isNumeric().withMessage("please enter a valid qantity !"),

  async (req, res) => {
    try {
      // 1- Request Validation (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //validate warehouse existance
      const supervisor = await Supervisor.findOne({
        where: { id: req.body.supervisor_id }
      });

      if (!supervisor) {
        res.status(404).json({
          error: [
            {
              msg: "the supervisor doesn't exist!"
            }
          ]
        })
      }

      //validate warehouse existance
      const product = await Products.findOne({
        where: { id: req.body.products_id }
      });

      if (!product) {
        res.status(404).json({
          error: [
            {
              msg: "the product doesn't exist!"
            }
          ]
        })
      }

      // 2- prepare object to be created
      const stockReqeustData = {
        supervisor_id: req.body.supervisor_id,
        products_id: req.body.products_id,
        quantity: req.body.quantity,
      };

      // 3- insert into the table "warehouses"
      const stockrequest = await StockRequest.create(stockReqeustData);
      res.status(200).json(stockrequest);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  }
);

//update stock reqeust
router.put('/update/:id',
  authorized,
  admin,
  [
    body('supervisor_id')
      .isNumeric()
      .withMessage('Please enter a valid supervisor id!')
      .isLength({ min: 1 })
      .withMessage('Please enter a valid supervisor id'),
    body('products_id')
      .isNumeric()
      .withMessage('Please enter a valid product id!')
      .isLength({ min: 1 })
      .withMessage('Please enter a valid product id'),
    body('quantity')
      .isNumeric()
      .withMessage('Please enter a valid quantity!')
  ],
  async (req, res) => {
    try {
      // 1- Request Validation (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- validate stock request existance
      const stockRequest = await StockRequest.findByPk(req.params.id);
      if (!stockRequest) {
        return res.status(404).json({
          error: [
            { msg: 'The stock request does not exist!' }
          ]
        });
      }

      // 3- validate supervisor existence
      const supervisor = await Supervisor.findOne({
        where: { id: req.body.supervisor_id }
      });
      if (!supervisor) {
        return res.status(404).json({
          error: [
            { msg: 'The supervisor does not exist!' }
          ]
        });
      }

      // 4- validate product existence
      const product = await Products.findOne({
        where: { id: req.body.products_id }
      });
      if (!product) {
        return res.status(404).json({
          error: [
            { msg: 'The product does not exist!' }
          ]
        });
      }

      // 5- prepare object to be updated
      const stockRequestData = {
        supervisor_id: req.body.supervisor_id,
        products_id: req.body.products_id,
        quantity: req.body.quantity,
        status: req.body.status
      };

      // 6- update the record
      const [_, updatedStockRequest] = await StockRequest.update(
        stockRequestData,
        { where: { id: req.params.id }, returning: true }
      );

      // 7- send the response
      res.status(200).json(updatedStockRequest[0]);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

//delete stock reqeust
router.delete('/delete/:id',
  authorized,
  admin,
  async (req, res) => {

    try {
      // 1- Request Validation (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- validate stock request existance
      const stockRequest = await StockRequest.findByPk(req.params.id);
      if (!stockRequest) {
        return res.status(404).json({
          error: [
            { msg: 'The stock request does not exist!' }
          ]
        });
      }
      //2- delete from the table "warehouses"
      await StockRequest.destroy({ where: { id: stockRequest.id } });

      res.status(200).json({
        msg: "stock reqeust deleted successfully"
      })

    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
)

// get all stock reqeusts
router.get('',
  authorized,
  async (req, res) => {
    try {
      const stockRequests = await StockRequest.findAll({
        include: [
          {
            model: Supervisor,
            include: [
              {
                model: User,
              },
              {
                model: Warehouse,
              }
            ],
          },
          {
            model: Products,
          },
        ],
      });

      res.status(200).json({
        stockRequests,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);


//Admin [ LIST ] => specific stock request.
router.get('/:id',
  authorized,
  admin,

  async (req, res) => {

    try {
      const stockreqeust = await StockRequest.findByPk(req.params.id);
      if (!stockreqeust) {
        res.status(404).json({
          error: [
            {
              msg: "the stock reqeust doesn't exist!"
            }
          ]
        });
        return;
      }
      res.status(200).json({
        stockreqeust
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);

// get all stock request for a specific supervisor
router.get('/supervisor/:id',
  authorized,
  async (req, res) => {
    try {
      const stockRequests = await StockRequest.findAll({
        include: [
          {
            model: Supervisor,
            where: { id: req.params.id },
            include: [
              {
                model: User,
              },
              {
                model: Warehouse,
              }
            ],
          },
          {
            model: Products,
          },
        ],
      });

      res.status(200).json({
        stockRequests,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);


router.put('/Approve',
  authorized,
  admin,
  async (req, res) => {
    let transaction;
    try {
      // 1- Request Validation (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- validate stock request existence
      const stockRequest = await StockRequest.findByPk(req.body.id);
      if (!stockRequest) {
        return res.status(404).json({
          error: [
            { msg: 'The stock request does not exist!' }
          ]
        });
      }

      // 3- validate supervisor existence
      const supervisor = await Supervisor.findOne({
        where: { id: stockRequest.supervisor_id }
      });
      if (!supervisor) {
        return res.status(404).json({
          error: [
            { msg: 'The supervisor does not exist!' }
          ]
        });
      }

      // 4- validate product existence
      const product = await Products.findOne({
        where: { id: stockRequest.products_id }
      });
      if (!product) {
        return res.status(404).json({
          error: [
            { msg: 'The product does not exist!' }
          ]
        });
      }

      // 5- prepare object to be updated
      const stockRequestData = {
        status: req.body.status,
      };

      const productData = {
        stock: req.body.stock,
      };

      transaction = await StockRequest.sequelize.transaction();

      // 6- update the stock request status
      await stockRequest.update(stockRequestData, { transaction });

      // 7- update the product stock
      await product.update(productData, { transaction });

      await transaction.commit();

      // 8- send the response
      res.status(200).json({
        message: 'The stock request and product were updated successfully!'
      });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


router.put('/decline',
  authorized,
  admin,
  async (req, res) => {
    
    try {
      // 1- Request Validation (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- validate stock request existence
      const stockRequest = await StockRequest.findByPk(req.body.id);
      if (!stockRequest) {
        return res.status(404).json({
          error: [
            { msg: 'The stock request does not exist!' }
          ]
        });
      }

      // 3- validate supervisor existence
      const supervisor = await Supervisor.findOne({
        where: { id: stockRequest.supervisor_id }
      });
      if (!supervisor) {
        return res.status(404).json({
          error: [
            { msg: 'The supervisor does not exist!' }
          ]
        });
      }

      
      // 5- prepare object to be updated
      const stockRequestData = {
        status: req.body.status,
      };



      // 6- update the stock request status
      await stockRequest.update(stockRequestData);

      // 8- send the response
      res.status(200).json({
        message: 'The stock request is updated successfully!'
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


module.exports = router;
