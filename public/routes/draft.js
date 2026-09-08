const express = require("express")
const router = express.Router()

// router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")




router.use((req, res, next) => {

	req.query.season = 0

	next()
})


router.use("/:championKey/counters", (req, res, next) => {
	// req.params.championKey
	// if (Object.hasOwn(dd.championData, "Velkoz")) { console.log(dd.championData["Velkoz"].key) }

	try {
		res.locals.enemyChampion = dd.champion(req.params.championKey, dd.liveVersion)
	} catch (error) {
		console.log("Error reading championId from URL\n\tDefaulting to Zed (238)")
		res.locals.enemyChampion = dd.champion(238, dd.liveVersion)
	}

	next()
})


router.use("/:championId/counters", (req, res, next) => {

	res.locals.aggregation = [
		{$project: {
			_id: 0,
			matchId: "$metadata.matchId",
			championId: 1,
			kills: 1,
			deaths: 1,
			assists: 1,
			win: 1,
			enemyChampionIdArray: {
				$map: {
					input: "$info.participants.enemy",
					as: "participant",
					in: "$$participant.championId"
				}
			}
		}},
		{$match: {
			enemyChampionIdArray: Number(res.locals.enemyChampion.key)
		}},
		{$group: {
			_id: "$championId",
			kills: {$avg: "$kills"},
			deaths: {$avg: "$deaths"},
			assists: {$avg: "$assists"},
			wins: {$sum: {$cond: ["$win", 1, 0]}},
			matches: {$sum: 1}
		}},
		{$match: {
			matches: {$gte: 3}
		}},
		{$addFields: {
			losses: {$subtract: ["$matches", "$wins"]},
			winrate: {$round: [{$multiply: [{$divide: ["$wins", "$matches"]}, 100]}, 1]},
			kda: {$cond: [
				{$eq: ["$deaths", 0]},
				{$add: ["$kills", "$assists"]},
				{$round: [{$divide: [{$add: ["$kills", "$assists"]}, "$deaths"]}, 2]}
			]},
			kills: {$round: ["$kills", 1]},
			deaths: {$round: ["$deaths", 1]},
			assists: {$round: ["$assists", 1]},
			championId: "$_id"
		}},
		{$sort: {winrate: -1, matches: -1, _id: 1}}
	]
	
	next()

}, query, (req, res, next) => {

	let totalPlayedMatches = 0
	res.locals.data.forEach(function(element, index) { totalPlayedMatches += element.matches })

	res.locals.rows = res.locals.data.map(function(element, index, array) {
		element.champion = dd.champion(element.championId, dd.liveVersion)
		element.kda = element.kda.toFixed(2)
		element.winrate = element.winrate.toFixed(1).padStart(4, "0")
		element.pickrate = ((element.matches/totalPlayedMatches)*100).toFixed(1)
		return element
	})
	
	next()
})



router.get("/*/counters", (req, res) => {
	// res.send(dd.championData)
	// res.send({ "Enemy": res.locals.enemyChampion.name, "Matchups": res.locals.rows })
	res.render("table-counters.ejs")
})


module.exports = router