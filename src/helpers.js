function removeObjectDuplicatesOfArray(array) {
  // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
  return array.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (element) => element._id.toString() === value._id.toString()
      )
  );
}

module.exports = { removeObjectDuplicatesOfArray };
