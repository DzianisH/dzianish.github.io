//<![CDATA[
	var testTimes=new Array();//stores test times
	var responseTimes= new Array();//stores response times
	var testDuration= 2; //default test time is 2 minutes
	var minREsponseTime=100; //threshold in msec for determining a false start
	var maxResponseTime=3000;//threshold in msec for moving on to next target
	var minDelay=2; //minimum delay of 1 sec before target appears
	var maxDelay=6; //maximum delay in sec before target appears
	var t, t1;
	var startT, stopT;//start and stop times for each repsonse measurement
	var testStart, testStop; //start and stop times from the beginning for a complete test
	var count=0; //running time count
	var timerOn=0;//flag to indicate status of running timer
	var numFalseStarts=0;
	function printDebug(str){  //debugging code borrowed from class example
  		document.title = str;
	}
	//not used currently;  to be used in future implementation
	function preloadTestTimes(){
		var elapsed=0;
		var testTime=testDuration*60*1000;//total test time in ms
		while(elapsed < testTime){
			var timeDelay= parseInt(minDelay+ Math.random() *maxDelay) *1000;
			testTimes.push(timeDelay);
			elapsed+= timeDelay;
		}
		//alert(testTimes.toString());//for debugging use
	}
	//process event when user clicks on box
	function handleMouseDown(evt)
	{
  		//evt = (evt) ? evt : ((event) ? event : null);
  		//document.getElementById("box").style.cursor="crosshair";
  		//var x= evt.clientX;
  		//var y= evt.clientY;
  		//printDebug(x+"  "+y);
  		if(!startT){
  		    return;
  		}
  		stopT=(new Date()).getTime();
  		var rTime= stopT-startT;
  		startT=0;
  		if(rTime<100){
  		    numFalseStarts++;
  		}else{
  		    responseTimes.push(rTime);//store this response time
  		}
  		//printDebug("response time= "+rTime);
  		document.getElementById("responseOut").innerHTML="<h2>Most recent reponse time= "+rTime+" msec</h2>";
  		resetDisplayTimer();
	}
	
	function resetDisplayTimer(){
		clearTimeout(t);
		count=0;
		timerOn=0;
		document.getElementById("numeric").innerHTML="";
		var currentT= (new Date()).getTime();
		if((currentT-testStart)>= (testDuration*60000)){//test is finished
			stopPVT();
			return;
		}
		startPVT();
	}
	//change cursor style on 
	function handleMouseMove(evt){
		document.getElementById("box").style.cursor="crosshair";
	}
	
	function init(){
		document.getElementById("box").onmousedown=handleMouseDown;
		document.getElementById("box").onmousemove=handleMouseMove;;
	}

	function startEntireTest(){
		document.getElementById("buttons").innerHTML='<input type= "button" id="stop" value="Stop and Analyze" onclick="stopPVT()" />';
		testStart=(new Date()).getTime();
		responseTimes=new Array();
		startPVT();
	}
	function startPVT(){
		
		var timeDelay=parseInt(minDelay+Math.random()*maxDelay)*1000;
		//printDebug("timeDelay= "+timeDelay);
		count=0;
		timerOn=1;
		t1=setTimeout("displayTimer()", timeDelay);
	}
	
	//called when user wishes to terminate entire test or when preset duration is reached.
	function stopPVT(){
		document.getElementById("buttons").innerHTML="";
		clearTimeout(t);
		count=0;
		timerOn=0;
		document.getElementById("numeric").innerHTML="";
		//document.getElementById("buttons").innerHTML='<input type= "button" value="Start Test" onclick="startPVT()" />';
		testStop=(new Date()).getTime();
		var duration=parseInt((testStop-testStart)/1000);
		var numResponses= responseTimes.length;
		var avgResponseTime=parseInt(responseTimes.avg());
		//alert("Average response Time= "+responseTimes.avg());
		var str="<h2>Results:</h2><p>Test Duration= "+duration+" seconds</p><p>Number of false starts= "+numFalseStarts+"</p>";
		str += "<p>Average response time= "+ avgResponseTime+" msec over "+numResponses+" attempts.</p>";
		if(avgResponseTime<=300){
			str+="<p><b>Your results show that your vigilance and alertness are excellent</b></p>";
		}else{
			str+="<p><b>Your results show that your alertness may be suboptimal. Consider medical evaluation.</b></p>";
		}
		if(numResponses==0){
			str="<p>Test aborted. Refresh or reload this page to try again.</p>";
		}
		document.getElementById("responseOut").innerHTML=str;
		window.location.href="#responseOut";
	}
	
	//displays running timer in box
	function displayTimer(){
		if(!timerOn){
			return;
		}
		document.getElementById("numeric").innerHTML="<h1>"+count+"</h1>";
		if(count==0){
			startT=(new Date()).getTime();
		}
		count +=100;
		if(count>maxResponseTime){
			resetDisplayTimer();
			return;
		}
		t=setTimeout("displayTimer()", 100);
	}
	//calculates average of numeric values in array
	//copied from: http://javascript.about.com/library/blaravg.htm
	Array.prototype.avg = function() {
		var av = 0;
		var cnt = 0;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			var e = +this[i];
			if(!e && this[i] !== 0 && this[i] !== '0') e--;
			if (this[i] == e) 
				{av += e; cnt++;}
		}
		return av/cnt;
	}
//]]>
