


angular.module("app", ["chart.js","ui.grid", "ui.grid.edit"]).controller("InsCtrl", function ($scope) {


  //
  // Data Definition
  //
    $scope.Plans = [
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
    ];

    $scope.getPlanNames = function () {
      var planNames = [];
      angular.forEach($scope.Plans, function(plan){
        this.push(plan.planName);
      }, planNames);
        return planNames;
    };

    $scope.simulateYear = function () {

    // -------------------
    // iterate through each plan option, family member, and scenario year
    // accumulate all the costs within each plan option and return a histogram
    // -------------------
      // for each plan option
      var SimulatedYear = [];
      angular.forEach($scope.Plans, function(plan){

        console.log('Add premium to random costs for plan '.concat(plan.planName));
        var VarCosts = [];
        VarCosts = chance.n(chance.normal, 7, {mean: 2000, dev: 1000, fixed: 2}) ;
        console.log('Before adding premium of '.concat(plan.premiumFamily));
        console.log(VarCosts);
        var PlanCosts = [];
        PlanCosts = VarCosts.map(function(cost) {
            return cost + plan.premiumFamily;
          });
        console.log('After adding premium');
        console.log(PlanCosts);
        this.push({planname: plan.planName, costs: PlanCosts});
      }, SimulatedYear);

        // for each scenario run


          // for each family member

    // within each plan option, count the results by cost bin

          // var CostCurves = [
          //   chance.n(chance.normal, 7, {mean: 100, fixed: 7}),
          //   chance.n(chance.normal, 7, {mean: 100, fixed: 7})
          // ];
        return SimulatedYear ;
    };

    $scope.SimulatedYear = $scope.simulateYear();


    $scope.getPlanCosts = function () {
      console.log('executing getPlanCosts()');
      console.log('SimulatedYear object:'.concat($scope.SimulatedYear));
      var PlanCosts = [];
      angular.forEach($scope.SimulatedYear, function(simyear){
        console.log('simyear:');
        console.log(simyear);
        console.log('simresult.costs:');
        console.log(simyear.costs);
        this.push(simyear.costs);
      }, PlanCosts);
      console.log('PlanCosts returned from getPlanCosts():');
      console.log(PlanCosts);
        return PlanCosts;
    };

  $scope.freqlabels = [1,2,3,4,5,6,7];
//  $scope.series = ['Option A', 'Option B'];
  $scope.series = $scope.getPlanNames();

  $scope.costcurves =
    $scope.getPlanCosts();
  ;

  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
  };



  $scope.FamilyProfile = [          {
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
          data : $scope.FamilyProfile
        };

$scope.gridPlanOptions = {
        enableSorting: true,
        columnDefs: [
          { name:'Plan Name', field: 'planName' },
          { name:'Premium', field: 'premiumFamily' },
          { name:'Deductible', field: 'deductibleFamily'},
          { name:'Max OOP', field: 'maxOOPFamily'}
        ],
        data : $scope.Plans
      };




});
