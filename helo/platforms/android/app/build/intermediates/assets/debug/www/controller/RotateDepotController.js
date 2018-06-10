myApp.controller("RotateDepotController", function ($scope, $timeout, $http, $location, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.isPageReceive = $location.search().status == "Y";
    $scope.rotateDepots = [];

    $scope.getrotateDepots = function (loadMore) {
        if (!loadMore) {
            $scope.paging.pageIndex = 1;
        }
        var params = {
            act: "getrotatedepotdatatable",
            psize: $scope.paging.getRowCount(),
            status: $scope.isPageReceive ? "Y" : "D",
            tabid: $scope.isPageReceive?120:119,
        };

        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {
            
            $rootScope.permission = data.Permission[0];
            $scope.rotateDepots = data.ListData;
        }, function () {
            alert("Lấy danh sách đơn xuất kho bị lỗi");
        });
    }

    $scope.getRotateDepot = function (id, depotFrom) {
        location.href = "#rotateDepotAdd?id={id}&depotFrom={depotFrom}&status={status}"
            .replace("{id}", id)
            .replace("{depotFrom}", depotFrom)
            .replace("{status}", $scope.isPageReceive ? "Y" : "D");
    }

    $scope.loadMore = function () {
        
        $scope.paging.pageIndex++;
        $scope.getrotateDepots(true);
    }

    function init() {
        $scope.getrotateDepots();
    }
    init();

});