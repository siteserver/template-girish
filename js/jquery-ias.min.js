/*!
 * Infinite Ajax Scroll v2.2.0
 * A jQuery plugin for infinite scrolling
 * http://infiniteajaxscroll.com
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://infiniteajaxscroll.com/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright (c) 2015 Webcreate (Jeroen Fiege)
 */
var IASCallbacks = function() {
		return this.list = [], this.fireStack = [], this.isFiring = !1, this.isDisabled = !1, this.fire = function(a) {
			var b = a[0],
				c = a[1],
				d = a[2];
			this.isFiring = !0;
			for (var e = 0, f = this.list.length; f > e; e++) if (void 0 != this.list[e] && !1 === this.list[e].fn.apply(b, d)) {
				c.reject();
				break
			}
			this.isFiring = !1, c.resolve(), this.fireStack.length && this.fire(this.fireStack.shift())
		}, this.inList = function(a, b) {
			b = b || 0;
			for (var c = b, d = this.list.length; d > c; c++) if (this.list[c].fn === a || a.guid && this.list[c].fn.guid && a.guid === this.list[c].fn.guid) return c;
			return -1
		}, this
	};
IASCallbacks.prototype = {
	add: function(a, b) {
		var c = {
			fn: a,
			priority: b
		};
		b = b || 0;
		for (var d = 0, e = this.list.length; e > d; d++) if (b > this.list[d].priority) return this.list.splice(d, 0, c), this;
		return this.list.push(c), this
	},
	remove: function(a) {
		for (var b = 0;
		(b = this.inList(a, b)) > -1;) this.list.splice(b, 1);
		return this
	},
	has: function(a) {
		return this.inList(a) > -1
	},
	fireWith: function(a, b) {
		var c = jQuery.Deferred();
		return this.isDisabled ? c.reject() : (b = b || [], b = [a, c, b.slice ? b.slice() : b], this.isFiring ? this.fireStack.push(b) : this.fire(b), c)
	},
	disable: function() {
		this.isDisabled = !0
	},
	enable: function() {
		this.isDisabled = !1
	}
}, function(a) {
	"use strict";
	var b = -1,
		c = function(c, d) {
			return this.itemsContainerSelector = d.container, this.itemSelector = d.item, this.nextSelector = d.next, this.paginationSelector = d.pagination, this.$scrollContainer = c, this.$container = window === c.get(0) ? a(document) : c, this.defaultDelay = d.delay, this.negativeMargin = d.negativeMargin, this.nextUrl = null, this.isBound = !1, this.isPaused = !1, this.listeners = {
				next: new IASCallbacks,
				load: new IASCallbacks,
				loaded: new IASCallbacks,
				render: new IASCallbacks,
				rendered: new IASCallbacks,
				scroll: new IASCallbacks,
				noneLeft: new IASCallbacks,
				ready: new IASCallbacks
			}, this.extensions = [], this.scrollHandler = function() {
				if (this.isBound && !this.isPaused) {
					var a = this.getCurrentScrollOffset(this.$scrollContainer),
						c = this.getScrollThreshold();
					b != c && (this.fire("scroll", [a, c]), a >= c && this.next())
				}
			}, this.getItemsContainer = function() {
				return a(this.itemsContainerSelector)
			}, this.getLastItem = function() {
				return a(this.itemSelector, this.getItemsContainer().get(0)).last()
			}, this.getFirstItem = function() {
				return a(this.itemSelector, this.getItemsContainer().get(0)).first()
			}, this.getScrollThreshold = function(a) {
				var c;
				return a = a || this.negativeMargin, a = a >= 0 ? -1 * a : a, c = this.getLastItem(), 0 === c.length ? b : c.offset().top + c.height() + a
			}, this.getCurrentScrollOffset = function(a) {
				var b = 0,
					c = a.height();
				return b = window === a.get(0) ? a.scrollTop() : a.offset().top, (-1 != navigator.platform.indexOf("iPhone") || -1 != navigator.platform.indexOf("iPod")) && (c += 80), b + c
			}, this.getNextUrl = function(b) {
				return b = b || this.$container, a(this.nextSelector, b).last().attr("href")
			}, this.load = function(b, c, d) {
				var e, f, g = this,
					h = [],
					i = +new Date;
				d = d || this.defaultDelay;
				var j = {
					url: b
				};
				return g.fire("load", [j]), a.get(j.url, null, a.proxy(function(b) {
					e = a(this.itemsContainerSelector, b).eq(0), 0 === e.length && (e = a(b).filter(this.itemsContainerSelector).eq(0)), e && e.find(this.itemSelector).each(function() {
						h.push(this)
					}), g.fire("loaded", [b, h]), c && (f = +new Date - i, d > f ? setTimeout(function() {
						c.call(g, b, h)
					}, d - f) : c.call(g, b, h))
				}, g), "html")
			}, this.render = function(b, c) {
				var d = this,
					e = this.getLastItem(),
					f = 0,
					g = this.fire("render", [b]);
				g.done(function() {
					a(b).hide(), e.after(b), a(b).fadeIn(400, function() {
						++f < b.length || (d.fire("rendered", [b]), c && c())
					})
				})
			}, this.hidePagination = function() {
				this.paginationSelector && a(this.paginationSelector, this.$container).hide()
			}, this.restorePagination = function() {
				this.paginationSelector && a(this.paginationSelector, this.$container).show()
			}, this.throttle = function(b, c) {
				var d, e, f = 0;
				return d = function() {
					function a() {
						f = +new Date, b.apply(d, g)
					}
					var d = this,
						g = arguments,
						h = +new Date - f;
					e ? clearTimeout(e) : a(), h > c ? a() : e = setTimeout(a, c)
				}, a.guid && (d.guid = b.guid = b.guid || a.guid++), d
			}, this.fire = function(a, b) {
				return this.listeners[a].fireWith(this, b)
			}, this.pause = function() {
				this.isPaused = !0
			}, this.resume = function() {
				this.isPaused = !1
			}, this
		};
	c.prototype.initialize = function() {
		var a = !! ("onscroll" in this.$scrollContainer.get(0)),
			b = this.getCurrentScrollOffset(this.$scrollContainer),
			c = this.getScrollThreshold();
		return a ? (this.hidePagination(), this.bind(), this.fire("ready"), this.nextUrl = this.getNextUrl(), b >= c && this.next(), this) : !1
	}, c.prototype.reinitialize = function() {
		this.unbind(), this.initialize()
	}, c.prototype.bind = function() {
		if (!this.isBound) {
			this.$scrollContainer.on("scroll", a.proxy(this.throttle(this.scrollHandler, 150), this));
			for (var b = 0, c = this.extensions.length; c > b; b++) this.extensions[b].bind(this);
			this.isBound = !0, this.resume()
		}
	}, c.prototype.unbind = function() {
		if (this.isBound) {
			this.$scrollContainer.off("scroll", this.scrollHandler);
			for (var a = 0, b = this.extensions.length; b > a; a++)"undefined" != typeof this.extensions[a].unbind && this.extensions[a].unbind(this);
			this.isBound = !1
		}
	}, c.prototype.destroy = function() {
		this.unbind(), this.$scrollContainer.data("ias", null)
	}, c.prototype.on = function(b, c, d) {
		if ("undefined" == typeof this.listeners[b]) throw new Error('There is no event called "' + b + '"');
		return d = d || 0, this.listeners[b].add(a.proxy(c, this), d), this
	}, c.prototype.one = function(a, b) {
		var c = this,
			d = function() {
				c.off(a, b), c.off(a, d)
			};
		return this.on(a, b), this.on(a, d), this
	}, c.prototype.off = function(a, b) {
		if ("undefined" == typeof this.listeners[a]) throw new Error('There is no event called "' + a + '"');
		return this.listeners[a].remove(b), this
	}, c.prototype.next = function() {
		var a = this.nextUrl,
			b = this;
		if (this.pause(), !a) return this.fire("noneLeft", [this.getLastItem()]), this.listeners.noneLeft.disable(), b.resume(), !1;
		var c = this.fire("next", [a]);
		return c.done(function() {
			b.load(a, function(a, c) {
				b.render(c, function() {
					b.nextUrl = b.getNextUrl(a), b.resume()
				})
			})
		}), c.fail(function() {
			b.resume()
		}), !0
	}, c.prototype.extension = function(a) {
		if ("undefined" == typeof a.bind) throw new Error('Extension doesn\'t have required method "bind"');
		return "undefined" != typeof a.initialize && a.initialize(this), this.extensions.push(a), this.reinitialize(), this
	}, a.ias = function() {
		var b = a(window);
		return b.ias.apply(b, arguments)
	}, a.fn.ias = function(b) {
		var d = Array.prototype.slice.call(arguments),
			e = this;
		return this.each(function() {
			var f = a(this),
				g = f.data("ias"),
				h = a.extend({}, a.fn.ias.defaults, f.data(), "object" == typeof b && b);
			if (g || (f.data("ias", g = new c(f, h)), a(document).ready(a.proxy(g.initialize, g))), "string" == typeof b) {
				if ("function" != typeof g[b]) throw new Error('There is no method called "' + b + '"');
				d.shift(), g[b].apply(g, d)
			}
			e = g
		}), e
	}, a.fn.ias.defaults = {
		item: ".item",
		container: ".listing",
		next: ".next",
		pagination: !1,
		delay: 600,
		negativeMargin: 10
	}
}(jQuery);
var IASHistoryExtension = function(a) {
		return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.prevSelector = a.prev, this.prevUrl = null, this.listeners = {
			prev: new IASCallbacks
		}, this.onPageChange = function(a, b, c) {
			if (window.history && window.history.replaceState) {
				var d = history.state;
				history.replaceState(d, document.title, c)
			}
		}, this.onScroll = function(a) {
			var b = this.getScrollThresholdFirstItem();
			this.prevUrl && (a -= this.ias.$scrollContainer.height(), b >= a && this.prev())
		}, this.onReady = function() {
			var a = this.ias.getCurrentScrollOffset(this.ias.$scrollContainer),
				b = this.getScrollThresholdFirstItem();
			a -= this.ias.$scrollContainer.height(), b >= a && this.prev()
		}, this.getPrevUrl = function(a) {
			return a || (a = this.ias.$container), jQuery(this.prevSelector, a).last().attr("href")
		}, this.getScrollThresholdFirstItem = function() {
			var a;
			return a = this.ias.getFirstItem(), 0 === a.length ? -1 : a.offset().top
		}, this.renderBefore = function(a, b) {
			var c = this.ias,
				d = c.getFirstItem(),
				e = 0;
			c.fire("render", [a]), jQuery(a).hide(), d.before(a), jQuery(a).fadeIn(400, function() {
				++e < a.length || (c.fire("rendered", [a]), b && b())
			})
		}, this
	};
