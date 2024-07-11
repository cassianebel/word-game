async function getWord() {
  const url = "https://words.dev-apis.com/word-of-the-day";
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

let workingGuess = '';

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
        // replace the last letter once they hit 5 letters
        workingGuess = workingGuess.substring(0, workingGuess.length - 1) + event.key;
      }
      spaces[workingGuess.length - 1].innerText = event.key;

    // if a backspace is typed - delete the last letter
    } else if (event.key === "Backspace"){
      spaces[workingGuess.length - 1].innerText = '';
      workingGuess = workingGuess.substring(0, workingGuess.length - 1);

    // if enter is typed and they haven't used all their guesses - check all the things
    } else if (event.key === "Enter") {

      // check for 5 letters and create the guess array
      if (workingGuess.length < 5) {
        console.log('must be 5 letter word');
      }

      // check if the guess is a valid word
      const isValid = await validateWord(workingGuess);
      if (!isValid) {
        console.log('must be a valid word');
      }

      const answer = await getWord(); 
      // create answer array to track the letter matches
      let answerArray = answer.split('');

      // if the guess is valid, check for matching letters
      if (workingGuess.length === 5 && isValid) {

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
          }
        }

        // check for a win
        if (workingGuess === answer) {
          console.log("You got it!");
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