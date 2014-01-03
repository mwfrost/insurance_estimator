Insurance Cost Estimator
========================================================


```r
require(knitr)
require(XML)
```

```
## Loading required package: XML
```

```r
require(plyr)
```

```
## Loading required package: plyr
```

```r
require(ggplot2)
```

```
## Loading required package: ggplot2
```

```r
require(RCurl)
```

```
## Loading required package: RCurl Loading required package: bitops
```

```r
require(stringr)
```

```
## Loading required package: stringr
```

```r
require(reshape)
```

```
## Loading required package: reshape
## 
## Attaching package: 'reshape'
## 
## The following objects are masked from 'package:plyr':
## 
## rename, round_any
```

```r
require(scales)
```

```
## Loading required package: scales
```

```r
# require(RSocrata)

source("func.r")
opts_chunk$set(warning = FALSE)
```



## Declare available policies

Policy attributes include a name, the individual deductible, the family deductible, the copay percentage (as the share paid by the insurer), the individual out-of-pocket maximum, the family out-of-pocket maximum, and the monthly premium.

Update, Dec 13, 2013: the available policies can be fetched from http://data.healthcare.gov instead of being fabricated.

Update: Jan 3, the healthcare.gov policy descriptions have age-based premium levels 

```r
params <- read.csv("app_config.conf", stringsAsFactors = FALSE)
api.key <- params[params$Parameter == "API token", ]$Value

state <- "VA"
county <- "ALBEMARLE"

fetch.policies <- function(state = "VA", county = "ALBEMARLE") {
    # Docs:
    # https://data.healthcare.gov/developers/docs/qhp-landscape-individual-market-medical
    csvFile <- paste("https://data.healthcare.gov/resource/qhp-landscape-individual-market-medical.csv?state=", 
        state, "&county=", county, "&$$app_token=", api.key, sep = "")
    cat(csvFile)
    read.csv(text = getURL(csvFile), header = TRUE, stringsAsFactors = FALSE)
}

policies <- fetch.policies("VA", "ALBEMARLE")
```

```
## https://data.healthcare.gov/resource/qhp-landscape-individual-market-medical.csv?state=VA&county=ALBEMARLE&$$app_token=YzEJ9NP3ecKDCZwQ5rDWzxfoG
```

```r

# Example policy:
t(policies[policies$Plan.Marketing.Name == "Bronze Deductible Only POS Plan", 
    ])
```

