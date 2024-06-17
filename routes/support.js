const express = require('express')
const router = express.Router()
const Support = require("../models/Support")



router.post('/CreateSupport', (req, res) => {
    const support = new Support(req.body);

    console.log(req.body);

    support
        .save()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
});


module.exports = router