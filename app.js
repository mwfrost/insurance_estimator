


angular.module("app", ["ui.grid", "ui.grid.edit","chart.js"]).controller("InsCtrl", function ($scope) {

    $scope.SimCount = 500;
    $scope.simTickInterval = 50;

    $scope.meanSickCost = 2000;
    $scope.sdevSickCost = 1000;
    $scope.catCost = 75000;

  //
  // Data Definition
  //

  // TODO: get plans from API source
    $scope.Plans = [
      {
        "planName": "Bronze Plan A" ,
        "premiumFamily": 1392,
        "deductibleFamily": 6000,
        "maxOOPFamily": 11900,
        "maxOOPFamilyIncludesPremium": false,
        "coinsurance": 0.3,
        "copay": 15
      },
      {
        "planName": "Bronze Plan B" ,
        "premiumFamily": 777,
        "deductibleFamily": 6000,
        "maxOOPFamily": 11900,
        "maxOOPFamilyIncludesPremium": false,
        "coinsurance": 0.3,
        "copay": 15
      },
      {
        "planName": "Bronze+ Plan" ,
        "premiumFamily": 2922,
        "deductibleFamily": 4500,
        "maxOOPFamily": 7150,
        "maxOOPFamilyIncludesPremium": false,
        "coinsurance": 0.3,
        "copay": 15
      },
      {
        "planName": "Silver Plan" ,
        "premiumFamily": 4296,
        "deductibleFamily": 3000,
        "maxOOPFamily": 7150,
        "maxOOPFamilyIncludesPremium": false,
        "coinsurance": 0.3,
        "copay": 15
      },
      {
        "planName": "Gold Plan" ,
        "premiumFamily": 9065,
        "deductibleFamily": 1200,
        "maxOOPFamily": 7000,
        "maxOOPFamilyIncludesPremium": false,
        "coinsurance": 0.3,
        "copay": 15
      }
    ];

    $scope.getPlanNames = function () {

      var planNames = [];
      angular.forEach($scope.Plans, function(plan){
        this.push(plan.planName);
      }, planNames);
        return planNames;
    };

    $scope.getIncludedFamilyMembers = function() {
      var includedMembers = [];
      angular.forEach($scope.FamilyProfile, function(member){
        if (member.include){
          this.push(member);
        }
      }, includedMembers);
        return includedMembers;
    }

    $scope.FamilyProfile = [          {
                      "name": "Insured" ,
                      "include": true,
                      "age": 40,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Spouse of Insured" ,
                      "include": true,
                      "age": 40,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 1" ,
                      "include": true,
                      "age": 17,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 2" ,
                      "include": true,
                      "age": 15,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 3" ,
                      "include": true,
                      "age": 13,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 4" ,
                      "include": true,
                      "age": 11,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 5" ,
                      "include": true,
                      "age": 9,
                      "visitBase": 150,
                      "sickRisk": 0.2,
                      "catRisk": 0.01
                    },
                    {
                      "name": "Child 6" ,
                      "include": false,
                      "age": 7,
                      "visitBase": 150,
                      "sickRisk": 0.2,
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

    // loop through each included family member and push() the
    // member's randomly-generated costs into the FamilyCosts object
    // for each family member
      angular.forEach($scope.getIncludedFamilyMembers(), function(familyMember){
        console.log('Calculating simulated costs for '.concat(familyMember.name));

        // calculate randomly-generated costs for each family member
        SickCosts = chance.n(chance.normal, $scope.SimCount, {
          mean: $scope.meanSickCost, dev: $scope.sdevSickCost, fixed: 2
        }) ;

        // weight the costs by the SickRisk and CatRisk factors
        MemberCosts = SickCosts.map(function(_,i) {
          // cost of sick visits is the sickRisk index multiplied by the SickCost
          // catastrophic costs are either catCost or zero,
          // with the catRisk index weighting the 1 probability
          return (SickCosts[i] * familyMember.sickRisk ) +
          (chance.weighted([$scope.catCost, 0], [familyMember.catRisk, 1- familyMember.catRisk]) ) +
          familyMember.visitBase;
        });
    //    console.log(MemberCosts);
        FamilyCosts.push({name: familyMember.name, costs: MemberCosts});
      }
    ); // end of loop through family members
  //  console.log('Finished calculating FamilyCosts object');

    // For now, reduce the array of member-specific costs into family costs.
    // For each i in SimCount, iterate across all the familyMember objects m in FamilyCosts
    // and assign the total to FamilyAnnualCosts[i]

  //  console.log('About to sum costs across family members');
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
//    console.log('Finished reducing FamilyCosts object into FamilyAnnualCosts');
//    console.log(FamilyAnnualCosts);
    // split each simulated year's variable costs into pre- and post-deductible
    PlanCostsPreDeductible = FamilyAnnualCosts.map(function(cost) {
      return (cost > plan.deductibleFamily ) ? plan.deductibleFamily : cost;
    });
//    console.log('PlanCostsPreDeductible:');
//    console.log(PlanCostsPreDeductible);

    PlanCostsPostDeductible = FamilyAnnualCosts.map(function(cost) {
      return (cost > plan.deductibleFamily ) ? cost - plan.deductibleFamily : 0;
    });
//    console.log('PlanCostsPostDeductible:');
//    console.log(PlanCostsPostDeductible);

    // For each year, add:
    // the annual premium
    // the pre-deductible costs
    // the post-deductible cost
      // truncate at the plan.maxOOPFamily value if the OOP max includes the premium.
    PlanCostsNet = FamilyAnnualCosts.map(function(_,i) {
      // console.log('truncating cost at out of pocket maximum');
      if(plan.maxOOPFamilyIncludesPremium){
        // console.log(
        //   'Comparing '.concat(plan.premiumFamily + PlanCostsPreDeductible[i] + PlanCostsPostDeductible[i]).concat(' to ').concat(plan.maxOOPFamily)
        // );
        cappedCost =
          ((plan.premiumFamily + PlanCostsPreDeductible[i] + (PlanCostsPostDeductible[i] * (1 - plan.coinsurance)) ) > plan.maxOOPFamily ) ?  plan.maxOOPFamily : plan.premiumFamily + PlanCostsPreDeductible[i] + (PlanCostsPostDeductible[i] * (1 - plan.coinsurance)) ;
        }
      else {
        // console.log(
        //   'Comparing '.concat(PlanCostsPreDeductible[i] + PlanCostsPostDeductible[i]).concat(' to ').concat(plan.maxOOPFamily)
        // );
        cappedCost =
          ((PlanCostsPreDeductible[i] + (PlanCostsPostDeductible[i] * (1 - plan.coinsurance))) > plan.maxOOPFamily ) ?  plan.maxOOPFamily : (PlanCostsPreDeductible[i] + (PlanCostsPostDeductible[i] * (1 - plan.coinsurance))) ;
        cappedCost = cappedCost + plan.premiumFamily;
      }
      // console.log(cappedCost);
      return cappedCost;
    });

  //  console.log('About to summarize costs');
      // calculate the median cost
      PlanCostsNet.sort(function(a, b) {
        return a - b;
      });
      lowMiddle = Math.floor((PlanCostsNet.length - 1) / 2);
      highMiddle = Math.ceil((PlanCostsNet.length - 1) / 2);
      median = (PlanCostsNet[lowMiddle] + PlanCostsNet[highMiddle]) / 2;
      max = PlanCostsNet[PlanCostsNet.length - 1] ;
      tailrisk = max - median;

    // 'this.' refers to the SimulatedYear object passed as an argument
    this.push({planname: plan.planName, costs: PlanCostsNet, costsPreDeductible: PlanCostsPreDeductible, costsPostDeductible: PlanCostsPostDeductible, medianCost: median, maxCost: max, tailRisk: tailrisk});
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
          enableSorting: false,
          columnDefs: [
            { name:'Name', field: 'name' },
            { name: 'include', displayName: 'Include?', type: 'boolean',cellTemplate: '<input type="checkbox" ng-model="row.entity.include">'},
            { name:'Age', field: 'age'},
            { name:'Visit Base', field: 'visitBase', cellFilter: 'currency'},
            { name:'Sick Risk' , field: 'sickRisk',cellFilter: 'number: 2'},
            { name:'Catastrophic Risk' , field:'catRisk',cellFilter: 'number: 2'}
          ],
          data : $scope.FamilyProfile
        };

$scope.gridPlanOptions = {
        enableSorting: false,
        columnDefs: [
          { name:'Plan Name', field: 'planName' },
          { name:'Premium', field: 'premiumFamily' , cellFilter: 'currency'},
          { name:'Deductible', field: 'deductibleFamily', cellFilter: 'currency'},
          { name:'Max OOP', field: 'maxOOPFamily', cellFilter: 'currency'}
          //,
          // { name: 'maxOOPFamilyIncludesPremium', displayName: 'OOP Max Includes Premium', type: 'boolean',cellTemplate: '<input type="checkbox" ng-model="row.entity.maxOOPFamilyIncludesPremium">'},
        //  { name: 'Coinsurance', field:'coinsurance',cellFilter: 'number: 2'},
        //  { name: 'Copay', field:'copay',cellFilter: 'currency'}
        ],
        data : $scope.Plans
      };

$scope.chartOptions =       {
          legend: {display: true}, pointDot: false, datasetFill: false
        };


$scope.$on('uiGridEventEndCellEdit', function (data) {

    $scope.FamilyProfile = $scope.gridFamilyOptions.data;
    $scope.Plans = $scope.gridPlanOptions.data;

    console.log('Recalculating after edit to family or plan');
    console.log('New FamilyProfile object');
    console.log($scope.FamilyProfile);
    console.log('New Plans object');
    console.log($scope.Plans);

    $scope.SimulatedYear = $scope.simulateYear();
    $scope.costcurves =
      $scope.getPlanCosts();
    ;
});


});
