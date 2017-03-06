/**
 * Created by cgw on 2017/3/6
 */
var ucComponent = require('uc-component');
var userDataUtil = window.userDataUtil || {};
(function () {
    var console = window.console || {
            log: function () {
            }
        };
    //时间格式化
    if (!Date.prototype.toISOString) {
        (function () {

            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            }

            Date.prototype.toISOString = function () {
                return this.getUTCFullYear() +
                    '-' + pad(this.getUTCMonth() + 1) +
                    '-' + pad(this.getUTCDate()) +
                    'T' + pad(this.getUTCHours()) +
                    ':' + pad(this.getUTCMinutes()) +
                    ':' + pad(this.getUTCSeconds()) +
                    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                    'Z';
            };

        }());
    }
    //存储key
    userDataUtil.KEY_USER_MENU_STORAGE = 'fep_user_menu';
    userDataUtil.KEY_USER_INFO_STORAGE = '$fep_session_token';
    userDataUtil.KEY_ACCESS_TOKEN = 'fep_access_token';
    userDataUtil.LAST_LOGIN_ROLE = 'fep_last_login_role';
    userDataUtil.LAST_LOGIN_COURSE = 'fep_last_login_course';

    userDataUtil.LASTING_PARAM_ARRAY = ['client', 'mode', 'openid', 'from_where'];
    //权限正则配置
    userDataUtil.ROUTE_ROLE_OPTION = {
        'WHITE_LIST': {
            name: '白名单路由',
            // 一级路由白名单配置（无权限验证，不能取用户信息，否则也自动会登出）
            uriRegExp: "^\/(notfound|login|register|forget|download|applist)"
        },
        'ALL_ROLE': {
            name: '所有角色都可以用的路由',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(login|main|email)", "^\/(html|lib)", "^\/(home|report)\/(common){1}"]
        },
        'CUSTOMER_SERVICE': {
            name: '客服',
            homeRoute: '/home/customer/answer',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/customer{1}"]
        },
        'COURSE_LEADER': {
            name: '学科管理员',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/admin{1}", "^\/(qomtest)\/admin"]
        },
        'TEACHER': {
            name: '教师',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/teacher\/{1}", "^\/report\/(teacher|student)", "^\/(html|lib)"]
        },
        'STUDENT': {
            name: '学生',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/student\/{1}", "^\/(report|qomtest)\/student", "^\/(html|lib)"]
        },
        'PARENTS': {
            name: '学生家长',
            homeRoute: '/home/parents/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(register|binding)", "^\/home\/parents\/{1}", "^\/qomtest\/parent"]
        },
        'CITY_ADMIN': {
            name: '市级管理员',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/city\/(index|knowledge|report){1}"]
        },
        'AREA_ADMIN': {
            name: '行政区县管理员',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/district\/(index|knowledge|double){1}"]
        },
        'SCHOOL_CLASS_ADMIN': {
            name: '班主任',
            homeRoute: '/home/homeroom/examlist?test_type=TERMTEST',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/homeroom{1}"]
        },
        'SCHOOL_ADMIN': {
            name: '学校管理员',
            homeRoute: '/home/common/index',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/school{1}"]
        }
        ,
        'SCHOOL_DISTRICT_ADMIN': {
            name: '学区管理员',
            homeRoute: '/home/common/examlist/main?test_type=TERMTEST',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/area{1}"]
        }
        ,
        'ADMIN': {
            name: '系统管理员',//即运维管理员
            homeRoute: '/home/maintenance/organization/district',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/home\/maintenance{1}", "^\/(qomtest)\/admin"]
        },
        'SCHOOL_COURSE_ADMIN': {
            name: '学校教研员',
            homeRoute: '/home/common/examlist/main?test_type=TERMTEST',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/research{1}"]
        },
        'SCHOOL_GRADE_ADMIN': {
            name: '年级主任',
            homeRoute: '/home/common/examlist/main?test_type=TERMTEST',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/grade{1}"]
        },
        'TEACHING_ADMIN': {
            name: '教学行政人员',
            homeRoute: '/home/common/examlist/main?test_type=TERMTEST',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/staff{1}"]
        },
        'QOM_ADMIN': {
            name: '素质测评管理员',
            homeRoute: '/qomtest/admin/index?test_type=QOMTEST',
            loginRoute: '/#!/login/default',
            uriRegExp: ["^\/(qomtest)\/{1}"]
        },
        'RESOURCE_ADMIN': {
            name: '资源管理员',
            homeRoute: '/home/admin/resources/list',
            loginRoute: '/#!/login/default',
            uriRegExp: ["^\/(home\/admin\/resources){1}"]
        },
        'SUPER_ADMIN': {
            name: '超级管理员',
            homeRoute: '/home/superadmin/role',
            loginRoute: '/#!/login/default',
            uriRegExp: ["^\/S*"]
        },
        'PROVINCE_ADMIN': {
            name: '省级管理员',
            homeRoute: '/home/common/education/plan',
            loginRoute: '/#!/login/default',
            // 权限控制字段，支持数组和绝对路径
            uriRegExp: ["^\/(home)\/province{1}"]
        }
    };
    //格式化菜单
    userDataUtil.formatMenuData = function (menuData) {
        if (menuData && menuData.length > 0) {
            return _.sortBy(_.map(menuData, function (menuDataItem) {
                return _.extend({
                    menu_id:menuDataItem.menu_id,
                    order_num:menuDataItem.order_num,
                    routeName: menuDataItem.menu_name,
                    subRoute: userDataUtil.formatMenuData(menuDataItem.childrens)
                }, menuDataItem.extend_data ? JSON.parse(menuDataItem.extend_data) : {});
            }),['order_num']);
        }
    };

    //从后端获取菜单，并缓存
    userDataUtil.getAllMenuData = function () {
        if (!userDataUtil.ROUTE_ALL_MENU) {
            userDataUtil.customSync(config.fepapi_host + '/v1/menus/actions/search?menu_type=web',{unAuth:true})
                .then(function (menuData) {
                    userDataUtil.ROUTE_ALL_MENU = userDataUtil.formatMenuData(menuData);
                });
        }
        return userDataUtil.ROUTE_ALL_MENU;
    };

    //请求,默认异步
    userDataUtil.customAjax = function (url, config,customOption) {
        //var defer = $q.defer();
        var options = {
            async: false,
            //success: function (data) {
            //	defer.resolve( data);
            //},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                return $.Deferred().reject(XMLHttpRequest.responseJSON);
                //$.reject(XMLHttpRequest.responseJSON);
            }
        };
        options = $.extend(
            {
                disabledLoading: true,
                notAllowAbort: true,
                ignoreGlobalErrorHandle: config && config.ignoreGlobalErrorHandle,
                ignoreErrorCodes: config && config.ignoreErrorCodes,
                unAuth: config && config.unAuth,
                url: url,
                type: config && config.method ? config.method : 'GET',
                headers: config && config.headers,
                data: config && config.data,
                timeout: config && (config._timeout || config.timeout)
            },
            options
        );
        return $.ajax(url,  $.extend(options,customOption));

        //return defer.promise;
    };
    //同步请求
    userDataUtil.customSync = function (url, config) {
        return userDataUtil.customAjax(url, config);
    };
    //异步请求
    userDataUtil.customAsync = function (url, config) {
        return userDataUtil.customAjax(url, config,{async:true});
    };

    userDataUtil.setUserInfoRole = function (responseUserInfo, loginUserInfo) {
        if (responseUserInfo) {
            responseUserInfo.role = (!responseUserInfo.roles || responseUserInfo.roles.length == 0) ? 'EMPTY_ROLE' : userDataUtil.getLastLoginRole(responseUserInfo);
            responseUserInfo.course = userDataUtil.getCurrentCourse(responseUserInfo, responseUserInfo.role);
            userDataUtil.setLastLoginRole(responseUserInfo.role, responseUserInfo);
            userDataUtil.setCurrentCourse(responseUserInfo.course, responseUserInfo);
            loginUserInfo.info = responseUserInfo;
        }
        return loginUserInfo.info;
    };
    userDataUtil.getUserInfoSync = function (userObjTokenOnly) {
        var userInfo = {};
        userDataUtil.customSync(config.fepapi_host + '/v1/users/actions/get_user_info?rnd=' + new Date().getTime(), {
                method: 'GET',
                disabledLoading: true
            }, {
                notAllowAbort: true,
            })
            .then(function (rtnData) {
                window.isAutoLogin = true;
                userDataUtil.setUserInfoRole(rtnData, userInfo);
            });
        userInfo = $.extend(userObjTokenOnly, userInfo);
        userDataUtil.setUserObj(userInfo.info);
        return userInfo;
    };

    userDataUtil.getQueryString = function (name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = null;
        if (!url) {
            url = window.location.href;
        }
        if (url) {
            r = url.split('?');
            if (r.length >= 2) {
                r = r[1].match(reg);
            } else {
                r = null;
            }
        } else {
            r = window.location.search.substr(1).match(reg);
        }
        if (r) {
            return decodeURIComponent(r[2]);
        }
        return '';
    };
    //获取重定向需传递的参数，url为空时默认使用window.location.href
    userDataUtil.getLocationParams = function (url, isLogOut) {
        var paramsNeed = $.merge([], userDataUtil.LASTING_PARAM_ARRAY);
        if (!isLogOut) {
            paramsNeed.push('user_id');
        }
        if (!url) {
            url = window.location.href;
        }
        var paramValue = '';
        var urlArray = [];
        $.each(paramsNeed, function (no, paramName) {
            paramValue = userDataUtil.getQueryString(paramName, url);
            if (paramValue) {
                urlArray.push(paramName + "=" + paramValue);
            }
        });
        return urlArray.join('&');
    }
    //获取首页
    userDataUtil.getHomePageUrl = function () {
        var urlArray = [window.location.origin];
        urlArray.push('/default?');
        urlArray.push(userDataUtil.getLocationParams(null, true));
        return urlArray.join('');
    };
    userDataUtil.getTemplateAlert = function (textAlert) {
        if (config.client == 'phone') {
            return ['<div class="popup"  id="userDataUtilAlert">',
                '<div class="cl-mark"></div>',
                '<div class="popup-main" style="display: block;z-index: 100000">',
                '<div class="popup-header">',
                window.i18n['app.tip'],
                '</div>',
                '<div class="popup-content">',
                '<p ng-bind="info" >',
                textAlert,
                '</p>',
                '<a href="javascript:;" class="btn bg-primary" id="userDataUtilAlertBtn">',
                window.i18n['app.ok'],
                '</a>',
                '</div>',
                '</div>',
                '</div>'].join('');
        } else {
            return [
                '<div class="popuo-content " id="userDataUtilAlert">',
                '<div class="modal modal-2" style="display: block;z-index: 100000">',
                '<div class="modal-hd">',
                '<p class="modal-tt">',
                window.i18n['app.tip'],
                '</p>',
                '</div>',
                '<div class="modal-bd">',
                '<i class="warn"></i>',
                textAlert,
                '</div>',
                '<div class="modal-ft">',
                '<a href="javascript:;" class="modal-btn-2 modal-primary btn-close" id="userDataUtilAlertBtn">',
                window.i18n['app.ok'],
                '</a>',
                '</div>',
                '</div>',
                '<div class="cl-mark" style="z-index: 99999"></div>',
                '</div>'
            ].join('');
        }

    }
    //弹出提示
    userDataUtil.alert = function (textAlert, confirmFunction) {
        //var popuoId= "popuo_"+new Date().getTime();
        if ($("#userDataUtilAlert").size() > 0) {
            return;//防止重复弹出
        }
        var $dom = $(userDataUtil.getTemplateAlert(textAlert));
        $dom.find("#userDataUtilAlertBtn").click(function () {
            confirmFunction();
            $(this).parent("#userDataUtilAlert").remove();
        });
        $("body").append($dom);
    }
    //失效
    userDataUtil.userUnvalid = function () {
        userDataUtil.alert(window.i18n['app.user.unvalid'], function () {
            top.window.location.replace(userDataUtil.getHomePageUrl());
        });
    };
    //未授权
    userDataUtil.userUnAuth = function () {
        userDataUtil.alert(window.i18n['app.user.unauth'], function () {
            top.window.location.replace(userDataUtil.getHomePageUrl());
        });
    };
    //获取uri
    userDataUtil.getUri = function (toParams) {
        var pathName = '';
        if (toParams) {
            pathName = '/' + _.values(_.pick(toParams, ['area', 'view', 'subview', 'lastview', 'sublastview'])).join('/');
        } else {
            if (window.location.hash) {
                pathName = window.location.hash.replace(window.location.hash.split("/")[0], '');
            } else if (window.location.pathname) {
                pathName = window.location.pathname;
            }
        }
        return pathName;
    };
    //是否登录，未登录会自动跳转，已登录验证权限
    userDataUtil.isLogin = function (toParams) {
        var cookies = userDataUtil.hasLoginCookie();
        //ucComponent.setLog("cookies"+cookies);
        if (cookies == 'userUnvalid') {
            console.log('isLogin:userUnvalid');
            return;
        }
        if (!cookies) {

            // console.log('isLogin: not cookies');
            // userDataUtil.remove();
            // userDataUtil.logout(window.location.href);
            //这里先不做自动跳转的功能
            return false;
        } else {
            return cookies;//暂时没有路由的权限，先直接返回
            //权限控制：多个角色的用户登录一次就行
            // var userObj = JSON.parse(window.localStorage.getItem(userDataUtil.KEY_USER_INFO_STORAGE));
            // var uriRegExp = '';
            // var pathName = userDataUtil.getUri(toParams);
            // var roleNow = userObj && userObj.info && userObj.info.role;  //云图错误处理
            // //多角色菜单不一样，还是要刷新
            // if (roleNow) {
            //     //共用页面
            //     //if (new RegExp("^\/(home|report)\/(common){1}").test(pathName) ) {
            //     //    if(window.location.href.indexOf('role=' + roleNow) != -1){
            //     //        userDataUtil.setLastLoginRole(roleNow);
            //     //        return cookies;
            //     //    }else if(window.location.href.indexOf('role=') == -1){
            //     //        alert('common路由必须有参数role');
            //     //    }
            //     //}else
            //     {
            //         uriRegExp = userDataUtil.ROUTE_ROLE_OPTION[roleNow].uriRegExp;
            //         if (!$.isArray(uriRegExp)) {
            //             uriRegExp = [uriRegExp];
            //         }
            //         //增加白名单
            //         uriRegExp = userDataUtil.ROUTE_ROLE_OPTION['ALL_ROLE'].uriRegExp.concat(uriRegExp);
            //         //验证权限
            //         for (var j = 0; j < uriRegExp.length; j++) {
            //             if (uriRegExp[j] && (uriRegExp[j] === pathName || new RegExp(uriRegExp[j]).test(pathName))) {
            //                 return cookies;
            //             }
            //         }
            //     }
            // }
            // console.log('isLogin: 没有权限');
            // userDataUtil.userUnvalid(userObj);
            // return false;
        }
    };
    //是否登录
    userDataUtil.hasLoginCookie = function () {
        var tokenInfo = ucComponent.getUserData();
        var userObjMemory = window.userObj;//缓存的用户信息
        //ucComponent.setLog("tokenInfo:"+JSON.stringify(tokenInfo));
        if (tokenInfo) {

            var userObjStorage = window.localStorage.getItem(userDataUtil.KEY_USER_INFO_STORAGE);
            if (!userObjStorage) {
                userDataUtil.setUserObj(null);
                userObjStorage = window.localStorage.getItem(userDataUtil.KEY_USER_INFO_STORAGE);
            }
            if (userObjStorage) {
                userObjStorage = JSON.parse(userObjStorage);
                if (!userObjStorage.info && tokenInfo) {//自动登录的时候，缺少用户信息
                    userObjStorage = userDataUtil.getUserInfoSync(userObjStorage);
                }
            }
            if (!userObjMemory || userObjMemory.token.access_token != tokenInfo.access_token) {
                if (userObjMemory && userObjStorage && userObjMemory.info.id != userObjStorage.info.id) {
                    userDataUtil.userUnvalid(userObjStorage);
                    return 'userUnvalid';
                } else {
                    userObjMemory = userObjStorage;
                    window.userObj = userObjStorage;
                }
            }
        }
        if (!tokenInfo || !userObjMemory) {
            //未登陆
            userDataUtil.remove();
            return false;
        }
        return tokenInfo.access_token;
    };
    //是否需要登录
    userDataUtil.needLogin = function (toParams) {
        return !new RegExp(userDataUtil.ROUTE_ROLE_OPTION['WHITE_LIST'].uriRegExp).test(userDataUtil.getUri(toParams));
    };
    //设置用户信息
    userDataUtil.setUserObj = function (customUserInfo) {
        var objData = {
            token: ucComponent.getUserData(),
            info: customUserInfo
        }
        window.localStorage.setItem(userDataUtil.KEY_USER_INFO_STORAGE, JSON.stringify(objData));
        window.userObj = objData;
        return window.userObj;
    };
    //删除用户信息
    userDataUtil.remove = function () {
        window.userObj = null;
        window.localStorage.removeItem(userDataUtil.KEY_USER_INFO_STORAGE);
        ucComponent.remove();
    };
    //登出
    userDataUtil.logout = function () {
        //var error = new Error();
        //ucComponent.setLog(error.stack);
        //ucComponent.setLog('userDataUtil.logout----------------');
        //var userObj = userDataUtil.getUserData(false);
        userDataUtil.remove();
        var logoutUrl = userDataUtil.getHomePageUrl();

        top.window.location.replace(logoutUrl);
        //if (!disableReload && logoutUrl == window.location.href) {
        //    //window.location.reload();//防止ie下死循环（未登录使用evt.preventDefault()）
        //}
    };

    //获取用户信息
    userDataUtil.getUserObj = function () {
        if (!userDataUtil.isLogin()) {
            throw new Error("未登录或登录信息丢失！");
        }
        return userDataUtil.getUserData();
    };
    //仅获取用户信息
    userDataUtil.getUserData = function (fromCache) {

        if (window.userObj && fromCache) {
            return window.userObj;
        }
        var userObj = window.localStorage.getItem(userDataUtil.KEY_USER_INFO_STORAGE);
        if (userObj) {
            userObj = JSON.parse(userObj);
        }

        return userObj;
    };
    userDataUtil.hasLastLoginRole = function (userInfo) {
        var last_login_role = window.localStorage.getItem(userDataUtil.LAST_LOGIN_ROLE + userInfo.id);
        return last_login_role && userInfo.roles.indexOf(last_login_role) != -1 ? last_login_role : null;
    };
    userDataUtil.hasLastLoginCourse = function (userInfo, lastRole) {
        var last_login = window.localStorage.getItem(userDataUtil.LAST_LOGIN_COURSE + userInfo.id);
        var courses = userDataUtil.getMultiCourseList(lastRole, userInfo);
        return last_login && courses && courses.indexOf(last_login) != -1 ? last_login : null;
    };
    //获取当前角色
    userDataUtil.getLastLoginRole = function (userInfo) {
        if (!userInfo) {
            userInfo = userDataUtil.getUserData(false).info;
        }
        if (!userInfo) {
            throw new Error("未登录")
        }
        var last_login_role = userDataUtil.hasLastLoginRole(userInfo);
        if (window.isAutoLogin && userInfo.roles.length > 1 && userInfo.roles.indexOf('TEACHER') != -1) {
            return 'TEACHER';//自动登录的，教师有多个角色的时候，这时候需要强制切到教师
        }
        return last_login_role ? last_login_role : userInfo.roles[0];
    };
    //设置角色
    userDataUtil.setLastLoginRole = function (roleType, userInfo) {
        if (!userInfo) {
            userInfo = userDataUtil.getUserData(false).info;
        }
        if (!userInfo) {
            throw new Error("未登录")
        }
        userInfo.role = roleType;
        userDataUtil.setUserObj(userInfo);
        userDataUtil.getMenuData(roleType);
        return window.localStorage.setItem(userDataUtil.LAST_LOGIN_ROLE + userInfo.id, roleType);
    };
    //获取当前学科
    userDataUtil.getCurrentCourse = function (userInfo, lastRole) {
        if (!userInfo) {
            userInfo = userDataUtil.getUserData(false).info;
        }
        if (!userInfo) {
            throw new Error("未登录")
        }
        if (!userDataUtil.isMultiCourse(userDataUtil.getLastLoginRole(userInfo))) {
            return null;
        }
        var course = window.localStorage.getItem(userDataUtil.LAST_LOGIN_COURSE + userInfo.id);
        var courses = userDataUtil.getMultiCourseList(lastRole, userInfo);
        if (!courses || courses.length == 0) {
            throw new Error("缺少学科配置")
        }
        if (window.isAutoLogin && courses.length > 1 && courses.indexOf(userDataUtil.getQueryString('course')) != -1) {
            return userDataUtil.getQueryString('course');//自动登录的，教师有多个学科的时候，这时候需要强制切到当前学科
        }
        return course && courses.indexOf(course) != -1 ? course : courses[0];
    };
    //切换学科
    userDataUtil.setCurrentCourse = function (course, userInfo) {
        if (!userInfo) {
            userInfo = userDataUtil.getUserData(false).info;
        }
        if (!userObj) {
            throw new Error("未登录")
        }
        if (course && userDataUtil.isMultiCourse(userInfo.role)) {
            userInfo.course = course;
            var extendData = userInfo[userDataUtil.getExtendDataKey(userInfo.role)];
            if (extendData.teach_infos) {
                $.extend(extendData, _.find(extendData.teach_infos, function (courseInfo) {
                    return courseInfo.course == course;
                }));
            } else {
                extendData.course = course;
            }
            userInfo[userDataUtil.getExtendDataKey(userInfo.role)] = extendData;
            userDataUtil.setUserObj(userInfo);
            return window.localStorage.setItem(userDataUtil.LAST_LOGIN_COURSE + userInfo.id, course);
        } else {
            //清除学科
            userInfo.course = undefined;
            userDataUtil.setUserObj(userInfo);
        }
    };
    userDataUtil.getExtendDataKey = function (role) {
        return role.toLowerCase() + '_info';
    }
    //是否多学科
    userDataUtil.isMultiCourse = function (role) {
        return _.indexOf(['TEACHER', 'COURSE_LEADER', 'SCHOOL_COURSE_ADMIN', 'RESOURCE_ADMIN'], role) != -1;
    };
    //获取多学科数组
    userDataUtil.getMultiCourseList = function (role, userInfo) {
        if (userDataUtil.isMultiCourse(role)) {
            var extendInfo = userInfo[userDataUtil.getExtendDataKey(role)];
            if (extendInfo) {
                if (extendInfo.teach_infos) {
                    return _.map(extendInfo.teach_infos, function (tInfo) {
                        return tInfo.course;
                    });
                } else {
                    return angular.copy(extendInfo.courses);
                }
            }
        } else {
            return null;
        }
    };
    //token是否过期
    userDataUtil.isNotExpires = ucComponent.isNotExpires;
    //token信息
    userDataUtil.getTokenInfo = function () {
        return {token: ucComponent.getUserData()};
    };
    //iframe打开协议
    userDataUtil.openOtherProtocal = function (url, rnd, delRnd) {
        var iframe = $('body #pcStartIframe');
        if (!delRnd) {
            if (!rnd) {
                url = [url, url.indexOf('?') != -1 ? '&' : '?', 'rnd=', new Date().getTime()].join('');
            } else {
                url = url + rnd;
            }
        }
        if (iframe && iframe.length > 0) {
            $(iframe[0]).attr('src', url);
        } else {
            $('body').append("<iframe style='display: none;' id='pcStartIframe' src='" + url + "'>");
        }
    }
    //发送交互消息
    userDataUtil.callNative = function (stateParams, openType, json) {
        if (stateParams.from_where == 'android' && window.slp_api && window.slp_api.callNative) {
            window.slp_api.callNative(openType, JSON.stringify(json));
        } else if (stateParams.from_where == 'ios') {
            userDataUtil.openOtherProtocal([userDataUtil.clientVersion(stateParams, 2) ? 'https' : 'http', '://nd-ios/type=', openType, '&JsonString=', JSON.stringify(json)].join(''), '&rnd=' + new Date().getTime());
        }
    };
    //移动端兼容版本处理
    userDataUtil.clientVersion = function ($stateParams, version) {
        return ($stateParams.area && $stateParams.client_version && $stateParams.client_version >= version) || (!$stateParams.area && userDataUtil.getQueryString('client_version') >= version);
    };
    userDataUtil.clientVersionLoading = function ($stateParams) {
        return userDataUtil.clientVersion($stateParams, 1);
    };
    //菜单初始化,异步取
    userDataUtil.getMenuDataAsync = function () {
        if (!userDataUtil.ROUTE_ALL_MENU) {
            userDataUtil.customAsync(config.fepapi_host + '/v1/menus/actions/search?menu_type=web',{unAuth:true})
                .then(function (menuData) {
                    if(!userDataUtil.ROUTE_ALL_MENU){
                        userDataUtil.ROUTE_ALL_MENU = userDataUtil.formatMenuData(menuData);
                    }
                });
        }
    };
    //配置初始化,异步取
    userDataUtil.getInitConfigAsync = function () {
        return userDataUtil.customAsync(config.fepapi_host + '/v1/configs/init_config',{
            //unAuth:true,
        disabledLoading:false})
            .then(function (configData) {
                if(configData && configData.value){
                    window.config = $.extend(window.config,JSON.parse(configData.value));
                }
            });
    };
    window.userDataUtil = userDataUtil;
    // userDataUtil.getMenuData();
})();
