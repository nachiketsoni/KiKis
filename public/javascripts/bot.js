const btn = document.querySelector(".bot");
const content = document.querySelector(".content");
const icon = document.querySelector(".content i");
// const searched = document.querySelector('#searched');
// const searchResult = document.querySelector('#searchresult');
function pausehoja() {
  document.querySelector("#vid").pause();
}
function speak(sentence) {
  const text_speak = new SpeechSynthesisUtterance(sentence);

  text_speak.rate = 1;
  text_speak.pitch = 1;

  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hr = day.getHours();

  if (hr >= 0 && hr < 12) {
    // searchResult.textContent="Good Morning, How can i help you?"

    speak("Good Morning How can i help you");
  } else if (hr == 12) {
    // searchResult.textContent="Good noon, How can i help you?"

    speak("Good noon How can i help you");
  } else if (hr > 12 && hr <= 17) {
    // searchResult.textContent="Good Afternoon, How can i help you?"

    speak("Good Afternoon How can i help you");
  } else {
    // searchResult.textContent="Good Evening, How can i help you?"

    speak("Good Evening How can i help you");
  }
}

window.addEventListener("load", () => {
  //     wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  // searched.textContent = transcript;

  speakThis(transcript.toLowerCase());
};

content.addEventListener("click", () => {
  recognition.start();
  icon.style.color = "red";
});
recognition.addEventListener("end", () => {
  icon.style.color = "black";

  // document.querySelector(".content").textContent="Tap to start"
});

function speakThis(message) {
  const speech = new SpeechSynthesisUtterance();

  if (
    message.includes("hey") ||
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hay")
  ) {
    const finalText = "Hello Buddy";
    // searchResult.textContent=finalText

    speech.text = finalText;
  } else if (message.includes("how are you")) {
    const finalText = "I am fine buddy tell me how can i help you";
    // searchResult.textContent=finalText

    speech.text = finalText;
  } else if (
    message.includes("what is your name") ||
    message.includes("who are you")
  ) {
    const finalText = "My name is KIKI, I'm your companion";
    // searchResult.textContent=finalText
    speech.text = finalText;
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    const finalText = "Opening Google";
    speech.text = finalText;
  } else if (message.includes("open instagram")) {
    window.open("https://instagram.com", "_blank");
    const finalText = "Opening instagram";
    speech.text = finalText;
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("what are") ||
    message.includes("search")
  ) {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    const finalText = "This is what i found on internet regarding " + message;
    speech.text = finalText;
  } else if (message.includes("wikipedia")) {
    window.open(
      `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`,
      "_blank"
    );
    const finalText = "This is what i found on wikipedia regarding " + message;
    speech.text = finalText;
  } else if (message.includes("play")) {
    axios.get(`/bot/search/${message}`).then(function (resp) {
      document.querySelector("#result").innerHTML = ``;

      resp.data.forEach(function (elem, i) {
        videoIdhai = elem.id.videoId.toString();
        console.log(videoIdhai);
        document.querySelector(
          "#result"
        ).innerHTML += `<h4 href="https://www.youtube.com/embed/${videoIdhai}?enablejsapi=1&html5=1" target="_blank"  onclick="return show(this)"  >${elem.snippet.title}</h4>`;
      });
    });

  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    const finalText = time;
    // searchResult.textContent=finalText

    speech.text = finalText;
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    const finalText = date;
    // searchResult.textContent=finalText

    speech.text = finalText;
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    const finalText = "Opening Calculator";
    speech.text = finalText;
  } else {
    speech.text = "I did not understand what you said please try again";
  }

  speech.volume = 1;
  speech.pitch = 1;
  speech.rate = 1;

  window.speechSynthesis.speak(speech);
}
function show(id) {
  vidURL = id.getAttribute("href");

  console.log(vidURL);
  document.querySelector(
    "#result"
  ).innerHTML = `<iframe id="video" src="${vidURL}"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>`;
}
