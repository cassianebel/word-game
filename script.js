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

document.addEventListener('keydown', async (event) => {
  const spaces = document.querySelectorAll('.letter:not(.disabled)');
  const spacesArray = Array.from(spaces);
  // if a letter is typed - place it in the first available spot
  if (isLetter(event.key)) {
    let index = null;
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].innerText === '') {
        index = i;
        break; // Exit the for loop
      }
    }
    if (index !== null) {
      spaces[index].innerText = event.key;
    }
  // if a backspace is typed - delete the last letter
  } else if (event.key === "Backspace"){
    let index = null;
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].innerText === '') {
        index = i - 1;
        break; // Exit the for loop
      }
    }
    if (index !== null && index !== -1) {
      spaces[index].innerText = '';
    }
  // if enter is typed, check all the things
  } else if (event.key === "Enter" && spaces.length > 0) {
    const guessArray = [];
    let isFive = false;
    // check for 5 letters and create the guess array
    for (let i = 0; i < 5; i++) {
      if (!spaces[i].innerText) {
        console.log('must be a 5 letter word')
        break;
      } else {
        guessArray.push(spaces[i].innerText)
      }
      isFive = true;
    }
    // check if the guess is a valid word
    const guess = guessArray.join('');
    const isValid = await validateWord(guess);
    if (!isValid) {
      console.log('must be a valid word');
    }
    // if the guess is valid, check for matching letters
    const answer = await getWord(); 
    let answerArray = answer.split('');
    if (isFive && isValid) {
      // check for exact matches
      for (let i = 0; i < answerArray.length; i++) {
        if (spaces[i].innerText === answerArray[i]) {
          spaces[i].classList.add('match');
          answerArray.splice(i, 1, 'matched');
        }
      }
      // check for partial matches
      for (let i = 0; i < answerArray.length; i++) {
        if (answerArray.includes(spaces[i].innerText)) {
          spaces[i].classList.add('partial');
          answerArray.splice(answerArray.indexOf(spaces[i].innerText), 1, 'matched');
        }
      }
      // check for a win
      if (guess === answer) {
        console.log("You got it!");
      }
      // disable the 5 letters for this guess (removes them from spaces list)
      for (let i = 0; i < 5; i++) {
        spaces[i].classList.add('disabled');
      }
    }
  // if anything else is typed ignore it
  } else if (!isLetter(event.key)) {
    event.preventDefault();
  }
})