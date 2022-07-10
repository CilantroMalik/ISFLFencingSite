<?php

require("general.php");
foreach (getAllDB("meets.2122") as $k=>$m) {
	echo $k . " "  . $m["hteam"] . " " . $m["ateam"] . "<br>";
}