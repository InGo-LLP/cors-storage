export default function merge(obj, props) {
  for (var i in props)
    obj[i] = props[i];
  return obj;
}
