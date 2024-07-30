const express = require("express")
const router = express.Router()

router.use(express.static("public"))

let matchesModel = require("../models/matchSchema.js")
var tools = require("../tools.js")


router.use("/win-rates", (req, res, next) => {
	res.locals.pageTitle = "Team Champion Win Rates"
	res.locals.partial = "partials/rows-winrates/teams"

	res.locals.aggregation = [
		{$match: {summonerName: "ADDERALL XERATH"}},
	    {$project: {
	        _id: 0,
	        championName: 1,
	        win: 1,
	        participants: {
	            $concatArrays: [
	                {$map: {
	                    input: "$teams.ally.picks",
	                    as: "participant",
	                    in: {
	                        championName: "$$participant.championName",
	                        relationship: "ally"
	                    }
	                }},
	                {$map: {
	                    input: "$teams.enemy.picks",
	                    as: "participant",
	                    in: {
	                        championName: "$$participant.championName",
	                        relationship: "enemy"
	                    }
	                }}
	            ]
	        }
	    }},
	    {$facet: {
	        participants: [
	            {$unwind: "$participants"},

	            {$set: {
	                participantChampionName: "$participants.championName",
	                relationship: "$participants.relationship"
	            }},

	            {$match: {$expr: {$ne: ["$championName", "$participantChampionName"]}}},

	            {$group: {
	                _id: "$participantChampionName",
	                allyWins: {$sum: {$cond: [{$and: [
	                    {$eq: ["$relationship", "ally"]},
	                    "$win"
	                ]}, 1, 0]}},
	                allyTotal: {$sum: {$cond: [{$eq: ["$relationship", "ally"]}, 1, 0]}},
	                enemyWins: {$sum: {$cond: [{$and: [
	                    {$eq: ["$relationship", "enemy"]},
	                    "$win"
	                ]}, 1, 0]}},
	                enemyTotal: {$sum: {$cond: [{$eq: ["$relationship", "enemy"]}, 1, 0]}}
	            }},

	            {$match: {$and: [{$expr: {$gt: ["$allyTotal", 1]}}, {$expr: {$gt: ["$enemyTotal", 1]}}]}},
	            // {$match: {$and: [{$expr: {$ne: ["$allyTotal", 0]}}, {$expr: {$ne: ["$enemyTotal", 0]}}]}},

	            {$addFields: {
	                // allyWinRate: {$divide: ["$allyWins", "$allyTotal"]},
	                // enemyWinRate: {$divide: ["$enemyWins", "$enemyTotal"]}
	                allyWinRate: {$cond: [{$eq: ["$allyTotal", 0]}, 0, {$divide: ["$allyWins", "$allyTotal"]}]}, // if, then, else
	                enemyWinRate: {$cond: [{$eq: ["$enemyTotal", 0]}, 0, {$divide: ["$enemyWins", "$enemyTotal"]}]}
	            }},

	            // {$limit: 20},

	            {$sort: {enemyTotal: -1, allyTotal: -1, championName: -1}}
	        ],
	        totalMatches: [
	            {$count: "count"}
	        ]
	    }}
	]
 	next()
})



router.use((req, res, next) => {

	// Ignore remakes for all queries
	res.locals.aggregation.unshift({$match: {gameEndedInEarlySurrender: false}})

	// Query database
	matchesModel.aggregate(res.locals.aggregation).exec((err, data) => {
		if (err) {
			console.log("Error 404 - Page not found\n\t" + err)
			res.status(404).redirect("../404")
		} else if (data.length == 0) {
			console.log("Error 204 - No content found; 0 documents matched the parameters\n\t" + err)
			res.status(204).redirect("../204")
		} else {
			// console.log(data[0].participants[0])
			let totalPlayedMatches = data[0].totalMatches[0].count

			res.locals.rows = data[0].participants.map(function(element, index, array) {
				return {
					champion: element._id,
					enemyWins: element.enemyWins,
					enemyLosses: element.enemyTotal - element.enemyWins,
					enemyWinrate: Math.round(element.enemyWinRate*100),
					enemyPlayed: element.enemyTotal,
					allyWins: element.allyWins,
					allyLosses: element.allyTotal - element.allyWins,
					allyWinrate: Math.round(element.allyWinRate*100),
					allyPlayed: element.allyTotal,
					pickrate: (((element.enemyTotal+element.allyTotal)/totalPlayedMatches)*100).toFixed(2), 

					sort: {
						"champion": element._id,
						"enemywinrate": Math.round(element.enemyWinRate*100),
						"enemyplayed": element.enemyTotal,
						"allywinrate": Math.round(element.allyWinRate*100),
						"allyplayed": element.allyTotal,
						"pickrate": (((element.enemyTotal+element.allyTotal)/totalPlayedMatches)*100).toFixed(2)
					}
				}
			})

			next()
		}
	})
})


router.get("/win-rates", (req, res) => {
	// console.log(res.locals.rows[0])
	res.render("winrates.ejs", {
		pageTitle: res.locals.pageTitle,
		rowPartial: res.locals.partial,
		rows: res.locals.rows
	})
})



module.exports = router