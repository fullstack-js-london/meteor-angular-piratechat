// A shared instance of a Mongo collection
Messages = new Mongo.Collection("messages");
console.log("I'm what you might call Isomorphic");

if (Meteor.isClient) {

 angular.module('app', ['angular-meteor', 'ngMaterial'])

    .factory('pirateSentence', ['$http', function ($http) {
      var pirateSentence = function(sentence) {
        var api = "http://isithackday.com/arrpi.php?text=",
            url = api + sentence + '&format=json&callback=JSON_CALLBACK';
        return $http({
            method: "jsonp",
            url: url
        })
      };
      return pirateSentence;
    }])

    .controller("HomeCtrl", 
      ['$scope', '$meteor','$http', 'pirateSentence',
          function($scope, $meteor, $http, pirateSentence){
            $scope.messages = $meteor.collection(Messages);

            $scope.deleteMessage = function(message) {
              $scope.messages.splice( $scope.messages.indexOf(message), 1 );
            };

            $scope.addTodo = function() {
              var theMessage = $scope.newMessage
              $scope.loading = true;
              pirateSentence(theMessage)
             .success(function(data) {
                $scope.message = data;
                theMessage = data.translation.pirate;
              })
              .error(function(err) {

              })
              .finally(function() {
                $scope.loading = false;
                $scope.messages.push({
                  message: theMessage,
                  user: Meteor.user().username
                });
                 $scope.newMessage = '';
              })
            };

            
          }]);
    // Usernames instead of emails
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    /* If you wanted to seed the database */

    // if (Todos.find().count() === 0) {
    //   var todos = [
    //     {'text': 'Dubstep-Free Zone'},
    //     {'text': 'All dubstep all the time'},
    //     {'text': 'Savage lounging'}
    //   ];
    //   for (var i = 0; i < todos.length; i++)
    //     Todos.insert({name: todos[i].text});
    // }
  });
}


