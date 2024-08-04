const express = require("express")
const router = express.Router()
const fs = require("fs")

router.use(express.static("public"))



const iconArrayChampies = fs.readdirSync("./public/assets/dragontail/profileicon/champies", {recursive: true}, (err, files) => {return files})
const iconArrayChampieFavs = fs.readdirSync("./public/assets/dragontail/profileicon/champies/fav", {recursive: true}, (err, files) => {return files})
const iconArrayFavs = fs.readdirSync("./public/assets/dragontail/profileicon/fav", {recursive: true}, (err, files) => {return files})


router.use("/favorites", (req, res, next) => {
	res.locals.icons = iconArrayFavs
	res.locals.path = "assets/dragontail/profileicon/fav"

	next()
})


router.use("/all-champies", (req, res, next) => {
	res.locals.icons = iconArrayChampies
	res.locals.path = "assets/dragontail/profileicon/champies"

	next()
})


router.use("/fav-champies", (req, res, next) => {
	res.locals.icons = iconArrayChampieFavs
	res.locals.path = "assets/dragontail/profileicon/champies/fav"

 	next()
})



router.use((req, res, next) => {
	res.locals.icons.splice(res.locals.icons.indexOf("fav"), 1) // remove 'fav' dir
	res.locals.imgsrc = res.locals.path + "/" + res.locals.icons[Math.floor(Math.random()*res.locals.icons.length)]
	
	next()
})



router.get(["/favorites", "/all-champies", "/fav-champies"], (req, res) => {
	res.render("random-icon.ejs", {
		pageTitle: "Random Icon",
		imgsrc: res.locals.imgsrc
	})
})


module.exports = router