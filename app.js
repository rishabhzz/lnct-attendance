const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/result', async (req, res) => {
  const { username, password } = req.query;

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  // Launch a headless browser and run the Puppeteer script
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Your Puppeteer script here, modifying the code to use 'username' and 'password'

  // For example:
 // Navigate to the login page
 await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');

 // Fill in the login form and submit
 await page.type('#ctl00_cph1_txtStuUser', '11115022839');
 await page.type('#ctl00_cph1_txtStuPsw', '11115022839');
 await page.click('#ctl00_cph1_btnStuLogin');

 await page.waitForXPath('//a[@href="StuAttendanceStatus.aspx"]');

 // Click on the link with the specified href value
 const links = await page.$x('//a[@href="StuAttendanceStatus.aspx"]');
 if (links.length > 0) {
   await links[0].click();
 } else {
   console.error('Link not found');
 }


 await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtStudentName');
 const successElement = await page.$('#ctl00_ContentPlaceHolder1_txtStudentName');

 const successValue = await successElement.evaluate(element => element.value);
  // Close the browser
  await browser.close();

  // Respond with the result directly
  res.send(successValue);
});

const port = 3000; // Change this to your desired port
app.listen(port, () => {
  console.log(`Web service is running on port ${port}`);
});
