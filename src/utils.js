
function randomWord(customWords) {
  if (!customWords || customWords.length === 0) {
    throw new Error("The words array is empty or undefined.");
  }
  return customWords[Math.floor(Math.random() * customWords.length)];
}

function getFarewellText(language) {
  if (!language || typeof language !== "string") {
    throw new Error("Invalid language parameter.");
  }

  const options = [
    `Farewell, ${language}`,
    `Adios, ${language}`,
    `R.I.P., ${language}`,
    `We'll miss you, ${language}`,
    `Oh no, not ${language}!`,
    `${language} bites the dust`,
    `Gone but not forgotten, ${language}`,
    `The end of ${language} as we know it`,
    `Off into the sunset, ${language}`,
    `${language}, it's been real`,
    `${language}, your watch has ended`,
    `${language} has left the building`
  ];

  return options[Math.floor(Math.random() * options.length)];
}

// Combined export
export { randomWord, getFarewellText };