class Hangman {

   guesses = []
   isOver = false
   didWin = false
   word = ""
   totalWrongGuesses = 0
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  start(difficulty, next) {
    // get word and set it to the class's this.word
    this.getRandomWord(difficulty).then(word => {
      this.word = word
      next(word)
    })

    // clear canvas
    this.clearCanvas()

    // draw base
    this.drawBase()

    // reset this.guesses to empty array
    this.guesses = []
   
    // reset this.isOver to false
    this.isOver = false
    
    // reset this.didWin to false
    this.didWin = false
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    // Check if nothing was provided and throw an error if so

    try{
    const regex = new RegExp("^[a-zA-Z]$")

    if(letter == null || letter == undefined || letter == ""){
      throw ("No guess was provided")
    }

    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
   else if(!regex.test(letter)){
      throw ("Not a valid guess")
    }

    // Check if more than one letter was provided. throw an error if it is.

  else  if(letter.length > 1){
      throw ("Your guess can contain only one letter.")
    }
    else{
      letter = letter.toLowerCase()

      if(this.guesses.includes(letter)){
        throw ("The letter has already been guessed")
      }else{
        this.guesses.push(letter)

        if(this.word.includes(letter)){
          this.checkWin()
        }else{
          this.onWrongGuess()
        }
      }
    }

  }catch(error){
    alert(error)

    }



    // if it's a letter, convert it to lower case for consistency.
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true

    let allLettersGuessed = true
    for(let i = 0; i < this.word.length; i++){
      if(!this.guesses.includes(this.word.charAt(i))){
        allLettersGuessed = false
      }
    }
    if(allLettersGuessed){
      this.didWin = true
      this.isOver = true
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {

    this.totalWrongGuesses += 1

    if(this.totalWrongGuesses == 1){
      this.drawHead()
    }else if (this.totalWrongGuesses == 2){
      this.drawBody()
    }
    else if (this.totalWrongGuesses == 3){
      this.drawRightArm()
    }
    else if (this.totalWrongGuesses == 4){
      this.drawLeftArm()
    }
    else if (this.totalWrongGuesses == 5){
      this.drawRightLeg()
    }
    else if (this.totalWrongGuesses == 6){
      this.drawLeftLeg();
      this.isOver = true
      this.didWin = false
    }


  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {

    let holderText = ""

    for(let i = 0; i < this.word.length; i++){
      if(this.guesses.includes(this.word.charAt(i))){
        holderText += this.word.charAt(i)
      }else{
        holderText += " _ "
      }
    }
    return holderText
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return "Guesses: " + this.guesses.join(", ")
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top 
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {

    this.ctx.arc(245,100, 40, 0, 2 * Math.PI, false)
    this.ctx.stroke()
  }

  drawBody() {
    this.ctx.fillRect(220, 140, 50, 100); 
  }

  drawLeftArm() {
    this.ctx.fillRect(170, 180, 100, 10); 

  }

  drawRightArm() {
    this.ctx.fillRect(220, 180, 100, 10);

  }

  drawLeftLeg() {

    this.ctx.resetTransform()

    this.ctx.rotate(-20 * Math.PI / 180);

    this.ctx.fillRect(90, 290, 50, 10);

  }

  drawRightLeg() {

    this.ctx.rotate(20 * Math.PI / 180);
    this.ctx.fillRect(320, 120, 50, 10);
  }
}
