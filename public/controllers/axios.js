const apiKey = process.env.APIKEY
const axios = require('axios').default


const lol = axios.create({ baseURL: "https://na1.api.riotgames.com/lol/" })
const riot = axios.create({ baseURL: "https://americas.api.riotgames.com/riot/" })


const account = async function (req, res, next) {
	try {
		const response = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${req.params.gameName}/${req.params.tagLine}?api_key=${apiKey}`, {
			validateStatus: function(status) {
				return status < 500
			}
		})

		if (response.status !== 200) {
			res.locals.status = response.data.status
			next("route")
		} else {
			res.locals.account = response.data
			next()
		}
	} catch (error) {
		console.log(error)
		res.locals.status = "Unknown Error"
		next("route")
	}
}


const spectator = async function (req, res, next) {
	try {
		const response = await axios.get(`https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${res.locals.account.puuid}?api_key=${apiKey}`, {
			validateStatus: function(status) {
				return status < 500
			}
		})

		if (response.status !== 200) {
			res.locals.status = response.data.status
			next("route")
		} else {
			var startDate = new Date(response.data.gameStartTime)
			var startDay = startDate.toLocaleDateString("en-US", {timeZone: "America/New_York", month: "short", day: "numeric"})
			var startTime = startDate.toLocaleTimeString("en-US", {timeZone: "America/New_York", hour: "numeric", minute: "numeric"})

			res.locals.info = {
				gameId: response.data.gameId,
				mapId: response.data.mapId,
				gameMode: response.data.gameMode,
				gameType: response.data.gameType,
				gameQueueConfigId: response.data.gameQueueConfigId,
				observers: response.data.observers,
				platformId: response.data.platformId,
				gameStartTime: startDay + " · " + startTime,
				gameLength: response.data.gameLength,
				links: {
					opgg: `https://www.op.gg/summoners/na/${res.locals.account.gameName}-${res.locals.account.tagLine}/ingame`,
					ugg: `https://u.gg/lol/profile/na1/${res.locals.account.gameName}-${res.locals.account.tagLine}/live-game`,
					xdx: `https://xdx.gg/${res.locals.account.gameName}-${res.locals.account.tagLine}/live`,
					porofessor: `https://porofessor.gg/live/na/${res.locals.account.gameName}-${res.locals.account.tagLine}`
				}
			}
			res.locals.participants = response.data.participants
			res.locals.bans = {
				bannedChampions: response.data.bannedChampions,
				"100": [],
				"200": []
			}
			next()
		}
	} catch (error) {
		console.log(error)
		res.locals.status = "Unknown Error"
		next("route")
	}
}

const league = async function (participant) {
  	const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${participant.summonerId}?api_key=${apiKey}`, {
		validateStatus: function(status) {
			return status < 500
		}
	})
	return response.data
}



module.exports = {
	liveGame: [account, spectator],
	league
}