if (window.Prototype) {
    Ajax.Responders.register({
        onCreate: function (b, c) {
            var a = $$("meta[name=csrf-token]")[0];
            if (a) {
                if (typeof b.options.requestHeaders == "object") {
                    b.options.requestHeaders["X-App-Key"] = a.readAttribute("content")
                } else {
                    b.options.requestHeaders = {
                        "X-App-Key": a.readAttribute("content")
                    }
                }
            }
        }
    })
}
Event.delegate = function (a) {
    return function (d) {
        var c = Event.element(d);
        for (var b in a) {
            if (c.match(b)) {
                return a[b].apply(c, $A(arguments))
            }
        }
    }
};
var Utils = {
    getPageSize: function () {
        var d, a;
        if (window.innerHeight && window.scrollMaxY) {
            d = document.body.scrollWidth;
            a = window.innerHeight + window.scrollMaxY
        } else {
            if (document.body.scrollHeight > document.body.offsetHeight) {
                d = document.body.scrollWidth;
                a = document.body.scrollHeight
            } else {
                d = document.body.offsetWidth;
                a = document.body.offsetHeight
            }
        }
        var c, e;
        if (self.innerHeight) {
            c = self.innerWidth;
            e = self.innerHeight
        } else {
            if (document.documentElement && document.documentElement.clientHeight) {
                c = document.documentElement.clientWidth;
                e = document.documentElement.clientHeight
            } else {
                if (document.body) {
                    c = document.body.clientWidth;
                    e = document.body.clientHeight
                }
            }
        }
        if (a < e) {
            pageHeight = e
        } else {
            pageHeight = a
        }
        if (d < c) {
            pageWidth = c
        } else {
            pageWidth = d
        }
        var b = [pageWidth, pageHeight, c, e];
        return b
    },
    limitTextarea: function (c, b, a) {
        new Form.Element.Observer($(c), 0.1, function (g) {
            var d = $(c);
            if (!d) {
                return
            }
            if (b < 0) {
                return
            }
            if ( !! a) {
                a(d.value.length >= b)
            }
            if (d.value.length > b) {
                d.value = d.value.substring(0, b);
                d.scrollTop = d.scrollHeight
            }
        })
    },
    reloadCaptcha: function () {
        var a = $("captcha");
        if (a) {
            var b = a.getAttribute("src");
            var d = b.split("?")[0];
            var c = "";
            if (b.split("?").length > 1) {
                c = b.split("?")[1];
                c = c.replace(/t=[0-9]+/, "t=" + new Date().getTime())
            }
            d += "?" + c;
            a.setAttribute("src", d)
        }
    },
    setAllEmbededObjectsVisibility: function (a) {
        $$("object,embed").each(function (b) {
            b.setStyle({
                visibility: a
            })
        })
    },
    showRecaptcha: function (b, c) {
        var a = {
            theme: "custom",
            custom_theme_widget: b
        };
        Recaptcha.destroy();
        Utils.generateRecaptcha();
        Recaptcha.create(c, b, a)
    },
    reloadRecaptcha: function () {
        Utils.generateRecaptcha();
        Recaptcha.reload()
    },
    generateRecaptcha: function () {
        new Ajax.Request("/captcha/generate", {
            method: "post"
        })
    },
    showDialogOnOverlay: function (a) {
        Overlay.show();
        Overlay.center(a);
        a.setStyle({
            top: "80px"
        });
        a.show()
    },
    startCountdownTimer: function (a, c, b) {
        new PrettyTimer(a, function (d) {
            c.update(d)
        }, {
            showDays: false,
            showMeaningfulOnly: false,
            localizations: {
                hours: L10N.get("time.hours") + " ",
                minutes: L10N.get("time.minutes") + " ",
                seconds: L10N.get("time.seconds")
            },
            endCallback: b
        })
    }
};
if (window.Prototype) {
    Element.addMethods({
        wait: function (c, a) {
            var b = (a && a > 0) ? "padding: " + (a - 6) / 2 + "px 0" : "";
            var d = Builder.node("div", {
                className: "progressbar",
                style: b
            }, [Builder.node("img", {
                src: habboStaticFilePath + "/images/progress_bubbles.gif",
                width: "29",
                height: "6",
                alt: ""
            })]);
            c.innerHTML = Builder.node("p", [d]).innerHTML
        }
    })
}
var Cookie = {
    set: function (e, g, c, f) {
        var b = "";
        if (c != undefined) {
            var h = new Date();
            h.setTime(h.getTime() + (86400000 * parseFloat(c)));
            b = "; expires=" + h.toGMTString()
        }
        var a = "";
        if (f != undefined) {
            a = "; domain=" + escape(f)
        }
        return (document.cookie = escape(e) + "=" + escape(g || "") + "; path=/" + b + a)
    },
    setWithExpiresIn: function (b, c, e) {
        var a = "";
        if (e > 0) {
            var f = new Date();
            f.setTime(f.getTime() + (1000 * parseFloat(e)));
            a = "; expires=" + f.toGMTString()
        }
        return (document.cookie = escape(b) + "=" + escape(c || "") + "; path=/" + a)
    },
    get: function (a) {
        var b = document.cookie.match(new RegExp("(^|;)\\s*" + escape(a) + "=([^;\\s]*)"));
        return (b ? unescape(b[2]) : null)
    },
    append: function (c, d, a, e) {
        var b = Cookie.get(c);
        if ( !! b) {
            d = b + (e || "|") + d
        }
        return Cookie.set(c, d, a)
    },
    erase: function (a) {
        var b = Cookie.get(a) || true;
        Cookie.set(a, "", -1);
        return b
    },
    accept: function () {
        if (typeof navigator.cookieEnabled == "boolean") {
            return navigator.cookieEnabled
        }
        Cookie.set("_test", "1");
        return (Cookie.erase("_test") === "1")
    }
};
var HabboClient = {
    windowName: "client",
    windowParams: "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,",
    narrowSizeParams: "width=740,height=620",
    wideSizeParams: "width=980,height=620",
    nowOpening: false,
    maximizeWindow: false,
    forceReload: false,
    openOrFocus: function (c) {
        if (HabboClient.nowOpening) {
            return
        }
        HabboClient.nowOpening = true;
        var e = (c.href ? c.href : c);
        if (screen.width < 990) {
            e += ((e.indexOf("?") != -1) ? "&" : "?") + "wide=false"
        }
        var d = HabboClient._openEmptyHabboWindow(HabboClient.windowName);
        var b = false;
        try {
            b = (d.habboClient && d.document.habboLoggedIn)
        } catch (a) {}
        if (b && !HabboClient.forceReload) {
            d.focus()
        } else {
            d.location.href = e;
            d.focus()
        }
        HabboClient.nowOpening = false;
        Cookie.set("habboclient", "1")
    },
    close: function (c) {
        var a = Cookie.get("habboclient");
        if (a || c) {
            var b = HabboClient._openEmptyHabboWindow(HabboClient.windowName);
            if (!c) {
                Cookie.erase("habboclient")
            }
            if (b && !b.closed) {
                b.close()
            }
        }
    },
    roomForward: function (e, d, c) {
        var f = (e.href ? e.href : e);
        var b = false;
        try {
            b = window.habboClient
        } catch (a) {}
        if (b && !$(e).hasClassName("bbcode-client-link")) {
            window.location.href = f;
            return
        }
        if (document.habboLoggedIn) {
            new Ajax.Request("/components/roomNavigation", {
                method: "get",
                parameters: "targetId=" + d + "&roomType=" + c + "&move=true"
            }, false)
        }
        HabboClient.openOrFocus(f)
    },
    closeHabboAndOpenMainWindow: function (a) {
        if (window.opener != null && !window.opener.closed) {
            window.opener.location.href = a.href;
            window.opener.focus()
        } else {
            var b = window.open(a.href, "_blank", HabboClient.windowParams + (screen.width >= 990 ? HabboClient.wideSizeParams : HabboClient.narrowSizeParams));
            b.focus()
        }
        window.close()
    },
    _openHabboWindow: function (a, c) {
        if (HabboClient.maximizeWindow) {
            if (supportsHtml5Storage()) {
                html5StorageSetItem("maximizeWindow", "true");
                var b = HabboClient.getStoredWindowSize();
                if (b.length == 2) {
                    return window.open(a, c, HabboClient.windowParams + "width=" + b[0] + ",height=" + b[1])
                }
            }
            return window.open(a, c, HabboClient.windowParams + "top=0,left=0,width=" + window.screen.availWidth + ",height=" + window.screen.availHeight)
        } else {
            return window.open(a, c, HabboClient.windowParams + (screen.width >= 990 ? HabboClient.wideSizeParams : HabboClient.narrowSizeParams))
        }
    },
    resizeToFitScreenIfNeeded: function () {
        if (supportsHtml5Storage()) {
            var a = localStorage.maximizeWindow;
            if (a == "true") {
                localStorage.removeItem("maximizeWindow");
                if (Prototype.Browser.WebKit) {
                    var b = HabboClient.getStoredWindowSize();
                    if (b.length != 2) {
                        window.resizeTo(window.screen.availWidth, window.screen.availHeight)
                    }
                }
            }
        }
    },
    getStoredWindowSize: function () {
        if (supportsHtml5Storage()) {
            var a = localStorage.windowSize;
            if (a != null && typeof (a) == "string") {
                var c = a.split("x");
                if (c.length == 2) {
                    var b = parseInt(c[0], 10);
                    var d = parseInt(c[1], 10);
                    if (b <= window.screen.availWidth && b >= 800 && d <= window.screen.availHeight && d >= 505) {
                        return [b, d]
                    }
                }
            }
        }
        return []
    },
    storeWindowSize: function () {
        if (supportsHtml5Storage()) {
            var a = window.innerWidth;
            var b = window.innerHeight;
            if (typeof (a) == "undefined" || a == null) {
                return
            }
            html5StorageSetItem("windowSize", a + "x" + b)
        }
    },
    _openEmptyHabboWindow: function (a) {
        return HabboClient._openHabboWindow("", a)
    },
    startPingListener: function () {
        setInterval(function () {
            var a = Cookie.get("xwindow_comm");
            if (a == "ping") {
                Cookie.set("xwindow_comm", "pong")
            }
        }, 300)
    },
    isClientPresent: function (a) {
        Cookie.set("xwindow_comm", "ping");
        setTimeout(function () {
            var b = Cookie.get("xwindow_comm");
            a(b == "pong")
        }, 800)
    }
};

