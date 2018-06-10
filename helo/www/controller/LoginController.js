myApp.controller("LoginController", function ($scope, $timeout, $http, $rootScope) {
    $scope.username = "";// "admin";
    $scope.password = "";//"admin2018@das";
    $rootScope.user = {
        username: ""
    };
    $rootScope.permission = {};

    $scope.login = function () {
        var params = {
            act: "getlogin",
            u: $scope.username,
            p: $scope.password
        };

        Service.get(rootService + "LoginHandlerApp.ashx",  params,
            function (res) {
                if (res.result == 1) {
                    $rootScope.user = res;
                    location.href = "#home";
                }
                else {
                    $scope.loginFail = true;
                }
            }, function (error) {
                alert("Đăng nhập thất bại");
            });
    }

    var Service={
        get: function (apiurl, data, success, fnError) {
            $.ajax({
                method: "get",
                url: apiurl,
                data: data,
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
            }).then(function (response) {
                $timeout(function () {
                    success(response.ListUser[0]);
                }, 10);
            }, function (error) {
                //console.log(error);
                fnError();
            })
        }
    }

    function init() {
    }
    init();

});