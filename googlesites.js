const login = `
<script src="https://cdn.jsdelivr.net/gh/blueegg063/bcsd5connect/googlesites.js"></script>
<style>
  html {
    background-image: url('https://raw.githubusercontent.com/BlueEgg063/bcsd5connect/main/favicon.png');
    background-repeat: no-repeat;
  }
  .button {
    padding: 15px 30px;
    background-color: darkgreen;
    border-radius: 40px;
  }
  .button:hover {
    padding: 15px 30px;
    background-color: rgb(61, 207, 61);
    border-radius: 40px;
  }
</style>
<div style="display:flex; justify-content:center; align-items:center; height:100vh;">
  <div>
    <h1><strong>Login</strong></h1>
    <h3>Username:</h3>
    <input id="name"><br>
    <h3>Password:</h3>
    <input id="psk" type="password"><br><br>
    <button class="button" onclick="handleSend()">Log in</button>
    <p id="box"></p>
    <p>
      Don't have an account? Sign up 
      <button onclick="localStorage.setItem('endpoint', 'signup'); page();">here</button>
    </p>
  </div>
</div>
<script>
  async function handleSend() {
    const name = document.getElementById('name').value;
    const psk = document.getElementById('psk').value;
    const msgbox = document.getElementById('box');
    msgbox.innerHTML = '';
    if (!name || !psk) {
      msgbox.textContent = "Please enter both username and password.";
      return;
    }
    const result = await sendMessage(name, psk);
    if (result.status === 'success') {
      msgbox.innerHTML = "Success! Continue to <button onclick='localStorage.setItem(\"endpoint\", \"msg\"); page();'> the main messageboard?</button>";
      localStorage.setItem("username", name);
      localStorage.setItem("logged_in", true);
    } else if (result.status === 'wrong') {
      msgbox.innerHTML = "Wrong password.";
    } else if (result.status === '404') {
      msgbox.innerHTML = "Username not found. Create account <button onclick=\"localStorage.setItem('endpoint', 'signup'); page();\">here</button>?";
    } else {
      msgbox.innerHTML = "An unknown error occurred. Please refresh.";
    }
    document.getElementById('name').value = '';
    document.getElementById('psk').value = '';
  }

  async function sendMessage(name, password) {
    const formData = new URLSearchParams();
    formData.append('action', 'login');
    formData.append('Name', name);
    formData.append('Password', password);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw9kcsznCM9stcAanjXMQAX2rFgEHlVIrJUI2zk9yFBjpmZxzMBXWPLA3ysi_C6Pmew/exec', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData.toString()
      });
      const result = await response.json();
      console.log('Message sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      return { status: 'error', message: error.toString() };
    }
  }
</script>
`;

const msg = `
<head>
  <script src="https://cdn.jsdelivr.net/gh/blueegg063/bcsd5connect/googlesites.js"></script>
  <link rel="icon" href="https://raw.githubusercontent.com/BlueEgg063/bcsd5connect/main/favicon.png" type="image/x-icon"/>
  <meta charset="UTF-8"/>
  <title>BCSD5Connect</title>
  <style>
    #inputContainer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      border-top: 1px solid #ccc;
      padding: 10px;
      display: flex;
      gap: 10px;
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    }
    #inputContainer div {
      flex: 1;
      padding: 8px;
      font-size: 16px;
    }
    #inputContainer button {
      padding: 8px 16px;
      font-size: 16px;
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 4px;
    }
    #msgs {
      white-space: pre-wrap;
      font-family: monospace;
      background-color: #f4f4f4;
      padding: 10px;
      border: 1px solid #ccc;
    }
    #msgtitle {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #fff;
      border: 2px solid #007BFF;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .messages {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #fff;
      border: 2px solid #007BFF;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div id="inputContainer">
    <label for="photo"><img src="photo.png" alt="Upload photo"></label>
    <input type="file" id="photo" style="display:none;" accept="image/*">
    <div id="messageInput" contenteditable="true" style="border:1px solid #ccc; padding:8px; min-height:30px;"></div>
    <button onclick="handleSend()">Send</button>
  </div>

  <h2 id="msgtitle">BCSD5Connect</h2>
  <div id="msgs"></div>

  <script>
    let myname = localStorage.getItem("username");
    let logged_in = localStorage.getItem("logged_in");
    let admin = false;

    if (logged_in !== "true") {
      localStorage.setItem("endpoint", "login");
      page();
    }

    const displayed = new Set();

    function linkify(text) {
      const urlRegex = /https?:\/\/[^\s<>"']+/g;
      return text.replace(urlRegex, (url) => \`<a href="\${url}" target="_blank" rel="noopener noreferrer">\${url}</a>\`);
    }

    async function getMessages() {
      const msgs = document.getElementById("msgs");
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbw9kcsznCM9stcAanjXMQAX2rFgEHlVIrJUI2zk9yFBjpmZxzMBXWPLA3ysi_C6Pmew/exec");
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const messages = Array.isArray(data) ? data : [data];
        if (messages.length > 0) {
          for (const msg of messages) {
            const key = msg["Date"] + "_" + msg["Name"];
            if (displayed.has(key)) continue;
            displayed.add(key);
            const div = document.createElement("div");
            div.classList.add("messages");
            div.innerHTML = \`
              <h3>\${msg["Name"]}</h3>
              <strong>\${new Date(msg["Date"]).toISOString()}</strong>
              <p>\${msg["Msg"]}</p>
            \`;
            msgs.appendChild(div);
          }
        } else {
          msgs.textContent = "";
        }
        console.log("Messages loaded:", messages);
      } catch (error) {
        msgs.textContent = "";
        console.error(error);
      }
    }

    function handleSend() {
      const input = document.getElementById('messageInput');
      const message = input.innerHTML.trim();

      if (message === "#admin7984") {
        alert("You have attempted to enter admin mode");
        const verify = prompt("Please enter admin credentials now");
        if (verify === "0DAZ4G84") {
          admin = true;
          alert("Successfully entered admin mode");
          input.innerHTML = '';
        } else {
          alert("Incorrect credentials.");
          input.innerHTML = '';
        }
      } else if (message) {
        sendMessage(myname, message);
        input.innerHTML = '';
      }
    }

    async function sendMessage(name, message) {
      const formData = new URLSearchParams();
      formData.append('action', 'msg');
      formData.append('Name', name);
      formData.append('Date', new Date().toISOString());
      formData.append('Msg', linkify(message));
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw9kcsznCM9stcAanjXMQAX2rFgEHlVIrJUI2zk9yFBjpmZxzMBXWPLA3ysi_C6Pmew/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
        const result = await response.json();
        console.log('Message sent:', result);
        return result;
      } catch (error) {
        console.error('Error sending message:', error);
        return { status: 'error', message: error.toString() };
      }
    }

    let photo_data = null;
    const inputPhoto = document.getElementById('photo');
    inputPhoto.addEventListener('change', function () {
      const file = inputPhoto.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          photo_data = e.target.result;
          document.getElementById("messageInput").innerHTML += "<br>" + \`<img src="\${photo_data}">\`;
        };
        reader.readAsDataURL(file);
      }
    });

    getMessages();
    setInterval(getMessages, 1000);
  </script>
</body>
`;

