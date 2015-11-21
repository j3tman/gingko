(function() {
  'use strict';
  angular.module('app')
  .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$http', '$q', '$log', '$window', 'searchFactory'];

  function SearchCtrl($http, $q, $log, $window, searchFactory) {
    // TODO: Please verify that this matches the refactored style

    var self = this;
    //date initialization
    self.date = new Date();
    self.minDate = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate());

    // below are settings for the md-autocomplete directive
    self.simulateQuery = false;
    self.isDisabled = false;
    //below is a hack for testing, we are struggling to access facebook auth username from client side
    self.meal = {username: 'aackerman'};
    self.attendees = [1,2,3,4,5,6,7,8,9];
    self.selectedItem = undefined;

    self.makeStarArr = function(rating) {
      var fullStarPath = '../../styles/star.png'
      var halfStarPath = '../../styles/star-half.png'
      var emptyStarPath = '../../styles/star-empty.png';

      var starArr = [emptyStarPath, emptyStarPath, 
        emptyStarPath, emptyStarPath, emptyStarPath];
      var i = 0;
      while (i < rating) {
        if (i + .5 === rating) {
          starArr[i]  = halfStarPath;
        } else {
          starArr[i] = fullStarPath;
        }
        i++;
      }
      return starArr;
    }

    self.querySearch = function(query) {
      var path = '/api/out/yelp';

      return $http({
        url: path + '?term=' + query,
        method: 'GET',
      }).
        then(function(response) {
          self.status = response.status;
          self.iteratee = response.data;
          self.data = [];
          _.each(self.iteratee, function(item) {
            if (!item.is_closed && item.rating && item.name && item.url && item.categories && item.phone && item.location) {
              self.data.push({
                'rating': self.makeStarArr(item.rating),
                'name': item.name,
                'url': item.url,
                'categories': item.categories,
                'phone': item.phone,
                'display_address': item.location.display_address,
                'coordinate': {
                  lat: item.location.coordinate.latitude,
                  lng: item.location.coordinate.longitude
                }
              });
            }
          });
        }, function(response) {
          self.data = response.data || "Request failed";
          self.status = response.status;
          console.log('Error during querySearch.');
        })
        .then(function(response) {
          console.log(self.data);
          return self.data;
        })

    };

    self.add = function () {
      // console.log(self.meal);
      searchFactory.postMeal(self.meal)
      .then(function(response) {
        $window.location = '/#/home';
      });

    };

}
})();
