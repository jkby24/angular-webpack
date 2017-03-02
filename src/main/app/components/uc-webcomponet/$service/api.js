/**
 * Created by px on 2016/8/18 0018.
 */
import ucComponent from 'uc-component';
export default $app.service('ucApiService',
            ['$http', '$q','$filter',
                function ($http, $q,$filter) {
                    return {
                        /**
                         * [POST]/session 创建会话
                         * @param session_type
                         * {
                            'session_type':1, --会话类型，0：注册，1：登录，2：找回密码, 3：重置密码
                            'device_id':''  --设备唯一ID
                            }
                         * @returns {
                            'session_id':'', --会话Id
                            'session_key':'', --会话密钥
                            'op_count':1 --操作次数，注册次数或登录错误次数
                            }
                         错误代码：
                         UC/SESSION_TYPE_INVALID 会话类型不正确
                         */
                        createSession: function (session_type, orgName) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'session',
                                null,
                                {
                                    device_id: ucComponent.getClientCrc(orgName),
                                    session_type: session_type,
                                },
                                {unAuth: true});
                        },
                        /**
                         * [GET]/sessions/{session_id}/identify_code 获取图片验证码
                         * @param session_id
                         * @returns {string}
                         * 错误代码：
                         UC/SESSION_EXPIRED Session未创建或已过期
                         */
                        getIdentifyCodeImageUrl: function (session_id) {
                            return [ucComponentConfig.uc_url_front, 'sessions/', session_id, '/identify_code'].join('');
                        },
                        /**
                         *[POST]/tokens 用户登录
                         * @param postData
                         * {
                            "login_name":"", --用户名或手机号或工号，注：对于安全等级高的登录，该字段为密文，需要用4.5.1创建会话时返回的会话密钥(session_key)进行DES对称加密
                            "password":"", --密码(加密算法由uc_sdk提供), 注：对于安全等级高的登录，该字段为密文，还需要用4.5.1创建会话时返回的会话密钥(session_key)再进行一次DES对称加密
                            "org_name":"", --组织登录名称(可选)
                            "imei":"",  --移动设备国际身份码(可选)
                            "device_type":"",  --登录设备类型(可选)，如：ios\android\pc\pad
                            "device_desc":""，  --登录设备型号(可选), 如：MI 2S
                            "session_id":"", --会话Id(可选)，注：对于安全等级高的登录，需填该字段，即先调用4.5.1创建会话
                            "identify_code":""--验证码(可选)，注：对于安全等级高的登录，当异常登录次数超过3次时需填该验证码，验证码接口4.5.2
                            }
                         * @returns {
                            "user_id":用户编号, 注：对于安全等级高的登录，该字段返回的是密文，客户端用户创建会话时返回的会话密钥(session_key)进行DES解密
                            "access_token" : "2YotnFZFEj r1zCsicMWpAA" ,--Token
                            "expires_at" : "2015-06-30T14:17:21.275+0800", --Token过期时间
                            "refresh_token" : "tGzv3J OkF0XG5Qx2TlKWIA" , --刷新用Token
                            "mac_key" : "adij q39j dlaska9asud" , --Mac key值，注：对于安全等级高的登录，该字段返回的是密文，客户端用户创建会话时返回的会话密钥(session_key)进行DES解密
                            "mac_algorithm" : "hmac- sha- 256" , --Mac算法
                            "server_time": "2015-06-30T14:17:21.275+0800" -- 服务器时间
                            "warning_code":"PWD_EXPIRED"--警告码，取值：1) PWD_EXPIRED：密码过期 2) CRUCIAL_ROLE_WITHDRAW:重要角色被收回，修改密码后自动归还
                            }
                         错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/INVALID_LOGIN_NAME 登录名格式不正确,只能包括字母、数字、_、.、@，最长50字符
                         UC/ORGNAME_INVALID 组织名格式不正确,只允许字母、数字、_，最长50字符
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/PASSWORD_NOT_CORRECT 密码不正确
                         UC/ACCOUNT_UN_ENABLE 帐号未启用
                         UC/LOGIN_FAILURE 登录失败
                         UC/SESSION_EXPIRED Session未创建或已过期
                         UC/SESSION_ID_NEED_FOR_ORG 该组织登录需要session_id
                         UC/SESSION_TYPE_INVALID 会话类型不正确
                         UC/IDENTIFY_CODE_REQUIRED 需要验证码登录
                         UC/IDENTIFY_CODE_INVALID 无效的验证码
                         UC/ACCOUNT_LOCKED 帐号登录错误次数太多，被锁定！请5分钟后再登录！
                         */
                        ucLoginSubmit: function (postData) {
                            //todo 虚拟组织登陆
                            if (ucComponentConfig.virtual_organizations == '1') {
                                //loginPromise = ucComponent.login_service_v_org_name(login_name, password, session_id, code, session_key);
                            }
                            return $http.customPost(ucComponentConfig.uc_url_front + 'tokens',
                                null,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    unAuth: true
                                });

                        },
                        /**
                         * [GET]/server/time 获取服务器时间
                         * @returns {
                            "server_time": "2015-03-16T13:57:55.734+0800", -- 服务器时间(ISO 8601格式)
                            "ms_format":1466663587020 -- 服务器时间(毫秒)
                            }
                         */
                        getServerTime: function () {
                            return $http.customGet(ucComponentConfig.uc_url_front + 'server/time', null, {unAuth: true});
                        },
                        /**
                         * POST]/users 使用下发的短信验证码进行帐号注册
                         * @param postData
                         * {
                            "mobile":"15980082804", --手机号码，注：对于要求安全等级较高的(带参数session_id的情况下)，该字段为密文，需要用4.5.1创建会话时返回的会话密钥(session_key)进行DES对称加密
                            "password":"", --密码(加密算法由uc_sdk提供)，注：对于要求安全等级较高的(带参数session_id的情况下)，该字段为密文，需要用4.5.1创建会话时返回的会话密钥(session_key)进行DES对称加密
                            "mobile_code":"", --客户端收到的手机验证码
                            "org_name":"", --组织登录名称(可选)，注：组织用户自助注册时需要填写。
                            "realm":"" ,--应用的领域(可选)。注：要统计本应用新增用户数量时需填写。
                            "user_name":"" ,--用户名(可选) 0.93版本新增
                            "nick_name":"" ,--昵称(可选) 0.93版本新增
                            "node_id":123 ,-- 节点Id(可选) 0.93版本新增
                            "enable_status":1, --是否可用(可选) 0.93版本新增。可填值：0或1, 1：表示可用，即可登录，0：表示不可用。注：不设置该字段，默认为：1，即可用
                            "country_code":"+86", --国际区号(可选)，注：国外的业务需要填写。 格式示例：中国：+86，印度：+91
                            "session_id":"" --会话Id(可选)，注：对于要求安全等级较高的，需填该字段，即先调用4.5.1创建会话
                            }
                         * @returns
                         * {
                            "user_id":用户编号, 对于要求安全等级较高的(请求参数带session_id的情况下)，该字段为密文，需要用会话密钥(session_key)进行DES对称解密
                            "user_name":"", --用户名
                            "nick_name":"", --昵称
                            "create_time":"2015-06-30T14:17:21.275+0800" --用户创建时间
                            }
                         错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/PHONE_HAS_REGISTER 手机号码已经注册过
                         UC/SMS_EXPIRED 短信未下发或已经过期
                         UC/SMS_INVALID 短信验证码不正确
                         UC/USERNAME_INVALID 用户名格式不正确,需以字母开头,可包含字母、数字、_，最长20字符
                         UC/USERNAME_EXIST 用户名已存在
                         UC/INVALID_NICK_NAME 昵称不能为空且长度不能超过50字节
                         UC/INVALID_ENABLE_STATUS 参数enable_status取值不正确,只能是0或1
                         UC/INVALID_COUNTRY_CODE国际区号格式不正确,只能以+开头包括+、数字，最长16字符
                         UC/SMSCODE_ERROR_OVER_SUM 短信验证码一天内输入错误次数不能超过上限(5次)，请重新获取短信验证码！
                         UC/NICK_NAME_CONTAIN_SENSITIVE_WORD 昵称不合法，包含敏感词
                         */
                        ucRegisterMobileSubmit: function (postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'users',
                                null,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    unAuth: true
                                });

                        },
                        /**
                         * [POST] /email/actions/register 使用邮箱进行帐号注册
                         * @param postData
                         * {
                            "email":"xxx@qq.com", --邮箱地址(需要session_key加密）
                            "password":"", --密码(需要session_key加密）
                            "session_id":"", --会话id
                            "org_name":"", --组织登录名称(可选)，注：组织用户自助注册时需要填写。
                            "identify_code":"" --验证码(首次注册可不输入)
                            }
                         * @returns
                            {
                            "message":"注册成功"
                            }
                         错误代码：
                         UC/SESSION_ID_INVALID 无效的session_id
                         UC/IDENTIFY_CODE_INVALID 无效的验证码
                         UC/EMAIL_FORMAT_INVALID 邮箱格式不正确
                         UC/EMAIL_HAS_REGISTER 电子邮箱已经注册过
                         UC/ORG_NOT_EXIST 指定的组织不存在
                         UC/ENCRYPT_DATA_INVALID 密文串不合法
                         UC/NO_PERMISSION_JOIN_USER 该组织不允许加入用户，请联系UC开启允许加入用户权限！
                         */
                        ucRegisterEmailSubmit: function (postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'users',
                                null,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    unAuth: true
                                });

                        },
                        /**
                         *  [POST]/users/actions/check 帐号校验
                         * @param postData
                         * {
                               "login_name":"帐号名称", (需要session_key加密),
                               "org_name":"xx", --实体组织名称 (可选)
                               "session_id":"" --会话id
                            }
                         * @returns
                         * {
                            "user_id":"xxxxxxxxxx",(需要session_key解密)
                            "email":"321******@qq.com",
                            "mobile":"189******21"
                            }
                         错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/ORG_NOT_EXIST 指定的组织不存在
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/SESSION_ID_INVALID 无效的session_id
                         */
                        userExist: function (postData,showLoad) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'users/actions/check',
                                null,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    disabledLoading: !showLoad,
                                    unAuth: true
                                });
                        },
                        userExistCustomError: function (postData,showLoad) {
                            var defer = $q.defer();
                            this.userExist(postData,showLoad)
                                .then(function (userExistData) {
                                    if (userExistData.mobile || userExistData.email) {
                                        defer.resolve(userExistData);
                                    }else {
                                        defer.reject({code:'UNBIND',message:$filter('translate')('FORGET_PASSWORD_ACCOUNT_UNBIND')});
                                    }
                                }, function (rtnData) {
                                    if(rtnData){
                                        if(rtnData.code=='UC/ACCOUNT_NOT_EXIST'){
                                            rtnData.message = $filter('translate')('FORGET_PASSWORD_ACCOUNT_NOT_EXIST')
                                        }else if(rtnData.code=='UC/SESSION_ID_INVALID'){
                                            rtnData.message = $filter('translate')('REG_PAGE_TIME_OUT')
                                        }
                                    }
                                    defer.reject(rtnData);
                                });
                            return defer.promise;
                        },
                        /**
                         * 带验证码的
                         * @param postData
                         * {
                               "session_key":""
                               "login_name":"帐号名称", (需要session_key加密),
                               "org_name":"xx", --实体组织名称 (可选)
                               "session_id":"" --会话id
                            }
                         * @param showIdentifyCode ：是否显示验证码
                         * @returns {*}
                         */
                        userExistByCode: function (postData, showIdentifyCode) {
                            var that = this;
                            if (showIdentifyCode) {
                                var defer = $q.defer();
                                that.validIdentifyCode(postData)
                                    .then(function (rtnData) {
                                        if (rtnData && rtnData.status) {
                                            that.userExistCustomError(postData,true)
                                                .then(function (userExistData) {
                                                    defer.resolve(userExistData);
                                                }, function (rtnData) {
                                                    defer.reject(rtnData);
                                                });
                                        }else{
                                            defer.reject({code:'UC/IDENTIFY_CODE_INVALID',message:$filter('translate')('UC_IDENTIFY_CODE_INVALID')});
                                        }
                                    }, function (rtnData) {
                                        defer.reject(rtnData);
                                    })
                                return defer.promise;
                            } else {
                                return that.userExistCustomError(postData);
                            }
                        },
                        /**
                         *  [POST]/sessions/{session_id}/identify_code/actions/valid 验证图片验证码
                         *  验证图片验证码，注：仅限于找回密码使用
                         * @param
                         * {
                            "identify_code":""  --验证码
                            }
                         * @returns {*}
                         * {
                            "status":true --是否有效，取值：true：有效，false:无效
                            }
                         */
                        validIdentifyCode: function (postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'sessions/:session_id/identify_code/actions/valid',
                                {session_id: postData.session_id},
                                {identify_code: postData.identify_code},
                                {
                                    ignoreGlobalErrorHandle: true,
                                    unAuth: true
                                });
                        },
                        /**
                         *  [POST]/smses 下发短信验证码
                         * @param postData
                         *{
                            "mobile":"15980082804", --手机号码
                            "op_type":"", --业务操作类型，0:注册用户下发短信，1：重置密码，2：更新手机号码，3：用户短信登陆，4：通过密保重置密码，5：更新手机时新手机的验证，6：重置密保问题
                            "org_name":"", --组织登录名称(可选)，注：组织相关的业务需要填写。
                            "country_code":"+86" --国际区号(可选)，注：国外的业务需要填写。 格式示例：中国：+86，印度：+91，默认“+86”
                            }
                         * @returns {}
                         * 错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/PHONE_NUMBER_FORMAT_INVALID 手机号码格式不正确
                         UC/ORG_NOT_EXIST 指定的组织不存在
                         UC/PHONE_HAS_REGISTER 手机号码已经注册过
                         UC/USER_NOT_EXIST 选定的用户不存在
                         UC/SMS_SEND_FAILURE 短信下发失败
                         UC/SMS_TYPE_INVALID 短信验证码类型不正确
                         UC/SMS_OVER_SUM 发送次数超出上限，每个手机号码一天内最多只允许发送15条短信
                         UC/SMS_OVER_FREQUENT 短信发送太频繁，一分钟内只允许发送一次
                         UC/INVALID_COUNTRY_CODE国际区号格式不正确,只能以+开头包括+、数字，最长16字符
                         */
                        sendMessageCode: function (postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'smses',
                                null,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    disabledLoading: true,
                                    unAuth: true
                                });
                        },
                        /**
                         * [POST]/users/{user_id}/smses 发送短信验证码到用户原绑定的手机
                         * @param postData
                         * {
                                "op_type":1 --1:重置密码，2：修改手机前发送到原绑定手机
                            }
                         * @returns {*}
                         */
                        sendMessageCodeByUserId: function (userId, postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'users/:user_id/smses',
                                {user_id: userId},
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true,
                                    disabledLoading: true,
                                    unAuth: true
                                });
                        },
                        /**
                         * [PUT]/users/{user_id}/password/actions/modify 密码修改
                         * @param userId:用户Id
                         * @param postData
                         * {
                            "old_password":"", --密码(加密算法由uc_sdk提供)
                            "new_password":"", --新密码(加密算法由uc_sdk提供)
                            }
                         * @returns {
                            "user_id":用户编号,
                            "access_token" : "2YotnFZFEj r1zCsicMWpAA" ,--Token
                            "expires_at" : "2015-06-30T14:17:21.275+0800", --Token过期时间
                            "refresh_token" : "tGzv3J OkF0XG5Qx2TlKWIA" , --刷新用Token
                            "mac_key" : "adij q39j dlaska9asud" , --Mac key值
                            "mac_algorithm" : "hmac- sha- 256" , --Mac算法
                            "server_time": "2015-06-30T14:17:21.275+0800" -- 服务器时间
                            }
                         错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/PASSWORD_INVALID 密码不正确
                         UC/PASSWORD_SAME 新密码与原密码相同
                         */
                        ucPasswordChangeFormSubmit: function (userId, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'users/:user_id/password/actions/modify',
                                {user_id: userId},
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         *[PUT]/users/{user_id}/mobile 更新用户手机号码
                         * @param userId
                         * @param postData
                         * {
                            "new_mobile":"15980082804", --手机号码
                            "mobile_code":"", --客户端收到的手机验证码
                            "country_code":"+86" --国际区号(可选)，注：国外的业务需要填写。 格式示例：中国：+86，印度：+91
                            }
                         * @returns {*}
                         * 错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/INVALID_COUNTRY_CODE国际区号格式不正确,只能以+开头包括+、数字，最长16字符
                         UC/SMSCODE_ERROR_OVER_SUM 短信验证码一天内输入错误次数不能超过上限(5次)，请重新获取短信验证码！
                         UC/PHONE_HAS_REGISTER 手机号码已经注册过
                         */
                        ucBindMobileFormSubmit: function (userId, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'users/:user_id/mobile',
                                {user_id: userId},
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         *[PUT]/users/{user_id}/email?lang={lang} 绑定邮箱
                         * @param paramData
                         * 功能说明：绑定用户邮箱，并发送邮件
                         访问权限：只能本人操作
                         参数说明：lang(可选）：邮件内容语言参数，目前仅支持lang=zh_cn和lang=en
                         * @param postData
                         * {
                            "email":"xxx", --邮箱地址,选填，重发邮件时可不传，UC会根据user_id找到之前待验证的邮箱地址。
                            "org_name":""  --组织名称，支持虚拟组织
                            }
                         * @returns {*}
                         * 错误代码：
                         UC/AUTH_DENIED 请求失败，没有访问或操作该资源的权限!
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/EMAIL_FORMAT_INVALID 邮箱格式不正确
                         UC/EMAIL_HAS_REGISTER 电子邮箱已经注册
                         UC/EMAIL_HAS_BIND 用户邮箱已绑定，请先解绑
                         */
                        ucBindEmailFormSubmit: function (paramData, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'users/:user_id/email',
                                paramData,
                                postData,
                                {
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         *[DELETE]/users/{user_id}/email 邮箱解绑
                         * @param paramData
                         * user_id:用户Id
                         * 访问权限：只能本人操作
                         * @returns {*}
                         * 错误代码：
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/EMAIL_NOT_EXIST 邮箱不存在
                         UC/EMAIL_IS_SOLE_LOGIN 邮箱是唯一登录标识，无法解绑
                         */
                        ucUnBindEmailFormSubmit: function (paramData) {
                            return $http.customDelete(ucComponentConfig.uc_url_front + 'users/:user_id/email',
                                {user_id: paramData.user_id},
                                {
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         * [POST]/users/{user_id}/mobile_code/actions/valid 校验短信验证码
                         * @param userId
                         * @param postData
                         * {
                            "mobile_code":""  --验证码
                            "session_id":"" --会话id
                            }
                         * @returns {
                            "new_mobile_code":""--新的验证码，用于重置密码
                            }
                         错误代码：
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/SESSION_EXPIRED Session未创建或已过期
                         UC/SMS_INVALID 短信验证码不正确
                         */
                        validMobileCodeByUserId: function (userId, postData) {
                            return $http.customPost(ucComponentConfig.uc_url_front + 'users/:user_id/mobile_code/actions/valid',
                                {user_id: userId},
                                postData,
                                {
                                    unAuth: true,
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         * [PUT]/emails/password/actions/reset?lang={lang} 邮箱找回密码
                         * 参数说明: session_id 过期时间:20分钟
                         lang(可选）：邮件内容语言参数，目前仅支持lang=zh_cn和lang=en
                         * @param paramData
                         * lang
                         * @param postData
                         * {
                            "email":"",--邮箱地址（需要session_key加密），必填
                            "session_id":"",--会话id，必填
                            "org_name":"" --组织名，支持虚拟组织
                            "cipher_strength":0 --密码强度,0为至少低级强度 1为至少中级强度  2为至少要高级强度
                            "reset_uri":"", --自定义密码重置页，可选，默认为uc.101.com的密码重置页. 注，web端，必须以https://或者 http:// 开头, 否则会发生邮件链接不能点击的情况
                            }
                         错误代码：
                         UC/SESSION_EXPIRED Session未创建或已过期
                         UC/ORG_NOT_EXIST 指定的组织不存在
                         UC/ENCRYPT_DATA_INVALID 密文串不合法
                         UC/EMAIL_FORMAT_INVALID 邮箱格式不正确
                         UC/EMAIL_SEND_FAILURE 邮件发送失败
                         UC/EMAIL_OVER_SUM 发送次数超出上限，每个邮箱一天内最多只允许发送15条邮件
                         UC/EMAIL_OVER_FREQUENT 邮件发送太频繁，一分钟内只允许发送一次
                         UC/ACCOUNT_NOT_EXIST 账号不存在
                         UC/RESET_URI_INVALID 无效的密码重置页,必须以https://或者http://开头
                         */

                        resetPasswordByEmail: function (paramData, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'emails/password/actions/reset',
                                paramData,
                                postData,
                                {
                                    unAuth: true,
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         * [PUT]/emails/password/actions/reset?lang={lang} 邮箱找回密码
                         * 参数说明: session_id 过期时间:20分钟
                         lang(可选）：邮件内容语言参数，目前仅支持lang=zh_cn和lang=en
                         * @param paramData
                         * lang
                         * user_id
                         * @param postData
                         * {
                            "email":"",--邮箱地址（需要session_key加密），必填
                            "session_id":"",--会话id，必填
                            "org_name":"" --组织名，支持虚拟组织
                            "cipher_strength":0 --密码强度,0为至少低级强度 1为至少中级强度  2为至少要高级强度
                            "reset_uri":"", --自定义密码重置页，可选，默认为uc.101.com的密码重置页. 注，web端，必须以https://或者 http:// 开头, 否则会发生邮件链接不能点击的情况
                            }
                         */
                        resetPasswordEmailByUserId: function (paramData, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'emails/password/actions/reset',
                                paramData,
                                postData,
                                {
                                    unAuth: true,
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         * [PUT]/users/{user_id}/password/actions/reset 根据用户ID重置密码
                         * @param userId
                         * @param postData
                         * {
                                "new_password":"15000000000", --新密码(加密算法由uc_sdk提供)
                                "mobile_code":"123456"
                            }
                         * @returns {*}
                         * 错误代码：
                         UC/ACCOUNT_NOT_EXIST 帐号不存在
                         UC/INVALID_ARGUMENT 手机号码格式不正确
                         UC/SMS_TYPE_INVALID 短信验证码类型不正确
                         UC/PHONE_NOT_BINDING 该用户没有绑定手机
                         UC/SMSCODE_ERROR_OVER_SUM 短信验证码一天内输入错误次数不能超过上限(5次)，请重新获取短信验证码！
                         */
                        resetPasswordByUserId: function (userId, postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'users/:user_id/password/actions/reset',
                                {user_id: userId},
                                postData,
                                {
                                    unAuth: true,
                                    ignoreGlobalErrorHandle: true
                                });
                        },
                        /**
                         * [PUT] /users/emails/password/actions/reset 使用邮箱进行密码重置
                         * @param postData
                         * {
                            "validate_code":"", --邮箱验证码
                            "session_id":"", --会话id
                            "new_password":"" --新密码(需要session_key加密）
                            }
                         * @returns {
                            "email":"777***@101.com"
                            }
                         错误代码：
                         UC/REQUIRE_ARGUMENT 缺少参数
                         UC/INVALID_ARGUMENT 无效参数(格式不对,长度过长或过短等)
                         UC/SESSION_ID_INVALID 无效的session_id
                         UC/ENCRYPT_DATA_INVALID 密文串不合法
                         UC/VALIDATE_CODE_INVALID 无效的邮箱验证码
                         UC/ACCOUNT_NOT_EXIST 账号不存在
                         */
                        resetPasswordByValidateCode: function (postData) {
                            return $http.customPut(ucComponentConfig.uc_url_front + 'users/emails/password/actions/reset',
                                null,
                                postData,
                                {
                                    unAuth: true,
                                    ignoreGlobalErrorHandle: true
                                });
                        }


                    }
                }]);
