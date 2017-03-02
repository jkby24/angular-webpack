/**
 * ES6 Module
 */
import './page1.html';
export default angular.module('app').controller('homePage1Controller',
    function ($scope, $stateParams, $timeout) {
        $scope.a = 'index@home：HMR22!';
    }
);
