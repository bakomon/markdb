<?php

namespace Api\Services;

class xSelector
{
    public static $source_default = 'bacakomik';

    public static $source_lists = ['bacakomik', 'komikindo', 'komikav'];

    public static function bacakomik()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => '',
            'url' => [
                'latest' => 'https://bacakomik.co/komik-terbaru/page/{$page}/',
                'search' => 'https://bacakomik.co/page/{$page}?s={$value}',
                'advanced' => 'https://bacakomik.co/daftar-manga/page/{$page}/{$value}',
                'series' => 'https://bacakomik.co/komik/{$slug}/',
                'chapter' => 'https://bacakomik.co/chapter/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
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
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'nav' => [
                    'regex' => '/.*page\/(\d+)\/?/i',
                    'next' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                        'attr' => 'href',
                    ],
                    'prev' => [
                        'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                        'attr' => 'href',
                    ]
                ],
            ],
            'series' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\s+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'attr' => 'src',
                ],
                'detail' => [
                    'status' => [
                        'xpath' => ".//*[contains(text(), 'Status')]/parent::*",
                        'regex' => '/status\:\s/i',
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
                    'regex' => '/(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\s(.*)\sch(?:apter|\.)?.*/i',
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

    public static function komikindo()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => '',
            'url' => [
                'latest' => 'https://komikindo.id/komik-terbaru/page/{$page}/',
                'search' => 'https://komikindo.id/page/{$page}?s={$query}',
                'series' => 'https://komikindo.id/komik/{$slug}/',
                'chapter' => 'https://komikindo.id/{$slug}-chapter-{$chapter}/',
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
                'link' => [
                    'xpath' => ".//a[contains(@href, '/komik/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'next' => [
                    'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'next page-numbers')]",
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => "//*[contains(@class, 'pagination')]//a[contains(@class, 'prev page-numbers')]",
                    'attr' => 'href',
                ],
            ],
            'series' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\s+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'regex' => '/\?(.*)/',
                    'attr' => 'src',
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
                'next' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='next']",
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => ".//*[contains(@class, 'nextprev')]//a[@rel='prev']",
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

    public static function komikav()
    {
        $data = [
            'cms' => 'wordpress',
            'theme' => 'themesia',
            'url' => [
                'latest' => 'https://komikav.com/manga/?page={$page}&order=update',
                'search' => 'https://komikav.com/page/{$page}?s={$query}',
                'series' => 'https://komikav.com/manga/{$slug}/',
                'chapter' => 'https://komikav.com/chapter/{$slug}-chapter-{$chapter}-bahasa-indonesia/',
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
                'link' => [
                    'xpath' => ".//a[contains(@href, '/manga/')]",
                    'attr' => 'href',
                ],
                'slug' => [
                    'regex' => '/.*(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\/([^\/]+)/i',
                    'attr' => 'href',
                ],
                'next' => [
                    'xpath' => "//*[contains(@class, 'hpage')]//a[@class='r']",
                    'attr' => 'href',
                ],
                'prev' => [
                    'xpath' => "//*[contains(@class, 'hpage')]//a[@class='l']",
                    'attr' => 'href',
                ],
            ],
            'series' => [
                'parent' => "//article",
                'title' => [
                    'xpath' => ".//h1",
                    'regex' => '/(?:[kc]omi[kc]s?|man(?:ga|hwa|hua)|series?)\s+/i',
                ],
                'cover' => [
                    'xpath' => ".//*[contains(@class, 'thumb')]//img",
                    'regex' => '/\?(.*)/',
                    'attr' => 'src',
                ],
                'desc' => [
                    'xpath' => ".//*[contains(@class, 'entry-content')]//p",
                    'regex' => '/\s+|&(#160|nbsp);/',
                ],
                'chapter' => [
                    'xpath' => ".//*[@id='chapterlist']//a",
                    'regex' => '/.*chapter-(.*)-bahasa/i',
                    'attr' => 'href',
                ],
            ],
            'chapter' => [
                'parent' => "//script[contains(text(), 'ts_reader.run')]",
                'next' => 'nextUrl',
                'prev' => 'prevUrl',
                'images' => [
                    'xpath' => ".//*[@id='chimg-auh']//img",
                    'attr' => 'src',
                ],
            ],
        ];

        return $data;
    }
}
