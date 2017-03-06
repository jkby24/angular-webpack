/**
 * Created by px on 2016/2/6 0006.
 */

import angular from 'angular';
import 'userdata_util';
export default angular.module('userdata', [])
    .constant("KEY_CURRENT_CHILD_INFO", 'KEY_CURRENT_CHILD_INFO')
    .directive('espUserRoleName', ['userDataService', '$filter', function (userDataService, $filter) {
        return function (scope, elm) {
            var userObj = userDataService.getUserObj();
            if (userObj && userObj.info) {
                var roleName = userDataUtil.ROUTE_ROLE_OPTION[userObj.info.role].name;
                if (roleName) {
                    elm.text($filter('translate')(roleName));
                } else {
                    elm.hide();
                }
                scope.espUserRoleName = roleName;
            }
        };
    }])
    .directive('espUserLog', [function () {
        return function (scope, elm) {
            elm.click(function () {
                $("body").html(ucComponent.getLog().join('<br/>'));
                ucComponent.removeLog()
            });
        };
    }])
    .directive('espUserNickName', ['userDataService', function (userDataService) {
        return function (scope, elm) {
            var userObj = userDataService.getUserObj();
            if (userObj && userObj.info) {
                elm.text(userObj.info.real_name);
                elm.attr('title', userObj.info.real_name);
            }
        };
    }])
    .directive('espUserLogout', [function () {
        return {
            restrict: 'A',
            controller: ['$element', 'userDataService', '$attrs', function ($element, userDataService, $attrs) {
                $element.click(function () {
                    var logoutUrl = $attrs['logoutSrc'];
                    if (!logoutUrl) {
                        logoutUrl = ucComponent.canArriveWindow.location.origin;
                    }
                    userDataService.logout(logoutUrl, true);
                })
            }]
        };
    }])

    .service('userDataService', ['$rootScope', 'KEY_CURRENT_CHILD_INFO',
        function ($rootScope, KEY_CURRENT_CHILD_INFO) {
            var localStorage = ucComponent.canArriveWindow.localStorage;
            return {
                getQueryString: userDataUtil.getQueryString,
                getLocationParams: userDataUtil.getLocationParams,
                isLogin: userDataUtil.isLogin,
                hasLoginCookie: userDataUtil.hasLoginCookie,
                needLogin: userDataUtil.needLogin,
                setUserObj: function (objData) {
                    userDataUtil.setUserObj(objData);
                },
                remove: function () {
                    $rootScope.userObj = '';
                    userDataUtil.remove();
                },
                getHomePageUrl: userDataUtil.getHomePageUrl,
                userUnvalid: userDataUtil.userUnvalid,
                logout: userDataUtil.logout,
                getUserObj: function () {
                    $rootScope.userObj = userDataUtil.getUserObj();
                    return $rootScope.userObj;
                },
                //仅仅获取数据
                getUserData: function () {
                    $rootScope.userObj = userDataUtil.getUserData();
                    return $rootScope.userObj;
                },
                //最后一次登录成功的角色
                hasLastLoginRole: userDataUtil.hasLastLoginRole,
                hasLastLoginCourse: userDataUtil.hasLastLoginCourse,
                getLastLoginRole: userDataUtil.getLastLoginRole,
                setLastLoginRole: userDataUtil.setLastLoginRole,
                //多个角色切换后的当前角色
                getCurrentCourse: userDataUtil.getCurrentCourse,
                setCurrentCourse: userDataUtil.setCurrentCourse,
                isMultiCourse: userDataUtil.isMultiCourse,
                getMultiCourseList: userDataUtil.getMultiCourseList,
                setUserInfoRole: userDataUtil.setUserInfoRole,
                getTokenInfo: userDataUtil.getTokenInfo,
                //获取绑定的学生
                getCurrentChildData: function () {
                    var parentId = this.getUserObj().token.user_id;
                    var childInfo = localStorage.getItem(KEY_CURRENT_CHILD_INFO);
                    if (childInfo) {
                        childInfo = JSON.parse(childInfo);
                        if (childInfo[parentId]) {
                            return childInfo[parentId];
                        }
                    }
                },
                //获取绑定的学生,没有绑定跳转到绑定页面
                getCurrentChildInfo: function () {
                    var childData = this.getCurrentChildData();
                    if (!childData) {
                        window.location.href = '#!/home/common/binding';
                        throw new Error("未绑定学生信息或绑定信息丢失");
                    } else {
                        return childData;
                    }
                },
                //设置绑定的学生
                setCurrentChildInfo: function (childInfo) {
                    var parentId = this.getUserObj().token.user_id;
                    var childData = {};
                    childData[parentId] = childInfo;
                    localStorage.setItem(KEY_CURRENT_CHILD_INFO, JSON.stringify(childData));
                },
                //是否微信
                isWechat: function ($stateParams) {
                    return $stateParams.openid && $stateParams.client === 'phone' && $stateParams.from_where === 'wechat';
                },
                //是否手机端应用
                isPhone: function ($stateParams) {
                    return $stateParams.client === 'phone' && !!$stateParams.from_where;
                },
                //是否web端应用
                isWeb: function ($stateParams) {
                    return !$stateParams.client && !$stateParams.from_where;
                },
                /**
                 * 用户角色列表
                 * @param userInfo
                 * @returns {Array}
                 */
                getUserRoleList: function (userInfo,courseList) {
                    var that = this;
                    var roleList = [];
                    if(!userInfo){
                        userInfo = userDataService.getUserData().info;
                    }
                    _.forEach(userInfo.roles, function (role) {
                        if(that.isMultiCourse(role)){
                            roleList = roleList.concat(_.map(that.getMultiCourseList(role, userInfo),function(course){
                                return {role:role,roleName:userDataUtil.ROUTE_ROLE_OPTION[role].name,course:course,courseName:courseList.getName(course)};
                            }));
                        }else{
                            roleList.push({role:role,roleName:userDataUtil.ROUTE_ROLE_OPTION[role].name});
                        }
                    })
                    return roleList;
                }

            };
        }]);
