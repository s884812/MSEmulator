(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{334:function(t,e,r){"use strict";r.r(e),r.d(e,"AnimationBase",function(){return h}),r.d(e,"Animation",function(){return a});r(333),r(332);var i=r(349);window.m_draw_animation_texture_info=!1;class s{constructor(t,e){this._raw=t,this._url=e,this.frame=0,this.time=0,this.delta=0,this.textures=[],this.is_loop=!0,this.is_end=!1,this._url}getTotalTime(){return this.textures.reduce((t,e)=>t+e.delay,0)}clone(){let t=new this.constructor(this._raw,this._url);return t.textures=this.textures,t}load(){throw new Error("Not implement")}update(t){throw new Error("Not implement")}_resetFrame(){this.frame=0,this.time=0}reset(){this.frame=0,this.time=0,this.is_end=!1}get texture(){throw new Error("Not implement")}destroy(){this.is_loop=!1,this.is_end=!0}}class h extends s{constructor(t,e){super(t,e)}async load(){for(let t=0;t in this._raw;++t){let e=this._url+"/"+t,r=new i.a(this._raw[t]);r._url=e,this.textures[t]=r}this.textures[0]&&(this.textures[0].isLoaded()||this.textures[0].__loadTexture())}isEnd(){return this.is_end}_update(t){const e=this.textures.length;e>0&&(this.time=this.time+t,this.time>this.texture.delay&&(this.frame=++this.frame%e,this.time=0)),this.delta+=t}update(t){const e=this.textures.length;if(e>0&&(this.time=this.time+t,this.time>this.texture.delay)){if(this.frame=this.frame+1,this.frame>=e){if(!this.is_loop)return this.frame=e-1,void(this.is_end=!0);this.reset()}this.time=0}this.delta+=t}draw(t,e,r,i,s){let h=this.texture;t.drawRotaGraph(h,e,r,i,s)}get texture(){return this.textures[this.frame]}}class a extends h{constructor(t,e){super(t,e),this.draw=this._draw_and_preload}_draw_and_preload(t,e,r,i,s){let h;for(h=this.frame;h>=0;--h){let a=this.textures[h];if(a.isLoaded()){t.drawRotaGraph(a,e,r,i,s);break}}let a=this.textures[++h];a?a.isLoaded()||a.__loadTexture():delete this.draw}}},349:function(t,e,r){"use strict";r.d(e,"b",function(){return h}),r.d(e,"a",function(){return a});var i=r(333),s=(r(332),r(335));class h extends s.Graph{constructor(t,e){t?(super(e,{width:t.__w,height:t.__h}),this._raw=t,e?this._url=e:!1!==h.isTexture(t)&&(this._url=t[""])):super()}static isTexture(t){if(t)if(t.hasOwnProperty("")){if("string"==typeof t[""])return!0}else if(!t.__isEmpty)throw console.group("no texture"),console.warn(t),console.groupEnd(),new Error("no texture");return!1}static isTextureHasData(t){return t&&"string"==typeof t[""]&&t[""].startsWith("data:image/")}set z(t){this._order=t}get z(){return this._order}_get(t,e,r){if(this._raw){if(e in this._raw)return r(this._raw[e])}else;return t}draw(){this._engine.drawGraph(this)}draw2(t,e){this._engine.drawGraph2(this,t-this.x,e-this.y)}draw2i(t,e){this._engine.drawGraph2(this,Math.trunc(t-this.x+.5),Math.trunc(e-this.y+.5))}}class a extends h{constructor(t,e){super(t,e);var r=this._get(new i.Vec2(0,0),"origin",i.Vec2.get);this.x=r.x,this.y=r.y,this.z=this._get(0,"z",Number),this.delay=this._get(100,"delay",Number)}drawPattern(t,e,r,i){if(!this.isLoaded())return;const s=this._engine.ctx;s.save();try{s.rect(t,e,r,i),s.clip();let h=t,a=t+r,n=e+i;for(let t=e;t<n;t+=this.height)for(let e=h;e<a;e+=this.width)this.draw2(e,t)}catch(t){console.error(t)}s.restore()}drawHorizontalPattern(t,e,r){if(!this.isLoaded())return;const i=this._engine.ctx;i.save();try{const i=t+r;for(let r=t;r<i;r+=this.width)this.draw2(r,e)}catch(t){console.error(t)}i.restore()}drawVerticalPattern(t,e,r){if(!this.isLoaded())return;const i=this._engine.ctx;i.save();try{const i=e+r;for(let r=e;r<i;r+=this.height)this.draw2(t,r)}catch(t){console.error(t)}i.restore()}_drawPattern(t,e,r,i){if(!this.isLoaded())return;const s=Math.trunc(r/this.width)*this.width,h=Math.trunc(i/this.height)*this.height,a=t,n=e,o=t+s,d=e+i;let u,c;if(i>=this.height){for(u=n;u<d;u+=this.height)if(r>=this.width){for(c=a;c<o;c+=this.width)this.draw2(c,u);let t=r-s;t>0&&this._engine._drawImage(this,0,0,t,this.height,c-this.x,u-this.y,t,this.height)}else this._engine._drawImage(this,0,0,r,this.height,a-this.x,u-this.y,r,this.height);let t=i-h;t>0&&(console.error(new Error("未完成")),this._engine._drawImage(this,0,0,this.width,t,a-this.x,u-this.y,this.width,t))}else console.error(new Error("未完成")),this._engine._drawImage(this,0,0,this.width,i,a-this.x,n-this.y,this.width,i)}_drawHorizontalPattern(t,e,r){if(!this.isLoaded())return;this._engine.ctx;const i=t+r;for(let r=t;r<i;r+=this.width)this.draw2(r,e)}_drawVerticalPattern(t,e,r){if(!this.isLoaded())return;this._engine.ctx;const i=e+r;for(let r=e;r<i;r+=this.height)this.draw2(t,r)}drawPattern4i(t,e,r,i){this.drawPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5),Math.trunc(i+.5))}drawHorizontalPattern3i(t,e,r){this.drawHorizontalPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5))}drawVerticalPattern3i(t,e,r){this.drawVerticalPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5))}_drawPattern4i(t,e,r,i){this._drawPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5),Math.trunc(i+.5))}_drawHorizontalPattern3i(t,e,r){this._drawHorizontalPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5))}_drawVerticalPattern3i(t,e,r){this._drawVerticalPattern(Math.trunc(t+.5),Math.trunc(e+.5),Math.trunc(r+.5))}}}}]);
//# sourceMappingURL=17.js.map