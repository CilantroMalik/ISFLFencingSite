<?php

require("general.php");

function addSeason($data) {
	putDB("seasons." . $data['iname'], array("name" =>  $data['name'], "type" => $data['type']));
}

if (@isset($_POST['name'])) {
	echo getHeader();
	if ($_POST['password'] != $fPass) {
		die("Incorrect password!");
	}
	addSeason($_POST);
	echo "Success!";
} else {
	echo getHeader();
	echo "
	<h1>Add Season</h1>
	<form action='/addSeason.php?season=" . $season . "' method='POST'>
		<label for='hteam'>Name:</label>
		<input type='text' name='name' required></input><br>
		<label for='hteam'>Internal Name (eg '2021-2022' -> '2122'):</label>
		<input type='text' name='iname' required></input><br>
		<label for='hteam'>Type:</label>
		<select name='type'>
			<option value='team'>Team Stats</option>
			<option value='individual'>Individual Stats</option>
		</select>

		<br><label>Password:</label>
		<input type='text' name='password'></input><br>
		<input type='submit'></input>
	</form>";
}