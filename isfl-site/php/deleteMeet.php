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
if (@isset($_POST['id'])) {
	if ($fPass != $_POST["password"]) {
		echo "Invalid password!";
	} else {
		echo "Processing...";
		$oldData = findFileDB("meets." . $season, $_POST['id']);
		delDB("meets." . $season . "." . $oldData["FILEID"]);
		echo "<script>window.location = '/view/meets.php?season=" . $_POST['season'] . "';</script>";
	}
} else if (@isset($_GET['id'])) {
	$data = findFileDB("meets." . $season, $_GET['id']);
	echo "
	<h1>Delete Meet</h1>
	<h3>Meet ID: " . $_GET['id'] . ".</h3>
    <h2>You are DELETING this meet. It is irreversible. If data is entered wrong, please use the edit function.</h2>
	<form action='/deleteMeet.php?season=" . $season . "' method='POST'>
        <input type='hidden' name='id' value='" . $_GET["id"] . "'></input>
        <input type='hidden' name='season' value='" . $_GET["season"] . "'></input>
		<br><label>Password:</label>
		<input type='text' name='password' required></input><br>
		<input type='submit' />
	</form>";
} else {
	die("Meet ID is required, please enter the edit menu from a meet.");
}