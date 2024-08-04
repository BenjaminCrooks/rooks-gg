const express = require("express")
const router = express.Router()

router.use(express.static("public"))

let matchesModel = require("../models/matchSchema.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")


router.use("/:champion", (req, res, next) => {
	res.locals.pageTitle = "Champion Win Rates"

	res.locals.aggregation = [
	    {$match: {championName: new RegExp(req.params.champion, "i")}},
	    {$project: {
	        _id: 0,
	        championName: 1,
	        kills: 1,
	        assists: 1,
	        deaths: 1,
	        win: 1,
	        spell1Casts: 1, spell2Casts: 1, spell3Casts: 1, spell4Casts: 1,
	        csKilled: {$add: ["$totalMinionsKilled", "$neutralMinionsKilled"]},
	        // visionWardsBoughtInGame: 1, detectorWardsPlaced: 1, visionScore: 1, wardsKilled: 1, wardsPlaced: 1,
	        maxTimePlayed: 1
	    }},

	    {$group: {
	        _id: "$championName",
	        kills: {$sum: "$kills"},
	        deaths: {$sum: "$deaths"},
	        assists: {$sum: "$assists"},
	        
	        spell1Casts: {$sum: "$spell1Casts"},
	        spell2Casts: {$sum: "$spell2Casts"},
	        spell3Casts: {$sum: "$spell3Casts"},
	        spell4Casts: {$sum: "$spell4Casts"},

	        cs: {$sum: "$csKilled"},
	        timePlayed: {$sum: "$maxTimePlayed"},
	        
	        wins: {$sum: {$cond: ["$win", 1, 0]}},
	        matches: {$sum: 1}
	    }},
	    {$addFields: {winRate: {$divide: ["$wins", "$matches"]}}}
	]
 	next()
}, query, (req, res, next) => {
	let stats = res.locals.data[0]

	res.locals.stats = {
		champion: stats._id,
		wins: stats.wins,
		losses: stats.matches - stats.wins,
		winrate: Math.round(stats.winRate*100).toString(),

		played: stats.matches.toString(),
		timePlayed: tools.gameLength(stats.timePlayed),
		avgGameLength: tools.gameLength(Math.round(stats.timePlayed/stats.matches)),
		// pickrate: ((stats.matches/totalPlayedMatches)*100).toFixed(2),

		kills: stats.kills,
		avgKills: (stats.kills/stats.matches).toFixed(1),
		deaths: stats.deaths,
		avgDeaths: (stats.deaths/stats.matches).toFixed(1),
		assists: stats.assists,
		avgAssists: (stats.assists/stats.matches).toFixed(1),
		kda: ((stats.kills + stats.assists)/stats.deaths).toFixed(2),

		cs: stats.cs,
		avgCs: (stats.cs/stats.matches).toFixed(1),

		spell1Casts: stats.spell1Casts,
		spell1Avg: Math.round(stats.spell1Casts/stats.matches),
		spell2Casts: stats.spell2Casts,
		spell2Avg: Math.round(stats.spell2Casts/stats.matches),
		spell3Casts: stats.spell3Casts,
		spell3Avg: Math.round(stats.spell3Casts/stats.matches),
		spell4Casts: stats.spell4Casts,
		spell4Avg: Math.round(stats.spell4Casts/stats.matches)
	}

	next()
})


router.get("/:champion", (req, res) => {
	res.render("stats.ejs", {
		pageTitle: res.locals.pageTitle,
		stats: res.locals.stats
	})
})


module.exports = router