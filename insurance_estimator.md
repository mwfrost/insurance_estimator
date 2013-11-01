Insurance Cost Estimator
========================================================


```r
require(knitr)
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
source("func.r")
```



Declare available policies:


```r

policies <- rbind(data.frame(policy.name = "2014 CIGNA Choice Fund with HSA", 
    ind.deductible = 1500, fam.deductible = 3000, copay.pct = 0.8, ind.oop.max = 1500, 
    fam.oop.max = 3000, premium = (186.75 * 2)), data.frame(policy.name = "2014 CIGNA OAP (PPO) Standard Plan", 
    ind.deductible = 600, fam.deductible = 1200, copay.pct = 0.8, ind.oop.max = 600, 
    fam.oop.max = 1200, premium = (236.67 * 2)), data.frame(policy.name = "2013 CIGNA OAP (PPO) Gold Plan", 
    ind.deductible = 600, fam.deductible = 1200, copay.pct = 0.8, ind.oop.max = 2400, 
    fam.oop.max = 4800, premium = (166.67 * 2)))
policies$policy.id <- row.names(policies)
```


Declare family members:


```r
insured <- rbind(data.frame(Name = "Parent A", VisitBase = 250, SickRisk = 0.1, 
    CatRisk = 0.01), data.frame(Name = "Parent B", VisitBase = 500, SickRisk = 0.2, 
    CatRisk = 0.01), data.frame(Name = "Child C", VisitBase = 250, SickRisk = 0.4, 
    CatRisk = 0.01), data.frame(Name = "Child D", VisitBase = 250, SickRisk = 0.4, 
    CatRisk = 0.01), data.frame(Name = "Child E", VisitBase = 250, SickRisk = 0.4, 
    CatRisk = 0.01), data.frame(Name = "Child F", VisitBase = 250, SickRisk = 0.4, 
    CatRisk = 0.01), data.frame(Name = "Child CG", VisitBase = 250, SickRisk = 0.4, 
    CatRisk = 0.01))
```



Run a year with 500 iterations:


```r

costs <- yearcosts(insured, 500)
head(costs)
```

```
##       Name cost.iteration     name visit.cost sick.cost cat.cost
## 1 Parent A              1 Parent A      230.4         0        0
## 2 Parent A              2 Parent A      523.2         0        0
## 3 Parent A              3 Parent A      220.2       400        0
## 4 Parent A              4 Parent A      220.1       400        0
## 5 Parent A              5 Parent A      260.3         0        0
## 6 Parent A              6 Parent A      221.7         0        0
```

```r
subset(costs, cost.iteration == 1)
```

```
##          Name cost.iteration     name visit.cost sick.cost cat.cost
## 1    Parent A              1 Parent A      230.4         0        0
## 501  Parent B              1 Parent B      214.9         0        0
## 1001  Child C              1  Child C      254.9         0        0
## 1501  Child D              1  Child D      259.9         0        0
## 2001  Child E              1  Child E      293.5         0        0
## 2501  Child F              1  Child F      226.4         0        0
## 3001 Child CG              1 Child CG      312.6         0        0
```

```r
scenarios <- explode.scenarios(costs, policies)
head(scenarios)
```

```
##       Name cost.iteration     name visit.cost sick.cost cat.cost
## 1 Parent A              1 Parent A      230.4         0        0
## 2 Parent A              2 Parent A      523.2         0        0
## 3 Parent A              3 Parent A      220.2       400        0
## 4 Parent A              4 Parent A      220.1       400        0
## 5 Parent A              5 Parent A      260.3         0        0
## 6 Parent A              6 Parent A      221.7         0        0
##                       policy.name ind.deductible fam.deductible copay.pct
## 1 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
## 2 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
## 3 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
## 4 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
## 5 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
## 6 2014 CIGNA Choice Fund with HSA           1500           3000       0.8
##   ind.oop.max fam.oop.max premium policy.id
## 1        1500        3000   373.5         1
## 2        1500        3000   373.5         1
## 3        1500        3000   373.5         1
## 4        1500        3000   373.5         1
## 5        1500        3000   373.5         1
## 6        1500        3000   373.5         1
```

```r
str(scenarios)
```

```
## 'data.frame':	10500 obs. of  14 variables:
##  $ Name          : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ cost.iteration: int  1 2 3 4 5 6 7 8 9 10 ...
##  $ name          : Factor w/ 7 levels "Parent A","Parent B",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ visit.cost    : num  230 523 220 220 260 ...
##  $ sick.cost     : num  0 0 400 400 0 0 0 0 400 0 ...
##  $ cat.cost      : num  0 0 0 0 0 0 0 0 0 0 ...
##  $ policy.name   : Factor w/ 3 levels "2014 CIGNA Choice Fund with HSA",..: 1 1 1 1 1 1 1 1 1 1 ...
##  $ ind.deductible: num  1500 1500 1500 1500 1500 1500 1500 1500 1500 1500 ...
##  $ fam.deductible: num  3000 3000 3000 3000 3000 3000 3000 3000 3000 3000 ...
##  $ copay.pct     : num  0.8 0.8 0.8 0.8 0.8 0.8 0.8 0.8 0.8 0.8 ...
##  $ ind.oop.max   : num  1500 1500 1500 1500 1500 1500 1500 1500 1500 1500 ...
##  $ fam.oop.max   : num  3000 3000 3000 3000 3000 3000 3000 3000 3000 3000 ...
##  $ premium       : num  374 374 374 374 374 ...
##  $ policy.id     : chr  "1" "1" "1" "1" ...
```

