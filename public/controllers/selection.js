exports.selectionNavigation = function(req, res) {
	res.render("selection-navigation", {
		pageTitle: res.locals.pageTitle,
		urlPath: res.locals.path,
		champions: res.locals.champions
	})
}