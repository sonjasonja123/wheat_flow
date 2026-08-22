import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '60s', target: 500 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000']
  }
};

export default function () {
  const response = http.get(__ENV.BASE_URL || 'http://localhost:5000/api/health');
  check(response, { 'status je 200': result => result.status === 200 });
  sleep(1);
}
