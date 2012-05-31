;(function ( $ ) {
    if (!$.quickstick) {
        $.quickstick = {};
    };

    $.quickstick.header = function ( el, methodToCall, options ) {
        var base = this;
        base.$el = $(el);
        base.el = el;
 
        base.init = function () {
            base.options = $.extend({}, $.quickstick.header.defaultOptions, options);
            base.headerCloneCreated = false;
            base.isStuck = false;

            base.positionHeader();

            $(window)
            .scroll(function(e){
                base.positionHeader(e);
            })
            .resize(function(e){
                base.positionHeader(e)
            });
        };
        
        base.canPosition = function() {
            if (!base.headerCloneCreated) {
                if (base.$el.is(":visible")) {
                    base.initClone();
                    return true;
                }
                else {
                    return false
                }
            }
            return true;
        }

        base.initClone = function() {
            base.headerClone = base.$el.clone(true, true).hide().css({
                "position": "fixed",
                "z-index": base.options["z-index"],
                "left": base.$el.offset().left,
                "top": base.options.offsetTop,
                "margin-top": 0,
                "width": base.$el.width()
            }).addClass(base.options.headerClass);

            // Change headerClone Id if it has one
            var headerCloneId = $(base.headerClone).attr('id');
            if (typeof headerCloneId !== 'undefined' && headerCloneId !== false) {

                base.headerClone.attr('id', headerCloneId + '-clone');
            }

            base.$el.after(base.headerClone);
            base.headerCloneCreated = true;
        }

        base.positionHeader = function( eventObject ) {
            var e = eventObject || null;

            if (!base.canPosition()) {
                return;
            }

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

        if (methodToCall != null && methodToCall.toLowerCase() === "update") {
            if (base.headerClone && base.headerCloneCreated) {
                base.headerClone.remove();
            }
            base.init();
        }
        else {
            base.$el.data( "quickstick.header" , base );
            base.init();
        }
    };
 
    $.quickstick.header.defaultOptions = {
        "headerClass": "quick-stick",
        "offsetTop": 0,
        "hideOriginal": true,
        "z-index": 1000,
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
            base.$el.data( "quickstick.footer" , base );
            base.init();
        }
    };
 
    $.quickstick.footer.defaultOptions = {
        // Default options for footer, left in to make it easy to add options in the future
    };

    $.fn.quickStickHeader = function ( method, options ) {
        if (typeof method === "string") {
            return this.each(function () {
            (new $.quickstick.header(this, method, options));
            });
        }
        else if (typeof method === "object") {
            return this.each(function () {
            (new $.quickstick.header(this, "init", method));
            });
        }
        else {
            return this.each(function () {
            (new $.quickstick.header(this, "init", null));
            });
        }
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
