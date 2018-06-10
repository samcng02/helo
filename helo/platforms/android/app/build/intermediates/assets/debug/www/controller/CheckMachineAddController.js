myApp.controller("CheckMachineAddController", function ($scope, $timeout, $http, $location, $q, Service) {

    function date2String(date, format) {
        var dd = (date.getDate() < 10 ? "0" : "") + date.getDate(),
            MM = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1),
            yyyy = date.getFullYear(),
            str = format.replace("dd", dd).replace("MM", MM).replace("yyyy", yyyy);
        return str;
    }

    $scope.ready = false;
    $scope.message = "";
    $scope.isAdd = false;
    $scope.pageApprove = $location.search().status == "D";

    $scope.invoice = {
        CheckMachineID: 0,
        DeptID:0,
        AssetID: 0,
        Status: "M",
        checks: [],
        CheckDate: ""
    };
    $scope.assets = [];
    $scope.depts = [];

    $scope.$watch('invoice.AssetID', function (newValue, oldValue) {
        
        if (newValue != oldValue && $scope.ready) {
            getListCheck($scope.invoice.AssetID);
        }
    });

    //save
    $scope.save = function (status) {

        var obj = $scope.invoice;
        if (obj.DeptID == 0 || obj.AssetID == 0) {
            $scope.message = "Vui lòng chọn bộ phận và tài sản";
            return;
        }
        var checks = "";
        for (var i = 0; i < obj.checks.length; i++) {
            var item = obj.checks[i];
            checks += item.CheckID + "-" + item.Status + ";";
        }

        var params = {
            act: "createmachine",
            mcid: obj.CheckMachineID * 1,
            dpid: obj.DeptID * 1,
            asid: obj.AssetID,
            dateCheck: $scope.invoice.CheckDate.replace(/\//g, ""),
            lstCheck: checks.slice(0, -1)
        }

        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            if (data[0].result == 0) {
                $scope.back();
            }
            else {
                $scope.message = data[0].status;
            }
        }, function (e) {
            $scope.message("Tạo đơn thất bại");
        })
    }

    $scope.approve = function (status) {

        if (status == "Y") {
            if (confirm("Bạn chắc chắn muốn duyệt đơn này?")) {
                approve(status);
            }
        }
        else if (status == "D") {
            approve(status)
        }
        else {
            var note = prompt("Lý do");
            if (note != "") {
                approve(status, note);
            }
        }
    }

    //click check box
    $scope.checkStatus = function (index) {

        $scope.invoice.checks[index].Status = $scope.invoice.checks[index].Status == "Y" ? "N" : "Y";
    }

    $scope.back = function (onlyGetLink) {
        if (onlyGetLink) {
            return "checkMachine?status={status}".replace("{status}", $location.search().status);
        }
        location.href = "#checkMachine?status={status}".replace("{status}", $location.search().status);
    }

    //get danh sách tài sản
    function getAsset() {
        Service.get(rootService + "CreateApplyHandlerApp.ashx?act=getlistasset", null, function (data) {

            try {
                for (var i = 0; i < data.length; i++) {
                    data[i].AssetID *= 1;
                }
                data.unshift({ AssetID: 0, AssetCodeName: "-Chọn loại tài sản-" });
                $scope.assets = data;
            } catch (e) {
                alert("Lỗi lấy danh sách tài sản");
            }
        }, function (e) {
            alert("Lấy danh sách tài sản bị lỗi");
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

    //get chi tiết check của tài sản
    function getListCheck(assetId) {

        var params = {
            act: "getmachinecheckdailydatatable",//"getcheckdailydatatable",
            asid: assetId,
            mcid: 0
        };

        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {

            for (var i = 0; i < data.length; i++) {
                item = data[i];
                item.Status = item.Status == null ? "Y" : item.Status;
            }

            $scope.invoice.checks = data;
        }, function (e) {
            alert("Lấy chi tiết check của tài sản bị lỗi")
        });
    }

    //get thông tin chi tiet phiếu
    function getInvoiceDetail(id) {
        var params = {
            act: "getdetailmachinedatatable",
            mcid: id
        };

        var promise = $q(
            function (resolve, reject) {
                Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {

                    $scope.invoice = data[0];
                    $scope.invoice.CheckMachineID = id;
                    var date = data[0].CheckDate;
                    $scope.invoice.CheckDate = date.slice(0, 2) + "/" + date.slice(2, 4) + "/" + date.slice(4);
                    resolve(id);
                }, function (e) {
                    reject(e);
                    alert("Lấy phiếu kiểm bị lỗi");
                });
            }
        );

        promise.then(function (id) {
            getInvoiceDetailCheck(id);
        }).catch(function (e) {
            alert("Lỗi lấy thông tin phiếu");
        });
    }

    //get chi tiết check của phiếu
    function getInvoiceDetailCheck(id) {
        var params = {
            act: "getmachinecheckdailydatatable",
            mcid: id,
            asid: $scope.invoice.AssetID
        };

        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {

            $scope.invoice.checks = data;
        }, function (e) {
            alert("Lấy chi tiết check bị lỗi");
        });
    }

    function approve(status, note) {

        var params = {
            act: status == "T" ? "unapprovedmachine" : "approvedmachine",
            mcid: $scope.invoice.CheckMachineID,
            status: status,
            note: ""
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

    function init() {
        try {
            var id = $location.search().id;
            $scope.isAdd = id == 0;
            if (id != 0) {
                getInvoiceDetail(id);
            }
            else {
                $scope.invoice.CheckDate = date2String(new Date, "dd/MM/yyyy");
            }
            getAsset();
            getDept();
        }
        catch (e) {
            alert(e.message);
        }
    }
    init();

});