```r
subset(scenarios, cost.iteration == 1)
```

```
##           Name cost.iteration     name visit.cost sick.cost cat.cost
## 1     Parent A              1 Parent A      230.4         0        0
## 501   Parent B              1 Parent B      214.9         0        0
## 1001   Child C              1  Child C      254.9         0        0
## 1501   Child D              1  Child D      259.9         0        0
## 2001   Child E              1  Child E      293.5         0        0
## 2501   Child F              1  Child F      226.4         0        0
## 3001  Child CG              1 Child CG      312.6         0        0
## 3501  Parent A              1 Parent A      230.4         0        0
## 4001  Parent B              1 Parent B      214.9         0        0
## 4501   Child C              1  Child C      254.9         0        0
## 5001   Child D              1  Child D      259.9         0        0
## 5501   Child E              1  Child E      293.5         0        0
## 6001   Child F              1  Child F      226.4         0        0
## 6501  Child CG              1 Child CG      312.6         0        0
## 7001  Parent A              1 Parent A      230.4         0        0
## 7501  Parent B              1 Parent B      214.9         0        0
## 8001   Child C              1  Child C      254.9         0        0
## 8501   Child D              1  Child D      259.9         0        0
## 9001   Child E              1  Child E      293.5         0        0
## 9501   Child F              1  Child F      226.4         0        0
## 10001 Child CG              1 Child CG      312.6         0        0
##                              policy.name ind.deductible fam.deductible
## 1        2014 CIGNA Choice Fund with HSA           1500           3000
## 501      2014 CIGNA Choice Fund with HSA           1500           3000
## 1001     2014 CIGNA Choice Fund with HSA           1500           3000
## 1501     2014 CIGNA Choice Fund with HSA           1500           3000
## 2001     2014 CIGNA Choice Fund with HSA           1500           3000
## 2501     2014 CIGNA Choice Fund with HSA           1500           3000
## 3001     2014 CIGNA Choice Fund with HSA           1500           3000
## 3501  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 4001  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 4501  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 5001  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 5501  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 6001  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 6501  2014 CIGNA OAP (PPO) Standard Plan            600           1200
## 7001      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 7501      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 8001      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 8501      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 9001      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 9501      2013 CIGNA OAP (PPO) Gold Plan            600           1200
## 10001     2013 CIGNA OAP (PPO) Gold Plan            600           1200
##       copay.pct ind.oop.max fam.oop.max premium policy.id
## 1           0.8        1500        3000   373.5         1
## 501         0.8        1500        3000   373.5         1
## 1001        0.8        1500        3000   373.5         1
## 1501        0.8        1500        3000   373.5         1
## 2001        0.8        1500        3000   373.5         1
## 2501        0.8        1500        3000   373.5         1
## 3001        0.8        1500        3000   373.5         1
## 3501        0.8         600        1200   473.3         2
## 4001        0.8         600        1200   473.3         2
## 4501        0.8         600        1200   473.3         2
## 5001        0.8         600        1200   473.3         2
## 5501        0.8         600        1200   473.3         2
## 6001        0.8         600        1200   473.3         2
## 6501        0.8         600        1200   473.3         2
## 7001        0.8        2400        4800   333.3         3
## 7501        0.8        2400        4800   333.3         3
## 8001        0.8        2400        4800   333.3         3
## 8501        0.8        2400        4800   333.3         3
## 9001        0.8        2400        4800   333.3         3
## 9501        0.8        2400        4800   333.3         3
## 10001       0.8        2400        4800   333.3         3
```

```r
results <- calculate.family(scenarios)
head(results)
```

```
##                      policy.name cost.iteration fam.costs fam.deductible
## 1 2013 CIGNA OAP (PPO) Gold Plan              1      1793           1200
## 2 2013 CIGNA OAP (PPO) Gold Plan              2      5847           1200
## 3 2013 CIGNA OAP (PPO) Gold Plan              3      4323           1200
## 4 2013 CIGNA OAP (PPO) Gold Plan              4      3685           1200
## 5 2013 CIGNA OAP (PPO) Gold Plan              5      2553           1200
## 6 2013 CIGNA OAP (PPO) Gold Plan              6      2861           1200
##   copay.pct premium fam.oop.max fam.post.ded fam.copay annual.premium
## 1       0.8   333.3        4800        592.5       474           4000
## 2       0.8   333.3        4800       4647.3      3718           4000
## 3       0.8   333.3        4800       3122.5      2498           4000
## 4       0.8   333.3        4800       2484.7      1988           4000
## 5       0.8   333.3        4800       1353.1      1082           4000
## 6       0.8   333.3        4800       1660.5      1328           4000
##   fam.net fam.net.max fam.net.capped
## 1    4474        8800           4474
## 2    7718        8800           7718
## 3    6498        8800           6498
## 4    5988        8800           5988
## 5    5083        8800           5083
## 6    5329        8800           5329
```


Plot the outcomes


```r
ggplot(results) + geom_density(aes(x = fam.net)) + geom_vline(aes(xintercept = fam.net.max), 
    color = "red") + facet_wrap(~policy.name, ncol = 1)
```

![plot of chunk plot.outcomes](figure/plot_outcomes1.png) 

```r

ggplot(results) + geom_histogram(aes(x = fam.net.capped), binwidth = 100) + 
    geom_vline(aes(xintercept = fam.net.max), color = "red") + facet_wrap(~policy.name, 
    ncol = 1)
```

![plot of chunk plot.outcomes](figure/plot_outcomes2.png) 


