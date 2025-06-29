    async function getMessages() {
      const msgs= document.getElementById("msgs");
      //msgs.innerHTML="";
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxZ37d7xvLrVekpfcQ5thPYah9xdF-jjsPpZOoHR_VYPZ7NDKhL4CFs329sl4MlsUof/exec");

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        const messages = Array.isArray(data) ? data : [data];

        if (messages.length > 0) {
        for (var i = 0; i < (messages.length); i++){
          var msg = messages[i]; // Just show the first message for now
          var key=msg["Date"]+"_"+msg["Name"];
          if (displayed.has(key)){
            continue
          }
          else{
          displayed.add(key);
          const div=document.createElement("div");
          div.classList.add("messages");
          div.innerHTML=`<h3>${msg["Name"]}</h3><strong>${new Date(msg["Date"]).toISOString()}</strong><p>${msg["Msg"]}</p>`;
          msgs.appendChild(div);
          }
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
  const message = input.value.trim();

  if (message === "#admin7984") {
    alert("You have attempted to enter admin mode");
    const verify = prompt("Please enter admin credentials now");
    if (verify === "0DAZ4G84") {
      admin = true;
      alert("Successfully entered admin mode");
      input.value= '';
    } else {
      alert("Incorrect credentials.");
      input.value = '';
    }
  } else if (message) {
    sendMessage(myname, message);
    input.value = ''; // Clear input
  }
}


    async function sendMessage(name, message) {
  const formData = new URLSearchParams();
  formData.append('action','msg');
  formData.append('Name', name);
  formData.append('Date', new Date().toISOString());
  formData.append('Msg', message);

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxZ37d7xvLrVekpfcQ5thPYah9xdF-jjsPpZOoHR_VYPZ7NDKhL4CFs329sl4MlsUof/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
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
