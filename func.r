




yearcosts <- function(i, n){
  visit.sd <- 30
  # Randomly generate a set of cost scenarios
  costs <- ddply(i, .(Name), function(x){
    data.frame(
      cost.iteration=seq(1:n),
      name = x$Name,
      visit.cost =  rnorm(n,  i$VisitBase, visit.sd ),
      sick.cost  =  rbinom(n, 1, i$SickRisk) * (rpois(1, 4 ) +1) * 100,
      cat.cost   =  rbinom(n, 1, i$CatRisk ) * (rpois(1, 10) +1) * 1000
    )
  }
  )
  costs
}

explode.scenarios <- function(c, p){
  policy.costs <- merge(c, p) # Deliberate cartesian explosion to get every combination of 
                              # insured person ~ policy option ~ cost scenario
  # policy.costs$after.deductible = totalcosts$visit.sum + totalcosts$sick.sum + totalcosts$cat.sum - x$deductible
  policy.costs
}


calculate.family <- function(i.c.p, p) {
  fam <- ddply(i.c.p, .(plan.id, cost.iteration) , function(x) {c(
          fam.costs = sum(x$visit.cost) + sum(x$sick.cost) +  sum(x$cat.cost)
          )
        }
        )
  fam <- merge(fam, 
               plans ,
               by='plan.id'
               )
  
  # Costs beneath the deductible are paid out of pocket
  fam$fam.sub.ded <-  ifelse( fam$med.ded.fam > fam$fam.costs, 
                               fam$med.ded.fam, 
                               fam$fam.costs
  )
  print(summary(fam$fam.sub.ded))
  
  # How much of the gross costs exceed the deductible?
  fam$fam.post.ded <-  ifelse( fam$fam.costs > fam$med.ded.fam, 
                               fam$fam.costs - fam$med.ded.fam, 
                               0
                               )
  # Apply the coinsurance percentage to the post-deductible share of costs
  fam$fam.copay <- fam$fam.post.ded * fam$pcp.coinsurance
  
  fam$annual.premium <- fam$premium * 12
  # Net family cost is the premium + sub-deductible + post-deductible copays
  fam$fam.net <- fam$annual.premium + fam$fam.sub.ded + fam$fam.copay
  # The functional ceiling is the sum of the premiums and the out-of-pocket maximum
  fam$fam.net.max <- fam$fam.oop.max + fam$annual.premium
  # Truncate the net costs at the functional ceiling 
  fam$fam.net.capped <- ifelse(fam$fam.net > fam$fam.net.max, fam$fam.net.max, fam$fam.net)
  
  fam
  
}

