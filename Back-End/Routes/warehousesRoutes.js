const router = require("express").Router();
const authorized = require("../middlewares/Authorize")
const admin = require("../middlewares/Admin")
const { body, validationResult } = require("express-validator");
const { Warehouse } = require("../Models/DB"); // Importing Warehouse model

//Admin [create, update, delete, List]


//create warehouse
router.post('/create',
    // authorized,
    // admin,
    body("name")
        .isString().withMessage("please enter a valid warehouse name!")
        .isLength({ min: 1 })
        .withMessage("please enter a valid warehouse name"),
    body("location")
        .isString()
        .withMessage("please enter a valid name!"),
    async (req, res) => {
        try {
            // 1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- prepare object to be created
            const warehouseData = {
                name: req.body.name,
                location: req.body.location,
                status: req.body.status
            }

            // 3- insert into the table "warehouses"
            const warehouse = await Warehouse.create(warehouseData);
            res.status(200).json(warehouse);

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);


//Update WAREHOUSE
router.put('/update/:id',
    authorized,
    admin,
    body("name")
        .isString().withMessage("please enter a valid warehouse name!")
        .isLength({ min: 1 })
        .withMessage("please enter a valid warehouse name"),
    body("location")
        .isString()
        .withMessage("please enter a valid name!"),

    async (req, res) => {
        try {
            //1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2- check warehouse existence
            const warehouse = await Warehouse.findByPk(req.params.id);
            if (!warehouse) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "the warehouse doesn't exist!"
                        }
                    ]
                })
            }

            //3- prepare object to be updated
            const warehouseData = {
                name: req.body.name,
                location: req.body.location,
                status: req.body.status
            }

            //4- update the warehouse record
            await warehouse.update(warehouseData);
            res.status(200).json(warehouseData);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);


//delete WAREHOUSE
router.delete('/delete/:id',
    authorized,
    admin,
    async (req, res) => {

        try {
            //1- check warehouse existence
            const warehouse = await Warehouse.findByPk(req.params.id);
            if (!warehouse) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "the warehouse doesn't exist!"
                        }
                    ]
                })
            }

            //2- delete from the table "warehouses"
            await Warehouse.destroy({ where: { id: warehouse.id } });

            res.status(200).json({
                msg: "warehouse deleted successfully"
            })

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)


// get all warehouses
router.get('',

    // authorized,
    // admin,

    async (req, res) => {
        try {
            const warehouses = await Warehouse.findAll();
            res.status(200).json({ warehouses });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    });


//Admin [ LIST ] => specific warehouse.
router.get('/:id',
    authorized,
    admin,

    async (req, res) => {

        try {
            const warehouse = await Warehouse.findByPk(req.params.id);
            if (!warehouse) {
                res.status(404).json({
                    error: [
                        {
                            msg: "the warehouse doesn't exist!"
                        }
                    ]
                });
                return;
            }
            res.status(200).json({
                warehouse
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);





module.exports = router;