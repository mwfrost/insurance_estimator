params <- read.csv('app_config.conf', stringsAsFactors=FALSE)
api.key <- params[params$Parameter=='API token',]$Value




fetch.policies <- function(state='VA', county = 'ALBEMARLE') {
  # Docs: https://data.healthcare.gov/developers/docs/qhp-landscape-individual-market-medical
  csvFile <- paste('https://data.healthcare.gov/resource/qhp-landscape-individual-market-medical.csv?state=',state,'&county=',county, '&$$app_token=',api.key, sep='')
  cat(csvFile)
  read.csv(text=getURL(csvFile), header=TRUE, stringsAsFactors=FALSE) 
  }

fetch.clean.policies <- function(state='VA', county = 'ALBEMARLE') {
  # Docs: https://data.healthcare.gov/developers/docs/qhp-landscape-individual-market-medical
  csvFile <- paste('https://data.healthcare.gov/resource/qhp-landscape-individual-market-medical.csv?state=',state,'&county=',county, '&$$app_token=',api.key, sep='')
  cat(csvFile)
  policies <- read.csv(text=getURL(csvFile), header=TRUE, stringsAsFactors=FALSE) 

  rename.list  <- data.frame( source.name = names(policies), new.name='', keep=TRUE)
  rownames(rename.list) <- rename.list$source.name
  # convert everything to lower case and remove multiple periods
  rename.list$new.name <- tolower(gsub('\\.+','.',rename.list$source.name))

  # Compress the premium column names
  rename.list$new.name <- gsub('premium.adult.individual.age.','prem.ind.',rename.list$new.name)
  rename.list$new.name <- gsub('premium.couple.','prem.cpl.',rename.list$new.name)

  # Field-by-field renaming. Verbose for clarity
  rename.list['Plan.ID...Standard.Component',                'new.name'] <- 'plan.id'
  rename.list['Plan.Marketing.Name',                         'new.name'] <- 'plan.name'
  rename.list['Medical.Deductible...individual...standard',  'new.name'] <- 'med.ded.indv' 
  rename.list['Medical.Deductible..family...standard',       'new.name'] <- 'med.ded.fam' 
  rename.list['Primary.Care.Physician....standard',          'new.name'] <- 'pcp.share'
  rename.list['Specialist....standard',                      'new.name'] <- 'spec.share'
  rename.list['Emergency.Room....standard',                  'new.name'] <- 'er.share'
  rename.list['Inpatient.Facility....standard',              'new.name'] <- 'hosp.fac.share'
  rename.list['Inpatient.Physician...standard',             'new.name'] <- 'hosp.doc.share'
  rename.list['Generic.Drugs...standard',                    'new.name'] <- 'gen.rx.share'
  rename.list['Non.preferred.Brand.Drugs...standard',        'new.name'] <- 'non.pref.rx.share'
  rename.list['Specialty.Drugs...standard',                  'new.name'] <- 'spec.rx.share'
  rename.list['Medical.Maximum.Out.Of.Pocket...individual...standard', 'new.name'] <- 'ind.oop.max'
  rename.list['Medical.Maximum.Out.of.Pocket...family...standard',     'new.name'] <- 'fam.oop.max'

  # Apply the new names
  names(policies) <- rename.list$new.name

  # The "MOC" and "MO" plans seem to have unusually high premiums
  # Compare:
  policies[grep('3750',policies$plan.name),]

  # Exclude them for now
  policies <- policies[grep('MO$|MOC$',policies$plan.name, invert=TRUE),]


  # Some of the columns containing dollar signs need to become numeric
  # There are tons of columns that won't convert directly
  # names(policies)[which(apply(policies, 2, function(x) any(grepl("\\$", x))))]

  # The dollar-only columns have to be individually selected
  dollar.cols <- names(policies)[grep('\\.ded\\.|\\.oop\\.|premium\\.child|prem\\.ind|prem\\.cpl', names(policies) )]

  dollar.to.number <- function(dollars){
    as.numeric(gsub('\\$','',dollars))
  }

  policies[,dollar.cols] <- sapply(policies[,dollar.cols], dollar.to.number)

  # grep the copay and coinsurance values out of the various fields
  percent.pattern <- '([0-9]{1,})%'
  price.pattern <- '\\$([0-9]{1,})'

  parse.percents <- function(target.text){
    as.numeric(gsub('\\%','' , regmatches(target.text, gregexpr(percent.pattern, target.text)) )) * 0.01
    }

  parse.prices <- function(target.text){ 
  as.numeric(gsub('\\$','' , regmatches(target.text, gregexpr(price.pattern, target.text)) ))
    }

  parse.prices(policies$pcp.share)
  parse.percents(policies$spec.share)

  copays <- sapply(policies[,grep('share',names(policies))], parse.prices)
  coinsurance <- sapply(policies[,grep('share',names(policies))], parse.percents)

  copays <- data.frame(copays)
  copays[is.na(copays)] <- 0
  coinsurance <- data.frame(coinsurance)
  coinsurance[is.na(coinsurance)] <- 0
  names(copays) <- gsub('share','copay',names(copays))
  names(coinsurance) <- gsub('share','coinsurance',names(coinsurance))

  policies <- cbind(
              policies,
              copays, 
              coinsurance)
  return(policies)
}


