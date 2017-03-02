import angular from 'angular';
import oclazyload from 'oclazyload';
import router from './router.js';
import config from './config.js';
import './theme/css/style.css';
import ucComponent from 'uc-component';
export default window.$app = angular.module('app', [
    router.name,
    oclazyload
])  /*
     * 给http.xxx添加对应的customXxx方法。
     * 变更如下：
     * 1、去掉config中params参数的默认处理（通过把这个参数设置为null实现，置空前会把数据合并到将要传给formatUrl方法的param参数中）。
     * 2、通过formatUrl方法替换url中的:xxx为params中对应对应的属性值，并把url中找不到的参数拼接到链接的末尾
     * 3、修改方法的返回值为接口返回的数据（原先是httppromise对象，含有config、接口返回的数据、请求状态等）
     */
    .decorator('$http', ['$delegate', '$q', '$rootScope', '$window', '$timeout', '$log', function ($delegate, $q, $rootScope, $window, $timeout, $log) {

        // //这个没有放在$delegate（$http）上，是因为$http拦截中不能注入$http。为了共享逻辑，放在$window上。
        // $window._ngHttpRequestNeedAbort = function (requestClientTime) {
        //     return requestClientTime < $rootScope._httpAbortTime;
        // };
        //
        // //支持传入判断函数，fn返回true才撤销
        // $delegate.abortAll = function (fn) {
        //     $rootScope._httpAbortTime = (new Date()).getTime();
        //     var key = '',
        //         request = null;
        //
        //     //默认不撤销模板请求
        //     if (!angular.isFunction(fn)) {
        //         fn = function isAjax(httpConfig) {
        //             return !ucComponent.isHtml(httpConfig.url);
        //         };
        //     }
        //     for (key in $window.ngRequests) {
        //         request = $window.ngRequests[key];
        //         if (!request.config.notAllowAbort && $window._ngHttpRequestNeedAbort(request.config && request.config.clientTime) && fn(request.config) === true) {
        //             //$timeout.cancel(request.timeout);
        //             request.abortPromise.resolve('abort');
        //             //撤销的请求会走 error拦截器，撤销产生的错误不需要全局捕获
        //             request.isAbort = true;
        //             //log.push(request.config._requestId + '@http:1.3-请求被撤销');
        //             $log.log('请求被撤销：', request.config);
        //         }
        //     }
        // };


        $delegate.formatUrl = function (url, params) {
            //非http开头的补上默认host
            if (!(/^http(s)?:\/\//ig).test(url)) {
                if (url && url.indexOf('/') !== 0) {
                    url = '/' + url;
                }
                url = config.api_host + url;
            }
            return ucComponent.HttpUrlFormat(url, params);
        };

        /**
         * 调用ng的$http方法
         *
         * @param {boolean} mustHaveData - 原$http[method]是否必须要发送数据到服务端
         * @param {string} method - $http上的原始方法名
         * @param {string} url - 请求地址
         * @param {object} [params] - 请求地址上的参数
         * @param {object} [data] - 要发送的数据
         * @param {object} [config] - 原$http的配置对象
         */
        var doRequest = function (mustHaveData, method, url, params, data, config) {
            if (config && config.params) {
                angular.extend(params, config.params);
                config.params = null;
            }
            if (params && params.disabledLoading) {
                if (!config) {
                    config = {
                        disabledLoading: true
                    };
                } else {
                    config.disabledLoading = true;
                }
                delete params.disabledLoading;
            }
            var codeError = 'UC/NONCE_INVALID';
            config = config ? config : {};
            config.ignoreErrorCodes = config && config.ignoreErrorCodes ? config.ignoreErrorCodes : [];
            config.ignoreErrorCodes.push(codeError);
            url = $delegate.formatUrl(url, params);
            var defer = $q.defer();
            (!mustHaveData ? $delegate[method](url, config) : $delegate[method](url, data, config)).then(function (response) {
                defer.resolve(response.data);
            }, function (response) {
                //重试
                if (response.data && response.data.code === codeError) {
                    //第二次错误要弹窗
                    _.remove(config.ignoreErrorCodes, function (item) {
                        return item === codeError;
                    });

                    (!mustHaveData ? $delegate[method](url, config) : $delegate[method](url, data, config)).then(function (response) {
                        defer.resolve(response.data);
                    }, function (response) {
                        defer.reject(response.data);
                    });
                } else {
                    defer.reject(response.data);
                }

            });
            return defer.promise;
        };
        /**
         * 为了避免url太长，把一个请求分成多次请求。
         */
        var doSliceRequest = function (mustHaveData, method, url, params, data, config) {
            var sliceArgName;
            // 这个判断用到逗号表达式，逗号表达式返回值是最后一个表达式的返回值。
            if ($delegate.formatUrl(url, params).length > 2048 && (sliceArgName = getSliceArgName(params), sliceArgName)) {
                /**
                 * @type {*[] | {total:number, items: *[]}}
                 */
                var result;
                return sequencePromisesHasCallback(params[sliceArgName], function (sliceArg) {
                    params[sliceArgName] = sliceArg;
                    return doRequest(mustHaveData, method, url, params, data, config).then(function (data) {
                        if (angular.isArray(data)) {
                            result = (result || []).concat(data);
                        } else if (angular.isObject(data) && data.items) {
                            result = result || {
                                    total: 0,
                                    items: []
                                };
                            result.total = data.total;
                            result.items = result.items.concat(data.items);
                        }
                    });
                }).then(function () {
                    return result;
                });
            } else {
                // 链接没有超长，或者参数都不能分隔（没有数组类型的参数）
                return doRequest(mustHaveData, method, url, params, data, config);
            }
        };
        /**
         * 获取要被切片的参数的参数名
         * 现在系统中存在的长url请求参数都是在第一层。只实现了对参数对象第一层的查找处理。
         * @param {any} params url参数对象
         */
        var getSliceArgName = function (params) {
            var ahead = {
                key: '',
                length: 0
            };
            for (var key in params) {
                var param = params[key];
                // 如果有两个数组类型的参数长度一样长，取在url参数顺序中在前面的那个参数
                if (params.hasOwnProperty(key) && angular.isArray(param) && param.length > ahead.length) {
                    ahead.key = key;
                    ahead.length = param.length;
                }
            }

            return ahead.key;
        };
        /**
         * 顺序执行多个promise,并在每个promise执行完的时候执行回调处理请求出局
         * todo 现在是串行要优化为并行
         */
        var sequencePromisesHasCallback = function (arrayArg, everyRequestFn) {
            var requestCount = 20;
            var promises = [];
            while (arrayArg.length > 0) {
                var sliceArrayArg = arrayArg.splice(0, requestCount);
                promises.push((function (sliceArrayArg) {
                    return function () {
                        return everyRequestFn(sliceArrayArg);
                    };
                })(sliceArrayArg));
            }

            return $q.sequence(promises);
        };


        var threeArgumentMethod = {
            customGet: 'get',
            customDelete: 'delete',
            customHead: 'head',
            customJsonp: 'jsonp',
            customPatch: 'patch'
        };
        angular.forEach(threeArgumentMethod, function (method, customXxx) {
            $delegate[customXxx] = function (url, params, config) {
                return doSliceRequest(false, method, url, params, null, config);
            };
        });

        var fourArgumentMethod = {
            customPost: 'post',
            customPut: 'put'
        };
        angular.forEach(fourArgumentMethod, function (method, customXxx) {
            $delegate[customXxx] = function (url, params, data, config) {
                return doSliceRequest(true, method, url, params, data, config);
            };
        });

        return $delegate;
    }])
angular.bootstrap(document, ['app']);
