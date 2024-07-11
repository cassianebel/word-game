const message = document.querySelector('.message');
let workingGuess = '';
let answer;

async function getWord() {
  // ?random=1 gives a new word on each load, remove to keep the same word for the day
  const url = "https://words.dev-apis.com/word-of-the-day?random=1"; 
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    // console.log(json.word);
    return json.word;
  } catch (error) {
    console.error(error.message);
  }
}

async function validateWord(guess) {
  const url = "https://words.dev-apis.com/validate-word";
  try {
    const response = await fetch(url,{
      method: 'POST', 
      body: `{"word": "${guess}"}`, 
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    // console.log(json.validWord);
    return json.validWord;
  } catch (error) {
    console.error(error.message);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function init() {
  answer = await getWord(); 
}

init();

document.addEventListener('keydown', async (event) => {
  const spaces = document.querySelectorAll('.letter:not(.disabled)');

  // if they haven't used all their guesses
  if (spaces.length > 0) {
    // if a letter is typed - place it in the first available spot
    if (isLetter(event.key)) {
      if (workingGuess.length < 5) {
        // add last letter to the end of guess
        workingGuess += event.key;
      } else {
        // if another letter is typed after 5 replace the last letter
        workingGuess = workingGuess.substring(0, workingGuess.length - 1) + event.key;
      }
      spaces[workingGuess.length - 1].innerText = event.key;

    // if a backspace is typed - delete the last letter
    } else if (event.key === "Backspace"){
      // remove it from the DOM
      spaces[workingGuess.length - 1].innerText = '';
      // remove it from the workingGuess string
      workingGuess = workingGuess.substring(0, workingGuess.length - 1);

    // if enter is typed (and they haven't used all their guesses) - check all the things
    } else if (event.key === "Enter") {

      // check for 5 letters 
      if (workingGuess.length < 5) {
        message.classList.remove('hide');
        message.classList.add('alert');
        message.innerText = "Must be a 5 letter word."
      }

      // check if the guess is a valid word
      const isValid = await validateWord(workingGuess);
      if (!isValid) {
        message.classList.remove('hide');
        message.classList.add('alert');
        message.innerText = "Must be a valid word."
      }

      // create answer array to track the letter matches
      let answerArray = answer.split('');

      // if the guess is valid, check for matching letters
      if (workingGuess.length === 5 && isValid) {
        // hide the message alerts
        message.classList.add('hide');
        // check for exact matches
        for (let i = 0; i < answerArray.length; i++) {
          if (workingGuess[i] === answerArray[i]) {
            spaces[i].classList.add('match');
            answerArray.splice(i, 1, 'matched');
          }
        }

        // check for partial matches
        for (let i = 0; i < answerArray.length; i++) {
          if (answerArray.includes(spaces[i].innerText)) {
            spaces[i].classList.add('partial');
            answerArray.splice(answerArray.indexOf(spaces[i].innerText), 1, 'partial');
          } else {
            // spaces[i].classList.add('nope');
          }
        }

        // check for a win
        if (workingGuess === answer) {
          message.classList.remove('hide', 'alert');
          message.classList.add('win');
          message.innerText = "Impressive!"
        }

        // disable the 5 letters for this guess (removes them from spaces list)
        for (let i = 0; i < 5; i++) {
          spaces[i].classList.add('disabled');
        }

        // reset the guess
        workingGuess = '';
      }

    // if anything else is typed ignore it
    } else if (!isLetter(event.key)) {
      event.preventDefault();
    }
  }
})