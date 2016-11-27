'use strict';

function aeMenuBar() {

    let aeMenuBar = {
        templateUrl: 'views/menu-bar.html',
        scope: {
            title: '@',
            icon: '@',
            search: '='
        },
        // controller: controller,
        link: link
    };

    return aeMenuBar;

    // function controller() {}
    
    function link(scope, element, attrs) {

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
            // controller: controller,
            link: link
        };

        return aeTallMenuBar;

        // function controller() {}

        function link(scope, element, attrs) {

            // element.find only works with tag names
            let backBtn = angular.element(document).find('i.back-btn');

            // Click/Touch on Android go back one page
            angular.element(backBtn).on('click', () => navigator.app.backHistory());
        }
}
export {aeMenuBar, aeTallMenuBar};
