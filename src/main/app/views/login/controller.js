/**
 * 登录页
 */
import './index.html';
import 'login-form';
export default $app.controller('loginController',
    function ($scope) {
        $scope.orgName = 'DEV_FEP_ADMIN';
        $scope.login = function(){
          return $scope.ucLoginFormSubmit()
                                .then(function (userData) {

                                });
        }
    }
);
