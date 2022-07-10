<?php
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    exit(0);
}

require("../general.php");


function addMeet($fData, $season) {
	$idx = getDB("meets." . $season . ".index") + 0;
	putDB("meets." . $season . "." . $idx, $fData);
	putDB("meets." . $season . ".index", $idx + 1);
}

global $dBS;
$json = file_get_contents('php://input');
$data = json_decode($json, true);
var_dump($data);
addMeet($data['meet'], $data['season']);
echo "Meet added successfully!";

?>