```
##                                                         15                                         
## State                                                   "VA"                                       
## County                                                  "ALBEMARLE"                                
## Metal.Level                                             "Bronze"                                   
## Issuer.Name                                             "Coventry Health Care of Virginia, Inc."   
## Plan.ID...Standard.Component                            "99663VA0140004"                           
## Plan.Marketing.Name                                     "Bronze Deductible Only POS Plan"          
## Plan.Type                                               "POS"                                      
## Rating.Area                                             "Rating Area 2"                            
## Child.Only.Offering                                     "Allows Adult and Child-Only"              
## Source                                                  "SERFF"                                    
## Customer.Service.Phone.Number.Local                     "1-804-747-3700"                           
## Customer.Service.Phone.Number.Toll.Free                 "1-855-449-2889"                           
## Customer.Service.Phone.Number.TTY                       ""                                         
## Network.URL                                             "http://va.coventryproviders.com"          
## Plan.Brochure.URL                                       "http://www.coventryone.com/posva"         
## Summary.of.Benefits.URL                                 "http://www.coventryhealthcare.com/VA73201"
## Drug.Formulary.URL                                      "http://www.c1formularyhix.com"            
## Adult.Dental                                            NA                                         
## Child.Dental                                            ""                                         
## Premium.Scenarios                                       NA                                         
## Premium.Child                                           "$96.72"                                   
## Premium.Adult.Individual.Age.21                         "$152.31"                                  
## Premium.Adult.Individual.Age.27                         "$159.62"                                  
## Premium.Adult.Individual.Age.30                         "$172.87"                                  
## Premium.Adult.Individual.Age.40                         "$194.65"                                  
## Premium.Adult.Individual.Age.50                         "$272.02"                                  
## Premium.Adult.Individual.Age.60                         "$413.36"                                  
## Premium.Couple.21                                       "$304.62"                                  
## Premium.Couple.30                                       "$345.74"                                  
## Premium.Couple.40                                       "$389.30"                                  
## Premium.Couple.50                                       "$544.04"                                  
## Premium.Couple.60                                       "$826.72"                                  
## Couple.1.child..Age.21                                  "$401.34"                                  
## Couple.1.child..Age.30                                  "$442.46"                                  
## Couple.1.child..Age.40                                  "$486.02"                                  
## Couple.1.child..Age.50                                  "$640.76"                                  
## Couple.2.children..Age.21                               "$498.06"                                  
## Couple.2.children..Age.30                               "$539.18"                                  
## Couple.2.children..Age.40                               "$582.74"                                  
## Couple.2.children..Age.50                               "$737.48"                                  
## Couple.3.or.more.Children..Age.21                       "$594.78"                                  
## Couple.3.or.more.Children..Age.30                       "$635.90"                                  
## Couple.3.or.more.Children..Age.40                       "$679.46"                                  
## Couple.3.or.more.Children..Age.50                       "$834.19"                                  
## Individual.1.child..Age.21                              "$249.03"                                  
## Individual.1.child..Age.30                              "$269.59"                                  
## Individual.1.child..Age.40                              "$291.37"                                  
## Individual.1.child..Age.50                              "$368.74"                                  
## Individual.2.children..Age.21                           "$345.75"                                  
## Individual.2.children..Age.30                           "$366.31"                                  
## Individual.2.children..Age.40                           "$388.09"                                  
## Individual.2.children..Age.50                           "$465.46"                                  
## Individual.3.or.more.children..Age.21                   "$442.46"                                  
## Individual.3.or.more.children..Age.30                   "$463.03"                                  
## Individual.3.or.more.children..Age.40                   "$484.80"                                  
## Individual.3.or.more.children..Age.50                   "$562.17"                                  
## Standard.Plan.Cost.Sharing                              NA                                         
## Medical.Deductible...individual...standard              "$6300.00"                                 
## Drug.Deductible...individual...standard                 "Included in Medical"                      
## Medical.Deductible..family...standard                   "$12600.00"                                
## Drug.Deductible...family...standard                     "Included in Medical"                      
## Medical.Maximum.Out.Of.Pocket...individual...standard   "$6300.00"                                 
## Drug.Maximum.Out.of.Pocket...individual...standard      "Included in Medical"                      
## Medical.Maximum.Out.of.Pocket...family...standard       "$12600.00"                                
## Drug.Maximum.Out.of.Pocket...Family....standard         "Included in Medical"                      
## Primary.Care.Physician....standard                      "No Charge after Deductible"               
## Specialist....standard                                  "No Charge after Deductible"               
## Emergency.Room....standard                              "No Charge after Deductible"               
## Inpatient.Facility....standard                          "No Charge after Deductible"               
## Inpatient.Physician...standard                          "No Charge after Deductible"               
## Generic.Drugs...standard                                "No Charge after Deductible"               
## Preferred.Brand.Drugs...standard                        "No Charge after Deductible"               
## Non.preferred.Brand.Drugs...standard                    "No Charge after Deductible"               
## Specialty.Drugs...standard                              "No Charge after Deductible"               
## X73.Percent.Actuarial.Value.Silver.Plan.Cost.Sharing    NA                                         
## Medical.Deductible...individual...73.percent            ""                                         
## Drug.Deductible...individual...73.percent               ""                                         
## Medical.Deductible...family...73.percent                ""                                         
## Drug.Deductible...family...73.percent                   ""                                         
## Medical.Maximum.Out.Of.Pocket...individual...73.percent ""                                         
## Drug.Maximum.Out.of.Pocket...individual...73.percent    ""                                         
## Medical.Maximum.Out.of.Pocket...family...73.percent     ""                                         
## Drug.Maximum.Out.of.Pocket...Family...73.percent        ""                                         
## Primary.Care.Physician...73.percent                     ""                                         
## Specialist...73.percent                                 ""                                         
## Emergency.Room...73.percent                             ""                                         
## Inpatient.Facility...73.percent                         ""                                         
## Inpatient.Physician...73.percent                        ""                                         
## Generic.Drugs...73.percent                              ""                                         
## Preferred.Brand.Drugs...73.percent                      ""                                         
## Non.preferred.Brand.Drugs...73.percent                  ""                                         
## Specialty.Drugs...73.percent                            ""                                         
## X87.Percent.Actuarial.Value.Silver.Plan.Cost.Sharing    NA                                         
## Medical.Deductible...individual...87.percent            ""                                         
## Drug.Deductible...individual...87.percent               ""                                         
## Medical.Deductible...family...87.percent                ""                                         
## Drug.Deductible...family...87.percent                   ""                                         
## Medical.Maximum.Out.Of.Pocket...individual...87.percent ""                                         
## Drug.Maximum.Out.of.Pocket...individual...87.percent    ""                                         
## Medical.Maximum.Out.of.Pocket...family...87.percent     ""                                         
## Drug.Maximum.Out.of.Pocket...Family...87.percent        ""                                         
## Primary.Care.Physician...87.percent                     ""                                         
## Specialist...87.percent                                 ""                                         
## Emergency.Room...87.percent                             ""                                         
## Inpatient.Facility...87.percent                         ""                                         
## Inpatient.Physician...87.percent                        ""                                         
## Generic.Drugs...87.percent                              ""                                         
## Preferred.Brand.Drugs...87.percent                      ""                                         
## Non.preferred.Brand.Drugs...87.percent                  ""                                         
## Specialty.Drugs...87.percent                            ""                                         
## X94.Percent.Actuarial.Value.Silver.Plan.Cost.Sharing    NA                                         
## Medical.Deductible...individual...94.percent            ""                                         
## Drug.Deductible...individual...94.percent               ""                                         
## Medical.Deductible...family...94.percent                ""                                         
## Drug.Deductible...family...94.percent                   ""                                         
## Medical.Maximum.Out.Of.Pocket..individual...94.percent  ""                                         
## Drug.Maximum.Out.of.Pocket...individual...94.percent    ""                                         
## Medical.Maximum.Out.of.Pocket...family...94.percent     ""                                         
## Drug.Maximum.Out.of.Pocket...Family....94.percent       ""                                         
## Primary.Care.Physician...94.percent                     ""                                         
## Specialist...94.percent                                 ""                                         
## Emergency.Room...94.percent                             ""                                         
## Inpatient.Facility....94.percent                        ""                                         
## Inpatient.Physician....94.percent                       ""                                         
## Generic.Drugs...94.percent                              ""                                         
## Preferred.Brand.Drugs...94.percent                      ""                                         
## Non.preferred.Brand.Drugs...94.percent                  ""                                         
## Specialty.Drugs...94.percent                            ""
```

