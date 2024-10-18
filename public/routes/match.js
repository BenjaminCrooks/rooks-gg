const express = require("express")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")



router.get("/live-game", (req, res) => {
	res.render("live-game.ejs", {})
})



router.get("/details/:matchid", (req, res) => { res.redirect("/match/details") })
router.use("/details", (req, res, next) => { // "/details/:matchid"

	if (req.query.matchid === undefined) { req.query.matchid = "NA1_5134258009"}
	res.locals.queryMatch = [ {"metadata.matchId": req.query.matchid} ]
	res.locals.aggregation = [ {$limit: 1} ]
	
 	next()
}, query, (req, res, next) => {
	res.locals.data = res.locals.data[0]

	next()
})

router.get("/details", (req, res) => {
	// res.send(res.locals.data)
	res.render("match-details.ejs", {})
})


module.exports = router