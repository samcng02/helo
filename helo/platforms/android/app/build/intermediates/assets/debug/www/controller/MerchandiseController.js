myApp.controller("MerchandiseController", function ($scope, $timeout, $http, $location, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.merchandises = [];

    $scope.getMerchandises = function (loadMore) {
        if (!loadMore) {
            $scope.paging.pageIndex = 1;
        }
        var params = {
            act: "getmerchandisedatatable",
            psize: $scope.paging.pageSize * $scope.paging.pageIndex,
            tabid:117
        };

        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {
            $rootScope.permission = data.Permission[0];
            $scope.merchandises = data.ListData;
        }, function () {
            alert("Lấy danh sách đơn nhập hàng bị lỗi");
        });
    }

    $scope.getMerchandise = function (id) {
        location.href = "#merchandiseAdd?id={id}".replace("{id}", id);
    }

    $scope.loadMore = function () {
        
        $scope.paging.pageIndex++;
        $scope.getMerchandises(true);
    }

    function init() {
        $scope.getMerchandises();
    }
    init();

});