```r

# Rename the fields
rename.list <- data.frame(source.name = names(policies), new.name = "", keep = TRUE)
rownames(rename.list) <- rename.list$source.name
# convert everything to lower case and remove multiple periods
rename.list$new.name <- tolower(gsub("\\.+", ".", rename.list$source.name))

# Compress the premium column names
rename.list$new.name <- gsub("premium.adult.individual.age.", "prem.ind.", rename.list$new.name)
rename.list$new.name <- gsub("premium.couple.", "prem.cpl.", rename.list$new.name)

# Field-by-field renaming. Verbose for clarity
rename.list["Plan.ID...Standard.Component", "new.name"] <- "plan.id"
rename.list["Plan.Marketing.Name", "new.name"] <- "plan.name"
rename.list["Medical.Deductible...individual...standard", "new.name"] <- "med.ded.indv"
rename.list["Medical.Deductible..family...standard", "new.name"] <- "med.ded.fam"
rename.list["Primary.Care.Physician....standard", "new.name"] <- "pcp.share"
rename.list["Specialist....standard", "new.name"] <- "spec.share"
rename.list["Emergency.Room....standard", "new.name"] <- "er.share"
rename.list["Inpatient.Facility....standard", "new.name"] <- "hosp.fac.share"
rename.list["Inpatient.Physician...standard", "new.name"] <- "hosp.doc.share"
rename.list["Generic.Drugs...standard", "new.name"] <- "gen.rx.share"
rename.list["Non.preferred.Brand.Drugs...standard", "new.name"] <- "non.pref.rx.share"
rename.list["Specialty.Drugs...standard", "new.name"] <- "spec.rx.share"
rename.list["Medical.Maximum.Out.Of.Pocket...individual...standard", "new.name"] <- "ind.oop.max"
rename.list["Medical.Maximum.Out.of.Pocket...family...standard", "new.name"] <- "fam.oop.max"

# Apply the new names
names(policies) <- rename.list$new.name

# Some of the columns containing dollar signs need to become numeric There
# are tons of columns that won't convert directly
# names(policies)[which(apply(policies, 2, function(x) any(grepl('\\$',
# x))))]

# The dollar-only columns have to be individually selected
dollar.cols <- names(policies)[grep("\\.ded\\.|\\.oop\\.|premium\\.child|prem\\.ind|prem\\.cpl", 
    names(policies))]

dollar.to.number <- function(dollars) {
    as.numeric(gsub("\\$", "", dollars))
}

policies[, dollar.cols] <- sapply(policies[, dollar.cols], dollar.to.number)

# grep the copay and coinsurance values out of the various fields
percent.pattern <- "([0-9]{1,})%"
price.pattern <- "\\$([0-9]{1,})"

parse.percents <- function(target.text) {
    as.numeric(gsub("\\%", "", regmatches(target.text, gregexpr(percent.pattern, 
        target.text)))) * 0.01
}

parse.prices <- function(target.text) {
    as.numeric(gsub("\\$", "", regmatches(target.text, gregexpr(price.pattern, 
        target.text))))
}

parse.prices(policies$pcp.share)
```

