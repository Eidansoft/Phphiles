// Definition and dependencies
var service = angular.module('phphile.service', []);
service.value('API_URL', './php_scripts/phphile.php');

var directive = angular.module('phphile.directive', ['PubSub', 'phphile.service']);

//var app = angular.module('phphile', ['PubSub']);
var app = angular.module('phphile', ['phphile.directive', 'phphile.service']);
app.constant('MODULE_VERSION', '1.0');

// Default values
//app.value('API_URL', './php_scripts/phphile.php');

// Main controller
// app.controller('mainController', function($scope) {	
// });

