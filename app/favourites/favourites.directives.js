'use strict';

function favesList() {

    let favesList = {
        templateUrl: './views/faves-list.html',
        scope: {
            routes: '=',
            stops: '='
        },
        link: link
    }

    return favesList;

    function link(scope, element, attrs) {

        angular.element('.tab-item').on('touchstart', handleTouch);
        angular.element('.tab-item').on('click', function() {
        	let targetDiv = angular.element(this).attr('id');
        	let contentDiv = `${targetDiv}-content`;
        	let otherDiv = contentDiv === 'stops-tab-content' ? 'routes-tab-content' : 'stops-tab-content'

        	angular.element(`#${contentDiv}`).css('display', 'block');
        	angular.element(`#${otherDiv}`).css('display', 'none');
        });

        function handleTouch() {

            if(angular.element(this).hasClass('.tab-active')) {
                return;
            }

            angular.element('.tab-active').removeClass('tab-active');
            angular.element(this).addClass('tab-active');

            return;
        }
    }

    return;
}

export {favesList}
