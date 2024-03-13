# NODE.js - API Test Suite

This repository contains a test suite for the Task Manager API. The tests are written in JavaScript using Jest framework.

## Prerequisites

Before running the tests, ensure you have the following installed:

- Node.js (at least version 12 or higher)
- npm (Node Package Manager)

## Getting Started

Follow these steps to set up and run the tests:

1. Clone this repository to your local machine:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd task-manager-api-tests
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Obtaining the Cookie

Before running the tests, you need to obtain a valid cookie. Follow these instructions to acquire it:

**Note:** The cookie must be obtained by authenticating through the `/api/v1/auth/google` endpoint of the API. There are 4 different APIs set up to get the cookie and test. They are found at the following URLs:

s1: https://s1.cf-itc210.net
s2: https://s2.cf-itc210.net
s3: https://s3.cf-itc210.net
s4: https://s4.cf-itc210.net

1. Navigate to the the API in your browser.
2. Authenticate using the Google authentication method.
3. Once authenticated, inspect the cookies associated with the session. Right click > Inspect Element > Application > Storage > Cookies > it210_session
4. Look for a cookie named `it210_session`.
5. Copy the value of this cookie (a long string of random characters).

## Configuration

To configure the tests to use the obtained cookie, you need to modify the `api.js` file. Locate the `cookie` variable declaration and paste the copied cookie value as its assigned string.

```javascript
const cookie = 'YOUR_COPIED_COOKIE_VALUE';
```

## Running the Tests

After configuring the cookie, you can run the tests using the following command:

```bash
npm test
```

## Test Descriptions

1. **CREATE Test**:
   - Purpose: Tests the functionality to create a new task through the API.
   - Steps:
     - Generates random text and a random date for the task.
     - Calls the `createTask` method of the API with the generated text and date.
     - Verifies that the response is successful (HTTP status 200).
     - Checks if the created task matches the provided text and date.
     - Cleans up by deleting the created task.

2. **READ ONE Test**:
   - Purpose: Tests the functionality to read a single task by its ID.
   - Steps:
     - Creates a new task.
     - Reads the created task using its ID.
     - Verifies that the response is successful (HTTP status 200).
     - Checks if the retrieved task matches the created task.

3. **READ ALL Test**:
   - Purpose: Tests the functionality to retrieve all tasks.
   - Steps:
     - Creates a new task.
     - Retrieves all tasks.
     - Verifies that the response is successful (HTTP status 200).
     - Checks if all retrieved tasks belong to the same user as the created task.

4. **UPDATE Test**:
   - Purpose: Tests the functionality to update the status of a task.
   - Steps:
     - Creates a new task.
     - Updates the status of the created task.
     - Verifies that the response is successful (HTTP status 200).

5. **DELETE Test**:
   - Purpose: Tests the functionality to delete a task.
   - Steps:
     - Creates a new task.
     - Deletes the created task.
     - Verifies that the response is successful (HTTP status 200).
     - Attempts to read the deleted task again to ensure it's not retrievable (should return HTTP status 404).

6. **READ USER Test**:
   - Purpose: Tests the functionality to retrieve information about the current user.
   - Steps:
     - Retrieves information about the current user.
     - Verifies that the response is successful (HTTP status 200).
     - Checks if the retrieved user object contains essential properties like Id, UserName, and Email.

7. **READ ONE NONEXISTENT Test**:
   - Purpose: Tests the behavior when attempting to read a task that doesn't exist.
   - Steps:
     - Calls the `readTask` method of the API with a fake task ID.
     - Verifies that the response status is 404 (Not Found).

8. **DELETE NONEXISTENT Test**:
   - Purpose: Tests the behavior when attempting to delete a task that doesn't exist.
   - Steps:
     - Calls the `deleteTask` method of the API with a fake task ID.
     - Verifies that the response status is 404 (Not Found).

9. **UPDATE NONEXISTENT Test**:
   - Purpose: Tests the behavior when attempting to update a task that doesn't exist.
   - Steps:
     - Calls the `updateTask` method of the API with a fake task ID.
     - Verifies that the response status is 404 (Not Found).

10. **DELETE INVALID ID Test**:
    - Purpose: Tests the behavior when attempting to delete a task with an invalid ID format.
    - Steps:
      - Calls the `deleteTask` method of the API with an invalid task ID.
      - Verifies that the response status is 500 (Internal Server Error).

11. **READ ALL NO COOKIE Test**:
    - Purpose: Tests the behavior when attempting to retrieve all tasks without providing a cookie.
    - Steps:
      - Calls the `readAllTasks` method of the API without providing a cookie.
      - Verifies that the response status is 401 (Unauthorized).

12. **CREATE NOT ENOUGH DATA PROVIDED Test**:
    - Purpose: Tests the behavior when attempting to create a task without providing enough data.
    - Steps:
      - Calls the `createTask` method of the API with empty text and date.
      - Verifies that the response status is 500 (Internal Server Error).

These tests cover various scenarios to ensure the functionality of the Task Manager API is working as expected under different conditions.
