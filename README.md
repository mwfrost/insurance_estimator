# Insurance Policy Comparison

Given a family profile and the characteristics of several insurance plans, iterate across _n_ randomly generated years of health events and estimate the net cost to the household. Hopefully a tool like this could allow households to choose their insurance plans with something approaching the degree of analytical clarity that insurance companies themselves enjoy. 

Additional data about national plans is available [here.](http://www.rwjf.org/en/research-publications/find-rwjf-research/2014/03/breakaway-policy-dataset.html)


To see the rendered source code and output, view the [output file `insurance_estimator.md`](https://github.com/mwfrost/insurance_estimator/blob/master/insurance_estimator.md)

TODO: 
- Pull plan attributes from data.healthcare.gov
- Account for individual-level deductibles and out-of-pocket limits
- Account for in-network and out-of-network spending
- Build in pharmacy costs
- Convert to a Sparkle app
- Convert to a legit web app

*Methodological note:* the analytical method proposed for this project is more complex and probably less robust than the one described [here](http://www.youtube.com/watch?v=ujPqaE6cVjQ).



