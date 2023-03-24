<?php

namespace Api;

use \DOMXpath;
use Api\Services\Http;
use Api\Services\xSelector;

require __DIR__ . '/Services/Http.php';
require __DIR__ . '/Services/xSelector.php';

class CController
{
    private function param_check($name)
    {
        return isset($_GET[$name]) && (!empty($_GET[$name]) || $_GET[$name] != '');
    }

    public function latestPage()
    {
        $selector = new xSelector;
        $source_site = $this->param_check('source') ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $page = $this->param_check('page') ? $_GET['page'] : '1';
            $data = [];
    
            $source_link = str_replace('{$page}', $page, $source['url']['latest']);
            $source_xml = Http::get($source_link);
    
            if (!$source_xml->isSuccess()) return (object) $source_xml->showError();
    
            $xpath = new DOMXpath($source_xml->responseParse());
            $lists = $xpath->query($source['LS']['parent']); //parent
    
            if ($lists->length > 0) :
                $ls_lists = [];
    
                foreach ($lists as $index) {
                    if (array_key_exists('type', $source['LS'])) :
                        $type_el = $xpath->query($source['LS']['type']['xpath'], $index);
                        $type_el = $type_el->length > 0 ? $type_el[0]->getAttribute($source['LS']['type']['attr']) : '';
                        $type_chk = preg_match($source['LS']['type']['regex'], $type_el, $type);
                    else :
                        $type_chk = false;
                    endif;

                    if (array_key_exists('color', $source['LS'])) :
                        $color = $xpath->query($source['LS']['color']['xpath'], $index);
                        $color = $color->length > 0 ? true : false;
                    else :
                        $color = '';
                    endif;
                    
                    if (array_key_exists('completed', $source['LS'])) :
                        $completed_el = $xpath->query($source['LS']['completed']['xpath'], $index);
                        if ($completed_el->length > 0) :
                            $completed_str = $source['theme'] == 'madara' ? trim($completed_el[0]->textContent) : $completed_el[0]->getAttribute($source['LS']['completed']['attr']);
                        else :
                            $completed_str = '';
                        endif;
                        $completed = preg_match($source['LS']['completed']['regex'], $completed_str);
                    else :
                        $completed = false;
                    endif;
                    
                    if (array_key_exists('date', $source['latest'])) :
                        $date = $xpath->query($source['latest']['date']['xpath'], $index);
                        $date = $date->length > 0 ? trim($date[0]->textContent) : '';
                    else :
                        $date = '';
                    endif;

                    $cover = $xpath->query($source['LS']['cover']['xpath'], $index);
                    $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['LS']['cover']['attr']) : '';
                    
                    // skip 18+
                    if ($source_site == 'maid' && preg_match('/\sdoujin/i', $type_el)) continue;

                    $chapter = $xpath->query($source['latest']['chapter']['xpath'], $index);
                    $chapter = $chapter->length > 0 ? trim($chapter[0]->textContent) : '';

                    preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);
                    
