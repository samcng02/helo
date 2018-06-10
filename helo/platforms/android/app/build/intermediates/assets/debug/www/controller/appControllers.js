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
myApp.controller("HomeController", function ($scope, $timeout, $http, $rootScope) {
    //menu
    var menuId = 0;
    $rootScope.menus = [
        { menuId: menuId++, menuName: "Trang chủ", href: "#home", classIcon: "glyphicon glyphicon-home", showAll: false },
        { menuId: menuId++, menuName: "Phiếu kiểm tra máy", href: "#checkMachine", classIcon: "glyphicon glyphicon-list-alt", showAll: true },
        { menuId: menuId++, menuName: "Duyệt phiếu kiểm tra máy", href: "#checkMachine?status=D", classIcon: "glyphicon glyphicon-list-alt", showAll: true },
        { menuId: menuId++, menuName: "Phiếu bảo trì", href: "#maintain", classIcon: "glyphicon glyphicon-wrench", showAll: true },
        { menuId: menuId++, menuName: "Xác nhận phiếu bảo trì", href: "#maintainX", classIcon: "glyphicon glyphicon-wrench", showAll: true },
        { menuId: menuId++, menuName: "Phiếu yêu cầu vật tư", href: "#materialRequest", classIcon: "glyphicon glyphicon-briefcase", showAll: true },
        { menuId: menuId++, menuName: "Phiếu nhập hàng", href: "#merchandise", classIcon: "glyphicon glyphicon-import", showAll: true },
        { menuId: menuId++, menuName: "Phiếu xuất kho", href: "#rotateDepot", classIcon: "glyphicon glyphicon-export", showAll: true },
        { menuId: menuId++, menuName: "Phiếu nhận hàng", href: "#rotateDepot?status=Y", classIcon: "glyphicon glyphicon-retweet", showAll: true },
        { menuId: menuId++, menuName: "Đăng xuất", href: "#login", classIcon: "glyphicon glyphicon-log-out", showAll: false },
    ];

    //$scope.activeMenu = function (menuId) {
    //    $rootScope.menuIdActive = menuId;
    //}

    function init() {
    }
    init();

});
myApp.controller("LoginController", function ($scope, $timeout, $http, $rootScope) {
    $scope.username = "";// "admin";
    $scope.password = "";//"admin2018@das";
    $rootScope.user = {
        username: ""
    };
    $rootScope.permission = {};

    $scope.login = function () {
        var params = {
            act: "getlogin",
            u: $scope.username,
            p: $scope.password
        };

        Service.get(rootService + "LoginHandlerApp.ashx",  params,
            function (res) {
                if (res.result == 1) {
                    $rootScope.user = res;
                    location.href = "#home";
                }
                else {
                    $scope.loginFail = true;
                }
            }, function (error) {
                alert("Đăng nhập thất bại");
            });
    }

    var Service={
        get: function (apiurl, data, success, fnError) {
            $.ajax({
                method: "get",
                url: apiurl,
                data: data,
                async: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
            }).then(function (response) {
                $timeout(function () {
                    success(response.ListUser[0]);
                }, 10);
            }, function (error) {
                //console.log(error);
                fnError();
            })
        }
    }

    function init() {
    }
    init();

});
myApp.controller("MaintainAddController", function ($scope, $timeout, $http, $location, Service) {
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
myApp.controller("MaintainXAddController", function ($scope, $timeout, $http, $location, Service) {
    $scope.invoice = {};
    $scope.details = []; //chi tiết
    $scope.depts = [];

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
            act: "getdetailreceiptsdatatable",
            crid: id
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            $scope.invoice = data[0];

        }, function () {
            alert("Lấy phiếu kiểm bị lỗi");
        });
    }

    function approve(type, note) {

        var params = {
            act: type ? "approvedreceipts" : "unapprovedreceipts",
            crid: $location.search().id,
            status: type ? "X" : "Y",
            note: note
        };
        Service.get(rootService + "CreateApplyHandlerApp.ashx", params, function (data) {
            
            if (data[0].result == 0) {
                location.href = "#maintainX";
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
    }
    init();

});
myApp.controller("MaintainXController", function ($scope, $http, $timeout, Service, $rootScope) {
    $scope.paging = $rootScope.getPaging();
    $scope.invoices = [];

    $scope.getInvoice = function () {
        
        var params = {
            act: "getreceiptsdatatable",
            status: "H",
            psize: $scope.paging.getRowCount(),
            tabid:105
        };

        Service.get2(rootService + "GetApplyHandlerApp.ashx", params, function (data) {
            $rootScope.permission = data.Permission[0];
            $scope.invoices = data.ListData;
        }, function () {
            alert("Lấy danh sách phiếu kiểm bị lỗi");
        });
    }

    $scope.getDetail = function (id) {
        location.href = "#maintainXAdd?id=" + id;
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