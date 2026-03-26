const API_KEY="AIzaSyCSva4NmIHnI_1BIkpqD9jkLBnsdEs-6Hg";
const text="open calculator";
const body = {
  contents: [{
    parts: [{
      text: "Extract task details and return STRICT JSON.\nRules:\n- Always return all fields\n- If date missing return ''\n- If time missing return ''\n- If priority missing return 'normal'\n- If the user wants to open an application, return 'open <executable_name>' for the task field. Guess the standard Windows executable name (e.g. 'open notepad', 'open calc', 'open code', 'open spotify', 'open mspaint').\nReturn format:\n{\n  'task': '',\n  'date': '',\n  'time': '',\n  'priority': ''\n}\nSentence: '"+text+"'"
    }]
  }]
};
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+API_KEY, {
  method:'POST', 
  headers:{'Content-Type':'application/json'}, 
  body:JSON.stringify(body)
})
.then(r=>r.json())
.then(j => console.log(JSON.stringify(j, null, 2)))
.catch(console.error);