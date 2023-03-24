<?php

namespace Api\Services;

class xSelector
{
    public static $source_default = 'mangatale';

    public static $source_lists = ['bacakomik', 'manhwaindo', 'tukangkomik', 'mangatale', 'komiklab', 'komikcast', 'maid', 'neumanga', 'mgkomik', 'shinigami'];

    public static function bacakomik()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'eastheme',
            'url' => [
                'host' => 'https://bacakomik.co',
                'latest' => 'https://bacakomik.co/komik-terbaru/page/{$page}/',
                'search' => 'https://bacakomik.co/page/{$page}/?s={$value}',
                'advanced' => 'https://bacakomik.co/daftar-manga/page/{$page}/{$value}',
                'series' => 'https://bacakomik.co/komik/{$slug}/',
                'chapter' => 'https://bacakomik.co/chapter/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'adds')]//a",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'datech')]",
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'animposx')]",
                'title' => [
                    'xpath' => ".//h4",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'typeflag')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'color' => [
                    'xpath' => ".//*[contains(@class, 'warnalabel')]",
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//article",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(text(), 'Status')]/parent::*",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Jenis')]/parent::*//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genre-info')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content') and @itemprop='description']",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapter_list']//*[contains(@class, 'lchx')]//a",
                    'num' => ".//chapter",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article//*[contains(@class, 'chapter-content')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'cover' => [ //no parent
                    'xpath' => "//*[@id='content']//*[contains(@class, 'infoanime')]//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[@id='chimg-auh']//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function manhwaindo()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'eastheme',
            'url' => [
                'host' => 'https://manhwaindo.org',
                'latest' => 'https://manhwaindo.org/komik-terbaru/page/{$page}/',
                'search' => 'https://manhwaindo.org/page/{$page}/?s={$value}',
                'advanced' => 'https://manhwaindo.org/daftar-komik/page/{$page}/{$value}',
                'series' => 'https://manhwaindo.org/komik/{$slug}/',
                'chapter' => 'https://manhwaindo.org/{$slug}-chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'adds')]//a",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'datech')]",
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'animposx')]",
                'title' => [
                    'xpath' => ".//h4",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'typeflag')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'color' => [
                    'xpath' => ".//*[contains(@class, 'warnalabel')]",
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//article",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(text(), 'Judul Alternatif')]/parent::*",
                    'regex' => '/([\s\n\t]+)?((judul\s)?alternati[fv]e?(\stitles?)?)\:?[\s\n\t]+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(text(), 'Status')]/parent::*",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Jenis')]/parent::*//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genre-info')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content') and @itemprop='description']",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapter_list']//*[contains(@class, 'lchx')]//a",
                    'num' => ".//chapter",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article//*[contains(@class, 'chapter-content')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'cover' => [ //no parent
                    'xpath' => "//*[@id='content']//*[contains(@class, 'infoanime')]//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[@id='chimg']//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function tukangkomik()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'themesia',
            'url' => [
                'host' => 'https://tukangkomik.id',
                'latest' => 'https://tukangkomik.id/manga/?page={$page}&order=update',
                'search' => 'https://tukangkomik.id/page/{$page}/?s={$value}',
                'advanced' => 'https://tukangkomik.id/manga/?page={$page}&{$value}',
                'series' => 'https://tukangkomik.id/manga/{$slug}/',
                'chapter' => 'https://tukangkomik.id/{$slug}-chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'adds')]//*[contains(@class, 'epxs')]",
                ],
            ],
            'search' => [
                'nav' => [
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'listupd')]//a/parent::*",
                'title' => [
                    'xpath' => ".//*[@class='tt']",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'status')]",
                    'attr' => 'class',
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/manga/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='r']",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='l']",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//article",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(text(), 'Judul Alternatif')]/parent::*",
                    'regex' => '/([\s\n\t]+)?((judul\s)?alternati[fv]e?(\stitles?)?)\:?[\s\n\t]+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Status')]",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Type')]//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'mgen')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content') and @itemprop='description']",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'num' => ".//*[contains(@class, 'chapternum')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                ],
                'images' => [], //images from ts_reader
            ],
        ];

        return $data;
    }

    public static function mangatale()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'themesia',
            'url' => [
                'host' => 'https://mangatale.co',
                'latest' => 'https://mangatale.co/manga/?page={$page}&order=update',
                'search' => 'https://mangatale.co/page/{$page}/?s={$value}',
                'advanced' => 'https://mangatale.co/manga/?page={$page}&{$value}',
                'series' => 'https://mangatale.co/manga/{$slug}/',
                'chapter' => 'https://mangatale.co/{$slug}-chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'adds')]//*[contains(@class, 'epxs')]",
                ],
            ],
            'search' => [
                'nav' => [
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'listupd')]//a/parent::*",
                'title' => [
                    'xpath' => ".//*[@class='tt']",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'status')]",
                    'attr' => 'class',
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/manga/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='r']",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='l']",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//article",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(text(), 'Alternative Title')]/parent::*",
                    'regex' => '/([\s\n\t]+)?((judul\s)?alternati[fv]e?(\stitles?)?)\:?[\s\n\t]+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Status')]",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Type')]//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'mgen')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content') and @itemprop='description']",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'num' => ".//*[contains(@class, 'chapternum')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                ],
                'images' => [], //images from ts_reader
            ],
        ];

        return $data;
    }

    public static function komiklab()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'themesia',
            'url' => [
                'host' => 'https://komiklab.com',
                'latest' => 'https://komiklab.com/manga/?page={$page}&order=update',
                'search' => 'https://komiklab.com/page/{$page}/?s={$value}',
                'advanced' => 'https://komiklab.com/manga/?page={$page}&{$value}',
                'series' => 'https://komiklab.com/manga/{$slug}/',
                'chapter' => 'https://komiklab.com/{$slug}-chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'adds')]//*[contains(@class, 'epxs')]",
                ],
            ],
            'search' => [
                'nav' => [
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'listupd')]//a/parent::*",
                'title' => [
                    'xpath' => ".//*[@class='tt']",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'data-src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'color' => [
                    'xpath' => ".//*[contains(@class, 'colored')]",
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'status')]",
                    'attr' => 'class',
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/manga/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='r']",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'hpage')]//a[@class='l']",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//article",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[@id='titlemove']//*[contains(@class, 'alternative')]",
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'data-src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Status')]",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Type')]//a"
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'mgen')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content') and @itemprop='description']",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'num' => ".//*[contains(@class, 'chapternum')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                        'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    ],
                ],
                'images' => [], //images from ts_reader
            ],
        ];

        return $data;
    }

    public static function komikcast()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'enduser',
            'url' => [
                'host' => 'https://komikcast.site',
                'latest' => 'https://komikcast.site/daftar-komik/page/{$page}/?order=update',
                'search' => 'https://komikcast.site/page/{$page}/?s={$value}',
                'advanced' => 'https://komikcast.site/daftar-komik/page/{$page}/?{$value}',
                'series' => 'https://komikcast.site/komik/{$slug}/',
                'chapter' => 'https://komikcast.site/chapter/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'list-update_item-info')]//*[contains(@class, 'chapter')]",
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'list-update_items-wrapper')]//*[contains(@class, 'list-update_item-image')]/../..", //same as parent::
                'title' => [
                    'xpath' => ".//*[@class='title']",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'status')]",
                    'attr' => 'class',
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//*[contains(@class, 'komik_info')]",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(@class, 'komik_info-content-native')]",
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'komik_info-content-thumbnail')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'komik_info-content-meta')]//*[contains(text(), 'Status')]/parent::*",
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'komik_info-content-meta')]//*[contains(text(), 'Type')]/parent::*//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'komik_info-content-genre')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'komik_info-description-sinopsis')]",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapter-wrapper']//*[contains(@class, 'komik_info-chapters-item')]//a",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//*[contains(@class, 'chapter_')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[contains(@class, 'main-reading-area')]//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function maid()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'koidezign',
            'url' => [
                'host' => 'https://www.maid.my.id',
                'latest' => 'https://www.maid.my.id/page/{$page}/',
                'search' => 'https://www.maid.my.id/page/{$page}/?s={$value}',
                'advanced' => 'https://www.maid.my.id/advanced-search/page/{$page}/?{$value}',
                'series' => 'https://www.maid.my.id/manga/{$slug}/',
                'chapter' => 'https://www.maid.my.id/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'chapter')]//li//a",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'chapter')]//li//*[contains(@class, 'date')]",
                ],
            ],
            'search' => [
                'parent' => "//*[contains(@class, 'flexbox2')]//*[contains(@class, 'flexbox2-content')]",
                'title' => [
                    'attr' => 'title',
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'flexbox4')]//*[contains(@class, 'flexbox4-content')]",
                'title' => [
                    'xpath' => ".//*[@class='title']//a",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/manga/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//*[contains(@class, 'series-flex')]",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//*[contains(@class, 'series-title')]//h2",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'series-thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'series-infoz')]//*[contains(@class, 'status')]",
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'series-infoz')]//*[contains(@class, 'type')]",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'series-genres')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'series-synops')]",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'series-chapterlist')]//*[contains(@class, 'flexch-infoz')]//a",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//*[@id='chapnav']/parent::*",
                'title' => [
                    'xpath' => ".//*[contains(@class, 'title-chapter')]",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[@id='chapnav']//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'rightnav')]//a[@rel='next']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'leftnav')]//a[@rel='prev']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[contains(@class, 'reader-area')]//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function neumanga()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'koidezign',
            'url' => [
                'host' => 'https://neumanga.net',
                'latest' => 'https://neumanga.net/page/{$page}/',
                'search' => 'https://neumanga.net/page/{$page}/?s={$value}',
                'advanced' => 'https://neumanga.net/advanced-search/page/{$page}/?{$value}',
                'series' => 'https://neumanga.net/series/{$slug}/',
                'chapter' => 'https://neumanga.net/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'chapter')]//li//a",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'chapter')]//li//*[contains(@class, 'date')]",
                ],
            ],
            'search' => [
                'parent' => "//*[contains(@class, 'flexbox2')]//*[contains(@class, 'flexbox2-content')]",
                'title' => [
                    'attr' => 'title',
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'flexbox4')]//*[contains(@class, 'flexbox4-content')]",
                'title' => [
                    'xpath' => ".//*[@class='title']//a",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//*[contains(@class, 'type')]",
                    'attr' => 'class',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/series/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//*[contains(@class, 'series-flex')]",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//*[contains(@class, 'series-title')]//h2",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'series-thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'series-infoz')]//*[contains(@class, 'status')]",
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'series-infoz')]//*[contains(@class, 'type')]",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'series-genres')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'series-synops')]",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'series-chapterlist')]//*[contains(@class, 'flexch-infoz')]//a",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//*[@id='chapnav']/parent::*",
                'title' => [
                    'xpath' => ".//*[contains(@class, 'title-chapter')]",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[@id='chapnav']//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'rightnav')]//a[@rel='next']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'leftnav')]//a[@rel='prev']",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[contains(@class, 'reader-area')]//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function mgkomik()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'madara',
            'url' => [
                'host' => 'https://mgkomik.com/',
                'latest' => 'https://mgkomik.com/page/{$page}/?s&post_type=wp-manga&m_orderby=latest',
                'search' => 'https://mgkomik.com/page/{$page}/?post_type=wp-manga&s={$value}',
                'advanced' => 'https://mgkomik.com/page/{$page}/?post_type=wp-manga&{$value}',
                'series' => 'https://mgkomik.com/komik/{$slug}/',
                'chapter' => 'https://mgkomik.com/komik/{$slug}/chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'tab-meta')]//*[contains(@class, 'chapter')]",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'tab-meta')]//*[contains(@class, 'post-on')]",
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'c-tabs-item__content')]",
                'title' => [
                    'xpath' => ".//*[@class='post-title']//a",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'src',
                ],
                'type' => [
                    'xpath' => ".//a[contains(@href, 'genres/manga') or contains(@href, 'genres/manhwa') or contains(@href, 'genres/manhua')]",
                    'attr' => 'href',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'mg_status')]",
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'wp-pagenavi')]//a[contains(@class, 'page larger')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'wp-pagenavi')]//a[contains(@class, 'page smaller')]",
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//*[contains(@class, 'site-content')]//*[contains(@class, 'type-wp-manga')]",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(text(), 'Alternative')]/../..", //same as parent::
                    'regex' => '/([\s\n\t]+)?((judul\s)?alternati[fv]e?(\stitles?)?)\:?[\s\n\t]+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'summary_image')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(text(), 'Status')]/../..", //same as parent::
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Type')]/../..//*[contains(@class, 'summary-content')]", //similar to 'alternative' & 'detail > status'
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genres-content')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'description-summary')]//*[contains(@class, 'summary__content')]",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'version-chap')]//*[contains(@class, 'wp-manga-chapter')]//a",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//*[contains(@class, 'c-blog-post')]",
                'title' => [
                    'xpath' => ".//*[contains(@class, 'breadcrumb')]//li",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nav-links')]//a[contains(@class, 'next_page')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nav-links')]//a[contains(@class, 'prev_page')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[contains(@class, 'reading-content')]//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }

    public static function shinigami()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'madara',
            'url' => [
                'host' => 'https://shinigami.id/',
                'latest' => 'https://shinigami.id/page/{$page}/?s&post_type=wp-manga&m_orderby=latest',
                'search' => 'https://shinigami.id/page/{$page}/?post_type=wp-manga&s={$value}',
                'advanced' => 'https://shinigami.id/page/{$page}/?post_type=wp-manga&{$value}',
                'series' => 'https://shinigami.id/series/{$slug}/',
                'chapter' => 'https://shinigami.id/series/{$slug}/chapter-{$chapter}/',
            ],
            'latest' => [ //parent is same as "LS" parent
                'chapter' => [
                    'xpath' => ".//*[contains(@class, 'tab-meta')]//*[contains(@class, 'chapter')]",
                ],
                'date' => [
                    'xpath' => ".//*[contains(@class, 'tab-meta')]//*[contains(@class, 'post-on')]",
                ],
            ],
            'LS' => [
                'parent' => "//*[contains(@class, 'c-tabs-item__content')]",
                'title' => [
                    'xpath' => ".//*[@class='post-title']//a",
                ],
                'cover' => [
                    'xpath' => ".//img",
                    'attr' => 'data-src',
                ],
                'type' => [
                    'xpath' => ".//a[contains(@href, 'genres/manga') or contains(@href, 'genres/manhwa') or contains(@href, 'genres/manhua')]",
                    'attr' => 'href',
                    'regex' => '/[\s\/](man(?:h[wu]|g)a)/i',
                ],
                'completed' => [
                    'xpath' => ".//*[contains(@class, 'mg_status')]",
                    'regex' => '/\s(completed?|tamat)/i',
                ],
                'link' => [
                    'xpath' => ".//a[contains(@href, '/series/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [ //no parent
                    'regex' => '/.*page[\/=](\d+)[\/&]?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'paging-navigation')]//*[contains(@class, 'nav-previous')]//a", //reverse order
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'paging-navigation')]//*[contains(@class, 'nav-next')]//a", //reverse order
                        'attr' => 'href',
                    ],
                ],
            ],
            'series' => [
                'parent' => "//*[contains(@class, 'site-content')]//*[contains(@class, 'type-wp-manga')]",
                'shortlink' => [
                    'xpath' => "//link[@rel='shortlink']",
                    'attr' => 'href',
                    'regex' => '/(?:\?p=|wp\.me\/)(.*)/i',
                ],
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'alternative' => [
                    'xpath' => ".//*[contains(text(), 'Alternative')]/../..", //same as parent::
                    'regex' => '/([\s\n\t]+)?((judul\s)?alternati[fv]e?(\stitles?)?)\:?[\s\n\t]+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'summary_image')]//img",
                    'attr' => 'data-src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(text(), 'Status')]/../..", //same as parent::
                        'regex' => '/([\s\n\t]+)?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Type')]/../..//*[contains(@class, 'summary-content')]", //similar to 'alternative' & 'detail > status'
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genres-content')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'description-summary')]//*[contains(@class, 'summary__content')]",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'ajax' => 'ajax/chapters/',
                    'parent' => "//*[@id='manga-chapters-holder']", //ajax
                    'xpath' => ".//*[contains(@class, 'version-chap')]//*[contains(@class, 'wp-manga-chapter')]//a",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//*[contains(@class, 'content-area')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\s\d+/i',
                    'regex2' => '/(\s-)?\sch(?:apter|\.)?/i',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nav-links')]//a[contains(@class, 'next_page')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nav-links')]//a[contains(@class, 'prev_page')]",
                    'regex' => '/(?:-ch(?:[ap][ap]ter?)?)?-(\d(?:[\w\-]+)?)$/i',
                    'regex2' => '/(-(bahasa-)?indo(nesiaa?)?\/?|\/$)/i',
                    'attr' => 'href',
                ],
                'images' => [
                    'xpath' => ".//*[contains(@class, 'reading-content')]//img",
                    'attr' => 'data-src',
                ],
            ],
        ];

        return $data;
    }
}
