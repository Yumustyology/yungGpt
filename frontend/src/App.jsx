import { useState, useRef, useEffect } from "react";
import "./App.css";
import send from "./assets/send.svg";
import botIcon from "./assets/bot.svg";
import userIcon from "./assets/user.svg";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  const form = useRef(null);
  const chatContainer = useRef(null);

  let loadInterval;

  function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
      element.textContent += ".";
      if (element.textContent === "....") {
        element.textContent = "";
      }
    }, 300);
  }

  function typeText(element, text) {
    let index = 0;
    element.innerHTML = ''
    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        console.log(loadInterval);
      }
    }, 20);
  }

  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalNumber = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalNumber}`;
  }

  const chatSection = (isYung, value, uniqueId) => {
    return `<div class="wrapper ${isYung && "ai"}">
            <div class="chat">
              <div class="profile">
                <img src="${isYung ? botIcon : userIcon}" 
                alt="${isYung ? "botIcon" : "userIcon"}"
                />
              </div>
              <div class="message" id="${uniqueId}">
                ${value}
              </div>
            </div>
          </div> 
        `;
  };

  const getAnswers = async () => {
    if (question.length === 0) return;

    const resp = fetch("https://yunggpt.onrender.com", {
      method: "POST",
      mode:'no-cors',
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
      }),
    })
      .then((data) => data.json())
      .then((response) => {
        clearInterval(loadInterval);
        setAnswer(response);
        setQuestion("");
      })
      .catch((error) => {
        console.log("there's an error ", error);
        const messageDiv = document.getElementById(uniqueId)
        clearInterval(loadInterval);
        typeText(messageDiv, "Something went nuts 🥜. Please try again.");
      });
  };

  useEffect(() => {
    const messageDiv = document.getElementById(uniqueId);
    if (answer.yung) {
      clearInterval(loadInterval);
      const parsedData = answer.yung.trim();
      messageDiv.innerHTML = "";
      typeText(messageDiv, parsedData);
      setAnswer("");
    }
  }, [answer]);

  useEffect(() => {
    const messageDiv = document.getElementById(uniqueId);
    if (!uniqueId) return;
    loader(messageDiv);
    getAnswers();
    messageDiv.innerHTML = "";
  }, [uniqueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //user chat section
    chatContainer.current.innerHTML += chatSection(false, question);
    // setQuestion("");

    // bot's chatStripe
    const uniqueId = generateUniqueId();
    setUniqueId(uniqueId);
    console.log(uniqueId);
    chatContainer.current.innerHTML += chatSection(true, " ", uniqueId);
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  };

  // form.current.addEventListener('submit',handleSubmit);
  // form.current.addEventListener('keyup',e=>{
  //   if(e.keyCode === 13){
  //     handleSubmit(e)
  //   }
  // });

  return (
    <div id="app">
      <div id="chat_container" ref={chatContainer}></div>
      <form>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Ask Yung..."
          ref={form}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button type="button" onClick={handleSubmit}>
          <img src={send} />
        </button>
      </form>
    </div>
  );
}

export default App;
