/**
 * Global configuration file , which includes environment configurations, global functions
 *    @dependency jquery.js
 **/

var twitter = window.twitter || {};

twitter.cfg = twitter.cfg || {};
twitter.events = twitter.events || {};

(function ($, twitter, window, document, undefined){

    (function(){
        var ua = navigator.userAgent;
            twitter.cfg.isIphone = /iPhone/i.test(ua); 
            twitter.cfg.isIpaid = /iPad/i.test(ua);
            twitter.cfg.isAndriod = /Android/i.test(ua);
            twitter.cfg.isBlackBerry = /BB10|BlackBerry/i.test(ua);
            twitter.cfg.isNexusTab = /Nexus/i.test(ua);          
            twitter.cfg.isChrome43 = /Chrome[/]43/i.test(ua);             
            twitter.cfg.isIE = /MSIE (\d+\.\d+);/.test(ua);
            twitter.cfg.isIE11 = ua.indexOf('Trident/');
            twitter.cfg.isMobile = /iPhone|Android|iPad|iPod|webOS|BlackBerry/i.test(ua);
            twitter.cfg.isTouchEnabled = (function is_touch_device() {
                             return (('ontouchstart' in window)
                                  || (navigator.MaxTouchPoints > 0)
                                  || (navigator.msMaxTouchPoints > 0));
                            })();

        twitter.cfg.breakPoints ={
            XS    :"screen and (min-width:0px) and (max-width:480px)",
            SMX   :"screen and (min-width:481px) and (max-width:767px)",
            SM    :"screen and (min-width:768px) and (max-width:1024px)",
            MD    :"screen and (min-width:1025px) and (max-width:1280px)",
            LG    :"screen and (min-width:1281px)",
            XS_SMX:"screen and (min-width:0px) and (max-width:767px)",
            XS_SM :"screen and (min-width:0px) and (max-width:1024px)",
            SM_MD :"screen and (min-width:768px)",
            MD_LG :"screen and (min-width:1025px)"
        }

        twitter.events = {
            WINDOW_RESIZE : "ml/screen/resize/",
            WINDOW_LOAD : "ml/window/load/",
            SCROLL : "ml/mouse/scroll",
            VIEWPORT_CHANGE : "ml/viewport/change", //for responsive implementation
            INIT_MODULES : "ml/modules/init",
            VIEWPORT_XS:"viewport/extrasmall",
            VIEWPORT_SMX:"viewport/smallExtended",
            VIEWPORT_SM:"viewport/small",
            VIEWPORT_MD:"viewport/medium",
            VIEWPORT_LG:"viewport/large",
            VIEWPORT_XS_SMX:"viewport/mobile",
            VIEWPORT_XS_SM:"viewport/mobileAndTablet",
            VIEWPORT_SM_MD:"viewport/tabletAndAbove",
            VIEWPORT_MD_LG:"viewport/desktopAndAbove"           
        }
        twitter.cfg.viewport = twitter.events.VIEWPORT_LG;

    })();

    $(function(){

        if(twitter.cfg.isAndriod){
            $('html').addClass('android');
        }

        if(twitter.cfg.isIpaid){
            $('html').addClass('iPad');
        }

        if(twitter.cfg.isIphone){
            $('html').addClass('iphone');
        }

        if(twitter.cfg.isIE11 > 0){
            $('html').addClass('ie11');
        }     

        if(twitter.cfg.isBlackBerry){
          $('html').addClass('blackberry');
        }
         
        if(twitter.cfg.isNexusTab){
          $('html').addClass('nexusTab');
        }

        if(twitter.cfg.isChrome43){
          $('html').addClass('chrome43');
        }

        // avoid subscribing to WINDOW_RESIZE event where ever possible
        $(window).resize( $.throttle( 250, function(){
            $.publish(twitter.events.WINDOW_RESIZE);
        }));

        if( twitter.cfg.isIE ){
            $(window).scroll( $.throttle( 500, function(){
                $.publish(twitter.events.SCROLL);
            }));
        } else{
            $(window).scroll( $.throttle( 20, function(){
                $.publish(twitter.events.SCROLL);
            }));
        }
            // for first time before module initialization
            for ( var breakPoint in  twitter.cfg.breakPoints){
                ;(function(breakName, mediaQuery){
                    var handler = function(data){
                        if(data.matches){
                            if(/\bSM\b|\bMD\b|\bLG\b|\bSMX\b|\bXS\b/.test(breakName)) {
                                twitter.cfg.viewport = breakName;
                            }
                        }
                    }
                    handler({
                        media: mediaQuery,
                        matches: matchMedia(mediaQuery).matches
                    });
                })(breakPoint, twitter.cfg.breakPoints[breakPoint]);
            };

            $.publish(twitter.events.INIT_MODULES);

        // publish events on viewport change based on media queries.
        for ( var breakPoint in  twitter.cfg.breakPoints){
            ;(function(breakName, mediaQuery){
                var handler = function(data){
                    if(data.matches){
                        var vpAlias = "VIEWPORT_"+breakName;
                        $.publish(twitter.events[vpAlias], true);

                        if(/\bSM\b|\bMD\b|\bLG\b|\bSMX\b|\bXS\b/.test(breakName)) {
                            twitter.cfg.viewport = breakName;
                            $.publish(twitter.events.VIEWPORT_CHANGE);
                        }
                    } else {
                        $.publish(twitter.events["VIEWPORT_"+breakName], false);
                    }
                }
                handler({
                    media: mediaQuery,
                    matches: matchMedia(mediaQuery).matches
                });
                window.matchMedia(mediaQuery).addListener(handler);

            })(breakPoint, twitter.cfg.breakPoints[breakPoint]);
        };

    });
        $(window).load(function(){
            $.publish(twitter.events.WINDOW_LOAD);
        });


})(jQuery, twitter, this, this.document);



  $(function(){
      // Fire modules based on the presence of their .mod-* class
        var modules = [],
          unique = [],
          context='',
          pattern = '[class^="mod-"], [class*=" mod-"]';
          targets = $(pattern, context);

        // NOTE: When calling this function you CAN pass either a selector
        // string or jQuery object as the context, it will handle either.
        context = $(context);

        // No context? Set as the document
        if(context.length === 0) context = $(document);

        // If context is a valid element, add it as a target. This catches
        // instances where the context is also a module
        // NOTE: Context could reference multiple elements, hence the loop
        context.each(function(){
          if(!!$(this).filter(pattern).length) targets = targets.add($(this));
        });

        // Loop through all targets (target are elements with .mod class)
        targets.each(function(){

          // Grab element classes & match pattern mod-{module}
          var matches = $(this).prop('class').match(/mod-([^ ]+)/g);

          // Add module(s) to modules array
          $.each(matches, function(i){

            // NOTE: We strip out 'mod-' here as the global tag in the
            // regex causes the whole match to be returned, not just
            // the capture group #BangsHeadAgainstWall
            var module = matches[i].replace('mod-','');

            // Add only if module exists
            if (twitter[module]) {
              modules.push(module);

            }
          });
        });

        // Remove duplicate entries
        $.each(modules, function(i, n){
          if($.inArray(n, unique) === -1) unique.push(n);
        });
        modules = unique;

        // Fire init on each module
        var defer = [];
        $.each(modules, function(i){
          if(twitter[modules[i]].init) {

            // Defer till after main init loop?
            if(twitter[modules[i]].settings.defer) {
              defer.push(modules[i]);
            } else {
              twitter[modules[i]].init(context);
            }
          } else {
            console.log('initModule: The module \'' + modules[i] + '\' does not have an init method');
          }
        });

        // Fire init on deferred modules
        $.each(defer, function(i){
          if(twitter[defer[i]].init) {
            twitter[defer[i]].init(context);
          } else {
            console.log('initModule: The module \'' + defer[i] + '\' does not have an init method');
          }
        });

        // Return list of modules
        return modules;

  });


/** ============================================================================
 jQuery Tiny Pub/Sub - v0.7 - 10/27/2011 http://benalman.com/
===============================================================================*/
;(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}})(jQuery);

/** ===========================================================================
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * Copyright (c) 2010 "Cowboy" Ben Alman
===============================================================================*/
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

/**============================================================================
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 *=============================================================================*/
;(function(){window.console||(window.console={});for(var b="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),a=0;a<b.length;a++)window.console[b[a]]||(window.console[b[a]]=function(){})})();

/**=============================================================================
 Few functions to provide support for IE 8 : Array.indexOf and Array.move
===============================================================================*/
Array.indexOf||(Array.prototype.indexOf=function(b){for(var a=0,c=this.length;a<c;a++)if(this[a]===b)return a;return-1});
Array.move||(Array.prototype.move=function(b,a){if(a>=this.length)for(var c=a-this.length;c--+1;)this.push(void 0);this.splice(a,0,this.splice(b,1)[0])});

