
function aeMenuBar() {

    let aeMenuBar = {
        templateUrl: 'views/menu-bar.html',
        link: link
    };

    return aeMenuBar;

    function link(scope, element, attrs) {

        scope.title = attrs.title;
        scope.icon = attrs.icon;

        angular.element(document).on('click', handleTouch);

        function handleTouch(event) {

        	let parents = angular.element(event.target).parents('#sidenav-container');
       		let inSidenav = parents.length;
       		let isNavIcon = angular.element(event.target).hasClass('nav-icon');
       		let isDisplayed = angular.element('#sidenav-container').css('display');

       		// Clicks outside a visible nav bar close the nav bar
       		if(!inSidenav && isDisplayed) {
       			angular.element('#sidenav-container').css('display', 'none');
       		}

            // Click on menu icon to open nav bar
       		if(isNavIcon) {
       			angular.element('#sidenav-container').css('display', 'block');
       		}
        }
    }
}

function aeTallMenuBar() {

        let aeTallMenuBar = {
            templateUrl: 'views/tall-menu-bar.html',
            scope: {
                title: '@',
                titleHeading: '@'
            },
            link: link
        };

        return aeTallMenuBar;

        function link(scope, element, attrs) {

            console.log(attrs);
            // scope.title = attrs.title;
            // scope.icon = attrs.icon;
            // scope.titleHeading = attrs.titleHeading;

            // angular.element(document).on('click', handleTouch);

            function handleTouch(event) {

            	let parents = angular.element(event.target).parents('#sidenav-container');
           		let inSidenav = parents.length;
           		let isNavIcon = angular.element(event.target).hasClass('nav-icon');
           		let isDisplayed = angular.element('#sidenav-container').css('display');

           		// Clicks outside a visible nav bar close the nav bar
           		if(!inSidenav && isDisplayed) {
           			angular.element('#sidenav-container').css('display', 'none');
           		}

                // Click on menu icon to open nav bar
           		if(isNavIcon) {
           			angular.element('#sidenav-container').css('display', 'block');
           		}
            }
        }
}
export {aeMenuBar, aeTallMenuBar};