function openOrFocusHabbo(a) {
    HabboClient.openOrFocus(a)
}
function roomForward(c, b, a) {
    HabboClient.roomForward(c, b, a)
}
function openOrFocusHelp(c) {
    var e = (c.href ? c.href : c);
    var d = HabboClient._openEmptyHabboWindow("habbohelp");
    var b = false;
    try {
        b = (d.habboHelp)
    } catch (a) {}
    if (b) {
        d.focus()
    } else {
        d.location.href = e;
        d.focus()
    }
}
function ensureOpenerIsLoggedOut() {
    try {
        if (window.opener != null && window != window.opener && window.opener.document.habboLoggedIn != null) {
            if (window.opener.document.habboLoggedIn == true) {
                window.opener.location.replace(window.opener.location.href)
            }
        }
    } catch (a) {}
}
function ensureOpenerIsLoggedIn() {
    try {
        if (window.opener != null && window.opener != window) {
            if (window.opener.document.logoutPage != null && window.opener.document.logoutPage == true) {
                window.opener.location.href = "/"
            } else {
                if (window.opener.document.habboLoggedIn != null && window.opener.document.habboLoggedIn == false) {
                    window.opener.location.replace(window.opener.location.href)
                }
            }
        }
    } catch (a) {}
}
function supportsHtml5Storage() {
    try {
        return "localStorage" in window && window.localStorage !== null
    } catch (a) {
        return false
    }
}
function html5StorageSetItem(a, b) {
    try {
        localStorage.setItem(a, b)
    } catch (c) {}
}
var L10N = function () {
    var a = [];
    var b = function (f, e) {
        var c = f;
        for (var d = 0; d < e.length; ++d) {
            c = c.replace("{" + d + "}", e[d])
        }
        return c
    };
    return {
        put: function (c, d) {
            a[c] = d;
            return this
        },
        get: function (d) {
            var c = $A(arguments);
            c.shift();
            var e = a[d] || d;
            return e === d ? e : b(e, c)
        }
    }
}();
var TagHelper = Class.create();
TagHelper.initialized = false;
TagHelper.init = function (a) {
    if (TagHelper.initialized) {
        return
    }
    TagHelper.initialized = true;
    TagHelper.loggedInAccountId = a;
    TagHelper.bindEventsToTagLists()
};
TagHelper.addFormTagToMe = function () {
    var a = $("add-tag-input");
    TagHelper.addThisTagToMe($F(a), true);
    Form.Element.clear(a)
};
TagHelper.bindEventsToTagLists = function () {
    var a = function (b) {
        TagHelper.tagListClicked(b, TagHelper.loggedInAccountId)
    };
    $$(".tag-list.make-clickable").each(function (b) {
        Event.observe(b, "click", a);
        Element.removeClassName(b, "make-clickable")
    })
};
TagHelper.setTexts = function (a) {
    TagHelper.options = a
};
TagHelper.tagListClicked = function (g) {
    var d = Event.element(g);
    var b = Element.hasClassName(d, "tag-add-link");
    var a = Element.hasClassName(d, "tag-remove-link");
    if (b || a) {
        var h = Element.up(d, ".tag-list li");
        if (!h) {
            return
        }
        var c = TagHelper.findTagNameForContainer(h);
        var f = TagHelper.findTagIdForContainer(h);
        Event.stop(g);
        if (b) {
            TagHelper.addThisTagToMe(c, true)
        } else {
            TagHelper.removeThisTagFromMe(c, f)
        }
    }
};
TagHelper.findTagNameForContainer = function (a) {
    var b = Element.down(a, ".tag");
    if (!b) {
        return null
    }
    return b.innerHTML.strip()
};
TagHelper.findTagIdForContainer = function (a) {
    var b = Element.down(a, ".tag-id");
    if (!b) {
        return null
    }
    return b.innerHTML.strip()
};
TagHelper.addThisTagToMe = function (b, c, a) {
    if (typeof (a) == "undefined") {
        a = {}
    }
    new Ajax.Request("/myhabbo/tag/add", {
        parameters: "accountId=" + encodeURIComponent(TagHelper.loggedInAccountId) + "&tagName=" + encodeURIComponent(b),
        onSuccess: function (e) {
            var d = e.responseText;
            if (d == "valid" && c) {
                $$(".tag-list li").each(function (f) {
                    if (TagHelper.findTagNameForContainer(f) == b) {
                        var h = Element.down(f, ".tag-add-link");
                        var g = $$(".tag-remove-link").first();
                        h.title = g ? g.title : "";
                        h.removeClassName("tag-add-link").addClassName("tag-remove-link")
                    }
                })
            } else {
                if (d == "taglimit") {
                    Dialog.showInfoDialog("tag-error-dialog", TagHelper.options.tagLimitText, TagHelper.options.buttonText, null)
                } else {
                    if (d == "invalidtag") {
                        Dialog.showInfoDialog("tag-error-dialog", TagHelper.options.invalidTagText, TagHelper.options.buttonText, null)
                    } else {
                        if (d == "exists") {}
                    }
                }
            }
            if (d == "valid" || d == "") {
                if (c) {
                    TagHelper.reloadMyTagsList()
                } else {
                    TagHelper.reloadSearchBox(b, 1)
                }
                if (typeof (a.onSuccess) == "function") {
                    a.onSuccess()
                }
            }
        }
    })
};
TagHelper.reloadSearchBox = function (a, b) {
    if ($("tag-search-habblet-container")) {
        new Ajax.Updater($("tag-search-habblet-container"), "/habblet/ajax/tagsearch", {
            method: "post",
            parameters: "tag=" + a + "&pageNumber=" + b,
            evalScripts: true
        })
    }
};
TagHelper.removeThisTagFromMe = function (a, b) {
    new Ajax.Request("/myhabbo/tag/remove", {
        parameters: "accountId=" + encodeURIComponent(TagHelper.loggedInAccountId) + "&tagId=" + encodeURIComponent(b),
        onSuccess: function (d) {
            var c = function (e) {
                $$(".tag-list li").each(function (f) {
                    if (TagHelper.findTagNameForContainer(f) == a) {
                        var h = Element.down(f, ".tag-remove-link");
                        var g = $$(".tag-add-link").first();
                        if (g) {
                            h.title = g.title || "";
                            h.removeClassName("tag-remove-link").addClassName("tag-add-link")
                        }
                    }
                })
            };
            TagHelper.reloadMyTagsList({
                onSuccess: c
            })
        }
    })
};
TagHelper.reloadMyTagsList = function (b) {
    var a = {
        evalScripts: true
    };
    Object.extend(a, b);
    new Ajax.Updater($("my-tags-list"), "/habblet/mytagslist", a)
};
TagHelper.matchFriend = function () {
    var a = $F("tag-match-friend");
    if (a) {
        new Ajax.Updater($("tag-match-result"), habboReqPath + "/habblet/ajax/tagmatch", {
            parameters: {
                friendName: a
            },
            onComplete: function (d) {
                var c = $("tag-match-value");
                if (c) {
                    var b = parseInt(c.innerHTML, 10);
                    if (typeof TagHelper.CountEffect == "undefined") {
                        $("tag-match-value-display").innerHTML = b + " %";
                        Element.show("tag-match-slogan")
                    } else {
                        var e;
                        if (b > 0) {
                            e = 1.5
                        } else {
                            e = 0.1
                        }
                        new TagHelper.CountEffect("tag-match-value-display", {
                            duration: e,
                            transition: Effect.Transitions.sinoidal,
                            from: 0,
                            to: b,
                            afterFinish: function () {
                                Effect.Appear("tag-match-slogan", {
                                    duration: 1
                                })
                            }
                        })
                    }
                }
            }
        })
    }
};
var TagFight = Class.create();
TagFight.init = function () {
    if ($F("tag1") && $F("tag2")) {
        TagFight.start()
    } else {
        return false
    }
};
TagFight.start = function () {
    $("fightForm").style.display = "none";
    $("tag-fight-button").style.display = "none";
    $("fightanimation").src = habboStaticFilePath + "/images/tagfight/tagfight_loop.gif";
    $("fight-process").style.display = "block";
    setTimeout("TagFight.run()", 3000)
};
TagFight.run = function () {
    new Ajax.Updater("fightResults", "/habblet/ajax/tagfight", {
        method: "post",
        parameters: "tag1=" + $F("tag1") + "&tag2=" + $F("tag2"),
        onComplete: function () {
            $("fight-process").style.display = "none";
            $("fightForm").style.display = "none";
            $("tag-fight-button-new").style.display = "block"
        }
    })
};
TagFight.newFight = function () {
    $("fight-process").style.display = "none";
    $("fightForm").style.display = "block";
    $("fightResultCount").style.display = "none";
    $("tag-fight-button").style.display = "block";
    $("tag-fight-button-new").style.display = "none";
    $("fightanimation").src = habboStaticFilePath + "/images/tagfight/tagfight_start.gif";
    $("tag1").value = "";
    $("tag2").value = ""
};
var Dialog = {
    moveDialogToCenter: function (e) {
        var d = $(document.body).cumulativeOffset();
        var f = Element.getDimensions(e);
        var b = Utils.getPageSize();
        var a = 0,
            g = 0;
        a = Math.round(b[2] / 2) - Math.round(f.width / 2);
        if ($("ad_sidebar")) {
            var c = $("ad_sidebar").cumulativeOffset();
            if (a + f.width > c[0]) {
                a = c[0] - f.width
            }
        }
        if (a < 0) {
            a = 0
        }
        g = document.viewport.getScrollOffsets().top + 80;
        if (g + f.height > b[1]) {
            g = b[1] - f.height
        }
        if (g < d[1]) {
            g = d[1] + 20
        }
        e.style.left = a + "px";
        e.style.top = g + "px"
    },
    createDialog: function (n, h, i, g, e, a, k) {
        if (!n) {
            return
        }
        var f = $("overlay");
        var b = [];
        if (!k) {
            b.push(Builder.node("h2", {
                className: "title dialog-handle"
            }, h));
            if (typeof (h) != "string" || h.length == 0) {
                b[0].innerHTML = "&nbsp;"
            }
        }
        if (a) {
            var o = Builder.node("a", {
                href: "#",
                className: "topdialog-exit"
            }, [Builder.node("img", {
                src: habboStaticFilePath + "/v2/images/close_x.gif",
                width: 15,
                height: 15,
                alt: ""
            })]);
            Event.observe(o, "click", function (p) {
                Event.stop(p);
                a()
            }, false);
            b.push(o)
        }
        var m = [];
        if (k) {
            var d = Builder.node("div", {
                className: "topdialog-tabs"
            });
            d.innerHTML = k;
            m.push(b);
            m.push(d);
            var l = $(d).select("ul");
            if (l.length > 0) {
                l[0].addClassName("box-tabs")
            }
        } else {
            m.push(b)
        }
        m.push(Builder.node("div", {
            id: n + "-body",
            className: "topdialog-body"
        }));
        var c = "cbb topdialog" + (k ? " black" : "");
        var j = f.parentNode.insertBefore(Builder.node("div", {
            id: n,
            className: c
        }, m), f.nextSibling);
        Rounder.round(j);
        j = j.parentNode.parentNode.parentNode;
        j.style.zIndex = (i || 9001);
        j.style.left = (g || -1000) + "px";
        j.style.top = (e || 0) + "px";
        Dialog.makeDialogDraggable(j);
        return j
    },
    showInfoDialog: function (a, f, e, b) {
        Overlay.show();
        var c = Dialog.createDialog(a, "", "9003");
        var d = Builder.node("a", {
            href: "#",
            className: "new-button"
        }, [Builder.node("b", e), Builder.node("i")]);
        Dialog.appendDialogBody(c, Builder.node("p", {
            id: a + "content"
        }));
        $(a + "content").innerHTML = f;
        Dialog.appendDialogBody(c, Builder.node("p", [d]));
        if (b == null) {
            Event.observe(d, "click", function (g) {
                Event.stop(g);
                Element.hide($(a));
                Overlay.hide()
            }, false)
        } else {
            Event.observe(d, "click", b, false)
        }
        Overlay.move("9002");
        Dialog.moveDialogToCenter(c)
    },
    showConfirmDialog: function (e) {
        var b = Object.extend({
            dialogId: "confirm-dialog",
            buttonText: "OK",
            cancelButtonText: "Cancel",
            headerText: "Are you sure?",
            okHandler: Prototype.emptyFunction,
            cancelHandler: Prototype.emptyFunction
        }, arguments[1] || {});
        Overlay.show();
        var c = Dialog.createDialog(b.dialogId, b.headerText, "9003");
        if (b.width) {
            c.style.width = b.width
        }
        Dialog.appendDialogBody(c, Builder.node("p", {
            id: b.dialogId + "content"
        }));
        $(b.dialogId + "content").innerHTML = e;
        var d = Builder.node("a", {
            href: "#",
            className: "new-button"
        }, [Builder.node("b", b.buttonText), Builder.node("i")]);
        var a = Builder.node("a", {
            href: "#",
            className: "new-button"
        }, [Builder.node("b", b.cancelButtonText), Builder.node("i")]);
        Dialog.appendDialogBody(c, Builder.node("div", [a, d]));
        Event.observe(d, "click", function (f) {
            Event.stop(f);
            b.okHandler()
        }, false);
        Event.observe(a, "click", function (f) {
            Event.stop(f);
            Element.remove($(b.dialogId));
            Overlay.hide();
            b.cancelHandler()
        }, false);
        Overlay.move("9002");
        Dialog.moveDialogToCenter(c);
        return c
    },
    appendDialogBody: function (d, b, a) {
        var e = $(d);
        if (e) {
            var c = $(e.id + "-body");
            (a) ? c.innerHTML += b : c.insertBefore(b, c.lastChild);
            if (b.innerHTML) {
                b.innerHTML.evalScripts()
            }
        }
    },
    setDialogBody: function (c, a) {
        var d = $(c);
        if (d) {
            var b = $(d.id + "-body");
            b.innerHTML = a
        }
    },
    setAsWaitDialog: function (a) {
        var b = $(a);
        if (b) {
            Element.wait($(b.id + "-body"))
        }
    },
    makeDialogDraggable: function (a) {
        if (typeof Draggable != "undefined") {
            var b = "title";
            if (!$(a).down("." + b, 0)) {
                b = "box-tabs"
            }
            new Draggable(a, {
                handle: b,
                starteffect: Prototype.emptyFunction,
                endeffect: Prototype.emptyFunction,
                zindex: 9100
            })
        }
    }
};
var Overlay = {
    show: function (g, e) {
        var a = Utils.getPageSize();
        var c = $("overlay");
        c.style.display = "block";
        c.style.height = a[1] + "px";
        try {
            var h = Element.getDimensions("top").width;
            if (h > a[2]) {
                c.style.minWidth = h + "px"
            }
        } catch (d) {}
        c.style.zIndex = "9000";
        if (e) {
            var f = new Image();
            f.src = habboStaticFilePath + "/v2/images/page_loader.gif";
            var b = c.parentNode.insertBefore(Builder.node("div", {
                id: "overlay_progress"
            }, [Builder.node("p", [Builder.node("img", {
                src: habboStaticFilePath + "/v2/images/page_loader.gif",
                alt: e
            })]), Builder.node("p", e)]), c.nextSibling);
            Overlay.center(b)
        }
        if (g) {
            Event.observe($("overlay"), "click", function (i) {
                g()
            }, false);
            if (e) {
                Event.observe($("overlay_progress"), "click", function (i) {
                    g()
                }, false)
            }
        }
        Utils.setAllEmbededObjectsVisibility("hidden")
    },
    center: function (c) {
        var b = Utils.getPageSize();
        var d = Element.getDimensions(c);
        var a = 0,
            e = 0;
        a = Math.round(b[2] / 2) - Math.round(d.width / 2);
        if (a < 0) {
            a = 0
        }
        e = document.viewport.getScrollOffsets().top + (Math.round(b[3] / 2) - Math.round(d.height / 2));
        if (e < 0) {
            e = 0
        }
        c.style.left = a + "px";
        c.style.top = e + "px"
    },
    hide: function () {
        if ($("overlay_progress")) {
            Element.remove($("overlay_progress"))
        }
        var a = $("overlay");
        a.style.zIndex = "9000";
        a.style.display = "none";
        Utils.setAllEmbededObjectsVisibility("visible")
    },
    move: function (a) {
        $("overlay").style.zIndex = a;
        if ($("overlay_progress")) {
            $("overlay_progress").style.zIndex = a
        }
    },
    hideIfMacFirefox: function () {
        var a = navigator.platform;
        var b = navigator.appName;
        if ((a == "Mac" || a == "MacIntel" || a == "MacPPC") && (b == "Netscape" || b == "Mozilla" || b == "Firefox")) {
            Overlay.hide()
        }
    },
    lightbox: function (e, c) {
        var b = Builder.node("img", {
            src: e,
            style: "display: none; position: absolute; z-index: 9001; top:0; left:0; border: 7px solid #fff"
        });
        var d = function (f) {
            if (f) {
                Event.stop(f)
            }
            b.hide();
            Overlay.hide()
        };
        Event.observe(b, "click", d);
        var a = new Image();
        Overlay.show(d, c || "");
        a.onload = function () {
            if ($("overlay_progress")) {
                Element.remove($("overlay_progress"))
            }
            $("overlay").parentNode.insertBefore(b, $("overlay"));
            Overlay.center(b);
            b.show();
            a.onload = function () {}
        };
        a.src = e
    },
    textLightbox: function (b) {
        var a = Builder.node("p", {
            style: "display: none; padding: 10px; text-align: left; position: absolute; z-index: 9001; top:0; left:0; background-color: #fff; border: 2px solid #333; width: 300px"
        });
        $(a).update(b);
        var c = function (d) {
            if (d) {
                Event.stop(d)
            }
            a.hide();
            Overlay.hide()
        };
        Event.observe(a, "click", c);
        Overlay.show(c, "");
        a.show();
        if ($("overlay_progress")) {
            Element.remove($("overlay_progress"))
        }
        $("overlay").parentNode.insertBefore(a, $("overlay"));
        Overlay.center(a)
    }
};
var ScriptLoader = {
    loaded: [],
    callbacks: [],
    load: function (e, a) {
        if (!a) {
            a = {}
        }
        if (!ScriptLoader.loaded[e]) {
            var c = document.getElementsByTagName("head")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";
            var d = a.path || habboStaticFilePath + "/js";
            b.src = d + "/" + e + ".js";
            if (a.callback) {
                ScriptLoader.callbacks[e] = a.callback
            }
            c.appendChild(b)
        } else {
            if (a.callback) {
                a.callback()
            }
        }
    },
    notify: function (b, a) {
        ScriptLoader.loaded[b] = true;
        if (ScriptLoader.callbacks[b]) {
            ScriptLoader.callbacks[b](a)
        }
    }
};
QuickMenu = Class.create();
QuickMenu.prototype = {
    initialize: function () {},
    add: function (a, b) {
        new QuickMenuItem(this, a, b)
    },
    activate: function (a) {
        var b = a.element;
        if (this.active) {
            Element.removeClassName(this.active, "selected")
        }
        if (this.active === b) {
            this.closeContainer()
        } else {
            Element.addClassName(b, "selected");
            if (this.openContainer(b)) {
                if (a.clickHandler) {
                    a.clickHandler.apply(null, [this.qtabContainer])
                }
            }
        }
    },
    openContainer: function (b) {
        var c = $("the-qtab-" + b.id);
        var d = (c == null);
        if (d) {
            c = $(Builder.node("div", {
                "class": "the-qtab",
                id: "the-qtab-" + b.id
            }));
            $("header").appendChild(c);
            var a = '<div style="margin-left: 1px; width: ' + (b.getWidth() - 2) + 'px; height: 1px; background-color: #fff"></div>';
            c.update('<div class="qtab-container-top">' + a + '</div><div class="qtab-container-bottom"><div id="qtab-container-' + b.id + '" class="qtab-container"></div></div>');
            this.qtabContainer = $("qtab-container-" + b.id);
            c.clonePosition(b, {
                setWidth: false,
                setHeight: false,
                offsetTop: 25
            })
        }
        $("header").select(".the-qtab").each(Element.hide);
        c.show();
        this.active = b;
        return d
    },
    closeContainer: function () {
        $("header").select(".the-qtab").each(Element.hide);
        if (this.active) {
            var a = $("the-qtab-" + this.active.id);
            Element.removeClassName(this.active, "selected")
        }
        this.active = null
    }
};
QuickMenuItem = Class.create();
QuickMenuItem.prototype = {
    initialize: function (a, c, d) {
        this.quickMenu = a;
        this.element = $(c);
        var b = this.click.bind(this);
        c.down("a").observe("click", b);
        if (d) {
            this.clickHandler = d
        }
    },
    click: function (a) {
        Event.stop(a);
        this.quickMenu.activate(this)
    }
};
HabboView.add(function () {
    if (document.habboLoggedIn && $("subnavi-user")) {
        var b = new QuickMenu();
        var a = $A([
            ["myfriends", habboReqPath+"/quickmenu/friends_all"],
            ["mygroups", habboReqPath+ "/quickmenu/groups"],
            ["myrooms", habboReqPath+"/quickmenu/rooms"]
        ]);
        a.each(function (c) {
            b.add($(c[0]), function (d) {
                var e = c[1];
                Element.wait(d);
                new Ajax.Updater(d, e, {
                    onComplete: function () {
                        new QuickMenuListPaging(c[0], e)
                    }
                })
            })
        });
        Event.observe(document.body, "click", function (c) {
            b.closeContainer()
        })
    }
});
var Accordion = Class.create();
Accordion.prototype = {
    initialize: function (f, e, a, c, d, b) {
        this.animating = false;
        this.openedItem = null;
        this.accordionContainer = f;
        this.summaryContainerPrefix = e;
        this.toggleDetailsClassName = a;
        this.detailsContainerPrefix = c;
        this.openDetailsL10NKey = d;
        this.closeDetailsL10NKey = b;
        this.accordionContainer.select("." + this.toggleDetailsClassName).each(function (h) {
            var g = this.parseItem(h);
            if (g.el.visible()) {
                this.openedItem = g;
                throw $break
            }
        }.bind(this));
        Event.observe(this.accordionContainer, "click", function (i) {
            var h = Event.element(i);
            if (h && h.id && h.hasClassName(this.toggleDetailsClassName)) {
                Event.stop(i);
                var g = this.parseItem(h);
                if (g.el) {
                    this.toggleItems(g.link, g.el, g.id)
                }
            }
        }.bind(this))
    },
    parseItem: function (b) {
        var c = b.id.split("-").last();
        var a = $(this.detailsContainerPrefix + c);
        return {
            link: b,
            el: a,
            id: c
        }
    },
    toggleItems: function (d, b, e) {
        if (this.animating) {
            return false
        }
        var a = this.openedItem;
        var c = [];
        if (!a || (a && a.id != e)) {
            $(this.summaryContainerPrefix + e).addClassName("selected");
            if (this.closeDetailsL10NKey) {
                d.innerHTML = L10N.get(this.closeDetailsL10NKey)
            }
            c.push(new Effect.BlindDown(b));
            this.openedItem = {
                link: d,
                el: b,
                id: e
            }
        }
        if (a && a.id == e) {
            this.openedItem = null
        }
        if (a) {
            $(this.summaryContainerPrefix + a.id).removeClassName("selected");
            if (this.openDetailsL10NKey) {
                a.link.innerHTML = L10N.get(this.openDetailsL10NKey)
            }
            c.push(new Effect.BlindUp(a.el))
        }
        new Effect.Parallel(c, {
            queue: {
                position: "end",
                scope: "accordionAnimation"
            },
            beforeStart: function (f) {
                this.animating = true
            }.bind(this),
            afterFinish: function (f) {
                this.animating = false
            }.bind(this)
        })
    }
};
var PrettyTimer = Class.create({
    _time: 0,
    _callback: Prototype.emptyFunction,
    _options: {
        leadingZeros: true,
        showDays: true,
        showMeaningfulOnly: true,
        endCallback: Prototype.emptyFunction,
        localizations: {
            days: "{0}:",
            hours: "{0}:",
            minutes: "{0}:",
            seconds: "{0}"
        }
    },
    initialize: function (b, c, a) {
        this._time = b;
        if ( !! c) {
            this._callback = c
        }
        if ( !! a) {
            this._options = Object.extend(this._options, a || {})
        }
        this._update();
        new PeriodicalExecuter(this._update.bind(this), 1)
    },
    _update: function (c) {
        if (this._time == 0) {
            this._options.endCallback();
            if ( !! c) {
                c.stop()
            }
        } else {
            var e = Math.floor(this._time / 60);
            var b = Math.floor(e / 60);
            e -= (b * 60);
            var f = 0;
            if (this._options.showDays) {
                f = Math.floor(b / 24);
                b -= (f * 24)
            }
            var d = this._time - (f * 24 * 60 * 60) - (b * 60 * 60) - (e * 60);
            var a = "";
            if (this._options.showDays) {
                if (!this._options.showMeaningfulOnly || f > 0) {
                    if (this._options.leadingZeros && f < 10) {
                        a += "0"
                    }
                    a += this._options.localizations.days.replace("{0}", f)
                }
            }
            if (!this._options.showMeaningfulOnly || b > 0 || f > 0) {
                if (this._options.leadingZeros && b < 10) {
                    a += "0"
                }
                a += this._options.localizations.hours.replace("{0}", b)
            }
            if (!this._options.showMeaningfulOnly || e > 0 || b > 0 || f > 0) {
                if (this._options.leadingZeros && e < 10) {
                    a += "0"
                }
                a += this._options.localizations.minutes.replace("{0}", e)
            }
            if (this._options.leadingZeros && d < 10) {
                a += "0"
            }
            a += this._options.localizations.seconds.replace("{0}", d);
            this._callback(a)
        }
        this._time--
    }
});
var HashHistory = function () {
    var b = false;
    var d = new Hash();
    var c = "";
    var e = function () {
        c = window.location.hash;
        new PeriodicalExecuter(function () {
            var f = window.location.hash;
            if (f != c && f.indexOf("#") != -1) {
                a(f, false)
            }
        }, 0.3)
    };
    var a = function (f, g) {
        c = f;
        d.each(function (h) {
            if (new RegExp(h.key).test(f.substring(1))) {
                h.value(f.substring(1), g)
            }
        })
    };
    return {
        observe: function (f, g) {
            d.set(f, g);
            if (!b) {
                e()
            }
            a(window.location.hash, true)
        },
        setHash: function (f, g) {
            c = f;
            if (!g) {
                a(f, false)
            }
            window.location.hash = f
        }
    }
}();
var ChangePassword = {
    init: function () {
        if ( !! $("forgot-password")) {
            Event.observe($("forgot-password"), "click", function (a) {
                Event.stop(a);
                ChangePassword.showForgotPasswordForm()
            })
        }
        if ( !! $("forgot-password-localization-link")) {
            Event.observe($("forgot-password-localization-link"), "click", function (a) {
                Event.stop(a);
                ChangePassword.showForgotPasswordForm()
            })
        }
    },
    showChangeEmailPasswordSentNotice: function (a) {
        Utils.showDialogOnOverlay($("change-password-form"));
        $("change-password-email-address").value = a;
        $("email-sent-container").innerHTML = a;
        $("change-password-email-sent-notice").show();
        Event.observe($("change-password-success-button"), "click", function () {
            $("change-password-email-sent-notice").hide();
            $("change-password-form").hide();
            Overlay.hide()
        });
        Event.observe($("change-password-change-link"), "click", function () {
            $("change-password-email-sent-notice").hide();
            ChangePassword.showForgotPasswordForm()
        })
    },
    showForgotPasswordForm: function () {
        Utils.showDialogOnOverlay($("change-password-form"));
        var a = $("change-password-email-address");
        $("change-password-form-content").show();
        if ( !! $("login-username")) {
            if ($("login-username").value.length > 0) {
                a.value = $("login-username").value
            }
        }
        Event.observe($("change-password-submit-button"), "click", b);

        function b() {
            if ( !! ChangePassword.isValidPasswordChange()) {
                $("forgotten-pw-form").submit();
                b = Prototype.emptyFunction
            } else {
                a.addClassName("error");
                $("change-password-error-container").show();
                a.focus()
            }
        }
        Event.observe($("change-password-cancel-link"), "click", function () {
            $("change-password-form-content").hide();
            $("change-password-form").hide();
            Overlay.hide()
        });
        a.focus()
    },
    isValidPasswordChange: function () {
        var a = $F("change-password-email-address");
        return a.length > 0 && a.length <= 48
    },
    showForgotPasswordFormWithEmail: function (a) {
        ChangePassword.showForgotPasswordForm();
        $("change-password-email-address").value = a
    }
};
Function.prototype.debounce = function (a, c) {
    var b = this;
    var d;
    return function () {
        var f = arguments;
        var e = function () {
            if (!c) {
                b.apply(this, f)
            }
            d = null
        }.bind(this);
        if (d) {
            clearTimeout(d)
        } else {
            if (c) {
                b.apply(this, f)
            }
        }
        d = e.delay(a)
    }
};