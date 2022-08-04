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
    
            $source_link = str_replace('{$page}', $page, $source['url']['latest']);
            $source_xml = Http::get($source_link);
    
            if (!$source_xml->isSuccess()) {
                return (object) $source_xml->showError();
            }
    
            $xpath = new DOMXpath($source_xml->responseParse());
            $lists = $xpath->query($source['LS']['parent']); //parent
    
            if ($lists->length > 0) :
                $ls_lists = [];
    
                foreach ($lists as $index) {
                    if ($source['theme'] == 'themesia') :
                        $color = '';
                        $date = '';
                    else :
                        $color = $xpath->query($source['LS']['color']['xpath'], $index);
                        $color = $color->length > 0 ? true : false;

                        $date = $xpath->query($source['latest']['date']['xpath'], $index);
                        $date = $date->length > 0 ? trim($date[0]->textContent) : '';
                    endif;
                    
                    $cover = $xpath->query($source['LS']['cover']['xpath'], $index);
                    $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['LS']['cover']['attr']) : '';

                    $type_el = $xpath->query($source['LS']['type']['xpath'], $index);
                    $type_el = $type_el->length > 0 ? $type_el[0]->getAttribute($source['LS']['type']['attr']) : '';
                    $type_chk = preg_match($source['LS']['type']['regex'], $type_el, $type);

                    $chapter = $xpath->query($source['latest']['chapter']['xpath'], $index);
                    $chapter = $chapter->length > 0 ? trim($chapter[0]->textContent) : '';

                    preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);
                    
                    array_push($ls_lists, [
                        'title' => trim($xpath->query($source['LS']['title']['xpath'], $index)[0]->textContent),
                        // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr'])), //remove search parameter and push
                        'cover' => $cover,
                        'type' => $type_chk ? strtolower($type[1]) : '',
                        'color' => $color,
                        'chapter' => $chapter,
                        'date' => $date,
                        'url' => $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['link']['attr']),
                        'slug' => $slug[1],
                    ]);
                }

                $nav_pattern = $source['LS']['nav']['regex'];
                $next_btn = $xpath->query($source['LS']['nav']['next']['xpath']);
                $prev_btn = $xpath->query($source['LS']['nav']['prev']['xpath']);

                // next button
                if ($next_btn->length > 0) :
                    preg_match($nav_pattern, $next_btn[0]->getAttribute($source['LS']['nav']['next']['attr']), $next);
                    $next = $next[1];
                else :
                    $next = '';
                endif;

                // prev button
                if ($prev_btn->length > 0) :
                    preg_match($nav_pattern, $prev_btn[0]->getAttribute($source['LS']['nav']['prev']['attr']), $prev);
                    $prev = empty($prev) ? '1' : $prev[1];
                else :
                    $prev = '';
                endif;
    
                $data = [
                    'status' => 'SUCCESS',
                    'status_code' => $source_xml::$status,
                    'next' => $next,
                    'prev' => $prev,
                    'source' => $source_link,
                    'lists' => $ls_lists,
                ];
            else :
                echo '{$lists} Not Found. $data = ';
            endif;
    
            return (object) $data;
        else :
            echo $_GET['source'] . ' not listed in $source_lists';
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
            $value = isset($_GET[$params]) && (!empty($_GET[$params]) || $_GET[$params] === '0') ?  $_GET[$params] : null;
    
            if ($value || $value === '0') :
                $search = ['{$page}', '{$value}'];
                $replace = [$page, urldecode($value)];
                $full_url = isset($_GET['params']) ? $source['url']['advanced'] : $source['url']['search'];
                $is_advanced = isset($_GET['params']) ? true : false;
                $source_link = str_replace($search, $replace, $full_url);
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) {
                    return (object) $source_xml->showError();
                }
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $lists = $xpath->query($source['LS']['parent']); //parent
                $ls_lists = [];
    
                if ($lists->length > 0) :
                    foreach ($lists as $index) {
                        if ($source['theme'] == 'themesia') :
                            $color = '';
                        else :
                            $color = $xpath->query($source['LS']['color']['xpath'], $index);
                            $color = $color->length > 0 ? true : false;
                        endif;

                        $cover = $xpath->query($source['LS']['cover']['xpath'], $index);
                        $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['LS']['cover']['attr']) : '';

                        $type_el = $xpath->query($source['LS']['type']['xpath'], $index);
                        $type_el = $type_el->length > 0 ? $type_el[0]->getAttribute($source['LS']['type']['attr']) : '';
                        $type_chk = preg_match($source['LS']['type']['regex'], $type_el, $type);
                        
                        preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);

                        array_push($ls_lists, [
                            'title' => trim($xpath->query($source['LS']['title']['xpath'], $index)[0]->textContent),
                            // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['LS']['cover']['xpath'], $index)[0]->getAttribute($source['LS']['cover']['attr'])), //remove search parameter and push
                            'cover' => $cover,
                            'type' => $type_chk ? strtolower($type[1]) : '',
                            'color' => $color,
                            'url' => $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['link']['attr']),
                            'slug' => $slug[1],
                        ]);
                    }

                    $nav_path = $source['theme'] == 'themesia' && !$is_advanced ? 'search' : 'LS';
                    $nav_pattern = $source[$nav_path]['nav']['regex'];
                    $next_btn = $xpath->query($source[$nav_path]['nav']['next']['xpath']);
                    $prev_btn = $xpath->query($source[$nav_path]['nav']['prev']['xpath']);
    
                    // next button
                    if ($next_btn->length > 0) :
                        preg_match($nav_pattern, $next_btn[0]->getAttribute($source[$nav_path]['nav']['next']['attr']), $next);
                        $next = $next[1];
                    else :
                        $next = '';
                    endif;
    
                    // prev button
                    if ($prev_btn->length > 0) :
                        preg_match($nav_pattern, $prev_btn[0]->getAttribute($source[$nav_path]['nav']['prev']['attr']), $prev);
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
                    'source' => $source_link,
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
    
            return (object) $data;
        else :
            echo $_GET['source'] . ' not listed in $source_lists';
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
                $source_link = str_replace('{$slug}', $slug, $source['url']['series']);
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) {
                    return (object) $source_xml->showError();
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
                    
                    $title = $xpath->query($source['series']['title']['xpath'], $article)[0]->textContent;
                    $title = preg_replace($source['series']['title']['regex'], '', $title);
                    $title = preg_replace($source['series']['title']['regex2'], '', $title);
                    
                    $cover = $xpath->query($source['series']['cover']['xpath'], $article);
                    $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['series']['cover']['attr']) : '';
                    
                    $type = $xpath->query($detail['type']['xpath'], $article);
                    $type = $type->length > 0 ? $type[0]->textContent : '';
                    if ($source_site == 'komiklab') :
                        $type = preg_replace($detail['type']['regex'], '', $type);
                        $type = preg_replace('/[\s\n\t]+$/', '', $type);
                    endif;

                    $status = preg_replace($detail['status']['regex'], '', $xpath->query($detail['status']['xpath'], $article)[0]->textContent);
                    if ($source_site == 'komiklab') :
                        $status = preg_replace('/[\s\n\t]+$/', '', $status);
                    endif;

                    $detail_list = [
                        'status' => $status,
                        'type' => strtolower($type),
                        'genre' => implode(', ', $gr_lists),
                    ];

                    $desc = $xpath->query($source['series']['desc']['xpath'], $article);
                    $desc = $desc->length > 0 ? $desc[0]->textContent : '';
    
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
                        'title' => $title,
                        'slug' => $slug,
                        // 'cover' => preg_replace('/\?.*/', '', $xpath->query($source['series']['cover']['xpath'], $article)[0]->getAttribute($source['series']['cover']['attr'])), //remove search parameter and push
                        'cover' => $cover,
                        'detail' => $detail_list,
                        'desc' => trim(preg_replace($source['series']['desc']['regex'], ' ', strip_tags($desc))),
                        'source' => $source_link,
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
    
            return (object) $data;
        else :
            echo $_GET['source'] . ' not listed in $source_lists';
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
            $chapter = isset($_GET['chapter']) && (!empty($_GET['chapter']) || $_GET['chapter'] === '0') ? $_GET['chapter'] : null;
            $data = [];
    
            if ($chapter || $chapter === '0') :
                $search = ['{$slug}', '{$chapter}'];
                $replace = [$slug, $chapter];
                $source_link = str_replace($search, $replace, $source['url']['chapter']);
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) {
                    return (object) $source_xml->showError();
                }
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $content = $xpath->query($source['chapter']['parent']); //parent
    
                if ($content->length > 0) :
                    $content = $content[0];
                    $img_lists = [];
    
                    preg_match($source['chapter']['title']['regex'], $xpath->query($source['chapter']['title']['xpath'])[0]->textContent, $title);
    
                    if ($source['theme'] == 'themesia') :
                        $cover = '';
    
                        $ch_script = $xpath->query($source['chapter']['nav']['xpath']);
                        if ($ch_script->length > 0) :
                            preg_match('/(\{[^\;]+)\)\;/', $ch_script[0]->textContent, $ts_reader);
                            $ch_data = json_decode($ts_reader[1], true);

                            $next_url = $ch_data[$source['chapter']['nav']['next']['name']];
                            if ($next_url != '') :
                                preg_match($source['chapter']['nav']['next']['regex'], $next_url, $next);
                                $next = $next[1];
                            else :
                                $next = '';
                            endif;

                            $prev_url = $ch_data[$source['chapter']['nav']['prev']['name']];
                            if ($prev_url != '') :
                                preg_match($source['chapter']['nav']['next']['regex'], $prev_url, $prev);
                                $prev = $prev[1];
                            else :
                                $prev = '';
                            endif;
        
                            $images = $ch_data['sources'][0]['images']; //"sources" & "images" from ts_reader
        
                            if (count($images) > 0) :
                                foreach ($images as $img) {
                                    array_push($img_lists, preg_replace('/\s/', '%20', $img));
                                }
                            endif;
                        else :
                            echo '"ts_reader" not found.';
                        endif;
                    else :
                        // cover selector without parent
                        // $cover = preg_replace('/\?.*/', '', $xpath->query($source['chapter']['cover']['xpath'])[0]->getAttribute($source['chapter']['cover']['attr'])); //remove search parameter and push
                        $cover = $xpath->query($source['chapter']['cover']['xpath']);
                        $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['chapter']['cover']['attr']) : '';

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
                        'cover' => $cover,
                        'current' => $chapter,
                        'next' => $next,
                        'prev' => $prev,
                        'source' => $source_link,
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
                    'cover' => '',
                    'current' => '',
                    'next' => '',
                    'prev' => '',
                    'images' => [],
                ];
            endif;
    
            return (object) $data;
        else :
            echo $_GET['source'] . ' not listed in $source_lists';
            exit();
        endif;
    }
}
