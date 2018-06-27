var Alexa = require('alexa-sdk');
const HELP_MESSAGE = 'How may I help you.';
const HELP_REPROMPT = 'Is there any thing else i can do for you';
const STOP_MESSAGE = 'Okay. Its my pleasure talking to you. Have a great day.';

var location_id;
var room_name;
var booking;
var itemsdesc;
var hotelloc;
var paperheadingslist=[];
var attractionarry=[];
var pricesarry=[];
var unitsarry=[];
var itemsdesc=[];
var itemsarry=[];
var itemscategory=[];
var states = {
    REQUEST: 'REQUEST', // User is trying to guess the number.
    ORDER: 'ORDER',
    RequestYesNo:'RequestYesNo',
   CHECKOUT:'CHECKOUT',
    RIDDLE:'RIDDLE',
    JOKES:'JOKES'
    
};

const newSessionHandler = {
     'LaunchRequest': function () 
    {


        this.emit(':ask','say your I.D',HELP_REPROMPT);
        this.emit('QuantityIntent');
    },
  'QuantityIntent': function () 
    {
        var logid = this.event.request.intent.slots.quant.value;
       
         login(logid,  myResult => 
                    {
                        const loginspeech = [
                            'Hi guest, I am happy to serve you. Please feel comfortable and go ahead with your requests.',
                            'Dear guest, Welcome to the hotel of choice among travellers. I am here to serve you. what can i do for you',
                            'Hi guest, welcome to your second home '+myResult.details.location_name+' . what can i do for you ',
                            'Hello guest, how are you doing. Its our pleasure having you with us. How may I help you. ',
                            'Welcome to '+myResult.details.location_name+' .  How may I assist you.'
                        ];
                        const loginarr = loginspeech;
                        const loginIndex = Math.floor(Math.random() * loginspeech.length);
                        const loginres = loginspeech[loginIndex];
                        this.handler.state = "REQUEST";
                        this.attributes.hotelval=myResult.details;
                        this.attributes.lname=myResult.details.location_name;
                        //let speechOutput = 'Welcome to '+myResult.details.location_name+' .  How may I help you.';
                        this.emit(':ask',loginres,loginres);
        
                    });
    },  
    'SessionEndedRequest':function(){
        //this.response.speak('unhandled');
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
     },
     
     
    'Unhandled': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.handler.state = "REQUEST";
        let speechOutput = 'Sorry I cannot hear you properly .  Can you please repeat it';
        this.emit(':ask',speechOutput,HELP_REPROMPT);
                      
    },
    'YesIntent':function()
    {
            this.handler.state = "REQUEST";
            let speechOutput = 'I can help you on amenities, restaurant, in room dining, billing, news headlines,  bullion market, market index, near by information, daily horoscope, health tips and many more.';
            this.emit(':ask',speechOutput,HELP_REPROMPT);
    
    },
     'NoIntent':function()
    {
        
       const stopspeech = [
                            
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
    }
    
};


