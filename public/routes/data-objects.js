const express = require("express")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")


router.get("/runes", (req, res) => {
	res.send(dd.runes)
})

router.get("/runes/:key", (req, res, next) => {
	// res.locals.data = dd.rune(req.params.key)
	res.send(dd.rune(req.params.key))
})

// router.get("/runes/:key", (req, res, next) => {
// 	try {
// 		res.locals.data = dd.rune(req.params.key)
// 		next()
// 	} catch (error) {
// 		res.locals.data = req.params.key
// 		res.locals.error = error
// 		next("route")
// 	}
// }, (req, res) => {
// 	res.send(res.locals.data)
// })



// router.get("*", (req, res) => {
// 	res.send(res.locals)
// })


module.exports = router