class Collection extends Map {
  constructor() {
    super();
  }

  static defaultSort(firstValue, secondValue) {
    return (
      Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1
    );
  }

  hasAll(...keys) {
    return keys.every((key) => super.has(key));
  }

  hasAny(...keys) {
    return keys.some((key) => super.has(key));
  }

  every(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }

    return true;
  }

  some(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }

    return false;
  }

  find(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }

    return undefined;
  }

  findKey(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }

    return undefined;
  }

  map(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const iter = this.entries();
    return Array.from({ length: this.size }, () => {
      const [key, value] = iter.next().value;
      return fn(value, key, this);
    });
  }

  filter(fn, thisArg) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const results = new this.constructor[Symbol.species]();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }

    return results;
  }

  reduce(fn, initialValue) {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    let accumulator;

    const iterator = this.entries();
    if (initialValue === undefined) {
      if (this.size === 0)
        throw new TypeError('Reduce of empty collection with no initial value');
      accumulator = iterator.next().value[1];
    } else {
      accumulator = initialValue;
    }

    for (const [key, value] of iterator) {
      accumulator = fn(accumulator, value, key, this);
    }

    return accumulator;
  }

  sort(compareFunction = Collection.defaultSort) {
    const entries = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));

    // Perform clean-up
    super.clear();

    // Set the new entries
    for (const [key, value] of entries) {
      super.set(key, value);
    }

    return this;
  }

  toObject() {
    return Object.fromEntries(this.entries());
  }

  toJSON() {
    return [...this.entries()];
  }

  toJSONValues() {
    return [...this.values()];
  }

  toJSONKeys() {
    return [...this.keys()];
  }
}

export default Collection;
