library(shiny)
library(ggplot2)
require(XML)
require(plyr)
require(RCurl)
require(stringr)
require(reshape)
require(scales)


shinyUI(pageWithSidebar(
  
  headerPanel("Insurance Estimator"),
  
  sidebarPanel(
    p('These will eventually become dropdown menus.'),
    textInput("iST", "ST:", "VA"),
    textInput("iCounty", "COUNTY:", "ALBEMARLE"),
    
    sliderInput('iSims', 'Number of simulations to run', min=100, max=1000,
                value=200, step=100, round=0)
    
   # selectInput('x', 'X', names(dataset))
    
  ),
  
  mainPanel(
    h3('Family Specs'),
    p('This is currently hard coded. The next step is obviously to let users specify a family.'),
    tableOutput("tab.insured"),
    h3('Distribution of Cost Outcomes'),
    textOutput("oSims"),
    p('The orange and yellow boxes show how much of the net costs are composed of premiums 
      (orange box), deductible costs paid at 100% (yellow box), and post-deductible copays 
      (the amount between the yellow box and the total cost). The red line is the functional
      ceiling, or the sum of the premiums and the out-of-pocket maximum.'),
    plotOutput("dist.plot", height=2600),
    h3(textOutput("plan.caption")),
    tableOutput("tab.plans"),
 #   h3('Premiums'),
#    tableOutput("tab.prems"),
    h3('Costs'),
    tableOutput("tab.costs"),
    h3('Scenarios'),
    tableOutput("tab.scenarios"),
    h3('Results'),
    tableOutput("tab.results"),
    h3('Cost ranges'),
    tableOutput("tab.ranges")
  )
  )
)