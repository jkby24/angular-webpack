/**
 * Created by px on 2016/8/12 0012.
 * 登陆
 */
import ucComponent from 'uc-component';
import 'uc-api-service';
import 'uc-common-service';
export default $app.directive('ucLoginForm', ['$location', 'ucApiService', 'ucCommonService', '$q',
    function ($location, ucApiService, ucCommonService, $q) {
        return {
            restrict: 'EA',
            link: function ($scope, $element, attrs) {
                //配置
                var rememberedDefault = !attrs.rememberedDefault ? true : attrs.rememberedDefault == 'ture';//记住密码默认是否勾选
                var orgName = attrs.orgName;//必须,用户组织类型，同一个网站有多个登陆的时候
                //var mainPage = attrs.mainPage; //必须,首页相对路径
                var numIdentifyCode = !attrs.numIdentifyCode ? 3 : parseInt(attrs.numIdentifyCode);//操作次数，注册次数或登录错误次数时出现验证码
                //设置组织
                ucComponentConfig.org_name = orgName;
                ucComponentConfig.main_html = attrs.mainPage;
                //数据模型
                $scope.ucLoginFormModel = {
                    isLogining:false,
                    showLoginView: false,
                    remembered: rememberedDefault,
                    showIdentifyCode: !numIdentifyCode,
                    identifyCodeImageUrl: '',
                    errorMessage: null,
                    errorCode: null,
                    //登陆表单
                    loginData: {
                        login_name: '',
                        password: '',
                        org_name: orgName,
                        device_type: 'pc',
                        session_id: '',
                        identify_code: ''

                    },
                    sessionData: {
                        session_id: '',
                        session_key: '',
                        op_count: ''
                    }
                };
                $scope.ucLoginSuccess = function (userData) {
                    ucComponent.setUserObj(userData);
                    $scope.ucLoginFormModel.isLogining = false;
                    top.window.location.href = attrs.mainPage;
                }
                //登陆
                $scope.ucLogin = function () {
                    return $scope.ucLoginFormSubmit()
                        .then($scope.ucLoginSuccess);
                };
                //登陆-未自动跳转
                $scope.ucLoginFormSubmit = function () {
                    var defer = $q.defer();
                    $scope.ucLoginFormModel.isLogining = true;
                    var postData = angular.copy($scope.ucLoginFormModel.loginData);
                    postData.login_name = ucCommonService.encodeLoginName(postData.login_name, $scope.ucLoginFormModel.sessionData.session_key);
                    postData.password = ucCommonService.encodePassword(postData.password, $scope.ucLoginFormModel.sessionData.session_key);
                    $scope.ucLoginFormModel.errorMessage = null;
                    $scope.ucLoginFormModel.errorCode = null;
                    ucApiService.ucLoginSubmit(postData)
                        .then(function (userData) {
                            if ($scope.ucLoginFormModel.remembered) {
                                ucComponent.setLogin(orgName, {
                                    login_name: $scope.ucLoginFormModel.loginData.login_name,
                                    password: $scope.ucLoginFormModel.loginData.password
                                });
                            } else {
                                ucComponent.removeLogin(orgName);
                            }
                            userData.user_id = ucComponent.decryptByDES(userData.user_id, $scope.ucLoginFormModel.sessionData.session_key);
                            userData.mac_key = ucComponent.decryptByDES(userData.mac_key, $scope.ucLoginFormModel.sessionData.session_key);

                            defer.resolve(userData);
                        }, function (errorResponse) {
                            $scope.ucLoginFormModel.errorMessage = errorResponse && errorResponse.message;
                            $scope.ucLoginFormModel.errorCode = errorResponse && errorResponse.code;
                            $scope.changeIdentifyCode();
                            $scope.ucLoginFormModel.isLogining = false;
                            defer.reject();
                        });
                    return defer.promise;
                }
                //验证码 3次出现
                $scope.changeIdentifyCode = function () {
                    ucApiService.createSession(1, orgName)
                        .then(function (sessionData) {
                            $scope.ucLoginFormModel.sessionData = sessionData;
                            $scope.ucLoginFormModel.loginData.session_id = sessionData.session_id;
                            $scope.ucLoginFormModel.showIdentifyCode = sessionData.op_count >= numIdentifyCode;
                            if ($scope.ucLoginFormModel.showIdentifyCode) {
                                $scope.ucLoginFormModel.identifyCodeImageUrl = ucApiService.getIdentifyCodeImageUrl(sessionData.session_id);
                            }
                        });
                }

                //入口
                $scope.changeIdentifyCode();
                //自动登陆
                if (ucComponent.hasLoginCookie()) {
                    //window.location.href = mainPage;
                } else {
                    ucComponent.remove();
                    $scope.ucLoginFormModel.showLoginView = true;
                }
                //记住密码功能
                var loginInfo = ucComponent.getLogin(orgName);
                var remember = ucComponent.getLoginRemember(orgName);
                if (loginInfo) {
                    $scope.ucLoginFormModel.loginData.login_name = loginInfo.login_name;
                    $scope.ucLoginFormModel.loginData.password = loginInfo.password;
                    $scope.ucLoginFormModel.remembered = true;
                } else {
                    if (remember == false) {
                        $scope.ucLoginFormModel.remembered = false;
                    }
                }
            }
        };
    }]);
