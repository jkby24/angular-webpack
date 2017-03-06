/**
 * 登录页
 */
import './index.html';
import 'login-form';
import ucComponent from 'uc-component';
export default $app.controller('loginController',
    function($scope) {
        $scope.orgName = 'FEP';
        $scope.login = function() {
            return $scope.ucLoginFormSubmit()
                .then(function(userData) {
                    ucComponent.setUserObj(userData);
                });
        }
    }
);
