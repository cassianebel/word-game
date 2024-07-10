const message = document.querySelector('.alert');
const forms = document.querySelectorAll('form');

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
  console.log(guess)
  // check for 5 letters
  if (guess.length < 5) {
    message.innerText = "Must be a five letter word."
    message.style.display = "block"
  }
  // validate that the guess it is a word
  if (!isValid) {
    message.innerText = "Must be a valid word.";
    message.style.display = "block";
  }
  // disalbe the inputs
  if (isValid && guess.length === 5) {
    for (var i = 0, len = inputs.length; i < len; ++i) {
      inputs[i].disabled = true;
      message.style.display = "none";
    }
  }
  // check for a win
  if (guess === answer) {
    message.innerText = "You got it!";
    message.classList.add('win');
    message.style.display = "block";
    document.querySelectorAll('input').disabled = true;
  }
  // gray out all letters
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.backgroundColor = 'lightgray';
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






