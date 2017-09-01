import onMessage from "./on-message";

onMessage(function(helper) {
  var data = helper.data;
  var postError = helper.postError.bind(helper);
  var postData = helper.postData.bind(helper);

  if (!data.obj) {
    return postError('missing "obj" property');
  }

  var obj = window[data.obj];

  if (!obj) {
    return postError(data.obj + " not supported");
  }

  if (!data.op) {
    return postError('missing "op" property');
  }

  if (!(data.op in obj)) {
    return postError("method does not exists " + data.obj + "." + data.op);
  }

  try {
    postData(obj[data.op].apply(obj, data.args || []));
  } catch (e) {
    postError(e.message); //just in case
  }
});