IASHistoryExtension.prototype.initialize = function(a) {
	var b = this;
	this.ias = a, jQuery.extend(a.listeners, this.listeners), a.prev = function() {
		return b.prev()
	}, this.prevUrl = this.getPrevUrl()
}, IASHistoryExtension.prototype.bind = function(a) {
	a.on("pageChange", jQuery.proxy(this.onPageChange, this)), a.on("scroll", jQuery.proxy(this.onScroll, this)), a.on("ready", jQuery.proxy(this.onReady, this))
}, IASHistoryExtension.prototype.unbind = function(a) {
	a.off("pageChange", this.onPageChange), a.off("scroll", this.onScroll), a.off("ready", this.onReady)
}, IASHistoryExtension.prototype.prev = function() {
	var a = this.prevUrl,
		b = this,
		c = this.ias;
	if (!a) return !1;
	c.pause();
	var d = c.fire("prev", [a]);
	return d.done(function() {
		c.load(a, function(a, d) {
			b.renderBefore(d, function() {
				b.prevUrl = b.getPrevUrl(a), c.resume(), b.prevUrl && b.prev()
			})
		})
	}), d.fail(function() {
		c.resume()
	}), !0
}, IASHistoryExtension.prototype.defaults = {
	prev: ".prev"
};
var IASNoneLeftExtension = function(a) {
		return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.uid = (new Date).getTime(), this.html = a.html.replace("{text}", a.text), this.showNoneLeft = function() {
			var a = jQuery(this.html).attr("id", "ias_noneleft_" + this.uid),
				b = this.ias.getLastItem();
			b.after(a), a.fadeIn()
		}, this
	};
