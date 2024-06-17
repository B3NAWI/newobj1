const express = require('express')
const router = express.Router()
const Users = require("../models/Users")
const jwt = require('jsonwebtoken')
const asyncHandler = require("express-async-handler")
// const ApiError = require("../middlewares/apiError")
const crypto = require('crypto')
const bcrypt = require("bcryptjs")
const { loginValidator, createUserValid } = require("../validators/uservalidators")
const Tokens = require('../models/token')
const { ChangePasswordValidator } = require('../validators/uservalidators')
const sendEmail = require("../middlewares/email")


const passport = require("passport");


// router.get('/login/success', (req, res) => {
//     if (req.user) {
//         res.status(200).json({
//             error:false,
//             message:"Successfully Loged in",
//             user:req.user,

//         })
//         console.log("1")
//     } else {
//         res.status(403).json({ error: true, message: "Not Authorized" })
//         console.log("2")

//     }
// })

// router.get("/login/failed", (req, res) => {
//     res.status(401).json({
//         error: true,
//         message: 'log in failure'
//     })
//     console.log("3")

// })

// router.get("/google/callback",
//     passport.authenticate("google", {
//         successRedirect: `${process.env.CLIENT_URL}`,
//         failureRedirect: "/login/failed",
//     })

// )

// router.get("/google",passport.authenticate("google",["profile","email"] ,console.log("5")))

// router.get('/logout1',(req,res)=>{
//    req.logout()
//    res.redirect(`${process.env.CLIENT_URL}/cline`) 
//    console.log("0")

// })

const craeteAdminToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME })
const refreshAdminToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_ADMIN_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_TIME })

const craeteClineToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_CLINE_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME })
const refreshClineToken = (payload) =>
    jwt.sign({ userId: payload }, process.env.JWT_ADMIN_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_TIME })



router.post("/register", createUserValid, (req, res) => {
    const { email, password, password2, user, phone, select, date } = req.body;
    const newUser = new Users({ email, password, user, select, date, phone });
    res.status(201).json(newUser)
    newUser
        .save()
})

router.post("/login", loginValidator,
    asyncHandler(async (req, res, next) => {
        const email = await Users.findOne({ email: req.body.email })
        const user = await Users.findOne({ user: req.body.user })

        /* token Admin */

        if (user) {
            if (user.role === "admin") {
                if (!(await bcrypt.compare(req.body.password, user.password))) {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "Incorrect email or password",
                            },
                        ],
                    });
                }
                if (user.active === "true") {
                    const token = craeteAdminToken(user._id)
                    const decoded = jwt.decode(token)
                    const retoken = refreshAdminToken(user._id)
                    // console.log(token) 
                    const newToken = new Tokens({ token: token, retoken: retoken });
                    res.status(201).json({ data: user, token: token, retoken: retoken, decoded: decoded })
                    newToken.save()
                } else {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "band",
                            },
                        ],
                    });
                }
            }
            else {
                if (!(await bcrypt.compare(req.body.password, user.password))) {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "Incorrect email or password",
                            },
                        ],
                    });
                }
                if (user.active === "true") {
                    const token = craeteClineToken(user._id)
                    const retoken = refreshClineToken(user._id)
                    const decoded = jwt.decode(token)
                    const newToken = new Tokens({ token: token, retoken: retoken });
                    res.status(201).json({ data: user, token: token, retoken: retoken, decoded: decoded })
                    newToken.save()
                } else {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "band",
                            },
                        ],
                    });
                }
            }
        }
        else {
            res.status(401).json({
                errors: [
                    {
                        msg: "Incorrect email or password",
                    },
                ],
            });
        }
    })
)

router.post("/refreshToken", async (req, res) => {
    let refreshToken
    if (req.headers.authorization) {
        refreshToken = req.headers.authorization.split(' ')[1];
    }
    const refreshTokenDB = await Tokens.findOne({ retoken: refreshToken })

    // If token is not provided, send error message
    if (!refreshToken) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
        console.log("Token not found")
    }

    // // If token does not exist, send error message

    else if (refreshToken && refreshTokenDB) {
        try {
            try {
                const userverify = await jwt.verify(refreshToken, process.env.JWT_ADMIN_REFRESH_KEY);
                const user = await Users.findOne({ _id: userverify.userId });
                const token = craeteAdminToken(user._id);
                const decoded = jwt.decode(token)
                await Tokens.findByIdAndUpdate(refreshTokenDB._id, { token: token });
                res.status(201).json({ data: user, token: token, decoded: decoded });
            } catch (err) {
                const userverify = await jwt.verify(refreshToken, process.env.JWT_CLINE_REFRESH_KEY);
                const user = await Users.findOne({ _id: userverify.userId });
                const token = craeteAdminToken(user._id);
                const decoded = jwt.decode(token)
                await Tokens.findByIdAndUpdate(refreshTokenDB._id, { token: token });
                res.status(201).json({ data: user, token: token, decoded: decoded, refreshToken: refreshTokenDB });
            }
        } catch (error) {
            res.status(401).json({
                errors: [
                    {
                        msg: "Invalid token",
                    },
                ],
            });
            console.log("err err err")
        }
    }
});

