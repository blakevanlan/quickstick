;(function ( $ ) {
    var methods = {
        quickStickHeader: {
            init: function (options) {
                options = $.extend({}, $.quickstick.header.defaultOptions, options);

                var base = $(this).data('quickstick.header');
                var that = this;

                if (!base) {
                    base = {}
                }
                else if (base.headerCloneCreated) {
                    base.headerClone.remove();
                }

                base.options = options;
                base.headerCloneCreated = false;
                base.isStuck = false;

                $(this).data('quickstick.header', base);

                methods.quickStickHeader.positionHeader.call(this);

                $(window)
                .scroll(function(e){
                    methods.quickStickHeader.positionHeader.call(that, e);
                })
                .resize(function(e){
                    methods.quickStickHeader.positionHeader.call(that, e)
                });
            },
            canPosition: function() {
                $this = $(this);

                if (!$this.data('quickstick.header').headerCloneCreated) {
                    if ($this.is(":visible")) {
                        methods.quickStickHeader.initClone.call(this);
                        return true;
                    }
                    else {
                        return false
                    }
                }
                return true;
            },
            initClone: function() {
                var $this = $(this);
                var base = $(this).data('quickstick.header');

                base.headerClone = $this.addClass('original').clone(true, true).hide().css({
                    "position": "fixed",
                    "z-index": base.options["z-index"],
                    "left": $this.offset().left,
                    "top": base.options.offsetTop,
                    "margin-top": 0,
                    "width": $this.width()
                }).addClass(base.options.headerClass);

                // Change headerClone Id if it has one
                var headerCloneId = $(base.headerClone).attr('id');
                if (typeof headerCloneId !== 'undefined' && headerCloneId !== false) {
                    base.headerClone.attr('id', headerCloneId + '-quickstick-clone');
                }

                base.originalHeight = $this.height();
                base.headerCloneCreated = true;
                $this.after(base.headerClone);
                $this.data('quickstick.header', base);
            },
            tryResizeHeader: function() {
                var $this = $(this);
                var base = $(this).data('quickstick.header');

                if (!base.options.allowOverflow) {
                    if (!base.isStuck) {
                        var nHeight = $(window).height() - $this.offset().top - $this.outerHeight(false) + $this.height() + $(window).scrollTop();
                        if (base.originalHeight > nHeight) {
                            $this.height(nHeight);
                            $this.addClass(base.options.scrollClass);
                        }
                        else {
                            $this.css('height', '');
                            $this.removeClass(base.options.scrollClass);
                        }
                    }
                    else {
                        var nHeight = $(window).height() - base.options.offsetTop - $this.outerHeight(false) + $this.height();
                        if (base.originalHeight > nHeight) {
                            base.headerClone.height(nHeight);
                            base.headerClone.addClass(base.options.scrollClass);
                        }
                        else {
                            base.headerClone.css('height', '');
                            base.headerClone.removeClass(base.options.scrollClass);
                        }
                    }
                }
            },
            positionHeader: function( eventObject ) {
                var e = eventObject || "code";
                var $this = $(this);
                var base = $(this).data('quickstick.header');

                if (!methods.quickStickHeader.canPosition.call(this)) {
                    return;
                }

                base.headerClone.css("width", $this.width());
                base.headerClone.css("left", $this.offset().left);


                if ($(window).scrollTop() > $this.offset().top - base.options.offsetTop) {
                    base.headerClone.show();

                    if (base.options.hideOriginal) {
                        $this.css("opacity", 0);
                    }

                    if (!base.isStuck) {
                        base.isStuck = true;
                        base.options.onStick(e);
                    }
                }
                else {
                    base.headerClone.hide();

                    if (base.options.hideOriginal) {
                        $this.css("opacity", 100);
                    }

                    if (base.isStuck) {
                        base.isStuck = false;
                        base.options.onUnstick(e);
                    }
                }

                $this.data('quickstick.header', base);
                methods.quickStickHeader.tryResizeHeader.call(this);
            },
            update: function () {
                methods.quickStickHeader.positionHeader.call(this);
            }
        },
        quickStickFooter: {
            init: function (options) {
                options = $.extend({}, $.quickstick.footer.defaultOptions, options);
                var that = this;

                $(window).scroll(function(e) {
                    methods.quickStickFooter.positionFooter.call(that);
                }).resize(function(e) {
                    methods.quickStickFooter.positionFooter.call(that);
                });

                $(this).data('quickstick.footer', { options: options });
                methods.quickStickFooter.positionFooter.call(this);
            },
            positionFooter: function () {
                var $this = $(this);

                if ($this.offset().top + $this.outerHeight() < $(window).height()) {
                    $this.css({ position: "fixed", bottom: 0 });
                }
                else {
                    $this.css({ position: "static" });
                }
            },
            update: function () {
                methods.quickStickFooter.positionFooter.call(this);
            }
        }
    };

    if (!$.quickstick) {
        $.quickstick = {
            header: {
                defaultOptions: {
                    "headerClass": "quick-stick",
                    "scrollClass": "scrolling",
                    "offsetTop": 0,
                    "hideOriginal": true,
                    "z-index": 1000,
                    "allowOverflow": true,
                    "onStick": $.noop,
                    "onUnstick": $.noop
                }
            },
            footer: {
                defaultOptions: {

                }
            }
        };
    };

    $.fn.quickStickFooter = function () {
        Array.prototype.unshift.call(arguments, "quickStickFooter");
        return pickMethod.apply(this, arguments);
    };
    $.fn.quickStickHeader = function () {
        Array.prototype.unshift.call(arguments, "quickStickHeader");
        return pickMethod.apply(this, arguments);
    };

    var pickMethod = function (name) {
        if (arguments.length == 1 || (arguments.length == 2 && typeof arguments[1] === "object")) {
            var args = Array.prototype.slice.call(arguments, 1);
            return $(this).each(function () {
                methods[name].init.apply(this, args);
            });
        }
        else {
            var method = arguments[1];
            var args = Array.prototype.slice.call(arguments, 2);
            return $(this).each(function () {
                if (methods[name][method] === void 0) {
                    $.error("Method " + method + " does not exist on jQuery." + name);
                }
                else methods[name][method].apply(this, args);
            });
        }
    };

})( jQuery );
