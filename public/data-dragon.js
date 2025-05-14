const fs = require("fs")
const path = require("path")


function imgPath(version, group, full) {
	return path.join("/assets/dragontail", version, group, full).replace(/\\/g,"/")
}

function readJSON(version, file) {
	try {
		return JSON.parse(fs.readFileSync(`./public/assets/dragontail/${version}/data/${file}.JSON`, "utf8"))
	} catch (error) {
		console.log(`./public/assets/dragontail/${version}/data/${file}.JSON`)
		console.log(error)
		return undefined
	}
}

function dupeJSON(json) {
	if (json !== undefined) {
		return JSON.parse(JSON.stringify(json))
	} else {
		return undefined
	}
}


// Data file > object parsing
function parseChampion(version) {
	var data = readJSON(version, "championFull").data
	var parsed = {}

	Object.entries(data).forEach(function([key, value]) {
		parsed[value.key] = {
			id: value.id,
			key: value.key,
			name: value.name,
			title: value.title,
			tags: value.tags,
			passive: {
				name: value.passive.name,
				img: imgPath(version, value.passive.image.group, value.passive.image.full)
			},
			spells: value.spells.map(function(spell) {
				return {
					id: spell.id,
					name: spell.name,
					img: imgPath(version, spell.image.group, spell.image.full)
				}
			}),
			img: {
				square: imgPath(version, "champion/square", value.id + ".png"),
					squarecrop: imgPath(version, "champion/squarecrop", value.id + ".png"),
				centered: imgPath(version, "champion/centered", value.id + "_0.jpg"),
					centeredmed: imgPath(version, "champion/centeredmed", value.id + "_0.jpg"),
					centeredsmall: imgPath(version, "champion/centeredsmall", value.id + "_0.jpg"),
				loading: imgPath(version, "champion/loading", value.id + "_0.jpg"),
					loadingcrop: imgPath(version, "champion/loadingcrop", value.id + "_0.jpg"),
				splash: imgPath(version, "champion/splash", value.id + "_0.jpg"),
				tiles: imgPath(version, "champion/tiles", value.id + "_0.jpg")
			}
		}
	})

	parsed["-1"] = {
		name: "blank",
		img: { square: "/assets/icons/svgs/blank.svg" }
	}

	return parsed
}

function parseRune(version) {
	var data = readJSON(version, "runesReforged")
	var parsed = {}

	data.forEach(function(rune) {
		parsed[rune.id] = {
			id: rune.id,
			key: rune.key,
			icon: rune.icon,
			name: rune.name,
			img: path.join("/assets/dragontail", version, rune.icon)
		}

		rune.slots.forEach(function(slot) {
			slot.runes.forEach(function(style) {
				cDragon = cDragonPerks[style.id]
				parsed[style.id] = {
					id: style.id,
					key: style.key,
					icon: style.icon,
					name: style.name,
					shortDesc: style.shortDesc,
					longDesc: style.longDesc,
					tooltip: cDragon.tooltip,
					img: path.join("/assets/dragontail", version, style.icon),
					endOfGameStatDescs: cDragon.endOfGameStatDescs
				}
			}) 
		})
	})

	cDragonPerks.statMods.forEach(function(statMod) {
		statMod.img = statMod.img.replace("@version@", version)
		parsed[statMod.id] = statMod
	})

	return parsed
}

function parseItem(version) {
	var data = readJSON(version, "item").data

	Object.entries(data).forEach(function([key, value]) {
		data[key] = {
			name: value.name,
			description: value.description,
			from: value.from,
			gold: value.gold,
			tags: value.tags,
			stats: value.stats,
			img: imgPath(version, value.image.group, value.image.full)
		}
	})

	return data
}

function parseSummoner(version) {
	var data = readJSON(version, "summoner").data
	var parsed = {}

	Object.entries(data).forEach(function([key, value]) {
		parsed[value.key] = {
			id: value.id,
			key: value.key,
			name: value.name,
			description: value.description,
			tooltip: value.tooltip,
			cooldown: value.cooldown,
			cooldownBurn: value.cooldownBurn,
			img: imgPath(version, value.image.group, value.image.full)
		}
	})

	return parsed
}


// Version functions
function versionData(version) {
	return {
		champion: parseChampion(version),
		rune: parseRune(version),
		item: parseItem(version),
		summoner: parseSummoner(version)
	}
}

function checkVersion(version) {
	if (objectData[version] === undefined) {
		objectData[version] = versionData(version)
		console.log(`Loading data for v${version}`)
	}
}



