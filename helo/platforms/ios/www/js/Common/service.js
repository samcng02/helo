var rooturl = "";

function post(apiurl, data, success, fnError) {
    debugger
    $http({
        method: "POST",
        url: rooturl + apiurl,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function (response) {
        if (response.status) {
            success(response.data);
        }
        else {
            location.reload();
        }
    }, function (error) {
        console.log(error);
        fnError();
    })
}