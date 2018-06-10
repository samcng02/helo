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