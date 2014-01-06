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

# The 'MOC' and 'MO' plans seem to have unusually high premiums Compare:
policies[grep("3750", policies$plan.name), ]
```

```
##   state    county metal.level   issuer.name        plan.id
## 1    VA ALBEMARLE      Bronze Optima Health 20507VA1180001
## 4    VA ALBEMARLE      Bronze Optima Health 20507VA1180004
##                plan.name plan.type   rating.area
## 1    Vantage Equity 3750       HMO Rating Area 2
## 4 Vantage Equity 3750_MO       HMO Rating Area 2
##           child.only.offering source customer.service.phone.number.local
## 1 Allows Adult and Child-Only  SERFF                      1-866-946-6034
## 4 Allows Adult and Child-Only  SERFF                      1-866-946-6034
##   customer.service.phone.number.toll.free
## 1                          1-866-946-6034
## 4                          1-866-946-6034
##   customer.service.phone.number.tty                      network.url
## 1                    1-800-225-7784 http://optimahealth.prismisp.com
## 4                    1-800-225-7784 http://optimahealth.prismisp.com
##                                                plan.brochure.url
## 1 http://public.optimahealth.com/exchangesbc/HIXBrochureIFP1.pdf
## 4 http://public.optimahealth.com/exchangesbc/HIXBrochureIFP2.pdf
##                                               summary.of.benefits.url
## 1 http://public.optimahealth.com/exchangesbc/HIXSBC20507VA1180001.pdf
## 4 http://public.optimahealth.com/exchangesbc/HIXSBC20507VA1180004.pdf
##                            drug.formulary.url adult.dental child.dental
## 1 http://www.optimahealth.com/HIXIFPformulary           NA            X
## 4 http://www.optimahealth.com/HIXIFPformulary           NA            X
##   premium.scenarios premium.child prem.ind.21 prem.ind.27 prem.ind.30
## 1                NA       $149.66     $235.68     $246.99     $267.50
## 4                NA      $1059.60    $1668.68    $1748.78    $1893.95
##   prem.ind.40 prem.ind.50 prem.ind.60 prem.cpl.21 prem.cpl.30 prem.cpl.40
## 1     $301.20     $420.93     $639.64     $471.36     $535.00     $602.40
## 4    $2132.57    $2980.26    $4528.80    $3337.36    $3787.90    $4265.14
##   prem.cpl.50 prem.cpl.60 couple.1.child.age.21 couple.1.child.age.30
## 1     $841.86    $1279.28               $621.02               $684.66
## 4    $5960.52    $9057.60              $4396.97              $4847.51
##   couple.1.child.age.40 couple.1.child.age.50 couple.2.children.age.21
## 1               $752.06               $991.52                  $770.68
## 4              $5324.75              $7020.13                 $5456.58
##   couple.2.children.age.30 couple.2.children.age.40
## 1                  $834.31                  $901.72
## 4                 $5907.12                 $6384.36
##   couple.2.children.age.50 couple.3.or.more.children.age.21
## 1                 $1141.18                          $920.34
## 4                 $8079.74                         $6516.19
##   couple.3.or.more.children.age.30 couple.3.or.more.children.age.40
## 1                          $983.98                         $1051.38
## 4                         $6966.73                         $7443.97
##   couple.3.or.more.children.age.50 individual.1.child.age.21
## 1                         $1290.84                   $385.34
## 4                         $9139.35                  $2728.29
##   individual.1.child.age.30 individual.1.child.age.40
## 1                   $417.15                   $450.86
## 4                  $2953.56                  $3192.18
##   individual.1.child.age.50 individual.2.children.age.21
## 1                   $570.59                      $535.00
## 4                  $4039.87                     $3787.89
##   individual.2.children.age.30 individual.2.children.age.40
## 1                      $566.81                      $600.52
## 4                     $4013.17                     $4251.79
##   individual.2.children.age.50 individual.3.or.more.children.age.21
## 1                      $720.25                              $684.66
## 4                     $5099.47                             $4847.51
##   individual.3.or.more.children.age.30
## 1                              $716.48
## 4                             $5072.78
##   individual.3.or.more.children.age.40
## 1                              $750.18
## 4                             $5311.40
##   individual.3.or.more.children.age.50 standard.plan.cost.sharing
## 1                              $869.91                         NA
## 4                             $6159.09                         NA
##   med.ded.indv drug.deductible.individual.standard med.ded.fam
## 1     $3750.00                 Included in Medical    $7500.00
## 4     $3750.00                 Included in Medical    $7500.00
##   drug.deductible.family.standard ind.oop.max
## 1             Included in Medical    $6250.00
## 4             Included in Medical    $6250.00
##   drug.maximum.out.of.pocket.individual.standard fam.oop.max
## 1                            Included in Medical   $12500.00
## 4                            Included in Medical   $12500.00
##   drug.maximum.out.of.pocket.family.standard
## 1                        Included in Medical
## 4                        Included in Medical
##                          pcp.share                       spec.share
## 1 30% Coinsurance after deductible 30% Coinsurance after deductible
## 4 30% Coinsurance after deductible 30% Coinsurance after deductible
##                           er.share                   hosp.fac.share
## 1 30% Coinsurance after deductible 30% Coinsurance after deductible
## 4 30% Coinsurance after deductible 30% Coinsurance after deductible
##                     hosp.doc.share                     gen.rx.share
## 1 30% Coinsurance after deductible 50% Coinsurance after deductible
## 4 30% Coinsurance after deductible 50% Coinsurance after deductible
##     preferred.brand.drugs.standard                non.pref.rx.share
## 1 50% Coinsurance after deductible 50% Coinsurance after deductible
## 4 50% Coinsurance after deductible 50% Coinsurance after deductible
##                      spec.rx.share
## 1 50% Coinsurance after deductible
## 4 50% Coinsurance after deductible
##   x73.percent.actuarial.value.silver.plan.cost.sharing
## 1                                                   NA
## 4                                                   NA
##   medical.deductible.individual.73.percent
## 1                                         
## 4                                         
##   drug.deductible.individual.73.percent
## 1                                      
## 4                                      
##   medical.deductible.family.73.percent drug.deductible.family.73.percent
## 1                                                                       
## 4                                                                       
##   medical.maximum.out.of.pocket.individual.73.percent
## 1                                                    
## 4                                                    
##   drug.maximum.out.of.pocket.individual.73.percent
## 1                                                 
## 4                                                 
##   medical.maximum.out.of.pocket.family.73.percent
## 1                                                
## 4                                                
##   drug.maximum.out.of.pocket.family.73.percent
## 1                                             
## 4                                             
##   primary.care.physician.73.percent specialist.73.percent
## 1                                                        
## 4                                                        
##   emergency.room.73.percent inpatient.facility.73.percent
## 1                                                        
## 4                                                        
##   inpatient.physician.73.percent generic.drugs.73.percent
## 1                                                        
## 4                                                        
##   preferred.brand.drugs.73.percent non.preferred.brand.drugs.73.percent
## 1                                                                      
## 4                                                                      
##   specialty.drugs.73.percent
## 1                           
## 4                           
##   x87.percent.actuarial.value.silver.plan.cost.sharing
## 1                                                   NA
## 4                                                   NA
##   medical.deductible.individual.87.percent
## 1                                         
## 4                                         
##   drug.deductible.individual.87.percent
## 1                                      
## 4                                      
##   medical.deductible.family.87.percent drug.deductible.family.87.percent
## 1                                                                       
## 4                                                                       
##   medical.maximum.out.of.pocket.individual.87.percent
## 1                                                    
## 4                                                    
##   drug.maximum.out.of.pocket.individual.87.percent
## 1                                                 
## 4                                                 
##   medical.maximum.out.of.pocket.family.87.percent
## 1                                                
## 4                                                
##   drug.maximum.out.of.pocket.family.87.percent
## 1                                             
## 4                                             
##   primary.care.physician.87.percent specialist.87.percent
## 1                                                        
## 4                                                        
##   emergency.room.87.percent inpatient.facility.87.percent
## 1                                                        
## 4                                                        
##   inpatient.physician.87.percent generic.drugs.87.percent
## 1                                                        
## 4                                                        
##   preferred.brand.drugs.87.percent non.preferred.brand.drugs.87.percent
## 1                                                                      
## 4                                                                      
##   specialty.drugs.87.percent
## 1                           
## 4                           
##   x94.percent.actuarial.value.silver.plan.cost.sharing
## 1                                                   NA
## 4                                                   NA
##   medical.deductible.individual.94.percent
## 1                                         
## 4                                         
##   drug.deductible.individual.94.percent
## 1                                      
## 4                                      
##   medical.deductible.family.94.percent drug.deductible.family.94.percent
## 1                                                                       
## 4                                                                       
##   medical.maximum.out.of.pocket.individual.94.percent
## 1                                                    
## 4                                                    
##   drug.maximum.out.of.pocket.individual.94.percent
## 1                                                 
## 4                                                 
##   medical.maximum.out.of.pocket.family.94.percent
## 1                                                
## 4                                                
##   drug.maximum.out.of.pocket.family.94.percent
## 1                                             
## 4                                             
##   primary.care.physician.94.percent specialist.94.percent
## 1                                                        
## 4                                                        
##   emergency.room.94.percent inpatient.facility.94.percent
## 1                                                        
## 4                                                        
##   inpatient.physician.94.percent generic.drugs.94.percent
## 1                                                        
## 4                                                        
##   preferred.brand.drugs.94.percent non.preferred.brand.drugs.94.percent
## 1                                                                      
## 4                                                                      
##   specialty.drugs.94.percent
## 1                           
## 4
```

```r

