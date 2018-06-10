var myApp = angular.module('mcar',[]);
myApp.controller("addInvoiceController", function ($scope, $http) {
    var rootSevice = "http://192.168.1.140:2020/WebServiceTest/";
    //"http://localhost:34814/WebServiceTest/";

    $scope.invoice = {};
    $scope.user = { Username: "57642 - sang" };
    $scope.assets = [
        { Id: 0, Name: "--Chọn loại tài sản--" },
        { Id: 1, Name: "Xe" },
        { Id: 2, Name: "Ghe" },
        { Id: 3, Name: "Nhà" },
    ];

    $scope.back = function () {
        location.href = "index.html";
    }

    $scope.$watch('invoice.AssetId', function (newValue, oldValue) {
        if (newValue != oldValue) {
            alert($scope.invoice.AssetId);
        }
    });

    function getInvoice(id) {
        var params = {
            id: id
        };
        post(rootSevice + "GetInvoice", params, function (data) {

            $scope.invoice = data;
        }, function () {
            alert("Lấy phiếu kiểm bị lỗi");
        });
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

    function init() {
        debugger

        var id = location.search.split("=")[1];
        if (id != 0) {
            getInvoice(id);
        }
        else {
            $scope.invoice.AssetId = 0;
        }

    }
    init();


    /*test
    function getWSTest() {
        var params = { name: "sang" };
        $http.get("http://localhost:34814/WebServiceTest/GetName", {params}).then(
            function (response) {
                alert(response.data);
            }, function () {
                alert("e");
            });
    }

    function postWSTest() {
        var obj = { name: "sang" };
        $http.post("http://localhost:34814/WebServiceTest/GetName",  obj).then(
            function (response) {
                alert(response.data);
            }, function () {
                alert("e");
            });
    }
    */

});