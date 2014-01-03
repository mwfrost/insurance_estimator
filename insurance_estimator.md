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
names(policies)[which(apply(policies, 2, function(x) any(grepl("\\$", x))))]
```

```
##  [1] "plan.name"                                          
##  [2] "premium.child"                                      
##  [3] "prem.ind.21"                                        
##  [4] "prem.ind.27"                                        
##  [5] "prem.ind.30"                                        
##  [6] "prem.ind.40"                                        
##  [7] "prem.ind.50"                                        
##  [8] "prem.ind.60"                                        
##  [9] "prem.cpl.21"                                        
## [10] "prem.cpl.30"                                        
## [11] "prem.cpl.40"                                        
## [12] "prem.cpl.50"                                        
## [13] "prem.cpl.60"                                        
## [14] "couple.1.child.age.21"                              
## [15] "couple.1.child.age.30"                              
## [16] "couple.1.child.age.40"                              
## [17] "couple.1.child.age.50"                              
## [18] "couple.2.children.age.21"                           
## [19] "couple.2.children.age.30"                           
## [20] "couple.2.children.age.40"                           
## [21] "couple.2.children.age.50"                           
## [22] "couple.3.or.more.children.age.21"                   
## [23] "couple.3.or.more.children.age.30"                   
## [24] "couple.3.or.more.children.age.40"                   
## [25] "couple.3.or.more.children.age.50"                   
## [26] "individual.1.child.age.21"                          
## [27] "individual.1.child.age.30"                          
## [28] "individual.1.child.age.40"                          
## [29] "individual.1.child.age.50"                          
## [30] "individual.2.children.age.21"                       
## [31] "individual.2.children.age.30"                       
## [32] "individual.2.children.age.40"                       
## [33] "individual.2.children.age.50"                       
## [34] "individual.3.or.more.children.age.21"               
## [35] "individual.3.or.more.children.age.30"               
## [36] "individual.3.or.more.children.age.40"               
## [37] "individual.3.or.more.children.age.50"               
## [38] "med.ded.indv"                                       
## [39] "drug.deductible.individual.standard"                
## [40] "med.ded.fam"                                        
## [41] "drug.deductible.family.standard"                    
## [42] "ind.oop.max"                                        
## [43] "fam.oop.max"                                        
## [44] "pcp.share"                                          
## [45] "spec.share"                                         
## [46] "er.share"                                           
## [47] "gen.rx.share"                                       
## [48] "preferred.brand.drugs.standard"                     
## [49] "non.pref.rx.share"                                  
## [50] "spec.rx.share"                                      
## [51] "medical.deductible.individual.73.percent"           
## [52] "drug.deductible.individual.73.percent"              
## [53] "medical.deductible.family.73.percent"               
## [54] "drug.deductible.family.73.percent"                  
## [55] "medical.maximum.out.of.pocket.individual.73.percent"
## [56] "medical.maximum.out.of.pocket.family.73.percent"    
## [57] "primary.care.physician.73.percent"                  
## [58] "specialist.73.percent"                              
## [59] "emergency.room.73.percent"                          
## [60] "generic.drugs.73.percent"                           
## [61] "preferred.brand.drugs.73.percent"                   
## [62] "non.preferred.brand.drugs.73.percent"               
## [63] "specialty.drugs.73.percent"                         
## [64] "medical.deductible.individual.87.percent"           
## [65] "drug.deductible.individual.87.percent"              
## [66] "medical.deductible.family.87.percent"               
## [67] "drug.deductible.family.87.percent"                  
## [68] "medical.maximum.out.of.pocket.individual.87.percent"
## [69] "medical.maximum.out.of.pocket.family.87.percent"    
## [70] "primary.care.physician.87.percent"                  
## [71] "specialist.87.percent"                              
## [72] "emergency.room.87.percent"                          
## [73] "generic.drugs.87.percent"                           
## [74] "preferred.brand.drugs.87.percent"                   
## [75] "non.preferred.brand.drugs.87.percent"               
## [76] "specialty.drugs.87.percent"                         
## [77] "medical.deductible.individual.94.percent"           
## [78] "drug.deductible.individual.94.percent"              
## [79] "medical.deductible.family.94.percent"               
## [80] "drug.deductible.family.94.percent"                  
## [81] "medical.maximum.out.of.pocket.individual.94.percent"
## [82] "medical.maximum.out.of.pocket.family.94.percent"    
## [83] "primary.care.physician.94.percent"                  
## [84] "specialist.94.percent"                              
## [85] "emergency.room.94.percent"                          
## [86] "generic.drugs.94.percent"                           
## [87] "preferred.brand.drugs.94.percent"                   
## [88] "non.preferred.brand.drugs.94.percent"               
## [89] "specialty.drugs.94.percent"
```

```r

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
## Warning: NAs introduced by coercion
```

```
##  [1] NA NA NA NA NA NA 25 25 40 NA 35 NA 35 10 NA 10 NA 50 50 40 20 20 25
## [24] 25 30 30 30  5  5 25 25 45 35 35 35 35 10 10
```

```r
parse.percents(policies$spec.share)
```

```
## Warning: NAs introduced by coercion
```

```
##  [1] 0.30 0.20 0.10 0.30 0.20 0.10 0.40 0.40 0.25 0.15 0.35 0.25 0.35   NA
## [15]   NA   NA   NA   NA   NA   NA   NA   NA 0.10 0.10 0.20 0.20 0.20   NA
## [29]   NA 0.20 0.20 0.15 0.20 0.20 0.30 0.30   NA   NA
```

```r

