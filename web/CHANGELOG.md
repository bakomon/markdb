# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0] - 2023-03-25

### Fixed

- switch page before `bmf_chapter_nav` is called (chapter page)
- summary accordion on mobile
- if image error and `bmv_rgx_cdn` is match (lazyLoad)
- `.disqus-trigger` clicked more than once on chapter page
- shortlink not found on series page (api)
- detect settings value changed
- ch. visited & cover on chapter page
- other minor bug fixes and improvements.

### Added

- cache mechanism
- new source `maid.my.id` (koidezign)
- new source `neumanga.net` (koidezign)
- new source `mgkomik.com` (madara)
- new source `shinigami.id` (madara)
- user id (uid) on profile page
- `.f_grow.f_clamp` css (force line-clamp)
- last read on bookmark page
- load images with `lazyLoadQueue`
- `url` and `source` on `hs_visited` (history)
- `m-delete-all` button on bookmark and history page
- alternative titles on series page
- move auto load next image to `lazyLoad` (chapter)
- firebase [app check](https://firebase.google.com/docs/app-check)
- css `aspect-ratio` property on `.post-list .cover img`
- keys and new icon on `manifest.json`
- `l10n` on member page
- auto select menu based on url
- new cdn, `imagecdn.app` and `imageoptim.com`
- `system` mode on `theme-switch`
- `completed` status on latest, search, and member page
- `default` search on advanced search
- `hiatus` status on advanced search
- show `#back-to` on chapter page
- `goto` input on bookmark and history page
- daily backup firebase data to server
- captcha to contact form
- `reset all settings` button on settings page
- notification area
- ecmascript 2015 (es6) cross-browser detection
- load next image afer 5 seconds on lazyload

### Changed

- `position` to `display` on `.t_perfect` (mobile)
- `bacamanga.org` to `mangatale.co`
- `tukangkomik.com` to `tukangkomik.id`
- `event handlers` to `event listeners`
- komiklab selector api
- `keyCode` to `keyEvent`
- svg icon to [`icon sets`](https://github.com/iconify/icon-sets) by Iconify
- update `l10n` text

### Removed

- cache data from `sessionStorage`

## [1.1] - 2023-04-08

### Added

- lazyload: disable skip image if current page is chapter
- lazyload: get image dimensions before image has fully loaded
- connection-notif: show/hide click on chapter page

## [1.2] - 2023-04-16

### Fixed
- minor bug fixes and improvements.

### Added

- lazyload: load `single` image directly