```
##  [1] NA NA NA NA NA NA 25 25 40 NA 35 NA 35 10 NA 10 NA 50 50 40 20 20 25
## [24] 25 30 30 30  5  5 25 25 45 35 35 35 35 10 10
```

```r
parse.percents(policies$spec.share)
```

```
##  [1] 0.30 0.20 0.10 0.30 0.20 0.10 0.40 0.40 0.25 0.15 0.35 0.25 0.35   NA
## [15]   NA   NA   NA   NA   NA   NA   NA   NA 0.10 0.10 0.20 0.20 0.20   NA
## [29]   NA 0.20 0.20 0.15 0.20 0.20 0.30 0.30   NA   NA
```

```r

copays <- sapply(policies[, grep("share", names(policies))], parse.prices)
coinsurance <- sapply(policies[, grep("share", names(policies))], parse.percents)

copays <- data.frame(copays)
copays[is.na(copays)] <- 0
coinsurance <- data.frame(coinsurance)
coinsurance[is.na(coinsurance)] <- 0
names(copays) <- gsub("share", "copay", names(copays))
names(coinsurance) <- gsub("share", "coinsurance", names(coinsurance))

policies <- cbind(policies, copays, coinsurance)
```


The following dummy policies were created for a previous version

```r

old.policies <- rbind(data.frame(plan.name = "2014 CIGNA Choice Fund with HSA", 
    med.ded.indv = 1500, med.ded.fam = 3000, copay.pct = 0.8, ind.oop.max = 3000, 
    fam.oop.max = 6000, premium = (186.75 * 2)), data.frame(plan.name = "2014 CIGNA OAP (PPO) Standard Plan", 
    med.ded.indv = 600, med.ded.fam = 1200, copay.pct = 0.8, ind.oop.max = 3000, 
    fam.oop.max = 6000, premium = (236.67 * 2)), data.frame(plan.name = "2013 CIGNA OAP (PPO) Gold Plan", 
    med.ded.indv = 600, med.ded.fam = 1200, copay.pct = 0.8, ind.oop.max = 2400, 
    fam.oop.max = 4800, premium = (166.67 * 2)))
old.policies$plan.id <- row.names(old.policies)

old.policies
```

```
##                            plan.name med.ded.indv med.ded.fam copay.pct
## 1    2014 CIGNA Choice Fund with HSA         1500        3000       0.8
## 2 2014 CIGNA OAP (PPO) Standard Plan          600        1200       0.8
## 3     2013 CIGNA OAP (PPO) Gold Plan          600        1200       0.8
##   ind.oop.max fam.oop.max premium plan.id
## 1        3000        6000   373.5       1
## 2        3000        6000   473.3       2
## 3        2400        4800   333.3       3
```


## Declare family members

Each family member has a name, an age, a baseline cost for doctor's visits, a risk of incurring sickness-related expenses, and a risk of catastrophic injury or illness. 

The risk factors are probabilities passed to a binomial distribution. If the result is 1, a Poisson distribution is used to estimate costs. 

In the following sample family, Parent A visits the doctor less than Parent A, and the children are more likely to get sick. Everyone has a 1% chance of catastrophic sickness or injury.

TODO: all the risk factors should correspond to the plans' different deductible, copay, and coinsurance attributes.


```r
insured <- rbind(data.frame(Name = "Parent A", Age = 40, VisitBase = 150, SickRisk = 0.1, 
    CatRisk = 0.01), data.frame(Name = "Parent B", Age = 40, VisitBase = 500, 
    SickRisk = 0.2, CatRisk = 0.01), data.frame(Name = "Child C", Age = 5, VisitBase = 250, 
    SickRisk = 0.4, CatRisk = 0.01), data.frame(Name = "Child D", Age = 7, VisitBase = 250, 
    SickRisk = 0.4, CatRisk = 0.01), data.frame(Name = "Child E", Age = 9, VisitBase = 250, 
    SickRisk = 0.4, CatRisk = 0.01), data.frame(Name = "Child F", Age = 13, 
    VisitBase = 250, SickRisk = 0.4, CatRisk = 0.01), data.frame(Name = "Child G", 
    Age = 15, VisitBase = 250, SickRisk = 0.4, CatRisk = 0.01))
```


## Based on the family attributes, calculate a total family premium for each policy


