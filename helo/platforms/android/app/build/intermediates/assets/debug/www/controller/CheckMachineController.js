myApp.controller("CheckMachineController", function ($scope, $timeout, $http, $location, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.pageApprove = $location.search().status == "D";

    $scope.invoices = [];

    $scope.getInvoices = function () {
        
        var params = {
            act: "getcheckmachinedatatable",
            psize: $scope.paging.getRowCount(),
            status: $scope.pageApprove ? "D" : "",
            tabid: $scope.pageApprove ? 100: 96
        };
        
        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {

            $rootScope.permission = data.Permission[0];
            $scope.invoices = data.ListData;
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    $scope.getInvoice = function (id) {
        location.href = "#checkMachineAdd?id={id}&status={status}".replace("{id}", id)
            .replace("{status}", $location.search().status);
    }

    $scope.loadMore = function () {
        
        $scope.paging.pageIndex++;
        $scope.getInvoices();
    }

    function init() {
        
        $scope.getInvoices();
    }
    init();
});