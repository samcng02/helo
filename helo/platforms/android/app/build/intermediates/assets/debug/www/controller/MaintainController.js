myApp.controller("MaintainController", function ($scope, $http, $timeout, $location, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.invoices = [];

    $scope.getInvoice = function () {
        
        var params = {
            act: !$scope.isPageFinish ? "getreceiptsdatatable" : "getcreatereceiptsdatatable",
            status: "D",
            psize: $scope.paging.getRowCount(),
            tabid:101
        };

        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {
            $rootScope.permission = data.Permission[0];
            $scope.invoices = data.ListData;
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    $scope.getDetail = function (id) {
        location.href = "#maintainAdd?id={id}".replace("{id}", id);
    }

    $scope.loadMore = function () {

        $scope.paging.pageIndex++;
        $scope.getInvoice();
    }

    function init() {
        
        $scope.getInvoice();
    }
    init();

});