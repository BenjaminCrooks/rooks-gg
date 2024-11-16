var dd = require("./data-dragon.js")

module.exports = {
	version: function (gameVersion) {
		/**
		 * Formats the game version
		 * 
		 * @param {number}
		 * @returns {string}
		 */


		return gameVersion.substring(0, gameVersion.indexOf(".", 3))
	},


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
			// return ele.value > 1
			return ele.text != "h"
		}).map(function(ele, ind, arr) {
			return String(Math.floor(ele.value)).padStart(2, "0") + ele.text
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
			return date.toLocaleDateString("en-US", {timeZone: "America/New_York", month: "short", day: "numeric"})
		}
	},


	formatTime: function (date) {
		/**
		 * Formats a date object into a more readable form
		 * 
		 * @param {Object} date - Date object
		 * @returns {string} - Time
		 */

		if (date === undefined) {
			return undefined
		} else {
			date.setHours(date.getHours()+4)
			return date.toLocaleTimeString("en-US", {timeZone: "America/New_York", hour: "numeric", minute: "numeric"})
		}
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

		let roles = [ "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT" ]
		let participants = { ally: {}, enemy: {} }

		teams.ally.forEach(function(e) {
			participants.ally[e.position] = e
			participants.ally[e.position].champion = dd.champion(e.championId)
		})
		teams.enemy.forEach(function(e) {
			participants.enemy[e.position] = e
			participants.enemy[e.position].champion = dd.champion(e.championId)
		})

		return roles.map(function(element) {
			return {
				position: element,
				ally: participants["ally"][element],
				enemy: participants["enemy"][element]
			}
		})
	}
}