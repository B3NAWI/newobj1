const express = require('express')
const router = express.Router()
const Users = require("../models/Users")


router.get("/GetUser", (req, res) => {
    Users.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.get("/GetUser/:id", (req, res) => {
    Users.findById(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
});

router.patch("/PatchUser/:id", (req, res) => {
    const { active, email, password, password2, user, select, date, phone, role } = req.body;
    Users.findByIdAndUpdate(req.params.id, { active: active, email: email, password: password, user: user, select: select, date: date, phone: phone, role: role })
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.delete("/DeleteUser/:id", (req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.post("/SearchUser", async (req, res) => {
    try {
        const page = req.body.page - 1 || 0;
        const limit = req.body.limit || 30;
        const search = req.body.search || "";
        const searchRole = req.body.searchRole || ''
        const searchactivity = req.body.searchactivity || ''
        const movies = await Users.find({
            "$and": [
                {
                    "$or": [
                        { user: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ]
                },
                { active: { $regex: searchactivity, $options: "i" } },
                { role: { $regex: searchRole, $options: "i" } },
            ]
        })
            .skip(page * limit)
            .limit(limit);

        const total = await Users.countDocuments({
            "$or": [
                { user: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
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
})

router.post('/addaddress/:userId/address', async (req, res) => {
    const { userId } = req.params;
    const newAddress = req.body;

    try {
        // newAddress._id = new mongoose.Types.ObjectId();
        const user = await Users.findOneAndUpdate(
            { _id: userId },
            { $push: { address: newAddress } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/removeaddress/:userId/address/:addressId', async (req, res) => {
    const { userId, addressId } = req.params;
    try {
        const user = await Users.findOneAndUpdate(
            { _id: userId },
            { $pull: { address: { _id: addressId } } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error removing address:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router