# Exclude them for now
policies <- policies[grep("MO$|MOC$", policies$plan.name, invert = TRUE), ]


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
##  [1] NA NA NA 25 40 NA 35 NA 35 10 NA 50 40 20 25 30 30 30  5 25 45 35 35
## [24] 35 35 10
```

```r
parse.percents(policies$spec.share)
```

```
##  [1] 0.30 0.20 0.10 0.40 0.25 0.15 0.35 0.25 0.35   NA   NA   NA   NA   NA
## [15] 0.10 0.20 0.20 0.20   NA 0.20 0.15 0.20 0.20 0.30 0.30   NA
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
# after the third child.  as of Jan 3, it's just calling everyone an
# individual

# Join the insured data frame to the premium costs
ind.prems <- merge(insured[, c("Age", "Name")], subset(prems, customer == "Individual"), 
    by.x = "Age", by.y = "age")
# cap the premium after the third child by zeroing out the premium for every
# individual not in the first five family members
ind.prems[!ind.prems$Name %in% insured$Name[1:5], "prem"] <- 0
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
## 1    Parent A              1 Parent A      185.0         0        0
## 501  Parent B              1 Parent B      197.2         0        0
## 1001  Child C              1  Child C      174.8         0        0
## 1501  Child D              1  Child D      187.5         0        0
## 2001  Child E              1  Child E      221.6         0        0
## 2501  Child F              1  Child F      134.1         0        0
## 3001  Child G              1  Child G      184.9         0        0
```

```r
# The `scenarios` are unique combinations of each policy, family member, and
# iteration year
scenarios <- explode.scenarios(costs, plans)
head(scenarios)
```

```
##       Name cost.iteration     name visit.cost sick.cost cat.cost
## 1 Parent A              1 Parent A      185.0         0        0
## 2 Parent A              2 Parent A      459.5         0        0
## 3 Parent A              3 Parent A      293.4         0        0
## 4 Parent A              4 Parent A      203.6         0        0
## 5 Parent A              5 Parent A      252.2       500        0
## 6 Parent A              6 Parent A      209.4         0        0
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
## 1                   0    1421
## 2                   0    1421
## 3                   0    1421
## 4                   0    1421
## 5                   0    1421
## 6                   0    1421
```

```r
str(scenarios)
```

```
## 'data.frame':	91000 obs. of  29 variables:
##  $ Name                   : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ cost.iteration         : int  1 2 3 4 5 6 7 8 9 10 ...
##  $ name                   : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ visit.cost             : num  185 459 293 204 252 ...
##  $ sick.cost              : num  0 0 0 0 500 0 500 0 0 0 ...
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
##  $ premium                : num  1421 1421 1421 1421 1421 ...
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
## 1 20507VA1170001              1      1285 Vantage FourSight 1000
## 2 20507VA1170001              2      3916 Vantage FourSight 1000
## 3 20507VA1170001              3      3454 Vantage FourSight 1000
## 4 20507VA1170001              4      3001 Vantage FourSight 1000
## 5 20507VA1170001              5      3504 Vantage FourSight 1000
## 6 20507VA1170001              6      3692 Vantage FourSight 1000
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
## 1                       0                   0    1421        2000
## 2                       0                   0    1421        3916
## 3                       0                   0    1421        3454
## 4                       0                   0    1421        3001
## 5                       0                   0    1421        3504
## 6                       0                   0    1421        3692
##   fam.post.ded fam.copay annual.premium fam.net fam.net.max fam.net.capped
## 1            0       0.0          17056   19056       29556          19056
## 2         1916     191.6          17056   21164       29556          21164
## 3         1454     145.4          17056   20656       29556          20656
## 4         1001     100.1          17056   20158       29556          20158
## 5         1504     150.4          17056   20711       29556          20711
## 6         1692     169.2          17056   20918       29556          20918
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


