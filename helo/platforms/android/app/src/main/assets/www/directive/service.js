myApp.factory("Service", function ($timeout, $http, $rootScope) {
    var Service = {};
    Service.get = function (apiurl, data, success, fnError) {
        
        $.ajax({
            method: "get",
            url: apiurl,
            data: data,//JSON.stringify(data),
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2000,
        }).then(function (response) {
            $timeout(function () {
                success(response.ListData);
            }, 10);
        }, function (error) {
            
            //console.log(error);
            fnError();
        })
    }

    //get 2 return data fresh
    Service.get2 = function (apiurl, data, success, fnError) {
        data.usid = $rootScope.user.userid; //set usid to get permission

        $.ajax({
            method: "get",
            url: apiurl,
            data: data,//JSON.stringify(data),
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2000,
        }).then(function (response) {
            $timeout(function () {
                success(response); //difference get
            }, 10);
        }, function (error) {

            //console.log(error);
            fnError();
        })
    }

    return Service;
});