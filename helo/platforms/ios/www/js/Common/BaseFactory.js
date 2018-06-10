var BaseFactory = function ($timeout,$http) {
    var factory = {};
    var rooturl = "";

    factory.Get = function (apiurl, params, callback) {
        $http({
            method: "GET",
            url: rooturl + apiurl,
            params: params,
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function (data) {
            if (data.status) {
                callback(data.data);
            }
            else {
                location.reload();
            }
        }, function (error) {
            console.log(error);
            $timeout(function () {
                callback(null);
            }, 10);
        })
    }

    factory.Post = function (apiurl, data, callback) {
        $http({
            method: "POST",
            url: rooturl + apiurl,
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function (data) {
            if (data.status) {
                callback(data.data);
            }
            else {
                location.reload();
            }
        }, function (error) {
            console.log(error);
            $timeout(function () {
                callback(null);
            }, 10);
        })
    }
    return factory;
}

BaseFactory.$inject = ["$timeout", "$http"];