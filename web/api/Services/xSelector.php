<?php

namespace Api\Services;

class xSelector
{
    public static $source_default = 'bacakomik';

    public static $source_lists = ['bacakomik', 'manhwaindo', 'tukangkomik', 'bacamanga', 'komiklab'];

    public static function bacakomik()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'eastheme',
            'url' => [
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
                    'regex' => '/\s(man(?:h[wu]|g)a)/i',
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
                        'regex' => '/[\s\n\t]+?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Jenis')]/parent::*//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genre-info')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapter_list']//*[contains(@class, 'lchx')]//a",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article//*[contains(@class, 'chapter-content')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\sch(?:apter|\.)?.*/i',
                ],
                'cover' => [ //no parent
                    'xpath' => "//*[@id='content']//*[contains(@class, 'infoanime')]//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
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
                    'regex' => '/\s(man(?:h[wu]|g)a)/i',
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
                        'regex' => '/[\s\n\t]+?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(text(), 'Jenis')]/parent::*//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'genre-info')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapter_list']//*[contains(@class, 'lchx')]//a",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article//*[contains(@class, 'chapter-content')]",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\sch(?:apter|\.)?.*/i',
                ],
                'cover' => [ //no parent
                    'xpath' => "//*[@id='content']//*[contains(@class, 'infoanime')]//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
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
                'latest' => 'https://tukangkomik.com/manga/?page={$page}&order=update',
                'search' => 'https://tukangkomik.com/page/{$page}/?s={$value}',
                'advanced' => 'https://tukangkomik.com/manga/page/{$page}/{$value}',
                'series' => 'https://tukangkomik.com/manga/{$slug}/',
                'chapter' => 'https://tukangkomik.com/{$slug}-chapter-{$chapter}/',
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
                    'regex' => '/\s(man(?:h[wu]|g)a)/i',
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
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Status')]",
                        'regex' => '/[\s\n\t]+?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Type')]//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'mgen')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\sch(?:apter|\.)?.*/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    ],
                ],
                'images' => [], //images from ts_reader
            ],
        ];

        return $data;
    }

    public static function bacamanga()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'themesia',
            'url' => [
                'latest' => 'https://mangatale.co/manga/?page={$page}&order=update',
                'search' => 'https://mangatale.co/page/{$page}/?s={$value}',
                'advanced' => 'https://mangatale.co/manga/page/{$page}/{$value}',
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
                    'regex' => '/\s(man(?:h[wu]|g)a)/i',
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
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Status')]",
                        'regex' => '/[\s\n\t]+?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'tsinfo')]//*[contains(text(), 'Type')]//a",
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'mgen')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\sch(?:apter|\.)?.*/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
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
                'latest' => 'https://komiklab.com/manga/?page={$page}&order=update',
                'search' => 'https://komiklab.com/page/{$page}/?s={$value}',
                'advanced' => 'https://komiklab.com/manga/page/{$page}/{$value}',
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
                    'regex' => '/\s(man(?:h[wu]|g)a)/i',
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
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/([kc]omi[kc]s?|man(ga|hwa|hua)|series?)\s/i',
                    'regex2' => '/(\sbahasa)?\sindo(nesia)?/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'data-src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(@class, 'infotable')]//*[contains(text(), 'Status')]/parent::*",
                        'regex' => '/[\s\n\t]+?status\:?[\s\n\t]+/i',
                    ],
                    'type' => [
                        'xpath' => ".//*[contains(@class, 'infotable')]//*[contains(text(), 'Type')]/parent::*",
                        'regex' => '/[\s\n\t]+?type\:?[\s\n\t]+/i',
                    ],
                    'genre' => [
                        'xpath' => ".//*[contains(@class, 'seriestugenre')]//a",
                    ],
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//*[contains(@class, 'eph-num')]//a",
                    'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series)\s)?(.*)\sch(?:apter|\.)?.*/i',
                ],
                'nav' => [ //no parent
                    'xpath' => "//script[contains(text(), 'ts_reader.run')]",
                    'next' => [
                        'name' => 'nextUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    ],
                    'prev' => [
                        'name' => 'prevUrl',
                        'regex' => '/.*chapter-(.*)(?:-bahasa-indonesia\/?|\/)/i',
                    ],
                ],
                'images' => [], //images from ts_reader
            ],
        ];

        return $data;
    }
}
