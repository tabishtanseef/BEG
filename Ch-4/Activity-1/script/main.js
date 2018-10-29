/* get size of an object */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};


var totalQuestion = Object.size(dataCollection),
	currentAnswer;

function init()
{
	$('#dvHeader').html(heading);
	$('#notification_Msg_Print').html(helpTxt);
	$('#containerDiv h2').html(activitTitle);
	$('#submit').html(btnLabel["submitbtn"]);
	$('#next').html(btnLabel["nextbtn"]);
	$('#try').html(btnLabel["tryAgain"]);
	
	loadQuestion();
}

function loadQuestion()
{
	$('#container').empty();

	for(var index=1; index<=totalQuestion; index++)
	{
		var sentence = dataCollection[index]["question"];
		var words = sentence.split(" ");
		
		//console.log(words);
		
		$div = $('<div id="subContainer' + index + '"></div>');
		$ul = $('<ul></ul>').attr({'data-count': dataCollection[index]["serial"]});
		if(dataCollection[index]["serial"] == null || dataCollection[index]["serial"] == "")
			$ul.addClass('noserial');
		
		for(var j=0; j<words.length; j++)
		{
			$('<li></li>')
				.html($('<span></span>').html(words[j]))
				.appendTo($ul);
		}
		
		$ul.appendTo($div);
		$div.appendTo('#container')
			.find('li span')
			.click(function(e)
			{
				$('#submit').removeAttr('disabled');
				$(this).toggleClass('active');
			});
	}
}

function checkAnswer()
{
	var isAllCorrect = true;
	$('#submit').attr('disabled', 'disabled');
	$('#container div').each(function(index, element) {
		
		var ans = dataCollection[index+1]["answer"];
		
		$(this).find('li span.active').addClass('incorrect');

		for(var i=0; i<ans.length; i++)
		{
			$ele = $(this).find('li span').unbind('click').eq((ans[i]-1));
			
			//console.log($ele.hasClass('active'), $ele.text());
			if($ele.hasClass('active'))
			{
				$ele.addClass('correct').removeClass('incorrect');
			}
			else
			{
				isAllCorrect = false;
			}
		}
		
		
    });
	
	if(!isAllCorrect) playAudio('try-again.mp3');
	else {
		
		$('#tab').addClass('hidden');
		$('.krish').removeClass('hidden');
	
		
	playAudio('well-done.mp3');}
	
	if($('.incorrect').length == 0)
	{
		actComplete();	
		
	}
	else
	{
		$('#next').removeAttr('disabled');
		$('#try').removeAttr('disabled');
	}
	if($('.correct').length == 0)
	{
		actComplete();
		
	}
	else
	$('#next').removeAttr('disabled');
	$('#try').removeAttr('disabled');
}

function showHelp()
{
	$('.notifiactinMsgWrapper').fadeToggle();
	return false;
}

function actComplete()
{
	return false;
	setTimeout(function()
	{
		$('.errorMsg').fadeIn().html(msgComplete);
	}, 2000);
}

function showAnswer()
{
	$('#next').attr('disabled', 'disabled');
	$('#container div').each(function(index, element) {
		var ans = dataCollection[index+1]["answer"];
		for(var i=0; i<ans.length; i++)
		{
			$ele = $(this).find('li span').eq((ans[i]-1));
			$ele.css({'background' : '#109804', "color" : "#FFF"});
		}
    });
	$('.incorrect').removeClass('incorrect');
	
	$('.active').removeClass('active');
	actComplete();
}

function submitAgain()
{
	$('#try').attr('disabled', 'disabled');
	$('#next').attr('disabled', 'disabled');
	$('#submit').attr('disabled', 'disabled');
	
	$('#container div').each(function(index, element)
	{
		var child = $(this).find('li span');
		
		for(var i=0; i<child.length; i++)
		{
			if($(child[i]).hasClass('incorrect'))
			{
				$(child[i]).removeClass('incorrect');
				$(child[i]).removeClass('active');
			}
		}
    });
} 

$(document).ready(function(e) {
    init();
	//$("#container").mCustomScrollbar();
});
function fnShowAudioPlayer(){
	var x = "<div id='dvAudioControl' class='audioPlayer'>"+
				"<object id='auTest' type='application/x-shockwave-flash' data='audio/mp3_player.swf' width='200' height='20'>"+
					"<param name='wmode' value='transparent' />"+
					"<param name='movie' value='audio/mp3_player.swf' />"+
					"<param name='FlashVars' value='mp3=audio/1.mp3&amp;showvolume=1&amp;autoplay=1' />"+
				"</object>"+
				"<img src='img/icon_close.png' class='btnCloseAudio' onclick='fnHideAudioControl()'></img>"+
			"</div>";
	$("#audioContainerDiv").html(x);
	//$('#dvAudioControl').show();
	//var audioElement = document.getElementById('auTest');
	//audioElement.play();
}

function fnHideAudioControl(){
	$("#audioContainerDiv").html('');
	//var audioElement = document.getElementById('auTest');
	//audioElement.pause();
	//audioElement.currentTime=0;
	//$('#dvAudioControl').hide();
}
function playAudio(audioname) {
	var audio = new Audio("audio/" + audioname);
	audio.play();
}