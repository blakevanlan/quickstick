;(function ( $ ) {
    if (!$.quickstick) {
        $.quickstick = {};
    };

    $.quickstick.header = function ( el, options ) {
        var base = this;
        base.$el = $(el);
        base.el = el;
 
        base.$el.data( "quickstick.header" , base );
 
        base.init = function () {
            base.options = $.extend({}, $.quickstick.header.defaultOptions, options);
            base.headerClone = base.$el.clone(true, true).hide().css({
                "position": "fixed",
                "z-index": 10000,
                "left": base.$el.offset().left,
                "top": base.options.offsetTop,
                "margin-top": 0,
                "width": base.$el.width()
            }).addClass(base.options.headerClass).appendTo("body");

            base.isStuck = false;

            $(window)
            .scroll(function(e){
                base.positionHeader(e);
            })
            .resize(function(e){
                base.positionHeader(e)
            });
        };
        
        base.positionHeader = function( eventObject ) {
            var e = eventObject || null;

            base.headerClone.css("width", base.$el.width());

            if ($(window).scrollTop() > base.$el.offset().top - base.options.offsetTop) {
                base.headerClone.show();

                if (base.options.hideOriginal) {
                    base.$el.css("opacity", 0);
                }

                if (!base.isStuck) {
                    base.isStuck = true;
                    base.options.onStick(e);
                }
            }
            else {
                base.headerClone.hide();

                if (base.options.hideOriginal) {
                    base.$el.css("opacity", 100);
                }

                if (base.isStuck) {
                    base.isStuck = false;
                    base.options.onUnstick(e);
                }
            }
        }

        base.init();
    };
 
    $.quickstick.header.defaultOptions = {
        "headerClass": "quick-stick",
        "offsetTop": 0,
        "hideOriginal": false,
        "onStick": $.noop,
        "onUnstick": $.noop
    };

    $.quickstick.footer = function ( el, methodToCall, options ) {
        var base = this;
        base.$el = $(el);
        base.el = el;
 
        base.init = function () {
            base.options = $.extend({}, $.quickstick.footer.defaultOptions, options);

            $(window)
            .scroll(function(e){
                base.positionFooter(e);
            })
            .resize(function(e){
                base.positionFooter(e)
            });

            base.positionFooter();
        };
        
        base.positionFooter = function( eventObject ) {
            var e = eventObject || null;
            var combinedHeight = 0;

            base.$el.prevAll().each(function(i){
                combinedHeight += $(this).height();
            })

            if (combinedHeight + base.$el.height() < $(window).height()) {
                base.$el.css({ position: "absolute", top: ($(window).scrollTop() + $(window).height() - base.$el.height())})
            }
            else {
                base.$el.css({ position: "static" });
            }
        }

        if (methodToCall != null && methodToCall.toLowerCase() === "update") {
            base.positionFooter();
        }
        else {
            base.init();
            base.$el.data( "quickstick.footer" , base );
        }
    };
 
    $.quickstick.footer.defaultOptions = {
        // Default options for footer
    };

    $.fn.quickStickHeader = function ( options ) {
        return this.each(function () {
            (new $.quickstick.header(this, options));
        });
    };
    $.fn.quickStickFooter = function ( method, options ) {
        if (typeof method === "string") {
            return this.each(function () {
                (new $.quickstick.footer(this, method, options));
            });
        }
        else if (typeof method === "object") {
            return this.each(function () {
                (new $.quickstick.footer(this, "init", method));
            });
        }      
        else {
            return this.each(function () {
                (new $.quickstick.footer(this, "init", null));
            });
        }  
    };

})( jQuery );
