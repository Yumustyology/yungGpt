import { useState, useRef, useEffect } from "react";
import "./App.css";
import send from "./assets/send.svg";
import botIcon from "./assets/bot.svg";
import userIcon from "./assets/user.svg";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

// https://dribbble.com/OWWStudio
function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
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
    element.innerHTML = "";
    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        // console.log(loadInterval);
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

  let apiKey = "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";

  const getAnswers = async () => {
    // console.log(question);
    if (question.length === 0) return;
    // console.log('trying to fetch answers');
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: `${question}`,
          // max_tokens: 150,
          temperature: 0.7,
          n: 1,
          // stop: "\n",
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
          max_tokens: 4000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      clearInterval(loadInterval);
      // console.log(response?.data?.choices[0]?.text);
      // console.log(response);
      const messageDiv = document.getElementById(uniqueId);
      clearInterval(loadInterval);
      const parsedData = response?.data?.choices[0]?.text.trim();
      messageDiv.innerHTML = "";
      typeText(messageDiv, parsedData);
      setAnswer("");
      setQuestion("");
    } catch (error) {
      console.log("there's an error ", error.message);
      const messageDiv = document.getElementById(uniqueId);
      clearInterval(loadInterval);
      typeText(messageDiv, "Something went nuts 🥜. Please try again.");
    }
  };

  // useEffect(() => {
  // const messageDiv = document.getElementById(uniqueId);
  //   if (answer != null) {
  //     console.log('yoroshku');
  //     console.log(answer);
  //     clearInterval(loadInterval);
  // const parsedData = answer.trim();
  // messageDiv.innerHTML = "";
  // typeText(messageDiv, parsedData);
  // setAnswer("");
  //   }
  // }, [answer]);

  useEffect(() => {
    const messageDiv = document.getElementById(uniqueId);
    // console.log('uniqe id eyy',uniqueId);
    // if (!uniqueId) console.log('the unique id is not set');
    if (!uniqueId) return;
    // console.log('the unique id is set',uniqueId);
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
    // console.log(uniqueId);
    chatContainer.current.innerHTML += chatSection(true, " ", uniqueId);
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    // getAnswers()
  };

  //  useEffect(()=>{
  //   form.current.addEventListener('submit',handleSubmit);
  //   form.current.addEventListener('keyup',e=>{
  //     if(e.keyCode === 13){
  //       handleSubmit(e)
  //     }
  //   });
  //  },[])

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
