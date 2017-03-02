/**
 * api服务
 */
export default $app
    .factory('apiService', ['$http',function($http) {
        return {
            getHttpTest: function() {
                return $http.customGet('/v1/commonapi/get_codes');
            }
        }
    }]);