router.patch("/forgotpassword", async (req, res) => {
    const user = await Users.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({
            errors: [
                {
                    msg: "we could not find the user with given email",
                },
            ],
        });
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false })
    // const resetUrl = `${req.protocol}://${req.get('host')}/auth/PatchPassword/${resetToken}`;
    const resetUrl = `http://localhost:3000/ResetePassword/${resetToken}`;
    const message = `saddsa sa dsad sad sad sa\n\n${resetUrl}\n\nfdsfds fds df gs`

    try {
        await sendEmail({
            email: user.email,
            subject: "password change request received",
            message: message,
        })
        res.status(200).json({
            status: 'success',
            message: 'password reset link send to the user email'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false })
        return res.status(500).json({
            errors: [
                {
                    msg: "please try agine later",
                },
            ],
        });
    }
})

router.patch("/resetPassword/:token", async (req, res) => {
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await Users.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "Token is invalid or has expired",
                    },
                ],
            });
        }

        console.log(req.body.password)
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const updateResult = await Users.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    passwordChangedat: Date.now(),
                },
                $unset: {
                    passwordResetToken: "",
                    passwordResetTokenExpires: ""
                }
            }
        );
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "Failed to update user",
                    },
                ],
            });
        }
        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
})

router.patch("/verifyEmail", async (req, res) => {
    const user = await Users.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({
            errors: [
                {
                    msg: "we could not find the user with given email",
                },
            ],
        });
    }

    const resetToken = user.createverifyEmailToken();
    await user.save({ validateBeforeSave: false })
    // const resetUrl = `${req.protocol}://${req.get('host')}/auth/PatchPassword/${resetToken}`;
    const resetUrl = `http://localhost:3000/cline/user/verifyEmail/${resetToken}`;
    const message = `saddsa sa dsad sad sad sa\n\n${resetUrl}\n\nfdsfds fds df gs`

    try {
        await sendEmail({
            email: user.email,
            subject: "Verify Email request received",
            message: message,
        })
        res.status(200).json({
            status: 'success',
            message: 'password reset link send to the user email'
        })
    } catch (error) {
        user.verifyEmailToken = undefined;
        user.verifyEmailTokenExpires = undefined;
        await user.save({ validateBeforeSave: false })
        return res.status(500).json({
            errors: [
                {
                    msg: "please try agine later",
                },
            ],
        });
    }
})
router.patch("/verifyEmail/:token", async (req, res) => {
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await Users.findOne({ verifyEmailToken: token, verifyEmailTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "Token is invalid or has expired",
                    },
                ],
            });
        }

        const updateResult = await Users.updateOne(
            { _id: user._id },
            {
                $set: {
                    verifyEmail: true,
                },
                $unset: {
                    passwordResetToken: "",
                    passwordResetTokenExpires: ""
                }
            }
        );
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "Failed to update user",
                    },
                ],
            });
        }
        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
})


router.patch("/PatchPassword/:id", ChangePasswordValidator, async (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword, conNewPassword } = req.body;

    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "User not found",
                    },
                ]
            });
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                errors: [
                    {
                        msg: "Incorrect old password",
                    },
                ]
            });
        }
        if (newPassword != conNewPassword) {
            return res.status(401).json({
                errors: [
                    {
                        msg: "كلمتا المرور غير متطابقات",
                    },
                ],
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        Users.findByIdAndUpdate(req.params.id, { password: hashedPassword, passwordChangedat: Date.now() })
            .then((doc) => res.status(200).json({ status: "ok Changed Password", doc }))
            .catch((err) => res.status(400).json(err))

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

router.get("/logout", async (req, res, next) => {
    // const tokenReq = req.header("token");
    const tokenReq = req.headers.authorization.split(' ')[1];
    const tokenDb = await Tokens.findOne({ token: tokenReq })
    if (tokenDb) {
        await Tokens.findByIdAndDelete(tokenDb._id)
        res.status(201).json({})
    }
    else {
        res.status(401).json({
            errors: [
                {
                    msg: "filde logout",
                },
            ],
        });
    }
})

module.exports = router