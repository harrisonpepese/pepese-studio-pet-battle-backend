export class Random {
  static range(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static random() {
    return Math.random();
  }
}
