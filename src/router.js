// import angular from 'angular'; // 加上这句，启用js压缩时，ng-annotate-loader貌似没执行，导致路由模块报错
import uiRouter from 'angular-ui-router';
export default angular.module('app-router', [
    uiRouter
]).config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    //改成hash bang，支持hashbang的收缩引擎会把hash变化的相同url当作不同的页面处理
    $locationProvider.hashPrefix('!');

    $urlRouterProvider
        .otherwise('/home/index');

    $stateProvider
    // .state('main', {
    //     url: '/main',
    //     templateProvider: ['$q', function ($q) {
    //         var defer = $q.defer();
    //         require.ensure([], function () {
    //             defer.resolve(require('./views/main/main.html'));
    //         });
    //         return defer.promise;
    //     }],
    //     controller: 'mainController',
    //     resolve: {
    //         _jsLoad: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
    //             var defer = $q.defer();
    //             require.ensure([], function () {
    //                 let module = require('./views/main/main.js');
    //                 $ocLazyLoad.load({ name: module.name || module.default.name });
    //                 defer.resolve(module.controller);
    //             });
    //             return defer.promise;
    //         }]
    //     }
    // })
    .state('home', {
        url: '/home',
        templateProvider: ['$q', function ($q) {
            var defer = $q.defer();
            require.ensure([], function () {
                defer.resolve(require('./views/home/home.html'));
            });
            return defer.promise;
        }],
        controller: 'homeController',
        resolve: {
            _jsLoad: ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var defer = $q.defer();
                require.ensure([], function () {
                    let module = require('./views/home/home.js');
                    $ocLazyLoad.load({ name: module.name || module.default.name });
                    defer.resolve();
                });
                return defer.promise;
            }]
        }
    })
    .state('home.index', {
        url: '/index?imgName',
        templateProvider: function ($q) {
            return $q((resolve) => {
                require.ensure([], function () {
                    resolve(require('./views/home/index/index.html'));
                });
            });
        },
        controller: 'homeIndexController',
        resolve: {
            _jsLoad: function ($q, $ocLazyLoad) {
                var defer = $q.defer();
                require.ensure([], function () {
                    let module = require('./views/home/index/index.js');
                    $ocLazyLoad.load({ name: module.name || module.default.name });
                    defer.resolve();
                });
                return defer.promise;
            }
        }
    })
    .state('home.page1', {
        url: '/page1',
        templateProvider: function ($q) {
            return $q((resolve) => {
                require.ensure([], function () {
                    resolve(require('./views/home/page1/page1.html'));
                });
            });
        },
        controller: 'homePage1Controller',
        resolve: {
            _jsLoad: function ($q, $ocLazyLoad) {
                var defer = $q.defer();
                require.ensure([], function () {
                    let module = require('./views/home/page1/page1.js');
                    $ocLazyLoad.load({ name: module.name || module.default.name });
                    defer.resolve();
                });
                return defer.promise;
            }
        }
    });

});
