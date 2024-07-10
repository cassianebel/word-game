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

async function handleSubmit(guess, inputs) {
  const answer = await getWord(); 
  const isValid = await validateWord(guess);
  
  // check for 5 letters
  if (guess.length < 5) {
    console.log('too short');
  }
  // validate that the guess it is a word
  if (!isValid) {
    console.log('not valid word');
  }
  // disalbe the inputs
  if (isValid && guess.length === 5) {
    for (var i = 0, len = inputs.length; i < len; ++i) {
      inputs[i].disabled = true;
    }
  }
  // check for a win
  if (guess === answer) {
    console.log('you got it!')
  }

  let answerArray = answer.split('');
  // check letters for exact match
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.toLowerCase() === answerArray[i]) {
        inputs[i].style.backgroundColor = 'lawngreen';
        answerArray.splice(i, 1, 'matched')
    }
  }
  // check letters for partial match
  for (let i = 0; i < inputs.length; i++) {
    let letter = inputs[i].value.toLowerCase();
    if (answerArray.includes(letter)) {
        inputs[i].style.backgroundColor = 'yellow';
        answerArray.splice(answerArray.indexOf(letter), 1, 'matched')
    }
  }
}

const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const inputs = form.querySelectorAll('input');
    const values = [];
    inputs.forEach(input => values.push(input.value));
    const guess = values.join('').toLowerCase();

    handleSubmit(guess, inputs);
  });
});