## Plot the outcomes as kernel densities

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


Plot the ranges behind the kernel density graphs.


```r
p.dist <- ggplot(results, aes(x = fam.net.capped)) + geom_histogram(aes(y = ..density..), 
    binwidth = density(results$fam.net.capped)$bw) + geom_area(data = ranges, 
    aes(x = premium, y = 0.0015), fill = "orange", alpha = 0.5) + geom_area(data = ranges, 
    aes(x = dedplusprem, y = 0.0015), fill = "yellow", alpha = 0.5) + geom_area(data = dxy, 
    aes(x = dx, y = ytail), fill = "green", colour = NA, alpha = 0.5) + geom_vline(aes(xintercept = fam.net.max), 
    color = "red") + geom_density(color = "blue") + facet_wrap(~plan.name, ncol = 1) + 
    scale_y_continuous(limits = c(0, 0.002)) + scale_x_continuous("Net family costs", 
    labels = dollar)

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
## 4  88380VA0720007
## 5  99663VA0140001
## 6  88380VA0720004
## 7  88380VA0720010
## 8  88380VA0720006
## 9  88380VA0720011
## 10 88380VA0880002
## 11 88380VA0720003
## 12 99663VA0140005
## 13 88380VA0720005
## 14 99663VA0140002
## 15 88380VA0720001
## 16 88380VA0720012
## 17 20507VA1190001
## 18 99663VA0140003
## 19 88380VA0720002
## 20 20507VA1180001
## 21 20507VA1170001
## 22 20507VA1180002
## 23 99663VA0140004
## 24 20507VA1170002
## 25 20507VA1180003
## 26 20507VA1190002
##                                                                                  plan.name
## 1                                          Anthem HealthKeepers Silver DirectAccess - cbky
## 2  Anthem Blue Cross and Blue Shield HealthKeepers Silver DirectAccess, a Multi-State Plan
## 3                                          Anthem HealthKeepers Silver DirectAccess - cbjs
## 4                                          Anthem HealthKeepers Silver DirectAccess - cbfs
## 5                                                                   Gold $5 Copay POS Plan
## 6                                    Anthem HealthKeepers Bronze DirectAccess w/HSA - cacd
## 7                                            Anthem HealthKeepers Gold DirectAccess - ccam
## 8                                          Anthem HealthKeepers Silver DirectAccess - cbau
## 9                             Anthem HealthKeepers Gold DirectAccess w/Child Dental - cdda
## 10   Anthem Blue Cross and Blue Shield HealthKeepers Gold DirectAccess, a Multi-State Plan
## 11                                         Anthem HealthKeepers Bronze DirectAccess - cabw
## 12                                                              Catastrophic 100% POS Plan
## 13                          Anthem HealthKeepers Bronze DirectAccess w/Child Dental - cdbw
## 14                                                                    Silver $10 Copay POS
## 15                                         Anthem HealthKeepers Bronze DirectAccess - caam
## 16                                          Anthem HealthKeepers Catastrophic DirectAccess
## 17                                                                        Vantage 3500 60%
## 18                                                               Bronze $10 Copay POS Plan
## 19                                   Anthem HealthKeepers Bronze DirectAccess w/HSA - caas
## 20                                                                     Vantage Equity 3750
## 21                                                                  Vantage FourSight 1000
## 22                                                                     Vantage Equity 4250
## 23                                                         Bronze Deductible Only POS Plan
## 24                                                              Vantage FourSight 3500 80%
## 25                                                                     Vantage Equity 4750
## 26                                                                            Vantage 6350
##     Min. 1st Qu. Median  Mean 3rd Qu.  Max.
## 1  14100   14100  14500 15100   15500 22100
## 2  14100   14100  14500 15100   15500 22100
## 3  15300   15300  15300 15700   15300 23500
## 4  15800   15800  15800 16100   15800 22600
## 5  15900   15900  15900 16400   16400 22400
## 6  16200   16200  16200 16400   16200 21100
## 7  14500   15500  16200 16300   17000 20000
## 8  17200   17200  17200 17300   17200 21500
## 9  15500   16500  17200 17300   18000 21000
## 10 15500   16500  17200 17300   18000 21000
## 11 17400   17400  17400 17500   17400 21100
## 12 17900   17900  17900 17900   17900 17900
## 13 18400   18400  18400 18500   18400 22100
## 14 18700   18700  18700 18900   18700 23900
## 15 19300   19300  19300 19300   19300 21000
## 16 19700   19700  19700 19700   19700 19700
## 17 19800   19800  19800 20000   19800 25300
## 18 19900   19900  19900 20000   19900 21400
## 19 20000   20000  20000 20000   20000 20700
## 20 20100   20100  20100 20300   20100 25100
## 21 19100   19700  20500 20800   21300 29600
## 22 20800   20800  20800 20900   20800 24800
## 23 20800   20800  20800 20800   20800 20800
## 24 20900   20900  20900 21100   20900 26400
## 25 21500   21500  21500 21600   21500 24500
## 26 23100   23100  23100 23100   23100 23100
```


