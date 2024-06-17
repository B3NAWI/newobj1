const slugify = require("slugify")
const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validarotMiddleware")
const Users = require("../models/Users")


exports.createUserValid = [
    check('user')
        .notEmpty()
        .withMessage("User required")
        .custom((val, { req }) => {
            req.body.slug = slugify(val)
            return true
        }),
    check('email')
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid Email address")
        .custom((val) =>
            Users.findOne({ email: val })
                .then((user) => {
                    if (user) {
                        return Promise.reject(new Error("E-mail already in used"))
                    }
                })
        )
    ,
    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters")
    ,

    check("phone")
        .isMobilePhone(["ar-EG", "ar-SY", "ar-JO", "ar-LB", "ar-PS"])
        .withMessage("Invalid phone")
    // .optional()
    ,
    check("date")
        .notEmpty()
        .withMessage("Password required")
    ,
    validatorMiddleware
]


exports.loginValidator = [
    check('user')
        .notEmpty()
        .withMessage("User required"),
    // .custom((val, { req }) => {
    //     req.body.slug = slugify(val)
    //     return true
    // }),
 
    // check('email')
    //     .notEmpty()
    //     .withMessage("Email required")
    // .isEmail()
    // .withMessage("Invalid Email address")

    // ,
    check("password")
        .notEmpty()
        .withMessage("Password required")
    // .isLength({ min: 6 })
    // .withMessage("password must be at least 6 characters")
    ,


    validatorMiddleware
]
exports.ChangePasswordValidator = [

    check("oldPassword")
        .notEmpty()
        .withMessage("old Password required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters")
    ,
    check("newPassword")
        .notEmpty()
        .withMessage("new Password required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters")
    ,
    check("conNewPassword")
        .notEmpty()
        .withMessage("confirm New Password required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 characters")
    ,
    validatorMiddleware
]







