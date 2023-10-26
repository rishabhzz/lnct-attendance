const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/attendance', async (req, res) => {
  const { username, password } = req.query;

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Launch a headless browser and run the Puppeteer script
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


 await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');

 // Fill in the login form and submit
 await page.type('#ctl00_cph1_txtStuUser', username);
 await page.type('#ctl00_cph1_txtStuPsw', password);
 await Promise.all([page.waitForNavigation(), page.click('#ctl00_cph1_btnStuLogin')]);

 await page.waitForXPath('//a[@href="StuAttendanceStatus.aspx"]');

 // Click on the link with the specified href value
 const links = await page.$x('//a[@href="StuAttendanceStatus.aspx"]');
 if (links.length > 0) {
   await links[0].click();
 } else {
   console.error('Link not found');
     res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   return res.status(400).json({ error: 'Login failed. Success element not found.' });
 }


 await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtStudentName');
 const successElement = await page.$('#ctl00_ContentPlaceHolder1_txtStudentName');

 const successValue = await successElement.evaluate(element => element.value);
  // Close the browser
  await browser.close();

  // Respond with the result directly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(200).json({ success: successValue });
});


app.get('/login', async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
   
 await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');

 await page.type('#ctl00_cph1_txtStuUser', username);
 await page.type('#ctl00_cph1_txtStuPsw', password);
 await Promise.all([page.waitForNavigation(), page.click('#ctl00_cph1_btnStuLogin')]);

    const successElement = await page.$('#ctl00_lnct');

    if (successElement) {
        res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
      const successValue = await successElement.evaluate(element => element.value);
      return res.status(200).json({ success: successValue });
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(400).json({ error: 'Login failed. Success element not found.' });
    }
  } catch (error) {
      res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(500).json({ error: 'An error occurred during the login process.' });
  } finally {
    await browser.close();
  }
});








const port = 3000; // Change this to your desired port
app.listen(port, () => {
  console.log(`Web service is running on port ${port}`);
});