## Probability mass instead of density


```r
sub.results <- subset(results, plan.id == results$plan.id[1])
sub.ranges <- subset(ranges, plan.id == results$plan.id[1])
sub.dxy <- subset(dxy, plan.name == sub.results$plan.name[1])

# geom_histogram() and facet_grid() do not work together, see
# https://groups.google.com/forum/#!topic/ggplot2/jGVzQi6Kmjk
costbin <- 1000
myhist <- function(df, colname, breaks) {
    h <- hist(df[[colname]], breaks = breaks, plot = F)
    xmin <- h$breaks[-length(h$breaks)]  # Min value for each bin
    xmax <- h$breaks[-1]  # Max value for each bin
    data.frame(xmin, xmax, count = h$counts, total = sum(h$counts), pct = h$counts/sum(h$counts))
}

freqs <- ddply(results, .(plan.id, plan.name), myhist, "fam.net.capped", breaks = seq(0, 
    max(results$fam.net.capped) + costbin, by = costbin))

p.dist <- ggplot(freqs, aes(x = xmin)) + geom_area(data = ranges, aes(x = premium, 
    y = 1), fill = "orange", alpha = 0.5) + geom_area(data = ranges, aes(x = dedplusprem, 
    y = 1), fill = "yellow", alpha = 0.5) + # geom_histogram(aes(y=..count../sum(..count..)), binwidth=2000,
# color='black', fill='gray', alpha=0.5) +
geom_bar(aes(y = pct), width = costbin, color = "black", fill = "gray", alpha = 0.5, 
    stat = "identity") + geom_vline(data = results, aes(xintercept = fam.net.max), 
    color = "red") + facet_wrap(~plan.name, ncol = 1) + scale_y_continuous(labels = percent_format()) + 
    scale_x_continuous("Net family costs", labels = dollar)

ggsave(filename = "distribution_mass.png", width = 6, height = 36)
```


<img src="distribution_mass.png" alt="Distribution curves" style="width: 200px;"/>
