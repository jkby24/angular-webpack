/**
 * Created by px on 2016/8/18 0018.
 */
import 'xss';
import './constant.js';
export default $app
        .filter('ucFilterEmailDomain', ['UC_EMAIL_DOMAIN_DATA', function (EmailDomainData) {
            return function (email) {
                if (email && email.indexOf("@") != -1) {
                    if (email.indexOf("@gmail.com") != -1) {
                        return "http://mail.google.com";
                    } else if (email.indexOf("@hotmail.com") != -1) {
                        return "http://login.live.com";
                    } else {
                        var domain = email.substr(email.indexOf("@") + 1, email.length);
                        if (_.indexOf(EmailDomainData, '@'+domain) != -1) {
                            return 'http://mail.' + domain;
                        } else {
                            return '';
                        }
                    }
                } else {
                    return '';
                }
            };
        }])
        .service('ucCommonService',
            [
                function () {
                    return {
                        encodeMd5: function (password) {
                            return getMD5Value(password);
                        },
                        encodePassword: function (password, sessionKey) {
                            return ucComponent.ecryptContent(this.encodeMd5(password), sessionKey);
                        },
                        encodeLoginName: function (loginName, sessionKey) {
                            return ucComponent.ecryptContent(filterXSS(loginName), sessionKey);
                        },
                        decodeLoginName: function (loginName, sessionKey) {
                            return ucComponent.decryptByDES(loginName, sessionKey);
                        }
                    }
                }]);
