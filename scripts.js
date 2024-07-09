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

async function handleSubmit() {
  const answer = await getWord();
  // console.log(answer);
  const isValid = await validateWord(guess);
  // console.log(isValid);
  // validate
  if (guess.length < 5) {
    console.log('too short');
  }
  if (!isValid) {
    console.log('not valid word');
  }
  
  // check for a win
  if (guess === answer) {
    console.log('you got it!')
  }
}

let guess;
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const inputs = form.querySelectorAll('input');
    const values = [];
    inputs.forEach(input => values.push(input.value));
    guess = values.join('');

    handleSubmit();
  });
});