var cDragonPerks = { statMods: [] }
JSON.parse(fs.readFileSync("./public/assets/cdragon/perks.JSON", "utf8")).forEach(function(perk) {
	cDragonPerks[perk.id] = {
		tooltip: perk.tooltip,
		endOfGameStatDescs: perk.endOfGameStatDescs
	}

	if (perk.iconPath.includes("StatMods")) {
		cDragonPerks.statMods.push(
			{
				id: perk.id,
				name: perk.name,
				tooltip: perk.tooltip,
				shortDesc: perk.shortDesc,
				longDesc: perk.longDesc,
				endOfGameStatDescs: perk.endOfGameStatDescs,
				img: perk.iconPath.replace("lol-game-data/assets/v1", "assets/dragontail/@version@")
			}
		)
	}
})


// Versions
var versions = JSON.parse(fs.readFileSync("./public/assets/dragontail/versions.JSON", "utf8"))
var liveVersion = versions[0]


var objectData = {}
objectData[liveVersion] = versionData(liveVersion)






// Maps
var staticMaps = JSON.parse(fs.readFileSync(`./public/assets/dragontail/${liveVersion}/data/map.JSON`, "utf8")).data

Object.entries(staticMaps).forEach(function([key, value]) {
	var svgPath = "/assets/icons/svgs"
	value["img"] = imgPath(liveVersion, value.image.group, value.image.full)

	if (value.MapId == 11) {
		value["svg"] = path.join(svgPath, "/map/classic.svg")
	} else if (value.MapId == 12) {
		value["svg"] = path.join(svgPath, "/map/aram.svg")
	} else if (value.MapId == 22) {
		value["svg"] = path.join(svgPath, "/map/cherry.svg")
	} else {
		value["svg"] = path.join(svgPath, "blank.svg")
	}
})


// Queues
var queues = {}
JSON.parse(fs.readFileSync("./public/assets/dragontail/queues.JSON", "utf8")).forEach(function(element) {
	if (element.description !== null) {
		element.desc = element.description.replace("games","").replace("5v5","").trim()
	} else {
		element.desc = null
	}
	queues[element.queueId] = element
})



module.exports = {

	runeData: readJSON(liveVersion, "runesReforged"),

	liveVersion,

	champion: function (championId, version) {
		/**
		 * @param {string} - championId
		 * @param {string} - gameVersion (X.X.1)
		 * @returns {Object} - chamion data object
		 */

		if (version === undefined) { version = liveVersion };
		checkVersion(version)
		return dupeJSON(objectData[version].champion[championId])
	},

	rune: function (rune, version) {
		/**
		 * @param {Object|number} - perk & vars object | perk id
		 * @param {string} - gameVersion (X.X.1)
		 * @returns {Object} - rune data object
		 */

		if (version === undefined) { version = liveVersion };
		checkVersion(version)
		if (typeof rune === "object") {
			if (objectData[version].rune[rune.perk] === undefined) {
				return undefined
			} else {
				let runeObject = dupeJSON(objectData[version].rune[rune.perk])
				runeObject.endOfGameStatDescs = runeObject.endOfGameStatDescs.map(function(statDesc) {
					return statDesc.replace("@eogvar1@", rune.var1).replace("@eogvar2@", rune.var2).replace("@eogvar3@", rune.var3)
				})
				return runeObject
			}
		} else if (typeof rune === "number") {
			return dupeJSON(objectData[version].rune[rune])
		} else if (!isNaN(Number(rune))) {
			return dupeJSON(objectData[version].rune[Number(rune)])
		} else {
			return undefined
		}
	},

	item: function (id, version) {
		/**
		 * @param {string} - item id
		 * @param {string} - gameVersion (X.X.1)
		 * @returns {Object} - item data object
		 */

		if (version === undefined) { version = liveVersion };
		checkVersion(version)
		return dupeJSON(objectData[version].item[id])
	},

	summoner: function (key, version) {
		/**
		 * @param {string} - summoner spell key
		 * @param {string} - gameVersion (X.X.1)
		 * @returns {Object} - summoner spell data object
		 */

		if (version === undefined) { version = liveVersion };
		checkVersion(version)
		return dupeJSON(objectData[version].summoner[key])
	},



	maps: function (id) {
		/**
		 * @param {string} - map id
		 * @returns {Object} - map data object
		 */

		return dupeJSON(staticMaps[id])
	},

	queue: function (id) {
		/**
		 * @param {string} - queue id
		 * @returns {Object} - queue data object
		 */

		return dupeJSON(queues[id])
	}
}