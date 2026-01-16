const socket = io();

socket.on("message history", (messages) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = '';
    messages.forEach((dataMessage) => {
        let p = document.createElement("p");
        p.textContent = `${dataMessage.username} - ${dataMessage.message}`;
        chatBox.appendChild(p);
    });
})

const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const inputUsername = document.getElementById("inputUsername");

formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = inputChat.value;
    const username = inputUsername.value;

    if (message.trim() === "" || username.trim() === "") return;

    inputChat.value = "";

    socket.emit("new message", { message, username });
});

socket.on("broadcast new message", (dataMessage) => {
    const chatBox = document.getElementById("chatBox");
    const p = document.createElement("p");
    p.textContent = `${dataMessage.username} - ${dataMessage.message}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
});