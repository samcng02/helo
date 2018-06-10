var myApp = angular.module('mcar', ['ngRoute']);

myApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
        if (currRoute.originalPath == undefined) {
            return;
        }
        var logged = $rootScope.user ? $rootScope.user.username != '' : false;
        var loginPage = currRoute.originalPath == "/login";

        if (!logged && !loginPage) {
            event.preventDefault();
            location.href = "#login";
        }
        else {
            //find menu active
            if ($rootScope.menus != undefined) {
                for (var i = 0; i < $rootScope.menus.length; i++) {
                    var menu = $rootScope.menus[i];
                    
                    if (currRoute.originalPath == "/checkMachine" && currRoute.params.status == "D") {
                        go($rootScope.menus[2]);
                        break;
                    }

                    if (currRoute.originalPath == "/rotateDepot" && currRoute.params.status == "Y") {
                        go($rootScope.menus[8]);
                        break;
                    }

                    if (menu.href == currRoute.originalPath.replace("/", "#")) {
                        go(menu);
                        break;
                    }
                }
            }
        }
    });

    $rootScope.getStatus = function (status) {
        return configStatus[status];
    }

    $rootScope.getPaging = function () {
        return {
            pageSize: 1,
            pageIndex: 1,
            getRowCount: function () {
                return this.pageSize * this.pageIndex;
            }
        };
    }

    go = function (menu) {
        console.log(menu);
        $rootScope.menuActive = menu;
    }

}]);