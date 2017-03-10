# jquery-socialshare

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://raw.githubusercontent.com/pnmcosta/jquery-socialshare/master/LICENSE)

jquery-socialshare is simple and flexible social share jQuery plugin for any HTML anchor or buttons.

Versions are incremented according to [semver](http://semver.org/).

View the [Online Demo](https://pnmcosta.github.io/jquery-socialshare/), it uses the [Zocial CSS social buttons](http://zocial.smcllns.com/) for a better presentation.

## Requirements
- [jQuery](https://jquery.com/) 1.9.1+

## Why?
Because I always found it tricky to find the right social sharing plugin for the sites I develop at my daily job, either they relied on their own style, were uncustomizable, heavy and seemed to track everything!

I also wanted to flexible and use any icon provider and CSS to be able customize the social sharing experience, open on a popup, and track when that popup was closed.

## Installation
You can install this package either from a `release` or `bower`.

### Release
Download a compressed `*-dist` file from the [Releases Tab](https://github.com/pnmcosta/jquery-socialshare/releases)

### Bower
```shell
bower install jquery-socialshare --save
```

## Usage
The plugin is packaged with templates for the following social networks:

`amazon`, `blogger`, `buffer`, `delicious`, `digg`, `evernote`, `pinterest`, `pocket`, `quora`, `reddit`, `tumbleupon`, `tumblr`, `email`, `linkedin`, `facebook`, `twitter`, `googleplus`

You can add additional `templates` before initializing the plugin, futher details on this can be found below.

Include a `<script>` on your `html` file:

```html
<script src="/bower_components/jquery-socialshare/jquery-socialshare.js"></script>
```

Configure your links/buttons with a class for the corresponding template:
```html
<div class="social-container">
    <a href="javascript:;" class="facebook">Share on Facebook</a>
    <button class="twitter">Share on Twitter</button>
</div>
```

Call the `jqss` plugin via javascript:

```javascript
$(function () {
    $(".social-container a, .social-container button").jqss();
});
```

## Options

Most options can be provided via `data-attributes` on each element. An option can be converted to a `data-attribute` by taking its name, replacing each uppercase letter with its lowercase equivalent preceded by a dash, and prepending `data-jqss-` to the result. For example, `usePopup` would be `data-jqss-use-popup`, `template` would be `data-jqss-template`, and `ariaLabelPrefix` would be `data-jqss-aria-label-prefix`.

Options set via `data-attributes` override any options set via `javascript` when initializing the plugin. Most options are considered `global` and would probably be set via `javascript`. The most common option to set with `data-attribute` on each element would be `template` in case you don't specify it via a `class`. 

### usePopup
Boolean. Default: true

Whether or not a popup is used or a new tab is opened.

### popupWidth
Number. Default: 600

The popup's width.

## Events

## Methods

## Templates

