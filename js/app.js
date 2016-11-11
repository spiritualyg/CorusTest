/* 
     Corus coding test, author: Yu Gao
*/
$(document).ready(function(){
	var dataSet,
		verticalMove
		carouselDiv = $('.carousel'),
		leftArrowBtn = $('#left-arrow-btn'),
		rightArrowBtn = $('#right-arrow-btn'),
		colorList = {
			Liberal: 'red',
			PC:'blue',
			NDP:'orange',
			Green:'green'
		}
		animationDone = true;

	//function to generate div inside carouse item for one election result
	var generateRidingItem = function(data){
		var itemDiv,
			nameDiv,
			percentDiv,
			percentBar,
			voteDiv,
			themeColor;
		itemDiv = $("<div>",{class:'riding-item'});
		nameDiv = $("<div>",{class:'name-block'});
		percentDiv = $("<div>",{class:'percent-block'});
		percentBar = $("<div>",{class:'percent-bar'})
		voteDiv = $("<div>",{class:'vote-block'});
		//highlight winner
		if(data.isElected){
			nameDiv.css('font-weight','bold');
			nameDiv.append($('<img>',{'src':'images/winner-flag.png', class:'winner-flag'}));
			voteDiv.css('font-weight','bold');
		}
		nameDiv.append($("<span>"+data.name+"</span>"));
		//set width of percentage bar
		percentBar.text(parseInt(data.voteRatio*100)+'%').css('width',data.voteRatio*100+'%');
		if(colorList[data.partyCode])
			themeColor = colorList[data.partyCode];
		else
			themeColor = 'grey';
		percentBar.css('background-color',themeColor);
		percentDiv.append(percentBar);
		voteDiv.text(data.votes);
		itemDiv.append(nameDiv).append(percentDiv).append(voteDiv);
		return itemDiv;
	}

	//function to generate div for one carouse item
	var generateCarouseItem = function(result){
			var carouseDiv,
				title,
				headDiv,
				nameDiv,
				percentDiv;
			carouseDiv = $("<div>",{class:'carousel-item'});
			title = $('<h2>',{style:'text-align:center'});
			headDiv = $("<div>",{class:'head-item'});
			nameDiv = $("<div>",{style:'width:30%;display:inline-block;'});
			percentDiv = $("<div>",{style:'width:50%;display:inline-block;'});
			voteDiv = $("<div>",{style:'width:20%;display:inline-block;'});
			title.text(result.name);
			carouseDiv.append(title);
			nameDiv.text('NAME');
			percentDiv.text('PERCENTAGE');
			voteDiv.text('VOTES');
			headDiv.append(nameDiv).append(percentDiv).append(voteDiv);
			carouseDiv.append(headDiv);
			for(var i=0;i<result.results.length;i++){
				carouseDiv.append(generateRidingItem(result.results[i]));
			}
			return carouseDiv;
	}

	//callback function for jsonp request
	var gNews_getRidingDetailsCallback = function(json){
	  dataSet = json;
	  for(var i=0;i<dataSet.length;i++){
	  		var totalVoteCount = 0;
	  		//add vote ration property to each result
	  		for(var j=0;j<dataSet[i].results.length;j++){
	  			totalVoteCount+=dataSet[i].results[j].votes;
	  		}
	  		for(var k=0;k<dataSet[i].results.length;k++){
	  			dataSet[i].results[k].voteRatio = dataSet[i].results[k].votes/totalVoteCount;
	  		}
	  		//sort cadidate list by votes
	  		dataSet[i].results.sort(function(a,b){
	  			return b.votes-a.votes;
	  		});
	  		//generate carousel item
			carouselDiv.append(generateCarouseItem(dataSet[i]));
	  }
		leftArrowBtn.click(function(){
			verticalMove = 0.8*$( document ).width();
			if(animationDone){
				animationDone = false;
				$(".carousel").animate({marginLeft:-verticalMove},500,function(){
					$(this).children().last().after($(this).children().first());
					$(this).css({marginLeft:0});
					animationDone = true;
				});
			}
		});
		rightArrowBtn.click(function(){
			verticalMove = 0.8*$( document ).width();
			if(animationDone){
				animationDone = false;
				$(".carousel").children().first().before($(".carousel").children().last());
				$(".carousel").css({marginLeft:-verticalMove});
				$(".carousel").animate({marginLeft:0},500,function(){
					animationDone = true;
				});
			}
		});
	}

	//calling json feed
	$.ajax({
	  url: "http://static.globalnews.ca/content/test/results-2011.js",
	  dataType: "jsonp",
	  jsonpCallback: "gNews_getRidingDetailsCallback"
	}).done(gNews_getRidingDetailsCallback);

});