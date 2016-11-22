'use strict';

function aeFavesList() {

    let aeFavesList = {
        templateUrl: './views/faves-list.html',
        scope: {
            routes: '=',
            stops: '='
        },
        link: link
    }

    return aeFavesList;

    function link(scope, element, attrs) {

        angular.element('.tab-item').on('click', function() {

        	let targetDiv = angular.element(this).attr('id');
        	let contentDiv = `${targetDiv}-content`;
        	let otherDiv = contentDiv === 'stops-tab-content' ? 'routes-tab-content' : 'stops-tab-content'

        	angular.element(`#${contentDiv}`).css('display', 'block');
        	angular.element(`#${otherDiv}`).css('display', 'none');
        });
    }

    return;
}

export {aeFavesList}