get.premium.column <- function(policies, insured){
 # choose the appropriate premium based on which family members are covered.
  # If only one member is selected, assume it's the insured person:
  print('inside get.premium.column')
  print( insured$Include)
  family.included <- insured$Include
  premium.column <- ifelse(sum(family.included, na.rm=TRUE)==1, 'prem.only.insured',
                      ifelse(sum(family.included, na.rm=TRUE)==2 & 
                               family.included[1] & 
                               family.included[2] , 
                             'prem.insured.plus.spouse',
                        ifelse(sum(family.included, na.rm=TRUE)>1 & !family.included[2],
                               'prem.insured.plus.children',
                          'prem.insured.plus.family'
                                 )
                                )
                              ) 
  premium.column
  return(premium.column)
}


calc.premiums.old <- function(policies, insured){
    prem.cols <- names(policies)[grep('prem\\.|premium\\.child',names(policies))]

    prems <- melt(policies[c('plan.id', prem.cols)], id='plan.id')
    prems$age <-  gsub('prem\\.ind\\.|prem\\.cpl\\.','', prems$variable)
    prems$age <- as.numeric(prems$age)
    prems[prems$variable=='premium.child','age'] <- 20
    prems$customer <- ifelse(grepl('cpl', prems$variable), 'Couple', 
                             ifelse(grepl('ind', prems$variable), 'Individual',
                             'Child')
                             )

    # Convert each "Child" record to an "Individual" record."
    prems$customer <- ifelse(prems$customer=='Child', 'Individual',prems$customer)
    prems <- arrange(prems, plan.id, customer, age)

    prems <- ddply(prems, .(plan.id,customer), function(x) {data.frame(
                                   age=approx(x$age, x$value, xout=seq(1,100), rule=2)$x,
                                   prem=approx(x$age, x$value, xout=seq(1,100), rule=2)$y
                                  )
                                })

    # TODO: fix this to use couples' rates where applicable
    # as of Jan 3, it's just calling everyone an individual

    # Join the insured data frame to the premium costs
    ind.prems <- merge(insured[,c('Age','Name')], subset(prems, customer=='Individual'), by.x='Age', by.y='age')
    # cap the premium after the third child by zeroing out the premium for every individual not in the first five family members
    ind.prems[!ind.prems$Name %in% insured$Name[1:5],'prem'] <- 0
    fam.prems <- ddply(ind.prems, .(plan.id), summarize, premium=sum(prem))
    print('calculated premiums')
    return(fam.prems)
}

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


calculate.family <- function(i.c.p, p, premium.column) {
  fam <- ddply(i.c.p, .(plan.id, cost.iteration) , function(x) {c(
          fam.costs = sum(x$visit.cost) + sum(x$sick.cost) +  sum(x$cat.cost)
          )
        }
        )
  fam <- merge(fam, 
               p ,
               by='plan.id'
               )
  print(names(fam))
  # Costs beneath the deductible are paid out of pocket
  fam$fam.sub.ded <-  ifelse( fam$ded.in.network.family < fam$fam.costs, 
                               fam$ded.in.network.family, 
                               fam$fam.costs
  )
  
  # How much of the gross costs exceed the deductible?
  fam$fam.post.ded <-  ifelse( fam$fam.costs > fam$ded.in.network.family, 
                               fam$fam.costs - fam$ded.in.network.family, 
                               0
                               )
  # Apply the coinsurance percentage to the post-deductible share of costs
  fam$fam.copay <- fam$fam.post.ded * (1 - fam$coinsurance.in.network)
  
  fam$annual.premium <- fam[,premium.column]
  fam$premium.plus.deductible <- fam$annual.premium + fam$ded.in.network.family
  
  # Net family cost is the premium + sub-deductible + post-deductible copays
  fam$fam.net <- fam$annual.premium + fam$fam.sub.ded + fam$fam.copay
  # The functional ceiling is the sum of the premiums and the out-of-pocket maximum
  fam$fam.net.max <- fam$oop.max.in.network.family + fam$annual.premium
  # Truncate the net costs at the functional ceiling 
  fam$fam.net.capped <- ifelse(fam$fam.net > fam$fam.net.max, fam$fam.net.max, fam$fam.net)
  
  fam
  
}


