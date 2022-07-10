<?php

require("general.php");

function addMeetTeam($fData) {
	global $season;
	$idx = getDB("meets." . $season . ".index") + 0;

	putDB("meets." . $season . "." . $idx, $fData);
	putDB("meets." . $season . ".index", $idx + 1);
}

function addMeetIndiv($fData) {
	global $season;
	$idx = getDB("meets." . $season . ".index") + 0;
	
	putDB("meets." . $season . "." . $idx, $fData);
	putDB("meets." . $season . ".index", $idx + 1);
}

global $dBS;
if (@isset($_POST['hteam'])) {
	echo getHeader();
	if ($_POST['password'] != $fPass) {
		die("Incorrect password!");
	}

	if ($dbS[$season]['type'] == "individual") {
		$matchIds = [];
		$boutIds = [];
		foreach($_POST as $key=>$val) {if (strpos($key, 'weapon_') === 0) {array_push($matchIds, explode("_", $key)[1]);}}
		foreach ($matchIds as $m) {array_push($boutIds, []);foreach($_POST as $key=>$val) {if (strpos($key, 'hfence_' . $m . "_") === 0) {array_push($boutIds[$m], explode("_", $key)[2]);}}}
	
		$types = [];
		foreach($matchIds as $m) {
			$typeBouts = [];
			foreach ($boutIds[$m] as $b) {
				array_push($typeBouts, array("hfencer" => $_POST['hfence_' . $m . '_' . $b], "afencer" => $_POST['afence_' . $m . '_' . $b], "htouch" => $_POST['hscore_' . $m . '_' . $b], "atouch" => $_POST['ascore_' . $m . '_' . $b], "winner" => ($_POST['hscore_' . $m . '_' . $b] > $_POST['ascore_' . $m . '_' . $b] ? "h" : "a")));
			}
			array_push($types, array("id" => time() . $_POST['weapon_' . $m][0] . $_POST['gender_' . $m][0] . $_POST['level_' . $m][0], "weapon" => $_POST['weapon_' . $m], "gender" => $_POST['gender_' . $m], "level" => $_POST['level_' . $m], "bouts" => $typeBouts));
		}
		$data = array("id" => time(), "season" => $season, "hteam" => $_POST['hteam'], "ateam" => $_POST['ateam'], "date" => $_POST['date'], "types" => $types);
		
		addMeetIndiv($data);
	} else {
		$matchIds = [];
		foreach($_POST as $key=>$val) {if (strpos($key, 'weapon_') === 0) {array_push($matchIds, explode("_", $key)[1]);}}
		
		$types = [];
		foreach($matchIds as $m) {
			array_push($types, array("id" => time() . $_POST['weapon_' . $m][0] . $_POST['gender_' . $m][0] . $_POST['level_' . $m][0], "weapon" => $_POST['weapon_' . $m], "gender" => $_POST['gender_' . $m], "level" => $_POST['level_' . $m], "hBW" => $_POST['hBW_' . $m], "aBW" => $_POST['aBW_' . $m], "hTW" => $_POST['hTW_' . $m], "aTW" => $_POST['aTW_' . $m]));
		}
		$data = array("id" => time(), "season" => $season, "hteam" => $_POST['hteam'], "ateam" => $_POST['ateam'], "date" => $_POST['date'], "types" => $types);

		//var_dump($data);
		//die();

		addMeetTeam($data);
	}

	echo "<script>window.location.replace('/view/meets.php?season=" . $season . "');</script>";
} else {
	echo getHeader();
	echo "
	<h1>Add Meet</h1>
	<h1>This is a " . $dbS[$season]['type'] . " stat season.</h1>
	<form action='/addMeet.php?season=" . $season . "' method='POST'>
		<label for='hteam'>Home Team:</label>
		<input type='text' name='hteam' required></input><br>
		<label for='hteam'>Away Team:</label>
		<input type='text' name='ateam' required></input><br><br>
		<div id='teams'>

		</div>
		<a href='javascript:addType()'>Add New Type</a><br><br>
		<input name='season' type='hidden' value='" . $season . "' />
		<br><label>Date of Meet:</label>
		<input type='date' id='datef' name='date' required>
		<br><label>Password:</label>
		<input type='text' name='password' required></input><br>
		<h3>This meet will be added to season: <span id='seasonTxt'>" . $season . "</span></h3>
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
		
		var meetTemplateTEAMS = '" . '<div style="border:1px solid black;padding:5px;color:red;" class="type"><select name="weapon_NUM" id="weaponf"> <option value="foil">Foil</option> <option value="sabre">Sabre</option> <option value="epee">Epee</option> </select> <select name="gender_NUM" id="genderf"> <option value="boys">Boys</option> <option value="girls">Girls</option> </select> <select name="level_NUM" id="levelf"> <option value="varsity">Varsity</option> </select> <table border="1"><tr><td></td><td>Home</td><td>Away</td></tr><tr><td>Bouts Won:</td><td><input name="hBW_NUM" type="number" required></input></td><td><input name="aBW_NUM" type="number" required></input></td></tr><tr><td>Touches Won:</td><td><input name="hTW_NUM" type="number" required></input></td><td><input name="aTW_NUM" type="number" required></input></td></tr></table>' . "';
		var meetTemplateINDIV = '" . '<div style="border:1px solid black;padding:5px;" class="type"><select name="weapon_NUM" id="weaponf"> <option value="foil">Foil</option> <option value="sabre">Sabre</option> <option value="epee">Epee</option> </select> <select name="gender_NUM" id="genderf"> <option value="boys">Boys</option> <option value="girls">Girls</option> </select> <select name="level_NUM" id="levelf"> <option value="varsity">Varsity</option> </select> <p style="margin-bottom:0px;margin:5px;">Bouts:</p> <div id="bouts_NUM"></div> <a href="javascript:addBout(bouts_NUM, NUM)">Add New Bout</a><br> </div>' . "';
		//" . '<a style="float:right;color:red;font-size:20px;" href="#" onclick="delType(this);">Delete Type</a>' . "

		function addBout(eId, matchId) {
			$('#' + eId.id).append(boutTemplate.replaceAll('NUM', boutNum[matchId]).replaceAll('MID', matchId));
			boutNum[matchId] += 1;
		}
		
		function addType() {
			$('#teams').append(" . ($dbS[$season]['type'] == "individual" ? "meetTemplateINDIV" : "meetTemplateTEAMS") . ".replaceAll('NUM', meetNum));
			meetNum += 1;
			boutNum.push(0);
		}

		String.prototype.replaceAt = function(index, replacement) {
			return this.substring(0, index) + replacement + this.substring(index + replacement.length);
		}		
		function delType(call) {
			call.parentNode.remove();
			meetNum = 0;
			document.querySelectorAll('.type').forEach((e) => {
				var oldnum = e.innerHTML.split('weapon_')[1].split('\"')[0];
				var replace = '_' + oldnum + '.';
				var re = new RegExp(replace,'g');
				match = re.exec(e.innerHTML);
				while (match != null) {
					e.innerHTML = e.innerHTML.replaceAt(match.index+1, meetNum + '' + match[0][2]);
					match = re.exec(e.innerHTML);
				}
				e.innerHTML = e.innerHTML.replace('javascript:addBout(bouts_' + e.innerHTML.split('weapon_')[1].split('\"')[0] + ', ' + oldnum + ')', 'javascript:addBout(bouts_' + e.innerHTML.split('weapon_')[1].split('\"')[0] + ', ' + e.innerHTML.split('weapon_')[1].split('\"')[0] + ')');
				
				meetNum++;
			});
			boutNum = boutNum.splice(call.innerHTML.split('weapon_')[1].split('\"')[0], 1);
		}
		
	</script>";
}
