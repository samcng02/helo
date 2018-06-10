myApp.controller("MaterialRequestAddController", function ($scope, $timeout, $http, $location, Service) {
    $scope.invoice = {};
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

    function getInvoice(id) {
        var params = {
            act: "getdetailrequest",
            rqid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.invoice = data[0];

        }, function () {
            alert("Lấy phiếu kiểm bị lỗi");
        });
    }

    function approve(type, note) {

        var params = {
            act: type ? "approvedreuest" : "unapprovedreuest",
            rqid: $location.search().id,
            status: type ? "Y" : "T",
            note: note
        }
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            if (data[0].result == 0) {
                location.href = "#materialRequest";
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
            act: "getdetailrequestdatatable",
            rqid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.details = data;
            console.log($scope.details);
        }, function () {
            alert("Lấy chi tiết bị lỗi");
        });
    }

    function init() {
        
        var id = $location.search().id;
        getInvoice(id);
        getListDetail(id);
    }
    init();

});