
const form = document.getElementById("chat-form");
const input = document.getElementById("question");
const chatBox = document.getElementById("chat-box");
const sendButton = form.querySelector("button");

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className = "message " + type;
    message.textContent = text;

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;

    return message;
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const question = input.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");
    input.value = "";
    sendButton.disabled = true;

    const loadingMessage = addMessage("Thinking...", "bot");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        loadingMessage.textContent = data.answer;

    } catch (error) {
        loadingMessage.textContent = "Error: " + error.message;

    } finally {
        sendButton.disabled = false;
        input.focus();
    }
});
