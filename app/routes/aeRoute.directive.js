'use strict';

aeRoute.$inject = ['dBService'];

function aeRoute(dBService) {

    let aeRoute_ = {
        templateUrl: 'partials/route.directive.html',
        scope: { route: '=' },
        link: linkFn
    };
    return aeRoute_;
}

export {aeRoute};


function linkFn(scope, element, attrs) {

    element.find('i.star').on('click', handleStarTouch);

    function handleStarTouch() {

        let _favourite = scope.route.favourite === 0 ? 1 : 0;
        let _name = scope.route.name;

        dBService.set('routes', {favourite:_favourite}, {name: _name}).then(result => {
            scope.route.favourite = _favourite;
            let _starType = _favourite === 0 ? 'star_border' : 'star';
            element.find('i.star').text(_starType);
        });
    }
}
