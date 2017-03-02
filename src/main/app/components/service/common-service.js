export default $app
    .factory('commonService', [function() {
        return {
            getMegTest: function() {
                return '这是服务返回的消息'
            }
        }
    }]);
