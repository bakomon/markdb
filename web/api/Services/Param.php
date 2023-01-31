<?php

namespace Api\Services;

class Param
{
    public function show($data)
    {
        http_response_code($data->status_code);
        $new_data = json_encode($data);
        
        // if (!isset($_GET['dev']) && isset($_SERVER['HTTP_ORIGIN'])) header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']); //🟥 for plugin
        
        // https://stackoverflow.com/a/1678243/7598333
        if (isset($_GET['callback'])) :
            header('Content-Type: text/javascript; charset=utf8');
            if (isset($_SERVER['HTTP_REFERER'])) header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_REFERER']); //optional
            // header('Access-Control-Allow-Methods: GET'); //optional

            echo $_GET['callback'] . '(\'api/' . $_GET['index'] . '\', ' . $new_data . ');';
        else :
            header('Content-Type: application/json; charset=utf8');
            echo $new_data;
        endif;
    }

    public function get($info = null, $callback, $target)
    {
        $controller = new $callback;
        $this->show($controller->$target());
    }
}
