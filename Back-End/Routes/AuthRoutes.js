const router = require("express").Router();
const authorized = require("../middlewares/Authorize")
const admin = require("../middlewares/Admin")
const { User } = require("../Models/DB");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt") // to encrypt the pasword
const cryptoJs = require("crypto");// token generator


//Registration

router.post(
    "/register",
    body("email")
        .isEmail()
        .withMessage("please enter a valid email"),
    body("phone")
        .isMobilePhone()
        .withMessage("number Phone is not valid")
        .isLength({ min: 11, max: 11 })
        .withMessage("phone should be 11 numbers only"),
    body("password")
        .isLength({ min: 8, max: 16 })
        .withMessage("please enter a valid password, 8:16 chars"),
    body("status"),
    body("type"),
    async (req, res) => {
        try {
            //1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //2- Validate Email existence
            const checkEmailExist = await User.findOne({
                where: { email: req.body.email },
            });
            if (checkEmailExist) {
                return res.status(400).json({
                    error: [
                        {
                            msg: "the email is used by another user, please check your email!",
                        },
                    ],
                });
            }

            //3- prepare user object to be inserted
            const hashedPassword = await bcrypt.hash(req.body.password, 10); //hashing user password to be saved in the db
            const token = cryptoJs.randomBytes(16).toString("hex"); //Random encryption standard

            const userData = {
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                status: req.body.status,
                type: req.body.type,
                token: token,
            };

            //4- insert user object into the users table
            const createdUser = await User.create(userData);
            const responseData = {
                email: createdUser.email,
                phone: createdUser.phone,
                status: createdUser.status,
                type: createdUser.type,
                token: createdUser.token,
            };
            return res.status(200).json(responseData);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    }
);

// Login
router.post(
    '/login',
    body('email')
        .isEmail()
        .withMessage('please enter a valid email'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('please enter a valid password, 8:16 chars'),
    async (req, res) => {
        try {
            // 1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- Validate Email existance
            const user = await User.findOne({ where: { email: req.body.email } });
            if (!user) {
                res.status(400).json({
                    error: [
                        {
                            msg: 'email does not exist , please check your email!',
                        },
                    ],
                });
            }

            // 3- compare password
            const checkPassword = await bcrypt.compare(req.body.password, user.password);
            if (checkPassword) {
                delete user.password;
                res.status(200).json(user);
            } else {
                res.status(400).json({
                    error: [
                        {
                            msg: 'password is wrong , please check your password!',
                        },
                    ],
                });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    },
);

//get all users
router.get('',
    // admin,
    // authorized,

    async (req, res) => {

        try {
            const Users = await User.findAll();
            res.status(200).json({ Users });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)

//user [ List] for a specific User
router.get('/getUser/:id',
    authorized,
    admin,

    async (req, res) => {

        try {
            // 1- check user existence
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "The user doesn't exist!",
                        },
                    ],
                });
            }

            res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err.message });
        }
    }
)


//delete user
router.delete('/delete/:id',
    authorized,
    admin,
    async (req, res) => {

        try {
            // 1. Check user existence
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({
                    error: [
                        {
                            msg: "the user doesn't exist!",
                        },
                    ],
                });
            }

            // 2. Delete user from the table "User"
            await User.destroy({
                where: { id: user.id },
            });


            res.status(200).json({
                msg: 'user deleted successfully',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
)


//Update user
router.put('/update/:id',
    authorized,
    admin,

    async (req, res) => {
        try {
            // 1- Request Validation (express validation)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 4- Validate user existence
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({
                    error: [
                        { msg: "The user doesn't exist!" }
                    ]
                });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10); //hashing user password to be saved in the db

            // 6- Prepare object to be updated
            const userData = {
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                status: req.body.status,
                type: req.body.type,
            };

            // 7- Update user
            await User.update(userData, { where: { id: req.params.id } });
            res.status(200).json(userData);

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }
);

module.exports = router;
