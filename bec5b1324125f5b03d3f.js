import _asyncToGenerator from"@babel/runtime/helpers/asyncToGenerator";import _regeneratorRuntime from"@babel/runtime/regenerator";import{getCurrentLocation,getWeatherDataAndDisplayIt}from"./functions";getCurrentLocation().then((function(e){return getWeatherDataAndDisplayIt(e.replace("’",""))}));var button=document.getElementById("button");button.addEventListener("click",_asyncToGenerator(_regeneratorRuntime.mark((function e(){var t,r;return _regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=document.getElementById("input"),r=t.value.charAt(0).toUpperCase()+t.value.toLowerCase().slice(1),t.value="",e.next=5,getWeatherDataAndDisplayIt(r);case 5:case"end":return e.stop()}}),e)}))));