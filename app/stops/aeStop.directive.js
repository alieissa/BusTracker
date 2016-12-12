'use strict';

aeStop.$inject = ['dBService'];

function aeStop(dBService) {

    let linkFn = (scope, element, attrs) => {
        let _handleStarTouch = () => {
            let _code = scope.stop.code;
            let _favourite = scope.stop.favourite === 0 ? 1 : 0;

            dBService.set('stops', {favourite:_favourite}, {code: _code}).then(result => {
                scope.stop.favourite = _favourite;
            });
        };

        element.find('i.star').on('click', _handleStarTouch);
    };

    let aeStop_ = {
        templateUrl: 'partials/stop.directive.html',
        scope: { stop: '=' },
        link: linkFn
    };
    return aeStop_;
}

export {aeStop};
