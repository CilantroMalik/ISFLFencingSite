<?php

require("general.php");

function getTypeHTML($tData, $num)
{
	global $dbS;
	global $season;
	if ($dbS[$season]['type'] == "team") {
		//<a style="float:right;color:red;font-size:20px;" href="#" onclick="delType(this);">Delete Type</a>
		return '<div style="border:1px solid black;padding:5px;color:red;">
			<select name="weapon_' . $num . '" id="weaponf">
				<option value="foil" ' . ($tData["weapon"] == "foil" ? "selected" : "") . '>Foil</option>
				<option value="sabre" ' . ($tData["weapon"] == "sabre" ? "selected" : "") . '>Sabre</option>
				<option value="epee" ' . ($tData["weapon"] == "epee" ? "selected" : "") . '>Epee</option>
			</select> 
			<select name="gender_' . $num . '" id="genderf">
				<option value="boys" ' . ($tData["gender"] == "boys" ? "selected" : "") . '>Boys</option>
				<option value="girls" ' . ($tData["gender"] == "girls" ? "selected" : "") . '>Girls</option>
			</select>
			<select name="level_' . $num . '" id="levelf">
				<option value="varsity" ' . ($tData["level"] == "varsity" ? "selected" : "") . '>Varsity</option>
			</select>
			<table border="1">
				<tr>
					<td></td>
					<td>Home</td>
					<td>Away</td>
				</tr>
				<tr>
					<td>Bouts Won:</td>
					<td><input name="hBW_' . $num . '" type="number" required value="' . $tData["hBW"] . '"></input></td>
					<td><input name="aBW_' . $num . '" type="number" required value="' . $tData["aBW"] . '"></input></td>
				</tr>
				<tr>
					<td>Touches Won:</td>
					<td><input name="hTW_' . $num . '" type="number" required value="' . $tData["hTW"] . '"></input></td>
					<td><input name="aTW_' . $num . '" type="number" required value="' . $tData["aTW"] . '"></input></td>
				</tr>
			</table>
		</div>';
	} else if ($dbS[$season]['type'] == "individual") {
		//ADD THIS
	}
	return;
}