                    array_push($ls_lists, [
                        'title' => trim($xpath->query($source['LS']['title']['xpath'], $index)[0]->textContent),
                        'cover' => $cover,
                        'type' => $type_chk ? strtolower($type[1]) : '',
                        'color' => $color,
                        'completed' => $completed,
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
                    $prev_index = $source['theme'] == 'madara' && $prev_btn->length > 1 ? ($prev_btn->length - 1) : 0;
                    preg_match($nav_pattern, $prev_btn[$prev_index]->getAttribute($source['LS']['nav']['prev']['attr']), $prev);
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
        $source_site = $this->param_check('source') ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $page = $this->param_check('page') ? $_GET['page'] : '1';
            $data = [];
            
            $querams = $this->param_check('params') ? 'params' : 'query';
            $value = isset($_GET[$querams]) && (!empty($_GET[$querams]) || $_GET[$querams] === '0') ?  $_GET[$querams] : null;
    
            if ($value || $value === '0') :
                $is_advanced = $this->param_check('params') ? true : false;
                $qs = $is_advanced && $source['theme'] == 'eastheme' ? '?' : '';
                $search = ['{$page}', '{$value}'];
                $replace = $value == 'default' ? [$page, ''] : [$page, $qs . $value];
                $full_url = $is_advanced ? 'advanced' : 'search';
                $source_link = str_replace($search, $replace, $source['url'][$full_url]);

                if ($is_advanced && $value == 'default') $source_link = preg_replace('/[\?&]=?$/', '', $source_link);
                if ($source['theme'] == 'madara') :
                    if (strpos($source_link, '&s=') === FALSE) $source_link .= '&s';
                    if (strpos($source_link, '&type=') !== FALSE) $source_link = str_replace('&type', '&genre[]', $source_link);
                endif;
                if (strpos($value, 'order=') === FALSE && ($source['theme'] == 'koidezign' || $is_advanced && $value == 'default')) :
                    $s_qs = strpos($source_link, '?') !== FALSE ? '&' :'?';
                    $s_value = $source['theme'] == 'enduser' ? 'update' : 'latest'; //order/sort by "added (latest)"
                    $s_url = $source['theme'] == 'madara' ? 'my_orderby=new-manga' : ('order=' . $s_value);
                    $source_link .= $s_qs . $s_url;
                endif;
                
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) return (object) $source_xml->showError();
    
                $xpath = new DOMXpath($source_xml->responseParse());

                $par_path = array_key_exists('search', $source) ? 'search' : 'LS';
                $lists = $xpath->query($source[$par_path]['parent']); //parent
                $ls_lists = [];
    
                if ($lists->length > 0) :
                    foreach ($lists as $index) {
                        if (array_key_exists('type', $source['LS'])) :
                            $type_el = $xpath->query($source['LS']['type']['xpath'], $index);
                            $type_el = $type_el->length > 0 ? $type_el[0]->getAttribute($source['LS']['type']['attr']) : '';
                            $type_chk = preg_match($source['LS']['type']['regex'], $type_el, $type);
                        else :
                            $type_chk = false;
                        endif;

                        if (array_key_exists('color', $source['LS'])) :
                            $color = $xpath->query($source['LS']['color']['xpath'], $index);
                            $color = $color->length > 0 ? true : false;
                        else :
                            $color = '';
                        endif;
                        
                        if (array_key_exists('completed', $source['LS'])) :
                            $completed_el = $xpath->query($source['LS']['completed']['xpath'], $index);
                            if ($completed_el->length > 0) :
                                $completed_str = $source['theme'] == 'madara' ? trim($completed_el[0]->textContent) : $completed_el[0]->getAttribute($source['LS']['completed']['attr']);
                            else :
                                $completed_str = '';
                            endif;
                            $completed = preg_match($source['LS']['completed']['regex'], $completed_str);
                        else :
                            $completed = false;
                        endif;
                        
                        if ($source['theme'] == 'koidezign') :
                            $title = $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source[$par_path]['title']['attr']);
                        else :
                            $title = $xpath->query($source[$par_path]['title']['xpath'], $index)[0]->textContent;
                        endif;

                        $cover = $xpath->query($source['LS']['cover']['xpath'], $index);
                        $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['LS']['cover']['attr']) : '';
                        
                        // skip 18+
                        if ($source_site == 'maid' && preg_match('/\sdoujin/i', $type_el)) continue;
                        
                        preg_match($source['LS']['slug']['regex'], $xpath->query($source['LS']['link']['xpath'], $index)[0]->getAttribute($source['LS']['slug']['attr']), $slug);

                        array_push($ls_lists, [
                            'title' => trim($title),
                            'cover' => $cover,
                            'type' => $type_chk ? strtolower($type[1]) : '',
                            'color' => $color,
                            'completed' => $completed,
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
                        $prev_index = $source['theme'] == 'madara' && $prev_btn->length > 1 ? ($prev_btn->length - 1) : 0;
                        preg_match($nav_pattern, $prev_btn[$prev_index]->getAttribute($source[$nav_path]['nav']['prev']['attr']), $prev);
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
        $source_site = $this->param_check('source') ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $slug = $this->param_check('slug') ? $_GET['slug'] : null;
            $data = [];
    
            if ($slug) :
                $source_link = str_replace('{$slug}', $slug, $source['url']['series']);
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) return (object) $source_xml->showError();
    
                $dom = $source_xml->responseParse();
                $xpath = new DOMXpath($dom);

                $slink = $xpath->query($source['series']['shortlink']['xpath']);
                if ($slink->length > 0) :
                    preg_match($source['series']['shortlink']['regex'], $slink[0]->getAttribute($source['series']['shortlink']['attr']), $shortlink);
                    $slink = $shortlink[1];
                else :
                    $slink = $xpath->query("//article[contains(@id, 'post-')]");
                    if ($slink->length > 0) :
                        $slink = preg_replace('/post-(.*)/i', '', $slink[0]->getAttribute('id'));
                    else :
                        $slink = '';
                    endif;
                endif;

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

                    if (array_key_exists('alternative', $source['series'])) :
                        $alternative = $xpath->query($source['series']['alternative']['xpath'], $article);
                        $alternative = $alternative->length > 0 ? trim($alternative[0]->textContent) : '';
                        if (array_key_exists('regex', $source['series']['alternative'])) :
                            $alternative = preg_replace($source['series']['alternative']['regex'], '', $alternative);
                        endif;
                    else :
                        $alternative = '';
                    endif;
                    
                    $cover = $xpath->query($source['series']['cover']['xpath'], $article);
                    $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['series']['cover']['attr']) : '';
                    
