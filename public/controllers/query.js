let matchesModel = require("../models/match-schema.js")


function aggregationMatch (req, res, next) {

	if (res.locals.queryMatch === undefined) { res.locals.queryMatch = [] }
		
	res.locals.queryMatch.push({$expr: {$gt: ["$info.gameDuration", 0]}}) // ignore random bugged game
	if (req.baseUrl != "") { res.locals.queryMatch.push({gameEndedInEarlySurrender: false}) } // only include remakes on homepage
	if (req.query.season === undefined) { res.locals.queryMatch.push({$or: [{"info.gameVersion": new RegExp("^14.19")}, {"info.gameVersion": new RegExp("^14.20")}]}) }
		// {"info.gameVersion": new RegExp("^14.1[0-9]")}
		// S2024 split 1 (14.1 → 14.9); split 2 (14.10 → 14.18); split 3 (14.19+)
	if (req.query.account != undefined) { res.locals.queryMatch.push({summonerName: new RegExp(req.query.account, "i")}) }

	
	if (res.locals.aggregation == undefined) {
		res.status(400).redirect("../400")
	} else {
		if (res.locals.queryMatch.length > 0) {
			res.locals.aggregation.unshift({$match: {$and: res.locals.queryMatch}})
		}
		
  		next()
	}
}

function aggregationQuery (req, res, next) {
	matchesModel.aggregate(res.locals.aggregation).exec((err, data) => {
		if (err) {
			next(err)
		} else {
			res.locals.data = data
			next()
		}
	})
}


module.exports = [aggregationMatch, aggregationQuery]