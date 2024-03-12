const API = require('./api');

/**
 * Helper function to generate random text for creating new tasks.
 * @param {number} length - Length of the generated text.
 * @returns {string} A randomly-generated string of specified length.
 */
function generateRandomText(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

/**
 * Helper function to generate a random date string in ISO format.
 * @returns {string} A randomly-generated ISO-formatted date string.
 */
function generateRandomDate() {
    const year = Math.floor(Math.random() * 10) + 2020; // Random year between 2020 and 2029
    const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
    const day = Math.floor(Math.random() * 28) + 1; // Random day between 1 and 28
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Base URL and cookie for testing
const baseUrl = 'https://s1.cf-itc210.net';
const cookie = 's%3AyPyQSSqiM60oyVgIYbv5QnZ-LcRsixOs.Rv7kb6QEfeMStqsiJwbCv%2BEvr6q2znOyVeiApzlDpgk';

// Tests for the API
describe('API Tests', () => {
    let api = new API(baseUrl);

    /* Proper classes that should work */
    /* 
        CREATE
        READ ONE
        READ ALL
        UPDATE
        DELETE
        READ USER
     */

    // Create Task
    test('CREATE', async () => {
        const text = generateRandomText(10);
        const date = generateRandomDate();
        let response = await api.createTask(cookie, text, date);
        expect(response.ok).toBe(true);

        // read response
        let task = await response.json();
        expect(task.Text).toEqual(text);
        expect(task.Date).toEqual(date);
        expect(task.Done).toBe(false);
        expect(task).toHaveProperty('UserId');
        api.deleteTask(cookie, task._id); // Cleanup
    });

    // Read One
    test('READ ONE', async () => {
        // Create a task first
        const text = generateRandomText(10);
        const date = generateRandomDate();
        let createResponse = await api.createTask(cookie, text, date);
        expect(createResponse.ok).toBe(true);
        let task = await createResponse.json();

        // Read the created task
        let readResponse = await api.readTask(cookie, task._id);
        expect(readResponse.ok).toBe(true);
        let readTask = await readResponse.json();
        expect(readTask._id).toEqual(task._id);
        expect(readTask.Text).toEqual(text);
        expect(readTask.Date).toEqual(date);
        expect(readTask.Done).toBe(false);
        expect(readTask).toHaveProperty('UserId');
    });

    // Read All
    test('READ ALL', async () => {
        // Create a task first
        const text = generateRandomText(10);
        const date = generateRandomDate();
        let createResponse = await api.createTask(cookie, text, date);
        expect(createResponse.ok).toBe(true);
        let task = await createResponse.json();

        // Read all tasks
        let readAllResponse = await api.readAllTasks(cookie);
        expect(readAllResponse.ok).toBe(true);
        let tasks = await readAllResponse.json();
        for (const t of tasks) {
            expect(t.UserId).toEqual(task.UserId);
        }
    });

    // Update Task
    test('UPDATE', async () => {
        // Create a task first
        const text = generateRandomText(10);
        const date = generateRandomDate();
        let createResponse = await api.createTask(cookie, text, date);
        expect(createResponse.ok).toBe(true);
        let task = await createResponse.json();

        // Update the task
        const updatedStatus = true;
        let updateResponse = await api.updateTask(cookie, task._id, updatedStatus);
        expect(updateResponse.ok).toBe(true);
    });

    // Delete Task
    test('DELETE', async () => {
        // Create a task first
        const text = generateRandomText(10);
        const date = generateRandomDate();
        let createResponse = await api.createTask(cookie, text, date);
        expect(createResponse.ok).toBe(true);
        let task = await createResponse.json();

        // Delete the task
        let deleteResponse = await api.deleteTask(cookie, task._id);
        expect(deleteResponse.ok).toBe(true);

        // Check if the task is deleted by trying to read it again
        let readResponse = await api.readTask(cookie, task._id);
        expect(readResponse.ok).toBe(false);
        expect(readResponse.status).toBe(404);
    });

    // Read Current User
    test('READ USER', async () => {
        let response = await api.readCurrentUser(cookie);
        expect(response.ok).toBe(true);
        let user = await response.json();
        expect(user).toHaveProperty('Id');
        expect(user).toHaveProperty('UserName');
        expect(user).toHaveProperty('Email');
    });

    /* Classes that should fail */


    /* READ ONE NONEXISTENT
        DELETE NONEXISTENT
        UPDATE NONEXISTEN
        DELETE INVALID ID
        READ ALL NO COOKIE
        CREATE NOT ENOUGH DATA
     */


    // Read One, doesn't exist
    test('READ ONE NONEXISTENT', async () => {
        const fakeId = '123456789012345678901234'; // 24 hex chars
        let response = await api.readTask(cookie, fakeId);
        expect(response.ok).toBe(false);
        expect(response.status).toBe(404);
    });

    // Delete, doesn't exist
    test('DELETE NONEXISTENT', async () => {
        const fakeId = '123456789012345678901234'; // 24 hex chars
        let response = await api.deleteTask(cookie, fakeId);
        expect(response.ok).toBe(false);
        expect(response.status).toBe(404);
    });

    // Update, doesn't exist
    test('UPDATE NONEXISTENT', async () => {
        const fakeId = '123456789012345678901234'; // 24 hex chars
        let response = await api.updateTask(cookie, fakeId, true);
        expect(response.ok).toBe(false);
        expect(response.status).toBe(404);
    });

    // Delete, invalid id
    test('DELETE INVALID ID', async () => {
        const fakeId = 'fake-id-invalid'; // Invalid according to MongoDB ObjectId specs
        let response = await api.deleteTask(cookie, fakeId);
        expect(response.ok).toBe(false);
        expect(response.status).toBe(500);
    });

    // Read All, no cookie
    test('READ ALL NO COOKIE', async () => {
        let response = await api.readAllTasks('');
        expect(response.ok).toBe(false);
        expect(response.status).toBe(401);
    });

    // Create, not enough data provided
    test('CREATE NOT ENOUGH DATA PROVIDED', async () => {
        let response = await api.createTask(cookie, '', ''); // Not enough data provided
        expect(response.ok).toBe(false);
        expect(response.status).toBe(500);

    });
});