copays <- sapply(policies[, grep("share", names(policies))], parse.prices)
```

```
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
```

```r
coinsurance <- sapply(policies[, grep("share", names(policies))], parse.percents)
```

```
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
## Warning: NAs introduced by coercion Warning: NAs introduced by coercion
```

```r

copays <- data.frame(copays)
copays[is.na(copays)] <- 0
coinsurance <- data.frame(coinsurance)
coinsurance[is.na(coinsurance)] <- 0
names(copays) <- gsub("share", "copay", names(copays))
names(coinsurance) <- gsub("share", "coinsurance", names(coinsurance))

cbind(copays, coinsurance)
```

```
##    pcp.copay spec.copay er.copay hosp.fac.copay hosp.doc.copay
## 1          0          0        0              0              0
## 2          0          0        0              0              0
## 3          0          0        0              0              0
## 4          0          0        0              0              0
## 5          0          0        0              0              0
## 6          0          0        0              0              0
## 7         25         25        0              0              0
## 8         25         25        0              0              0
## 9         40          0        0              0              0
## 10         0          0        0              0              0
## 11        35          0        0              0              0
## 12         0          0        0              0              0
## 13        35          0        0              0              0
## 14        10         75      500              0              0
## 15         0          0        0              0              0
## 16        10         75      500              0              0
## 17         0          0        0              0              0
## 18        50          0        0              0              0
## 19        50          0        0              0              0
## 20        40          0        0              0              0
## 21        20          0        0              0              0
## 22        20          0        0              0              0
## 23        25         25        0              0              0
## 24        25         25        0              0              0
## 25        30          0        0              0              0
## 26        30          0        0              0              0
## 27        30          0        0              0              0
## 28         5         50      250              0              0
## 29         5         50      250              0              0
## 30        25         25        0              0              0
## 31        25         25        0              0              0
## 32        45          0        0              0              0
## 33        35          0        0              0              0
## 34        35          0        0              0              0
## 35        35          0        0              0              0
## 36        35          0        0              0              0
## 37        10         75      500              0              0
## 38        10         75      500              0              0
##    gen.rx.copay non.pref.rx.copay spec.rx.copay pcp.coinsurance
## 1             0                 0             0            0.30
## 2             0                 0             0            0.20
## 3             0                 0             0            0.10
## 4             0                 0             0            0.30
## 5             0                 0             0            0.20
## 6             0                 0             0            0.10
## 7             0                 0             0            0.40
## 8             0                 0             0            0.40
## 9             0                 0             0            0.25
## 10            0                 0             0            0.15
## 11            0                 0             0            0.35
## 12            0                 0             0            0.25
## 13            0                 0             0            0.35
## 14           15                75             0            0.00
## 15            0                 0             0            0.00
## 16           15                75             0            0.00
## 17            0                 0             0            0.00
## 18            0                 0             0            0.00
## 19            0                 0             0            0.00
## 20            0                 0             0            0.00
## 21            0                 0             0            0.00
## 22            0                 0             0            0.00
## 23           15                50            50            0.10
## 24           15                50            50            0.10
## 25           15                 0             0            0.00
## 26           15                 0             0            0.00
## 27           15                 0             0            0.00
## 28            3                60             0            0.00
## 29            3                60             0            0.00
## 30           15                50            50            0.20
## 31           15                50            50            0.20
## 32           15                 0             0            0.00
## 33           15                 0             0            0.20
## 34           15                 0             0            0.00
## 35           15                 0             0            0.30
## 36           15                 0             0            0.30
## 37            5                75             0            0.00
## 38            5                75             0            0.00
##    spec.coinsurance er.coinsurance hosp.fac.coinsurance
## 1              0.30           0.30                 0.30
## 2              0.20           0.20                 0.20
## 3              0.10           0.10                 0.10
## 4              0.30           0.30                 0.30
## 5              0.20           0.20                 0.20
## 6              0.10           0.10                 0.10
## 7              0.40           0.40                 0.40
## 8              0.40           0.40                 0.40
## 9              0.25           0.35                 0.25
## 10             0.15           0.15                 0.15
## 11             0.35           0.45                 0.35
## 12             0.25           0.35                 0.25
## 13             0.35           0.45                 0.35
## 14             0.00           0.00                 0.40
## 15             0.00           0.00                 0.00
## 16             0.00           0.00                 0.40
## 17             0.00           0.00                 0.00
## 18             0.00           0.00                 0.00
## 19             0.00           0.00                 0.00
## 20             0.00           0.00                 0.00
## 21             0.00           0.00                 0.00
## 22             0.00           0.00                 0.00
## 23             0.10           0.10                 0.10
## 24             0.10           0.10                 0.10
## 25             0.20           0.30                 0.20
## 26             0.20           0.30                 0.20
## 27             0.20           0.30                 0.20
## 28             0.00           0.00                 0.20
## 29             0.00           0.00                 0.20
## 30             0.20           0.20                 0.20
## 31             0.20           0.20                 0.20
## 32             0.15           0.25                 0.15
## 33             0.20           0.30                 0.20
## 34             0.20           0.30                 0.20
## 35             0.30           0.40                 0.30
## 36             0.30           0.40                 0.30
## 37             0.00           0.00                 0.40
## 38             0.00           0.00                 0.40
##    hosp.doc.coinsurance gen.rx.coinsurance non.pref.rx.coinsurance
## 1                  0.30               0.50                    0.50
## 2                  0.20               0.50                    0.50
## 3                  0.10               0.50                    0.50
## 4                  0.30               0.50                    0.50
## 5                  0.20               0.50                    0.50
## 6                  0.10               0.50                    0.50
## 7                  0.40               0.50                    0.50
## 8                  0.40               0.50                    0.50
## 9                  0.25               0.25                    0.25
## 10                 0.15               0.15                    0.15
## 11                 0.35               0.35                    0.35
## 12                 0.25               0.25                    0.25
## 13                 0.35               0.35                    0.35
## 14                 0.40               0.00                    0.00
## 15                 0.00               0.00                    0.00
## 16                 0.40               0.00                    0.00
## 17                 0.00               0.00                    0.00
## 18                 0.00               0.00                    0.00
## 19                 0.00               0.00                    0.00
## 20                 0.00               0.00                    0.00
## 21                 0.00               0.00                    0.00
## 22                 0.00               0.00                    0.00
## 23                 0.10               0.00                    0.00
## 24                 0.10               0.00                    0.00
## 25                 0.20               0.00                    0.20
## 26                 0.20               0.00                    0.20
## 27                 0.20               0.00                    0.20
## 28                 0.20               0.00                    0.00
## 29                 0.20               0.00                    0.00
## 30                 0.20               0.00                    0.00
## 31                 0.20               0.00                    0.00
## 32                 0.15               0.00                    0.15
## 33                 0.20               0.00                    0.20
## 34                 0.20               0.00                    0.20
## 35                 0.30               0.00                    0.30
## 36                 0.30               0.00                    0.30
## 37                 0.40               0.00                    0.00
## 38                 0.40               0.00                    0.00
##    spec.rx.coinsurance
## 1                 0.50
## 2                 0.50
## 3                 0.50
## 4                 0.50
## 5                 0.50
## 6                 0.50
## 7                 0.50
## 8                 0.50
## 9                 0.25
## 10                0.15
## 11                0.35
## 12                0.25
## 13                0.35
## 14                0.30
## 15                0.00
## 16                0.30
## 17                0.00
## 18                0.00
## 19                0.00
## 20                0.00
## 21                0.00
## 22                0.00
## 23                0.00
## 24                0.00
## 25                0.20
## 26                0.20
## 27                0.20
## 28                0.20
## 29                0.20
## 30                0.00
## 31                0.00
## 32                0.15
## 33                0.20
## 34                0.20
## 35                0.30
## 36                0.30
## 37                0.30
## 38                0.30
```

```r

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
```

```
## Warning: NAs introduced by coercion
```

```r
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
## 1    Parent A              1 Parent A      134.0         0        0
## 501  Parent B              1 Parent B      167.9         0        0
## 1001  Child C              1  Child C      146.8         0        0
## 1501  Child D              1  Child D      120.6         0        0
## 2001  Child E              1  Child E      134.9         0        0
## 2501  Child F              1  Child F      167.9         0        0
## 3001  Child G              1  Child G      166.1         0        0
```

```r
# The `scenarios` are unique combinations of each policy, family member, and
# iteration year
scenarios <- explode.scenarios(costs, plans)
head(scenarios)
```

```
##       Name cost.iteration     name visit.cost sick.cost cat.cost
## 1 Parent A              1 Parent A      134.0         0        0
## 2 Parent A              2 Parent A      485.2         0        0
## 3 Parent A              3 Parent A      199.8       800        0
## 4 Parent A              4 Parent A      202.3       800        0
## 5 Parent A              5 Parent A      206.9       800        0
## 6 Parent A              6 Parent A      182.0       800        0
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
##  $ visit.cost             : num  134 485 200 202 207 ...
##  $ sick.cost              : num  0 0 800 800 800 800 800 800 0 800 ...
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
```

```
##    Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
##    1500    5200    7500    8290   11200   25200
```

```r
head(results)
```

```
##          plan.id cost.iteration fam.costs              plan.name
## 1 20507VA1170001              1      1038 Vantage FourSight 1000
## 2 20507VA1170001              2      4326 Vantage FourSight 1000
## 3 20507VA1170001              3      3848 Vantage FourSight 1000
## 4 20507VA1170001              4      3070 Vantage FourSight 1000
## 5 20507VA1170001              5      3975 Vantage FourSight 1000
## 6 20507VA1170001              6      3485 Vantage FourSight 1000
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
## 1                       0                   0    1826        2000
## 2                       0                   0    1826        4326
## 3                       0                   0    1826        3848
## 4                       0                   0    1826        3070
## 5                       0                   0    1826        3975
## 6                       0                   0    1826        3485
##   fam.post.ded fam.copay annual.premium fam.net fam.net.max fam.net.capped
## 1            0       0.0          21912   23912       34412          23912
## 2         2326     232.6          21912   26471       34412          26471
## 3         1848     184.8          21912   25945       34412          25945
## 4         1070     107.0          21912   25089       34412          25089
## 5         1975     197.5          21912   26084       34412          26084
## 6         1485     148.5          21912   25545       34412          25545
```



Measure the probability densities of the results, by policy. Assign some tail boundaries of interest for later graphing.



```r
tail.limit.left <- 0.333
tail.limit.right <- 0.666
dxy <- ddply(results, .(plan.name), summarize, dx = density(fam.net.capped)$x, 
    dy = density(fam.net.capped)$y)
