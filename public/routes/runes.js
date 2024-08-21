const express = require("express")
const router = express.Router()

router.use(express.static("public"))

var tools = require("../tools.js")
var query = require("../controllers/query.js")


router.use("/anivia-precision", (req, res, next) => {
	res.locals.pageTitle = "Champion Win Rates"
	res.locals.partial = "partials/rows-winrates/champions"

	res.locals.aggregation = [
		{$match: {$and: [
			{gameVersion: new RegExp("^14.1[0-9]")},
			{championName: "Anivia"},
			{$or: [
				{"runes.subStyle.slot1.perk": {$in: ["Coup de Grace", "Cut Down", "Last Stand"]}},
				{"runes.subStyle.slot2.perk": {$in: ["Coup de Grace", "Cut Down", "Last Stand"]}}
			]}
		]}},
		{$project: {
			_id: 0,
			matchId: 1,
			gameTimestamp: 1,
			championName: 1,
			rune: "$runes.subStyle.slot2.perk",
			damage: "$runes.subStyle.slot2.var1",
			maxTimePlayed: 1,
			totalDamageDealtToChampions: 1,
			win: 1
		}},
		{$addFields: {
			dmgMin: {$round: [{$divide: ["$damage", {$divide: ["$maxTimePlayed", 60]}]}, 2]},
			percentTotalDmg: {$round: [{$multiply: [{$divide: ["$damage", "$totalDamageDealtToChampions"]}, 100]}, 0]}
		}},
		{$facet: {
			history: [
				{$sort: {gameTimestamp: -1}}
			],

			summary: [
				{$group: {
					_id: "$rune",
					avgDmgMin: {$avg: "$dmgMin"},
					avgDmg: {$avg: "$damage"},
					avgPercentTotal: {$avg: "$percentTotalDmg"},
					avgLength: {$avg: "$maxTimePlayed"},
					wins: {$sum: {$cond: ["$win", 1, 0]}},
					matches: {$sum: 1}
				}},
				{$addFields: {
					winrate: {$round: [{$multiply: [{$divide: ["$wins", "$matches"]}, 100]}, 0]},
					losses: {$subtract: ["$matches", "$wins"]}
				}},
				{$set: {
					rune: "$_id",
					avgDmgMin: {$round: ["$avgDmgMin", 1]},
					avgDmg: {$round: ["$avgDmg", 1]},
					avgPercentTotal: {$round: ["$avgPercentTotal", 0]},
					avgLength: {$round: ["$avgLength", 0]}
				}},
				{$sort: {winrate: -1, avgDmgMin: -1}}
			]
		}}
	]
	
 	next()
}, query, (req, res, next) => {
	res.locals.matches = res.locals.data[0].history.map(function(element, index, array) {
		element.date = element.gameTimestamp.toLocaleDateString("en-US", {timeZone: "America/New_York", day: "numeric", month: "short", year: "numeric"})
		element.length = tools.gameLength(element.maxTimePlayed)
		return element
	})

	res.locals.summary = res.locals.data[0].summary.map(function(element, index, array) {
		element.avgLength = tools.gameLength(element.avgLength)
		return element
	})

	next()
})


router.get("/anivia-precision", (req, res) => {
	res.render("data-table.ejs", {})
})


module.exports = router