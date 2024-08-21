let matchesModel = require("../models/matchSchema.js")


function aggregationMatch (req, res, next) {
	let queryMatch = [ {gameVersion: new RegExp("^14.1[0-9]")} ]

	if (req.baseUrl != "") { queryMatch.push({gameEndedInEarlySurrender: false}) }
	// if (req.query.patch === undefined) { queryMatch.push({gameVersion: new RegExp("^14.1[0-9]")}) }
	
	if (res.locals.aggregation == undefined) {
		res.status(400).redirect("../400")
	} else {
		res.locals.aggregation.unshift({$match: {$and: queryMatch}})
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