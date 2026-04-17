class ApiResponse {
  constructor(statusCode, data = null, message = "OK") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 400;
  }
}

export default ApiResponse;
