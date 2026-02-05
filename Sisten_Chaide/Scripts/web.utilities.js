var Utilities = function (o) {

	var _fadeOutMessageTimer;

	var _stopEventPropagation = function (e) {

		if (!e)
			e = window.event;

		if (typeof e.cancelBubble != "undefined") {
			e.cancelBubble = true;
		}

		if (typeof e.returnValue != "undefined") {
			e.returnValue = false;
		}

		if (e.stopPropagation)
			e.stopPropagation();

		if (e.preventDefault)
			e.preventDefault();

		return false;

	};

	var _loading = function () {
		$("#loading").show();
		$("#loaded").hide();
	};

	var _loaded = function () {
		$("#loading").hide();
		$("#loaded").show();
	};

	var _getJSON = function (url, parameters, success, error) {

		var p = [];

		for (var k in parameters) {
			p.push([k, "=", parameters[k]].join(""));
		}
		var x = [url, "?", p.join("&")].join("");

		if ($.browser.msie && navigator.sayswho[1] <= 9) {

			var xdr = new XDomainRequest();
			xdr.open("get", x);
			xdr.onload = function () {

				var response;
				if (xdr.responseText == null || typeof (xdr.responseText) == 'undefined' || xdr.responseText == "\'null\'") {
					response = JSON.parse(null);
				}
				else {
					response = JSON.parse(xdr.responseText);
				}

				success(response);

			};

			xdr.onprogress = function () { };
			xdr.ontimeout = function () {
				error("XDR Error", "Timeout");
			};

			xdr.onerror = function () {
				error("XDR Error", "Unknown error");
			};

			xdr.timeout = 20000;


			setTimeout(function () {
				xdr.send();
			}, 100);

		}
		else {

			jQuery.ajaxSettings.traditional = true;

			$.getJSON(x, function (response) {
				success(response);
			}).error(function (a, b) {
			  var err = {
			    extra: {
			      a: a,
			      b: b
			    },
			    critical: false
			  };
			  throw (new Error(JSON.stringify(err)));
			});
		}
	};

	return {
		GetJSON: function (url, parameters, success, error) {
			return _getJSON(url, parameters, success, error);
		},
		StopEventPropagation: function (e) {
			return _stopEventPropagation(e);
		},
		Loading: function () {
			return _loading();
		},
		Loaded: function () {
			return _loaded();
		},
		IsValidEmail: function (value) {
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},
		Message: function (o) {

			var jqMessageLock = $("#message-lock");
			var jqMessageContainer = $("#fade-out-message-container");
			var jqMessageArrow = $("#fade-out-message-container .arrow");
			var jqMessage = $("#fade-out-message-container .message");
			var jqEnvelope = $("#fade-out-message-container .envelope");
			var message = o.Message;
			var fadeOutTime = o.FadeOutTime;
			var onClose = function () { };
			var onComplete = function () { };

			var buttons = o.Buttons ? o.Buttons : [];

			$(o.TargetSelector).closest(".container").scrollTop($(o.TargetSelector).closest(".container").scrollTop() + parseInt($(o.TargetSelector).position().top));

			if (o.OnComplete)
				onComplete = o.OnComplete;

			if (o.OnClose)
				onClose = o.OnClose;

			var fadeOut = function () {
				jqMessageContainer.animate({ opacity: 0 }, {
					duration: 100, complete: function () {
						jqMessageLock.hide();
						jqMessageContainer.hide();
						onComplete.call();
					}
				});
			};

			var close = function () {
				jqMessageContainer.animate({ opacity: 0 }, {
					duration: 100, complete: function () {
						jqMessageLock.hide();
						jqMessageContainer.hide();
						onClose.call();
					}
				});
			};

			jqMessageLock.css("zIndex", ($.TopZIndex() + 1));
			jqMessageLock.show();

			if (jqMessageContainer.is(":visible")) {
				clearTimeout(_fadeOutMessageTimer);
				jqMessageLock.hide();
				jqMessageContainer.hide(0, function () {
					jqMessageContainer.css("opacity", 0);
				});
			}

			jqMessageArrow.removeClass("left");
			jqMessageArrow.removeClass("right");
			jqMessageArrow.removeClass("top");
			jqMessageArrow.removeClass("bottom");

			jqEnvelope.removeClass("l");
			jqEnvelope.removeClass("r");

			jqMessageArrow.addClass(o.ArrowPosition);
			jqEnvelope.addClass(o.ArrowPosition[0]);

			jqMessageContainer.css("zIndex", parseFloat(jqMessageLock.css("zIndex")) + 1);
			jqMessageContainer.show(0, function () {
				jqMessageContainer.animate({ opacity: 1 }, { duration: 200 });
			});

			jqMessageContainer.position({
				of: $(o.TargetSelector),
				my: o.SelfCorner,
				at: o.TargetCorner,
				collision: 'none'
			});

			jqMessage.children().remove();

			jqMessage.append($("<div></div>").text(message));

			jqMessageContainer.unbind("click");
			jqMessageLock.unbind("click");

			if (buttons.length > 0) {

				jqMessage.append($("<ul></ul>").attr("class", "buttons"));

				var jqButtons = $("#fade-out-message-container .buttons");

				$.map(buttons, function (button, i) {
					jqButtons.append($("<li></li>").attr("id", button.Id).text(button.Text));

					$(["#", button.Id].join("")).bind("click", { f: button.Callback }, function (e) {

						jqMessageContainer.animate({ opacity: 0 }, {
							duration: 100, complete: function () {
								jqMessageLock.hide();
								jqMessageContainer.hide();
								if (e.data.f)
									e.data.f.call();
							}
						});

					});
				});

			}
			else {

				jqMessageContainer.bind("click", {}, function () {
					clearTimeout(_fadeOutMessageTimer);
					close();
				});

				jqMessageLock.bind("click", {}, function () {
					clearTimeout(_fadeOutMessageTimer);
					close();
				});
			}

			var onResize = function () {
				clearTimeout(_fadeOutMessageTimer);
				jqMessageLock.hide();
				jqMessageContainer.hide();
				onClose.call();
				$(window).unbind("resize", onResize);
			};

			$(window).bind("resize", onResize);

			if (fadeOutTime > 0 && buttons.length <= 0) {
				_fadeOutMessageTimer = setTimeout(function () {
					fadeOut();
				}, fadeOutTime);
			}

		},
		VerifySession: function (is_session_alive) {
			if (!is_session_alive) {
				this.Message({
					TargetSelector: ".identity .user",
					SelfCorner: "right-3 top-6",
					TargetCorner: "left top",
					ArrowPosition: "right",
					FadeOutTime: 5000,
					Message: $("#SessionExpired").text(),
					OnComplete: function () {
						window.location.href = "../../Home/LogOff";
					},
					OnClose: function () {
						window.location.href = "../../Home/LogOff";
					}
				});
			}
			return is_session_alive;
		},
		CriticalError: function () {
			this.Message({
				TargetSelector: ".identity .user",
				SelfCorner: "right-3 top-6",
				TargetCorner: "left top",
				ArrowPosition: "right",
				FadeOutTime: 10000,
				Message: $("#CriticalError").text(),
				OnComplete: function () {
					window.location.href = "../../Home/LogOff";
				},
				OnClose: function () {
					window.location.href = "../../Home/LogOff";
				}
			});
		},
		PadLeft: function (value, padding) {
			var zeroes = [];
			for (var i = 0; i < (padding - value.toString().length) ; i++) {
				zeroes.push("0");
			}
			zeroes.push(value.toString());
			return zeroes.join("");
		},
		Trace: function (o) {
		  throw (new Error(JSON.stringify(err)));
		},
		Format: function (text, params) {
			if (params && params.length > 0) {
				var regex,
            concatenatedText = text;
				for (var i = 0; i < params.length; i++) {
					regex = new RegExp(["\\{", i, "\\}"].join(""), "g");
					concatenatedText = concatenatedText.replace(regex, params[i]);
				}
				return concatenatedText;
			} else {
				return text;
			}
		},
		//[name] = is required
		//[value] = if (value === undefined), the method returns value else it set new value into the new cookie
		//[days] = optional, default is 1
		Cookie: function (name, value, days) { 
			if (value != undefined) {
				var expires = "";
				if (days) {
					var date = new Date();
					date.setTime(date.getTime() + ((days || 1) * 86400000));//days*24*60*60*1000
					expires = ["; expires=", date.toGMTString()].join("");
				}
				document.cookie = [name, "=", value, expires, "; path=/"].join("");
			}
			else {
				var v = ([document.cookie, ';'].join("")).match(new RegExp([name, "=.*;"].join("")));
				return v && v[0].split(/=|;/)[1];
			}
		},
		DelCookie: function (name) {
			this.Cookie(name, "", -1);
		}
	};
}