                    $type = $xpath->query($detail['type']['xpath'], $article);
                    $type = $type->length > 0 ? $type[0]->textContent : '';
                    if (array_key_exists('regex', $detail['type'])) $type = preg_replace($detail['type']['regex'], '', $type);
                    
                    $status = $xpath->query($detail['status']['xpath'], $article)[0]->textContent;
                    if (array_key_exists('regex', $detail['status'])) $status = preg_replace($detail['status']['regex'], '', $status);

                    $detail_list = [
                        'status' => trim($status),
                        'type' => strtolower(trim($type)),
                        'genre' => implode(', ', $gr_lists),
                    ];

                    $desc = $xpath->query($source['series']['desc']['xpath'], $article);
                    $desc = $desc->length > 0 ? $desc[0]->textContent : '';

                    if ($source['theme'] == 'madara' && array_key_exists('ajax', $source['series']['chapter'])) :
                        $chapters_link = $source_link . $source['series']['chapter']['ajax'];
                        $chapters_xml = Http::post($chapters_link);
    
                        if (!$chapters_xml->isSuccess()) return (object) $chapters_xml->showError();
            
                        $chapter_list = $dom->createDocumentFragment();
                        $chapter_list->appendXML($chapters_xml->response());
                        $xpath->query($source['series']['chapter']['parent'], $article)[0]->appendChild($chapter_list);
                    endif;
    
                    $chapters = $xpath->query($source['series']['chapter']['xpath'], $article);
                    $ch_lists = [];
    
                    if ($chapters->length > 0) :
                        foreach ($chapters as $index) {
                            if ($source['theme'] == 'koidezign') :
                                $date = $xpath->query("//*[contains(@class, 'date')]", $index)[0];
                                $date->parentNode->removeChild($date);
                            endif;
                            $ch_el = array_key_exists('num', $source['series']['chapter']) ? $xpath->query($source['series']['chapter']['num'], $index)[0] : $index;
                            $ch_num = preg_replace('/chapter\s+/i', '', $ch_el->textContent);
                            $ch_url = $index->getAttribute($source['series']['chapter']['attr']);
                            $sr_slug = $slink ? preg_replace('/^' . $slink . '(\d+)?\-/i', '', $slug) : $slug; //remove shortlink
                            $ch_str = preg_replace('/' . $sr_slug . '/i', '', $ch_url);
                            $ch_str = preg_replace($source['series']['chapter']['regex2'], '', $ch_str);
                            preg_match($source['series']['chapter']['regex'], $ch_str, $chapter);
                            $ch_data = [
                                'number' => count($chapter) > 0 ? $chapter[1] : $ch_num,
                                'url' => parse_url($ch_url, PHP_URL_PATH),
                            ];
                            array_push($ch_lists, $ch_data);
                        }
                    endif;
    
