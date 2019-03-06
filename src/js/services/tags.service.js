export default class Tags {
  constructor(JWT, AppConstants, $http, $q) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;


  }

  getAll() {

      return this._$http.get(this._AppConstants.api + '/tags')
          .then((res) => res.data.tags)
          .catch(function (data) {
              // Handle error here
              console.log('Something went wrong in get tags');
          });
   }


}
