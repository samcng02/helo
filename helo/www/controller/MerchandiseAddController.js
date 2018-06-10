myApp.controller("MerchandiseAddController", function ($scope, $timeout, $http, $location, Service) {
    $scope.merchandise = {};
    $scope.details = []; //chi tiết

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

    function getMerchandise(id) {
        var params = {
            act: "getdetailmerchandise",
            meid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.merchandise = data[0];

        }, function () {
            alert("Lấy phiếu kiểm nhập hàng bị lỗi");
        });
    }

    function approve(type, note) {

        var params = {
            act: type ? "approvedmerchandise" : "unapprovedmerchandise",
            meid: $location.search().id,
            deid: $scope.merchandise.DepotID,
            note: note
        }
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            if (data[0].result == 0) {
                location.href = "#merchandise";
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
            act: "getmerchandisedetailtable",
            meid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.details = data;
        }, function () {
            alert("Lấy chi tiết bị lỗi");
        });
    }

    function init() {
        
        var id = $location.search().id;
        getMerchandise(id);
        getListDetail(id);
    }
    init();

});