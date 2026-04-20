// https://gist.github.com/jjgrainger/808640fcb5764cf92c3cad960682c677

export class Vector {
  x: number = 0;
  y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // Return the angle of the vector in radians
  public getAngle() {
    return Math.atan2(this.y, this.x);
  };

  // Set the direction of the vector in radians
  public setAngle(angle: number): Vector {
    var magnitude = this.getLength();
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
    return this;
  };

  // Get the length of the vector
  public getLength(): number {
    return Math.sqrt(this.x**2 + this.y**2);
  };

  // Set the length of the vector
  public setLength(length: number): Vector {
    var direction = this.getAngle(); 
    this.x = Math.cos(direction) * length;
    this.y = Math.sin(direction) * length;
    return this;
  };

  // Add two vectors together and return a new one
  public add(v2: Vector): Vector {
    return new Vector(this.x + v2.x, this.y + v2.y);
  };

  // Add a vector to this one
  public addTo(v2: Vector): Vector {
    this.x += v2.x;
    this.y += v2.y;
    return this;
  };

  // Subtract two vectors and return a new one
  public subtract(v2: Vector): Vector {
    return new Vector(this.x - v2.x, this.y - v2.y);
  };

  // Subtract a vector from this one
  public subtractFrom(v2: Vector): Vector {
    this.x -= v2.x;
    this.y -= v2.y;
    return this;
  };

  // Multiply this vector by a scalar and return a new one
  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  };

  // Multiply this vector by the scalar
  public multiplyBy(scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  // Scale this vector by scalar and return a new vector
  public divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  };

  // Scale this vector by scalar
  public divideBy(scalar: number): Vector {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  };

  public normalize(): Vector {
    const l = this.getLength();
    if (l > 0) {
      this.x = this.x / l;
      this.y = this.y / l;
    }
    return this;
  }

  public normalized(): Vector {
    return this.copy().normalize();
  }

  public distanceTo(v: Vector): number {
    return Math.sqrt((this.x-v.x)**2 + (this.y-v.y)**2);
  }

  public distanceToX(v: Vector): number {
    return Math.sqrt((this.x-v.x)**2);
  }

  public distanceToY(v: Vector): number {
    return Math.sqrt((this.x-v.x)**2);
  }

  // Aliases
  // getMagnitude = this.getLength;
  // setMagnitude = this.setLength;

  // getDirection = this.getAngle;
  // setDirection = this.setAngle;

  // Utilities
  public copy(): Vector {
    return new Vector(this.x, this.y);
  };

  public toString(): string {
    return `x: ${this.x}, y: ${this.y}`;
  };

  public toArray(): number[] {
    return [this.x, this.y];
  };
};

// To add:
// Scale
// Normalize
// Dot?