/**
 * Created by px on 2016/8/18 0018.
 */
window.config = require('config');
function UcComponentConfig() {
    this.uc_realm = "sdp.nd";  //调用uc接口获得个人信息领域信息
    this.cookieHour = 0;//cookie保存小时数,0表示会话级别
    //this.uc_url_front="http://101uccenter.dev.web.nd/v0.93/"
    //this.client_host="101uccenter.dev.web.nd";//调用uc接口post get delete patch put时配置的host专用
    this.uc_url_front = window.config && config.uc_host;
    this.client_host = "ucbetapi.101.com";
    this.virtual_organizations = "0";//1为虚拟组织登陆  0为普通登陆
    this.virtual_url_front = "http://virtual-organization.debug.web.nd/v0.1/virtual_organizations/";
    this.v_org_name = "QA_RENRENTONG";//虚拟组织名称
    this.language = "zh";//国际化支持 zh 为英文 en为英文
    this.register_mode = "1,2";//注册模式 1位只要手机注册。2为邮箱注册   1，2为手机注册和邮箱注册皆展示，卡片展示
    //this.org_name="bd";//注册时默认的组织
    this.org_name = window.config  && config.org_name;//注册时默认的组织
    this.main_html = "main.html";//登陆成功默认跳转的页面
    this.login_html = "/";//登陆超时和注册成功默认跳转的页面
    this.register_html = "register.html";//注册页面
    this.change_password_html = "change_password.html";//注册页面
    this.app_uri = "http://192.168.252.58:8080/webdemo/web_component/mail_active.html";//注册邮箱点击返回页面
    this.find_password_app_uri = "http://192.168.252.58:8080/webdemo/web_component/forget_password_3.html";//找回密码点击返回页面
    this.project_host = "http://192.168.252.58:8080/webdemo/web_component/";//项目域名头，用于页面跳转使用
    this.email_list = "@sina.com;@163.com;@qq.com;@126.com;@sina.cn;@hotmail.com;@gmail.com;@sohu.com;@139.com;@wo.com.cn;@189.cn;@21cn.com;@yahoo.com.cn;@yahoo.cn";
    this.area_code_list = "中国(+86),+86;中国台湾(+886),+886;中国香港(+852),+852";//手机注册页默认的区号下拉选项 记得加，区号哦 作为opention 的 value用的
    this.gmail_uri = "https://mail.google.com/mail";//谷歌邮箱默认首页 由于mail.gmail.com打不开
    this.password_strong_grade = "0";//0为至少低级强度 1为至少中级强度  2为至少要高级强度
    this.password_strong_length = "6";//密码强度为低的时候的至少位数
    this.login_page_error_show_time = 3;//错误回到登陆页后 错误显示的秒数
    this.webo_app_id = "3786544118";//微博APPID
    this.qq_app_id = "101338814";//QQAPPID
    this.wx_app_id = "wxbdc5610cc59c1631";//微信APPID
    this.is_open_third_login = "0";//是否支持第三方登陆,不支持记得把login.html的相关js加载去除，包括的qq，微博，微信的js
}
var ucComponentConfig = new UcComponentConfig();
module.exports = ucComponentConfig;
