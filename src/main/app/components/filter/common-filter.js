export default $app
    .constant('PAGE_SIZE', 8)
    .filter('filterTest', [function() {
        return function(input, size) {
            return '这是过滤器'
        };
    }]);
