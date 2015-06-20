angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'ionic.service.core'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
