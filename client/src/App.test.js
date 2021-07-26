import React from "react";
import puppeteer from "puppeteer";

describe("End-to-end test of Login -> Main tasks -> Add task -> Delete Task", () => {
  test("e2e Login", async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    const app = "http://localhost:3000/login";
    await page.goto(app);

    // Email
    await page.waitForSelector("#email_input");
    await page.click("#email_input");
    await page.type("#email_input", "123@gmail.com");

    // Password
    await page.waitForSelector("#password_input");
    await page.click("#password_input");
    await page.type("#password_input", "123456");

    await page.click("#testLoginButton");

    await page.waitForSelector("#greeting");
    const text = await page.$eval("#greeting", (item) => item.textContent);

    expect(text).toBe("Good Night, Ben");

    await page.waitForSelector(".taskPage");
    await page.click(".taskPage");

    await page.waitForSelector("#testAddButton");
    await page.click("#testAddButton");

    await page.waitForSelector("#lmao");
    await page.click("#something1");
    await page.type("#something1", "This is a task");
    browser.close();
  }, 20000);
});
