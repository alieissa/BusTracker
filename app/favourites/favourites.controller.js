
function FavesCtrl(faveRoutes, faveStops) {

    let vm = this;
    console.log(faveRoutes)
	console.log(faveStops)
    vm.routes =  faveRoutes;
    vm.stops = faveStops;
}

export {FavesCtrl}
