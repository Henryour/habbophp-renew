ReportDialog = Class.create();
ReportDialog.prototype = {
    initialize: function (b) {
        this.element = b;
        this.observed = false;
        this.observers = Array()
    },
    show: function () {
        if (this.element) {
            if (this.beforeShow) {
                this.beforeShow()
            }
            $(this.element).style.zIndex = 9001;
            Element.show(this.element);
            this.observeAll()
        }
    },
    dispose: function () {
        if (this.element) {
            if (this.beforeDispose) {
                this.beforeDispose()
            }
            Element.hide(this.element);
            this.stopObservingAll()
        }
    },
    clonePosition: function (b) {
        if (Prototype.Browser.IE) {
            this.element.clonePosition(b, {
                setWidth: false,
                setHeight: false,
                offsetTop: -5,
                offsetLeft: -8
            })
        } else {
            this.element.clonePosition(b, {
                setWidth: false,
                setHeight: false,
                offsetTop: -5,
                offsetLeft: 0
            })
        }
    },
    cloneDialogPosition: function (b) {
        if (Prototype.Browser.IE) {
            this.element.clonePosition(b.element, {
                setWidth: false,
                setHeight: false,
                offsetLeft: -8
            })
        } else {
            this.element.clonePosition(b.element, {
                setWidth: false,
                setHeight: false
            })
        }
    },
    observeAll: function () {
        if (!this.observed) {
            if (this.observers) {
                for (var b = 0; b < this.observers.length; b++) {
                    Event.observe(this.observers[b]["id"], "click", this.observers[b]["observer"], false)
                }
            }
            this.observed = true
        }
    },
    bringToFront: function () {
        if (this.element) {
            baseelement = $(this.element);
            baseelement.style.zIndex = 9999
        }
    },
    stopObservingAll: function () {
        if (this.observed) {
            if (this.observers) {
                for (var b = 0; b < this.observers.length; b++) {
                    Event.stopObserving(this.observers[b]["id"], "click", this.observers[b]["observer"], false)
                }
            }
            this.observed = false
        }
    }
};
var ReportDialogManager = function () {
    var InappropriateContentReportDialog = Class.create();
    Object.extend(InappropriateContentReportDialog.prototype, ReportDialog.prototype);
    Object.extend(InappropriateContentReportDialog.prototype, {
        initialize: function (objectName) {
            this.objectName = objectName;
            this.observers = Array();
            this.observers[0] = Array();
            this.observers[0]["id"] = objectName + "-report-report";
            this.observers[0]["observer"] = (function (e) {
                Event.stop(e);
                if (!this.objectId) {
                    return
                }
                new Ajax.Request(habboReqPath + "/mod/add_" + objectName + "_report", {
                    parameters: {
                        objectId: this.objectId
                    },
                    onComplete: (function (req) {
                        var resultDialog = "error";
                        if (req.responseText == "SUCCESS") {
                            resultDialog = "success"
                        } else {
                            if (req.responseText == "SPAM") {
                                resultDialog = "spam"
                            }
                        }
                        ReportDialogManager.show(resultDialog, null, this.element, {
                            setWidth: false,
                            setHeight: false
                        });
                        this.dispose()
                    }).bind(this)
                })
            }).bind(this);
            this.observers[1] = Array();
            this.observers[1]["id"] = objectName + "-report-cancel";
            this.observers[1]["observer"] = (function (e) {
                Event.stop(e);
                this.dispose()
            }).bind(this)
        },
        setObjectId: function (id) {
            this.objectId = id
        },
        localizationAvailable: function (localizations) {
            this.templateParams = localizations;
            this.templateParams.id = this.objectName
        },
        createElement: function () {
            if (!this.element) {
                this.element = Builder.build(new Template(this.DIALOG_TEMPLATE).evaluate(this.templateParams));
                var p = $("content");
                if (p) {
                    p.appendChild(this.element)
                }
            }
        },
        DIALOG_TEMPLATE: '<div id="dialog-#{id}-report" class="menu">	<div class="menu-header">		<h3>#{title}</h3>	</div>	<div class="menu-body">		<div class="menu-content" id="#{id}-content">	<div>#{message}</div>	<div style="text-align: right">	<button id="#{id}-report-cancel">#{btnCancelText}</button>	<button id="#{id}-report-report">#{btnReportText}</button>	</div>			<div class="clear"></div>		</div>	</div>	<div class="menu-bottom"></div></div>'
    });
    ReportInfoDialog = Class.create();
    Object.extend(ReportInfoDialog.prototype, ReportDialog.prototype);
    Object.extend(ReportInfoDialog.prototype, {
        initialize: function (objectName) {
            this.objectName = objectName;
            this.observers = Array();
            this.observers[0] = Array();
            this.observers[0]["id"] = objectName + "-report-report";
            this.observers[0]["observer"] = (function (e) {
                Event.stop(e);
                this.dispose()
            }).bind(this)
        },
        localizationAvailable: function (localizations) {
            this.templateParams = localizations;
            this.templateParams.id = this.objectName
        },
        createElement: function () {
            if (!this.element) {
                this.element = Builder.build(new Template(this.DIALOG_TEMPLATE).evaluate(this.templateParams));
                var p = $("content");
                if (p) {
                    p.appendChild(this.element)
                }
            }
        },
        DIALOG_TEMPLATE: '<div id="dialog-#{id}-report" class="menu">	<div class="menu-header">		<h3>#{title}</h3>	</div>	<div class="menu-body">		<div class="menu-content" id="#{id}-content">	<div>#{message}</div>	<div style="text-align: right">	<button id="#{id}-report-report">#{btnText}</button>	</div>			<div class="clear"></div>		</div>	</div>	<div class="menu-bottom"></div></div>'
    });
    var inited = false;
    var dialogs = {};
    var listeners = {};
    var messages = {};
    var showInternal = function (objectName, instanceId, targetEl, positionParams) {
        var dialog = get(objectName);
        if (dialog) {
            dialog.createElement();
            if (instanceId) {
                dialog.setObjectId(instanceId)
            }
            if (positionParams) {
                dialog.element.clonePosition(targetEl, positionParams)
            } else {
                dialog.clonePosition(targetEl)
            }
            dialog.show();
            if (typeof isNotWithinPlayground != "undefined" && isNotWithinPlayground(dialog.element)) {
                new Effect.Move(dialog.element, {
                    x: offsetToPlayground(dialog.element),
                    y: 0,
                    mode: "relative",
                    duration: 0.2
                })
            }
        }
    };
    var onLoaded = function (response, callback) {
        messages = eval("(" + response.responseText + ")");
        var h = $H(listeners);
        h.each(function (pair) {
            var l = messages[pair.key];
            if (l) {
                pair.value.localizationAvailable(l)
            }
        });
        callback()
    };
    var execute = function (callback) {
        if (!inited) {
            new Ajax.Request(habboReqPath + "/mod/localizations", {
                method: "get",
                onComplete: function (response) {
                    inited = true;
                    if (200 == response.status) {
                        onLoaded(response, callback)
                    }
                }
            })
        } else {
            callback()
        }
    };
    var get = function (objectName) {
        return dialogs[objectName]
    };
    var addDialog = function (d) {
        return listeners[d.objectName] = dialogs[d.objectName] = d
    };
    return {
        add: function (objectName) {
            var d = new InappropriateContentReportDialog(objectName);
            return addDialog(d)
        },
        addInfoDialog: function (objectName) {
            var d = new ReportInfoDialog(objectName);
            return addDialog(d)
        },
        show: function (objectName, instanceId, targetEl, positionParams) {
            execute(function () {
                showInternal(objectName, instanceId, targetEl, positionParams)
            })
        },
        hideAll: function () {
            var h = $H(listeners);
            h.each(function (pair) {
                var l = get(pair.key);
                if (l) {
                    pair.value.dispose()
                }
            })
        }
    }
}();
["error", "spam", "success"].each(function (b) {
    ReportDialogManager.addInfoDialog(b)
});
["motto", "name", "url", "room", "stickie", "groupname", "groupdesc", "animator", "discussionpost"].each(function (b) {
    ReportDialogManager.add(b)
});
var guestbookReportDialog = ReportDialogManager.add("guestbook");
guestbookReportDialog.beforeShow = function () {
    $("guestbook-entry-container").style.overflow = "hidden"
};
guestbookReportDialog.beforeDispose = function () {
    $("guestbook-entry-container").style.overflow = "auto"
};
if (typeof (Object.Event) == "undefined") {
    Object.Event = {
        eventHandlers: {},
        observe: function (d, b) {
            if (!this.eventHandlers[d]) {
                this.eventHandlers[d] = $A([])
            }
            this.eventHandlers[d].push(b)
        },
        stopObserving: function (d, b) {
            this.eventHandlers[d] = this.eventHandlers[d].without(b)
        },
        fireEvent: function (b) {
            if (this.eventHandlers[b]) {
                this.eventHandlers[b].each(function (d) {
                    d(this)
                }.bind(this))
            }
        }
    };
    Object.Event.createEvent = Object.Event.fireEvent
}
if (typeof (Control) == "undefined") {
    Control = {}
}
Control.TextArea = Class.create();
Object.extend(Control.TextArea.prototype, Object.Event);
Object.extend(Control.TextArea.prototype, {
    onChangeTimeoutLength: 500,
    textarea: false,
    onChangeTimeout: false,
    initialize: function (b) {
        this.textarea = $(b);
        $(this.textarea).observe("keyup", this.doOnChange.bindAsEventListener(this));
        $(this.textarea).observe("paste", this.doOnChange.bindAsEventListener(this));
        $(this.textarea).observe("input", this.doOnChange.bindAsEventListener(this))
    },
    doOnChange: function (b) {
        if (this.onChangeTimeout) {
            window.clearTimeout(this.onChangeTimeout)
        }
        this.onChangeTimeout = window.setTimeout(function () {
            this.createEvent("change")
        }.bind(this), this.onChangeTimeoutLength)
    },
    getValue: function () {
        return this.textarea.value
    },
    getSelection: function () {
        if (typeof (document.selection) != "undefined") {
            return document.selection.createRange().text
        } else {
            if (typeof (this.textarea.setSelectionRange) != "undefined") {
                return this.textarea.value.substring(this.textarea.selectionStart, this.textarea.selectionEnd)
            } else {
                return false
            }
        }
    },
    replaceSelection: function (d) {
        if (typeof (document.selection) != "undefined") {
            this.textarea.focus();
            var b = document.selection.createRange();
            b.text = d;
            b.collapse(false);
            b.select()
        } else {
            if (typeof (this.textarea.setSelectionRange) != "undefined") {
                selection_start = this.textarea.selectionStart;
                this.textarea.value = this.textarea.value.substring(0, selection_start) + d + this.textarea.value.substring(this.textarea.selectionEnd);
                this.textarea.setSelectionRange(selection_start + d.length, selection_start + d.length)
            }
        }
        this.doOnChange();
        this.textarea.focus()
    },
    wrapSelection: function (b, d) {
        this.replaceSelection(b + this.getSelection() + d)
    },
    insertBeforeSelection: function (b) {
        this.replaceSelection(b + this.getSelection())
    },
    insertAfterSelection: function (b) {
        this.replaceSelection(this.getSelection() + b)
    },
    injectEachSelectedLine: function (e, b, d) {
        this.replaceSelection((b || "") + $A(this.getSelection().split("\n")).inject([], e).join("\n") + (d || ""))
    },
    insertBeforeEachSelectedLine: function (e, b, d) {
        this.injectEachSelectedLine(function (g, f) {
            g.push(e + f);
            return g
        }, b, d)
    }
});
Control.TextArea.ToolBar = Class.create();
Object.extend(Control.TextArea.ToolBar.prototype, {
    textarea: false,
    toolbar: false,
    initialize: function (b, d) {
        this.textarea = b;
        if (d) {
            this.toolbar = $(d)
        } else {
            this.toolbar = $(document.createElement("ul"));
            this.textarea.textarea.parentNode.insertBefore(this.toolbar, this.textarea.textarea)
        }
    },
    attachButton: function (b, d) {
        b.onclick = function () {
            return false
        };
        $(b).observe("click", d.bindAsEventListener(this.textarea))
    },
    addButton: function (b, e, d) {
        c = document.createElement("li");
        c.className = "control-button";
        link = document.createElement("a");
        link.href = "#";
        this.attachButton(link, e);
        c.appendChild(link);
        if (d) {
            for (a in d) {
                link[a] = d[a]
            }
        }
        if (b) {
            span = document.createElement("span");
            span.innerHTML = b;
            link.appendChild(span)
        }
        this.toolbar.appendChild(c)
    }
});
Control.TextArea.ToolBar.BBCode = Class.create();
Object.extend(Control.TextArea.ToolBar.BBCode.prototype, {
    textarea: false,
    toolbar: false,
    options: {
        preview: false
    },
    initialize: function (b, d) {
        this.textarea = new Control.TextArea(b);
        this.toolbar = new Control.TextArea.ToolBar(this.textarea);
        this.toolbar.toolbar.addClassName("bbcode_toolbar");
        if (d) {
            for (o in d) {
                this.options[o] = d[o]
            }
        }
        this.toolbar.addButton("Bold", function () {
            this.wrapSelection("[b]", "[/b]")
        }, {
            id: "bbcode_bold_button"
        });
        this.toolbar.addButton("Italics", function () {
            this.wrapSelection("[i]", "[/i]")
        }, {
            id: "bbcode_italics_button"
        });
        this.toolbar.addButton("Underline", function () {
            this.wrapSelection("[u]", "[/u]")
        }, {
            id: "bbcode_underline_button"
        });
        this.toolbar.addButton("Quote", function () {
            this.wrapSelection("[quote]", "[/quote]")
        }, {
            id: "bbcode_quote_button"
        });
        this.toolbar.addButton("Small size", function () {
            this.wrapSelection("[size=small]", "[/size]")
        }, {
            id: "bbcode_smallsize_button"
        });
        this.toolbar.addButton("Large size", function () {
            this.wrapSelection("[size=large]", "[/size]")
        }, {
            id: "bbcode_largesize_button"
        });
        this.toolbar.addButton("Code", function () {
            this.wrapSelection("[code]", "[/code]")
        }, {
            id: "bbcode_code_button"
        });
        this.toolbar.addButton("Link", function () {
            var f = this.getSelection();
            var g = f;
            var h = "http://";
            var e = f.match(/^\s*(\w+:\/*)?([^\(\)\?&"'\s]*)([^:\(\)"'\s]*).*/);
            if (e != null) {
                f = e[2] + e[3];
                g = e[2];
                if (f.search(/\./) == -1) {
                    h = "";
                    f = e[2]
                }
                f = f.replace(/\[.*?\]/g, "")
            }
            this.replaceSelection("[url=" + h + f + "]" + g + "[/url]")
        }, {
            id: "bbcode_link_button"
        })
    },
    addColorSelect: function (i, e, g) {
        var d = document.createElement("select");
        if (g) {
            var j = 170;
            if (navigator.appVersion.match(/\bMSIE\b/)) {
                j += 4
            }
            d.style.width = (Element.getDimensions(this.textarea.textarea).width - j - 3) + "px"
        }
        Event.observe(d, "change", function (l) {
            Event.stop(l);
            if (d.selectedIndex == 0) {
                return
            }
            var k = Event.element(l).value;
            d.selectedIndex = 0;
            this.textarea.wrapSelection("[color=" + k + "]", "[/color]")
        }.bind(this));
        var h = document.createElement("option");
        h.innerHTML = i;
        d.appendChild(h);
        d.selectedIndex = 0;
        for (var f in e) {
            h = document.createElement("option");
            h.innerHTML = e[f][1];
            h.style.color = e[f][0];
            h.value = f;
            d.appendChild(h)
        }
        var b = new Element("li", {
            className: "control-button"
        });
        b.appendChild(d);
        this.toolbar.toolbar.appendChild(b)
    },
    addHabboLinkTools: function () {
        var b = new Element("li", {
            className: "linktools"
        });
        var d = new Element("div");
        d.insert(L10N.get("linktool.find.label") + " ");
        var f = function (i, l, k) {
            var j = {
                name: "linktool-scope",
                type: "radio",
                value: l
            };
            if (k) {
                j.checked = "checked"
            }
            d.appendChild(new Element("input", j));
            d.insert(i + " ")
        };
        f(L10N.get("linktool.scope.habbos"), 1, true);
        f(L10N.get("linktool.scope.rooms"), 2);
        f(L10N.get("linktool.scope.groups"), 3);
        var e = new Element("input", {
            name: "linktool-query",
            type: "text",
            size: 20
        });
        d.appendChild(e);
        b.appendChild(d);
        b.insert(" ");
        var h = new Element("a", {
            href: "#",
            className: "new-button search-icon"
        });
        h.appendChild(new Element("b")).appendChild(new Element("span"));
        h.appendChild(new Element("i"));
        b.appendChild(h);
        var g = new Element("div", {
            className: "linktool-results"
        });
        b.appendChild(g);
        new LinkTool(this.textarea, {
            button: h,
            input: e,
            results: g,
            scopeButtons: b.select('input[name="linktool-scope"]')
        });
        this.toolbar.toolbar.appendChild(b)
    }
});
var GroupEditTools = {
    init: function (d, b) {
        GroupEditTools.groupId = d;
        GroupEditTools.buttonEl = b;
        Event.observe(GroupEditTools.buttonEl, "click", GroupEditTools.handleButtonClick);
        Event.observe(document.body, "click", function (f) {
            if (GroupEditTools.isOpen) {
                GroupEditTools.close()
            }
        })
    },
    handleButtonClick: function (b) {
        Event.stop(b);
        (GroupEditTools.isOpen) ? GroupEditTools.close() : GroupEditTools.open()
    },
    handleToolsClick: function (d) {
        GroupEditTools.close();
        var b = Event.findElement(d, "a");
        if (b && b.id) {
            if (b.id != "group-tools-style") {
                Event.stop(d);
                switch (b.id) {
                    case "group-tools-settings":
                        openGroupSettings(GroupEditTools.groupId);
                        break;
                    case "group-tools-badge":
                        openGroupBadgeEditor(GroupEditTools.groupId);
                        break;
                    case "group-tools-members":
                        MembersList.open();
                        break
                }
            }
        } else {
            Event.stop(d)
        }
    },
    open: function () {
        if (!GroupEditTools.toolsEl) {
            GroupEditTools.toolsEl = $("group-tools");
            Event.observe(GroupEditTools.toolsEl, "click", GroupEditTools.handleToolsClick)
        }
        var b = GroupEditTools.buttonEl.cumulativeOffset();
        GroupEditTools.toolsEl.style.top = (Element.getHeight(GroupEditTools.buttonEl) + b[1]) + "px";
        GroupEditTools.toolsEl.style.left = b[0] + "px";
        Element.show(GroupEditTools.toolsEl);
        GroupEditTools.isOpen = true;
        Utils.setAllEmbededObjectsVisibility("hidden")
    },
    close: function () {
        Element.hide(GroupEditTools.toolsEl);
        GroupEditTools.isOpen = false;
        Utils.setAllEmbededObjectsVisibility("visible")
    }
};