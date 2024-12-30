export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(500, `Database error: ${message}`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, `Validation error: ${message}`);
  }
}