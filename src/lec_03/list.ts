class Nil {
  setHead = () => this;
  drop = () => this;
}

const nil = new Nil();

function setHead<A>(_this: List<A>, x: A) {
  switch (true) {
    case _this instanceof Nil:
      return nil;
    case _this instanceof List:
      return new List(x, _this);
  }
}

function _drop<T>(_this: List<T>, n: number): List<T> {
  if (n === 0) return _this as List<T>;
  else {
    switch (true) {
      case _this instanceof List:
        return _drop(_this.tail, n - 1) as List<T>;
      case _this instanceof Nil:
      default:
        return nil as unknown as List<T>;
    }
  }
}

function _append<T>(_this: List<T>, a2: List<T>): List<T> {
  switch (true) {
    case _this instanceof List:
      return new List(_this.head, _append(_this.tail, a2));
    default:
      return a2 as unknown as List<T>;
  }
}

function _foldRight<A, B>(_this: List<A>, acc: B, block: (a: A, b: B) => B): B {
  switch (true) {
    case _this instanceof List:
      return block(_this.head as A, _foldRight(_this.tail, acc, block));
    default:
      return acc;
  }
}

function _foldLeft<A, B>(_this: List<A>, acc: B, block: (b: B, a: A) => B) {
  switch (true) {
    case _this instanceof List:
      return _foldLeft(_this.tail, block(acc, _this.head), block);
    default:
      return acc;
  }
}

class List<T> {
  constructor(public head: T, public tail: List<T>) {}

  public static empty<T>(): List<T> {
    return nil as unknown as List<T>;
  }

  public static of<A>(...aa: A[]): List<A> {
    let head: A | undefined;
    let child: List<A> | Nil = nil;

    while ((head = aa.pop())) {
      child = new List(head, child as List<A>);
    }
    return child as List<A>;
  }
  setHead(x: T) {
    return setHead(this, x);
  }
  drop(n: number): List<T> {
    return _drop(this, n);
  }
  append<A>(a2: List<T>): List<T> {
    return new List(this.head, _append(this.tail, a2));
  }
  foldRight<A, B>(acc: B, block: (a: A, b: B) => B): B {
    return _foldRight(this as unknown as List<A>, acc, block);
  }
  length(): number {
    return this.foldRight(0, (_, acc) => acc + 1);
  }
  foldLeft<A, B>(acc: B, block: (b: B, a: A) => B) {
    return _foldLeft(this.tail, block(acc, this.head as unknown as A), block);
  }
  map<A, B>(block: (a: A) => B) {
    return _foldRight(
      this,
      List.empty() as List<B>,
      (a: A, _this: List<B>) => new List(block(a), _this)
    );
  }
  filter<A>(block: (a: A) => boolean): List<A> {
    return _foldRight(
      this as unknown as List<A>,
      List.empty(),
      (e: A, l: List<A>) => {
        if (block(e)) return new List(e, l);
        else return l;
      }
    );
  }
  flatMap<A, B>(block: (a: A) => List<B>): List<B> {
    return _foldRight(this as unknown as List<A>, List.empty(), (e, l) =>
      _append(block(e), l as List<B>)
    );
  }
}

// const list = List.of(1, 2);
// console.log(list.setHead(3));
// console.log(list.drop(1));
// console.log(list.append(List.of(3)));
// console.log(List.of(1, 2, 3).foldRight(0, (a: number, b: number) => a + b));
// console.log(List.empty());
// console.log(List.of(1, 2, 3).length());
// console.log(List.of(1, 2, 3).foldLeft(0, (b: number, a: number) => b + a));
// console.log(List.of(1, 2, 3).map((a: number) => a * 3));
// console.log(List.of(1, 2, 3).filter((a: number) => a < 3));
// console.log(
//   List.of(1, 2, 3).flatMap((a: number) => {
//     return List.of(2 * a);
//   })
// );
