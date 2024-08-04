let matchesModel = require("../models/matchSchema.js")


function aggregationMatch (req, res, next) {
	if (res.locals.aggregation == undefined) {
		res.status(400).redirect("../400")
	} else {
		res.locals.aggregation.unshift({$match: {gameEndedInEarlySurrender: false}})
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