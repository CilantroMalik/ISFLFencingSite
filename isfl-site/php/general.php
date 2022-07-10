<?php

require("dbman.php");
$fPass = "h2021";

$dbS = getAllDB("seasons");
$seasons = [];
foreach($dbS as $k=>$v) {
	array_push($seasons, array("name" => $v['name'], "iname" => $k));
}
function getHeader($noSeason = false) {
	global $seasons;
	global $dbS;
	global $season;
	$return = "<script type='text/javascript'> function printDiv(divName) { var printContents = document.getElementById(divName).innerHTML; w=window.open(); w.document.write(printContents); w.print(); w.close(); } </script> <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script> <link rel='shortcut icon' type='image/png' href='/icon.png' /> <script src='/sorttable.js'></script> <style> #headtxt a h1 { color:white; } #headtxt h2 a { color:white; } table.sortable thead { background-color:#eee; color:#333; font-weight: bold; cursor: default; } table.sortable tbody { background-color:#eee; color:#444; } </style> <title>ISFL Fencing</title> <div class='header'> <style> body { margin:0; padding:0; } .headh2 { margin:0; margin-right:10px; vertical-align:middle; font-size:25px; margin-top:7.5px; display:inline-block; } </style> <script> function setURLSearchParam(key, value) { const url = new URL(window.location.href); url.searchParams.set(key, value); window.history.pushState({ path: url.href }, '', url.href); } function update(obj, val) { setURLSearchParam('season', obj.options[val].attributes['name'].value); location.reload(); } </script> <div style='height:50px;'></div> <div style='width:100vw;background-color:#7AB7FF;height:50px;position:absolute;top:0;left:0;' id='headtxt'> <a href='/'> <img src='/icon.png' style='margin-left:10px;height:40px;vertical-align:middle;margin-top:5px;'> <h1 style='vertical-align:middle;margin:0;display:inline-block;text-decoration:underline;'>ISFL Fencing</h1> </a> <span style='float:right;vertical-align:middle;height:50px;'> <p style='color:white;vertical-align:middle;display:inline-block;'>Season: </p> <select id='seasonm' style='vertical-align:middle;' onchange='update(this, this.selectedIndex)'>";

	foreach ($seasons as $s) {
		$return .= "<option name='" . $s['iname'] . "'>" . $s['name'] . "</option>";
	}
	$return .= "</select>";
	if (!$noSeason) {
		$return .= "<h2 class='headh2'><a href='/view/meets.php'>Meets</a></h2>";
		if ($dbS[$season]['type'] == "individual") {
			$return .= "<h2 class='headh2'><a href='/view/fencers.php'>Fencers</a></h2>";
		}
		$return .= "<h2 class='headh2'><a href='/view/teams.php'>Teams</a></h2><h2 class='headh2'><a href='/addMeet.php'>Add Meet</a></h2>";
	}
	$return .= "</span></div></div>";
	return $return;
}

$lut1 = array("f" => "foil", "s" => "sabre", "e" => "epee");
$lut2 = array("b" => "boys", "g" => "girls");


function buildUrl($name, $value){$_GET[$name] = $value;return $_SERVER['SCRIPT_NAME'] . '?' . http_build_query($_GET);}

$api = str_starts_with(explode("/", explode("?", $_SERVER["REQUEST_URI"])[0])[1], "api");

$sNames = array();
foreach ($seasons as $s) {
	array_push($sNames, strval($s['iname']));
}
if (isset($_GET['season'])) {
	$season = $_GET['season'];
	$seasonName = "";
	if (!in_array($season, $sNames)) {
		if ($api) {
			header("content-type:application/json;");
			header("Access-Control-Allow-Origin: *");
			echo json_encode(array("error" => "unknown season"), JSON_PRETTY_PRINT);
			exit();
		} else {
			echo getHeader(true);
			die("Unknown season!");
		}
		die();
	}
	if (!$api) {
		echo "<script>function isValidHttpUrl(e){let t;try{t=new URL(e)}catch(e){return!1}return!('http:'!==t.protocol&&'https:'!==t.protocol||t.href!=e&&t.origin!=e)}window.addEventListener('load',function(){const e=new URLSearchParams(window.location.search);var t=document.getElementById('seasonm');Array.prototype.forEach.call(t.options,function(o,r){e.get('season')==o.attributes.name.value&&(t.selectedIndex=r)}),[...document.querySelectorAll('a')].forEach(e=>{const t=new URL(e.href);if(isValidHttpUrl(t)){for(let[e,o]of new URLSearchParams(window.location.search).entries())'season'==e&&t.searchParams.set(e,o);e.href=t.toString()}})});</script>";
	}
} else {
	header("Location: " .  buildUrl("season", "2122"));
	$season = "2122";
	$seasonName = "2021-2022";
}


initDB();

?>