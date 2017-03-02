/**
 * ES6 Module
 */
import './index.html';
export default $app.controller('homeCardController',
    function ($scope, $stateParams, $timeout) {
        $scope.a = 'index@home：HMR22!';
    }
);
