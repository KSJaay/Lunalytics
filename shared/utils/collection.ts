class Collection extends Map {
  constructor() {
    super();
  }

  static defaultSort<T>(firstValue: T, secondValue: T): number {
    return (
      Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1
    );
  }

  hasAll(...keys: (string | number | symbol)[]): boolean {
    return keys.every((key) => super.has(key));
  }

  hasAny(...keys: (string | number | symbol)[]): boolean {
    return keys.some((key) => super.has(key));
  }

  every<T = any>(
    fn: (value: T, key: any, map: this) => boolean,
    thisArg?: any
  ): boolean {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }

    return true;
  }

  some<T = any>(
    fn: (value: T, key: any, map: this) => boolean,
    thisArg?: any
  ): boolean {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }

    return false;
  }

  find<T = any>(
    fn: (value: T, key: any, map: this) => boolean,
    thisArg?: any
  ): T | undefined {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }

    return undefined;
  }

  findKey<T = any>(
    fn: (value: T, key: any, map: this) => boolean,
    thisArg?: any
  ): any {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }

    return undefined;
  }

  map<T = any, U = any>(
    fn: (value: T, key: any, map: this) => U,
    thisArg?: any
  ): U[] {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const iter = this.entries();
    return Array.from({ length: this.size }, () => {
      const next = iter.next();
      if (!next.done && next.value) {
        const [key, value] = next.value;
        return fn(value, key, this);
      }
      return undefined;
    }).filter((v) => v !== undefined);
  }

  filter<T = any>(
    fn: (value: T, key: any, map: this) => boolean,
    thisArg?: any
  ): this {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    if (thisArg !== undefined) fn = fn.bind(thisArg);
    const results = new (this.constructor as typeof Collection)[Symbol.species]() as this;
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }

    return results;
  }

  reduce<T = any, U = any>(
    fn: (accumulator: U, value: T, key: any, map: this) => U,
    initialValue?: U
  ): U {
    if (typeof fn !== 'function')
      throw new TypeError(`${fn} is not a function`);
    let accumulator;

    const iterator = this.entries();
    if (initialValue === undefined) {
      if (this.size === 0)
        throw new TypeError('Reduce of empty collection with no initial value');
      accumulator = iterator?.next()?.value?.[1];
    } else {
      accumulator = initialValue;
    }

    for (const [key, value] of iterator) {
      accumulator = fn(accumulator, value, key, this);
    }

    return accumulator;
  }

  sort<T = any>(
    compareFunction: (
      a: T,
      b: T,
      aKey: any,
      bKey: any
    ) => number = Collection.defaultSort
  ): this {
    const entries = [...this.entries()];
    entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
    super.clear();
    for (const [key, value] of entries) {
      super.set(key, value);
    }
    return this;
  }

  toObject(): Record<string, any> {
    return Object.fromEntries(this.entries());
  }

  toJSON(): [any, any][] {
    return [...this.entries()];
  }

  toJSONValues(): any[] {
    return [...this.values()];
  }

  toJSONKeys(): any[] {
    return [...this.keys()];
  }
}

export default Collection;
