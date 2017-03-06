/*
* 权限控制,针对单独按钮事件
* 目前权限控制先只针对是否登录进行判断，后续有业务需要再增加对不同操作进行权限控制
* 两种引入方式
  1、直接按钮引入：<div permission callback="doSomething()">这是有权限控制的按钮</div>
  2、指令形式的require：
        页面中：
          <div permission>
              <div button-directive>这是有权限控制的按钮指令</div>
          </div>
          js中：
            $app.directive('buttonTest',
                function () {
                    return {
                        restrict: 'A',
                        require :'?^permission',
                        link: function ($scope,$element,$attr,permission) {
                          $element.click(function (e) {
                                e.stopPropagation();
                                if(!permission.isPermission()){
                                  return;
                                }
                                //doSomething
                            });

                        }
                    };
                }
            );
*/
export default $app.directive('permission',
    function () {
        return {
            restrict: 'A',
            scope: {callback: '&?'},
            link: function ($scope,$element,$attr) {
                $element.click(function (e) {
                    e.stopPropagation();
                    alert('权限中的点击')
                    $scope.callback();
                });

            },
            controller:function($scope){
              this.isPermission = function(){
                if(!userDataUtil.isLogin()){//无权限，进行登录
                  alert('无权限');
                  //todo 跳转到登录业务
                }else{
                  return true;
                }
              };
            }
        };
    }
).directive('buttonTest',
    function () {
        return {
            restrict: 'A',
            require :'?^permission',
            link: function ($scope,$element,$attr,permission) {
              $element.click(function (e) {
                    e.stopPropagation();
                    if(!permission.isPermission()){
                      return;
                    }
                    //doSomething
                    alert('可以评论')
                });

            }
        };
    }
);
