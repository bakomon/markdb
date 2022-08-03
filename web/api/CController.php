<?php

namespace Api;

use \DOMXpath;
use Api\Services\Http;
use Api\Services\xSelector;

require __DIR__ . '/Services/Http.php';
require __DIR__ . '/Services/xSelector.php';

class CController
{
    public function latestPage()
    {
        $selector = new xSelector;
        $source_site = isset($_GET['source']) && !empty($_GET['source']) ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $page = isset($_GET['page']) && !empty($_GET['page']) ? $_GET['page'] : '1';
            $data = [];
    
            $source_xml = Http::get(str_replace('{$page}', $page, $source['url']['latest']));
    
            if (!$source_xml->isSuccess()) {
                return $source_xml->showError();
            }
    
            $xpath = new DOMXpath($source_xml->responseParse());
            $lists = $xpath->query($source['LS']['parent']); //parent
    
            if ($lists->length > 0) :
                $ls_lists = [];
    
                foreach ($lists as $index) {
                    preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);
                    array_push($ls_lists, [
                        'title' => trim($xpath->query($source['LS']['title']['xpath'], $index)[0]->textContent),
                        // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr'])), //remove search parameter and push
                        'cover' => $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr']),
                        'url' => $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['link']['attr']),
                        'slug' => $slug[1],
                    ]);
                }

                $patternt_page = $source['LS']['nav']['regex'];
                $next_btn = $xpath->query($source['LS']['nav']['next']['xpath']);
                $prev_btn = $xpath->query($source['LS']['nav']['prev']['xpath']);

                // next button
                if ($next_btn->length > 0) :
                    preg_match($patternt_page, $next_btn[0]->getAttribute($source['LS']['nav']['next']['attr']), $next);
                    $next = $next[1];
                else :
                    $next = '';
                endif;

                // prev button
                if ($prev_btn->length > 0) :
                    preg_match($patternt_page, $prev_btn[0]->getAttribute($source['LS']['nav']['prev']['attr']), $prev);
                    $prev = empty($prev) ? '1' : $prev[1];
                else :
                    $prev = '';
                endif;
    
                $data = [
                    'status' => 'SUCCESS',
                    'status_code' => $source_xml::$status,
                    'next' => $next,
                    'prev' => $prev,
                    'lists' => $ls_lists,
                ];
            else :
                echo '{$lists} Not Found. $data = ';
            endif;
    
            return $data;
        else :
            exit();
        endif;
    }

    public function searchPage()
    {
        $selector = new xSelector;
        $source_site = isset($_GET['source']) && !empty($_GET['source']) ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $page = isset($_GET['page']) && !empty($_GET['page']) ? $_GET['page'] : '1';
            $data = [];
            
            $params = isset($_GET['params']) ? 'params' : 'query';
            $value = isset($_GET[$params]) && !empty($_GET[$params]) ?  $_GET[$params] : null;
    
            if ($value) :
                $search = ['{$page}', '{$value}'];
                $replace = [$page, urldecode($value)];
                $full_url = isset($_GET['params']) ? $source['url']['advanced'] : $source['url']['search'];
                $source_xml = Http::get(str_replace($search, $replace, $full_url));
    
                if (!$source_xml->isSuccess()) {
                    return $source_xml->showError();
                }
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $lists = $xpath->query($source['LS']['parent']); //parent
                $ls_lists = [];
    
                if ($lists->length > 0) :
    
                    foreach ($lists as $index) {
                        preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);
                        array_push($ls_lists, [
                            'title' => trim($xpath->query($source['LS']['title']['xpath'], $index)[0]->textContent),
                            // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr'])), //remove search parameter and push
                            'cover' => $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr']),
                            'url' => $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['link']['attr']),
                            'slug' => $slug[1],
                        ]);
                    }

                    $patternt_page = $source['LS']['nav']['regex'];
                    $next_btn = $xpath->query($source['LS']['nav']['next']['xpath']);
                    $prev_btn = $xpath->query($source['LS']['nav']['prev']['xpath']);
    
                    // next button
                    if ($next_btn->length > 0) :
                        preg_match($patternt_page, $next_btn[0]->getAttribute($source['LS']['nav']['next']['attr']), $next);
                        $next = $next[1];
                    else :
                        $next = '';
                    endif;
    
                    // prev button
                    if ($prev_btn->length > 0) :
                        preg_match($patternt_page, $prev_btn[0]->getAttribute($source['LS']['nav']['prev']['attr']), $prev);
                        $prev = empty($prev) ? '1' : $prev[1];
                    else :
                        $prev = '';
                    endif;
                else :
                    // echo '{$lists} Not Found. $data = ';
                    $next = '';
                    $prev = '';
                endif;
    
                $data = [
                    'status' => 'SUCCESS',
                    'status_code' => $source_xml::$status,
                    'next' => $next,
                    'prev' => $prev,
                    'lists' => $ls_lists,
                ];
            else :
                $data = [
                    'status' => 'BAD_REQUEST',
                    'status_code' => 400,
                    'next' => '',
                    'prev' => '',
                    'lists' => [],
                ];
            endif;
    
            return $data;
        else :
            exit();
        endif;
    }

    public function seriesPage()
    {
        $selector = new xSelector;
        $source_site = isset($_GET['source']) && !empty($_GET['source']) ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $slug = isset($_GET['slug']) && !empty($_GET['slug']) ? $_GET['slug'] : null;
            $data = [];
    
            if ($slug) :
                $source_xml = Http::get(str_replace('{$slug}', $slug, $source['url']['series']));
    
                if (!$source_xml->isSuccess()) {
                    return $source_xml->showError();
                }
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $article = $xpath->query($source['series']['parent']); //parent
    
                if ($article->length > 0) :
                    $article = $article[0];
                    
                    $detail = $source['series']['detail'];
                    $genres = $xpath->query($detail['genre']['xpath'], $article);
                    $gr_lists = [];
    
                    if ($genres->length > 0) :
                        foreach ($genres as $index) {
                            array_push($gr_lists, $index->textContent);
                        }
                    endif;

                    $status = preg_replace($detail['status']['regex'], '', $xpath->query($detail['status']['xpath'], $article)[0]->textContent);
                    $type = $xpath->query($detail['type']['xpath'], $article)[0]->textContent;
                    $detail = [
                        'status' => $status,
                        'type' => $type,
                        'genre' => implode(', ', $gr_lists),
                    ];
    
                    $chapters = $xpath->query($source['series']['chapter']['xpath'], $article);
                    $ch_lists = [];
    
                    if ($chapters->length > 0) :
                        foreach ($chapters as $index) {
                            $length = preg_match($source['series']['chapter']['regex'], $index->getAttribute($source['series']['chapter']['attr']), $chapter);
                            array_push($ch_lists, $length > 0 ? $chapter[1] : '');
                        }
                    endif;
    
                    $data = [
                        'status' => 'SUCCESS',
                        'status_code' => $source_xml::$status,
                        'title' => preg_replace($source['series']['title']['regex'], '', $xpath->query($source['series']['title']['xpath'], $article)[0]->textContent),
                        'slug' => $slug,
                        // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['series']['cover']['xpath'], $article)[0]->getAttribute($source['series']['cover']['attr'])), //remove search parameter and push
                        'cover' => $xpath->query($source['series']['cover']['xpath'], $article)[0]->getAttribute($source['series']['cover']['attr']),
                        'detail' => $detail,
                        'desc' => trim(preg_replace($source['series']['desc']['regex'], ' ', strip_tags($xpath->query($source['series']['desc']['xpath'], $article)[0]->textContent))),
                        'chapter' => $ch_lists,
                    ];
                else :
                    echo '{$article} Not Found. $data = ';
                endif;
            else :
                $data = [
                    'status' => 'BAD_REQUEST',
                    'status_code' => 400,
                    'title' => '',
                    'slug' => '',
                    'cover' => '',
                    'desc' => '',
                    'chapter' => [],
                ];
            endif;
    
            return $data;
        else :
            exit();
        endif;
    }

    public function chapterPage()
    {
        $selector = new xSelector;
        $source_site = isset($_GET['source']) && !empty($_GET['source']) ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $slug = isset($_GET['slug']) && !empty($_GET['slug']) ? $_GET['slug'] : null;
            $chapter = isset($_GET['chapter']) && !empty($_GET['chapter']) ? $_GET['chapter'] : null;
            $data = [];
    
            if ($chapter) :
                $search = ['{$slug}', '{$chapter}'];
                $replace = [$slug, $chapter];
                $source_xml = Http::get(str_replace($search, $replace, $source['url']['chapter']));
    
                if (!$source_xml->isSuccess()) {
                    return $source_xml->showError();
                }
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $content = $xpath->query($source['chapter']['parent']); //parent
    
                if ($content->length > 0) :
                    $content = $content[0];
                    $img_lists = [];
    
                    preg_match($source['chapter']['title']['regex'], $xpath->query($source['chapter']['title']['xpath'])[0]->textContent, $title);
    
                    if ($source['theme'] == 'themesia') :
                        preg_match('/(\{[^\;]+)\)\;/', $content->textContent, $ts_reader);
                        $ch_data = json_decode($ts_reader[1], true);
    
                        $next = $ch_data[$source['chapter']['next']];
                        $prev = $ch_data[$source['chapter']['prev']];
    
                        $images = $ch_data['sources'][0]['images'];
    
                        if (count($images) > 0) :
                            foreach ($images as $img) {
                                array_push($img_lists, preg_replace('/\s/', '%20', $img));
                            }
                        endif;
                    else :
                        $next_btn = $xpath->query($source['chapter']['next']['xpath'], $content);
                        if ($next_btn->length > 0) :
                            preg_match($source['chapter']['next']['regex'], $next_btn[0]->getAttribute($source['chapter']['next']['attr']), $next);
                            $next = $next[1];
                        else :
                            $next = '';
                        endif;

                        $prev_btn = $xpath->query($source['chapter']['prev']['xpath'], $content);
                        if ($prev_btn->length > 0) :
                            preg_match($source['chapter']['prev']['regex'], $prev_btn[0]->getAttribute($source['chapter']['prev']['attr']), $prev);
                            $prev = $prev[1];
                        else :
                            $prev = '';
                        endif;
    
                        $images = $xpath->query($source['chapter']['images']['xpath'], $content);
    
                        if ($images->length > 0) :
                            foreach ($images as $img) {
                                array_push($img_lists, $img->getAttribute($source['chapter']['images']['attr']));
                            }
                        endif;
                    endif;
                    
                    $data = [
                        'status' => 'SUCCESS',
                        'status_code' => $source_xml::$status,
                        'title' => $title[1],
                        'slug' => $slug,
                        'current' => $chapter,
                        'next' => $next,
                        'prev' => $prev,
                        'images' => $img_lists,
                    ];
                else :
                    echo '{$content} Not Found. $data = ';
                endif;
            else :
                $data = [
                    'status' => 'BAD_REQUEST',
                    'status_code' => 400,
                    'title' => '',
                    'slug' => '',
                    'current' => '',
                    'next' => '',
                    'prev' => '',
                    'images' => [],
                ];
            endif;
    
            return $data;
        else :
            exit();
        endif;
    }
}
