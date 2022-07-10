<?php

function initDB() {
	global $season;
	global $seasonName;
	if (!existsDB("meets." . $season . ".index")) {
		putDB("meets." . $season . ".index", 0);
	}
	if (!existsDB("seasons." . $season)) {
		putDB("seasons." . $season, array("name" => $seasonName, "type" => "team"));
	}
	if (!existsDB("recentMatches")) {
		putDB("recentMatches", array());
	}
}
function force_file_put_contents ($pathWithFileName, $data) {
  $dirPathOnly = dirname($pathWithFileName);
  if (!file_exists($dirPathOnly)) {
    mkdir($dirPathOnly, 0775, true);
  }
  file_put_contents($pathWithFileName, $data);
}
function putDB($path, $data) {
	force_file_put_contents(__DIR__ . "/db/" . str_replace(".", "/", $path), serialize($data));
	return true;
}
function getDB($path) {
	return unserialize(file_get_contents(__DIR__ . "/db/" . str_replace(".", "/", $path)));
}
function delDB($path) {
	return unlink(__DIR__ . "/db/" . str_replace(".", "/", $path));
}
function getDBRaw($path) {
	return unserialize(file_get_contents(str_replace(".", "/", $path)));
}
function getAllDB($path) {
	$p = __DIR__ . "/db/" . str_replace(".", "/", $path);
	
	if (!existsDB($path)) {
		return array();
	}
	
	$return = array();
	$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($p), FilesystemIterator::SKIP_DOTS);
	foreach ($rii as $di) {
		if (!($di->getFilename() == ".") && !($di->getFilename() == "..") && !($di->getFilename() == "index")) {
			$return[$di->getFilename()] = getDBRaw($di);
		}
	}
	return $return;
}

function findKeysDB($path) {	
	$p = __DIR__ . "/db/" . str_replace(".", "/", $path);
	
	if (!existsDB($path)) {
		return array();
	}
	
	$return = array();
	$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($p), FilesystemIterator::SKIP_DOTS);
	foreach ($rii as $di) {
		if (!($di->getFilename() == ".") && !($di->getFilename() == "..") && !($di->getFilename() == "index")) {
			array_push($return, $di->getFilename());
		}
	}
	return $return;
}

function findFileDB($path, $id) {
	$p = __DIR__ . "/db/" . str_replace(".", "/", $path);
	$rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($p), FilesystemIterator::SKIP_DOTS);
	foreach ($rii as $di) {
		if (!($di->getFilename() == ".") && !($di->getFilename() == "..") && !($di->getFilename() == "index")) {
			$data = getDBRaw($di);
			//foreach ($data['types'] as $t) {
				if ($data['id'] == $id) {
					$return = array();
					foreach ($data as $k=>$d) {
						//if (!is_array($d)) {
							$return[$k] = $d;
						//}
					}
					$return["FILEID"] = explode("\\", explode("/", $di)[sizeof(explode("/", $di)) - 1])[1];
					return $return;
				}
			//}
		}
	}
	return array();
}

function existsDB($path) {
	return file_exists(__DIR__ . "/db/" . str_replace(".", "/", $path));
}
function incIntDB($path, $stat, $amt) {
	$stats = getDB($path);
	$stats[$stat] += $amt;
	putDB($path, $stats);
}

?>