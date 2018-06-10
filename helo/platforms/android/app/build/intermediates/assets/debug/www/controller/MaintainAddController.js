﻿myApp.controller("MaintainAddController", function ($scope, $timeout, $http, $location, Service) {
    $scope.invoice = {};
    $scope.details = []; //chi tiết
    $scope.depts = [];

    $scope.approve = function (type) {
        
        if (type) {
            if ($scope.invoice.DeptID==0) {
                alert("Vui lòng chọn bộ phận");
                return;
            }
            else {
                approve(type);
            }
        }
        else {
            var note = prompt("Lý do");
            //cancel is null
            if (note != "" && note!=null) {
                approve(type, note);
            }
        }
    }

    function getInvoice(id) {
        var params = {
            act: "getdetailreceiptsdatatable",
            crid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.invoice = data[0];
            $scope.invoice.DeptID = 0;

        }, function () {
            alert("Lấy phiếu kiểm bị lỗi");
        });
    }

    function approve(type, note) {

        var isApprove = $location.search().status == "H";
        var params = {
            act: type ? "approvedreceipts" : "unapprovedreceipts",
            crid: $location.search().id,
            status: type ? "H" : "T",
            note: note
        }
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            if (data[0].result == 0) {
                $('.modal-backdrop').remove();
                location.href = "#maintain";
            }
            else {
                alert("Lỗi khi duyệt phiếu");
            }
        }, function (e) {
            alert("Lỗi duyệt phiếu");
        });
    }

    function getDetail(id) {
        var params = {
            act: "getreceiptsdetailtable",
            crid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.details = data;
            console.log($scope.details);
        }, function () {
            alert("Lấy chi tiết bị lỗi");
        });
    }

    //get bộ phận
    function getDept() {
        Service.get(rootService + "CreateApplyHandlerApp.ashx?act=getdeptdatatable", null, function (data) {

            try {
                if (data) {
                    data.unshift({ DeptID: 0, DeptName: "-Chọn bộ phận-" });
                }
                $scope.depts = data;
                for (var i = 0; i < $scope.depts.length; i++) {
                    $scope.depts[i].DeptID *= 1;
                }
            } catch (e) {
                alert("Lỗi lấy danh sách tài sản");
            }
        }, function (e) {
            alert("Lấy danh sách tài sản bị lỗi");
        });
    }

    function init() {
        var id = $location.search().id;
        getInvoice(id);
        getDetail(id);
        getDept();
    }
    init();

});