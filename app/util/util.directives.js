
function aeMenuBar() {

    let aeMenuBar = {
        templateUrl: 'views/menu-bar.html',
        link: link
    };

    return aeMenuBar;

    function link(scope, element, attrs) {

        // console.log(attrs.title);
        scope.title = attrs.title;
       	angular.element(document).on('click', handleTouch);

        function handleTouch(event) {

        	let parents = angular.element(event.target).parents('#sidenav-container');
       		let inSidenav = parents.length;
       		let isNavIcon = angular.element(event.target).hasClass('nav-icon');
       		let isDisplayed = angular.element('#sidenav-container').css('display');

       		// console.log(parents)
       		if(!inSidenav && isDisplayed) {
       			angular.element('#sidenav-container').css('display', 'none');
       		}

       		if(isNavIcon) {
       			angular.element('#sidenav-container').css('display', 'block');
       		}
        }
        console.log('Route directive link fn');
    }
}

export {aeMenuBar};