echo getHeader();
global $dbS;
global $season;
if (@isset($_POST['hteam'])) {
	if ($fPass != $_POST["password"]) {
		echo "Invalid password!";
	} else {
		echo "Processing...";
		//process diff and set new vals ADD PROCESSING FOR INDIVIDUAL
		$oldData = findFileDB("meets." . $season, $_POST['id']);

		$matchIds = [];
		foreach ($_POST as $key => $val) {
			if (strpos($key, 'weapon_') === 0) {
				array_push($matchIds, explode("_", $key)[1]);
			}
		}

		$types = [];
		foreach ($matchIds as $m) {
			array_push($types, array("id" => $_POST["id"] . $_POST['weapon_' . $m][0] . $_POST['gender_' . $m][0] . $_POST['level_' . $m][0], "weapon" => $_POST['weapon_' . $m], "gender" => $_POST['gender_' . $m], "level" => $_POST['level_' . $m], "hBW" => $_POST['hBW_' . $m], "aBW" => $_POST['aBW_' . $m], "hTW" => $_POST['hTW_' . $m], "aTW" => $_POST['aTW_' . $m]));
		}
		$data = array("id" => intval($_POST["id"]), "season" => $season, "hteam" => $_POST['hteam'], "ateam" => $_POST['ateam'], "date" => $_POST['date'], "types" => $types);

		putDB("meets." . $season . "." . $oldData["FILEID"], $data);
		echo "<script>window.location = '/view/meets.php?m=" . $_POST['id'] . "&season=" . $_POST['season'] . "';</script>";
	}
} else if (@isset($_GET['id'])) {
	$data = findFileDB("meets." . $season, $_GET['id']);
	echo "
	<h1>Edit Meet</h1>
	<h3>Meet ID: " . $_GET['id'] . ". This is a " . $dbS[$season]['type'] . " stat season.</h3>
	<form action='/editMeet.php?season=" . $season . "' method='POST'>
		<input type='hidden' name='id' value='" . $_GET["id"] . "'></input>
		<label for='hteam'>Home Team:</label>
		<input type='text' name='hteam' required value='" . $data["hteam"] . "'></input><br>
		<label for='hteam'>Away Team:</label>
		<input type='text' name='ateam' required value='" . $data["ateam"] . "'></input><br><br>
		<div id='teams'>";

	$i = 0;
	foreach ($data["types"] as $t) {
		echo getTypeHTML($t, $i);
		$i += 1;
	}

	echo "</div>
		<a href='javascript:addType()'>Add New Type</a><br><br>
		<input name='season' type='hidden' value='" . $season . "' />
		<br><label>Date of Meet:</label>
		<input type='date' id='datef' name='date' required value='" . $data["date"] . "'>
		<br><label>Password:</label>
		<input type='text' name='password' required></input><br>
		<input type='submit' />
	</form>
	<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script><script>
		window.addEventListener('load', (event) => {
			var ele = document.getElementById('seasonTxt');
			var form = document.getElementById('seasonm').options;
			Array.from(form).forEach(function(o) {
				if(o.attributes.name.value == ele.innerHTML) {
					ele.innerHTML = o.innerHTML;
				}
			});
		});
		var meetNum = 0;
		var boutNum = [];
		var boutTemplate = '" . '<div style="border:1px solid black;margin:5px;"> <label>Home Fencer:</label> <input type="text" name="hfence_MID_NUM" required></input><br> <label>Away Fencer:</label> <input type="text" name="afence_MID_NUM" required></input><br> <label for="hscore_MID_NUMf">Home Score:</label> <select name="hscore_MID_NUM" id="hscore_MID_NUMf"> <option value="0">0</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select><br> <label for="ascore_MID_NUMf">Away Score:</label> <select name="ascore_MID_NUM" id="ascore_MID_NUMf"> <option value="0">0</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </div>' . "';
		
		var meetTemplateTEAMS = '" . '<div style="border:1px solid black;padding:5px;color:red;"><select name="weapon_NUM" id="weaponf"> <option value="foil">Foil</option> <option value="sabre">Sabre</option> <option value="epee">Epee</option> </select> <select name="gender_NUM" id="genderf"> <option value="boys">Boys</option> <option value="girls">Girls</option> </select> <select name="level_NUM" id="levelf"> <option value="varsity">Varsity</option> </select> <table border="1"><tr><td></td><td>Home</td><td>Away</td></tr><tr><td>Bouts Won:</td><td><input name="hBW_NUM" type="number" required></input></td><td><input name="aBW_NUM" type="number" required></input></td></tr><tr><td>Touches Won:</td><td><input name="hTW_NUM" type="number" required></input></td><td><input name="aTW_NUM" type="number" required></input></td></tr></table>' . "';
		var meetTemplateINDIV = '" . '<div style="border:1px solid black;padding:5px;"><select name="weapon_NUM" id="weaponf"> <option value="foil">Foil</option> <option value="sabre">Sabre</option> <option value="epee">Epee</option> </select> <select name="gender_NUM" id="genderf"> <option value="boys">Boys</option> <option value="girls">Girls</option> </select> <select name="level_NUM" id="levelf"> <option value="varsity">Varsity</option> </select> <p style="margin-bottom:0px;margin:5px;">Bouts:</p> <div id="bouts_NUM"></div> <a href="javascript:addBout(bouts_NUM, NUM)">Add New Bout</a><br> </div>' . "';
		
		function addBout(eId, matchId) {
			$('#' + eId.id).append(boutTemplate.replaceAll('NUM', boutNum[matchId]).replaceAll('MID', matchId));
			boutNum[matchId] += 1;
		}
		
		function addType() {
			$('#teams').append(" . ($dbS[$season]['type'] == "individual" ? "meetTemplateINDIV" : "meetTemplateTEAMS") . ".replaceAll('NUM', meetNum));
			meetNum += 1;
			boutNum.push(0);
		}

		function delType(call) {
			call.parentNode.remove();
		}
		
	</script>";
} else {
	die("Meet ID is required, please enter the edit menu from a meet.");
}
