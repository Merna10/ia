const router = require("express").Router();
const authorized = require("../middlewares/Authorize")
const admin = require("../middlewares/Admin")
const { body, validationResult } = require("express-validator");
const { Supervisor, Warehouse, User } = require("../Models/DB")



//Admin [create, update, delete, List]
//CREATE supervisor
router.post('/create',
    authorized,
    admin,

    // body("warehouse_id")
    //     .isNumeric()
    //     .withMessage("you should enter a valid warehouse id")
    //     .isLength({ min: 1, max: 20 })
    //     .withMessage("Enter a valid warehouse id"),

    body("user_id")
        .isNumeric()
        .withMessage("you should enter a valid user id")
        .isLength({ min: 1, max: 20 })
        .withMessage("Enter a valid user id"),

    async (req, res) => {
        try { 

            //1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //validate warehouse existance
            const warehouse = await Warehouse.findOne({
                where: { id: req.body.warehouse_id }
            });

            if (!warehouse) {
                res.status(404).json({
                    error: [
                        {
                            msg: "the warehouse doesn't exist!"
                        }
                    ]
                })
            }

            //validate user existance
            const user = await User.findOne({
                where: { id: req.body.user_id }
            });

            if (!user) {
                res.status(404).json({
                    error: [
                        {
                            msg: "the user doesn't exist!"
                        }
                    ]
                })
            }

            //validate user existance in supervisors
            const supervisor = await Supervisor.findOne({
                where: { user_id: req.body.user_id }
            });

            //3- prepare object to be created
            const supervisorData = {
                warehouse_id: req.body.warehouse_id,
                user_id: req.body.user_id
            }

            //4- insert into the table "supervisors"
            if (!supervisor) {
                await Supervisor.create(supervisorData);
                await User.update({ type: 'supervisor' }, { where: { id: supervisorData.user_id } });
                res.status(200).json(supervisorData);
            } else {
                res.status(404).json({
                    error: [
                        {
                            msg: "the user already has a warehouse"
                        }
                    ]
                })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }

    }
)


//Update supervisor
router.put('/update/:id',
    authorized,
    admin,
    body("warehouse_id")
        .isNumeric()
        .withMessage("you should enter a valid warehouse id")
        .isLength({ min: 1, max: 20 })
        .withMessage("Enter a valid warehouse id"),
    body("user_id")
        .isNumeric()
        .withMessage("you should enter a valid user id")
        .isLength({ min: 1, max: 20 })
        .withMessage("Enter a valid user id"),
    async (req, res) => {
        try {
            // 1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- Check supervisor existence
            const supervisor = await Supervisor.findByPk(req.params.id);
            if (!supervisor) {
                return res.status(404).json({
                    error: [
                        { msg: "The supervisor doesn't exist!" }
                    ]
                });
            }

            // 3- Validate warehouse existence
            const warehouse = await Warehouse.findByPk(req.body.warehouse_id);
            if (!warehouse) {
                return res.status(404).json({
                    error: [
                        { msg: "The warehouse doesn't exist!" }
                    ]
                });
            }

            // 4- Validate user existence
            const user = await User.findByPk(req.body.user_id);
            if (!user) {
                return res.status(404).json({
                    error: [
                        { msg: "The user doesn't exist!" }
                    ]
                });
            }

            // 5- Validate user existence in supervisors
            const userExistsInSupervisor = await Supervisor.findOne({
                where: { user_id: req.body.user_id }
            });
            if (userExistsInSupervisor && userExistsInSupervisor.id !== supervisor.id) {
                return res.status(404).json({
                    error: [
                        { msg: "The user already has a warehouse" }
                    ]
                });
            }

            // 6- Prepare object to be updated
            const supervisorData = {
                warehouse_id: req.body.warehouse_id,
                user_id: req.body.user_id
            };

            // 7- Update supervisor
            await supervisor.update(supervisorData);
            res.status(200).json(supervisorData);

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);

//delete supervisor
router.delete('/delete/:id',
    authorized,
    admin,
    async (req, res) => {

        try {
            // 1. Check supervisor existence
            const supervisor = await Supervisor.findByPk(req.params.id);
            if (!supervisor) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "the Supervisor doesn't exist!",
                        },
                    ],
                });
            }

            // 2. Delete supervisor from the table "supervisor"
            await Supervisor.destroy({
                where: { id: supervisor.id },
            });

            // 3. Update user type to empty string
            await User.update({ type: '' }, {
                where: { id: supervisor.user_id },
            });

            res.status(200).json({
                msg: 'supervisor deleted successfully',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)

//get all supervisors
router.get('',
    // admin,
    // authorized,

    async (req, res) => {

        try {
            const supervisors = await Supervisor.findAll();
            res.status(200).json({ supervisors });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)

//user [ List] for a specific superviser
router.get('/:id',
    authorized,

    async (req, res) => {

        try {
            // 1- check supervisor existence
            const supervisor = await Supervisor.findOne({ where: { id: req.params.id } });
            if (!supervisor) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "The supervisor doesn't exist!",
                        },
                    ],
                });
            }

            res.status(200).json({ supervisor });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err.message });
        }
    }
)

//specific supervisor with specific user

router.get('/User/:id', 
// authorized,
 async (req, res) => {
  try {

    // 1. Find the user based on the id
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: [{ msg: "The user doesn't exist!" }],
      });
    }

    // 2. Find the supervisor data associated with the user
    const supervisor = await Supervisor.findOne({ where: { user_id: user.id } });
    if (!supervisor) {
      return res.status(404).json({
        error: [{ msg: "The supervisor doesn't exist for this user!" }],
      });
    }

    // 3. Return the supervisor data
    res.status(200).json({ supervisor });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});




module.exports = router;