'use strict';

function aeMenuBar() {

    let aeMenuBar = {
        templateUrl: 'partials/menu-bar.html',
        scope: {
            title: '@',
            icon: '@',
            search: '='
        },
        link: linkFn
    };

    return aeMenuBar;

    function linkFn(scope, element, attrs) {

        let _handleTouch = event => {
            let parents = angular.element(event.target).parents('#sidenav-container');
            let inSidenav = parents.length;
            let isNavIcon = angular.element(event.target).hasClass('ae-nav-icon');
            let isDisplayed = angular.element('#sidenav-container').css('display');

            // Clicks outside a visible nav bar close the nav bar
            if(!inSidenav && isDisplayed) {
                angular.element('#sidenav-container').css('display', 'none');
            }

            // Click on menu icon to open nav bar
            if(isNavIcon) {
                angular.element('#sidenav-container').css('display', 'block');
            }
        };

        angular.element(document).on('click', _handleTouch);
    }
}

function aeTallMenuBar() {

        let aeTallMenuBar_ = {
            templateUrl: 'partials/tall-menu-bar.html',
            scope: { title: '@', titleHeading: '@' },
            link: linkFn
        };

        return aeTallMenuBar_;


        function linkFn(scope, element, attrs) {

            // element.find only works with tag names
            let _backBtn = angular.element(document).find('i.back-btn');

            // Click/Touch on Android go back one page
            angular.element(_backBtn).on('click', () => navigator.app.backHistory());
        }
}

export {aeMenuBar, aeTallMenuBar};
