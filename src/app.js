import angular from 'angular';
import oclazyload from 'oclazyload';
import router from './router.js';
import './theme/css/style.css';
export default window.$app = angular.module('app', [
    router.name,
    oclazyload
]);
angular.bootstrap(document, ['app']);
