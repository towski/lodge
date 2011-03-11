Object.extend(Array.prototype, {
  insert: function() {
    this.splice.apply(this, [this.length, 0].concat(Array.prototype.slice.call(arguments, 1)));
    return this;
  }
});