"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var challengeUrl = 'https://api.parse.com/1/classes/comment';

angular.module('AjaxChallengeApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'sGyD6K2ELgUoFXCGdXDiRmPm8Yu361gAnqJqhbhD';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '7Q0h1AQgeYYcJ073P5MP14d8EWUbJU55hNWJisnw';
    })
    .controller('CommentController', function($scope, $http) {
        $scope.refreshComments = function() {
            $http.get(challengeUrl + '?order=-score')
                .success(function(data) {
                    var sorted = data.results;
                    $scope.comments = sorted;
                });
        };
        $scope.refreshComments();

        $scope.newComment = {done: false};

        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(challengeUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {done: false};
                })
                .finally(function () {
                    $scope.inserting = false;
                });
        };

        $scope.updateComment = function(comment) {
            $http.put(challengeUrl + '/' + comment.objectId, comment)
                .success(function(){
                    console.log("Comment was updated!");
                })
        };

        $scope.incrementVotes = function(comment, amount) {
            var postData = {
                votes: {
                    __op: "Increment",
                    amount: amount
                }
            };
            $scope.updating = true;
            $http.put(challengeUrl + '/' + comment.objectId, postData)
                .success(function(respData){
                    comment.votes = respData.votes;
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function(){
                    $scope.updating = false;
                });
        };

        $scope.deleteComment = function(comment){
            $http.delete(challengeUrl + '/' + comment.objectId)
                .success(function(){
                    console.log("Comment was deleted!");
                });
        };
    });