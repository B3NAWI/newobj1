const express = require('express')
const Users = require("../models/Users")
const jwt = require('jsonwebtoken');
const Tokens = require('../models/token');
const sendEmail = require("../middlewares/email")
const crypto = require('crypto')
const bcrypt = require("bcryptjs")


const protectAdmin = async (req = express.request, res = express.response, next) => {
    // get token

    let token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        // return next(new ApiError("you are not login ,please login to get access this route", 401))
        res.status(401).json({
            errors: [
                {
                    msg: "you are not login ,please login to get access this route",
                },
            ],
        });
    }
    else if (token) {
        try {
            const decodedToken = jwt.decode(token);
            const tokenDb = await Tokens.find({ token: token })
            // التحقق مما إذا كان التوكن منتهي الصلاحية أم لا
            if (decodedToken && decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                // التوكن منتهي الصلاحية
                res.status(401).json({
                    errors: [{
                        msg: "انتهت صلاحية التوكن"
                    }]
                });

            }
            else if (!tokenDb) {
                res.status(401).json({
                    errors: [{
                        msg: " التوكين غير موجود في قاعدة البيانات "
                    }]
                });
            } else {
                const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY)
                const currentUser = await Users.findById(decoded.userId)
                if (!currentUser) {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "the user that belone to this token dose on longer exist",
                            },
                        ],
                    });
                }
                // check if user change his password after token created
                if (currentUser.passwordChangedat) {
                    const passChangedTimestamp = parseInt(
                        currentUser.passwordChangedat.getTime() / 1000,
                        10
                    );
                    // Password changed after token created (Error)
                    if (passChangedTimestamp > decoded.iat) {
                        return next(
                            // new ApiError(
                            //     'User recently changed his password. please login again..',
                            //     401
                            // )
                            res.status(401).json({
                                errors: [
                                    {
                                        msg: "User recently changed his password. please login again..",
                                    },
                                ],
                            })
                        );
                    }
                }
                req.user = currentUser
                next()
            }
        } catch (error) {
            res.status(400).json({
                errors: [
                    {
                        msg: "This account is not authorized",
                    },
                ],
            });
        }
    }
}

const protectAll = async (req = express.request, res = express.response, next) => {
    // get token

    let token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        // return next(new ApiError("you are not login ,please login to get access this route", 401))
        res.status(401).json({
            errors: [
                {
                    msg: "you are not login ,please login to get access this route",
                },
            ],
        });
    }
    else if (token) {
        try {
            const decodedToken = jwt.decode(token);
            const tokenDb = await Tokens.find({ token: token })

            // التحقق مما إذا كان التوكن منتهي الصلاحية أم لا
            if (decodedToken && decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                // التوكن منتهي الصلاحية
                res.status(401).json({
                    errors: [{
                        msg: "انتهت صلاحية التوكن"
                    }]
                });
            }
            else if (!tokenDb) {
                res.status(401).json({
                    errors: [{
                        msg: " التوكين غير موجود في قاعدة البيانات "
                    }]
                });
            } else {
                const decoded = jwt.verify(token, process.env.JWT_CLINE_SECRET_KEY)
                const currentUser = await Users.findById(decoded.userId)
                if (!currentUser) {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "the user that belone to this token dose on longer exist",
                            },
                        ],
                    });
                }
                // check if user change his password after token created
                if (currentUser.passwordChangedat) {
                    const passChangedTimestamp = parseInt(
                        currentUser.passwordChangedat.getTime() / 1000,
                        10
                    );
                    // Password changed after token created (Error)
                    if (passChangedTimestamp > decoded.iat) {
                        return next(
                            // new ApiError(
                            //     'User recently changed his password. please login again..',
                            //     401
                            // )
                            res.status(401).json({
                                errors: [
                                    {
                                        msg: "User recently changed his password. please login again..",
                                    },
                                ],
                            })
                        );
                    }
                    req.user = currentUser
                    next()
                }
            }

        } catch (error) {
            const decodedToken = jwt.decode(token);
            const tokenDb = await Tokens.find({ token: token })
            // التحقق مما إذا كان التوكن منتهي الصلاحية أم لا
            if (decodedToken && decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
                // التوكن منتهي الصلاحية
                res.status(401).json({
                    errors: [{
                        msg: "انتهت صلاحية التوكن"
                    }]
                });
            }
            else if (!tokenDb) {
                res.status(401).json({
                    errors: [{
                        msg: " التوكين غير موجود في قاعدة البيانات "
                    }]
                });
            } else {
                // التوكن صالح
                const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY)
                const currentUser = await Users.findById(decoded.userId)
                if (!currentUser) {
                    res.status(401).json({
                        errors: [
                            {
                                msg: "the user that belone to this token dose on longer exist",
                            },
                        ],
                    });
                }
                // check if user change his password after token created
                if (currentUser.passwordChangedat) {
                    const passChangedTimestamp = parseInt(
                        currentUser.passwordChangedat.getTime() / 1000,
                        10
                    );
                    // Password changed after token created (Error)
                    if (passChangedTimestamp > decoded.iat) {
                        return next(
                            // new ApiError(
                            //     'User recently changed his password. please login again..',
                            //     401
                            // )
                            res.status(401).json({
                                errors: [
                                    {
                                        msg: "User recently changed his password. please login again..",
                                    },
                                ],
                            })
                        );
                    }
                }
                req.user = currentUser
                next()
            }
        }
    }
}

module.exports = { protectAll, protectAdmin }