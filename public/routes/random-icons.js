const express = require("express")
const router = express.Router()
const fs = require("fs")

router.use(express.static("public"))


const iconArrayChampies = fs.readdirSync("./public/assets/dragontail/profileicon/champies", {recursive: true}, (err, files) => {return files})
const iconArrayChampieFavs = fs.readdirSync("./public/assets/dragontail/profileicon/champies/fav", {recursive: true}, (err, files) => {return files})
const iconArrayFavs = fs.readdirSync("./public/assets/dragontail/profileicon/fav", {recursive: true}, (err, files) => {return files})


function randomSelect(iconArray, rootPath) {
	iconArray.splice(iconArray.indexOf("fav"), 1) // remove 'fav' dir
	imgsrc = "assets/dragontail/profileicon/" + rootPath + iconArray[Math.floor(Math.random()*iconArray.length)]

	return imgsrc
}


router.use((req, res, next) => {
	res.locals = {
		path: "/random-icon/",
		links: ["Favorites", "All Champies", "Fav Champies"]
	}
  next()
})

var selection = require("../controllers/selection.js")
router.get("/selection", (req, res, next) => {
	res.locals.pageTitle = "Random Icons"
	res.locals.display = [randomSelect(iconArrayFavs, "fav/"), randomSelect(iconArrayChampies, "champies/"), randomSelect(iconArrayChampieFavs, "champies/fav/")]
	next()
}, selection.selectionNavigation)


router.use("/favorites", (req, res, next) => {
	res.locals.pageTitle = "Random Icon – Favorites"
	res.locals.icons = iconArrayFavs
	res.locals.assetPath = "fav/"
	next()
})


router.use("/all-champies", (req, res, next) => {
	res.locals.pageTitle = "Random Icon – All Champies"
	res.locals.icons = iconArrayChampies
	res.locals.assetPath = "champies/"
	next()
})


router.use("/fav-champies", (req, res, next) => {
	res.locals.pageTitle = "Random Icon – Favorite Champies"
	res.locals.icons = iconArrayChampieFavs
	res.locals.assetPath = "champies/fav/"
 	next()
})



router.use((req, res, next) => {
	res.locals.imgsrc = randomSelect(res.locals.icons, res.locals.assetPath)
	next()
})



router.get(["/favorites", "/all-champies", "/fav-champies"], (req, res, next) => {
	res.locals.display = [res.locals.imgsrc]
	next()
}, selection.selectionNavigation)


module.exports = router