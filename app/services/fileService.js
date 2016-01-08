angular.module('phphile.service').factory('phphileService', ['$http', '$q', 'API_URL', function($http, $q, API_URL){
	
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