const fs = require("fs")
const path = require("path")


function imgPath(root, file) {
	return path.join("/assets/dragontail", root, file).replace(/\\/g,"/")
}


// Champions
var champion = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/champion.JSON", "utf8")).data
Object.entries(champion).forEach(function([key, value]) {
	value["img"] = {
		"centered": imgPath("/champion/centered", value["id"]+"_0.jpg"),
		"loading": imgPath("/champion/loading", value["id"]+"_0.jpg"),
		"loadingcrop": imgPath("/champion/loadingcrop", value["id"]+"_0.jpg"),
		"splash": imgPath("/champion/splash", value["id"]+"_0.jpg"),
		"square": imgPath("/champion/square", value["id"]+".png"),
		"squarecrop": imgPath("/champion/squarecrop", value["id"]+".png"),
		"tiles": imgPath("/champion/tiles", value["id"]+"_0.jpg")
	}
	champion[value.key] = value
})


// Runes
var runesReforged = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/runesReforged.JSON", "utf8"))
var runes = {}
runesReforged.forEach(function(element, eleIndex) {
	runes[element.id] = { "id": element.id, "key": element.key, "icon": element.icon, "name": element.name, "img": path.join("/assets/dragontail", element.icon) }
	// runesReforged[eleIndex].img = path.join("/assets/dragontail", element.icon)
	element.slots.forEach(function(slot, slotIndex) {
		slot.runes.forEach(function(item, itemIndex) {
			item.img = path.join("/assets/dragontail", item.icon) // ★ actually assigning img = "/path"? ───────────────────────────────────────────────────────────────────────────────────────────── ★
			runes[item.id] = item
			// runesReforged[eleIndex].slots[slotIndex].runes[] = path.join("/assets/dragontail", element.icon)
		}) 
	})
})

var cDragonPerks = JSON.parse(fs.readFileSync("./public/assets/cdragon/perks.JSON", "utf8"))
cDragonPerks.forEach(function(perk) {
	if (perk.id in runes) {
		runes[perk.id]["endOfGameStatDescs"] = perk.endOfGameStatDescs
	}
})


// Items
var item = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/item.JSON", "utf8")).data
Object.entries(item).forEach(function([key, value]) {
	value["img"] = imgPath(value["image"]["group"], value["image"]["full"])
	item[value.key] = value
})


// Summoner Spells
var summoner = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/summoner.JSON", "utf8")).data
Object.entries(summoner).forEach(function([key, value]) {
	value["img"] = imgPath(value["image"]["group"], value["image"]["full"])
	summoner[value.key] = value
})



module.exports = {

	runeData: runesReforged,

	rune: function (rune) {
		/**
		 * Obtains rune data object by id
		 * 
		 * @param {Object|number} - perk (+ vars) object | perk id
		 * @returns {Object} - rune data object
		 */

		if (typeof rune === 'object') {
			let runeObject = JSON.parse(JSON.stringify(runes[rune.perk]))
			runeObject.endOfGameStatDescs = runeObject.endOfGameStatDescs.map(function(statDesc) {
				return statDesc.replace("@eogvar1@", rune.var1).replace("@eogvar2@", rune.var2).replace("@eogvar3@", rune.var3)
			})
			return runeObject
		} else if (typeof rune === 'number') {
			return JSON.parse(JSON.stringify(runes[rune]))
		} else {
			return undefined
		}
	},

	champion: function (input) {
		/**
		 * Obtains champion data object by key OR id
		 * 
		 * @param {string} - key
		 * @returns {Object} - champion data object
		 */

		return champion[input]
	},

	item: function (id) {
		/**
		 * Obtains item data object by key
		 * 
		 * @param {number} - id
		 * @returns {Object} - item data object
		 */

		return item[id]
	},

	summoner: function (key) {
		/**
		 * Obtains summoner spell data object by key
		 * 
		 * @param {number} - key
		 * @returns {Object} - summoner spell data object
		 */

		return summoner[key]
	}
}