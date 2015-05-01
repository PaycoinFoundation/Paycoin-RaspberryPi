'use strict';

angular.module('PaycoinRpiWallet')
    .controller('DashboardCtrl', function ($scope, $rootScope, $http, paycoind) {
        $rootScope.app.curTitle = "Dashboard";

    }
);
