myApp.controller("MaterialRequestController", function ($scope, $http, $timeout, $location, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.invoices = [];

    $scope.getInvoice = function () {
        var params = {
            act: "getrequestdatatable",
            psize: $scope.paging.getRowCount(),
            status: "D",
            tabid:102
        };

        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {
            $rootScope.permission = data.Permission[0];
            $scope.invoices = data.ListData;
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    $scope.getDetail = function (id) {
        location.href = "#materialRequestAdd?id=" + id;
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