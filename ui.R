library(shiny)
library(ggplot2)
require(XML)
require(plyr)
require(RCurl)
require(stringr)
require(reshape)
require(scales)


shinyUI(pageWithSidebar(
  
  headerPanel(
    "Insurance Estimator"
    ),
  
  
  sidebarPanel(
    p('How much you pay for health insurance and medical care depends on forces beyond your control
      as well as the choices you make when you buy insurance. This gadget is a tool for investigating
      your health care costs across hundreds of simulated years, based on the cost profiles of different
      plans available via the Obamacare exchanges.'),
    p('This is a work in progress. Both the interface and the cost estimation process have a long way to go.'),
    p('Find me on twitter ( @mattfrost ) if you have any questions or comments.'),
    textInput("iST", "ST:", "VA"),
    textInput("iCounty", "COUNTY:", "ALBEMARLE"),
    p('The state and county input fields will eventually become dropdown menus.'),
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
    p('The gray boxes show the likelihood of a certain net cost range. If the box with a height of 40% is 
      around $20,000, it means that in 40% of the simulated years, the net cost was $20,000.'),
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