const handlers = Alexa.CreateStateHandler(states.REQUEST,  {
     'iamcheckingout': function () 
        {
           this.attributes.helpstate='checkout';
            this.emit(':ask', 'Okay. I shall ask front desk to prepare your bills. Do you need luggage assistance. Should I send bell boy to you! ',HELP_REPROMPT);

      
        },
     'PanchangamIntent': function () 
        {
             this.attributes.helpstate='test';
                getpanchangam('nse', myResult => {
                       this.emit(':ask',myResult.panchangam.panchangam,HELP_REPROMPT);

            });
        },
      'HoroscopeIntent': function () 
        {
             this.attributes.helpstate='test';
           this.emit(':ask','tell me your zodiac sign',HELP_REPROMPT);
        },
        'HoroscopeDetailIntent': function () 
        {
            this.attributes.helpstate='test';
            var horoscope = this.event.request.intent.slots.horoscopeval.value;
            gethorpscope('nse', myResult => {
              for(let i in myResult.horoscopes){
                 console.log(horoscope+' '+myResult.horoscopes[i].name);
                // var num=myResult.currencies[i].inverse_one_inr
               if(horoscope.toLowerCase()==myResult.horoscopes[i].name.toLowerCase()){
                // myResult.currencies[i].inverse_one_inr=Math.ceil(Number(myResult.currencies[i].inverse_one_inr) * 100)/100;
                 this.emit(':ask',myResult.horoscopes[i].horoscope ,'how may i help you');
                // currencydata.push(myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees . <break time="0.5s"/> ')
             }
             }
            });
        },
        'GetQuotesIntent': function () 
        {
            this.attributes.helpstate='test';
            quotebycategoryid('nse', myResult => {
              console.log(myResult.quote.quote );
                 this.emit(':ask',myResult.quote.quote ,'how may i help you');
             });
             
          
        },
        'RepeatIntent': function () 
        {
            //this.attributes.helpstate='test';
           this.emit(':ask',this.attributes.rspeech,HELP_REPROMPT);
        },
           'BSEIntent': function () 
        {
            this.attributes.helpstate='test';
            getstockprices('bse', myResult => {
             
               // this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask',myResult.list.bse_description+' '+myResult.list.bse,'how may i help you');
            });
        },
          'NSEIntent': function () 
        {
            this.attributes.helpstate='test';
            getstockprices('nse', myResult => {
             
               // this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask',myResult.priceslist.nse_description+' '+myResult.priceslist.nse,'how may i help you');
            });
        },
          'CurrencyExchangeIntent': function () 
        {
            this.attributes.helpstate='test';
            getcurrencies('nse', myResult => {
             var currencydata=[];
             for(let i in myResult.currencies){
                // var num=myResult.currencies[i].inverse_one_inr
               
                 myResult.currencies[i].inverse_one_inr=Math.ceil(Number(myResult.currencies[i].inverse_one_inr) * 100)/100;
                 currencydata.push(myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees . <break time="0.5s"/> ')
             }
               // this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask','the exchange rate of one '+sayArray(currencydata,'and'),'how may i help you');
            });
        },
           'RupeeConversionRates': function () 
        {
            this.attributes.helpstate='test';
            var curvalinfo = this.event.request.intent.slots.curval.value;
           getcurrencies('nse', myResult => {
             var currencydata=[];
             for(let i in myResult.currencies){
                 console.log(curvalinfo);
                // var num=myResult.currencies[i].inverse_one_inr
               if(curvalinfo==myResult.currencies[i].country_currency.toLowerCase()){
                 myResult.currencies[i].inverse_one_inr=Math.ceil(Number(myResult.currencies[i].inverse_one_inr) * 100)/100;
                 this.emit(':ask','the exchange rate of one '+myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees .' ,'how may i help you');
                // currencydata.push(myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees . <break time="0.5s"/> ')
             }
             }
               // this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                
            });
        },
    'QuizIntent': function () 
        {
            this.handler.state = "REQUEST";
           this.attributes.quizcount=0;
		   this.attributes.helpstate='quiz';
             getquiz('text', myResult => {
                 console.log(myResult);
                 this.attributes.helpstate='quiz';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 this.attributes.rspeech='ok  . <break time="0.5s"/><emphasis level="moderate"> '+this.attributes.quizquestion.replace(/[,]/g,'</emphasis><break time="0.5s"/> ')+' . <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4
                 this.emit(':ask','ok . lets play the quiz . <break time="0.5s"/><emphasis level="moderate">  '+this.attributes.quizquestion+' . </emphasis> <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4,'please say the answer');

            });
           // this.emit(':ask','I shall ask you a riddle and you have to say the answer. Shall we start. Are you ready?',HELP_REPROMPT);
        },
     'RiddlesIntent': function () 
        {
            this.handler.state = "RIDDLE";
           this.attributes.riddlecount=0;
		   this.attributes.helpstate='riddle';
             getriddles('text', myResult => {
                this.attributes.helpstate='riddle';
                this.attributes.riddlequestion= myResult.list.riddle_question;
                this.attributes.riddleanswer=myResult.list.riddle_answer;
                this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/><emphasis level="moderate"> '+this.attributes.riddlequestion+' . </emphasis>  <break time="1.0s"/> ';
                this.emit(':ask','ok . here is the riddle for you . <break time="0.5s"/> <emphasis level="moderate">'+this.attributes.riddlequestion+' .  </emphasis> <break time="1.0s"/> ','please say the answer');
            });
        },
        
         'RiddlesAnswerIntent': function () {
             var repeatspeech;
            this.handler.state = "REQUEST";
        if(this.attributes.helpstate=='quiz')
        {
            this.attributes.quizcount=this.attributes.quizcount+1;
             getquiz('text', myResult => {
                 console.log(myResult);
                 var prevquizanswer=this.attributes.quizanswer
                 this.attributes.helpstate='quiz';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 if(this.attributes.quizcount==4){
                     repeatspeech=prevquizanswer +'.  <break time="1s"/> Do you want to play more';
                     this.attributes.rspeech=repeatspeech;
                     this.emit(':ask',repeatspeech,'Do you want to play more');
                 }else{
                     repeatspeech=prevquizanswer+'  . <break time="0.5s"/> <emphasis level="moderate">  next'+this.attributes.quizquestion+' . </emphasis>  <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4;
                    this.attributes.rspeech=repeatspeech;
                    this.emit(':ask',repeatspeech,'please say the answer');

                 }

            });
            
            
        }else{
    		this.attributes.helpstate='riddle';
    		this.attributes.riddlecount= this.attributes.riddlecount+1;
           getriddles('text', myResult => {
            this.attributes.riddlequestion= myResult.list.riddle_question;
            var prevanswer=this.attributes.riddleanswer;
            this.attributes.riddleanswer=myResult.list.riddle_answer;
            if(this.attributes.riddlecount==4){
                 repeatspeech='answer is '+ prevanswer +'.  <break time="1s"/> Do you want to play more';
                 this.attributes.rspeech=repeatspeech;
                 this.emit(':ask',repeatspeech,'Do you want to play more');
            }
            else{
                repeatspeech='ok .  answer is . <break time="0.5s"/> '+ prevanswer +' . <break time="1.0s"/> The next riddle is <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/>';
                this.attributes.rspeech=repeatspeech;
                this.emit(':ask',repeatspeech,'please say the answer');
            }
            //this.emit(':ask',repeatspeech,'please say the answer');

           // this.emit(':ask',myResult.list.riddle_question,'please say the answer?');
            });
        }
        },
        'WeatherIntent':function(){
            //this.handler.state = "REQUEST";
			this.attributes.helpstate='test';
               getweather('gold', myResult => {
               
                  var mintemp= myResult.weather.main.temp_min - 273.15;
                  var maxtemp=myResult.weather.main.temp_max - 273.15;
                   // goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                 mintemp= Math.ceil(Number(mintemp) * 100)/100;
                 maxtemp=Math.ceil(Number(maxtemp) * 100)/100;
                   this.emit(':ask','Todays weather forecast for location '+this.attributes.lname+' . temperatures <break time="0.5s"/> minimum :' +mintemp+ ' degrees celcius <break time="0.5s"/>  maximum :' +maxtemp+' degrees celcius . <break time="0.5s"/> humidity :'+ myResult.weather.main.humidity +'  percent . <break time="0.5s"/> and '+myResult.weather.weather[0].description+' .  <break time="0.5s"/>',HELP_REPROMPT);
                });
        },
        'GoldIntent':function(){
            
			this.attributes.helpstate='test';
               getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                     //goldinfo.push(myResult.list[i]['carat']);
                    goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
         'SilverIntent':function(){
			 this.attributes.helpstate='test';
               getgoldandsilverprices('silver', myResult => {
                  
                   var silverprice= myResult.priceslist.weight +'  silver at bangalore is '+ myResult.priceslist.bangalore +' rupees, chennai is '+ myResult.priceslist.chennai+' rupees , delhi is '+ myResult.priceslist.delhi + ' rupees, hyderabad is '+ myResult.priceslist.hyderabad+ ' rupees, kerala is '+myResult.priceslist.kerala+' rupees and mumbai is '+myResult.priceslist.mumbai+' rupees. <break time="1s"/>';
                   this.emit(':ask','the rate of '+ silverprice,HELP_REPROMPT);
                });
        },
        'GoldCityIntent':function(){
			this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.cityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
              getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                      
                      if(myResult.list[i][cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                            goldinfo.push( myResult.list[i].carat +' carat gold at '+ cityname+' is ' + myResult.list[i][cityname] +' rupees');
                      }
                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
        
         'SilverCityIntent':function(){
			 this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.silvercityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
            var silverinfo;
              getgoldandsilverprices('silver', myResult => {
               
                 
                      
                      if(myResult.priceslist[cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                           silverinfo= myResult.priceslist.weight +' silver at '+ cityname+' is ' + myResult.priceslist[cityname] +' rupees';
                      }
                  
                   this.emit(':ask','the rate of '+silverinfo,HELP_REPROMPT);
                });
        },
         'AbbrevationIntent': function () { 
            var abbrv = this.event.request.intent.slots.abbrval.value;
                this.handler.state = "REQUEST";
           this.attributes.helpstate='test';
               
                    getabbrevationdetails(abbrv, myResult => {
                       
                        //console.log(jokesarry);
                       myResult.abbrevation.abbreviation_description=myResult.abbrevation.abbreviation_description.replace('/','or');
                        this.emit(':ask', 'the abbrevation of '+abbrv+' is  <break time="0.5s"/>'+myResult.abbrevation.abbreviation_description ,'How may i help you');
                    });


                
               // this.handler.state = "RIDDLE";
        },
     'GetJokes': function () { 
	 this.attributes.helpstate='jokes';
                this.handler.state = "JOKES";
          
               
                    getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });


                
               // this.handler.state = "RIDDLE";
        },
        'HealthTipsIntent': function () {
			this.attributes.helpstate='test';
                this.handler.state = "REQUEST";
                                    var riddlecat=[];

                gethealthtips('text', myResult => {
                   this.emit(':ask',myResult.list.health_tip_description,HELP_REPROMPT);
                });
               // this.handler.state = "RIDDLE";
        },
    
      'InfoIntent': function () {
		  this.attributes.helpstate='test';
                this.handler.state = "REQUEST";
                getinfoheadings('text', myResult => {
                    
                });
                this.emit(':ask','Okay. I have the nearby information of atm, bank,spa and many more. if you need any information please say nearby bank , nearby atm or so?',HELP_REPROMPT);
        },
        'NearByInfoVal': function () {
            this.attributes.helpstate='test';
            var nearinfo = this.event.request.intent.slots.infoval.value;
            console.log(nearinfo);
            if(nearinfo=='PUB'.toLowerCase()){
                nearinfo='NIGHT CLUB';
            }else if(nearinfo=='POLICE STATION'.toLowerCase() || nearinfo=='POLICE'.toLowerCase()){
                console.log(nearinfo);
                nearinfo='POLICE STATTION';
                console.log(nearinfo);
            }else if(nearinfo=='street food'.toLowerCase() || nearinfo=='FOOD'.toLowerCase()){
                nearinfo='FOOD';
            }else if(nearinfo=='Hindu temple'.toLowerCase() || nearinfo=='TEMPLES'.toLowerCase()){
                console.log('hii');
                nearinfo='HINDU TEMPLE';
                console.log(nearinfo);
            }else if(nearinfo=='vegetable markets'){
                nearinfo='HOME GOODS STORE';
            }else if(nearinfo=="Petrol Bunk".toLowerCase()|| nearinfo=="Petrol Pump".toLowerCase()){
                 nearinfo='GAS STATION';
            }else if(nearinfo=="metro station"|| nearinfo=="local train station"){
                 nearinfo='TRANSIT STATION';
            }
            else{
                 //nearinfo=nearinfo;
            }
            getinfonearby(this.attributes.hotelval,nearinfo, myResult => {
                            this.handler.state = "REQUEST";
                          
                           var nearestinfolist=[];
                           console.log(myResult.news);
                          var count=0;
                          if(myResult.nearbyinfo){
                               for(let i of myResult.nearbyinfo)
                               {
                                   
                                   if(count<5)
                                   {
                                     console.log(i.alias_name);
                                     i.name=i.name.replace('&','and');
                                     i.name=i.name.replace("'",'');
                                     var desc = i.desc.split(",", 3);
                                     if(desc.length==1){
                                         var desc=i.desc;
                                     }else{
                                          var desc = i.desc.split(",", 3);
                                           var desc = desc.splice(1);
                                     }
                                     nearestinfolist.push( i.name +'. located at '+ desc +'.  distance '+ i.distance+' . drive around '+ i.duration + ' from your hotel <break time="1s"/>');
                                     count=count+1;
                                }
                                
                            }
                           console.log(nearestinfolist);
                             this.emit(':ask','here is some nearby '+nearinfo+' information for you. '+ sayArray(nearestinfolist,'and')+'. thats all the information i have about '+nearinfo,HELP_REPROMPT);
                }else{
                    this.emit(':ask', 'sorry . currently i do not have the information of '+nearinfo,HELP_REPROMPT);
                }
            });  
            
            
            
              
        },
    
   'NewsPaperIntent': function () {
       this.attributes.helpstate='test';
            getnewspapers('data', myResult => {
            this.handler.state = "REQUEST";
           // this.emit(':ask',housekeepingres,HELP_REPROMPT);
           var newspaperslist=[];
           for(let i of myResult.papers){
               newspaperslist.push( i.paper_name +' <break time="0.3s"/>');
           }
           console.log(newspaperslist);
             this.emit(':ask','Okay. I have the headlines for '+ sayArray(newspaperslist,  'and')+ '. Which news paper headlines do you want me to read?',HELP_REPROMPT);

            });  
            
            
            
              
        },
         'SelectPaperIntent': function () {
			 this.attributes.helpstate='test';
                   var paper = this.event.request.intent.slots.papername.value;
                this.attributes.papername=paper;
            getcitiesbypaper(paper, myResult => {
                this.handler.state = "REQUEST";
               // this.emit(':ask',housekeepingres,HELP_REPROMPT);
                    var hindustateslist=[];
                    var hinduotherlist=[];
                    var timesotherlist=[];
                    var timescities=[];
                    var citieslist=[];
                    console.log('hii'+paper);
                    if(paper.toLowerCase()=='hindu')
                    {
                        for(let i of myResult.cities)
                        {
                            if(i.category==1){
                                    hindustateslist.push(i.name +' <break time="0.3s"/> ');
                            }else{
                                    hinduotherlist.push(i.name +' <break time="0.3s"/> ');
                            }
                        }
                            this.emit(':ask','I have the information of  '+ sayArray(hinduotherlist,  ',')+' and states like '+sayArray(hindustateslist,  'and')+ '. Please say state name , sports or pan india. I shall read accordingly',HELP_REPROMPT);
                    }else if(paper.toLowerCase()=='indian express')
                    {
                        for(let i of myResult.cities)
                        {
                                    citieslist.push(i.name +' <break time="0.3s"/> ');
                        }
                            this.emit(':ask','I have the information of  '+ sayArray(citieslist,  'and')+ '. Please say  world, pan india or technology. I shall read accordingly',HELP_REPROMPT);
                    }else{
                        for(let i of myResult.cities)
                        {
                            if(i.category==4){
                                    timescities.push(i.name +' <break time="0.3s"/> ');
                            }else{
                                    timesotherlist.push(i.name +' <break time="0.3s"/> ');
                            }
                        }
                        this.emit(':ask','I have the information of  '+ sayArray(timesotherlist,  ',')+' and cities like '+sayArray(timescities,  'and')+ '. Please say city name, business or entertainment. I shall read accordingly',HELP_REPROMPT);
                    }

            });  
            
            
            
           
        },
         'NewsInCityIntent': function () {
			 this.attributes.helpstate='test';
                   var citynews = this.event.request.intent.slots.citynews.value;
                       paperheadingslist=[];

                    getnewsbycity(this.attributes.papername,citynews, myResult => {
                        
                         for(let i of myResult.news)
                            {
                                console.log(myResult.news.length);
                               if(i.desc){
                                   i.heading=i.heading+' . '+i.desc;
                                   i.heading= i.heading.replace(/[,]/g,'<break time="0.5s"/> ');
                                }
                                if(paperheadingslist.length<15)
                               paperheadingslist.push( i.heading+' <break time="1s"/> ');

                           }
                       if(myResult.news)
                       {
                            this.handler.state = "REQUEST";
                            console.log(paperheadingslist);
                            this.emit(':ask',' news courtesy from '+this.attributes.papername+' . Here are the headlines of  '+ citynews +' .  '+ sayArray(paperheadingslist,  'and')+' . That is all I have for ' + citynews +' . ',HELP_REPROMPT);

                       }else
                       {
                            this.emit(':ask','Sorry. currently i  do not have that information. Do you want any thing else',HELP_REPROMPT);
                       }
                  
          
            }); 
            
            
            
              
        },
 
     'HousekeepingIntent': function () {
		 this.attributes.helpstate='test';
        booking='housekeeping';
            var desc = this.event.request.intent.slots.desc.value;
            this.attributes.housekeeping=desc;
            this.attributes.requesttype='housekeeping';
             //this.handler.state("RequestYesNo");
            
             const housekeepingdata = [
            'Do not worry. I will help you with it. Your request will be attended shortly. ',
            'I have asked the housekeeping to attend your request immediately. ',
            'sure. Housekeeping executive will assist you now on this.  ',
            
            ];
            const housekeepingArr = housekeepingdata;
            const housekeepingIndex = Math.floor(Math.random() * housekeepingArr.length);
            const housekeepingres = housekeepingArr[housekeepingIndex];
            Request(this.attributes.housekeeping,this.attributes.hotelval , myResult => {
            this.handler.state = "REQUEST";
           // this.emit(':ask',housekeepingres,HELP_REPROMPT);
             this.emit(':ask',housekeepingres,HELP_REPROMPT);

            });  
              
        },
    'DirectOrderIntent': function () {
		this.attributes.helpstate='test';
        booking='directorder';
            var directorder = this.event.request.intent.slots.directorder.value;
            this.attributes.directorder=directorder;
            this.attributes.requesttype='directorder';
             //this.handler.state("RequestYesNo");
            this.handler.state = "RequestYesNo";
            this.emit(':ask','you asked for '+ directorder +' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
              
        },
     'TravelDeskIntent': function () {
		 this.attributes.helpstate='test';
            var traveldesc = this.event.request.intent.slots.traveldesc.value;
            this.attributes.traveldesk=traveldesc;
            this.attributes.requesttype='traveldesk';
             //this.handler.state("RequestYesNo");
             traveldesc=traveldesc.replace('me','you');
             traveldesc=traveldesc.replace('my','your');
            this.handler.state = "RequestYesNo";
            this.emit(':ask','you asked travel desk to '+ traveldesc +' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the request ',HELP_REPROMPT);
        
           
        },
         'FrontDeskIntent': function () {
             this.attributes.helpstate='test';
            booking='frontdesk';
            var frontdeskreq = this.event.request.intent.slots.frontdeskreq.value;
            this.attributes.frontdesk=frontdeskreq;
            this.attributes.requesttype='frontdesk';
           // this.handler.state("RequestYesNo");
            frontdeskreq=frontdeskreq.replace('me','you');
            frontdeskreq=frontdeskreq.replace('my','your');
            this.handler.state = "RequestYesNo";
            this.emit(':ask','you asked front desk to '+ frontdeskreq +' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the request ',HELP_REPROMPT);
        
           
        },
        'MaintainenceIntent': function () {
             this.attributes.helpstate='test';
            booking='maintainence';
            var mntval = this.event.request.intent.slots.mntvalue.value;
            this.attributes.maintainence=mntval;
            this.attributes.requesttype='maintainence';
           //this.handler.state("RequestYesNo");
            mntval=mntval.replace('me','you');
            mntval=mntval.replace('my','your');
            this.handler.state = "RequestYesNo";
            this.emit(':ask','you asked maintainence to '+ mntval +' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the request ',HELP_REPROMPT);
        
           
        },
        'RestaurentCategoryIntent':function()
     {
           // var menuval = this.event.request.intent.slots.menuval.value;
           this.attributes.helpstate='test';
            getcategories('data',  myResult => 
            {
                var categ=[];

                for(let i in myResult.categories){
                    categ.push(myResult.categories[i].name);
                    
                }
                let speechOutput = 'what would you like to order from menu';
                this.emit(':ask',speechOutput,HELP_REPROMPT);

            });
     },
          'Menu':function()
     {
		 this.attributes.helpstate='test';
            var menuval = this.event.request.intent.slots.menuval.value;
            this.attributes.categoryval=menuval;
            booking='order';
          
                   if(menuval){
                        MenuArray(menuval,this.attributes.hotelval, myResult => 
                        {
                            if(myResult.length==1){
                                this.emitWithState("OrderIntent");
                                this.emit(':ask',menuval+' items are '+myResult[0]+' . what would you like to order',HELP_REPROMPT);  
                            }else{
                                this.attributes.menucateg=myResult;
                                let speechOutput = menuval+' items are ' + orderArray(myResult,  'and')+' . what would you like to order';
                                this.emit(':ask',speechOutput,HELP_REPROMPT);
                            }
                        });
                   }
                   else
                   {
                        getcategories('data',  myResult => 
                        {
                            var categ=[];
                            for(let i in myResult.categories)
                            {
                                categ.push(myResult.categories[i].name);
                            }
                            let speechOutput = ' What would you like to order from the menu. ';
                            this.emit(':ask',speechOutput,HELP_REPROMPT);
            
                        });
                   }
           
     },
    'DirectResaturentOrderIntent':function(){
		this.attributes.helpstate='test';
        var oitem = this.event.request.intent.slots.orderitem.value;
        var measure=this.event.request.intent.slots.measure.value;
        var quantity =this.event.request.intent.slots.orderval.value;
        var oitem1 = this.event.request.intent.slots.orderitemone.value;
        var measure1=this.event.request.intent.slots.measureone.value;
        var quantity1 =this.event.request.intent.slots.ordervalone.value;
        var oitem2 = this.event.request.intent.slots.orderitemtwo.value;
        var measure2=this.event.request.intent.slots.measuretwo.value;
        var quantity2 =this.event.request.intent.slots.ordervaltwo.value;
        var oitem3 = this.event.request.intent.slots.orderitemthree.value;
        var measure3=this.event.request.intent.slots.measurethree.value;
        var quantity3 =this.event.request.intent.slots.ordervalthree.value;
        
        
        if(quantity3)
        {
            this.attributes.directorder='you asked for '+ quantity +'  '+oitem+', '+ quantity1 +'  '+oitem1+' ,'+ quantity2 +'  '+oitem2+' and '+ quantity3 +'  '+oitem3;
            this.attributes.requesttype='directorder';
             //this.handler.state("RequestYesNo");
            this.handler.state = "RequestYesNo";
            this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
        }else{
                if(quantity2){
                    this.attributes.directorder='you asked for '+ quantity +'  '+oitem+' '+ quantity1 +'  '+oitem1+' and '+ quantity2 +'  '+oitem2;
                    this.attributes.requesttype='directorder';
                    this.handler.state = "RequestYesNo";
                    this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                }
                else
                {
                        if(quantity1){
                                this.attributes.directorder='you asked for '+ quantity +'  '+oitem+' and '+ quantity1 +'  '+oitem1;
                                this.attributes.requesttype='directorder';
                                //this.handler.state("RequestYesNo");
                                this.handler.state = "RequestYesNo";
                                this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                        }else{
                                this.attributes.directorder='you asked for '+ quantity +'  '+oitem;
                                this.attributes.requesttype='directorder';
                                //this.handler.state("RequestYesNo");
                                this.handler.state = "RequestYesNo";
                                this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                        }
               }
        }
        
               /* SearchItemsArray(this.attributes.hotelval,  myResult => 
                                    {
                                        booking='order';
                                        var cst=0;
                                        for(let i in myResult.items)
                                        {
                                        
                                            if(myResult.items[i].item_name.replace(/ /g,'').toLowerCase()==oitem.replace(/ /g,'').toLowerCase())
                                            {
                                                this.attributes.category=myResult.items[i].name;
                                                this.attributes.itemname=myResult.items[i].item_name;
                                                itemsarry.push(myResult.items[i].item_name);
                                                pricesarry.push(myResult.items[i].cost);
                                                unitsarry.push(quantity);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                this.attributes.unitslist=unitsarry;
                                                console.log('second');
                                                console.log(myResult.items[i].item_name);
                                                this.handler.state = "ORDER";
                                                    
                                                    this.emit(':ask',myResult.items[i].item_description+' . the cost of one '+ myResult.items[i].messure+' '+myResult.items[i].item_name+ ' is '+myResult.items[i].cost+' rupees.is there anything else you would like to add to this order?' ,HELP_REPROMPT);
                                            }else{
                                             cst=cst+1;
                                                if(cst==myResult.items.length){
                                                    //itemsarry=[];
                                                    //pricesarry=[];
                                                    //unitsarry=[];
                                                    //itemsdesc=[];
                                                    this.handler.state = "REQUEST";
                                                let speechOutput = 'ok .  What would you like to order from the menu.  ';
                                                this.emit(':ask',speechOutput,HELP_REPROMPT);                                            }
                                        
                                        }
                                    }
                                    
                                    });*/
        
    },
    'OrderIntent':function()
     {
          this.attributes.helpstate='test';
           var item = this.event.request.intent.slots.mItem.value;
           var value =this.event.request.intent.slots.mVal.value;
           
             booking='order';       
          
                   // this.emit(':ask','category')
                  booking='order';
                   if(item)
                   {
                            var cmt=0;
                            this.attributes.menucateg='';
                                    SearchItemsArray(this.attributes.hotelval,  myResult => 
                                    {
                                        booking='order';
                                        var cst=0;
                                        for(let i in myResult.items)
                                        {
                                        
                                            if(myResult.items[i].item_name.replace(/ /g,'').toLowerCase()==item.replace(/ /g,'').toLowerCase())
                                            {
                                                this.attributes.category=myResult.items[i].name;
                                                this.attributes.itemname=myResult.items[i].item_name;
                                                itemsarry.push(myResult.items[i].item_name);
                                                pricesarry.push(myResult.items[i].cost);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                console.log('second');
                                                console.log(myResult.items[i].item_name);
                                                this.handler.state = "ORDER";
                                                    
                                                    this.emit(':ask',myResult.items[i].item_description+' . the cost of one '+ myResult.items[i].messure+' '+myResult.items[i].item_name+ ' is '+myResult.items[i].cost+' rupees. How many '+ myResult.items[i].messure+'s Do you want to order?' ,HELP_REPROMPT);
                                            }else{
                                             cst=cst+1;
                                                if(cst==myResult.items.length){
                                                    //itemsarry=[];
                                                    //pricesarry=[];
                                                    //unitsarry=[];
                                                    //itemsdesc=[];
                                                    this.handler.state = "REQUEST";
                                                let speechOutput = ' Hmmm.  <break time="0.5s"/> I am sorry.  <break time="0.5s"/> We don’t have that dish with us now. Can you Please select a dish from the restaurant menu.';
                                                this.emit(':ask',speechOutput,HELP_REPROMPT);                                           
                                                }
                                        
                                        }
                                    }
                                    
                                    });
                             
                   
                    }else{
                        var newval=0;
                        var cnt=0;
                        booking='order';
						
                        if(value){
                                 if(value<10){
                                   value='0'+value; 
                                }
                                var cntval=0;
                              for(let i in itemsdesc.items)
                            {
                                //this.emit(':ask',i+1,HELP_REPROMPT);
                                
                                 newval=parseInt(i)+1;
                                 if(newval==value)
                                 {
                                    this.attributes.category=itemsdesc.items[i].name;
                                                this.attributes.itemname=itemsdesc.items[i].item_name;
                                                itemsarry.push(itemsdesc.items[i].item_name);
                                                pricesarry.push(itemsdesc.items[i].cost);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                console.log('valarry');
                                                console.log(itemsdesc.items[i].item_name);
                                                this.handler.state = "ORDER";
                                   // cntval=cntval+1;
                                    this.emit(':ask',itemsdesc.items[i].item_description+' . the cost of one'+ itemsdesc.items[i].messure+' '+itemsdesc.items[i].item_name+ ' is '+itemsdesc.items[i].cost+' rupees. How many ' + itemsdesc.items[i].messure+'s Do you want to order?' ,HELP_REPROMPT);
                                }else{
                                     cnt=cnt+1;
                                    if(cnt==itemsdesc.items.length)
                                    {
                                        booking='order';
                                        //itemsarry=[];
                                       // pricesarry=[];
                                       // unitsarry=[];
                                       // itemsdesc=[];
                                       this.handler.state = "REQUEST";
                                        let speechOutput = ' Hmmm.  <break time="0.5s"/> I am sorry.  <break time="0.5s"/> We don’t have that dish with us now. Can you Please select a dish from the restaurant menu ';
                                        this.emit(':ask',speechOutput,HELP_REPROMPT); 
                                    
                                    }
                                }
                            }
                        
                    }
                   
                        
                        
                    }           
                        
     },
         
    'Cusine': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='cusine'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                    headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Business center information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    
     'BusinessIntent': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Business center'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                    headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Business center information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'ThingsToDo': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='things to do'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description+ '. <break time="1.5s"/>');
                             
                        }
                     let speechOutput = 'Things to do  here are ' + sayArray(headingsarry,  'and')+ ' .  <break time="1s"/>' + sayArray(headingsdesc, 'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'Shopping': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Shopping'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description+  '<break time="1.5s"/>');
                        }
                     let speechOutput = 'Near by shopping places here are ' + sayArray(headingsarry,  'and')+ '. <break time="1s"/> ' + sayArray(headingsdesc,  'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'ThingsToBuy': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='things to buy'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description +  '. <break time="1.5s"/>');
                        }
                     let speechOutput = 'Things to buy are ' + sayArray(headingsarry,  'and') + ' . <break time="0.5s"/> ' + sayArray(headingsdesc, 'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'NearByTouristPlaces': function () {
        //var id = this.event.request.intent.slots.saloon_id.value;
        booking='information';
        this.attributes.helpstate='test';
        var headingsarry=[];
        var output="";
         dataSearch('myData',  myResult => {
           attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='nearby tourist places'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                              headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description+ '. <break time="1.5s"/>');
                        }
                     let speechOutput = 'Near by tourist places here are ' + sayArray(headingsarry,  'and')+ '. <break time="0.5s"/> ' + sayArray(headingsdesc, 'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'PlacesToVisit': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='places to visit'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description+  '. <break time="1.5s"/>');
                        }
                     let speechOutput = 'Near by visiting places here are ' + sayArray(headingsarry,  'and')+ '. <break time="0.5s"/>' + sayArray(headingsdesc, 'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
         'AboutThisHotel': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='About this hotel'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Hotel information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'HistoryOfCity': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='history of the city'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Hotel information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'AboutThisCity': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='about this city'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'City information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'HeadingsIntent': function () {
         this.attributes.helpstate='test';
         var id = this.event.request.intent.slots.heading_id.value;
                  //var optionval = this.event.request.intent.slots.list.value;
	    booking='information';

           var output;
                 //console.log(attractionarry);     

               if(attractionarry.length>0)
               {
                   
           
                         if(attractionarry.length==1){
                              if(attractionarry[0].name){
                                    output=attractionarry[0].description+' please note that '+attractionarry[0].name;
                                }else{
                                     output=attractionarry[0].description;
                                }
                               
                                    this.emit(':ask',output,HELP_REPROMPT);
                            
                         }
                    else 
                    {
                        let hcount=0;
                           
                                 
                                 for(let res in attractionarry)
                                    { 
                                        console.log(':ask',attractionarry[res].heading.replace(/ /g,'').toLowerCase()+' '+id.replace(/ /g,'').toLowerCase());
                                         if(attractionarry[res].heading.replace(/ /g,'').toLowerCase()==id.replace(/ /g,'').toLowerCase())
                                        {
                                       // this.emit(':ask',attractionarry[res].description);
                                            if(attractionarry[res].name){
                                                
                                                    var speechop=attractionarry[res].description+' please note that '+attractionarry[res].name;
                                                    this.emit(':ask',speechop,HELP_REPROMPT);
                                                }else{
                                                     var speechop=attractionarry[res].description;
                                                      this.emit(':ask',speechop,HELP_REPROMPT);
                                                }
                                        }else{
                                            hcount=hcount+1;
                                            if(hcount==attractionarry.length){
                                                this.emit(':ask','Sorry. please try to say it differently',HELP_REPROMPT);
                                            }
                                        }
                                    }
                        
                    }     
                                        
                            }else{
                   this.emit(':ask','Sorry. please try to say it differently',HELP_REPROMPT);
               } 
                    
                        
                    
                 
                  
                   // this.response.speak(id);
                
             
                    
                    
                    
    },
    
    'Currencyandforex': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Currency & forex'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the currency details are' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Doctorandclinic': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
             attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Doctor & clinic'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             var attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the details regarding doctors or medical information here is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Firstaidkit': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='First aid'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'first aid information is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Promotions': function () {
//var id = this.event.request.intent.slots.promotion_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var attractionarry=[];
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Promotions'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
       
                   if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the promotions  are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    

     'Library': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
           var  attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Library'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the library information here is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Parking': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
            var attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Parking'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the parking detais are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Offers': function () {
         	    booking='information';
this.attributes.helpstate='test';
        // var id = this.event.request.intent.slots.offer_id.value;
         var attractionarry=[];
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
             
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Offers'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
     
                   if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the offers here are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                    this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Visitorlounge': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
             var attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Visitor lounge'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the lounge information  is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'WheelChair': function () {
        //var id = this.event.request.intent.slots.saloon_id.value;
        booking='information';
        this.attributes.helpstate='test';
        var headingsarry=[];
        var output="";
         dataSearch('myData',  myResult => {
             var attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Wheel Chair'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the lounge information  is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Security': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
            var attractionarry=[];
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Security'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the security details  are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Meetinghallandconferencehall': function () {
        // var id = this.event.request.intent.slots.meeting_id.value;
         	    booking='information';
this.attributes.helpstate='test';
                 var attractionarry=[];

         var headingsarry=[];
         
         var output="";
         dataSearch('myData',  myResult => {
             
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Meeting hall & conference hall'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         //.response.speak(headings[0][0].description);
                      if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                          
                      }
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the details regarding meeting and conference  are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                
                 

                }
        );
    },
    
    'Banquethall': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Banquet hall'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the details regarding banquet hall are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Saloon': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Saloon'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'the details regarding saloon are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
        'CancellationPolicy': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Cancellation policy'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Cancellation policy here is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'Suggestionforsightseeing': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Suggestion for sight seeing'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Packages suggested are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'SuggestThingsToDo': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='suggestion for things to do'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Packages suggested are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    
    'SwimmingPoolIntent': function () {
        booking='information';
        this.attributes.helpstate='test';
        var attractionarry=[];
        var headingsarry=[];
        var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Swimming pool & pool side'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Packages suggested are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'SuggestThingsToBuy': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Suggestion for things to buy'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Packages suggested are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Wifi': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='wifi password'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Cancellation policy here is ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'SuggestionDayTours': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Suggesion for day tours'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                        var headingsdesc=[];
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                              headingsarry.push(headings[0][i].heading+' <break time="0.5s"/>');
                             headings[0][i].description= headings[0][i].description.replace(/[,]/g,'<break time="0.5s"/> ');
                             headingsdesc.push(headings[0][i].heading+' <break time="1s"/> '+headings[0][i].description);
                        }
                     let speechOutput = 'Suggestion for day tours. Trip for five days ' + sayArray(headingsarry,  'and')+' . <break time="1s"/>  '+ sayArray(headingsdesc,  'and');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
        'HolidayActivities': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='holiday activities'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Holiday activities are ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'Jacuzzi': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Jacuzzi'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Jaccuzi information : ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'SpaandMassage': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Spa & Massage'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'details regarding Spa and massage were' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'RestaurantandDining': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Restaurant & dining'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Restaurant dining information ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
      
         'PublicTransport': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Public transport'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'information regarding public information ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    
     'LoungeandBarIntent': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Lounge & Bar'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Information regarding lounge and bar  ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'CheckinCheckout': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Check in & check out'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Information regarding checkin and checkout ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'HotelEvents': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='EVENTS in the hotel'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Information regarding hotel events ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
        'suggesionforshoppingmall': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='suggestion for shopping mall'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Suggestion for shopping malls were ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
  
     'GymandFitnessCenter': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Gym & fitness centre'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Information about gym and fitness center are  ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    'GamesAvailable': function () {
       	    booking='information';
this.attributes.helpstate='test';
         
       var attractionarry=[];
         var headingsarry=[];
        
         var output="";
         dataSearch('myData',  myResult => {
            
              var headings=[];
                
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Games available'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
               
                    if(headings[0].length==1){
                         
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else if(headings[0].length==0){
                        this.emit(':ask','Sorry i dont have that information with me now. ',HELP_REPROMPT);
                        }else{
                         for(let i in headings[0])
                        {
                              if(headings[0][i].name){
                                    output=headings[0][i].description+' please note that '+headings[0][0].name;
                                }else{
                                    
                                     output=headings[0][i].heading;
                                }
                             headingsarry.push(output);
                        }
                     let speechOutput = 'Games available are ' + sayArray(headingsarry,  'and')+' . '+headings[0][0].heading+' . '+headings[0][0].description;
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
    
    'Safetyatthisplace': function () {
         //var id = this.event.request.intent.slots.saloon_id.value;
         	    booking='information';
this.attributes.helpstate='test';
         var headingsarry=[];
         var output="";
         dataSearch('myData',  myResult => {
            var attractionarry=[];
            var headings=[];
            for(let i in myResult.all){
               
                //console.log(newarry.all[i].info_type);
                if(myResult.all[i].info_type=='Safety'){
                    headings.push(myResult.all[i].headings);
                }
               console.log(headings);
            }

             attractionarry=headings[0];
                console.log("received : " + myResult);
               
                
                    if(headings[0].length==1){
                              if(headings[0][0].name){
                                  headings[0][0].description= headings[0][0].description.replace(/[,]/g,'<break time="0.5s"/> ');
                                    output=headings[0][0].description+' please note that '+headings[0][0].name;
                                }else{
                                     output=headings[0][0].description;
                                }
                         this.emit(':ask',output,HELP_REPROMPT);
                         
                    }else{
                         for(let i in headings[0])
                        {
                             headingsarry.push(headings[0][i].heading);
                        }
                     let speechOutput = 'Safety detais here are ' + sayArray(headingsarry,  'and');+ '. please choose either ' + sayArray(headingsarry, 'or');
                     this.response.speak(speechOutput);
                     this.emit(':ask',speechOutput,HELP_REPROMPT);
                        
                    }
                   
                    
                }
                 

            
        );
    },
     'AppreciateIntent':function(){
       // this.handler.state='GREET'
	   this.attributes.helpstate='test';
        this.emit(':ask','Thanks.  I am glad that you liked it. Is there anything else I can do for you.',HELP_REPROMPT);
     },
    'YesIntent':function()
    {
        if(this.attributes.helpstate=='assist')
        {
            this.attributes.canassistcount=this.attributes.canassistcount+1;
            if(this.attributes.canassistcount>3){
                this.attributes.canassistcount=0;
            }
            this.handler.state = "REQUEST";
              const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room ordering, billing.  Do you want to here more.',
                            'Can entertain you with news headlines of cities, daily horoscope,  and nearby information. You can say news headlines or nearby atm. Do you want to here more.',
                            'I can engage you with hilarious jokes, riddles, health tips and many more. You can say tell me jokes or say riddles. Do you want to here more.',
                            'Can give you today Panchangam, numerology for you and motivational quotes. You can ask Panchangam or numerology or say tell me some quotes. '
                            
                        ];
            //let speechOutput = 'I can help you on amenities, restaurant, in room dining, billing, news headlines,  bullion market, market index, near by information, daily horoscope, health tips and many more.';
            this.emit(':ask',assistsppech[this.attributes.canassistcount],HELP_REPROMPT);
        }
        else if(this.attributes.helpstate=='riddle'){
            this.attributes.riddlecount=0;
             getriddles('text', myResult => {
            //this.handler.state = "RIDDLE";
            this.attributes.helpstate='test';
            this.attributes.riddleanswer=myResult.list.riddle_answer;
            this.emit(':ask',myResult.list.riddle_question,'Please say the answer .');
            });
        }else if(this.attributes.helpstate=='checkout'){
            FrontdeskRequest('okay. I asked front desk to send you a bell boy.',this.attributes.hotelval ,  myResult => {
            this.handler.state = "REQUEST";
            this.attributes.helpstate=='test'
            //this.emit(':ask', frontdeskres,HELP_REPROMPT);
            });
            this.emit(':ask','okay. I asked front desk to send you a bell boy.',HELP_REPROMPT);
            
        }else if(this.attributes.helpstate=='jokes'){
            this.handler.state = "JOKES";
             this.attributes.helpstate='jokes';
              getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="2.0s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="2.0s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });
        }else if(this.attributes.helpstate=='quiz'){
             this.attributes.quizcount=0;
		   this.attributes.helpstate='test';
             getquiz('text', myResult => {
                 console.log(myResult);
                 this.attributes.helpstate='test';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 
                 this.emit(':ask','ok . <break time="0.5s"/> here is the next '+this.attributes.quizquestion+' . <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4,'please say the answer');

            });
        }
        else
        {
            
             this.attributes.canhelpcount=this.attributes.canhelpcount+1;
                    if(this.attributes.canhelpcount>3){
                        this.attributes.canhelpcount=0;
                    }
            this.handler.state = "REQUEST";
              const helpspeech = [
                            
                            'I can help you on amenities, restaurant menu, in room ordering, billing.  Do you want to here more?',
                            'Can entertain you with news headlines of cities, daily horoscope,  and nearby information. You can say news headlines or nearby atm. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips and many more. You can say tell me jokes or say riddles. Do you want to here more.',
                            'Can give you today Panchangam, numerology for you and motivational quotes. You can ask Panchangam or numerology or say tell me some quotes. '
                            
                        ];
            //let speechOutput = 'I can help you on amenities, restaurant, in room dining, billing, news headlines,  bullion market, market index, near by information, daily horoscope, health tips and many more.';
            this.emit(':ask',helpspeech[this.attributes.canhelpcount],HELP_REPROMPT)
        }
    
    },
     'NoIntent':function()
    {
         if(this.attributes.helpstate=='assist' ||this.attributes.helpstate=='help' || this.attributes.helpstate=='riddle' || this.attributes.helpstate=='jokes' ||this.attributes.helpstate=='quiz')
        {
            this.emit(':ask','How may i help you. ',HELP_REPROMPT)
        }else if(this.attributes.helpstate=='checkout'){
           this.attributes.helpstate=='test'
            this.emit(':ask','hope you had a wonderful stay with us. Do visit us again. Have a great day.',HELP_REPROMPT);
            
        }
        else{
           const stopspeech = [
                                
                                'Thank you. Its my pleasure that you are with us. Have a great day.',
                                'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                                'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                                'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                                'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                                'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                            ];
            const stoparr = stopspeech;
            const stopIndex = Math.floor(Math.random() * stopspeech.length);
            const stopres = stopspeech[stopIndex];
            this.response.speak(stopres);
            this.emit(':responseReady');
        }
    },
    'SessionEndedRequest':function(){
        //this.response.speak('unhandled');
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
     },
     
     
    'Unhandled': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        
        if(this.attributes.helpstate=='riddle'){
                this.handler.state = "REQUEST";
                this.attributes.helpstate='riddle';
                this.attributes.riddlecount= this.attributes.riddlecount+1;
                getriddles('text', myResult => {
                    this.attributes.riddlequestion= myResult.list.riddle_question;
                    var prevanswer=this.attributes.riddleanswer;
                    this.attributes.riddleanswer=myResult.list.riddle_answer;
                    if(this.attributes.riddlecount==4){
                        repeatspeech='here is the answer '+ prevanswer +'.  <break time="1s"/> Do you want to play more';
                        this.attributes.rspeech=repeatspeech;
                        this.emit(':ask',repeatspeech,'Do you want to play more');
                    }
                    else{
                        repeatspeech='ok . here is the answer for you . <break time="0.5s"/> '+ prevanswer +' . <break time="1.0s"/> The next riddle is <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/>';
                        this.attributes.rspeech=repeatspeech;
                        this.emit(':ask',repeatspeech,'please say the answer');
                    }
                
                });
        }else if(this.attributes.helpstate=='quiz'){
            this.attributes.helpstate='quiz';
              var repeatspeech;
              this.handler.state = "REQUEST";
                //this.handler.state='RIDDLE';
        //this.attributes.helpstate='riddle';
        
            this.attributes.quizcount=this.attributes.quizcount+1;
           
             getquiz('text', myResult => {
                 console.log(myResult);
                 var prevquizanswer=this.attributes.quizanswer
                 this.attributes.helpstate='quiz';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 if(this.attributes.quizcount==4){
                     repeatspeech=prevquizanswer +' .  <break time="0.5s"/>  Do you want to play more';
                     this.attributes.rspeech=repeatspeech;
                     this.emit(':ask',repeatspeech,'Do you want to play more');
                 }else{
                      repeatspeech=prevquizanswer+'  . <break time="0.5s"/> <emphasis level="moderate">  next'+this.attributes.quizquestion+' . </emphasis>  <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4;
                      this.attributes.rspeech=repeatspeech;
                    this.emit(':ask',repeatspeech,'please say the answer');

                 }

            });
        
        }else{
        this.handler.state = "REQUEST";
        let speechOutput = 'Sorry I cannot hear you properly .  Can you please repeat it';
        this.emit(':ask',speechOutput,HELP_REPROMPT);
        }             
    },
   'ThanksIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
            const thanksspeech = [
                            
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
                        const thanksarr = thanksspeech;
                        const thanksIndex = Math.floor(Math.random() * thanksspeech.length);
                        const thanksres = thanksspeech[thanksIndex];
        let speechOutput = 'Thank you. Its my pleasure. Have a great day';
        this.emit(':tell',thanksres,HELP_REPROMPT);
                      
    },
   'ICanAssist': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.attributes.helpstate='assist';
        this.attributes.canassistcount=0;
          const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = ' I can assist you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',assistsppech[0],HELP_REPROMPT);
        this.attributes.canassistcount=this.attributes.canassistcount+1;         
    },
     'ICanHelpIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
         this.attributes.helpstate='help';
         this.attributes.canhelpcount=0;
          const helpspeech = [
                            
                             'I can help you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = 'I can help you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',helpspeech[0],HELP_REPROMPT);
                      
    },
    'AMAZON.HelpIntent': function () {
		this.attributes.helpstate='test';
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
		this.attributes.helpstate='test';
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
      'AMAZON.StopIntent': function () {
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
		this.attributes.helpstate='test';
        const stopspeech = [
            
            'Okay. Its my pleasure talking to you. Have a good day.',
            'Okay. Thank you and Enjoy your stay. Bye. ',
            'Okay. Have fun. Thanks for being with us. Enjoy your stay. Bye for now.'
            
        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
}
    
});
const orderHandlers = Alexa.CreateStateHandler(states.ORDER,  {
         'iamcheckingout': function () 
        {
           
                       this.emit(':ask', 'okay. I shall ask front desk to prepare your bills. have a great day. ',HELP_REPROMPT);

      
        },
    'HoroscopeIntent': function () 
        {
             this.attributes.helpstate='test';
                             this.handler.state = "REQUEST";
           this.emit(':ask','tell me your zodiac sign',HELP_REPROMPT);
        },
        'HoroscopeDetailIntent': function () 
        {
            this.attributes.helpstate='test';
                            this.handler.state = "REQUEST";
            var horoscope = this.event.request.intent.slots.horoscopeval.value;
            gethorpscope('nse', myResult => {
              for(let i in myResult.horoscopes){
                 console.log(horoscope+' '+myResult.horoscopes[i].name);
                // var num=myResult.currencies[i].inverse_one_inr
               if(horoscope.toLowerCase()==myResult.horoscopes[i].name.toLowerCase()){
                // myResult.currencies[i].inverse_one_inr=Math.ceil(Number(myResult.currencies[i].inverse_one_inr) * 100)/100;
                 this.emit(':ask',myResult.horoscopes[i].horoscope ,'how may i help you');
                // currencydata.push(myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees . <break time="0.5s"/> ')
             }
             }
            });
        },
        'GetQuotesIntent': function () 
        {
                            this.handler.state = "REQUEST";
            this.attributes.helpstate='test';
            quotebycategoryid('nse', myResult => {
              console.log(myResult.quote.quote );
                 this.emit(':ask',myResult.quote.quote ,'how may i help you');
             });
             
          
        },
    'AbbrevationIntent': function () { 
            var abbrv = this.event.request.intent.slots.abbrval.value;
                this.handler.state = "REQUEST";
           this.attributes.helpstate='test';
               
                    getabbrevationdetails(abbrv, myResult => {
                       
                        //console.log(jokesarry);
                       myResult.abbrevation.abbreviation_description=myResult.abbrevation.abbreviation_description.replace('/','or');
                        this.emit(':ask', 'the abbrevation of '+abbrv+' is  <break time="0.5s"/>'+myResult.abbrevation.abbreviation_description ,'How may i help you');
                    });


                
               // this.handler.state = "RIDDLE";
        },
    'RepeatIntent': function () 
        {
           this.emit(':ask',this.attributes.rspeech,HELP_REPROMPT);
        },
 'QuizIntent': function () 
        {
            this.handler.state = "REQUEST";
           this.attributes.quizcount=0;
		   this.attributes.helpstate='quiz';
             getquiz('text', myResult => {
                 console.log(myResult);
                 this.attributes.helpstate='quiz';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 this.attributes.rspeech='ok  . <break time="0.5s"/><emphasis level="moderate"> '+this.attributes.quizquestion.replace(/[,]/g,'</emphasis><break time="0.5s"/> ')+' . <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4
                 this.emit(':ask','ok . lets play the quiz . <break time="0.5s"/><emphasis level="moderate">  '+this.attributes.quizquestion+' . </emphasis> <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4,'please say the answer');

            });
           // this.emit(':ask','I shall ask you a riddle and you have to say the answer. Shall we start. Are you ready?',HELP_REPROMPT);
        },
     'RiddlesIntent': function () 
        {
           this.attributes.riddlecount=0;
		   this.attributes.helpstate='riddle';
           this.handler.state = "RIDDLE";
            getriddles('text', myResult => {
                this.attributes.helpstate='riddle';
                this.attributes.riddlequestion= myResult.list.riddle_question;
                this.attributes.riddleanswer=myResult.list.riddle_answer;
                this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask','ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ','please say the answer');
            });
        },
         'WeatherIntent':function(){
			 this.attributes.helpstate='test';
               getweather('gold', myResult => {
               
                  var mintemp= myResult.weather.main.temp_min - 273.15;
                  var maxtemp=myResult.weather.main.temp_max - 273.15;
                   // goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                  
                   this.emit(':ask','Todays weather forecast for '+this.attributes +'. minimum temperature is :' +mintemp+ ' degrees celcius and maximum temperature is :' +maxtemp+' degrees celcius.',HELP_REPROMPT);
                });
        },
        'GoldIntent':function(){
			this.attributes.helpstate='test';
               getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                     //goldinfo.push(myResult.list[i]['carat']);
                    goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
         'SilverIntent':function(){
			 this.attributes.helpstate='test';
               getgoldandsilverprices('silver', myResult => {
                  
                   var silverprice= myResult.priceslist.weight +'  silver at bangalore is '+ myResult.priceslist.bangalore +' rupees, chennai is '+ myResult.priceslist.chennai+' rupees , delhi is '+ myResult.priceslist.delhi + ' rupees, hyderabad is '+ myResult.priceslist.hyderabad+ ' rupees, kerala is '+myResult.priceslist.kerala+' rupees and mumbai is '+myResult.priceslist.mumbai+' rupees. <break time="1s"/>';
                   this.emit(':ask','the rate of '+ silverprice,HELP_REPROMPT);
                });
        },
        'GoldCityIntent':function(){
			this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.cityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
              getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                      
                      if(myResult.list[i][cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                            goldinfo.push( myResult.list[i].carat +' carat gold at '+ cityname+' is ' + myResult.list[i][cityname] +' rupees');
                      }
                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
        
         'SilverCityIntent':function(){
			 this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.silvercityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
            var silverinfo;
              getgoldandsilverprices('silver', myResult => {
               
                 
                      
                      if(myResult.priceslist[cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                           silverinfo= myResult.priceslist.weight +' silver at '+ cityname+' is ' + myResult.priceslist[cityname] +' rupees';
                      }
                  
                   this.emit(':ask','the rate of '+silverinfo,HELP_REPROMPT);
                });
        },
    'GetJokes': function () { 
	this.attributes.helpstate='jokes';
                this.handler.state = "JOKES";
                                    var riddlecat=[];

               getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });
               // this.handler.state = "RIDDLE";
        },
     'HealthTipsIntent': function () {
		 this.attributes.helpstate='test';
                this.handler.state = "REQUEST";
                                    var riddlecat=[];

                gethealthtips('text', myResult => {
                   this.emit(':ask',myResult.list.health_tip_description,HELP_REPROMPT);
                });
               // this.handler.state = "RIDDLE";
        },
    
    'DirectResaturentOrderIntent':function(){
		this.attributes.helpstate='test';
        var oitem = this.event.request.intent.slots.orderitem.value;
        var measure=this.event.request.intent.slots.measure.value;
        var quantity =this.event.request.intent.slots.orderval.value;
        var oitem1 = this.event.request.intent.slots.orderitemone.value;
        var measure1=this.event.request.intent.slots.measureone.value;
        var quantity1 =this.event.request.intent.slots.ordervalone.value;
        var oitem2 = this.event.request.intent.slots.orderitemtwo.value;
        var measure2=this.event.request.intent.slots.measuretwo.value;
        var quantity2 =this.event.request.intent.slots.ordervaltwo.value;
        var oitem3 = this.event.request.intent.slots.orderitemthree.value;
        var measure3=this.event.request.intent.slots.measurethree.value;
        var quantity3 =this.event.request.intent.slots.ordervalthree.value;
        
        
        if(quantity3)
        {
			
            this.attributes.directorder='you asked for '+ quantity +'  '+oitem+', '+ quantity1 +'  '+oitem1+' ,'+ quantity2 +'  '+oitem2+' and '+ quantity3 +'  '+oitem3;
            this.attributes.requesttype='directorder';
             //this.handler.state("RequestYesNo");
            this.handler.state = "RequestYesNo";
            this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
        }else{
                if(quantity2){
                    this.attributes.directorder='you asked for '+ quantity +'  '+oitem+' '+ quantity1 +'  '+oitem1+' and '+ quantity2 +'  '+oitem2;
                    this.attributes.requesttype='directorder';
                    this.handler.state = "RequestYesNo";
                    this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                }
                else
                {
                        if(quantity1){
                                this.attributes.directorder='you asked for '+ quantity +'  '+oitem+' and '+ quantity1 +'  '+oitem1;
                                this.attributes.requesttype='directorder';
                                //this.handler.state("RequestYesNo");
                                this.handler.state = "RequestYesNo";
                                this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                        }else{
                                this.attributes.directorder='you asked for '+ quantity +'  '+oitem;
                                this.attributes.requesttype='directorder';
                                //this.handler.state("RequestYesNo");
                                this.handler.state = "RequestYesNo";
                                this.emit(':ask',this.attributes.directorder+' and your room number is ' +this.attributes.hotelval.room_name+' . Do you want to place the order ',HELP_REPROMPT);
                        }
               }
        }
        
               /* SearchItemsArray(this.attributes.hotelval,  myResult => 
                                    {
                                        booking='order';
                                        var cst=0;
                                        for(let i in myResult.items)
                                        {
                                        
                                            if(myResult.items[i].item_name.replace(/ /g,'').toLowerCase()==oitem.replace(/ /g,'').toLowerCase())
                                            {
                                                this.attributes.category=myResult.items[i].name;
                                                this.attributes.itemname=myResult.items[i].item_name;
                                                itemsarry.push(myResult.items[i].item_name);
                                                pricesarry.push(myResult.items[i].cost);
                                                unitsarry.push(quantity);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                this.attributes.unitslist=unitsarry;
                                                console.log('second');
                                                console.log(myResult.items[i].item_name);
                                                this.handler.state = "ORDER";
                                                    
                                                    this.emit(':ask',myResult.items[i].item_description+' . the cost of one '+ myResult.items[i].messure+' '+myResult.items[i].item_name+ ' is '+myResult.items[i].cost+' rupees.is there anything else you would like to add to this order?' ,HELP_REPROMPT);
                                            }else{
                                             cst=cst+1;
                                                if(cst==myResult.items.length){
                                                    //itemsarry=[];
                                                    //pricesarry=[];
                                                    //unitsarry=[];
                                                    //itemsdesc=[];
                                                    this.handler.state = "REQUEST";
                                                let speechOutput = 'ok .  What would you like to order from the menu.  ';
                                                this.emit(':ask',speechOutput,HELP_REPROMPT);                                            }
                                        
                                        }
                                    }
                                    
                                    });*/
        
    },
    
        'OrderIntent':function()
     {
          this.attributes.helpstate='test';
           var item = this.event.request.intent.slots.mItem.value;
           var value =this.event.request.intent.slots.mVal.value;
           
            
                   if(item)
                   {
                            var cmt=0;
                            this.attributes.menucateg='';
                                    SearchItemsArray(this.attributes.hotelval,  myResult => 
                                    {
                                        booking='order';
                                        var cst=0;
                                        for(let i in myResult.items)
                                        {
                                        
                                            if(myResult.items[i].item_name.replace(/ /g,'').toLowerCase()==item.replace(/ /g,'').toLowerCase())
                                            {
                                                this.attributes.category=myResult.items[i].name;
                                                this.attributes.itemname=myResult.items[i].item_name;
                                                itemsarry.push(myResult.items[i].item_name);
                                                pricesarry.push(myResult.items[i].cost);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                console.log('second');
                                                console.log(myResult.items[i].item_name);
                                                this.handler.state = "ORDER";
                                                    
                                                    this.emit(':ask',myResult.items[i].item_description+' . the cost of one '+ myResult.items[i].messure+' '+myResult.items[i].item_name+ ' is '+myResult.items[i].cost+' rupees. How many '+ myResult.items[i].messure+'s Do you want to order?' ,HELP_REPROMPT);
                                            }else{
                                             cst=cst+1;
                                                if(cst==myResult.items.length){
                                                    //itemsarry=[];
                                                    //pricesarry=[];
                                                    //unitsarry=[];
                                                    //itemsdesc=[];
                                                    this.handler.state = "REQUEST";
                                                 let speechOutput = ' Hmmm.  <break time="0.5s"/> I am sorry.  <break time="0.5s"/> We don’t have that dish with us now. Can you Please select a dish from the restaurant menu.';
                                                this.emit(':ask',speechOutput,HELP_REPROMPT);                                            }
                                        
                                        }
                                    }
                                    
                                    });
                             
                   
                    }else{
                        var newval=0;
                        var cnt=0;
                        booking='order';
						
                        if(value){
                                 if(value<10){
                                   value='0'+value; 
                                }
                                var cntval=0;
                              for(let i in itemsdesc.items)
                            {
                                //this.emit(':ask',i+1,HELP_REPROMPT);
                                
                                 newval=parseInt(i)+1;
                                 if(newval==value)
                                 {
                                    this.attributes.category=itemsdesc.items[i].name;
                                                this.attributes.itemname=itemsdesc.items[i].item_name;
                                                itemsarry.push(itemsdesc.items[i].item_name);
                                                pricesarry.push(itemsdesc.items[i].cost);
                                                this.attributes.itemslist=itemsarry;
                                                this.attributes.priceslist=pricesarry;
                                                console.log('valarry');
                                                console.log(itemsdesc.items[i].item_name);
                                                this.handler.state = "ORDER";
                                   // cntval=cntval+1;
                                    this.emit(':ask',itemsdesc.items[i].item_description+' . the cost of one'+ itemsdesc.items[i].messure+' '+itemsdesc.items[i].item_name+ ' is '+itemsdesc.items[i].cost+' rupees. How many ' + itemsdesc.items[i].messure+'s Do you want to order?' ,HELP_REPROMPT);
                                }else{
                                     cnt=cnt+1;
                                    if(cnt==itemsdesc.items.length)
                                    {
                                        booking='order';
                                        //itemsarry=[];
                                       // pricesarry=[];
                                       // unitsarry=[];
                                       // itemsdesc=[];
                                       this.handler.state = "REQUEST";
                                                                                        let speechOutput = ' Hmmm.  <break time="0.5s"/> I am sorry.  <break time="0.5s"/> We don’t have that dish with us now. Can you Please select a dish from the restaurant menu.';
                                        this.emit(':ask',speechOutput,HELP_REPROMPT); 
                                    
                                    }
                                }
                            }
                        
                    }
                   
                        
                        
                    }           
                        
     },
    'Menu':function()
     {
		 this.attributes.helpstate='test';
            var menuval = this.event.request.intent.slots.menuval.value;
           this.attributes.categoryval=menuval;
           booking='order';
          
                   if(menuval){
                        MenuArray(menuval,this.attributes.hotelval, myResult => 
                        {
                            if(myResult.length==1){
                                this.emitWithState("OrderIntent");
                                this.emit(':ask',menuval+' items are '+myResult[0]+' . what would you like to order',HELP_REPROMPT);  
                            }else{
                                this.attributes.menucateg=myResult;
                                let speechOutput = menuval+' items are ' + orderArray(myResult,  'and')+' . what would you like to order';
                                this.emit(':ask',speechOutput,HELP_REPROMPT);
                            }
                        });
                   }
                   else
                   {
                        getcategories('data',  myResult => 
                        {
                            var categ=[];
                            for(let i in myResult.categories)
                            {
                                categ.push(myResult.categories[i].name);
                            }
                            let speechOutput = ' What would you like to order from the menu. ';
                            this.emit(':ask',speechOutput,HELP_REPROMPT);
            
                        });
                   }
           
     },
    
  'QuantityIntent': function () 
    {
		this.attributes.helpstate='test';
        var logid = this.event.request.intent.slots.quant.value;
        if(logid==0){
            this.emit(':ask','Sorry we cant place the order, to place the order plese say the quantity','Please say the quantity'); 
        }else{
            unitsarry.push(logid);
          this.attributes.unitslist=unitsarry;
          this.emit(':ask','is there anything else you would like to add to this order',HELP_REPROMPT); 
        }
        
    },
    'YesIntent':function()
    {
		this.attributes.helpstate='test';
        //this.response.speak('unhandled');
         this.handler.state = "REQUEST";
         if(this.attributes.menucateg){
			 
              let speechOutput = this.attributes.categoryval +' items are ' + orderArray(this.attributes.menucateg,  'and')+' . what would you like to order';
                                this.emit(':ask',speechOutput,HELP_REPROMPT);
         }else{
                     this.emit(':ask','Fine. Tell me the order then',HELP_REPROMPT);
         }
    },
     'NoIntent':function()
    {
        //this.response.speak('unhandled');
        
        this.attributes.helpstate='test';
                booking='ordered';
                 var post_data = {
                        "location_id":this.attributes.hotelval.location_id,
                        "department_id":"8",
                        "room_id":this.attributes.hotelval.room_name,
                        "items":this.attributes.itemslist,
                        "prices":this.attributes.priceslist,
                        "units":this.attributes.unitslist
                    };
          console.log('nointent');
         console.log(post_data);
             restaurantOrder(post_data,  myResult => 
            {
                
                booking='order';
                this.handler.state = "REQUEST";
               // let speechOutput = 'Todays '+ menuval+' items are ' + sayArray(myResult,  'and')+' If you want to know more please select your item';
                this.emit(':ask','your order is placed with reference number '+myResult.order_id+' .  you ordered ' +sayArray(itemsarry,  'and')+' . Enjoy your order. ',HELP_REPROMPT);
                itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
            });
               // let speechOutput = 'Todays '+ menuval+' items are ' + sayArray(myResult,  'and')+' If you want to know more please select your item';
               // this.emit(':ask','Enjoy your ' +this.attributes.itemname+' . If you still need any assistence please let me know.',HELP_REPROMPT);
    },
     'AppreciateIntent':function(){
		 this.attributes.helpstate='test';
        //this.handler.state='GREET'
        this.emit(':ask','Thanks.  I am glad that you liked it. Is there anything else I can do for you.',HELP_REPROMPT);
     },
    'SessionEndedRequest':function()
    {
        //this.response.speak('unhandled');
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
    },
     
    'Unhandled': function () 
    {
       // var logid = this.event.request.intent.slots.loginid.value;
       this.attributes.helpstate='test';
                        let speechOutput = 'Sorry I cannot hear you properly . can you please repeat it';
                         this.emit(':ask',speechOutput,HELP_REPROMPT);
                      
    },
    'ThanksIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
         const thanksspeech = [
                            
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
                        const thanksarr = thanksspeech;
                        const thanksIndex = Math.floor(Math.random() * thanksspeech.length);
                        const thanksres = thanksspeech[thanksIndex];
        //let speechOutput = 'Thank you. Its my pleasure. Have a great day';
        this.emit(':tell',thanksres,HELP_REPROMPT);
                      
    },
   'ICanAssist': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.attributes.helpstate='assist';
        this.attributes.canassistcount=0;
          const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = ' I can assist you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',assistsppech[0],HELP_REPROMPT);
        this.attributes.canassistcount=this.attributes.canassistcount+1;         
    },
     'ICanHelpIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
         this.attributes.helpstate='help';
         this.attributes.canhelpcount=0;
          const helpspeech = [
                            
                             'I can help you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = 'I can help you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',helpspeech[0],HELP_REPROMPT);
                      
    },
      'AMAZON.HelpIntent': function () {
           this.attributes.helpstate='test';
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
               const stopspeech = [
            
            'Okay. Its my pleasure talking to you. Have a good day.',
            'Okay. Thank you and Enjoy your stay. Bye. ',
            'Okay. Have fun. Thanks for being with us. Enjoy your stay. Bye for now.',
            
        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
}

});

const requestYesNoHandlers = Alexa.CreateStateHandler(states.RequestYesNo,  {
         'iamcheckingout': function () 
        {
           
                       this.emit(':ask', 'okay. I shall ask front desk to prepare your bills. have a great day. ',HELP_REPROMPT);

      
        },
    'HoroscopeIntent': function () 
        {
             this.attributes.helpstate='test';
                             this.handler.state = "REQUEST";
           this.emit(':ask','tell me your zodiac sign',HELP_REPROMPT);
        },
        'HoroscopeDetailIntent': function () 
        {
            this.attributes.helpstate='test';
                            this.handler.state = "REQUEST";
            var horoscope = this.event.request.intent.slots.horoscopeval.value;
            gethorpscope('nse', myResult => {
              for(let i in myResult.horoscopes){
                 console.log(horoscope+' '+myResult.horoscopes[i].name);
                // var num=myResult.currencies[i].inverse_one_inr
               if(horoscope.toLowerCase()==myResult.horoscopes[i].name.toLowerCase()){
                // myResult.currencies[i].inverse_one_inr=Math.ceil(Number(myResult.currencies[i].inverse_one_inr) * 100)/100;
                 this.emit(':ask',myResult.horoscopes[i].horoscope ,'how may i help you');
                // currencydata.push(myResult.currencies[i].country_currency+' is '+myResult.currencies[i].inverse_one_inr+' rupees . <break time="0.5s"/> ')
             }
             }
            });
        },
        'GetQuotesIntent': function () 
        {
                            this.handler.state = "REQUEST";
            this.attributes.helpstate='test';
            quotebycategoryid('nse', myResult => {
              console.log(myResult.quote.quote );
                 this.emit(':ask',myResult.quote.quote ,'how may i help you');
             });
             
          
        },
      'AbbrevationIntent': function () { 
            var abbrv = this.event.request.intent.slots.abbrval.value;
                this.handler.state = "REQUEST";
           this.attributes.helpstate='test';
               
                    getabbrevationdetails(abbrv, myResult => {
                       
                        //console.log(jokesarry);
                       myResult.abbrevation.abbreviation_description=myResult.abbrevation.abbreviation_description.replace('/','or');
                        this.emit(':ask', 'the abbrevation of '+abbrv+' is  <break time="0.5s"/>'+myResult.abbrevation.abbreviation_description ,'How may i help you');
                    });


                
               // this.handler.state = "RIDDLE";
        },
    
    'RepeatIntent': function () 
        {
           this.emit(':ask',this.attributes.rspeech,HELP_REPROMPT);
        },
    'QuizIntent': function () 
        {
            this.handler.state = "REQUEST";
           this.attributes.quizcount=0;
		   this.attributes.helpstate='quiz';
             getquiz('text', myResult => {
                 console.log(myResult);
                 this.attributes.helpstate='quiz';
                 this.attributes.quizquestion= myResult.quiz.question;
                 this.attributes.quizanswer=myResult.quiz.answer;
                 this.attributes.rspeech='ok  . <break time="0.5s"/><emphasis level="moderate"> '+this.attributes.quizquestion.replace(/[,]/g,'</emphasis><break time="0.5s"/> ')+' . <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4
                 this.emit(':ask','ok . lets play the quiz . <break time="0.5s"/><emphasis level="moderate">  '+this.attributes.quizquestion+' . </emphasis> <break time="0.5s"/> here are the options <break time="0.5s"/> '+ myResult.quiz.option1 +'<break time="0.5s"/> '+ myResult.quiz.option2 +'<break time="0.5s"/>'+ myResult.quiz.option3 +' <break time="0.5s"/> '+ myResult.quiz.option4,'please say the answer');

            });
           // this.emit(':ask','I shall ask you a riddle and you have to say the answer. Shall we start. Are you ready?',HELP_REPROMPT);
        },
     'RiddlesIntent': function () 
        {
           this.attributes.riddlecount=0;
		   this.attributes.helpstate='riddle';
		    this.handler.state = "RIDDLE";
             getriddles('text', myResult => {
                this.attributes.helpstate='riddle';
                this.attributes.riddlequestion= myResult.list.riddle_question;
                this.attributes.riddleanswer=myResult.list.riddle_answer;
                this.attributes.rspeech='ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask','ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ','please say the answer');
            });
        },
         'WeatherIntent':function(){
			 this.attributes.helpstate='test';
               getweather('gold', myResult => {
               
                  var mintemp= myResult.weather.main.temp_min - 273.15;
                  var maxtemp=myResult.weather.main.temp_max - 273.15;
                   // goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                  
                   this.emit(':ask','Todays weather forecast . minimum temperature is :' +mintemp+ ' degrees celcius and maximum temperature is :' +maxtemp+' degrees celcius.',HELP_REPROMPT);
                });
        },
        'GoldIntent':function(){
			this.attributes.helpstate='test';
               getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                     //goldinfo.push(myResult.list[i]['carat']);
                    goldinfo.push( myResult.list[i].carat +' carat gold at bangalore is '+ myResult.list[i].bangalore +' rupees, chennai is '+ myResult.list[i].chennai+' rupees , delhi is '+ myResult.list[i].delhi + ' rupees, hyderabad is '+ myResult.list[i].hyderabad+ ' rupees, kerala is '+myResult.list[i].kerala+' rupees and mumbai is '+myResult.list[i].mumbai+' rupees. <break time="1s"/>');

                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
         'SilverIntent':function(){
			 this.attributes.helpstate='test';
               getgoldandsilverprices('silver', myResult => {
                  
                   var silverprice= myResult.priceslist.weight +'  silver at bangalore is '+ myResult.priceslist.bangalore +' rupees, chennai is '+ myResult.priceslist.chennai+' rupees , delhi is '+ myResult.priceslist.delhi + ' rupees, hyderabad is '+ myResult.priceslist.hyderabad+ ' rupees, kerala is '+myResult.priceslist.kerala+' rupees and mumbai is '+myResult.priceslist.mumbai+' rupees. <break time="1s"/>';
                   this.emit(':ask','the rate of '+ silverprice,HELP_REPROMPT);
                });
        },
        'GoldCityIntent':function(){
			this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.cityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
              getgoldandsilverprices('gold', myResult => {
                var  goldinfo=[];
                  for(let i in myResult.list){
                      
                      if(myResult.list[i][cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                            goldinfo.push( myResult.list[i].carat +' carat gold at '+ cityname+' is ' + myResult.list[i][cityname] +' rupees');
                      }
                  }
                   this.emit(':ask','the rate of '+sayArray(goldinfo,'and'),HELP_REPROMPT);
                });
        },
        
         'SilverCityIntent':function(){
			 this.attributes.helpstate='test';
            var cityname = this.event.request.intent.slots.silvercityname.value;
            cityname=cityname.toLowerCase();
            var cityprice=[];
            var silverinfo;
              getgoldandsilverprices('silver', myResult => {
               
                 
                      
                      if(myResult.priceslist[cityname]){
                          //cityprice[i]=myResult.list[i].cityname;
                           silverinfo= myResult.priceslist.weight +' silver at '+ cityname+' is ' + myResult.priceslist[cityname] +' rupees';
                      }
                  
                   this.emit(':ask','the rate of '+silverinfo,HELP_REPROMPT);
                });
        },
  'GetJokes': function () { 
  this.attributes.helpstate='jokes';
                this.handler.state = "JOKES";
                                    var riddlecat=[];

                getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });
               // this.handler.state = "RIDDLE";
        },
     'HealthTipsIntent': function () {
                this.handler.state = "REQUEST";
                                    var riddlecat=[];
            this.attributes.helpstate='test';
                gethealthtips('text', myResult => {
                   this.emit(':ask',myResult.list.health_tip_description,HELP_REPROMPT);
                });
               // this.handler.state = "RIDDLE";
        },
    
    
     'YesIntent':function()
    {
		this.attributes.helpstate='test';
       if(this.attributes.requesttype=='traveldesk')
       {
         const traveldata = [
            'Ok. I understood what you are looking for. Will ask the travel desk on this. ',
            'sure. Travel desk executive will attend you on your request now. ',
            'Fine. I requested the travel desk to act on your request now. He will attend you shortly. ',
            
            ];
            const traveldeskArr = traveldata;
            const traveldeskIndex = Math.floor(Math.random() * traveldeskArr.length);
            const traveldeskres = traveldeskArr[traveldeskIndex];
            TravelRequest(this.attributes.traveldesk,this.attributes.hotelval , myResult => {
            this.handler.state = "REQUEST";
            this.emit(':ask',traveldeskres,HELP_REPROMPT);
            }); 
    }else if(this.attributes.requesttype=='frontdesk'){
         
          const data = [
            'Your request will be attended shortly by our front desk executive. ',
            'Ok. I asked the front desk to assist you now on this request. ',
            'Will help you on this. Our front desk executive will attend your request shortly. ',
            
            ];
            const frontdeskArr = data;
            const frontdeskIndex = Math.floor(Math.random() * frontdeskArr.length);
            const frontdeskres = frontdeskArr[frontdeskIndex];
            FrontdeskRequest(this.attributes.frontdesk,this.attributes.hotelval ,  myResult => {
            this.handler.state = "REQUEST";
            this.emit(':ask', frontdeskres,HELP_REPROMPT);
            });    
    }else if(this.attributes.requesttype=='maintainence'){
          //this.attributes.maintainence=mntval;
            //this.attributes.requesttype='maintainence';
          const data = [
            'Your request will be attended shortly by our maintainence executive. ',
            'Ok. I asked the maintainence to assist you now on this request. ',
            'Will help you on this. Our maintainence executive will attend your request shortly. ',
            
            ];
            const mntArr = data;
            const mntIndex = Math.floor(Math.random() * mntArr.length);
            const mntres = mntArr[mntIndex];
            mntRequest(this.attributes.maintainence,this.attributes.hotelval ,  myResult => {
            this.handler.state = "REQUEST";
            this.emit(':ask', mntres,HELP_REPROMPT);
            });    
    }else if(this.attributes.requesttype=='directorder'){
         
         
            Directorder(this.attributes.directorder,this.attributes.hotelval ,  myResult => {
            this.handler.state = "REQUEST";
            this.emit(':ask', 'Your order is placed successfully with reference id '+myResult.order_id+' .Enjoy your dish',HELP_REPROMPT);
            });    
    }else{
            this.handler.state = "REQUEST";
            this.emit(':ask', 'Do you need anything else',HELP_REPROMPT);
    }
    },
     'NoIntent':function()
    {
        this.attributes.helpstate='test';
               // let speechOutput = 'Todays '+ menuval+' items are ' + sayArray(myResult,  'and')+' If you want to know more please select your item';
             this.handler.state = "REQUEST";
             this.emit(':ask','Ok. ',HELP_REPROMPT);
    },
     'AppreciateIntent':function(){
        //this.handler.state='GREET'
		this.attributes.helpstate='test';
        this.emit(':ask','Thanks.  I am glad that you liked it. Is there anything else I can do for you.',HELP_REPROMPT);
     },
    'SessionEndedRequest':function()
    {
        //this.response.speak('unhandled');
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
    },
     
    'Unhandled': function () 
    {
		this.attributes.helpstate='test';
        // var logid = this.event.request.intent.slots.loginid.value;
       this.attributes.helpstate='test';
        let speechOutput = 'Sorry I cannot hear you properly . can you please repeat it';
        this.emit(':ask',speechOutput,HELP_REPROMPT);
    },
      'AMAZON.HelpIntent': function () {
          this.attributes.helpstate='test';
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
      'ThanksIntent': function () 
    {
		this.attributes.helpstate='test';
        // var logid = this.event.request.intent.slots.loginid.value;
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
             const thanksspeech = [
                         
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
                        const thanksarr = thanksspeech;
                        const thanksIndex = Math.floor(Math.random() * thanksspeech.length);
                        const thanksres = thanksspeech[thanksIndex];
       // let speechOutput = 'Thank you. Its my pleasure. Have a great day';
        this.emit(':tell',thanksres,HELP_REPROMPT);
                      
    },
   'ICanAssist': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.attributes.helpstate='assist';
        this.attributes.canassistcount=0;
          const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = ' I can assist you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',assistsppech[0],HELP_REPROMPT);
        this.attributes.canassistcount=this.attributes.canassistcount+1;         
    },
     'ICanHelpIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
         this.attributes.helpstate='help';
         this.attributes.canhelpcount=0;
          const helpspeech = [
                            
                             'I can help you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = 'I can help you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',helpspeech[0],HELP_REPROMPT);
                      
    },
     'AMAZON.StopIntent': function () {
		 this.attributes.helpstate='test';
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
       const stopspeech = [
            
            'Okay. Its my pleasure talking to you. Have a good day.',
            'Okay . Thank you and Enjoy your stay. Bye. ',
            'Okay. Have fun. Thanks for being with us. Enjoy your stay. Bye for now.',
            
        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
}
    
    
  
    
    
    
    
    
});   

const riddlesHandlers = Alexa.CreateStateHandler(states.RIDDLE,  {
    
    'RepeatIntent': function () 
        {
           this.emit(':ask',this.attributes.rspeech,HELP_REPROMPT);
        },
  
     'RiddlesIntent': function () 
        {
           this.attributes.riddlecount=0;
		   this.attributes.helpstate='riddle';
		    this.handler.state = "RIDDLE";
             getriddles('text', myResult => {
                this.attributes.helpstate='riddle';
                this.attributes.riddlequestion= myResult.list.riddle_question;
                this.attributes.riddleanswer=myResult.list.riddle_answer;
                this.attributes.rspeech=this.attributes.riddlequestion+' . <break time="1.0s"/> ';
                this.emit(':ask','ok . here is the riddle for you . <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/> ','please say the answer');
            });
        },
         'RiddlesAnswerIntent': function () {
             var repeatspeech;
            this.handler.state = "REQUEST";
     
    		this.attributes.helpstate='RIDDLE';
    		this.attributes.riddlecount= this.attributes.riddlecount+1;
           getriddles('text', myResult => {
            this.attributes.riddlequestion= myResult.list.riddle_question;
            var prevanswer=this.attributes.riddleanswer;
            this.attributes.riddleanswer=myResult.list.riddle_answer;
            if(this.attributes.riddlecount==4){
                 repeatspeech='Do you want to play more';
                 this.attributes.rspeech=repeatspeech;
                 this.emit(':ask','answer is '+ prevanswer +'.  <break time="1s"/> Do you want to play more','Do you want to play more');
            }
            else{
                repeatspeech=this.attributes.riddlequestion+' . <break time="1.0s"/>';
                this.attributes.rspeech=repeatspeech;
                this.emit(':ask','ok .  answer is . <break time="0.5s"/> '+ prevanswer +' . <break time="1.0s"/> The next riddle is <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/>','please say the answer');
            }
            //this.emit(':ask',repeatspeech,'please say the answer');

           // this.emit(':ask',myResult.list.riddle_question,'please say the answer?');
            });
        
        },
     'YesIntent':function()
    {
	this.attributes.riddlecount=0;
             getriddles('text', myResult => {
            this.handler.state = "RIDDLE";
            this.attributes.helpstate='riddle';
            this.attributes.riddleanswer=myResult.list.riddle_answer;
            this.attributes.rspeech=myResult.list.riddle_question;
            this.emit(':ask',myResult.list.riddle_question,'Please say the answer .');
            });
   
    },
     'NoIntent':function()
    {
        this.attributes.helpstate='test';
               // let speechOutput = 'Todays '+ menuval+' items are ' + sayArray(myResult,  'and')+' If you want to know more please select your item';
             this.handler.state = "REQUEST";
             this.emit(':ask','Ok. HOW MAY I HELP YOU ',HELP_REPROMPT);
    },
     'AppreciateIntent':function(){
        this.handler.state='REQUEST';
		this.attributes.helpstate='test';
        this.emit(':ask','Thanks.  I am glad that you liked it. Is there anything else I can do for you.',HELP_REPROMPT);
     },
    'SessionEndedRequest':function()
    {
        //this.response.speak('unhandled');
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
    },
     
    'Unhandled': function () 
    {
        var repeatspeech;
	 // this.handler.state = "REQUEST";
                this.attributes.helpstate='riddle';
                this.attributes.riddlecount= this.attributes.riddlecount+1;
                getriddles('text', myResult => {
                    this.attributes.riddlequestion= myResult.list.riddle_question;
                    var prevanswer=this.attributes.riddleanswer;
                    this.attributes.riddleanswer=myResult.list.riddle_answer;
                    if(this.attributes.riddlecount==4){
                        repeatspeech='<break time="1s"/> . Do you want to play more';
                        this.attributes.rspeech=repeatspeech;
                        this.emit(':ask','here is the answer '+ prevanswer +'.  <break time="1s"/> Do you want to play more','Do you want to play more');
                    }
                    else{
                        repeatspeech=this.attributes.riddlequestion+' . <break time="1.0s"/>';
                        this.attributes.rspeech=repeatspeech;
                        this.emit(':ask','ok . here is the answer for you . <break time="0.5s"/> '+ prevanswer +' . <break time="1.0s"/> The next riddle is <break time="0.5s"/> '+this.attributes.riddlequestion+' . <break time="1.0s"/>','please say the answer');
                    }
                
                });
    },
      'AMAZON.HelpIntent': function () {
          this.attributes.helpstate='test';
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
      'ThanksIntent': function () 
    {
		this.attributes.helpstate='test';
        // var logid = this.event.request.intent.slots.loginid.value;
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
             const thanksspeech = [
                         
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
                        const thanksarr = thanksspeech;
                        const thanksIndex = Math.floor(Math.random() * thanksspeech.length);
                        const thanksres = thanksspeech[thanksIndex];
       // let speechOutput = 'Thank you. Its my pleasure. Have a great day';
        this.emit(':tell',thanksres,HELP_REPROMPT);
                      
    },
   'ICanAssist': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.attributes.helpstate='assist';
        this.attributes.canassistcount=0;
          const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = ' I can assist you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',assistsppech[0],HELP_REPROMPT);
        this.attributes.canassistcount=this.attributes.canassistcount+1;         
    },
     'ICanHelpIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
         this.attributes.helpstate='help';
         this.attributes.canhelpcount=0;
          const helpspeech = [
                            
                             'I can help you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = 'I can help you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',helpspeech[0],HELP_REPROMPT);
                      
    },
     'AMAZON.StopIntent': function () {
		 this.attributes.helpstate='test';
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
       const stopspeech = [
            
            'Okay. Its my pleasure talking to you. Have a good day.',
            'Okay . Thank you and Enjoy your stay. Bye. ',
            'Okay. Have fun. Thanks for being with us. Enjoy your stay. Bye for now.',
            
        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
}
    
    
  
    
    
    
    
    
});   

const jokesHandlers= Alexa.CreateStateHandler(states.JOKES,  {
    
    'GetJokes': function () { 
	 this.attributes.helpstate='jokes';
                this.handler.state = "JOKES";
          
               
                    getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="1.5s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });


                
               // this.handler.state = "RIDDLE";
        },
  
     
     'YesIntent':function()
    {

             this.attributes.helpstate='jokes';
              getjokes('text', myResult => {
                        var jokesarry=[];
                        for(let i in myResult.jokes){
                           console.log(i);
                                myResult.jokes[i].joke_description=myResult.jokes[i].joke_description.replace('&','and');
                                myResult.jokes[i].joke_description= myResult.jokes[i].joke_description.replace(/[,]/g,'<break time="0.5s"/> ');
                                if(i<4){
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="2.0s"/> the next joke is')
                                }else{
                                    jokesarry.push(myResult.jokes[i].joke_description+' <break time="2.0s"/> ');
                                }
                                
                        }
                        console.log(jokesarry);
                      //   myResult.list.joke_description=myResult.list.joke_description.replace('&','and');
                        this.emit(':ask', sayArray(jokesarry,  'and')+' . <break time="0.5s"/>  Do you want to hear more jokes' ,'Do you want to hear more jokes');
                    });
    },
     'NoIntent':function()
    {
        this.attributes.helpstate='test';
               // let speechOutput = 'Todays '+ menuval+' items are ' + sayArray(myResult,  'and')+' If you want to know more please select your item';
             this.handler.state = "REQUEST";
             this.emit(':ask','Ok. HOW MAY I HELP YOU ',HELP_REPROMPT);
    },
     'AppreciateIntent':function(){
        this.handler.state='REQUEST';
		this.attributes.helpstate='test';
        this.emit(':ask','Thanks.  I am glad that you liked it. Is there anything else I can do for you.',HELP_REPROMPT);
     },
    'SessionEndedRequest':function()
    {
        //this.response.speak('unhandled');
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.emit(':tell','session ended',HELP_REPROMPT);
    },
     
    'Unhandled': function () 
    {
       this.handler.state='REQUEST';
        this.emit(':ask','Sorry I cannot hear you properly. Can you please repeat it. ','How may I help you');
                
    },
      'AMAZON.HelpIntent': function () {
          this.attributes.helpstate='test';
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
		this.attributes.helpstate='test';
        itemsarry=[];
                pricesarry=[];
                unitsarry=[];
                itemsdesc=[];
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
      'ThanksIntent': function () 
    {
		this.attributes.helpstate='test';
        // var logid = this.event.request.intent.slots.loginid.value;
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
             const thanksspeech = [
                         
                            'Thank you. Its my pleasure that you are with us. Have a great day.',
                            'Its always pleasure speaking with you. Enjoy your stay. Thank you. I am signing off now.',
                            'I wish you an energetic day ahead. May your every day be blessed with the best. Thank you. Have a nice day.',
                            'Thank you. It’s always a pleasure listening to you. Have a nice day. Bye for now. ',
                            'Just Keep smiling because this is the key to have a happy life. Good day. Enjoy your day. Bye.',
                            'May you have a very good day. Start it with all the energy you have. Have a fabulous day. '
                        ];
                        const thanksarr = thanksspeech;
                        const thanksIndex = Math.floor(Math.random() * thanksspeech.length);
                        const thanksres = thanksspeech[thanksIndex];
       // let speechOutput = 'Thank you. Its my pleasure. Have a great day';
        this.emit(':tell',thanksres,HELP_REPROMPT);
                      
    },
   'ICanAssist': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
        this.attributes.helpstate='assist';
        this.attributes.canassistcount=0;
          const assistsppech = [
                            
                            'I can assist you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = ' I can assist you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',assistsppech[0],HELP_REPROMPT);
        this.attributes.canassistcount=this.attributes.canassistcount+1;         
    },
     'ICanHelpIntent': function () 
    {
        // var logid = this.event.request.intent.slots.loginid.value;
         this.attributes.helpstate='help';
         this.attributes.canhelpcount=0;
          const helpspeech = [
                            
                             'I can help you on amenities, restaurant menu, in room dining, billing. You can say, order me a coffee, or you can say, ask housekeeping to get me two pillows.  Do you want to here more?',
                            'I Can entertain you with news headlines, bullion market, market index, daily horoscope, nearby information. You can say, news headlines, or nearby atm or nearby shopping mall. Do you want to here more?',
                            'I can engage you with hilarious jokes, riddles, health tips. You can say, tell me jokes, or say riddles, or say Ayurveda tips. Do you want to here more.?',
                            'Can give you today Panchaangam, numerology, motivational quotes and many more. You can ask, Panchaangam or numerology, or say tell me some quotes. Do you need any information.'
                            
                        ];
        this.handler.state='REQUEST';
        let speechOutput = 'I can help you on amenities, restaurant menu, in room dining, billing, news headlines,  bullion market, market index, nearby information, daily horoscope, health tips and many more.';
        this.emit(':ask',helpspeech[0],HELP_REPROMPT);
                      
    },
     'AMAZON.StopIntent': function () {
		 this.attributes.helpstate='test';
        itemsarry=[];
        pricesarry=[];
        unitsarry=[];
        itemsdesc=[];
       const stopspeech = [
            
            'Okay. Its my pleasure talking to you. Have a good day.',
            'Okay . Thank you and Enjoy your stay. Bye. ',
            'Okay. Have fun. Thanks for being with us. Enjoy your stay. Bye for now.',
            
        ];
        const stoparr = stopspeech;
        const stopIndex = Math.floor(Math.random() * stopspeech.length);
        const stopres = stopspeech[stopIndex];
        this.response.speak(stopres);
        this.emit(':responseReady');
}
    
    
  
    
    
    
    
    
});   


    var http = require('http');
    
    function login(logval, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "roomid":logval
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/login',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
        location_id = arry.details.location_id;
        
         room_name = arry.details.room_name;
        hotelloc=arry.details;
        console.log(hotelloc);
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}




function FrontdeskRequest(desc,hotelval, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "description":desc,
                        "room":hotelval.room_name,
                        "status":"1",
                        "location_id":hotelval.location_id,
                        "department_id":"2",
                        "request_date":new Date()
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/addrequest',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}
function mntRequest(desc,hotelval, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "description":desc,
                        "room":hotelval.room_name,
                        "status":"1",
                        "location_id":hotelval.location_id,
                        "department_id":"4",
                        "request_date":new Date()
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/addrequest',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}
function Request(desc,hotelval ,callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "description":desc,
                        "room":hotelval.room_name,
                        "status":"1",
                        "location_id":hotelval.location_id,
                        "department_id":"4",
                        "request_date":new Date()
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/addrequest',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}
function getnewspapers(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getnewspapers',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(newarry.papers[0].paper_name);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getinfoheadings(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getinfoheadings',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(newarry.papers[0].paper_name);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}

function getinfonearby(hotelval,nearinfo,callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "location_id":hotelval.location_id,
                        "type":nearinfo
                        
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getinfonearbybyaliasname',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
         console.log(nearinfo)
console.log(arry);
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}
function getcitiesbypaper(desc,callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "paper_name":desc,
                        
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getcitiesbypaper',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}

function getnewsbycity(papername,city,callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "city":city,
                        "paper_name":papername
                        
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getnewsbycity',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}

function getcategories(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getcategories',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
    function MenuArray(desc,hotelval,callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "menutype":desc,
                        "location_id":hotelval.location_id,
                        
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getcategoryitems',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
        var arry = JSON.parse(returnData);
        itemsdesc=JSON.parse(returnData);
        itemscategory=[];
         for(let i in arry.items){

             itemscategory.push(arry.items[i].item_name);
         }
          callback(itemscategory);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}

function Directorder(desc,hotelval, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "items":[desc],
                        "room_id":hotelval.room_name,
                        "location_id":hotelval.location_id,
                        "department_id":"8"
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/directorder',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
console.log(returnData)
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}

function TravelRequest(desc,hotelval, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "description":desc,
                        "room":hotelval.room_name,
                        "status":"1",
                        "location_id":hotelval.location_id,
                        "department_id":"7",
                        "request_date":new Date()
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/addrequest',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);

          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}
function SearchItemsArray(desc, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    var post_data = {
                        "location_id":desc.location_id
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getitems',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
         
         itemsdesc=JSON.parse(returnData);
var itemscat=[];
         for(let i in arry.items){

             itemscat.push(arry.items[i].item_name);
         }
          callback(itemsdesc);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();

}

function orderArray(myData, penultimateWord = 'and') {
    // the first argument is an array [] of items
    // the second argument is the list penultimate word; and/or/nor etc.  Default to 'and'
    let result = '';
var val;
    myData.forEach(function(element, index, arr) {
        
        if (index === 0) {
            val=index+1;
            result = `${val}  ${element},`;
        } else if (index === myData.length - 1) {
            val=index+1;
            result += `${penultimateWord} ${val} ${element}`;
        } else {
            val=index+1;
            result += `${val}  ${element},`;
        }
    });
    return result;
}
function restaurantOrder(obj, callback) {

    // GET is a web service request that is fully defined by a URL string
    // Try GET in your browser:
    // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey


    /*var post_data = {
                        "location_id":location_id.toString(),
                        "department_id":"8",
                        "room_id":room_name,
                        "items":itemsarry,
                        "prices":pricesarry,
                        "units":unitsarry
                    };*/

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/addorder',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(obj))
        }
    };

    var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
console.log('orderdata');
console.log(obj);
console.log(returnData)
          callback(arry);
        });
});
    post_req.write(JSON.stringify(obj));
    post_req.end();

}
function dataSearch(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/gettopics',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getgoldandsilverprices(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getgoldandsilverprices/'+num1,
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getweather(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/todayweather/1',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getjokes(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getjokes/1',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getriddles(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getgeneralrandominfobycatid/riddle/3',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getcurrencies(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getcurrencies/',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getpanchangam(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getpanchangam/',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function quotebycategoryid(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/quotebycategoryid/1',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}

function gethorpscope(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/gethorpscope/',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}

function getstockprices(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getstockprices/'+num1,
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function getquiz(num1, callback) {
 var post_data = {
                        "category_id":"1"
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getquiz',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };
   
var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
       
        console.log(returnData);
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();




}
function getabbrevationdetails(num1, callback) {
 var post_data = {
                        "abbrevation":num1
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getabbrevationdetails',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };
   
var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
       
        console.log(returnData);
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();




}
function getcurrency(num1, callback) {
 var post_data = {
                        "country_currency":num1
                    };

    var post_options = {
        host:  'risolvehm.digisoftbiz.ae',
        port: '80',
        path:'/api/mobile/getquiz',
        method: 'POST',
        headers: {
            
            'Accept':'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
        }
    };
   
var post_req = http.request(post_options, res => {
        //res.setEncoding('utf8');
        var returnData = "";
        res.on('data', chunk =>  {
            returnData += chunk;
        });
        res.on('end', () => {
            // this particular API returns a JSON structure:
            // returnData: {"usstate":"New Jersey","population":9000000}
         var arry = JSON.parse(returnData);
       
        console.log(returnData);
          callback(arry);
        });
});
    post_req.write(JSON.stringify(post_data));
    post_req.end();




}
function gethealthtips(num1, callback) {

   var options = {
        host: 'risolvehm.digisoftbiz.ae',
        port: 80,
        path: '/api/mobile/getgeneralrandominfobycatid/health/1',
        method: 'GET',

        // if x509 certs are required:
        //  'Content-Length': Buffer.byteLength(JSON.stringify(post_data))key: fs.readFileSync('certs/my-key.pem'),
        // cert: fs.readFileSync('certs/my-cert.pem')
    };
       var req = http.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
           
            returnData = returnData + chunk;
            
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
             var newarry=JSON.parse(returnData);
                console.log(returnData);
          
            callback(newarry);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();




}
function sayArray(myData, penultimateWord = 'and') {
    // the first argument is an array [] of items
    // the second argument is the list penultimate word; and/or/nor etc.  Default to 'and'
    let result = '';
var val;
    myData.forEach(function(element, index, arr) {
        
        if (index === 0) {
            //val=index+1;
            result = `${element} , `;
        } else if (index === myData.length - 1) {
            result += `${penultimateWord}  ${element}`;
        } else {
            result += ` ${element},`;
        }
    });
    return result;
}
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    //alexa.APP_ID = APP_ID;
    context.callbackWaitsForEmptyEventLoop = false;
    alexa.registerHandlers(newSessionHandler,handlers,orderHandlers,requestYesNoHandlers,riddlesHandlers,jokesHandlers);
    //this.handlers.state='RequestMODE';
    alexa.execute();
};  
