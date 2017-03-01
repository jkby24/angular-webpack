/**
 * ES6 Module
 */
// import bc from '../../../themes/blue-zh_CN/images/dili.png';
import './index.html';
export default angular.module('app').controller('homeIndexController',
    function ($scope, $stateParams, $timeout) {
        $scope.a = 'index@home：HMR!';
        // $scope.imgDir = '/themes/blue-zh_CN/pic/';
        // $scope.imgName = $stateParams.imgName ? $stateParams.imgName : '3.jpg';
        // $timeout(() => {
        //     $scope.src = bc;//$scope.imgDir + $scope.imgName;
        // }, 3000);

    }
);
