var numsquare=6;
var color=[];
var pickedcolor;
var square=document.querySelectorAll(".square");
var colorDisplay=document.getElementById("colorDisplay");
var resetButton=document.querySelector("#reset");
var message=document.getElementById("message");
var h1=document.querySelector("h1");
var modeButton=document.querySelectorAll(".mode");

init();

function init()
{
	setUpModeButton();
	setUpSquare();
	reset();
}

function setUpModeButton()
{
	for (var i = 0; i <modeButton.length; i++) {
	modeButton[i].addEventListener("click",function()
	{
	modeButton[0].classList.remove("selected");
	modeButton[1].classList.remove("selected");
	this.classList.add("selected");
	if(this.textContent === "Easy")
	{
		numsquare=3;
	}
	else{
		numsquare=6;
	}

	reset();
});
}
}

function setUpSquare()
{
	for(var i=0;i<square.length;i++)
	{
   square[i].addEventListener("click",function()
   {
   	var clickedcolor=this.style.background;

   	if(clickedcolor === pickedcolor)
   	{
   		changecolor(clickedcolor);
   		message.textContent="correct";
   		h1.style.background=clickedcolor;
   		resetButton.textContent="Play Again?";
   	}
   	else
   	{
   		this.style.background = "#232323";
   		message.textContent="try again";
   	}
   });
}
}
function reset()
{
	color=randomColor(numsquare);
	pickedcolor=pickColor();
	colorDisplay.textContent=pickedcolor;
	resetButton.textContent="New Color";
	for (var i = 0; i <square.length; i++) {
		if(color[i])
		{
			square[i].style.display="block";
			square[i].style.background=color[i];
		}
		else{
				square[i].style.display="none";
		}
	
	}
	h1.style.background="steelblue";
	message.textContent="";
}



resetButton.addEventListener("click",function()
{
	reset();
})


function changecolor(color)
{
	for(var i=0;i<square.length;i++)
	{
	square[i].style.background = color;
	}
}


function pickColor()
{
	var random=Math.floor(Math.random() * color.length);
	return color[random];
}

function randomColor(num)
{
	var arr = [];
	for (var i = 0; i<num; i++) {
		arr.push(getRandomColor());

	}
	return arr;
}

function getRandomColor()
{
	var r=Math.floor(Math.random() * 256);
	var g=Math.floor(Math.random() * 256);
	var b=Math.floor(Math.random() * 256);

	return "rgb(" + r + ", " + g + ", " + b + ")";
}