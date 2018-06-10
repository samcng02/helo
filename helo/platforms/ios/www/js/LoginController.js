var myApp = angular.module('mcar', []);
myApp.controller("loginController", function ($scope, $http) {
    $scope.username = "";
    $scope.password = "";

    $scope.login = function () {
        if ($scope.username == "" || $scope.password == "") {
            alert("Vui lòng nhập username và password");
            return;
        }
        var rsLogin = $scope.username == "sang" && $scope.password == "123";
        if (rsLogin) {
            location.href = "index.html";
        }
        else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    }

    function init() {
    }
    init();

});