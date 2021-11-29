// Route for inserting and getting Profits in the database
const express = require("express");
const Profit = require("./../models/Profit");
const router = express.Router();

router.get("/", (req, res, next) => {
    const query = req.query
    Profit.find(query)
        .then(profits => {
            res.json({
                confirmation: "success",
                data: profits
            })
        }).catch(err => {
            res.json({
                confirmation: "fail",
                message: err.message
            })

        })
}
);


router.get("/add", (req, res, next) => {
    const query = req.query
    Profit.create(query)
        .then(profits => {
            res.json({
                confirmation: "success",
                data: profits
            })
        }).catch(err => {
            res.json({
                confirmation: "fail",
                message: err.message
            })

        })
}
);


router.get("/update/:id", (req, res, next) => {
    Profit.findByIdAndUpdate(req.params.id, req.query, { new: true })
        .then(profits => {
            res.json({
                confirmation: "success",
                data: profits
            })
        }).catch(err => {
            res.json({
                confirmation: "fail",
                message: "Entry " + req.params.id + " not found."
            })

        })
}
);


router.get("/:id", (req, res, next) => {
    Profit.findById(req.params.id)
        .then(profits => {
            res.json({
                confirmation: "success",
                data: profits
            })
        }).catch(err => {
            res.json({
                confirmation: "fail",
                message: "Entry " + req.params.id + " not found."
            })

        })
}
);


module.exports = router;