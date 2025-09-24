import { PingRequest } from '../generated/ping_pb';
import { PingServiceClient } from '../generated/PingServiceClientPb';

class GrpcClient {
  constructor() {
    this.client = new PingServiceClient('http://localhost:8080');
  }

  async ping(message) {
    return new Promise((resolve, reject) => {
      const request = new PingRequest();
      request.setMessage(message);

      this.client.ping(request, {}, (err, response) => {
        if (err) {
          console.error('gRPC Error:', err);
          reject(err);
        } else {
          resolve(response.getMessage());
        }
      });
    });
  }
}

export default new GrpcClient();