const express = require('express')
const router = express.Router()
const Articales = require("../../models/Articales")
const CategoryMarket = require("../../models/CategoryMarket")
const OffersMarket = require('../../models/OffersMarket')
const Users = require('../../models/Users')
const Order = require('../../models/Order')
const { format } = require('date-fns')
const { default: mongoose } = require('mongoose')


router.get("/GetArticales", (req, res) => {
    Articales.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.get("/GetArticale/:id", (req, res) => {
    Articales.findById(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.get("/GetCategoryMarket", (req, res) => {
    CategoryMarket.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

// router.get("/GetArticalecategory/:category", (req, res) => {
//     Articales.find({ category: req.params.category })
//         .then((doc) => res.status(200).json(doc))
//         .catch((err) => res.status(400).json(err))
// })

router.get("/GetAnOffer", (req, res) => {
    OffersMarket.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

// router.post("/SearchProduct", async (req, res) => {
//     try {
//         const page = req.body.page - 1 || 0;
//         const limit = req.body.limit || 20;
//         const saerch = req.body.saerch || "";
//         const category = req.body.category || "";
//         const priceCategory = req.body.priceCategory || ''
//         if (priceCategory == "0-199") {
//             nm1 = 0, nm2 = 199
//         } else if (priceCategory == "200-499") {
//             nm1 = 200, nm2 = 499
//         } else if (priceCategory == "500-999") {
//             nm1 = 500, nm2 = 999
//         } else if (priceCategory == "1000") {
//             nm1 = 1000, nm2 = 100000000000
//         } else { nm1 = 0, nm2 = 1000000 }

//         const movies = await Articales.find({
//             "$and": [
//                 {
//                     "$or": [
//                         { name: { $regex: saerch, $options: "i" } },
//                         { title: { $regex: saerch, $options: "i" } },
//                     ]
//                 },
//                 { category: category },
//                 { price: { $gte: nm1, $lt: nm2 } }
//             ]
//         })
//             .skip(page * limit)
//             .limit(limit);

//         // .where("name")
//         // .skip(page * limit)
//         // .limit(limit);

//         const total = await Articales.countDocuments({
//             "$or": [
//                 { name: { $regex: saerch, $options: "i" } },
//                 { title: { $regex: saerch, $options: "i" } },
//             ]
//         } && { category: category });

//         const response = {
//             error: false,
//             total,
//             page: page + 1,
//             limit,
//             movies,
//         };

//         res.status(200).json(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// })

router.post("/SearchProduct", async (req, res) => {
    try {
        const page = req.body.page - 1 || 0;
        const limit = req.body.limit || 20;
        const search = req.body.search || "";
        const category = req.body.category || "";
        const priceCategory = req.body.priceCategory || '';
        

        let nm1 = 0, nm2 = 1000000;
        if (priceCategory == "0-199") {
            nm1 = 0, nm2 = 199;
        } else if (priceCategory == "200-499") {
            nm1 = 200, nm2 = 499;
        } else if (priceCategory == "500-999") {
            nm1 = 500, nm2 = 999;
        } else if (priceCategory == "1000") {
            nm1 = 1000, nm2 = 100000000000;
        }

        const searchCondition = search ? {
            "$or": [
                { "name.ar": { $regex: search, $options: "i" } },
                { "name.he": { $regex: search, $options: "i" } },
                { "title.ar": { $regex: search, $options: "i" } },
                { "title.he": { $regex: search, $options: "i" } },
            ]
        } : {};

        const categoryCondition = category ? {
            "$or": [
                { "category.ar": category },
                { "category.he": category }
            ]
        } : {};


        const priceCondition = { price: { $gte: nm1, $lt: nm2 } };

        const conditions = [searchCondition, categoryCondition, priceCondition].filter(cond => Object.keys(cond).length > 0);

        const movies = await Articales.find({
            "$and": conditions
        });


        const total = await Articales.countDocuments({
            "$and": [
                {
                    "$or": [
                        { "name.ar": { $regex: search, $options: "i" } },
                        { "name.he": { $regex: search, $options: "i" } },
                        { "title.ar": { $regex: search, $options: "i" } },
                        { "title.he": { $regex: search, $options: "i" } },
                    ]
                },
                // category ? { category: category } : {},
                {
                    "$or": [
                        { "category.ar": { $regex: category, $options: "i" } },
                        { "category.he": { $regex: category, $options: "i" } },
                    ]
                },
                { price: { $gte: nm1, $lt: nm2 } }
            ]
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            movies,
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


router.post("/CreateOrder", async (req, res) => {
    const userId = req.body.userId
    const cartItems = req.body.cartItems
    const user = await Users.findById(userId)
    const payment = req.body.payment
    const receipt = req.body.receipt
    const totalPrice = req.body.totalPrice
    const UserDetails = { id: user._id, name: user.user, phone: user.phone }
    const dateNow = Date.now()
    const DateOrder = format(dateNow, 'dd/MM/yyyy HH:mm')

    try {
        const receiptAddress = await user.address.find(addr => addr._id.toString() === req.body.receiptAddress);
        const cart = await Promise.all(cartItems.map(async (item) => {
            const articale = await Articales.findById(item.id);
            return { ...articale.toObject(), quantity: item.quantity };
        }));
        const doc = await Order.create({ cart, receiptAddress, receipt, payment, totalPrice, UserDetails, DateOrder })
        res.status(200).json(doc)
    } catch (error) {
        res.status(404).json({ error: true, message: "Internal Server Error" })
    }
})

router.get("/GetOrder", async (req, res) => {
    const limit = 11;

    await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)  
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(404).json(err));
});

router.get("/GetOrder/:id", async (req, res) => {
    await Order.findById(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(404).json(err))
})

router.get("/GetOrders/:UserId", async (req, res) => {
    const page = req.params.page - 1 || 0
    const limit = req.params.limit || 30
    const total = await Order.countDocuments({
        "UserDetails.id": req.params.UserId
    });

    await Order.find({ "UserDetails.id": req.params.UserId })
        .skip(page * limit)
        .limit(limit)
        .then((doc) => res.status(200).json({ doc, total }))
        .catch((err) => res.status(404).json(err))
})

router.patch("/patchorder", async (req, res) => {
    const status = req.body.LStatus
    const id = req.body.id
    if (status.ar == "جديد") {
        console.log("1")
        await Order.find({
            "$or": [
                {"status.ar": status.ar},
                {"status.he": status.he},
            ]
        })
            .then((doc) => (doc.map(async (item) =>
                await Order.findByIdAndUpdate(item._id, { status: { ar: "تم المشاهدة", he: "צפה" } })
                    .then((doc) => res.status(200))
                    .catch((err) => res.status(404).json(err))
            )))
            .catch((err) => res.status(404).json(err))
    }
    else if (status.ar == "تم المشاهدة") {
        await Order.findByIdAndUpdate(id, { status: { ar: "قيد التجهيز", he: "בהכנה" } })
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(404).json(err))
    }
    else if (status.ar ==  "قيد التجهيز") {
        await Order.findByIdAndUpdate(id, { status: { ar: "في الطريق", he: "בדרך" } })
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(404).json(err))
    }
    else if (status.ar ==  "في الطريق") {
        await Order.findByIdAndUpdate(id, { status: { ar: "تم التسليم", he: "קיבלו" } })
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(404).json(err))
    }
})

router.post("/SearchOrders", async (req, res) => {
    try {
        const page = req.body.page - 1 || 0;
        const limit = req.body.limit || 20;
        const saerch = req.body.saerch || "";
        const searchStatus = req.body.searchStatus || { ar: "", he: "" };
        const searchDateOrder = req.body.searchDateOrder || "";
        const searchPayment = req.body.searchPayment || { ar: "", he: "" };

        let startOfDay;

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        if (searchDateOrder == "1Day") {
            startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
        } else if (searchDateOrder == "3Day") {
            startOfDay = new Date();
            startOfDay.setDate(startOfDay.getDate() - 3);
            startOfDay.setHours(0, 0, 0, 0);
        } else if (searchDateOrder == "7Day") {
            startOfDay = new Date();
            startOfDay.setDate(startOfDay.getDate() - 7);
            startOfDay.setHours(0, 0, 0, 0);
        } else if (searchDateOrder == "30Day") {
            startOfDay = new Date();
            startOfDay.setDate(startOfDay.getDate() - 30);
            startOfDay.setHours(0, 0, 0, 0);
        } else {
            startOfDay = new Date();
            startOfDay.setFullYear(2023);
        }

        let objectIdSearch = null;
        if (mongoose.Types.ObjectId.isValid(saerch)) {
            objectIdSearch = new mongoose.Types.ObjectId(saerch);
        }

        const movies = await Order.find({
            "$and": [
                {
                    "$or": [
                        { "UserDetails.name": { $regex: saerch, $options: "i" } },
                        { "UserDetails.phone": { $regex: saerch, $options: "i" } },
                        ...(objectIdSearch ? [{ "_id": objectIdSearch }] : [])
                    ]
                },
                {
                    "$or": [
                        { "status.ar": { $regex: searchStatus.ar, $options: "i" } },
                        { "status.he": { $regex: searchStatus.he, $options: "i" } },
                    ]
                },
                {
                    "$or": [
                        {
                            "payment.ar": {
                                $regex: searchPayment.ar === "بطاقة" ? "^بطاقة$|^بطاقة (?!للدلفري)" : searchPayment.ar,
                                $options: "i"
                            }
                        },
                        {
                            "payment.he": {
                                $regex: searchPayment.he === "כַּרְטִיס" ? "^כַּרְטִיס$|^כַּרְטִיס (?!במשלוח)" : searchPayment.he,
                                $options: "i"
                            }
                        },
                    ]
                },
                { createdAt: { $gte: startOfDay, $lt: endOfDay } },
            ]
        })
            .skip(page * limit)
            .limit(limit);

        const total = await Order.countDocuments({
            "$and": [
                {
                    "$or": [
                        { "UserDetails.name": { $regex: saerch, $options: "i" } },
                        { "UserDetails.phone": { $regex: saerch, $options: "i" } },
                        ...(objectIdSearch ? [{ "_id": objectIdSearch }] : [])
                    ]
                },
                {
                    "$or": [
                        { "status.ar": { $regex: searchStatus.ar, $options: "i" } },
                        { "status.he": { $regex: searchStatus.he, $options: "i" } },
                    ]
                },
                {
                    "$or": [
                        {
                            "payment.ar": {
                                $regex: searchPayment.ar === "بطاقة" ? "^بطاقة$|^بطاقة (?!للدلفري)" : searchPayment.ar,
                                $options: "i"
                            }
                        },
                        {
                            "payment.he": {
                                $regex: searchPayment.he === "כַּרְטִיס" ? "^כַּרְטִיס$|^כַּרְטִיס (?!במשלוח)" : searchPayment.he,
                                $options: "i"
                            }
                        },
                    ]
                },
                { createdAt: { $gte: startOfDay, $lt: endOfDay } },
            ]
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            movies,
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


module.exports = router