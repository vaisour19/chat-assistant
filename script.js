require('dotenv').config();

const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");

let userMessage;

const createChatLi = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent =
        className === "outgoing"
            ? `<p>${message}</p>`
            : `<span class="material-icons">smart_toy</span><p>${message}</p>`;
    chatli.innerHTML = chatContent;
    return chatli;
};

const generateResponse = () => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatbox.querySelector(".chat.incoming p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent =
                "Oops, something went wrong. Please try again.";
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) return;

    // appending user message to chat box
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking.......", "incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse();
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
