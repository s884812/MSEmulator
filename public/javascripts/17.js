(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[17],{

/***/ "./src/game/Renderer/ChatBalloon.js":
/*!******************************************!*\
  !*** ./src/game/Renderer/ChatBalloon.js ***!
  \******************************************/
/*! exports provided: ChatBalloon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ChatBalloon\", function() { return ChatBalloon; });\n/* harmony import */ var _IRenderer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../IRenderer.js */ \"./src/game/IRenderer.js\");\n/* harmony import */ var _Sprite_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Sprite.js */ \"./src/game/Sprite.js\");\n﻿\r\n\r\n\r\n\r\n\r\nclass ChatBalloon {\r\n\tconstructor() {\r\n\t\tthis._raw = null;\r\n\t\tthis.style = null;\r\n\t}\r\n\r\n\t/**\r\n\t * @param {any} style\r\n\t */\r\n\tasync load(style) {\r\n\t\tif (style == null) {\r\n\t\t\tthrow new TypeError();\r\n\t\t}\r\n\t\tif (ChatBalloon.cache[style]) {\r\n\t\t\tlet cb = ChatBalloon.cache[style];\r\n\t\t\tObject.assign(this, cb);\r\n\t\t}\r\n\t\telse {\r\n\t\t\tconst path = [this._base_path, style].join(\"/\");\r\n\r\n\t\t\tthis.style = style;\r\n\t\t\t\r\n\t\t\tlet promise = $get.data(path);\r\n\t\t\tChatBalloon.cache[style] = this;\r\n\t\t\tthis.$promise = promise;\r\n\t\t\t\r\n\t\t\tObject.defineProperty(this, \"_raw\", {\r\n\t\t\t\tvalue: await promise,\r\n\t\t\t});\r\n\t\t\tdelete this.$promise;\r\n\r\n\t\t\tconst argb = Number(\"clr\" in this._raw ? this._raw.clr : defCol);\r\n\t\t\tconst rgba = (((argb & 0xFF000000) >>> 24) | ((argb & 0x00FFFFFF) << 8)) >>> 0;\r\n\t\t\tconst str_rgba = rgba.toString(16).padStart(8, \"0\");\r\n\t\t\tthis.color = (this._raw.clr == -1 || !this._raw.clr) ? (\"white\") : (\"#\" + str_rgba);\r\n\r\n\t\t\tthis.nw = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.nw);\r\n\t\t\t//this.nw._url = path + \"/nw\";\r\n\r\n\t\t\tthis.n = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.n);\r\n\t\t\t//this.n._url = path + \"/n\";\r\n\r\n\t\t\tthis.ne = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.ne);\r\n\t\t\t//this.ne._url = path + \"/ne\";\r\n\r\n\t\t\tthis.w = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.w);\r\n\t\t\t//this.w._url = path + \"/w\";\r\n\r\n\t\t\tthis.c = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.c);\r\n\t\t\t//this.c._url = path + \"/c\";\r\n\r\n\t\t\tthis.e = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.e);\r\n\t\t\t//this.e._url = path + \"/e\";\r\n\r\n\t\t\tthis.sw = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.sw);\r\n\t\t\t//this.sw._url = path + \"/sw\";\r\n\r\n\t\t\tthis.s = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.s);\r\n\t\t\t//this.s._url = path + \"/s\";\r\n\r\n\t\t\tthis.se = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.se);\r\n\t\t\t//this.se._url = path + \"/se\";\r\n\r\n\t\t\tthis.arrow = new _Sprite_js__WEBPACK_IMPORTED_MODULE_1__[\"Sprite\"](this._raw.arrow);\r\n\t\t\t//this.arrow._url = path + \"/arrow\";\r\n\r\n\t\t\t//this._pat_c = ctx.createPattern(this.c, \"repeat\");\r\n\t\t}\r\n\t}\r\n\t\r\n\t/*\r\n\t1 12345 12345 1 : 5\r\n\t2 12345 12345 12345\r\n\t3 12345 12345 12345\r\n\t4 12345 12345 12345\r\n\t5 12345 12345 12345\r\n\t6 xxx12 34512 34\r\n\t */\r\n\r\n\t/**\r\n\t * @param {IRenderer} renderer\r\n\t * @param {string} text - length = chat.value.length + \" : \".length + name.length = 70 + 3 + name.length\r\n\t * @param {number} x - chat balloon arrow bottom pos.x\r\n\t * @param {number} y - chat balloon arrow bottom pos.y\r\n\t */\r\n\tdraw(renderer, text, x, y) {\r\n\t\tlet lines = text.match(/(.{1,12})/g);\r\n\t\tif (!lines.length) {\r\n\t\t\treturn;\r\n\t\t}\r\n\r\n\t\tconst ctx = renderer.ctx;\r\n\t\tconst LINE_HEIGHT = this.c.height;// = fontSize(12) + PADDING_TOP(2)\r\n\t\tconst PADDING_LEFT = 0, PADDING_TOP = 0, PADDING_RIGHT = 0, PADDING_BOTTOM = 0;\r\n\r\n\t\tctx.fillStyle = this.color;\r\n\t\tctx.font = \"12px 微軟正黑體\";//新細明體\r\n\t\tctx.textAlign = \"center\";\r\n\t\tctx.textBaseline = \"hanging\";//top\r\n\t\t\r\n\t\tconst min_width = this.n.width * 3;\r\n\t\tlet _tw = Math.max.apply(null, lines.map(line => ctx.measureText(line).width + PADDING_LEFT + PADDING_RIGHT));\r\n\t\tif (_tw < min_width) {\r\n\t\t\t_tw = min_width;\r\n\t\t}\r\n\t\tconst hw = Math.trunc((_tw / 2) / this.n.width) * this.n.width;\r\n\t\tconst tw = hw * 2;\r\n\t\tconst th = lines.length * LINE_HEIGHT + PADDING_TOP + PADDING_BOTTOM;\r\n\t\r\n\t\tx = (x - hw);\r\n\t\ty = (y - th) - this.arrow.height;\r\n\r\n\t\t{//top\r\n\t\t\tthis.nw.draw2(x, y);\r\n\t\t\tthis.n._drawPattern(x, y, tw, this.n.height);\r\n\t\t\tthis.ne.draw2(x + tw, y);\r\n\t\t}\r\n\t\t{//center\r\n\t\t\tconst xw = this.w.width - this.w.x;\r\n\r\n\t\t\tthis.w._drawPattern(x + xw, y, this.w.width, th);\r\n\t\t\tthis.c._drawPattern(x + xw, y, tw, th);\r\n\t\t\tthis.e._drawPattern(x + xw + tw, y, this.e.width, th);\r\n\t\t}\r\n\t\t{//bottom\r\n\t\t\tconst r_adj = this.arrow.width & 1;\r\n\t\t\tconst arrow_hw = Math.trunc(this.arrow.width / 2);\r\n\t\t\tconst hw_arrow_hw = hw - arrow_hw;\r\n\t\t\r\n\t\t\tthis.sw.draw2(x, y + th);\r\n\t\t\tthis.s._drawPattern(x, y + th, hw_arrow_hw, this.s.height);//clip\r\n\t\t\tthis.s._drawPattern(x + hw + arrow_hw + r_adj, y + th, hw_arrow_hw - r_adj, this.s.height);//clip\r\n\t\t\tthis.se.draw2(x + tw, y + th);\r\n\r\n\t\t\tthis.arrow.draw2(x - arrow_hw + hw, y + th);\r\n\t\t}\r\n\r\n\t\tfor (let i = 0, cy = y; i < lines.length; ++i, cy += LINE_HEIGHT) {\r\n\t\t\tlet line = lines[i];\r\n\r\n\t\t\t//if (this.constructor.DEBUG) {\r\n\t\t\t//\tctx.beginPath();\r\n\t\t\t//\tctx.strokeStyle = \"red\";\r\n\t\t\t//\tctx.strokeRect(x + PADDING_LEFT, cy + PADDING_TOP, tw, LINE_HEIGHT);\r\n\t\t\t//}\r\n\t\t\t//ctx.fillStyle = \"black\";\r\n\r\n\t\t\tctx.fillText(line, x + hw + PADDING_LEFT, cy + PADDING_TOP);\r\n\t\t}\r\n\t}\r\n\r\n\tget _base_path() {\r\n\t\treturn \"/UI/ChatBalloon\";\r\n\t}\r\n\r\n\t//static get DEBUG() {\r\n\t//\treturn false;\r\n\t//}\r\n}\r\n\r\n/** @type {{[style:number]:ChatBalloon}} */\r\nChatBalloon.cache = window.$images_ChatBalloon || {};\r\n\r\nwindow.$images_ChatBalloon = ChatBalloon.cache;\r\n\r\nif (true) {\r\n\tObject.values(ChatBalloon.cache).forEach(a => {\r\n\t\ta.__proto__ = ChatBalloon.prototype;\r\n\t\t//a.load(a.style);\r\n\t});\r\n\tmodule.hot.accept();\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZ2FtZS9SZW5kZXJlci9DaGF0QmFsbG9vbi5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9nYW1lL1JlbmRlcmVyL0NoYXRCYWxsb29uLmpzPzk4MDgiXSwic291cmNlc0NvbnRlbnQiOlsi77u/XHJcbmltcG9ydCB7IElSZW5kZXJlciB9IGZyb20gJy4uL0lSZW5kZXJlci5qcyc7XHJcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4uL1Nwcml0ZS5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRCYWxsb29uIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuX3JhdyA9IG51bGw7XHJcblx0XHR0aGlzLnN0eWxlID0gbnVsbDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7YW55fSBzdHlsZVxyXG5cdCAqL1xyXG5cdGFzeW5jIGxvYWQoc3R5bGUpIHtcclxuXHRcdGlmIChzdHlsZSA9PSBudWxsKSB7XHJcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuXHRcdH1cclxuXHRcdGlmIChDaGF0QmFsbG9vbi5jYWNoZVtzdHlsZV0pIHtcclxuXHRcdFx0bGV0IGNiID0gQ2hhdEJhbGxvb24uY2FjaGVbc3R5bGVdO1xyXG5cdFx0XHRPYmplY3QuYXNzaWduKHRoaXMsIGNiKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zdCBwYXRoID0gW3RoaXMuX2Jhc2VfcGF0aCwgc3R5bGVdLmpvaW4oXCIvXCIpO1xyXG5cclxuXHRcdFx0dGhpcy5zdHlsZSA9IHN0eWxlO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHByb21pc2UgPSAkZ2V0LmRhdGEocGF0aCk7XHJcblx0XHRcdENoYXRCYWxsb29uLmNhY2hlW3N0eWxlXSA9IHRoaXM7XHJcblx0XHRcdHRoaXMuJHByb21pc2UgPSBwcm9taXNlO1xyXG5cdFx0XHRcclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiX3Jhd1wiLCB7XHJcblx0XHRcdFx0dmFsdWU6IGF3YWl0IHByb21pc2UsXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkZWxldGUgdGhpcy4kcHJvbWlzZTtcclxuXHJcblx0XHRcdGNvbnN0IGFyZ2IgPSBOdW1iZXIoXCJjbHJcIiBpbiB0aGlzLl9yYXcgPyB0aGlzLl9yYXcuY2xyIDogZGVmQ29sKTtcclxuXHRcdFx0Y29uc3QgcmdiYSA9ICgoKGFyZ2IgJiAweEZGMDAwMDAwKSA+Pj4gMjQpIHwgKChhcmdiICYgMHgwMEZGRkZGRikgPDwgOCkpID4+PiAwO1xyXG5cdFx0XHRjb25zdCBzdHJfcmdiYSA9IHJnYmEudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDgsIFwiMFwiKTtcclxuXHRcdFx0dGhpcy5jb2xvciA9ICh0aGlzLl9yYXcuY2xyID09IC0xIHx8ICF0aGlzLl9yYXcuY2xyKSA/IChcIndoaXRlXCIpIDogKFwiI1wiICsgc3RyX3JnYmEpO1xyXG5cclxuXHRcdFx0dGhpcy5udyA9IG5ldyBTcHJpdGUodGhpcy5fcmF3Lm53KTtcclxuXHRcdFx0Ly90aGlzLm53Ll91cmwgPSBwYXRoICsgXCIvbndcIjtcclxuXHJcblx0XHRcdHRoaXMubiA9IG5ldyBTcHJpdGUodGhpcy5fcmF3Lm4pO1xyXG5cdFx0XHQvL3RoaXMubi5fdXJsID0gcGF0aCArIFwiL25cIjtcclxuXHJcblx0XHRcdHRoaXMubmUgPSBuZXcgU3ByaXRlKHRoaXMuX3Jhdy5uZSk7XHJcblx0XHRcdC8vdGhpcy5uZS5fdXJsID0gcGF0aCArIFwiL25lXCI7XHJcblxyXG5cdFx0XHR0aGlzLncgPSBuZXcgU3ByaXRlKHRoaXMuX3Jhdy53KTtcclxuXHRcdFx0Ly90aGlzLncuX3VybCA9IHBhdGggKyBcIi93XCI7XHJcblxyXG5cdFx0XHR0aGlzLmMgPSBuZXcgU3ByaXRlKHRoaXMuX3Jhdy5jKTtcclxuXHRcdFx0Ly90aGlzLmMuX3VybCA9IHBhdGggKyBcIi9jXCI7XHJcblxyXG5cdFx0XHR0aGlzLmUgPSBuZXcgU3ByaXRlKHRoaXMuX3Jhdy5lKTtcclxuXHRcdFx0Ly90aGlzLmUuX3VybCA9IHBhdGggKyBcIi9lXCI7XHJcblxyXG5cdFx0XHR0aGlzLnN3ID0gbmV3IFNwcml0ZSh0aGlzLl9yYXcuc3cpO1xyXG5cdFx0XHQvL3RoaXMuc3cuX3VybCA9IHBhdGggKyBcIi9zd1wiO1xyXG5cclxuXHRcdFx0dGhpcy5zID0gbmV3IFNwcml0ZSh0aGlzLl9yYXcucyk7XHJcblx0XHRcdC8vdGhpcy5zLl91cmwgPSBwYXRoICsgXCIvc1wiO1xyXG5cclxuXHRcdFx0dGhpcy5zZSA9IG5ldyBTcHJpdGUodGhpcy5fcmF3LnNlKTtcclxuXHRcdFx0Ly90aGlzLnNlLl91cmwgPSBwYXRoICsgXCIvc2VcIjtcclxuXHJcblx0XHRcdHRoaXMuYXJyb3cgPSBuZXcgU3ByaXRlKHRoaXMuX3Jhdy5hcnJvdyk7XHJcblx0XHRcdC8vdGhpcy5hcnJvdy5fdXJsID0gcGF0aCArIFwiL2Fycm93XCI7XHJcblxyXG5cdFx0XHQvL3RoaXMuX3BhdF9jID0gY3R4LmNyZWF0ZVBhdHRlcm4odGhpcy5jLCBcInJlcGVhdFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0LypcclxuXHQxIDEyMzQ1IDEyMzQ1IDEgOiA1XHJcblx0MiAxMjM0NSAxMjM0NSAxMjM0NVxyXG5cdDMgMTIzNDUgMTIzNDUgMTIzNDVcclxuXHQ0IDEyMzQ1IDEyMzQ1IDEyMzQ1XHJcblx0NSAxMjM0NSAxMjM0NSAxMjM0NVxyXG5cdDYgeHh4MTIgMzQ1MTIgMzRcclxuXHQgKi9cclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtJUmVuZGVyZXJ9IHJlbmRlcmVyXHJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBsZW5ndGggPSBjaGF0LnZhbHVlLmxlbmd0aCArIFwiIDogXCIubGVuZ3RoICsgbmFtZS5sZW5ndGggPSA3MCArIDMgKyBuYW1lLmxlbmd0aFxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gY2hhdCBiYWxsb29uIGFycm93IGJvdHRvbSBwb3MueFxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gY2hhdCBiYWxsb29uIGFycm93IGJvdHRvbSBwb3MueVxyXG5cdCAqL1xyXG5cdGRyYXcocmVuZGVyZXIsIHRleHQsIHgsIHkpIHtcclxuXHRcdGxldCBsaW5lcyA9IHRleHQubWF0Y2goLyguezEsMTJ9KS9nKTtcclxuXHRcdGlmICghbGluZXMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjdHggPSByZW5kZXJlci5jdHg7XHJcblx0XHRjb25zdCBMSU5FX0hFSUdIVCA9IHRoaXMuYy5oZWlnaHQ7Ly8gPSBmb250U2l6ZSgxMikgKyBQQURESU5HX1RPUCgyKVxyXG5cdFx0Y29uc3QgUEFERElOR19MRUZUID0gMCwgUEFERElOR19UT1AgPSAwLCBQQURESU5HX1JJR0hUID0gMCwgUEFERElOR19CT1RUT00gPSAwO1xyXG5cclxuXHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG5cdFx0Y3R4LmZvbnQgPSBcIjEycHgg5b6u6Luf5q2j6buR6auUXCI7Ly/mlrDntLDmmI7pq5RcclxuXHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwiaGFuZ2luZ1wiOy8vdG9wXHJcblx0XHRcclxuXHRcdGNvbnN0IG1pbl93aWR0aCA9IHRoaXMubi53aWR0aCAqIDM7XHJcblx0XHRsZXQgX3R3ID0gTWF0aC5tYXguYXBwbHkobnVsbCwgbGluZXMubWFwKGxpbmUgPT4gY3R4Lm1lYXN1cmVUZXh0KGxpbmUpLndpZHRoICsgUEFERElOR19MRUZUICsgUEFERElOR19SSUdIVCkpO1xyXG5cdFx0aWYgKF90dyA8IG1pbl93aWR0aCkge1xyXG5cdFx0XHRfdHcgPSBtaW5fd2lkdGg7XHJcblx0XHR9XHJcblx0XHRjb25zdCBodyA9IE1hdGgudHJ1bmMoKF90dyAvIDIpIC8gdGhpcy5uLndpZHRoKSAqIHRoaXMubi53aWR0aDtcclxuXHRcdGNvbnN0IHR3ID0gaHcgKiAyO1xyXG5cdFx0Y29uc3QgdGggPSBsaW5lcy5sZW5ndGggKiBMSU5FX0hFSUdIVCArIFBBRERJTkdfVE9QICsgUEFERElOR19CT1RUT007XHJcblx0XHJcblx0XHR4ID0gKHggLSBodyk7XHJcblx0XHR5ID0gKHkgLSB0aCkgLSB0aGlzLmFycm93LmhlaWdodDtcclxuXHJcblx0XHR7Ly90b3BcclxuXHRcdFx0dGhpcy5udy5kcmF3Mih4LCB5KTtcclxuXHRcdFx0dGhpcy5uLl9kcmF3UGF0dGVybih4LCB5LCB0dywgdGhpcy5uLmhlaWdodCk7XHJcblx0XHRcdHRoaXMubmUuZHJhdzIoeCArIHR3LCB5KTtcclxuXHRcdH1cclxuXHRcdHsvL2NlbnRlclxyXG5cdFx0XHRjb25zdCB4dyA9IHRoaXMudy53aWR0aCAtIHRoaXMudy54O1xyXG5cclxuXHRcdFx0dGhpcy53Ll9kcmF3UGF0dGVybih4ICsgeHcsIHksIHRoaXMudy53aWR0aCwgdGgpO1xyXG5cdFx0XHR0aGlzLmMuX2RyYXdQYXR0ZXJuKHggKyB4dywgeSwgdHcsIHRoKTtcclxuXHRcdFx0dGhpcy5lLl9kcmF3UGF0dGVybih4ICsgeHcgKyB0dywgeSwgdGhpcy5lLndpZHRoLCB0aCk7XHJcblx0XHR9XHJcblx0XHR7Ly9ib3R0b21cclxuXHRcdFx0Y29uc3Qgcl9hZGogPSB0aGlzLmFycm93LndpZHRoICYgMTtcclxuXHRcdFx0Y29uc3QgYXJyb3dfaHcgPSBNYXRoLnRydW5jKHRoaXMuYXJyb3cud2lkdGggLyAyKTtcclxuXHRcdFx0Y29uc3QgaHdfYXJyb3dfaHcgPSBodyAtIGFycm93X2h3O1xyXG5cdFx0XHJcblx0XHRcdHRoaXMuc3cuZHJhdzIoeCwgeSArIHRoKTtcclxuXHRcdFx0dGhpcy5zLl9kcmF3UGF0dGVybih4LCB5ICsgdGgsIGh3X2Fycm93X2h3LCB0aGlzLnMuaGVpZ2h0KTsvL2NsaXBcclxuXHRcdFx0dGhpcy5zLl9kcmF3UGF0dGVybih4ICsgaHcgKyBhcnJvd19odyArIHJfYWRqLCB5ICsgdGgsIGh3X2Fycm93X2h3IC0gcl9hZGosIHRoaXMucy5oZWlnaHQpOy8vY2xpcFxyXG5cdFx0XHR0aGlzLnNlLmRyYXcyKHggKyB0dywgeSArIHRoKTtcclxuXHJcblx0XHRcdHRoaXMuYXJyb3cuZHJhdzIoeCAtIGFycm93X2h3ICsgaHcsIHkgKyB0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGN5ID0geTsgaSA8IGxpbmVzLmxlbmd0aDsgKytpLCBjeSArPSBMSU5FX0hFSUdIVCkge1xyXG5cdFx0XHRsZXQgbGluZSA9IGxpbmVzW2ldO1xyXG5cclxuXHRcdFx0Ly9pZiAodGhpcy5jb25zdHJ1Y3Rvci5ERUJVRykge1xyXG5cdFx0XHQvL1x0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHQvL1x0Y3R4LnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuXHRcdFx0Ly9cdGN0eC5zdHJva2VSZWN0KHggKyBQQURESU5HX0xFRlQsIGN5ICsgUEFERElOR19UT1AsIHR3LCBMSU5FX0hFSUdIVCk7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHQvL2N0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblxyXG5cdFx0XHRjdHguZmlsbFRleHQobGluZSwgeCArIGh3ICsgUEFERElOR19MRUZULCBjeSArIFBBRERJTkdfVE9QKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGdldCBfYmFzZV9wYXRoKCkge1xyXG5cdFx0cmV0dXJuIFwiL1VJL0NoYXRCYWxsb29uXCI7XHJcblx0fVxyXG5cclxuXHQvL3N0YXRpYyBnZXQgREVCVUcoKSB7XHJcblx0Ly9cdHJldHVybiBmYWxzZTtcclxuXHQvL31cclxufVxyXG5cclxuLyoqIEB0eXBlIHt7W3N0eWxlOm51bWJlcl06Q2hhdEJhbGxvb259fSAqL1xyXG5DaGF0QmFsbG9vbi5jYWNoZSA9IHdpbmRvdy4kaW1hZ2VzX0NoYXRCYWxsb29uIHx8IHt9O1xyXG5cclxud2luZG93LiRpbWFnZXNfQ2hhdEJhbGxvb24gPSBDaGF0QmFsbG9vbi5jYWNoZTtcclxuXHJcbmlmIChtb2R1bGUuaG90KSB7XHJcblx0T2JqZWN0LnZhbHVlcyhDaGF0QmFsbG9vbi5jYWNoZSkuZm9yRWFjaChhID0+IHtcclxuXHRcdGEuX19wcm90b19fID0gQ2hhdEJhbGxvb24ucHJvdG90eXBlO1xyXG5cdFx0Ly9hLmxvYWQoYS5zdHlsZSk7XHJcblx0fSk7XHJcblx0bW9kdWxlLmhvdC5hY2NlcHQoKTtcclxufVxyXG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/game/Renderer/ChatBalloon.js\n");

/***/ })

}]);