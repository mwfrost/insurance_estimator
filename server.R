

source('func.r')

shinyServer(function(input, output) {

  
#######################################################################################
  # Specify the insured family

  insured <-
    rbind(
    data.frame(Name='Insured' , Include=TRUE, Age=40, VisitBase=150,  SickRisk=0.1, CatRisk=0.01)
    ,
    data.frame(Name='Spouse of Insured' , Include=TRUE, Age=40,  VisitBase=500,  SickRisk=0.2, CatRisk=0.01)
    ,
    data.frame(Name='Child A'  , Include=TRUE, Age=6, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child B' ,  Include=FALSE, Age=8, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child C' ,  Include=FALSE, Age = 10, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child D' ,  Include=FALSE, Age = 12, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child E' ,  Include=FALSE, Age = 14, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child F' ,  Include=FALSE, Age = 16, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    ,
    data.frame(Name='Child G' ,  Include=FALSE, Age = 18, VisitBase=250,  SickRisk=0.4, CatRisk=0.01)
    )
  row.names(insured) <- insured$Name
#  insured.reac <- reactiveValues(df=insured)

  output$tab.insured <- renderRHandsontable({
    rhandsontable(insured, rowHeaders = NULL, selectCallback = TRUE) %>%
      hot_table(highlightCol = TRUE, highlightRow = TRUE)
})

  #######################################################################################
  # Specify the available policies
  
  #dat.policies <- fetch.clean.policies('VA','Albemarle') %>% group_by(metal.level) %>% mutate(metal.rank=min_rank(prem.ind.30)) %>% filter(metal.rank==1) %>% select(-metal.rank) # truncated result set for testing
  
#  dat.policies <- read.csv('test_policies.csv', stringsAsFactors = FALSE)
 dat.policies <- read.csv('sample_plans.csv', stringsAsFactors = FALSE)
  
  policies <- reactive({
    dat.policies
  })
  
  output$tab.policies <- renderRHandsontable({
    rhandsontable(dat.policies  , rowHeaders = NULL, selectCallback = TRUE) %>%
      hot_table(highlightCol = TRUE, highlightRow = TRUE)
  })
  

  observeEvent(input$tab.policies$changes,{
    print('Changed policy specs')
    dat.policies <- input$tab.policies %>% hot_to_r()
    # update the Costs table to reflect the updated premium
    output$tab.costs <- renderTable({
      dat.policies[,c('plan.name',premium.column)]
    })
    return(dat.policies)
  })   
  

  # Calculate the family premiums

  output$tab.insured <- renderRHandsontable({
    rhandsontable(insured, rowHeaders = NULL, selectCallback = TRUE) %>%
      hot_table(highlightCol = TRUE, highlightRow = TRUE)
  })  
  
  output$tab.costs <- renderTable({
    # get the appropriate premium column from the family table as initially loaded.
    premium.column <-  get.premium.column(dat.policies, insured) 
    dat.policies[,c('plan.name',premium.column)]
  })
  
  observeEvent(input$tab.insured$changes,{
    print(paste("insured family members: ", sum(insured[,'Include'], na.rm=TRUE)))
    print("about to recalculate premiums")
    premium.column <- get.premium.column(dat.policies, input$tab.insured %>% hot_to_r() ) 
    output$tab.costs <- renderTable({
      dat.policies[,c('plan.name',premium.column)]
    })
  })  
  
  
  
  
  
  
  n <- reactive({
      input$iSims
      })
  
  output$oSims <- renderText({
    paste(n(), 'simulations run')
  })
#   
#   # Randomly generate some costs
  costs <- reactive({
      yearcosts(insured, n())
      })

  
  
  # The `scenarios` are unique combinations of each policy, family member, and iteration year
  
  scenarios <- reactive({
    explode.scenarios(costs(), plans())
  })
  
  output$tab.scenarios <- renderTable({
    head(scenarios())
  })

 # The `results` are the family-level aggregate costs for each iteration and policy combo
  results <- reactive({
    calculate.family(scenarios(), plans())
  })
  output$tab.results <- renderTable({
    head(results())
  })
#   
  
# Create some range spans so the x axis on each graph can show how much of the net costs are composed of premiums (orange box), deductible costs paid at 100% (yellow box), and post-deductible copays (the amount between the yellow box and the total cost).
#   costranges <- reactive({
#       ranges <- merge(plans(), prems())
#       # annualize the monthly premium
#       ranges$premium <- ranges$premium * 12
#       # Calculate the premium + deductible out-of-pocket baseline
#       ranges$dedplusprem <- ranges$med.ded.fam + ranges$premium 
#       dummyranges <- ranges
#       dummyranges$dedplusprem <- dummyranges$premium 
#       dummyranges$premium <- 0
#       ranges <- rbind(dummyranges, ranges)
#   })
#   output$tab.ranges <- renderTable({
#     head(costranges())
#   })
#   

# Calculate the frequencies from the costs 
  costbin <- 1000
  
# freqs <- reactive({
#     # geom_histogram() and facet_grid() do not work together, see
#     # https://groups.google.com/forum/#!topic/ggplot2/jGVzQi6Kmjk
#     myhist <- function(df, colname, breaks) {
#       h <- hist(df[[colname]], breaks = breaks, plot = F)
#       xmin <- h$breaks[-length(h$breaks)]  # Min value for each bin
#       xmax <- h$breaks[-1]                 # Max value for each bin
#       data.frame(xmin, xmax, count = h$counts, total = sum(h$counts), pct=h$counts/sum(h$counts))
#     }
#     
#     ddply(results(), .(plan.id, plan.name), myhist, "fam.net.capped", breaks = seq(0, max(results()$fam.net.capped)+costbin, by=costbin))
#   })


# output$dist.plot <- renderPlot({
#       print(
#         ggplot(freqs(), aes(x=xmin)) +
#         geom_area(data=costranges(), aes(x=premium , y=1) , fill="orange", alpha=0.5) + 
#         geom_area(data=costranges(), aes(x=dedplusprem, y=1) , fill="yellow", alpha=0.5) +
#         geom_bar(aes(y=pct),width=costbin, color="black", fill="gray", alpha=0.5,stat="identity") +
#         geom_vline(data=results(), aes(xintercept=fam.net.max),color='red') +
#         facet_wrap( ~ plan.name, ncol=1) +
#         scale_y_continuous(labels = percent_format()) +
#         scale_x_continuous("Net family costs", labels = dollar)
#       )
# }, height=2500)

# output$test.plot <- renderPlot({
#   # generate an rnorm distribution and plot it
#   test.dat <- data.frame(x=rnorm(100),y=rnorm(100))
#   print(ggplot(test.dat, aes(x=x, y=y)) + geom_point() )
# })  
#   
#   output$tab.results <- renderTable({
#     head(results())
#   })
#   
#   output$plan.caption <- renderText({
#     paste(nrow(policies()), "policies found for ", input$iCounty, ",", input$iST)
#   })
#   

  
#   output$plot <- renderPlot(function() {
#     ggplot()
#   }, height=700)
  
})