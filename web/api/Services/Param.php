<?php

namespace Api\Services;

class Param
{
    public function show($data)
    {
        // https://stackoverflow.com/a/1678243/7598333
        if (isset($_GET['callback'])) :
            header('Content-Type: text/javascript; charset=utf8');
            if (isset($_SERVER['HTTP_REFERER'])) header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_REFERER']); //optional
            //header('Access-Control-Allow-Methods: GET'); //optional

            echo $_GET['callback'] . '(\'api/' . $_GET['index'] . '\', ' . $data . ');';
        else :
            header('Content-Type: application/json; charset=utf8');
            echo $data;
        endif;
    }

    public function get($info = null, $callback, $target)
    {
        $controller = new $callback;
        $data = json_encode($controller->$target());
        $this->show($data);
    }
}
