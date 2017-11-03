import assign from "object-assign";

function PostHelper(data, source, origin) {
  this.data = data;
  this.source = source;
  this.origin = origin;
}

PostHelper.prototype = {
  constructor: PostHelper,

  post: function(msg) {
    var data = assign({}, msg || {}, { _requestID: this.data._requestID });
    this.source.postMessage(JSON.stringify(data), this.origin);
  },

  postData: function(msg) {
    this.post({ data: msg });
  },

  postError: function(msg) {
    this.post({ error: msg });
  }
};

export default function onMessage(callback) {
  return window.addEventListener(
    "message",
    function(e) {
      var data = JSON.parse(e.data);
      var sourceWindow = e.source;
      var origin = e.origin;

      callback(new PostHelper(data, sourceWindow, origin));
    },
    false
  );
}