dxy <- ddply(dxy, .(plan.name), transform, qleft = quantile(dx, tail.limit.left), 
    qright = quantile(dx, tail.limit.right))
```

```
## Warning: row names were found from a short variable and have been
## discarded Warning: row names were found from a short variable and have
## been discarded Warning: row names were found from a short variable and
## have been discarded Warning: row names were found from a short variable
## and have been discarded Warning: row names were found from a short
## variable and have been discarded Warning: row names were found from a
## short variable and have been discarded Warning: row names were found from
## a short variable and have been discarded Warning: row names were found
## from a short variable and have been discarded Warning: row names were
## found from a short variable and have been discarded Warning: row names
## were found from a short variable and have been discarded Warning: row
## names were found from a short variable and have been discarded Warning:
## row names were found from a short variable and have been discarded
## Warning: row names were found from a short variable and have been
## discarded Warning: row names were found from a short variable and have
## been discarded Warning: row names were found from a short variable and
## have been discarded Warning: row names were found from a short variable
## and have been discarded Warning: row names were found from a short
## variable and have been discarded Warning: row names were found from a
## short variable and have been discarded Warning: row names were found from
## a short variable and have been discarded Warning: row names were found
## from a short variable and have been discarded Warning: row names were
## found from a short variable and have been discarded Warning: row names
## were found from a short variable and have been discarded Warning: row
## names were found from a short variable and have been discarded Warning:
## row names were found from a short variable and have been discarded
## Warning: row names were found from a short variable and have been
## discarded Warning: row names were found from a short variable and have
## been discarded Warning: row names were found from a short variable and
## have been discarded Warning: row names were found from a short variable
## and have been discarded Warning: row names were found from a short
## variable and have been discarded Warning: row names were found from a
## short variable and have been discarded Warning: row names were found from
## a short variable and have been discarded Warning: row names were found
## from a short variable and have been discarded Warning: row names were
## found from a short variable and have been discarded Warning: row names
## were found from a short variable and have been discarded Warning: row
## names were found from a short variable and have been discarded Warning:
## row names were found from a short variable and have been discarded
## Warning: row names were found from a short variable and have been
## discarded Warning: row names were found from a short variable and have
## been discarded
```

```r
dxy$ytail <- ifelse(dxy$dx <= dxy$qleft | dxy$dx >= dxy$qright, dxy$dy, 0)
```


## Plot the outcomes


```r
ggplot(results) + geom_density(aes(x = fam.net.capped)) + geom_area(data = dxy, 
    aes(x = dx, y = ytail), fill = "green", colour = NA, alpha = 0.5) + geom_vline(aes(xintercept = fam.net.max), 
    color = "red") + facet_wrap(~plan.name, ncol = 1)