IASNoneLeftExtension.prototype.bind = function(a) {
	this.ias = a, a.on("noneLeft", jQuery.proxy(this.showNoneLeft, this))
}, IASNoneLeftExtension.prototype.unbind = function(a) {
	a.off("noneLeft", this.showNoneLeft)
}, IASNoneLeftExtension.prototype.defaults = {
	text: "You reached the end.",
	html: '<div class="get-mod-more js-get-mod-more-list transition" style="text-align: center;">{text}</div>'
};
var IASPagingExtension = function() {
		return this.ias = null, this.pagebreaks = [
			[0, document.location.toString()]
		], this.lastPageNum = 1, this.enabled = !0, this.listeners = {
			pageChange: new IASCallbacks
		}, this.onScroll = function(a) {
			if (this.enabled) {
				var b, c = this.ias,
					d = this.getCurrentPageNum(a),
					e = this.getCurrentPagebreak(a);
				this.lastPageNum !== d && (b = e[1], c.fire("pageChange", [d, a, b])), this.lastPageNum = d
			}
		}, this.onNext = function(a) {
			var b = this.ias.getCurrentScrollOffset(this.ias.$scrollContainer);
			this.pagebreaks.push([b, a]);
			var c = this.getCurrentPageNum(b) + 1;
			this.ias.fire("pageChange", [c, b, a]), this.lastPageNum = c
		}, this.onPrev = function(a) {
			var b = this,
				c = b.ias,
				d = c.getCurrentScrollOffset(c.$scrollContainer),
				e = d - c.$scrollContainer.height(),
				f = c.getFirstItem();
			this.enabled = !1, this.pagebreaks.unshift([0, a]), c.one("rendered", function() {
				for (var d = 1, g = b.pagebreaks.length; g > d; d++) b.pagebreaks[d][0] = b.pagebreaks[d][0] + f.offset().top;
				var h = b.getCurrentPageNum(e) + 1;
				c.fire("pageChange", [h, e, a]), b.lastPageNum = h, b.enabled = !0
			})
		}, this
	};
