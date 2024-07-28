module.exports = {
	gameLength: function (seconds) {
		/**
		 * Formats a given second integer into a readable form
		 * 
		 * @param {number} seconds
		 * @returns {string} - seconds as 00h 00m 00s
		 */


		let playTime = [
			{value: (seconds/(3600))%24, text: "h"},
			{value: (seconds/(60))%60, text: "m"},
			{value: seconds%60, text: "s"}
		]

		return playTime.filter(function(ele) {
			return ele.value > 1
		}).map(function(ele, ind, arr) {
			return String(Math.floor(ele.value)) + ele.text
		}).join(" ")
	},


	formatDate: function (date) {
		/**
		 * Formats a date object into a more readable form
		 * 
		 * @param {Object} date - Date object
		 * @returns {string} - Date as Mon Day Year
		 */

		if (date === undefined) {
			return undefined
		} else {
			return date.toLocaleDateString("en-US", {timeZone: "UTC", month: "short", day: "numeric", year: "numeric"})
		}
	},


	formatItems: function (items) {
		/**
		 * Formats and filters item array
		 * 
		 * @param {array} items - Item array
		 * @returns {array} - Filtered item array
		 */

		let trinkets = [
			2055, // pink wards
			3340, // yellow trinket
			3363, // blue trinket
			3364 // sweeper trinket
		]

		return items.filter(function(element) { return element !== 0 && !(trinkets.includes(element)) }).sort()
	},


	formatRuneStats: function (stats) {
		/**
		 * Converts rune stat IDs into corresponding file names
		 * 
		 * @param {Object} stats - Rune stats
		 * @returns {array} - Array of stat file names
		 */

		let  statObj = {
			5008: "StatModsAdaptiveForceIcon", // adaptive
			5005: "StatModsAttackSpeedIcon", // atk spd
			5007: "StatModsCDRScalingIcon", // cdr
			5010: "StatModsMovementSpeedIcon", // movespeed
			5011: "StatModsHealthScalingIcon", // flat hp
			5013: "StatModsTenacityIcon", // slow resis
			5001: "StatModsHealthPlusIcon" // scaling hp
		}

		return {
		    "offense": statObj[stats["offense"]],
		    "flex": statObj[stats["flex"]],
		    "defense": statObj[stats["defense"]]
		}
	},


	formatParticipants: function (teams) {
		/**
		 * Formats match history participants
		 * 
		 * @param {Object} teams - Ally and enemy teams
		 * @returns {Object} - Participant object with altered keys
		 */

		let participants = {
			ally: {
				"TOP": undefined,
				"JUNGLE": undefined,
				"MIDDLE": undefined,
				"BOTTOM": undefined,
				"SUPPORT": undefined
			},
			enemy: {
				"TOP": undefined,
				"JUNGLE": undefined,
				"MIDDLE": undefined,
				"BOTTOM": undefined,
				"SUPPORT": undefined
			}
		}

		teams.ally.forEach(function(element, index) {
			participants["ally"][element.position] = element.championName
		})

		teams.enemy.forEach(function(element, index) {
			participants["enemy"][element.position] = element.championName
		})

		return participants
	}
}