```r
prem.cols <- names(policies)[grep("prem\\.|premium\\.child", names(policies))]

prems <- melt(policies[c("plan.id", prem.cols)], id = "plan.id")
prems$age <- gsub("prem\\.ind\\.|prem\\.cpl\\.", "", prems$variable)
prems$age <- as.numeric(prems$age)
prems[prems$variable == "premium.child", "age"] <- 20
prems$customer <- ifelse(grepl("cpl", prems$variable), "Couple", ifelse(grepl("ind", 
    prems$variable), "Individual", "Child"))

# A test case
ages <- subset(prems, plan.id == "20507VA1170001" & customer == "Individual")$age
premiums <- subset(prems, plan.id == "20507VA1170001" & customer == "Individual")$value
all.ages <- seq(1, 100)
test.approx <- approx(ages, premiums, xout = all.ages, rule = 2)
test.prems <- data.frame(ages = test.approx$x, prems = test.approx$y)

# This can't be extended to all the categories, since children only have one
# record.  Convert each 'Child' record to an 'Individual' record.'
prems$customer <- ifelse(prems$customer == "Child", "Individual", prems$customer)
prems <- arrange(prems, plan.id, customer, age)

prems <- ddply(prems, .(plan.id, customer), function(x) {
    data.frame(age = approx(x$age, x$value, xout = seq(1, 100), rule = 2)$x, 
        prem = approx(x$age, x$value, xout = seq(1, 100), rule = 2)$y)
})
# subset(prems, plan.id=='20507VA1170001') subset(policies,
# plan.id=='20507VA1170001')

# TODO: fix this to use couples' rates where applicable, and to cap premium
# at two children.  as of Jan 3, it's just calling everyone an individual

# Join the insured data frame to the premium costs
ind.prems <- merge(insured[, c("Age", "Name")], subset(prems, customer == "Individual"), 
    by.x = "Age", by.y = "age")
fam.prems <- ddply(ind.prems, .(plan.id), summarize, premium = sum(prem))
```


Reduce the `policies` data frame to only include relevant columns, call the result `plans`


```r
plans <- policies[, c("plan.id", "plan.name", "med.ded.indv", "med.ded.fam", 
    "ind.oop.max", "fam.oop.max", names(policies)[grep("copay", names(policies))], 
    names(policies)[grep("coinsurance", names(policies))])]
plans <- merge(plans, fam.prems)
```



## Run _n_ iterations of the family's possible years with each plan


```r
n <- 500
costs <- yearcosts(insured, n)
subset(costs, cost.iteration == 1)
```

```
##          Name cost.iteration     name visit.cost sick.cost cat.cost
## 1    Parent A              1 Parent A     180.71         0        0
## 501  Parent B              1 Parent B     134.88         0        0
## 1001  Child C              1  Child C     155.86         0        0
## 1501  Child D              1  Child D     140.87         0        0
## 2001  Child E              1  Child E     137.22         0    13000
## 2501  Child F              1  Child F     166.96         0        0
## 3001  Child G              1  Child G      84.55         0        0
```

```r
# The `scenarios` are unique combinations of each policy, family member, and
# iteration year
scenarios <- explode.scenarios(costs, plans)
head(scenarios)
```

```
##       Name cost.iteration     name visit.cost sick.cost cat.cost
## 1 Parent A              1 Parent A      180.7         0        0
## 2 Parent A              2 Parent A      592.9         0        0
## 3 Parent A              3 Parent A      271.5         0        0
## 4 Parent A              4 Parent A      286.9       500        0
## 5 Parent A              5 Parent A      241.1       500        0
## 6 Parent A              6 Parent A      265.1         0        0
##          plan.id              plan.name med.ded.indv med.ded.fam
## 1 20507VA1170001 Vantage FourSight 1000         1000        2000
## 2 20507VA1170001 Vantage FourSight 1000         1000        2000
## 3 20507VA1170001 Vantage FourSight 1000         1000        2000
## 4 20507VA1170001 Vantage FourSight 1000         1000        2000
## 5 20507VA1170001 Vantage FourSight 1000         1000        2000
## 6 20507VA1170001 Vantage FourSight 1000         1000        2000
##   ind.oop.max fam.oop.max pcp.copay spec.copay er.copay hosp.fac.copay
## 1        6250       12500        25         25        0              0
## 2        6250       12500        25         25        0              0
## 3        6250       12500        25         25        0              0
## 4        6250       12500        25         25        0              0
## 5        6250       12500        25         25        0              0
## 6        6250       12500        25         25        0              0
##   hosp.doc.copay gen.rx.copay non.pref.rx.copay spec.rx.copay
## 1              0           15                50            50
## 2              0           15                50            50
## 3              0           15                50            50
## 4              0           15                50            50
## 5              0           15                50            50
## 6              0           15                50            50
##   pcp.coinsurance spec.coinsurance er.coinsurance hosp.fac.coinsurance
## 1             0.1              0.1            0.1                  0.1
## 2             0.1              0.1            0.1                  0.1
## 3             0.1              0.1            0.1                  0.1
## 4             0.1              0.1            0.1                  0.1
## 5             0.1              0.1            0.1                  0.1
## 6             0.1              0.1            0.1                  0.1
##   hosp.doc.coinsurance gen.rx.coinsurance non.pref.rx.coinsurance
## 1                  0.1                  0                       0
## 2                  0.1                  0                       0
## 3                  0.1                  0                       0
## 4                  0.1                  0                       0
## 5                  0.1                  0                       0
## 6                  0.1                  0                       0
##   spec.rx.coinsurance premium
## 1                   0    1826
## 2                   0    1826
## 3                   0    1826
## 4                   0    1826
## 5                   0    1826
## 6                   0    1826
```

