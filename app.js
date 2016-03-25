
angular.module("app", ["chart.js","ui.grid", "ui.grid.edit"]).controller("InsCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Option A', 'Option B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.gridFamilyOptions = {
          enableSorting: true,
          columnDefs: [
            { name:'Name', field: 'name' },
            { name:'Include', field: 'include' },
            { name:'Age', field: 'age'},
            { name:'Visit Base', field: 'visitBase'},
            { name:'Sick Risk' , field: 'sickRisk'},
            { name:'Catastrophic Risk' , field:'catRisk'}
          ],
          data : [          {
                            "name": "Insured" ,
                            "include": true,
                            "age": 40,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Spouse of Insured" ,
                            "include": true,
                            "age": 40,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 1" ,
                            "include": true,
                            "age": 17,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 2" ,
                            "include": true,
                            "age": 15,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 3" ,
                            "include": true,
                            "age": 13,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 4" ,
                            "include": true,
                            "age": 11,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 5" ,
                            "include": true,
                            "age": 9,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          },
                          {
                            "name": "Child 6" ,
                            "include": true,
                            "age": 7,
                            "visitBase": 150,
                            "sickRisk": 0.1,
                            "catRisk": 0.01
                          }

                     ]
        };

$scope.gridPlanOptions = {
        enableSorting: true,
        columnDefs: [
          { name:'Plan Name', field: 'planName' },
          { name:'Premium', field: 'premiumFamily' },
          { name:'Deductible', field: 'deductibleFamily'},
          { name:'Max OOP', field: 'maxOOPFamily'}
        ],
        data : [
          {
            "planName": "Bronze Plan" ,
            "premiumFamily": 2279,
            "deductibleFamily": 6000,
            "maxOOPFamily": 11900
          },
          {
            "planName": "Silver Plan" ,
            "premiumFamily": 3526,
            "deductibleFamily": 3000,
            "maxOOPFamily": 6850
          }
                   ]
      };


$scope.planList = $scope.gridPlanOptions.data;


});
