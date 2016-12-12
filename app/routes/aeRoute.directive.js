'use strict';

aeRoute.$inject = ['dBService'];

function aeRoute(dBService) {

    let linkFn = (scope, element, attrs) => {
        let _handleStarTouch = () => {
            let _favourite = scope.route.favourite === 0 ? 1 : 0;
            let _id = scope.route.id;

            dBService.set('routes', {favourite:_favourite}, {id: _id}).then(result => {
                scope.route.favourite = _favourite;
            });
        };

        element.find('i.star').on('click', _handleStarTouch);
    };

    let aeRoute_ = {
        templateUrl: 'partials/route.directive.html',
        scope: { route: '=' },
        link: linkFn
    };
    return aeRoute_;
}

export {aeRoute};
