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

angular.module('phphile.directive').directive('phphile', ['phphileService', 'PubSub', '$templateCache', function(phphileService, PubSub, $templateCache) {

	var link = function (scope, element, attrs) {

		var getFiles = function (nodes, path){
			var promise = phphileService.getFiles(path);
			promise.then(function(data) {
				var filesResponse = data.response.content;
				for (var i = 0; i < filesResponse.length; i++) {
					nodes.push({
						name: filesResponse[i].name,
						size: filesResponse[i].size,
						path: filesResponse[i].path,
						type: filesResponse[i].type,
						nodes: [],
					});
				};
			}, function(reason) {
				PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
			});
		};

		scope.selectItem = function (file){
			if (file.type == 'folder'){
				if (file.nodes.length > 0){
					file.nodes = [];
				} else {
					getFiles(file.nodes, file.path + file.name);
				}
			} else if (file.type == 'file'){
				scope.markonefilefunction(file);
			}

			if (typeof scope.onclickfunction != 'undefined') {
				scope.onclickfunction(file);
			}
		};

		var setNoFileSelected = function (fileNode){
			if (typeof fileNode == 'undefined') {
				setNoFileSelected(scope.files);
			} else {
				for (var i = 0; i < fileNode.length; i++) {
					if (fileNode[i].type == 'folder') {
						setNoFileSelected(fileNode[i].nodes);
					} else {
						fileNode[i].editing = "notSelected";
					}
				}
			}
		};

		var lookForFile = function (fileName, fileNode){
			var res = false;
			for (var i = 0; i < fileNode.length && !res; i++) {
				if (fileNode[i].name == fileName){
					res = fileNode[i];
				} else if (fileNode[i].type == 'folder'){
					res = lookForFile(fileName, fileNode[i].nodes);
				}
			}
			return res;
		};

		scope.markonefilefunction = function (file){
			// un set any previous selected file
			setNoFileSelected();
			// look for the file at the array and set it as selected
			var nodeFound = lookForFile(file.name, scope.files);
			if (nodeFound){
				nodeFound.editing = "selected";
			}
		};

		var updateOpenedFolders = function (oldFilesList, newFilesList){
			for (var i = 0; i < oldFilesList.length; i++) {
				if (oldFilesList[i].type == 'folder' && oldFilesList[i].nodes.length > 0) {
					getFiles(newFilesList[i].nodes, newFilesList[i].path + newFilesList[i].name);
					updateOpenedFolders(oldFilesList[i].nodes, newFilesList[i].nodes);
				}
			};
		};

		scope.refreshfiletreefunction = function (){
			var oldFilesList = scope.files;
			scope.files = [];
			getFiles(scope.files, "/");

			updateOpenedFolders(oldFilesList, scope.files);
		};

		scope.refreshfiletreefunction();
	}

	return {
		restrict: 'E',
		scope: {
			files: '=',
			onclickfunction: '=',
			refreshfiletreefunction: '=',
			markonefilefunction: '=',
			onlyfolders: '=onlyfolders',
		},
		//templateUrl: './partials/filesinatree.html',
		template: $templateCache.get("partials/filesinatree.html"),
		link: link,
	};
}]);

angular.module("phphile.directive").run( 
	["$templateCache", function($templateCache) {
		
		$templateCache.put(
			"partials/filesinatree.html",
			'<script type="text/ng-template" id="tree_subitems.html">' + "\n" +
			'	<a ng-if="!onlyfolders || (file.type == \'folder\' && onlyfolders)" href="#" ng-click="selectItem(file)">' + "\n" +
			'		<span ng-if="file.type == \'file\'" class="glyphicon glyphicon-file" aria-hidden="true"></span>' + "\n" +
			'		<span ng-if="file.type == \'folder\' && file.nodes.length == 0" class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>' + "\n" +
			'		<span ng-if="file.type == \'folder\' && file.nodes.length > 0" class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>' + "\n" +
			'		&nbsp;' + "\n" +
			'		<span class="phphile-{{file.editing}}">{{file.name}}</span>' + "\n" +
			'	</a>' + "\n" +
			'	<ul ng-if="file.nodes.length > 0" class="phphile-ul">' + "\n" +
			'		<li ng-repeat="file in file.nodes" ng-include="\'tree_subitems.html\'"></li>' + "\n" +
			'	</ul>' + "\n" +
			'</script>' + "\n" +

			'<div ng-repeat="file in files">' + "\n" +
			'	<div ng-if="!onlyfolders || (file.type == \'folder\' && onlyfolders)" ng-include="\'tree_subitems.html\'"></div>' + "\n" +
			'</div>' + "\n"
			);
	}]
);angular.module('phphile.service').factory('phphileService', ['$http', '$q', 'API_URL', function($http, $q, API_URL){
	
	var processRequest = function(request){
		return $q(function(resolve, reject) {
			$http(request).then(function successCallback(response) {
				var data = response.data;
				if (typeof data.error != 'undefined') {
					var error = {};
					error.code = data.error.code;
					error.msg = data.error.msg;
					reject(error);
				} else {
					resolve(data);
				}
			}, function errorCallback(response) {
				var error = {};
				error.code = response.status;
				error.msg = response.statusText;
				reject(error);
			});
		});
	};

	var getFiles = function(path){
		return processRequest({
			method: 'POST',
			url: API_URL,
			data: { 
				"path": path,
				"operation": "listFiles",
				"format": "JSON",
			}
		});
	};

	var getFile = function(path){
		return processRequest({
			method: 'POST',
			url: API_URL,
			data: { 
				"path": path,
				"operation": "getFile",
				"format": "FILE",
			}
		});
	};

	var saveFile = function(path, content){
		return processRequest({
			method: 'POST',
			url: API_URL,
			data: { 
				"path": path,
				"operation": "saveFile",
				"content": content,
				"format": "JSON",
			}
		});
	};

	var deleteFile = function(path){
		return processRequest({
			method: 'POST',
			url: API_URL,
			data: { 
				"path": path,
				"operation": "deleteFile",
				"format": "JSON",
			}
		});
	};

    return {
    	"getFiles": getFiles,
    	"getFile": getFile,
    	"saveFile": saveFile,
    	"deleteFile": deleteFile,
    };               
}]);