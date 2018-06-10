myApp.directive("returnTitle", function () {
    return {
        restrict: "E",

    scope: {
        link: "@",
        titletext: "@"
    },

    transclude: true,
    templateUrl: "directive/returnTitle/returnTitle.html",

    link: function (scope, element, attrs) {
        //#region Variable

        //#endregion

        //#region Function

        //#region Support

        //#endregion

        //#region Verify

        //#endregion

        //#region Logic

        scope.Return = function () {
            // window.location.replace("#/" + scope.link);
            if (scope.link) {
                location.href = "#" + scope.link;
            }
        }

        //#endregion

        //#endregion

        //#region Init

        var initialise = function () {

        }

        initialise();

        //#endregion
    },
    };
});