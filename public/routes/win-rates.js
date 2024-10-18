const express = require("express")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")




router.use((req, res, next) => {

	// QUERY.ROLE CHECK
	if (req.query.role === undefined) {
		res.locals.groupBy = {
	    	champion: "$championId",
	    	position: "$position"
	    }
	} else {
		res.locals.groupBy = "$championId"
	}

	next()
})


router.use("/ally", (req, res, next) => {

	res.locals.filterCond = "ally"

	next()
})


router.use("/enemy", (req, res, next) => {

	res.locals.filterCond = "enemy"

	next()
})


router.use(["/ally", "/enemy"], (req, res, next) => {

	res.locals.projectParticipant = { $filter: {
		input: { $arrayElemAt: [
		    {$map: {
				input: "$participants",
				as: "item",
				in: "$$item.participants"
		    }},
		    0
		]},
		as: "participant",
		cond: { $eq: ["$$participant.relationship", res.locals.filterCond] } // ["$$participant.teamId", "$teamId"]
	} }

	next()
})


router.use("/overall", (req, res, next) => {

	res.locals.projectParticipant = { $arrayElemAt: [
        {$map: {
            input: "$participants",
            as: "item",
            in: "$$item.participants"
        }},
        0
    ] }

	next()
})


router.use(["/ally", "/enemy", "/overall"], (req, res, next) => {

	res.locals.aggregation = [
		{$lookup: {
			from: "participants",
			let: {
				ownMatchId: "$metadata.matchId",
				ownTeamId: "$teamId"
			},
			pipeline: [
				{$match: {
					$expr: { $eq: ["$matchId", "$$ownMatchId"] }
				}}
			],
			as: "participants"
		}},
		{$project: {
		  	metadata: 1,
		  	info: 1,
		  	gameDateTimestamp: 1,
		  	participants: res.locals.projectParticipant
		}},
		{$unwind: "$participants"},
		{$replaceRoot: {
			newRoot: { $mergeObjects: ["$$ROOT", "$participants"] }
		}}
	]
	
 	next()
})


router.use("/personal", (req, res, next) => {

	res.locals.aggregation = []

	next()
})





router.use((req, res, next) => {

	// Universal win rate aggregation stages
	res.locals.aggregationTwo = [
		{$project: {
			_id: 0,
			matchId: "$metadata.matchId",
			gameDuration: "$info.gameDuration",
			championId: 1,
			kills: 1,
			deaths: 1,
			assists: 1,
			cs: {$add: ["$totalMinionsKilled", "$neutralMinionsKilled"]},
			goldEarned: 1,
			visionScore: 1,
			visionWardsBoughtInGame: 1,
			totalDamageDealtToChampions: 1,
			position: 1,
			win: 1
		}},
		{$addFields: {
			csMin: {$divide: ["$cs", {$divide: ["$gameDuration", 60]}]},
			goldMin: {$divide: ["$goldEarned", {$divide: ["$gameDuration", 60]}]}
		}},
		{$group: {
			_id: res.locals.groupBy,
			kills: {$avg: "$kills"},
			deaths: {$avg: "$deaths"},
			assists: {$avg: "$assists"},
			cs: {$avg: "$cs"},
			csMin: {$avg: "$csMin"},
			goldEarned: {$avg: "$goldEarned"},
			goldMin: {$avg: "$goldMin"},
			visionScore: {$avg: "$visionScore"},
			visionWardsBoughtInGame: {$avg: "$visionWardsBoughtInGame"},
			totalDamageDealtToChampions: {$avg: "$totalDamageDealtToChampions"},
			wins: {$sum: {$cond: ["$win", 1, 0]}},
			matches: {$sum: 1}
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
			cs: {$round: ["$cs", 1]},
			csMin: {$round: ["$csMin", 1]},
			goldEarned: {$round: ["$goldEarned", 0]},
			goldMin: {$round: ["$goldMin", 1]},
			visionScore: {$round: ["$visionScore", 1]},
			visionWardsBoughtInGame: {$round: ["$visionWardsBoughtInGame", 1]},
			totalDamageDealtToChampions: {$round: ["$totalDamageDealtToChampions", 0]},

			championId: {$cond: {
				if: {$eq: [{$type: "$_id"}, "object"]},
				then: "$_id.champion",
				else: "$_id"
			}},
			position: {$cond: {
				if: {$eq: [{$type: "$_id"}, "object"]},
				then: "$_id.position",
				else: undefined // null?  ──────────────────────────────────────────────────────────────────────────────────── ★★
			}}
		}},
		{$sort: {matches: -1, wins: -1, _id: 1}}
	]


	// Add the universal win rate aggregation stages to the end of the aggregation pipeline
	res.locals.aggregation = res.locals.aggregation.concat(res.locals.aggregationTwo)
	
	next()

}, query, (req, res, next) => {

	let totalPlayedMatches = 0
	res.locals.data.forEach(function(element, index) { totalPlayedMatches += element.matches })

	res.locals.rows = res.locals.data.map(function(element, index, array) {
		element.champion = dd.champion(element.championId)
		element.kda = element.kda.toFixed(2)
		element.winrate = element.winrate.toFixed(1).padStart(4, "0")
		element.pickrate = ((element.matches/totalPlayedMatches)*100).toFixed(1)
		element.goldEarned = element.goldEarned.toLocaleString()
		element.totalDamageDealtToChampions = element.totalDamageDealtToChampions.toLocaleString()
		return element
	})
	
	next()
})



router.get(["/overall", "/ally", "/enemy", "/personal"], (req, res) => {
	res.render("table-win-rates.ejs")
})

module.exports = router