                    $data = [
                        'status' => 'SUCCESS',
                        'status_code' => $source_xml::$status,
                        'title' => trim($title),
                        'alternative' => $alternative,
                        'slug' => $slug,
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
        $source_site = $this->param_check('source') ? $_GET['source'] : $selector::$source_default;
        if (in_array($source_site, $selector::$source_lists)) :
            $source = $selector->$source_site();
    
            $slug = $this->param_check('slug') ? $_GET['slug'] : null;
            $chapter = isset($_GET['chapter']) && (!empty($_GET['chapter']) || $_GET['chapter'] === '0') ? $_GET['chapter'] : null;
            $url = $this->param_check('url') ? $_GET['url'] : null;
            $data = [];
    
            if ($url || ($chapter || $chapter === '0')) :
                $search = ['{$slug}', '{$chapter}'];
                $replace = [$slug, $chapter];
                $source_link = $url ? $source['url']['host'] . $url : str_replace($search, $replace, $source['url']['chapter']);
                $source_xml = Http::get($source_link);
    
                if (!$source_xml->isSuccess()) return (object) $source_xml->showError();
    
                $xpath = new DOMXpath($source_xml->responseParse());
                $content = $xpath->query($source['chapter']['parent']); //parent
    
                if ($content->length > 0) :
                    $content = $content[0];
                    $img_lists = [];
    
                    $title_path = $source['chapter']['title']['xpath'];
                    if ($source_site == 'mgkomik') $title_path = $title_path . "//a[contains(@href, '$slug')]";
                    $title = $xpath->query($title_path)[0]->textContent;
                    if (preg_match($source['chapter']['title']['regex'], $title, $m_title)) :
                        $title = $m_title[1];
                    endif;
                    $title = preg_replace($source['chapter']['title']['regex2'], '', $title);
    
                    if ($source['theme'] == 'themesia') :
                        $cover = '';
    
                        $ch_script = $xpath->query($source['chapter']['nav']['xpath']);
                        if ($ch_script->length > 0) :
                            preg_match('/(\{[^\;]+)\)\;/', $ch_script[0]->textContent, $ts_reader);
                            $ch_data = json_decode($ts_reader[1], true);

                            $next_url = $ch_data[$source['chapter']['nav']['next']['name']];
                            if ($next_url != '') :
                                $next_str = preg_replace('/' . $slug . '/i', '', $next_url);
                                $next_str = preg_replace($source['chapter']['nav']['next']['regex2'], '', $next_str);
                                preg_match($source['chapter']['nav']['next']['regex'], $next_str, $next);
                                $next = [
                                    'number' => $next[1],
                                    'url' => parse_url($next_url, PHP_URL_PATH),
                                ];
                            else :
                                $next = json_decode('{}');
                            endif;

                            $prev_url = $ch_data[$source['chapter']['nav']['prev']['name']];
                            if ($prev_url != '') :
                                $prev_str = preg_replace('/' . $slug . '/i', '', $prev_url);
                                $prev_str = preg_replace($source['chapter']['nav']['prev']['regex2'], '', $prev_str);
                                preg_match($source['chapter']['nav']['prev']['regex'], $prev_str, $prev);
                                $prev = [
                                    'number' => $prev[1],
                                    'url' => parse_url($prev_url, PHP_URL_PATH),
                                ];
                            else :
                                $prev = json_decode('{}');
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
                        if (array_key_exists('cover', $source['chapter'])) :
                            // cover selector without parent
                            $cover = $xpath->query($source['chapter']['cover']['xpath']);
                            $cover = $cover->length > 0 ? $cover[0]->getAttribute($source['chapter']['cover']['attr']) : '';
                        else :
                            $cover = '';
                        endif;

                        $next_btn = $xpath->query($source['chapter']['next']['xpath'], $content);
                        if ($next_btn->length > 0) :
                            $next_url = $next_btn[0]->getAttribute($source['chapter']['next']['attr']);
                            $next_str = preg_replace('/' . $slug . '/i', '', $next_url);
                            $next_str = preg_replace($source['chapter']['next']['regex2'], '', $next_str);
                            preg_match($source['chapter']['next']['regex'], $next_str, $next);
                            $next = [
                                'number' => $next[1],
                                'url' => parse_url($next_url, PHP_URL_PATH),
                            ];
                        else :
                            $next = json_decode('{}');
                        endif;

                        $prev_btn = $xpath->query($source['chapter']['prev']['xpath'], $content);
                        if ($prev_btn->length > 0) :
                            $prev_url = $prev_btn[0]->getAttribute($source['chapter']['prev']['attr']);
                            $prev_str = preg_replace('/' . $slug . '/i', '', $prev_url);
                            $prev_str = preg_replace($source['chapter']['prev']['regex2'], '', $prev_str);
                            preg_match($source['chapter']['prev']['regex'], $prev_str, $prev);
                            $prev = [
                                'number' => $prev[1],
                                'url' => parse_url($prev_url, PHP_URL_PATH),
                            ];
                        else :
                            $prev = json_decode('{}');
                        endif;
    
                        $images = $xpath->query($source['chapter']['images']['xpath'], $content);
    
                        if ($images->length > 0) :
                            foreach ($images as $img) {
                                array_push($img_lists, trim($img->getAttribute($source['chapter']['images']['attr'])));
                            }
                        endif;
                    endif;
                    
                    $data = [
                        'status' => 'SUCCESS',
                        'status_code' => $source_xml::$status,
                        'title' => trim($title),
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
                ];
            endif;
    
            return (object) $data;
        else :
            echo $_GET['source'] . ' not listed in $source_lists';
            exit();
        endif;
    }
}
