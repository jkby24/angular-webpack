/**
 * ES6 Module
 */
import './index.html';
import '../../../components/directive/app-list/app-loading.js';
import '../../../components/filter/common-filter.js';
import '../../../components/service/common-service.js';
export default $app.controller('homeIndexController',
    function ($scope, $stateParams, $timeout,commonService) {
        $scope.a = commonService.getMegTest();
        console.log('123');

    }
);
