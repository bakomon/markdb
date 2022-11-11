<?php

namespace Api\Test;

use Api\Services\Http;

require '../Services/Http.php';

$source_link = urldecode($_GET['url']);
$source_xml = Http::get($source_link);
$status_code = $source_xml::$status;

$data = [
    'status_code' => $status_code,
    'url' => $source_link,
];

header('Content-Type: application/json; charset=utf8');
http_response_code($status_code);
if (isset($_SERVER['HTTP_ORIGIN'])) header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
echo json_encode($data);