const signup = `
<script src="https://cdn.jsdelivr.net/gh/blueegg063/bcsd5connect/googlesites.js"></script>
<style>
  html {
    background-image: url('https://raw.githubusercontent.com/BlueEgg063/bcsd5connect/main/favicon.png');
    background-repeat: no-repeat;
  }
  .button {
    padding: 15px 30px;
    background-color: darkgreen;
    border-radius: 40px;
  }
  .button:hover {
    padding: 15px 30px;
    background-color: rgb(61, 207, 61);
    border-radius: 40px;
  }
</style>
<div style="display:flex; justify-content:center; align-items:center; height:100vh;">
  <div>
    <h1><strong>Signup</strong></h1>
    <h3>Username:</h3>
    <input id="name"><br>
    <h3>Password:</h3>
    <input id="psk" type="password"><br><br>
    <button class="button" onclick="handleSend()">Sign up</button>
    <p id="box"></p>
    <p>
      Already have an account? Log in 
      <button onclick='localStorage.setItem("endpoint", "login"); page()'>here</button>
    </p>
  </div>
</div>
<script>
  async function handleSend() {
    const name = document.getElementById('name').value;
    const psk = document.getElementById('psk').value;
    const msgbox = document.getElementById('box');
    msgbox.innerHTML = '';
    if (!name || !psk) {
      msgbox.textContent = "Please enter both username and password.";
      return;
    }
    const result = await sendMessage(name, psk);
    if (result.status === 'success') {
      msgbox.innerHTML = "Success! Continue to <button onclick='localStorage.setItem(\"endpoint\", \"msg\"); page()'> the main messageboard?</button>";
      localStorage.setItem("username", name);
      localStorage.setItem("logged_in", true);
    } else if (result.status === 'present') {
      msgbox.innerHTML = "Username already present. If this is you, please <a href='../'>login</a>?";
    } else {
      msgbox.innerHTML = "An unknown error occurred. Please refresh.";
    }
    document.getElementById('name').value = '';
    document.getElementById('psk').value = '';
  }

  async function sendMessage(name, password) {
    const formData = new URLSearchParams();
    formData.append('action', 'signup');
    formData.append('Name', name);
    formData.append('Password', password);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw9kcsznCM9stcAanjXMQAX2rFgEHlVIrJUI2zk9yFBjpmZxzMBXWPLA3ysi_C6Pmew/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      const result = await response.json();
      console.log('Message sent:', result);
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      return { status: 'error', message: error.toString() };
    }
  }
</script>
`;

function page(){
  let endpoint=localStorage.getItem("endpoint");
  if (!endpoint){
    document.getElementById("html").innerHTML=msg;
  } else if (endpoint == 'login'){
      document.getElementById("html").innerHTML=login;
} else if (endpoint =='signup'){
  document.getElementById("html").innerHTML=signup;
}
else {
  document.getElementById("html").innerHTML=msg;
}
