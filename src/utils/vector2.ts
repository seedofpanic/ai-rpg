import { makeAutoObservable } from 'mobx';

export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {
    makeAutoObservable(this);
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2 {
    if (scalar === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2(0, 0);
    }
    return this.divide(mag);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