IASPagingExtension.prototype.initialize = function(a) {
	this.ias = a, jQuery.extend(a.listeners, this.listeners)
}, IASPagingExtension.prototype.bind = function(a) {
	try {
		a.on("prev", jQuery.proxy(this.onPrev, this), this.priority)
	} catch (b) {}
	a.on("next", jQuery.proxy(this.onNext, this), this.priority), a.on("scroll", jQuery.proxy(this.onScroll, this), this.priority)
}, IASPagingExtension.prototype.unbind = function(a) {
	try {
		a.off("prev", this.onPrev)
	} catch (b) {}
	a.off("next", this.onNext), a.off("scroll", this.onScroll)
}, IASPagingExtension.prototype.getCurrentPageNum = function(a) {
	for (var b = this.pagebreaks.length - 1; b > 0; b--) if (a > this.pagebreaks[b][0]) return b + 1;
	return 1
}, IASPagingExtension.prototype.getCurrentPagebreak = function(a) {
	for (var b = this.pagebreaks.length - 1; b >= 0; b--) if (a > this.pagebreaks[b][0]) return this.pagebreaks[b];
	return null
}, IASPagingExtension.prototype.priority = 500;
var IASSpinnerExtension = function(a) {
		return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.uid = (new Date).getTime(), this.src = a.src, this.html = a.html.replace("{src}", this.src), this.showSpinner = function() {
			var a = this.getSpinner() || this.createSpinner(),
				b = this.ias.getLastItem();
			b.after(a), a.fadeIn()
		}, this.showSpinnerBefore = function() {
			var a = this.getSpinner() || this.createSpinner(),
				b = this.ias.getFirstItem();
			b.before(a), a.fadeIn()
		}, this.removeSpinner = function() {
			this.hasSpinner() && this.getSpinner().remove()
		}, this.getSpinner = function() {
			var a = jQuery("#ias_spinner_" + this.uid);
			return a.length > 0 ? a : !1
		}, this.hasSpinner = function() {
			var a = jQuery("#ias_spinner_" + this.uid);
			return a.length > 0
		}, this.createSpinner = function() {
			var a = jQuery(this.html).attr("id", "ias_spinner_" + this.uid);
			return a.hide(), a
		}, this
	};
