myApp.controller("RotateDepotAddController", function ($scope, $timeout, $http, $location, Service) {
    $scope.rotateDepot = {};
    $scope.details = []; //chi tiết
    $scope.isPageReceive = $location.search().status == "Y";

    $scope.approve = function (type) {

        if (type) {
            if (confirm("Bạn chắc chắn muốn duyệt đơn này?")) {
                approve(type);
            }
        }
        else {
            var note = prompt("Lý do");
            if (note != "" && note != null) {
                approve(type, note);
            }
        }
    }

    $scope.back = function (onlyGetLink) {
        if (onlyGetLink) {
            return "rotateDepot?status={status}".replace("{status}", $scope.isPageReceive ? "Y" : "D");
        }
        location.href =  "#rotateDepot?status={status}".replace("{status}", $scope.isPageReceive ? "Y" : "D");
    }

    function getRotateDepot(id) {
        var params = {
            act: "getrotatedepotdetail",
            roid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.rotateDepot = data[0];

        }, function () {
            alert("Lấy phiếu xuất hàng bị lỗi");
        });
    }

    function approve(type, note) {
        var params = {
            act: type ? "approvedrotatedepot" : "unapprovedrotatedepot",
            roid: $location.search().id,
            note: note,
            defr: $location.search().depotFrom,
            status: $scope.isPageReceive ? "X" : "Y"
        }

        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            if (data[0].result == 0) {
                $scope.back();
            }
            else {
                alert("Lỗi khi duyệt phiếu");
            }
        }, function (e) {
            alert("Lỗi duyệt phiếu");
        });
    }

    //get danh sách chi tiết
    function getListDetail(id) {
        var params = {
            act: "getrotatedepotdetailtable",
            roid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.details = data;
        }, function () {
            alert("Lấy chi tiết bị lỗi");
        });
    }

    function init() {
        
        var id = $location.search().id;
        getRotateDepot(id);
        getListDetail(id);
    }
    init();

});