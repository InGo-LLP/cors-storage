!function(){"use strict";function t(t,o){for(var r in o)t[r]=o[r];return t}function o(t,o,r){this.data=t,this.source=o,this.origin=r}o.prototype={constructor:o,post:function(o){this.source.postMessage(JSON.stringify(t({},o||{},this.data._requestID)),this.origin)},postData:function(t){this.post({data:t})},postError:function(t){this.post({error:t})}},function(t){window.addEventListener("message",function(r){var i=JSON.parse(r.data),n=r.source,s=r.origin;t(new o(i,n,s))},!1)}(function(t){var o=t.data,r=t.postError.bind(t),i=t.postData.bind(t);if(!o.obj)return r('missing "obj" property');var n=window[o.obj];if(!n)return r(o.obj+" not supported");if(!o.op)return r('missing "op" property');if(!(o.op in n))return r("method does not exists "+o.obj+"."+o.op);try{i(n[o.op].apply(n,o.args||[]))}catch(t){r(t.message)}})}();