```

![plot of chunk plot.outcomes](figure/plot_outcomes1.png) 

```r

ggplot(results) + geom_histogram(aes(x = fam.net.capped), binwidth = 100) + 
    geom_vline(aes(xintercept = fam.net.max), color = "red") + facet_wrap(~plan.name, 
    ncol = 1)
```

![plot of chunk plot.outcomes](figure/plot_outcomes2.png) 


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

```
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 32 rows containing non-finite values (stat_density).
## Warning: Removed 500 rows containing non-finite values (stat_density).
## Warning: Removed 24 rows containing non-finite values (stat_density).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 1 rows containing missing values (position_stack).
## Warning: Removed 2 rows containing missing values (position_stack).
## Warning: no non-missing arguments to min; returning Inf Warning: no
## non-missing arguments to max; returning -Inf Warning: position_stack
## requires constant width: output may be incorrect Warning: Removed 2 rows
## containing missing values (position_stack). Warning: no non-missing
## arguments to min; returning Inf Warning: no non-missing arguments to max;
## returning -Inf Warning: position_stack requires constant width: output may
## be incorrect Warning: Removed 2 rows containing missing values
## (position_stack). Warning: no non-missing arguments to min; returning Inf
## Warning: no non-missing arguments to max; returning -Inf Warning:
## position_stack requires constant width: output may be incorrect Warning:
## Removed 2 rows containing missing values (position_stack). Warning: no
## non-missing arguments to min; returning Inf Warning: no non-missing
## arguments to max; returning -Inf Warning: position_stack requires constant
## width: output may be incorrect Warning: Removed 2 rows containing missing
## values (position_stack). Warning: no non-missing arguments to min;
## returning Inf Warning: no non-missing arguments to max; returning -Inf
## Warning: position_stack requires constant width: output may be incorrect
## Warning: Removed 2 rows containing missing values (position_stack).
## Warning: no non-missing arguments to min; returning Inf Warning: no
## non-missing arguments to max; returning -Inf Warning: position_stack
## requires constant width: output may be incorrect Warning: Removed 2 rows
## containing missing values (position_stack). Warning: no non-missing
## arguments to min; returning Inf Warning: no non-missing arguments to max;
## returning -Inf Warning: position_stack requires constant width: output may
## be incorrect Warning: Removed 2 rows containing missing values
## (position_stack). Warning: no non-missing arguments to min; returning Inf
## Warning: no non-missing arguments to max; returning -Inf Warning:
## position_stack requires constant width: output may be incorrect Warning:
## Removed 2 rows containing missing values (position_stack). Warning: no
## non-missing arguments to min; returning Inf Warning: no non-missing
## arguments to max; returning -Inf Warning: position_stack requires constant
## width: output may be incorrect Warning: Removed 2 rows containing missing
## values (position_stack). Warning: no non-missing arguments to min;
## returning Inf Warning: no non-missing arguments to max; returning -Inf
## Warning: position_stack requires constant width: output may be incorrect
## Warning: Removed 2 rows containing missing values (position_stack).
## Warning: no non-missing arguments to min; returning Inf Warning: no
## non-missing arguments to max; returning -Inf Warning: position_stack
## requires constant width: output may be incorrect Warning: Removed 2 rows
## containing missing values (position_stack). Warning: no non-missing
## arguments to min; returning Inf Warning: no non-missing arguments to max;
## returning -Inf Warning: position_stack requires constant width: output may
## be incorrect Warning: Removed 51 rows containing missing values
## (position_stack). Warning: Removed 73 rows containing missing values
## (position_stack). Warning: Removed 129 rows containing missing values
## (position_stack). Warning: Removed 54 rows containing missing values
## (position_stack). Warning: Removed 512 rows containing missing values
## (position_stack). Warning: no non-missing arguments to min; returning Inf
## Warning: no non-missing arguments to max; returning -Inf Warning:
## position_stack requires constant width: output may be incorrect Warning:
## Removed 158 rows containing missing values (position_stack). Warning:
## Removed 458 rows containing missing values (position_stack). Warning:
## Removed 76 rows containing missing values (position_stack). Warning:
## Removed 411 rows containing missing values (position_stack). Warning:
## Removed 512 rows containing missing values (position_stack). Warning: no
## non-missing arguments to min; returning Inf Warning: no non-missing
## arguments to max; returning -Inf Warning: position_stack requires constant
## width: output may be incorrect Warning: Removed 512 rows containing
## missing values (position_stack). Warning: no non-missing arguments to min;
## returning Inf Warning: no non-missing arguments to max; returning -Inf
## Warning: position_stack requires constant width: output may be incorrect
## Warning: Removed 512 rows containing missing values (position_stack).
## Warning: no non-missing arguments to min; returning Inf Warning: no
## non-missing arguments to max; returning -Inf Warning: position_stack
## requires constant width: output may be incorrect Warning: Removed 207 rows
## containing missing values (position_stack). Warning: Removed 508 rows
## containing missing values (position_stack). Warning: Removed 512 rows
## containing missing values (position_stack). Warning: no non-missing
## arguments to min; returning Inf Warning: no non-missing arguments to max;
## returning -Inf Warning: position_stack requires constant width: output may
## be incorrect Warning: Removed 512 rows containing missing values
## (position_stack). Warning: no non-missing arguments to min; returning Inf
## Warning: no non-missing arguments to max; returning -Inf Warning:
## position_stack requires constant width: output may be incorrect Warning:
## Removed 21 rows containing missing values (position_stack). Warning:
## Removed 512 rows containing missing values (position_stack). Warning: no
## non-missing arguments to min; returning Inf Warning: no non-missing
## arguments to max; returning -Inf Warning: position_stack requires constant
## width: output may be incorrect Warning: Removed 512 rows containing
## missing values (position_stack). Warning: no non-missing arguments to min;
## returning Inf Warning: no non-missing arguments to max; returning -Inf
## Warning: position_stack requires constant width: output may be incorrect
## Warning: Removed 222 rows containing missing values (position_stack).
## Warning: Removed 512 rows containing missing values (position_stack).
## Warning: no non-missing arguments to min; returning Inf Warning: no
## non-missing arguments to max; returning -Inf Warning: position_stack
## requires constant width: output may be incorrect Warning: Removed 94 rows
## containing missing values (position_stack). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment). Warning: Removed 1 rows
## containing missing values (geom_segment).
```


