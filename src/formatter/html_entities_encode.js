const Html5Entities = require('html-entities').Html5Entities;

export default function htmlEntitiesEncode(data) {
  const encoder = new Html5Entities();
  return encoder.encode(data);
}
