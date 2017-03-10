/* =========================================================
 * jquery-socialshare.js
 * Repo: https://github.com/pnmcosta/jquery-socialshare
 * Demo: https://pnmcosta.github.io/jquery-socialshare/
 * Docs: https://github.com/pnmcosta/jquery-socialshare
 * =========================================================
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 * 
 * Copyright (c) 2017 Pedro Costa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ========================================================= */

; (function ($, window, document) {

    "use strict";

    var pluginName = "jqss",
        $head = $(document.head);

    var defaults = {
        usePopup: true,
        popupWidth: 600,
        popupHeight: 450,
        ariaLabelPrefix: 'Share with',

        url: location.href,
        siteUrl: location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ''),
        source: $head.find('[name=site], [name=Site]').prop('content') || document.title,
        title: $head.find('[name=title], [name=Title]').prop('content') || document.title,
        description: $head.find("[name=description], [name=Description], [property='og:description'], [property='og:Description']").attr('content') || document.title,
        image: $head.find("[name=image], [name=Image], [property='og:image'], [property='og:Image']").prop("content") || $('img:first').prop('src') || '',
        price: $head.find("[property='og:product:price:amount']").prop("content") || '',
        template: null,

        imageSelector: null,
        priceSelector: null,

        emailSubject: 'I\'m sharing "{{TITLE}}" with you',
        emailBody: 'Because I think you\'ll find it very interesting.%0A%0A"{{DESCRIPTION}}"%0A%0AClick this link {{URL}} for more info.',

        twitterSource: ($head.find("[name='twitter:site'], [property='name:creator']").prop("content") || '').replace('@', ''),

        onOpen: function () { },
        onClose: function () { }
    };

    var emailTemplate = 'mailto:?subject={{SUBJECT}}&body={{BODY}}';

    var timerOptions = {
        internal: 200,
        counter: 100 // timeout in 20000ms
    };

    var getElementOptions = function (el, prefix) {
        var data = $(el).data(),
            out = {}, inkey,
            replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
        prefix = new RegExp('^' + prefix.toLowerCase());
        function reLower(_, a) {
            return a.toLowerCase();
        }
        for (var key in data) {
            if (!prefix.test(key)) {
                continue;
            }
            inkey = key.replace(replace, reLower);
            out[inkey] = data[key];
        }
        return out;
    };

    var setElementShare = function () {
        this.templateName = this.settings.template;

        // determine template from class if not yet set in settings
        if (!this.templateName) {
            var classList = this.element.className.split(/\s+/);

            for (var i = 0; i < classList.length; i++) {
                var className = classList[i].toLowerCase();
                if ('undefined' !== typeof templates[className]) {
                    this.templateName = className;
                    this.template = templates[className];
                    break;
                }
            }

            // throw error, template name not found
            if (!this.template) {
                console.error('[jqss] Could not find a template to use for element:');
                console.log(this.element);
                if (this._isAnchor) {
                    this.$element.prop('href', '#');
                }
                return;
            }
        } else if ('undefined' !== typeof templates[this.templateName]) {
            this.template = templates[this.templateName];
        }

        // throw error, template not found
        if (!this.template) {
            console.error('[jqss] Could not find template "' + this.templateName + '" for element:');
            console.log(this.element);
            if (this._isAnchor) {
                this.$element.prop('href', '#');
            }
            return;
        }

        // handle the special case for email template
        if ('email' === this.templateName) {
            this.template = emailTemplate.replace('{{SUBJECT}}', this.settings.emailSubject).replace('{{BODY}}', this.settings.emailBody);
        }

        // if a custom imageSelector is set, ensure it updates the image setting
        if (this.settings.imageSelector) {
            this.settings.image = $(this.settings.imageSelector).map(function () {
                return $(this).prop('src');
            }).get().join('||');
        }

        // if a custom priceSelector is set, ensure it updates the price setting
        // only supports a single item
        if (this.settings.priceSelector) {
            this.settings.price = $(this.settings.priceSelector).text();

            // TODO: hook an event to priceSelector changes, e.g. ajax change of price on page
            // perhaps http://stackoverflow.com/a/22736833/271433
        }

        this.href = this.template;
        // process template markup
        for (var _key in this.settings) {
            if ('undefined' !== typeof this.settings[_key]) {
                var _value = encodeURIComponent(this.settings[_key]);
                this.href = this.href.replace(new RegExp('{{' + _key.toUpperCase() + '}}', 'g'), _value);
            }
        }

        // set href and target to a elements
        if (this._isAnchor) {
            this.$element.prop('href', this.href);

            if ('email' !== this.templateName) {
                this.$element.prop('target', '_blank');
            }
        }

        if ('undefined' !== ariaLabels[this.templateName]) {
            this.$element.attr('aria-label', this.settings.ariaLabelPrefix + ' ' + ariaLabels[this.templateName]);
        }
        this.settings.template = this.templateName;
        this.enabled = true;
    };

    function jqssPlugin(element, options) {
        this.element = element;
        this.$element = $(this.element);

        // ensure this option is not set as a js option.
        options.template = null;

        // Options priority: js options, element data attrs, defaults
        var elopts = getElementOptions(this.$element, pluginName);
        this.settings = $.extend({}, defaults, elopts, options);
        this.enabled = false;
        this.template = null;
        this.templateName = null;
        this.href = null;

        this._isAnchor = this.$element.is('a');
        this._defaults = defaults;
        this._name = pluginName;
        this._shareWin = null;
        this._closeTimer = null;

        this.init();
    }

    $.extend(jqssPlugin.prototype, {
        init: function () {
            setElementShare.call(this);

            // handle click if enabled and not email template
            if (this.enabled && 'email' !== this.settings.template) {
                this.$element.bind("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // call the open method via the plugin's data.
                    $.data(this, 'plugin_' + pluginName).open(true);
                });
            }
        },
        open: function (callsback) {
            if (!this.enabled || 'email' === this.settings.template) {
                return this.$element;
            }
            callsback = 'undefined' !== callsback ? callsback : false;

            if (this.settings.usePopup) {

                var dualScreenLeft = 'undefined' !== window.screenLeft ? window.screenLeft : screen.left;
                var dualScreenTop = 'undefined' !== window.screenTop ? window.screenTop : screen.top;

                var left = (($(window).width() / 2) - (this.settings.popupWidth / 2)) + dualScreenLeft,
                    top = (($(window).height() / 2) - (this.settings.popupHeight / 2)) + dualScreenTop;

                this._shareWin = window.open(this.href, '', 'scrollbars=yes,toolbar=0,scrollbars=1,resizable=1,width=' + this.settings.popupWidth + ',height=' + this.settings.popupHeight + ',top=' + top + ',left=' + left);
                if (window.focus) {
                    this._shareWin.focus();
                }
            } else {
                this._shareWin = window.open(this.href, '_blank');
            }

            if (callsback) {

                this.settings.onOpen.apply(undefined, this, this.$element);

                if (this._shareWin) {
                    var _this = this;
                    var _counter = timerOptions.counter;
                    this._closeTimer = window.setInterval(function () {
                        if (_this._shareWin.closed !== false) {
                            window.clearInterval(_this._closeTimer);
                            if (callsback) {
                                _this.settings.onClose.apply(undefined, _this, _this.$element);
                            }
                        } else if (0 === _counter) {
                            console.log('timeout');
                            // timeout!
                            window.clearInterval(_this._closeTimer);
                        }
                        _counter--;
                    }, timerOptions.internal);
                }
            }

            return this.$element;
        },
        close: function (callsback) {
            if ((!this.enabled || (this._shareWin || this._shareWin.closed === false)) || 'email' === this.settings.template) {
                return this.$element;
            }

            callsback = 'undefined' !== callsback ? callsback : false;

            this._shareWin.close();

            if (callsback) {
                this.settings.onClose.apply(undefined, this, this.$element);
            }

            return this.$element;
        }
    });


    $.fn[pluginName] = function (options) {
        // transform arguments to array in case we're calling the plugin's public function's
        var args = Array.apply(null, arguments);
        args.shift();
        var _return;

        var _items = this.each(function () {
            var _plugin = $.data(this, "plugin_" + pluginName);
            if ('undefined' === typeof _plugin) {
                _plugin = new jqssPlugin(this, options);
                $.data(this, "plugin_" + pluginName, _plugin);
            }

            if ('string' === typeof options && 'function' === typeof _plugin[options]) {
                _return = _plugin[options].apply(_plugin, args);
            }
        });

        if (
            'undefined' === typeof _return ||
            _return instanceof jqssPlugin
        ) {
            return _items;
        } else {
            return _return;
        }
    };

    var templates = $.fn[pluginName].templates = {
        amazon: 'http://www.amazon.com/gp/wishlist/static-add?u={{URL}}&t={{TITLE}}&p={{PRICE}}',
        blogger: 'https://www.blogger.com/blog_this.pyra?t&u={{URL}}&n={{TITLE}}',
        buffer: 'https://buffer.com/add?url={{URL}}&title={{TITLE}}',
        delicious: 'https://delicious.com/post?url={{URL}}&title={{TITLE}}&notes={{DESCRIPTION}}',
        digg: 'https://digg.com/submit?url={{URL}}&title={{TITLE}}',
        evernote: 'http://www.evernote.com/clip.action?url={{URL}}&title={{TITLE}}',
        pinterest: 'http://pinterest.com/pin/create/button/?url={{URL}}&media={{IMAGE}}&description={{DESCRIPTION}}',
        pocket: 'https://getpocket.com/save?url={{URL}}&title={{TITLE}}',
        quora: 'http://www.quora.com/board/bookmarklet?v=1&url={{URL}}',
        reddit: 'http://www.reddit.com/submit?url={{URL}}&title={{TITLE}}',
        stumbleupon: 'http://www.stumbleupon.com/submit?url={{URL}}&title={{TITLE}}',
        tumblr: 'http://tumblr.com/widgets/share/tool?canonicalUrl={{URL}}',
        email: '#',
        linkedin: 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{DESCRIPTION}}&source={{SOURCE}}&armin=armin',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u={{URL}}',
        twitter: 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{TWITTERSOURCE}}',
        googleplus: 'https://plus.google.com/share?url={{URL}}'
    };

    var ariaLabels = $.fn[pluginName].ariaLabels = {
        amazon: 'Amazon Wish List',
        blogger: 'Blogger',
        buffer: 'Buffer',
        delicious: 'Delicious',
        digg: 'Digg',
        evernote: 'Evernote',
        pinterest: 'Pinterest',
        pocket: 'Pocket',
        quora: 'Quora',
        reddit: 'reddit',
        stumbleupon: 'StumbleUpon',
        tumblr: 'Tumblr',
        email: 'Email',
        linkedin: 'LinkedIn',
        facebook: 'Facebook',
        twitter: 'Twitter',
        googleplus: 'Google Plus'
    };
})(jQuery, window, document);