```r
str(scenarios)
```

```
## 'data.frame':	133000 obs. of  29 variables:
##  $ Name                   : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ cost.iteration         : int  1 2 3 4 5 6 7 8 9 10 ...
##  $ name                   : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ visit.cost             : num  181 593 272 287 241 ...
##  $ sick.cost              : num  0 0 0 500 500 0 0 0 0 500 ...
##  $ cat.cost               : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ plan.id                : chr  "20507VA1170001" "20507VA1170001" "20507VA1170001" "20507VA1170001" ...
##  $ plan.name              : chr  "Vantage FourSight 1000" "Vantage FourSight 1000" "Vantage FourSight 1000" "Vantage FourSight 1000" ...
##  $ med.ded.indv           : num  1000 1000 1000 1000 1000 1000 1000 1000 1000 1000 ...
##  $ med.ded.fam            : num  2000 2000 2000 2000 2000 2000 2000 2000 2000 2000 ...
##  $ ind.oop.max            : num  6250 6250 6250 6250 6250 6250 6250 6250 6250 6250 ...
##  $ fam.oop.max            : num  12500 12500 12500 12500 12500 12500 12500 12500 12500 12500 ...
##  $ pcp.copay              : num  25 25 25 25 25 25 25 25 25 25 ...
##  $ spec.copay             : num  25 25 25 25 25 25 25 25 25 25 ...
##  $ er.copay               : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ hosp.fac.copay         : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ hosp.doc.copay         : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ gen.rx.copay           : num  15 15 15 15 15 15 15 15 15 15 ...
##  $ non.pref.rx.copay      : num  50 50 50 50 50 50 50 50 50 50 ...
##  $ spec.rx.copay          : num  50 50 50 50 50 50 50 50 50 50 ...
##  $ pcp.coinsurance        : num  0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 ...
##  $ spec.coinsurance       : num  0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 ...
##  $ er.coinsurance         : num  0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 ...
##  $ hosp.fac.coinsurance   : num  0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 ...
##  $ hosp.doc.coinsurance   : num  0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 ...
##  $ gen.rx.coinsurance     : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ non.pref.rx.coinsurance: num  0 0 0 0 0 0 0 0 0 0 ...
##  $ spec.rx.coinsurance    : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ premium                : num  1826 1826 1826 1826 1826 ...
```

```r
# subset(scenarios, cost.iteration == 1)

# the calculate_family() function aggregates the scenarios to the family
# level
results <- calculate.family(scenarios, plans)
head(results)
```

```
##          plan.id cost.iteration fam.costs              plan.name
## 1 20507VA1170001              1     14001 Vantage FourSight 1000
## 2 20507VA1170001              2      4049 Vantage FourSight 1000
## 3 20507VA1170001              3      2975 Vantage FourSight 1000
## 4 20507VA1170001              4      2908 Vantage FourSight 1000
## 5 20507VA1170001              5      4496 Vantage FourSight 1000
## 6 20507VA1170001              6      3405 Vantage FourSight 1000
##   med.ded.indv med.ded.fam ind.oop.max fam.oop.max pcp.copay spec.copay
## 1         1000        2000        6250       12500        25         25
## 2         1000        2000        6250       12500        25         25
## 3         1000        2000        6250       12500        25         25
## 4         1000        2000        6250       12500        25         25
## 5         1000        2000        6250       12500        25         25
## 6         1000        2000        6250       12500        25         25
##   er.copay hosp.fac.copay hosp.doc.copay gen.rx.copay non.pref.rx.copay
## 1        0              0              0           15                50
## 2        0              0              0           15                50
## 3        0              0              0           15                50
## 4        0              0              0           15                50
## 5        0              0              0           15                50
## 6        0              0              0           15                50
##   spec.rx.copay pcp.coinsurance spec.coinsurance er.coinsurance
## 1            50             0.1              0.1            0.1
## 2            50             0.1              0.1            0.1
## 3            50             0.1              0.1            0.1
## 4            50             0.1              0.1            0.1
## 5            50             0.1              0.1            0.1
## 6            50             0.1              0.1            0.1
##   hosp.fac.coinsurance hosp.doc.coinsurance gen.rx.coinsurance
## 1                  0.1                  0.1                  0
## 2                  0.1                  0.1                  0
## 3                  0.1                  0.1                  0
## 4                  0.1                  0.1                  0
## 5                  0.1                  0.1                  0
## 6                  0.1                  0.1                  0
##   non.pref.rx.coinsurance spec.rx.coinsurance premium fam.sub.ded
## 1                       0                   0    1826       14001
## 2                       0                   0    1826        4049
## 3                       0                   0    1826        2975
## 4                       0                   0    1826        2908
## 5                       0                   0    1826        4496
## 6                       0                   0    1826        3405
##   fam.post.ded fam.copay annual.premium fam.net fam.net.max fam.net.capped
## 1      12001.0   1200.10          21912   37113       34412          34412
## 2       2049.1    204.91          21912   26166       34412          26166
## 3        975.3     97.53          21912   24985       34412          24985
## 4        908.0     90.80          21912   24911       34412          24911
## 5       2495.6    249.56          21912   26657       34412          26657
## 6       1405.0    140.50          21912   25457       34412          25457
```



