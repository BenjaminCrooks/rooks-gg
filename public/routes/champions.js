const express = require("express")
const router = express.Router()

router.use(express.static("public"))

let matchesModel = require("../models/matchSchema.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")


// router.use("/win-rates", (req, res, next) => {
router.use(["/win-rates", "/win-rates-test"], (req, res, next) => {
	res.locals.pageTitle = "Champion Win Rates"
	res.locals.partial = "partials/rows-winrates/champions"

	res.locals.aggregation = [
		{$match: {summonerName: "ADDERALL XERATH"}},
		{$project: {
			_id: 0,
			championName: 1,
			kills: 1,
			deaths: 1,
			assists: 1,
			win: 1
		}},
		{$group: {
			_id: "$championName",
			kills: {$sum: "$kills"},
			deaths: {$sum: "$deaths"},
			assists: {$sum: "$assists"},
			wins: {$sum: {$cond: ["$win", 1, 0]}},
			matches: {$sum: 1}
		}},
		{$addFields: {winRate: {$round: [{$divide: ["$wins", "$matches"]}, 4]}}},
		{$sort: {matches: -1, wins: -1, championName: -1}}
	]
	
 	next()
}, query, (req, res, next) => {
	let totalPlayedMatches = 0
	res.locals.data.forEach(function(element, index) {
		totalPlayedMatches += element.matches
	})

	res.locals.rows = res.locals.data.map(function(element, index, array) {
		return {
			champion: element._id,
			wins: element.wins,
			losses: element.matches - element.wins,
			winrate: Math.round(element.winRate*100),
			played: element.matches,
			pickrate: ((element.matches/totalPlayedMatches)*100).toFixed(2),
			kda: ((element.kills + element.assists)/element.deaths).toFixed(2),
			kills: (element.kills/element.matches).toFixed(1),
			deaths: (element.deaths/element.matches).toFixed(1),
			assists: (element.assists/element.matches).toFixed(1),

			sort: {
				"champion": element._id,
				"winrate": Math.round(element.winRate*100),
				"played": element.matches,
				"pickrate": ((element.matches/totalPlayedMatches)*100).toFixed(2),
				"kda": ((element.kills + element.assists)/element.deaths).toFixed(2)
			}
		}
	})

	next()
})


router.get("/win-rates", (req, res) => {
	res.render("winrates.ejs", {
		pageTitle: res.locals.pageTitle,
		rowPartial: res.locals.partial,
		rows: res.locals.rows
	})
})

router.get("/win-rates-test", (req, res) => {
	res.render("test.ejs", {
		pageTitle: "TESTING",
		rowPartial: "partials/rows-winrates/rows-test",
		rows: res.locals.rows
	})
})


module.exports = router