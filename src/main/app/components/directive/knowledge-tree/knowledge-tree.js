/**
 * Created by libin on 2017/3/3.
 * params:{
 *      knowledgeId:'=?',知识点id，需添加$watch
 * }
 */
import './knowledge-tree.html';
export default $app.directive('knowledgeTree',
    function () {
        return {
            restrict: 'EA',
            template: require('./knowledge-tree.html'),
            link: function () {
                console.log('knowledgeTree');
            }
        };
    }
);
