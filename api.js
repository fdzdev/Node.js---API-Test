class API {
  /**
   * Create a new API instance.
   * @param {string} baseUrl - The base URL for API requests.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }


  /**
   * Create a new task!
   * @param {string} cookie - Pre-authorized cookie!
   * @param {string} Text - Text/description of the task.!
   * @param {string} Date - Due date of the task.!
   * @returns {Promise<Response>} Response from the server.!
   */
  createTask(cookie, Text, Date) {
    const url = new URL('/api/v1/tasks', this.baseUrl);
    const data = { Text, Date };
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }
  /**
   * Retrieves a list of all tasks!
   *
   * @param {string} cookie - The session cookie.
   * @returns {Promise<Response>} A promise that resolves to the response containing the list of tasks.
   */
  readAllTasks(cookie) {
    const url = new URL('/api/v1/tasks', this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }

  /**
  * Retrieves details of a specific task.
  *
  * @param {string} cookie - The session cookie.
  * @param {string} taskId - The ID of the task to retrieve.
  * @returns {Promise<Response>} A promise that resolves to the response containing the details of the task.
  */
  readTask(cookie, taskId) {
    const url = new URL(`/api/v1/tasks/${taskId}`, this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }

  /**
  * Updates the status of a task.
  *
  * @param {string} cookie - The session cookie.
  * @param {string} taskId - The ID of the task to update.
  * @param {boolean} Done - The new status of the task.
  * @returns {Promise<Response>} A promise that resolves to the response confirming the task update.
  */
  updateTask(cookie, taskId, Done) {
    const url = new URL(`/api/v1/tasks/${taskId}`, this.baseUrl);
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `it210_session=${cookie}`
    };
    const data = { Done };
    return fetch(url.toString(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
  }

  /**
  * Deletes a task.
  *
  * @param {string} cookie - The session cookie.
  * @param {string} taskId - The ID of the task to delete.
  * @returns {Promise<Response>} A promise that resolves to the response confirming the task deletion.
  */
  deleteTask(cookie, taskId) {
    const url = new URL(`/api/v1/tasks/${taskId}`, this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'DELETE',
      headers
    });
  }

  /**
  * Retrieves information about the currently logged-in user.
  *
  * @param {string} cookie - The session cookie.
  * @returns {Promise<Response>} A promise that resolves to the response containing the user information.
  */
  readCurrentUser(cookie) {
    const url = new URL('/api/v1/user', this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }
}
if (require.main === module) {
  // Here is where you can test your API methods.
  const baseUrl = 'https://s2.cf-itc210.net';
  const cookie = 's%3AyPyQSSqiM60oyVgIYbv5QnZ-LcRsixOs.Rv7kb6QEfeMStqsiJwbCv%2BEvr6q2znOyVeiApzlDpgk';
  const taskId = '12'; // Replace 'your-task-id' with the actual task ID
  const api = new API(baseUrl);

  // Test createTask method
  api.createTask(cookie, 'Test the API..', '2023-01-01')
    .then((response) => {
      console.log('Create Task:');
      console.log(response.ok);
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error creating task:', error);
    });


}

module.exports = API;
