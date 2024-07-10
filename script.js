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

const spaces = document.querySelectorAll('.letter');
// const spaces = []
// letterDivs.forEach(space => {
//   spaces.push({ space: space, content: null});
// });

document.addEventListener('keydown', (event) => {
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
  } else if (event.key === "Backspace"){
    let index = null;
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].innerText === '') {
        index = i - 1;
        break; // Exit the for loop
      }
    }
    console.log(index)
    if (index !== null && index !== -1) {
      spaces[index].innerText = '';
    }

  } else if (event.key === "enter") {

  } else if (!isLetter(event.key)) {
    event.preventDefault();
  }
})