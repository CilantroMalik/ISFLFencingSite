<?php

require("general.php");

echo getHeader() . "<style>h1.title {font-size:40px;color:#7AB7FF;margin:10px;}#content h2 {background-color:#7AB7FF;margin:10px;padding:10px;color:white;border-radius:10px;}p {padding-left:10px;}</style><div id='content'><h1 class='title'>Home</h1><h2>Welcome to ISFL Fencing!</h2><p style='width:800px;'>ISFL Fencing is an online database for reporting fencing league results. Once results are received, ISFL Fencing generates detailed statistics for teams and individual fencers. It is a replacement for the earlier BoutShout software that stopped operating a couple years ago.<br><br>ISFL Fencing is currently in beta testing, and is available only for the Independent Schools Fencing League.<br><br>Inquiries / Questions: snadol@students.hackleyschool.org.</p></div>";

/*
THIS DOESNT WORK ANYMORE WITH NEW DB - UNCOMMENT CODE IN addMeet.php TO RE-ENABLE, BUT WILL NEED TO CHANGE CODE
echo "<h2>Recent Matches</h2><ul>";
foreach (getDB("recentMatches") as $m) {
	if ($_GET['season'] == $m['season']) {
		foreach ($m['types'] as $t) {
			echo "<li><a href='/view/meets.php?m=" . $t['id'] . "'>[" . $m['date'] . "] " . $m['hteam'] . " vs. " . $m['ateam'] . " - " . $t['gender'] . " " . $t['weapon'] . "</a></li>";
		}
	}
}
echo '</ul>';
*/

?>