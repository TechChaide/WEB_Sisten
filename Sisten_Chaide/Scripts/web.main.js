var __lbs = (function () {

    var
        context = {},
        _MENU_STATE = 'GeoFleetAdmin.MenuState',
        _root = "/",
        _util = new Utilities(),
        _labels,
        _isMenuShowed = true,
        _targetAnchor,
        _parent,
 
        _validate_dynamically = function () {
            $.fn.updateValidation = function () {
                var $this = $(this);
                var form = $this.closest("form")
                    .removeData("validator")
                    .removeData("unobtrusiveValidation");

                $.validator.unobtrusive.parse(form);

                return $this;
            };
            $.fn.doGet = function (path, args, callback) {
                args = args || {};
                $.extend(args, { refresh: new Date().getTime() });
                $.get(window.path(path), args, function (r) { if (typeof callback === 'function') callback(r); })
                    .fail(function (a, b) { throw (new Error(JSON.stringify({ extra: { a: a, b: b }, critical: false, file: "" }))); });
            };
            $.fn.doPost = function (path, callback) {
                $.post(window.path(path), $(this).closest("form").serialize(), function (r) {
                    window.message.show(r);
                    if (callback) {
                        callback(r);
                    }
                })
                    .fail(function (a, b) { throw (new Error(JSON.stringify({ extra: { a: a, b: b }, critical: false, file: "" }))); });
            };
            $.fn.doSubmit = function () {
                var form = $(this).closest("form");
                if (!$.validator || form.valid()) {
                    form.submit();
                }
            };
            $.fn.switcher = function (opt) {
                var
                    that = this,
                    list = $(that).find("li"),
                    disabled = $(that).hasClass('disabled') || $(that).attr("disabled");

                function click() {
                    list.removeClass("selected");
                    $(this).addClass("selected");
                    var
                        control = $(this).closest("ul").data("switcher"),
                        value = $(this).data("val");

                    if (control) document.getElementsByName(control)[0].value = value;
                    if (opt && opt.onSelected) {
                        opt.onSelected.call(that, { value: value });
                    }
                }

                function select(v) {
                    list.removeClass("selected");
                    var
                        control = $(this).closest("ul").data("switcher");

                    if (control) document.getElementsByName(control)[0].value = v;
                    $(["li[data-val='", v, "']"].join('')).addClass("selected");
                    if (opt && opt.onSelected) {
                        opt.onSelected.call(that, { value: v });
                    }
                }

                if (!disabled) {
                    list.click(click);
                }

                return that.extend({
                    disable: function () { list.unbind("click"); },
                    enable: function () { list.click("click"); },
                    select: function (v) { select(v); }
                });
            };
            $.fn.waiting = function (size) {
                _labels = new Labels();
                if ($(this).find(".waiting").length) {
                    $(this).css("position", "").find(".waiting").remove();
                } else {
                    $(this).css("position", "relative");

                    var
                        html = $(["<div class='waiting'><div class='waiting-overlay'></div><div class='waiting waiting-main' style='font-size:", (size || 16), "px'><span>&nbsp;", _labels[_context.loggedUser.two_letters_culture].loading, "</span></div></div>"].join("")).appendTo(this),
                        span = html.find("span").innerHeight();

                    html.find(".waiting-main").css("padding-top", [$(this).innerHeight() * .5 - span * .5, "px"].join(""));
                }
            };
            $.doGet = function (path, args, callback) {
                $(window).doGet(path, args, callback);
            };
            $.doPost = function (path, args) {
                var $form = $(["<form action='", window.path(path), "' method='post'></form>"].join(""));
                for (var prop in args) {
                    $form.append(["<input type='hidden' name='", prop, "' value='", args[prop], "'/>"].join(""));
                }
                $form.appendTo(document.body).submit();
            };
        };
    return {
        getContext: function () {
            return context;
        },
        modal_box: function () {
            //_modal_message_box();
        },
        validate_dynamically: function () {
            _validate_dynamically();
        },
        main: function () {
            if (!window.location.origin) {
                window.location.origin = [window.location.protocol, "//", window.location.host].join("");
            }
            window.path = function (url) { return [_root, url].join(""); };


            if ($('#context').val() !== '') {
                $context = JSON.parse($('#context').val());
            }




            if (this.users) this.users.init();
            if (this.profiles) this.profiles.init();
            if (this.zone) this.zone.init();
            if (this.delivery_itinerary) this.delivery_itinerary.init();
            if (this.delivery_order) this.delivery_order.init();
            if (this.delivery) this.delivery.init();
            if (this.delivery_edit) this.delivery_edit.init();
            if (this.zones) this.zones.init();
            if (this.zone_assing_driver) this.zone_assing_driver.init();



            /*GLOBAL APPLICATION SETTINGS*/

            //Default DataTable settings
            if ($.fn.dataTable) {
                $.extend($.fn.dataTable.defaults, {
                    "oLanguage": { "sUrl": $("#datatable-lang-url").val() },
                    "fnInitComplete": function (oSettings, json) {
                        if ($(".dtrow").length > 0) {
                            $(".dtrow").find('input,select').addClass('form-control input-sm');
                        }
                        else {
                            //Change styles when complete event fired to soon, before table rendering has finished
                            window.setTimeout(function () { $(".dtrow").find('input,select').addClass('form-control input-sm'); }, 300);
                        }
                    }
                });

                //Executed when fnInitComplete has been overrided
                var attemptsNumber = 3;
                function updateStyles() {
                    window.setTimeout(function () {
                        if ($(".dtrow").length === 0 && attemptsNumber > 0) {
                            updateStyles();
                            attemptsNumber -= 1;
                        }
                        else {
                            $(".dtrow").find('input,select').addClass('form-control input-sm');
                        }
                    }, 100);
                }
                updateStyles();
            }

            //Override some validation options
            if ($.validator) {
                $.validator.setDefaults({ ignore: ":hidden:not([class*='force-validate']), .ignore" });
            }

            $('.tooltips').tooltip();
            $('.language').on('change', function () { document.location.href = this.value; });
            $('.time-zone').on('change', function () { document.location.href = this.value; });

            // -------------------------------
            // Panel Collapses
            // -------------------------------
            $('a.panel-collapse').click(function () {
                $(this).children().toggleClass("fa-chevron-down fa-chevron-up");
                $(this).closest(".panel-heading").next().slideToggle({ duration: 200 });
                $(this).closest(".panel-heading").toggleClass('rounded-bottom');
                return false;
            });

            /*MENU FUNCTIONALITY
            **********************************************************/



            if (_util.Cookie(_MENU_STATE) === 'collapsed') {
                $('body').addClass('collapse-leftbar');
            } else {
                $('body').removeClass('collapse-leftbar');
            }

            //Show/Hide Left Side Menu
            $("a#leftmenu-trigger").click(function () {
                $("body").toggleClass("collapse-leftbar");

                if (_util.Cookie(_MENU_STATE) === 'collapsed') {
                    _util.Cookie(_MENU_STATE, "");
                    $('ul.acc-menu').css('visibility', '');
                }
                else {
                    $.each($('.acc-menu'), function () {
                        if ($(this).css('display') === 'none') {
                            $(this).css('display', '');
                        }
                    });

                    $('ul.acc-menu:first ul.acc-menu').css('visibility', 'hidden');
                    _util.Cookie(_MENU_STATE, "collapsed");
                }
            });

            $('body').on('click', 'ul.acc-menu a', function () {
                var LIs = $(this).closest('ul.acc-menu').children('li');
                $(this).closest('li').addClass('clicked');
                $.each(LIs, function (i) {
                    if ($(LIs[i]).hasClass('clicked')) {
                        $(LIs[i]).removeClass('clicked');
                        return true;
                    }
                    if (_util.Cookie(_MENU_STATE) !== 'collapsed' || $(this).parents('.acc-menu').length > 1) $(LIs[i]).find('ul.acc-menu:visible').slideToggle({ duration: 100 });
                    $(LIs[i]).removeClass('open');
                });
                if ($(this).siblings('ul.acc-menu:visible').length > 0)
                    $(this).closest('li').removeClass('open');
                else
                    $(this).closest('li').addClass('open');
                if (_util.Cookie(_MENU_STATE) !== 'collapsed' || $(this).parents('.acc-menu').length > 1) $(this).siblings('ul.acc-menu').slideToggle({ duration: 200 });
            });

            //Set current menu item as checked according to current URL
            $.each($('ul.acc-menu a'), function () {

                var regex = [window.location.pathname, "$"].join('');

                if (new RegExp(regex).test(this.href)) {
                    _targetAnchor = this;
                    return false;
                }
            });

            _parent = $(_targetAnchor).closest('li');
            while (true) {
                _parent.addClass('active');
                _parent.closest('ul.acc-menu').show().closest('li').addClass('open');
                _parent = $(_parent).parents('li').eq(0);
                if ($(_parent).parents('ul.acc-menu').length <= 0) break;
            }

            var liHasUlChild = $('li').filter(function () {
                return $(this).find('ul.acc-menu').length;
            });
            $(liHasUlChild).addClass('hasChild');

            if (_util.Cookie(_MENU_STATE) === 'collapsed') {
                $('ul.acc-menu:first ul.acc-menu').css('visibility', 'hidden');
            }

            $('ul.acc-menu:first > li').hover(function () {
                if (_util.Cookie(_MENU_STATE) === 'collapsed')
                    $(this).find('ul.acc-menu').css('visibility', '');
            }, function () {
                if (_util.Cookie(_MENU_STATE) === 'collapsed')
                    $(this).find('ul.acc-menu').css('visibility', 'hidden');
            });

            //CHECK VALIDATOR STYLES
            $("input[data-val='true']").map(function () {
                if ($(this).data("val-required") && !this.disabled) { $(this).addClass("required"); }
            });

            if (!String.prototype.format) {
                String.prototype.format = function () {
                    var args = arguments;
                    return this.replace(/{(\d+)}/g, function (match, number) {
                        return typeof args[number] != 'undefined'
                            ? args[number]
                            : match
                            ;
                    });
                };
            }

        }
    };

})();

$(document).ready(function () {
    __lbs.main();
    __lbs.validate_dynamically();
    __lbs.modal_box();
    if ($.fn.dataTableExt)
        $.fn.dataTableExt.oApi.fnSetFilteringEnterPress = function (oSettings) {
            var _that = this;

            this.each(function (i) {
                $.fn.dataTableExt.iApiIndex = i;
                var
                    $this = this,
                    oTimerId = null,
                    sPreviousSearch = null,
                    anControl = $('input', _that.fnSettings().aanFeatures.f);

                anControl
                    .unbind('keyup')
                    .bind('keyup', function (e) {

                        if (anControl.val().length == 0 || e.keyCode == 13) {
                            _that.fnFilter(anControl.val());
                        }
                    });

                return this;
            });
            return this;
        };
    /* Cargando */

});

window.onerror = function (a, b, c) {
    var err = null;

    try {
        err = JSON.parse(a.substring(a.indexOf("{")));
    } catch (e) { }

    if (err) {
        if (err.extra.a.readyState !== 0) {
            var o = {
                err: err == null ? a : err,
                url: b,
                line: c,
                browser: $.browser,
                userAgent: navigator.userAgent.toLowerCase()
            };

        }
    }
};