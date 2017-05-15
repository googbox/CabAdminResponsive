'use strict';

angular.module('mdl_directives', [])

.directive('sidebarView', function($localStorage, $state, resetSession) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'views/sidebarView.tpl.html',
            link: function(scope) {
                $(document).ready(function() {
                    $(".button-collapse").sideNav();
                    $('.collapsible').collapsible();
                })
                if ($localStorage.userDetail) {
                    scope.nameInitail = $localStorage.userDetail.name.match(/\b(\w)/g);
                    scope.nameInitail = scope.nameInitail.join('');
                    scope.userName = $localStorage.userDetail.name;
                    scope.fmno = $localStorage.userDetail.userid;
                }
                scope.signOut = function() {
                    $localStorage.$reset();
                    $(".button-collapse").sideNav('hide');
                    resetSession({}, function(response) {
                        if (response.status == "001") {
                          $localStorage.$reset();
                          //window.location.href = location.origin+'/cab';
                          window.location.href = location.origin;
                        }
                    })

                }
                scope.closeSideNav = function() {
                    if ($(".button-collapse").sideNav())
                    {
                        $(".button-collapse").sideNav('hide');
                    }
                    $('#sidenav-overlay').remove();
                    $('#sidenav-overlay').remove();
                }
            }
        };
    })
    .directive('headerView', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'views/headerPanel.tpl.html'
        };
    });
