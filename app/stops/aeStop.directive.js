'use strict';

aeStop.$inject = ['dBService'];

function aeStop(dBService) {

    let aeStop_ = {
        templateUrl: 'partials/stop.directive.html',
        scope: { stop: '=' },
        link: linkFn
    };
    return aeStop_;
}

export {aeStop};



function linkFn(scope, element, attrs) {

    let _code = scope.stop.code;
    let _favourite = scope.stop.favourite;
    let star = element.find('i.star');

    element.find('i.star').on('click', handleStarTouch);

    function handleStarTouch() {

        _favourite = _favourite === 0 ? 1 : 0;

        dBService.set('stops', {favourite:_favourite}, {code: _code}).then((result) => {
          let _starType = _favourite === 0 ? 'star_border' : 'star';
          scope.stop.favourite = _favourite;
          star.text(_starType);
        });
    }
}
