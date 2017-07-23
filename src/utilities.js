export const pushNew = (collection, klass) => {
  const newObject = new klass();
  collection.push(newObject);
  return newObject;
};
