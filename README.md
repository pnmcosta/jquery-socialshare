# jquery-socialshare

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://raw.githubusercontent.com/pnmcosta/jquery-socialshare/master/LICENSE)

A minimalist social sharing jQuery plugin, use any styles, themes, buttons or links. Includes templates and callbacks for popup `open` and `close` events.

View the [Online Demo](https://pnmcosta.github.io/jquery-socialshare/), it uses the [Zocial CSS social buttons](http://zocial.smcllns.com/) and [Bootstrap](http://getbootstrap.com) presentation purposes.

Versions are incremented according to [semver](http://semver.org/).

## Requirements
- [jQuery](https://jquery.com/) 1.9.1+

## Why?
Because I always found it tricky to find the right social sharing plugin for the bespoke websites I develop at my daily job @[PMC-Digital](http://www.pmcdigital.pt/). The existing plugins either relied on their own themes, styling, were hard to customize or heavy!

I also wanted to get started with [Grunt](https://gruntjs.com/), [Bower](https://bower.io/) and the possibilities possibilities of developing with these tools.

## Installation

You can install this package either from a `release` or `bower`.

### Release
Download a compressed `*-dist.zip` file from the [Releases Tab](https://github.com/pnmcosta/jquery-socialshare/releases)

### Bower
```shell
bower install jquery-socialshare --save
```

## Usage

Include a `<script>` on your `html` file:

```html
<script src="/your/path/to/jquery-socialshare.min.js"></script>
```

Configure your links/buttons with a class for the corresponding template:
```html
<div class="social-container">
    <a href="#" class="facebook" aria-label="Share this page with Facebook" role="button">Share on Facebook</a>
    <button class="twitter" aria-label="Share this page with Twitter">Share on Twitter</button>
</div>
```

Call the `jqss` plugin via javascript:

```javascript
$(function () {
    $(".social-container a, .social-container button").jqss();
});
```

## Templates

The plugin is packaged with templates for the following social networks: `amazon`, `blogger`, `buffer`, `delicious`, `digg`, `evernote`, `pinterest`, `pocket`, `quora`, `reddit`, `tumbleupon`, `tumblr`, `email`, `linkedin`, `facebook`, `twitter` and `googleplus`

You can add additional `templates` before initializing the plugin:

```javascript
$(function () {
    $.fn.jqss.templates['custom'] = 'https://custom.com?u={{URL}}&t={{TITLE}}';

    $(".social-container a, .social-container button").jqss();
});
```

It supports options with the all uppercase option name in the `{{OPTIONNAME}}` markup, the example above is using `{{URL}}` and `{{TITLE}}`.

## Options

Most options can be provided via `data-attributes` on each element. An option can be converted to a `data-attribute` by taking its name, replacing each uppercase letter with its lowercase equivalent preceded by a dash, and prepending `data-jqss-` to the result. For example, `usePopup` would be `data-jqss-use-popup`, `template` would be `data-jqss-template`, and `ariaLabelPrefix` would be `data-jqss-aria-label-prefix`.

Options set via `data-attributes` override any options set via `javascript` when initializing the plugin. Most options are global and would probably be set via `javascript`. The most common option to set with `data-attribute` on each element would be `template` in case you don't already specify it via a `class` that matches a template name.

### usePopup
Boolean. Default: `true`

Whether or not a popup is used or a new window is opened instead.

### popupWidth
Number. Default: `600`

The popup's width.

### popupHeight
Number. Default: `450`

The popup's height.

### ariaLabelPrefix
String. Default: `Share with`

The prefix applied to the element when usign the `aria-label` defined for the template.

### url
String. Default: `location.href`

The url being shared that can be used as `{{URL}}` in a `template`.

### siteUrl
String. Default: `location.origin`

The site url that can be used as `{{SITEURL}}` in a `template`.

### source
String. Default: First value from meta tag(s) `[name=site], [name=Site]` from the document's `head`, if none is found the `document.title`.

The source that can be used as `{{SOURCE}}` in a `template`.

### title
String. Default: First value from meta tag(s) `[name=title], [name=Title]` from the document's `head`, if none is found the `document.title`.

The title that can be used as `{{TITLE}}` in a `template`.

### description
String. Default: First value from meta tag(s) `[name=description], [name=Description], meta[property='og:description'], meta[property='og:Description']` from the document's `head`, if none is found the `document.title`.

The description that can be used as `{{DESCRIPTION}}` in a `template`.

### image
String. Default: First value from meta tag(s) `meta[name=image], meta[name=Image], meta[property='og:image'], meta[property='og:Image']` from the document's `head`, if none is found the document's `img:first`.

The image url that can be used as `{{IMAGE}}` in a `template`.

### price
String. Default: First value from meta tag(s) `meta[property='og:product:price:amount']` from the document's `head`.

The price that can be used as `{{PRICE}}` in a `template`.

### template
String. Default: `null`.

The template name to be used. This option is ignored if set via the plugin's initialization, however you can define it as `data-attribute` on each element if not making use of the `class` to determine the template to use. The `email` template type will not use a popup and the `onOpen` and `onClose` callbacks won't be called.

### imageSelector
String. Default: `null`.

A custom jQuery selector to be used instead of the default `image` option. Supports more than one image concatenating them with `||`.

### priceSelector
String. Default: `null`.

A custom jQuery selector to be used instead of the default `price` option. Only supports one element's `text` value.

### emailSubject
String. Default: `I\'m sharing "{{TITLE}}" with you`.

The subject to be used with the `email` mailto template. It supports all the options with the `{{****}}` markup.

### emailBody
String. Default: `Because I think you\'ll find it very interesting.%0A%0A"{{DESCRIPTION}}"%0A%0AClick this link {{URL}} for more info.`.

The body to be used with the `email` mailto template. It supports all the options with the `{{****}}` markup.

### twitterSource
String. Default: First value from meta tag(s) `[name='twitter:creator'], [name='twitter:site']` from the document's `head`.

The source to be used with the `twitter` template.

### onOpen
Function. Default: `empty`

Callback method that is triggered when the popup or window opens, except for the `email` template. Sends the plugin's instance and element.

```javacript
function( instance, element )
```

### onClose
Function. Default: `empty`

Callback method that is triggered when the popup or window closes, except for the `email` template. Sends the plugin's instance and element.

```javacript
function( instance, element )
```

## Methods

Methods are accessed via the plugin's name `jqss` e.g. ```$('.social-container a.facebook').jqss('open')```

### open(callsback)
Boolean `callsback`. Default: `false`

Method to `open` the element share template. The argument `callsback` determines whether the `onOpen` and `onClose` callback's should be called.

```javacript
$('.social-container a.facebook').jqss('open');
```

### close(callsback)
Boolean `callsback`. Default: `false`

Method to `close` the element share template if it is already open. The argument `callsback` determines whether the `onClose` callback should be called.

```javacript
$('.social-container a.facebook').jqss('close');
```