Measure the probability densities of the results, by policy. Assign some tail boundaries of interest for later graphing.



```r
tail.limit.left <- 0.333
tail.limit.right <- 0.666
dxy <- ddply(results, .(plan.name), summarize, dx = density(fam.net.capped)$x, 
    dy = density(fam.net.capped)$y)
dxy <- ddply(dxy, .(plan.name), transform, qleft = quantile(dx, tail.limit.left), 
    qright = quantile(dx, tail.limit.right))
dxy$ytail <- ifelse(dxy$dx <= dxy$qleft | dxy$dx >= dxy$qright, dxy$dy, 0)
```


## Plot the outcomes

Create some range spans so the x axis on each graph can show how much of the net costs are composed of premiums (orange box), deductible costs paid at 100% (yellow box), and post-deductible copays (the amount between the yellow box and the total cost).


```r
ranges <- merge(plans, fam.prems)
# annualize the monthly premium
ranges$premium <- ranges$premium * 12
# Calculate the premium + deductible out-of-pocket baseline
ranges$dedplusprem <- ranges$med.ded.fam + ranges$premium
dummyranges <- ranges
dummyranges$dedplusprem <- dummyranges$premium
dummyranges$premium <- 0
ranges <- rbind(dummyranges, ranges)
```


Plot the ranges behind the distribution graphs.


```r
p.dist <- ggplot(results, aes(x = fam.net.capped)) + geom_histogram(aes(y = ..density..), 
    binwidth = density(results$fam.net.capped)$bw) + geom_area(data = ranges, 
    aes(x = premium, y = 0.0015), fill = "orange", alpha = 0.5) + geom_area(data = ranges, 
    aes(x = dedplusprem, y = 0.0015), fill = "yellow", alpha = 0.5) + geom_area(data = dxy, 
    aes(x = dx, y = ytail), fill = "green", colour = NA, alpha = 0.5) + geom_vline(aes(xintercept = fam.net.max), 
    color = "red") + geom_density(color = "blue") + facet_wrap(~plan.name, ncol = 1) + 
    scale_y_continuous(limits = c(0, 0.002)) + scale_x_continuous("Net family costs", 
    limits = c(0, 30000), labels = dollar)

ggsave(filename = "distribution.png", width = 6, height = 36)
```


<img src="distribution.png" alt="Distribution curves" style="width: 200px;"/>

### Five-Number Summaries instead of graphs


```r

cost.summary <- ddply(results, .(plan.id, plan.name), function(x) summary(x$fam.net.capped))
cost.summary <- arrange(cost.summary, Median)
cost.summary
```

