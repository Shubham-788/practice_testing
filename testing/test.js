import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Define custom metrics for POST requests
const postRequestDuration = new Trend('post_request_duration');
const postRequestRate = new Rate('post_request_success_rate');
const postRequestCount = new Counter('post_request_count');

// Define custom metrics for GET requests
const getRequestDuration = new Trend('get_request_duration');
const getRequestRate = new Rate('get_request_success_rate');
const getRequestCount = new Counter('get_request_count');

export const options = {
  stages: [
    { duration: '20s', target: 12500 },
    { duration: '30s', target: 12500 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    post_request_duration: ['p(90)<200', 'p(95)<300', 'p(99)<500'],
    get_request_duration: ['p(90)<200', 'p(95)<300', 'p(99)<500'],
    post_request_success_rate: ['rate>0.95'],
    get_request_success_rate: ['rate>0.95'],
  },
};

const BASE_URL = 'http://127.0.0.1:3000';

// Function to perform a POST request
function performPostRequest() {
  const postStart = new Date().getTime();
  const postResponse = http.post(`${BASE_URL}/messages`, JSON.stringify({ message: 'Hello, world!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  const postEnd = new Date().getTime();

  postRequestDuration.add(postEnd - postStart);
  postRequestRate.add(postResponse.status === 201);
  postRequestCount.add(1);

  const postCheck = check(postResponse, {
    'POST status is 201': (r) => r.status === 201,
    'POST response body': (r) => r.body.includes('Data inserted into message table'),
  });

  if (!postCheck) {
    console.error(`POST request failed: ${postResponse.status} ${postResponse.body}`);
  }
}

// Function to perform a GET request
function performGetRequest() {
  const getStart = new Date().getTime();
  const getResponse = http.get(`${BASE_URL}/messages`);
  const getEnd = new Date().getTime();

  getRequestDuration.add(getEnd - getStart);
  getRequestRate.add(getResponse.status === 200);
  getRequestCount.add(1);

  const getCheck = check(getResponse, {
    'GET status is 200': (r) => r.status === 200,
    'GET response is not empty': (r) => r.body.length > 0,
  });

  if (!getCheck) {
    console.error(`GET request failed: ${getResponse.status} ${getResponse.body}`);
  }
}

export default function () {
  // Perform POST and GET requests and measure their metrics
  performPostRequest();
  performGetRequest();
  sleep(1);
}
