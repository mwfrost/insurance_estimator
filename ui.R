library(shiny)
library(ggplot2)
require(plyr)
require(RCurl)
require(stringr)
require(reshape)
require(scales)
library(reshape2)
library(rhandsontable)
library(dplyr)
library(DT)
library(htmlwidgets)
library(devtools)
# install_github('htmlwidgets/sparkline')
library(sparkline)

shinyUI(fluidPage(
  
  headerPanel(
    "Insurance Estimator"
    ),
  
  
#  sidebarPanel(

   # selectInput('x', 'X', names(dataset))
    
#  ),
  
  mainPanel(
    p('How much you pay for health insurance and medical care depends on forces beyond your control
      as well as the choices you make when you buy insurance. This gadget is a tool for investigating
      your health care costs across hundreds of simulated years, based on the cost profiles of different
      plans.'),
    p('Find me on twitter ( @mattfrost ) if you have any questions or comments.'),
#    textInput("iST", "ST:", "VA"),
#    textInput("iCounty", "COUNTY:", "ALBEMARLE"),
    sliderInput('iSims', 'Number of simulations to run', min=100, max=500,
                value=250, step=50, round=0),
p('The annual costs of each plan are calculated from the following components: '),
tags$ul(
  tags$li("Annual premium costs, which depend on the family members covered."),
  tags$li("Pre-deductible costs, paid out of pocket until the deductible is met."),
  tags$li("Post-deductible costs, split with coinsurance unitl the out-of-pocket maximum is met.")
),
    h3("Who's Being Covered?"),
    rHandsontableOutput("tab.insured", width = 500),
    h3('Costs'),
    rHandsontableOutput("tab.costs", width=1200) 
#    h3('What Are the Plans?'),
#    rHandsontableOutput("tab.policies")

    
#    h3(textOutput("plan.caption")),
# h3('Distribution of Cost Outcomes'),
# textOutput("oSims"),
# p('The orange and yellow boxes show how much of the net costs are composed of premiums 
#       (orange box), deductible costs paid at 100% (yellow box), and post-deductible copays 
#       (the amount between the yellow box and the total cost). The red line is the functional
#       ceiling, or the sum of the premiums and the out-of-pocket maximum.'),
# p('The gray boxes show the likelihood of a certain net cost range. If the box with a height of 40% is 
#       around $20,000, it means that in 40% of the simulated years, the net cost was $20,000.'),
#    plotOutput("dist.plot", height=2600),

#     h3('Scenarios'),
#     tableOutput("tab.scenarios"),
#     h3('Results'),
#     tableOutput("tab.results"),
#     h3('Cost ranges'),
#     tableOutput("tab.ranges")
  )
  )
)