IASSpinnerExtension.prototype.bind = function(a) {
	this.ias = a, a.on("next", jQuery.proxy(this.showSpinner, this)), a.on("render", jQuery.proxy(this.removeSpinner, this));
	try {
		a.on("prev", jQuery.proxy(this.showSpinnerBefore, this))
	} catch (b) {}
}, IASSpinnerExtension.prototype.unbind = function(a) {
	a.off("next", this.showSpinner), a.off("render", this.removeSpinner);
	try {
		a.off("prev", this.showSpinnerBefore)
	} catch (b) {}
}, IASSpinnerExtension.prototype.defaults = {
	src: "data:image/gif;base64,R0lGODlhZAAUAKUkAJCapZCbpZGbppOdp5agqpahqZqjrZ2nr6GqsqOstaSttaiwuKqzuq62vrC4vrK6wLa9w7zDycDGzMbM0crP08rP1M3S1s7T19HV2dLW2tTY3Njb39/i5ODj5eLl5+Ll6Obo6unr7ers7uzv8P///////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJDQA/ACwAAAAAZAAUAAAG4cCfcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter9MkMcDLns9h4DaoDG7rxy1XG05jj4i5T2f3C/9fXh6gk4Gc3IDRhdyEUiLao1HjwGRkoyOl5aQTXGHcnVDI4cdRqJzpEWmcqipo6WuradMGJ5yE0QZh7dFuXO7uLpHvbZGw2q/Q8YByEgbtWoURB+HF0bTc9VF13LZ2tTW397YTQPPIUUNcgpI6WrrR+0B7/Dq7PX07k4TtRDCExVKMvwLOJAgwCQCDyJJCEXCoQdvIlYZMaEiCIkYM2rcyLGjx48gQz4JAgAh+QQJDQA/ACwAAAAAZAAUAAAG+sCfcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter9ZkMcDLk9HnhDScwi4DRqznAlxBxajIsfOtxxHHyJKgIKDgYaFSIRQD3wBCEUGjm4DRhd2EUiXbpmamJ6coAGdTCCTAXFCe6cBfkMjjh1GsHyys7G3tbl2tksYpxNDv6zBQxmOxUTHfMnKyEbLds1C0W7TSKuOFEMbrAHbQx+OF0bifOTl4+nn63boTG18A3lDA6xqRA12Ckj6bvz99gX8NzAAwCYeCNgZkGrIhFMQjmSYUEHJxIoWKWbEiOSilAkg6RWR4OjBnJNVRoCcAAKly5cwY8qcSbOmzZtCggAAIfkECQ0APwAsAAAAAGQAFAAABv7An3BILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/YCPI4wmboyNPCOk5BN4Gzdk8+oiSkHdgMSpy9IAWR3V3SoSGdoiFTxd6EUcPgAEIRQaSbwNGjW+PSJsBnZqOnqNOI5IdRSCXAXJCf6wBgkOngKlGtXq3RLlvu7SoThmSE0UYrMVCx7HJQsOAzUTP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",
	html: '<div class="ias-spinner" style="text-align: center;"><p class="get-mod-more js-get-mod-more-list transition">正在拼命加载...</p></div>'
};
var IASTriggerExtension = function(a) {
		return a = jQuery.extend({}, this.defaults, a), this.ias = null, this.html = a.html.replace("{text}", a.text), this.htmlPrev = a.htmlPrev.replace("{text}", a.textPrev), this.enabled = !0, this.count = 0, this.offset = a.offset, this.$triggerNext = null, this.$triggerPrev = null, this.showTriggerNext = function() {
			if (!this.enabled) return !0;
			if (!1 === this.offset || ++this.count < this.offset) return !0;
			var a = this.$triggerNext || (this.$triggerNext = this.createTrigger(this.next, this.html)),
				b = this.ias.getLastItem();
			return b.after(a), a.fadeIn(), !1
		}, this.showTriggerPrev = function() {
			if (!this.enabled) return !0;
			var a = this.$triggerPrev || (this.$triggerPrev = this.createTrigger(this.prev, this.htmlPrev)),
				b = this.ias.getFirstItem();
			return b.before(a), a.fadeIn(), !1
		}, this.onRendered = function() {
			this.enabled = !0
		}, this.createTrigger = function(a, b) {
			var c, d = (new Date).getTime();
			return b = b || this.html, c = jQuery(b).attr("id", "ias_trigger_" + d), c.hide(), c.on("click", jQuery.proxy(a, this)), c
		}, this
	};
IASTriggerExtension.prototype.bind = function(a) {
	this.ias = a, a.on("next", jQuery.proxy(this.showTriggerNext, this), this.priority), a.on("rendered", jQuery.proxy(this.onRendered, this), this.priority);
	try {
		a.on("prev", jQuery.proxy(this.showTriggerPrev, this), this.priority)
	} catch (b) {}
}, IASTriggerExtension.prototype.unbind = function(a) {
	a.off("next", this.showTriggerNext), a.off("rendered", this.onRendered);
	try {
		a.off("prev", this.showTriggerPrev)
	} catch (b) {}
}, IASTriggerExtension.prototype.next = function() {
	this.enabled = !1, this.ias.pause(), this.$triggerNext && (this.$triggerNext.remove(), this.$triggerNext = null), this.ias.next()
}, IASTriggerExtension.prototype.prev = function() {
	this.enabled = !1, this.ias.pause(), this.$triggerPrev && (this.$triggerPrev.remove(), this.$triggerPrev = null), this.ias.prev()
}, IASTriggerExtension.prototype.defaults = {
	text: "Load more items",
	html: '<div class="get-mod-more js-get-mod-more-list transition"><a>{text}</a></div>',
	textPrev: "Load previous items",
	htmlPrev: '<div class="ias-trigger ias-trigger-prev"><a>{text}</a></div>',
	offset: 0
}, IASTriggerExtension.prototype.priority = 1e3;