const express = require('express')
const router = express.Router()
const Articales = require("../models/Articales");
const fs = require('fs');
const path = require('path');

const multer = require("multer");
const CategoryMarket = require('../models/CategoryMarket');
const OffersMarket = require('../models/OffersMarket');
const { Console } = require('console');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./files")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const Uplode = multer({ storage: storage })

// router.post('/CreateArticales', Uplode.array('file', 3), async (req, res) => {
//     const file = req.files
//     const { title, name, information, price, number, category } = req.body

//     try {
//         const fileNames = file.map(file => file.filename);
//         await Articales.create({ title: title, name: name, information: information, price: price, number: number, category: category, file: fileNames })
//         res.json({ status: "asd" })
//     } catch (error) {
//         res.json({ status: error })
//         console.log('err')
//     }
// });

router.post('/CreateArticales', Uplode.array('file', 3), async (req, res) => {
    const files = req.files;
    const { title_ar, title_he, name_ar, name_he, information_ar, information_he, price, number, category_ar,category_he} = req.body;


    try {
        const fileNames = files.map(file => file.filename);

        const newArticleData = {
            title: { ar: title_ar, he: title_he }, 
            name: { ar: name_ar, he: name_he },
            information: { ar: information_ar, he: information_he },
            price: price,
            number: number,
            category: { ar: category_ar, he: category_he },
            file: fileNames
        };

        await Articales.create(newArticleData);
        res.json({ status: "Article created successfully" });
    } catch (error) {
        res.json({ status: "Error creating article", error: error.message });
        console.error('Error:', error);
    }
});

router.get("/GetArticales", (req, res, next) => {
    Articales.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.get("/GetArticale/:id", (req, res) => {
    Articales.findById(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.post('/CreateCategoryMarket', Uplode.array('file', 3), async (req, res) => {
    const file = req.files
    const { name_ar , name_he } = req.body
    try {
        const fileNames = file.map(file => file.filename);
        await CategoryMarket.create({ name: {ar : name_ar ,he:name_he }, file: fileNames })
        res.json({ status: "asd" })
    } catch (error) {
        res.json({ status: error })
        console.log('err')
    }
});

router.post('/CreateAnOffer', Uplode.array('file', 3), async (req, res) => {
    const file = req.files
    try {
        const fileNames = file.map(file => file.filename);
        await OffersMarket.create({ file: fileNames })
        res.json({ status: "asd" })
    } catch (error) {
        res.json({ status: error })
        console.log('err')
    }
});

router.get("/GetAnOffer", (req, res, next) => {
    OffersMarket.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.get("/GetCategoryMarket", (req, res) => {
    CategoryMarket.find()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
})

router.delete("/DeleteCategoryMarket/:id", (req, res) => {
    const id = req.params.id;
    CategoryMarket.findById(id)
        .then((doc) => {
            const fileToDelete = doc.file;
            let deletedFiles = 0;
            if (fileToDelete.length > 0) {
                fileToDelete.forEach((filename) => {
                    const filePath = path.join(__dirname, '../files', filename);
                    fs.unlink(filePath, (err) => {
                        // if (err) {
                        //     console.error("حدث خطأ أثناء حذف الملف", err);
                        //     return res.status(500).json({ error: "خطأ في حذف الملف" });
                        // }

                        deletedFiles++;
                        if (deletedFiles === fileToDelete.length) {
                            CategoryMarket.findByIdAndDelete(id)
                                .then(() => {
                                    res.status(200).json({ message: "تم حذف العنصر والملفات بنجاح" });
                                })
                                .catch((err) => {
                                    console.error("خطأ في حذف العنصر", err);
                                    res.status(400).json({ error: "خطأ في حذف العنصر", err });
                                });
                        }
                    });
                });
            } else {
                CategoryMarket.findByIdAndDelete(id)
                    .then(() => {
                        res.status(200).json({ message: "تم حذف العنصر والملفات بنجاح" });
                    })
                    .catch((err) => {
                        console.error("خطأ في حذف العنصر", err);
                        res.status(400).json({ error: "خطأ في حذف العنصر", err });
                    });
            }
        })
        .catch((err) => {
            console.error("خطأ في البحث عن العنصر");
            res.status(400).json({ error: "خطأ في البحث عن العنصر", err });
        });
});

router.patch("/PatchArticale/:id", Uplode.array('file', 3), async (req, res) => {
    const id = req.params.id;
    const file = req.files
    const { title_ar, title_he, name_ar, name_he, information_ar, information_he, price, number, category_ar,category_he} = req.body;

    // const { name , title, information, price, number } = req.body;
    Articales.findById(id)
        .then(async (doc) => {
            const fileToDelete = doc.file;
            let deletedFiles = 0;
            if (fileToDelete.length > 0) {
                fileToDelete.forEach((filename) => {
                    const filePath = path.join(__dirname, '../files', filename);

                    fs.unlink(filePath, async (err) => {
                        if (err) {
                            console.error("حدث خطأ أثناء حذف الملف", err);
                            return res.status(500).json({ error: "خطأ في حذف الملف" });
                        }

                        deletedFiles++;
                        if (deletedFiles === fileToDelete.length) {

                            const fileNames = file.map(file => file.filename);
                            await Articales.findByIdAndUpdate(req.params.id, { title: { ar: title_ar, he: title_he }, name: { ar: name_ar, he: name_he }, information: { ar: information_ar, he: information_he }, price: price, number: number, file: fileNames })
                            res.json({ status: "asd" })
                        }
                    });
                });
            } else {
                const fileNames = file.map(file => file.filename);
                await Articales.findByIdAndUpdate(req.params.id, { title: { ar: title_ar, he: title_he }, name: { ar: name_ar, he: name_he }, information: { ar: information_ar, he: information_he }, price: price, number: number, file: fileNames })
                res.json({ status: "asd" })
            }
        })
        .catch((err) => {
            console.error("خطأ في البحث عن العنصر", err);
            res.status(400).json({ error: "خطأ في البحث عن العنصر", err });
        });
})

router.delete("/DeleteArticale/:id", (req, res) => {
    const id = req.params.id;
    Articales.findById(id)
        .then((doc) => {
            const fileToDelete = doc.file;
            let deletedFiles = 0;
            if (fileToDelete.length > 0) {
                fileToDelete.forEach((filename) => {
                    const filePath = path.join(__dirname, '../files', filename);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("حدث خطأ أثناء حذف الملف", err);
                            return res.status(500).json({ error: "خطأ في حذف الملف" });
                        }
                        deletedFiles++;
                        if (deletedFiles === fileToDelete.length) {
                            Articales.findByIdAndDelete(id)
                                .then(() => {
                                    res.status(200).json({ message: "تم حذف العنصر والملفات بنجاح" });
                                })
                                .catch((err) => {
                                    console.error("خطأ في حذف العنصر", err);
                                    res.status(400).json({ error: "خطأ في حذف العنصر", err });
                                });
                        }
                    });
                });
            } else {
                Articales.findByIdAndDelete(id)
                    .then(() => {
                        res.status(200).json({ message: "تم حذف العنصر والملفات بنجاح" });
                    })
                    .catch((err) => {
                        console.error("خطأ في حذف العنصر", err);
                        res.status(400).json({ error: "خطأ في حذف العنصر", err });
                    });
            }

        })
        .catch((err) => {
            console.error("خطأ في البحث عن العنصر", err);
            res.status(400).json({ error: "خطأ في البحث عن العنصر", err });
        });
});





module.exports = router