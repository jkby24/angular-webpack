/**
 * 登录页
 */
import './login.html';
import 'login-form';
export default $app.controller('homeLoginController',
    function ($scope) {
        $scope.login = function(){
          debugger
          return $scope.ucLoginFormSubmit()
                                .then(function (userData) {

                                });
        }
    }
);
