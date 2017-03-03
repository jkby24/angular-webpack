/**
 * Created by libin on 2017/3/3.
 */
// import 'jquery-typeahead';
import './search-require.html';
export default $app.directive('searchRequire',
    ['$timeout',function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            template: require('./search-require.html'),
            link: function (iScope, iElement) {
                var $input = iElement.find('input');
                // $($input).typeahead({
                //     input: '.js-typeahead-car_v1',
                //     minLength: 1,
                //     order: "asc",
                //     offset: true,
                //     hint: true,
                //     source: {
                //         car: {
                //             data: ["My first added brand", "M1 added brand at start"],
                //             ajax: {
                //                 type: "POST",
                //                 url: "/jquerytypeahead/car_v1.json",
                //                 data: {
                //                     myKey: "myValue"
                //                 }
                //             }
                //         }
                //     },
                //     callback: {
                //         onClick: function (node, a, item, event) {
                //
                //             console.log(node)
                //             console.log(a)
                //             console.log(item)
                //             console.log(event)
                //
                //             console.log('onClick function triggered');
                //
                //         },
                //         onSubmit: function (node, form, item, event) {
                //
                //             console.log(node)
                //             console.log(form)
                //             console.log(item)
                //             console.log(event)
                //
                //             console.log('onSubmit override function triggered');
                //
                //         }
                //     }
                // });
                $($input).typeahead({
                    input: '.js-typeahead-country_v1',
                    order: "desc",
                    source: {
                        data: [
                            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
                            "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
                            "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
                            "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma",
                            "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad",
                            "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the",
                            "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
                            "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
                            "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
                            "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea",
                            "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
                            "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
                            "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos",
                            "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                            "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
                            "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco",
                            "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
                            "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
                            "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino",
                            "Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone",
                            "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain",
                            "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
                            "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
                            "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
                            "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
                        ]
                    },
                    callback: {
                        onInit: function (node) {
                            console.log('Typeahead Initiated on ' + node.selector);
                        },
                        onClick: function (node, a, item, event) {
                            console.log(node)
                            console.log(a)
                            console.log(item)
                            console.log(event)
                            console.log('onClick function triggered');

                        },
                        onSubmit: function (node, form, item, event) {

                            console.log(node)
                            console.log(form)
                            console.log(item)
                            console.log(event)

                            console.log('onSubmit override function triggered');

                        }
                    }
                });

            }
        };
    }]
);
