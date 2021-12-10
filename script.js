"use strict";

/* Aphasic Translator
    translates user speech input to resemble the speech of
    someone with Wernicke's aphasia
*/

$( document ).ready(function() {
    console.log( "ready!" );
    runSpeechRecognition();
});

// translate(str, offset)
//
// compare speech input against corpora and replace words if a match is found
function translate(str, offset) {
  let splitStr;
  if (str != undefined) {
    splitStr = str.split(" ");
  }
  if (splitStr != undefined) {
    $.getJSON("data/data.json", function( data ) {
      console.log("total categories: " + data.corpora.length);
      for (let i = 0; i < splitStr.length; i ++) { // cycle words
        let match = false;
        let j = 0;
        while (j < data.corpora.length  && !match) { // cycle available corpora
          let k = 0;
          while (k < data.corpora[j].list.length && !match) { //cycle list in corporus
            if (splitStr[i] && splitStr[i].toLowerCase() === data.corpora[j].list[k].toLowerCase()) { //compare word against corpus and if a match is found:
              console.log("match: " + splitStr[i]);
              console.log("list length: " + data.corpora[j].list.length);
              console.log("offset: " + offset);
              if ((k + 1) + offset > data.corpora[j].list.length) { //if index of word in corpus plus offset is longer than length of corpus, cycle through corpus from beginning
                let offsetCycled = offset - (data.corpora[j].list.length - (k + 1));
                k = offsetCycled;
              }
              else {
                k += offset;
              }
              splitStr[i] = data.corpora[j].list[k]; // replace word with new word from this corpus
            }
            k++;
          }
          j++;
        }
      }
    })
    .done(function() {
      console.log("success");
      if (splitStr != undefined) {
        for (let i = 0; i < splitStr.length; i++) {
          console.log(splitStr[i]);
        }
        let joinedStr = splitStr.join(" "); // join output words into one string
        $("#words").text(joinedStr); // update DOM with joined output
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log( "complete" );
    });
  }

}

// runSpeechRecognition()
//
// handle speech recognition and pass results to translate() function
function runSpeechRecognition() {
  var speechRecognition = window.webkitSpeechRecognition;
  var recognition = new speechRecognition();
  var content = "";
  let offset;

  recognition.continuous = true;

  recognition.onstart = function() {
   console.log("Voice Recognition is On");
   $("#status").text("listening...");
   $("#status").css("color", "#04944E");
  }

  recognition.onspeechend = function() {
    console.log("Speech ended");
    $("#status").text("click start to activate speech recognition...");
    $("#status").css("color", "#F72D41");
  }

  recognition.onerror = function() {
   console.log("Try Again");
  }

  recognition.onresult = function(event) {

    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;

    content += transcript;

    let str = content;
    translate(str, offset);
    content = "";

  }

  $("#start-btn").click(function(event) {

  console.log("clicked");
   recognition.start();
   // set offset index of replacement word from input word
   offset = randomFromInterval(3,13);
  });

  $("#stop-btn").click(function(event) {
   $("#words").text("");
   recognition.stop();
  });

}

// randomFromInterval(min,max)
//
// return random whole number between two numbers
function randomFromInterval(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/* assign each new person random offset number */
