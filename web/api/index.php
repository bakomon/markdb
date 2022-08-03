<?php

namespace Api;

use Api\Services\Param;
use Api\CController;

require_once __DIR__ . '/Services/Param.php';
require_once __DIR__ . '/CController.php';

$param = new Param;
$URI = $_SERVER['REQUEST_URI'];
$allowedReferers = ['localhost', 'bakomon.epizy.com']; //https://stackoverflow.com/a/50684639/7598333
$rgx_escape = implode('|', array_map(function($value) { return preg_quote($value, '/'); }, $allowedReferers));

if (isset($_SERVER['HTTP_REFERER'])) :
    // if (in_array($_SERVER['HTTP_REFERER'], $allowedReferers)) :
    if (preg_match("/$rgx_escape/", $_SERVER['HTTP_REFERER'])) :
        if (isset($_GET['index'])) :
            $param->get($_GET['index'], CController::class, $_GET['index'] . 'Page');
        endif;
    else :
        http_response_code(403);
    endif;
elseif (isset($_GET['dev'])) :
    if (isset($_GET['index']) && !empty($_GET['index'])) :
        $param->get($_GET['index'], CController::class, $_GET['index'] . 'Page');
    endif;
endif;
