/**
 * Created by libin on 2017/3/3.
 * params:{
 *      cardId:'=?',知识卡id，分为知识点卡、学习目标卡两部分，需添加$watch
 * }
 */
import './card-details.html';
export default $app.directive('cardDetails',
    function () {
        return {
            restrict: 'EA',
            template: require('./card-details.html'),
            link: function () {
                console.log('cardDetails');
            }
        };
    }
);