```
##           plan.id
## 1  88380VA0720009
## 2  88380VA0880001
## 3  88380VA0720008
## 4  88380VA0720004
## 5  88380VA0720007
## 6  99663VA0140001
## 7  99663VA0140005
## 8  88380VA0720010
## 9  88380VA0720003
## 10 88380VA0720006
## 11 88380VA0720011
## 12 88380VA0880002
## 13 88380VA0720005
## 14 88380VA0720001
## 15 88380VA0720012
## 16 99663VA0140002
## 17 88380VA0720002
## 18 99663VA0140003
## 19 99663VA0140004
## 20 20507VA1190001
## 21 20507VA1180001
## 22 20507VA1180002
## 23 20507VA1170002
## 24 20507VA1180003
## 25 20507VA1170001
## 26 20507VA1190002
## 27 99663VA0140016
## 28 99663VA0140015
## 29 99663VA0140014
## 30 99663VA0140013
## 31 99663VA0140012
## 32 20507VA1180004
## 33 20507VA1190003
## 34 20507VA1170004
## 35 20507VA1180005
## 36 20507VA1180006
## 37 20507VA1170003
## 38 20507VA1190004
##                                                                                  plan.name
## 1                                          Anthem HealthKeepers Silver DirectAccess - cbky
## 2  Anthem Blue Cross and Blue Shield HealthKeepers Silver DirectAccess, a Multi-State Plan
## 3                                          Anthem HealthKeepers Silver DirectAccess - cbjs
## 4                                    Anthem HealthKeepers Bronze DirectAccess w/HSA - cacd
## 5                                          Anthem HealthKeepers Silver DirectAccess - cbfs
## 6                                                                   Gold $5 Copay POS Plan
## 7                                                               Catastrophic 100% POS Plan
## 8                                            Anthem HealthKeepers Gold DirectAccess - ccam
## 9                                          Anthem HealthKeepers Bronze DirectAccess - cabw
## 10                                         Anthem HealthKeepers Silver DirectAccess - cbau
## 11                            Anthem HealthKeepers Gold DirectAccess w/Child Dental - cdda
## 12   Anthem Blue Cross and Blue Shield HealthKeepers Gold DirectAccess, a Multi-State Plan
## 13                          Anthem HealthKeepers Bronze DirectAccess w/Child Dental - cdbw
## 14                                         Anthem HealthKeepers Bronze DirectAccess - caam
## 15                                          Anthem HealthKeepers Catastrophic DirectAccess
## 16                                                                    Silver $10 Copay POS
## 17                                   Anthem HealthKeepers Bronze DirectAccess w/HSA - caas
## 18                                                               Bronze $10 Copay POS Plan
## 19                                                         Bronze Deductible Only POS Plan
## 20                                                                        Vantage 3500 60%
## 21                                                                     Vantage Equity 3750
## 22                                                                     Vantage Equity 4250
## 23                                                              Vantage FourSight 3500 80%
## 24                                                                     Vantage Equity 4750
## 25                                                                  Vantage FourSight 1000
## 26                                                                            Vantage 6350
## 27                                                          Catastrophic 100% POS Plan-MOC
## 28                                                     Bronze Deductible Only POS Plan-MOC
## 29                                                           Bronze $10 Copay POS Plan-MOC
## 30                                                                Silver $10 Copay POS-MOC
## 31                                                              Gold $5 Copay POS Plan-MOC
## 32                                                                  Vantage Equity 3750_MO
## 33                                                                     Vantage 3500_60%_MO
## 34                                                         Vantage FourSight \n3500 80%_MO
## 35                                                                  Vantage Equity 4250_MO
## 36                                                                  Vantage Equity 4750_MO
## 37                                                               Vantage FourSight 1000 MO
## 38                                                                         Vantage 6350_MO
##      Min. 1st Qu. Median   Mean 3rd Qu.   Max.
## 1   17300   17300  17400  18200   18200  25300
## 2   17300   17300  17400  18200   18200  25300
## 3   18400   18400  18400  18900   18400  26600
## 4   18700   18700  18700  19000   18700  23600
## 5   18800   18800  18800  19200   18800  25600
## 6   19400   19400  19400  19900   19600  25900
## 7   19400   19400  19400  19400   19400  19400
## 8   18100   19100  19700  19800   20300  23600
## 9   19800   19800  19800  20000   19800  23500
## 10  20200   20200  20200  20400   20200  24500
## 11  19400   20400  21000  21100   21600  24900
## 12  19400   20400  21000  21100   21600  24900
## 13  21100   21100  21100  21300   21100  24800
## 14  21600   21600  21600  21700   21600  23300
## 15  21600   21600  21600  21600   21600  21600
## 16  21900   21900  21900  22200   21900  27100
## 17  22300   22300  22300  22300   22300  23000
## 18  22400   22400  22400  22500   22400  23900
## 19  23100   23100  23100  23100   23100  23100
## 20  23500   23500  23500  23800   23500  29000
## 21  23700   23700  23700  24000   23700  28700
## 22  24300   24300  24300  24500   24300  28300
## 23  24900   24900  24900  25200   24900  30400
## 24  24900   24900  24900  25000   24900  27900
## 25  23900   24400  25100  25600   25700  34400
## 26  26100   26100  26100  26100   26100  26100
## 27  56900   56900  56900  56900   56900  56900
## 28  78000   78000  78000  78000   78000  78000
## 29  80800   80800  80800  80900   80800  82300
## 30  94800   94800  94800  95100   94800 100000
## 31  99200   99200  99200  99700   99300 106000
## 32 122000  122000 122000 123000  122000 127000
## 33 122000  122000 122000 122000  122000 128000
## 34 123000  123000 123000 124000  123000 129000
## 35 123000  123000 123000 123000  123000 127000
## 36 123000  123000 123000 124000  123000 126000
## 37 122000  123000 124000 124000  124000 133000
## 38 130000  130000 130000 130000  130000 130000
```


