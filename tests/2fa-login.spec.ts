import { test, expect } from "@playwright/test";
import Otpatuh from "otpauth";

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });

const { USER_NAME, PASSWORD, TOTP_URI } = process.env;

const totp = Otpatuh.URI.parse(TOTP_URI);

test("login to porkbun", async ({ page }) => {
  await page.goto("https://porkbun.com/account/login");
  await page.getByLabel("Username or Email").click();
  await page.getByLabel("Username or Email").fill(USER_NAME);
  await page.getByLabel("Password", { exact: true }).click();
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("I'm not a robot.").check();
  await wait(1000);

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Two Factor Authentication").fill(totp.generate());
  await page.getByLabel("I'm not a robot.").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForURL("https://porkbun.com/account/domainsSpeedy");
  await wait(2000);
});
