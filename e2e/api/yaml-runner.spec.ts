import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Define the YAML schema format interface
interface YamlApiTestInfo {
  name: string;
  baseURL: string;
  tests: {
    name: string;
    request: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      endpoint: string;
      body?: any;
      headers?: Record<string, string>;
    };
    response: {
      status: number;
      bodyContains?: Record<string, any>;
    };
  }[];
}

const testsDir = path.join(__dirname, 'tests');
const yamlFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.yml'));

// Read and build tests dynamically for each yaml file
for (const file of yamlFiles) {
  const filePath = path.join(testsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const yamlDoc = yaml.load(fileContent) as YamlApiTestInfo;

  test.describe(`[YAML API] ${yamlDoc.name}`, () => {
    for (const apiTest of yamlDoc.tests) {
      test(apiTest.name, async ({ request }) => {
        // Execute HTTP request matching YAML params
        const response = await request.fetch(`${yamlDoc.baseURL}${apiTest.request.endpoint}`, {
          method: apiTest.request.method,
          data: apiTest.request.body,
          headers: apiTest.request.headers,
        });

        // Validate Status Code
        expect(response.status()).toBe(apiTest.response.status);

        // Validate Body optionally
        if (apiTest.response.bodyContains) {
          const resBody = await response.json();
          for (const [key, expectedValue] of Object.entries(apiTest.response.bodyContains)) {
            expect(resBody[key]).toEqual(expectedValue);
          }
        }
      });
    }
  });
}
