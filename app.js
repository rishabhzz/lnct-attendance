const express = require('express');
const puppeteer = require('puppeteer');
const app = express();




//rate limitor start
const rateLimitWindowMs = 30 * 1000; // 30 secs
const maxRequestsPerWindow = 2; //1 per request
const requestCount = {}; 

app.use((req, res, next) => {

  const { username } = req.query;
 
    const now = Date.now();
     if (!requestCount[username]) {
       requestCount[username] = [];
     }
 
     // Remove requests older than the rate limit window
     requestCount[username] = requestCount[username].filter((timestamp) => timestamp > now - rateLimitWindowMs);


      if (requestCount[username].length < maxRequestsPerWindow) {
       // If the request count is within the limit, allow the request
       requestCount[username].push(now);
       next();
     } else {
       console.log("multiple requess stopped");
        res.status(208).json({ error: 'Rate limit exceeded' });

     } 
});

//rate limitor end




app.get('/attendance', async (req, res) => {
  const { username, password, clg } = req.query;
  
  console.log(" request came to /attendance ");
    console.log("username : "+ username + " password : " + password);

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Launch a headless browser and run the Puppeteer script
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

if(clg == undefined){
  await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');
}else{
  await page.goto('https://accsoft.lnctu.ac.in/AccSoft2/StudentLogin.aspx');
}


 // Fill in the login form and submit
 await page.type('#ctl00_cph1_txtStuUser', username);
 await page.type('#ctl00_cph1_txtStuPsw', password);


try{
    await Promise.all([page.waitForNavigation(), page.click('#ctl00_cph1_btnStuLogin')]);
    console.log("Login Success for attendance");
   await page.waitForXPath('//a[@href="StuAttendanceStatus.aspx"]');
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


  await page.waitForSelector('#ctl00_ContentPlaceHolder1_lblPer'); 
 const successElement = await page.$('#ctl00_ContentPlaceHolder1_lblPer');
 const percentage = await successElement.evaluate(element => element.textContent);

 const successElement2 = await page.$('#ctl00_ContentPlaceHolder1_lbltotperiod');
 const total = await successElement2.evaluate(element => element.textContent);

 const successElement3 = await page.$('#ctl00_ContentPlaceHolder1_lbltotalp');
 const present = await successElement3.evaluate(element => element.textContent);

 const successElement4 = await page.$('#ctl00_ContentPlaceHolder1_lbltotala');
 const absent = await successElement4.evaluate(element => element.textContent);
   res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(200).json({ total: total, percentage: percentage, present : present, absent: absent  });
   
  }catch(error){
    console.log("Login failed");
   res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 return res.status(500).json({ error: 'An error occurred during the process.' });
   
  }finally{

await browser.close();
}
  
  
  
});


app.get('/login', async (req, res) => {
  const { username, password, clg } = req.query;
  console.log("request came to /login");
  console.log("username : "+ username + " password : " + password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();



  try {

   
if(clg == undefined){
  await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');
}else{
  await page.goto('https://accsoft.lnctu.ac.in/AccSoft2/StudentLogin.aspx');
}

 await page.type('#ctl00_cph1_txtStuUser', username);
 await page.type('#ctl00_cph1_txtStuPsw', password);

  try{
    await Promise.all([page.waitForNavigation(), page.click('#ctl00_cph1_btnStuLogin')]);
    console.log("Login Success");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({ login: "success" });
  }catch(error){
    console.log("Login failed - incorrect creds");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(400).json({ error: 'Login failed. No Navigation took place'});
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







//subject wise

app.get('/sub', async (req, res) => {
  const { username, password, clg } = req.query;
  
   console.log(" request came to /subject ");
    console.log("username : "+ username + " password : " + password);

  // Ensure username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Launch a headless browser and run the Puppeteer script
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

if(clg == undefined){
  await page.goto('https://portal.lnct.ac.in/Accsoft2/StudentLogin.aspx');
}else{
  await page.goto('https://accsoft.lnctu.ac.in/AccSoft2/StudentLogin.aspx');
}


 // Fill in the login form and submit
 await page.type('#ctl00_cph1_txtStuUser', username);
 await page.type('#ctl00_cph1_txtStuPsw', password);


try{
    await Promise.all([page.waitForNavigation(), page.click('#ctl00_cph1_btnStuLogin')]);
    console.log("Login Success for subject wise");

  
   

   const link = 'https://portal.lnct.ac.in/Accsoft2/parents/subwiseattn.aspx'
  await page.goto(link);
  

  
       // Clicking the link by navigating to its URL
     // console.log('Link clicked successfully');


      await page.waitForSelector('table#ctl00_ContentPlaceHolder1_grd');

      async function extractTableData(selector) {
        const tableData = await page.evaluate(selector => {
          const table = document.querySelector(selector);
          const rows = Array.from(table.querySelectorAll('tr'));
    
          const data = [];
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            const rowData = cells.map(cell => cell.textContent.trim());
            data.push(rowData);
          }
    
          return data;
        }, selector);
    
        return tableData;
      }


  const table2Data = await extractTableData('table#ctl00_ContentPlaceHolder1_grd');


const rows = table2Data.slice(1).map(row => {
  return `👉🏻: ${row[1]} \n Total: ${row[2]} \n Attended: ${row[3]}`;
});


   res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(200).json(rows.join('\n \n'));

   
  }catch(error){
    console.log("Login failed");
   res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 return res.status(500).json({ error: 'An error occurred during the process.' + error });
   
  }finally{

await browser.close();
}
  
  
  
});


//subject wise end



const port = 3000; // Change this to your desired port
app.listen(port, () => {
  console.log(`Web service is running on port ${port}`);
});
