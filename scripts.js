async function getWord() {
  const url = "https://words.dev-apis.com/word-of-the-day";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json.word);
    return json.word;
  } catch (error) {
    console.error(error.message);
  }
}

const answer = getWord();

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Form submitted');
  });
});

