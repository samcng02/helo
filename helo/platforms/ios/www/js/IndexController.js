var myApp = angular.module('mcar', []);
myApp.controller("indexController", function ($scope, $http, $timeout) {
    //var rootSevice = "http://10.142.161.205:2020/WebServiceTest/";
    var rootSevice = "http://localhost:2020/WebServiceTest/";
    $scope.paging = {
        pageIndex: 1,
        pageSize: 5
    };

    $scope.invoices = [];
    $scope.user = { Username: "57642 - sang" };

    $scope.showLoadMore = false;

    $scope.getInvoice = function () {
        
        var params = {
            pageIndex: $scope.paging.pageIndex,
            pageSize: $scope.paging.pageSize
        };

        post(rootSevice + "GetListInvoice", params, function (data) {
            
            $scope.invoices = data;
            $scope.showLoadMore = true;
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    $scope.addInvoice = function (id) {
        location.href = "addInvoice.html?id=" + id;
    }

    var rooturl = "";

    function post(apiurl, data, success, fnError) {
        
        $http({
            method: "POST",
            url: rooturl + apiurl,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function (response) {
            if (response.status) {
                success(response.data);
            }
            else {
                location.reload();
            }
        }, function (error) {
            console.log(error);
            fnError();
        })
    }


    $scope.loadMore = function () {
        var params = {
            pageIndex: $scope.paging.pageIndex++,
            pageSize: $scope.paging.pageSize
        };
        post(rootSevice + "GetListInvoice", params, function (data) {
            $scope.invoices = $scope.invoices.concat(data);
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    function init() {
    }
    init();

});