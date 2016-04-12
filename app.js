


angular.module("app", ["chart.js","ui.grid", "ui.grid.edit"]).controller("InsCtrl", function ($scope) {

    $scope.SimCount = 50;

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

//
// End of DDL
//

$scope.simulateYear = function () {

  // -------------------
  // iterate through each plan option, family member, and scenario year
  // accumulate all the costs within each plan option and return a histogram
  // -------------------
  // for each plan option
  var SimulatedYear = [];
  angular.forEach($scope.Plans, function(plan){

    console.log('Calculating simulated costs for '.concat(plan.planName).concat(', deductibleFamily is ').concat(plan.deductibleFamily));

    // initialize an empty array of family expenses
    var FamilyCosts = [];

    // loop through each family member and push() the
    // member's randomly-generated costs into the FamilyCosts object
    // for each family member
      angular.forEach($scope.FamilyProfile, function(familyMember){
        console.log('Calculating simulated costs for '.concat(familyMember.name));

        // calculate randomly-generated costs for each family member
        RandCosts = chance.n(chance.normal, $scope.SimCount, {mean: 5500, dev: 1000, fixed: 2}) ;

        // and weight them by the SickRisk and CatRisk factors
        MemberCosts = RandCosts.map(function(_,i) {
          return (RandCosts[i] * familyMember.sickRisk ) +
          (RandCosts[i] * familyMember.catRisk ) +
          familyMember.visitBase;
        });
        console.log(MemberCosts);
        FamilyCosts.push({name: familyMember.name, costs: MemberCosts});
      }
    ); // end of loop through family members
    console.log('Finished calculating FamilyCosts object');

    // For now, reduce the array of member-specific costs into family costs.
    // For each i in SimCount, iterate across all the familyMember objects m in FamilyCosts
    // and assign the total to FamilyAnnualCosts[i]

    console.log('About to sum costs across family members');
    FamilyAnnualCosts = new Array($scope.SimCount);

    for(var s = 0; s < $scope.SimCount; s++) {
      var totalFamily = 0;
      // loop through all family members m,
      // get each member's cost for simulation index i
      for(var m = 0; m < FamilyCosts.length; m++) {
        totalFamily += FamilyCosts[m].costs[s];
      }
      FamilyAnnualCosts[s] = totalFamily;
    };
    console.log('Finished reducing FamilyCosts object into FamilyAnnualCosts');
    console.log(FamilyAnnualCosts);
    // split each simulated year's variable costs into pre- and post-deductible
    PlanCostsPreDeductible = FamilyAnnualCosts.map(function(cost) {
      return (cost > plan.deductibleFamily ) ? plan.deductibleFamily : cost;
    });
    console.log('PlanCostsPreDeductible:');
    console.log(PlanCostsPreDeductible);

    PlanCostsPostDeductible = FamilyAnnualCosts.map(function(cost) {
      return (cost > plan.deductibleFamily ) ? cost - plan.deductibleFamily : 0;
    });
    console.log('PlanCostsPostDeductible:');
    console.log(PlanCostsPostDeductible);

    // For each year, add:
    // the annual premium
    // the pre-deductible costs
    // the post-deductible cost
    PlanCostsGross = FamilyAnnualCosts.map(function(_,i) {
      return PlanCostsPreDeductible[i] + PlanCostsPostDeductible[i] + plan.premiumFamily;
    });

    // then truncate at the plan.maxOOPFamily value if the OOP max includes the deductible.
    PlanCostsNet = PlanCostsGross.map(function(cost) {
      return (cost > plan.maxOOPFamily ) ? plan.maxOOPFamily : cost;
    });

    console.log('After adding premium and capping at OOP maximum');
    console.log(PlanCostsNet);
    // 'this.' refers to the SimulatedYear object passed as an argument
    this.push({planname: plan.planName, costs: PlanCostsNet, costsPreDeductible: PlanCostsPreDeductible, costsPostDeductible: PlanCostsPostDeductible});
  }, SimulatedYear);

  // within each plan option, count the results by cost bin

return SimulatedYear ;
};  // end of simulateYear function

    $scope.SimulatedYear = $scope.simulateYear();



    $scope.getPlanCosts = function () {
      console.log('executing getPlanCosts()');
  //    console.log('SimulatedYear object:'.concat($scope.SimulatedYear));
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

  // A formatter for counts.
  var formatCount = d3.format(",.0f");

  $scope.simTickInterval = 10;
  $scope.freqlabels = Array.apply(0, Array($scope.SimCount)).map(function (x, y) {
    return (y + 1)% $scope.simTickInterval?'':(y + 1);
  });


//  $scope.series = ['Option A', 'Option B'];
  $scope.series = $scope.getPlanNames();

  $scope.costcurves =
    $scope.getPlanCosts();
  ;

  $scope.onClick = function (points, evt) {
    //
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
