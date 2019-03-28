import { Component, OnInit } from '@angular/core';
import { GameObject } from './game-object.model';
import { WordService } from '../shared/word-service';
import { IThesaurus } from '../shared/thesaurus';

@Component({
  selector: 'app-word-pong',
  templateUrl: './word-pong.component.html',
  styleUrls: ['./word-pong.component.css']
})
export class  WordPongComponent implements OnInit {

  thesaurus: IThesaurus;

  private xMin: number = 2;
  private yMin: number = 2;
  private xMax: number = 617;
  private yMax: number = 617;

  private interval;
  private movementStarted: boolean = true;
  private movementPaused: boolean = false;

  //public foundObject: number;
  //public hit: number;
  //public miss: number;
  //public score: number;

  public cardColor: string = "lightyellow";
  public message: string;
  public seedWord: string;
  public relatedWords: string[];
  public unrelatedWords: string[];
  public relatedWordNumber: number;
  public unrelatedWordNumber: number;

  gameObjects = Array<GameObject>();
  gameObjectNumber: number; 
  notRelatedNumber: number;
  temporaryGameObject: GameObject;

  constructor(private wordService: WordService) {

    //this.score = 0;
    // this.foundObject = 0;
    // this.hit = 0;
    // this.miss = 0;

    this.relatedWordNumber = 4;
    this.unrelatedWordNumber = 8;

    this.relatedWords = new Array<string>();
    this.unrelatedWords = new Array<string>();

    this.gameObjectNumber = 0;
    this.notRelatedNumber = 0;

    this.gameObjects = new Array<GameObject>();    
  }


  ngOnInit() {    
    
    this.seedWord = this.wordService.randomWord(1, "")[0];
    let unrelatedWords = this.wordService.randomWord(this.unrelatedWordNumber, this.seedWord);

    this.wordService.getThesaurus(this.seedWord).subscribe( 
      thesaurus => { 
        this.setUpGame(thesaurus, unrelatedWords);
      }
    );

  }

  setUpGame(thesaurus: IThesaurus, nonRelatedWords: string[]) {

    let nouns =  thesaurus.noun.syn.slice(0, this.relatedWordNumber);
    console.log(nouns);

    this.newGameObject("ball", "lightgreen", this.seedWord, true, this.randomGenerator(1, this.xMax), this.randomGenerator(1, this.yMax), 0, 0);

    nouns.forEach(noun => {
      this.newGameObject("obstacle", "lightblue", noun, true, this.randomGenerator(1, this.xMax), this.randomGenerator(1, this.yMax), this.randomGenerator(-2, 2), this.randomGenerator(-2, 2));
    });

    nonRelatedWords.forEach(word => {
      this.newGameObject("obstacle", "lightblue", word, false, this.randomGenerator(1, this.xMax), this.randomGenerator(1, this.yMax), this.randomGenerator(-2, 2), this.randomGenerator(-2, 2));
    })
    // this.newGameObject("obstacle", "lightblue", "aqua", false, this.randomGenerator(1, this.xMax), this.randomGenerator(1, this.yMax), this.randomGenerator(-2, 2), this.randomGenerator(-2, 2));
    // this.newGameObject("obstacle", "lightblue", "feline", false, this.randomGenerator(1, this.xMax), this.randomGenerator(1, this.yMax), this.randomGenerator(-2, 2), this.randomGenerator(-2, 2));
    
    this.gameObjects.forEach(obj => !obj.isRelated ? this.notRelatedNumber++ : false);
    this.startMovement();
  }

  objectStyle(id: number) {
    let object = this.gameObjects[id];

    return {
      "top": `${object.yPos}px`,
      "left": `${object.xPos}px`,
      "background": `${object.background}`,
    }
  }

  onMouseEvent($event) {
    let childEvent = $event.path[0];

    // if(childEvent.id == "card" && $event.type == "click"){
    //   this.miss += 1;
    // }
    // TODO indexOf is not working for some reason!!
    //console.log(childEvent.classList.indexOf("ball"));

    if(childEvent.classList[1] == "ball" || childEvent.classList[1] == "obstacle"){
      //console.log('event type: ', $event.type);
      this.gameObjectEvent(childEvent.id, $event.type);
    }
  }

  onKeyEvent($event) {
    let key = $event.key;
    switch(key){
      case "ArrowLeft": {
        this.movementPaused = false;
        this.gameObjects[0].xInc += this.gameObjects[0].xInc < 25 ? -0.2 : 0;
        break;
      }
      case "ArrowRight": {
        this.movementPaused = false;
        this.gameObjects[0].xInc += this.gameObjects[0].xInc > -25 ? 0.2 : 0;
        break;
      }
      case "ArrowDown": {
        this.movementPaused = false;
        this.gameObjects[0].yInc += this.gameObjects[0].yInc < 25 ? 0.2 : 0;
        break;
      }
      case "ArrowUp": {
        this.movementPaused = false;
        this.gameObjects[0].yInc += this.gameObjects[0].yInc > -25 ? -0.2 : 0;
        break
      }
      case " ": {
        if(this.movementPaused){
          this.movementPaused = false
        }else{
          this.movementPaused = true;
        }
        break;
      }
    }
  }

  private newGameObject(className: string, background: string, text: string, isRelated: boolean, xPos: number, yPos: number, xInc: number, yInc: number) {
    let gameObject = new GameObject();
    gameObject.id = this.gameObjectNumber;
    gameObject.className = className;
    gameObject.background = background;
    gameObject.text = text;
    gameObject.isRelated = isRelated;
    gameObject.xPos = xPos;
    gameObject.yPos = yPos;
    gameObject.xInc = xInc;
    gameObject.yInc = yInc;
    gameObject.isHit = false;
    this.gameObjects.push(gameObject);
    this.gameObjectNumber++;
  }

  private gameObjectEvent(id: number, eventType: string) {
    switch(eventType){
      // case "click": {
      //   this.hit += 1;
      //   break;
      // }
      case "mouseenter": {   
        this.temporaryGameObject = Object.assign({}, this.gameObjects[id]);

        this.gameObjects[id].xInc = 0;
        this.gameObjects[id].yInc = 0;

        // The version below will ensure nested objects include. I'm not using it
        // at the moment because there may be a small performance hit.
        //this.temporaryGameObject = JSON.parse(JSON.stringify(this.gameObjects[id]));

        //this.gameObjects[id].background = "cyan";
        //this.foundObject += 1;
        break;
      }
      case "mouseleave": {
        this.gameObjects[id].xInc = this.temporaryGameObject.xInc;
        this.gameObjects[id].yInc = this.temporaryGameObject.yInc;
        //this.gameObjects[id].background = this.temporaryGameObject.background;
        break;
      }
    }
  }

  private startMovement() {
      this.interval = setInterval(() => {

        let related = 0;
        let unrelated = 0;
        let relatedHits = 0;
        let unrelatedHits = 0;

        for(let i = 0; i < this.gameObjects.length; i++){
          let objectId = this.gameObjects[i].id;

          this.frame(objectId);

          if(objectId > 0){
            this.testForCollision(this.gameObjects[objectId]);

            if(!this.gameObjects[objectId].isRelated){
              unrelated++;
              if(this.gameObjects[objectId].isHit){
                unrelatedHits++;
              }
            } else {
              related++;
              if(this.gameObjects[objectId].isHit){
                relatedHits++;
              }
            }
          }
        }

        if(unrelated == unrelatedHits) {
          this.gameOver();
        }     
        if(related == relatedHits) {
          this.nextLevel();
        }     
      }, 0.5 * 60);
  }

  private frame(objectId: number) {
    if(!this.movementStarted || this.movementPaused){ return };

    if (this.gameObjects[objectId].xPos >= this.xMax || this.gameObjects[objectId].xPos <= this.xMin) {
      this.gameObjects[objectId].xInc = -this.gameObjects[objectId].xInc;
    }
    if (this.gameObjects[objectId].yPos >= this.yMax || this.gameObjects[objectId].yPos <= this.yMin) {
      this.gameObjects[objectId].yInc = -this.gameObjects[objectId].yInc;
    }
    this.gameObjects[objectId].xPos += this.gameObjects[objectId].xInc;
    this.gameObjects[objectId].yPos += this.gameObjects[objectId].yInc;
  }

  private testForCollision(gameObject: GameObject) {
    let myObject = this.gameObjects[0];

    this.cardColor = "lightyellow";

      if (gameObject.xPos <= myObject.xPos + 50 &&
        gameObject.xPos + 50 >= myObject.xPos &&
        gameObject.yPos <= myObject.yPos + 50 &&
        gameObject.yPos + 50 >= myObject.yPos) {
        gameObject.isHit = true;

        if (!gameObject.isRelated) {
          gameObject.background = "red";     
          this.relatedWords.push(gameObject.text);    
          //this.score += 1;        
        } else {
          //this.cardColor = "yellow";
          gameObject.background = "orange";      
          this.unrelatedWords.push(gameObject.text);     
          //this.score -= 1;        
        }
        
        let xPosNew = this.randomGenerator(gameObject.xPos - 50, gameObject.xPos + 100);
        let yPosNew = this.randomGenerator(gameObject.yPos - 50, gameObject.yPos + 100)

        if(xPosNew >= this.xMax - 50) { xPosNew = this.xMax - 50 };
        if(yPosNew >= this.xMax - 50) { yPosNew = this.yMax - 50 };

        if(xPosNew < 0) { xPosNew = 0 };
        if(yPosNew < 0) { yPosNew = 0 };

        gameObject.xPos = xPosNew;
        gameObject.yPos = yPosNew;
        gameObject.xInc = -gameObject.xInc;        
        gameObject.yInc = -gameObject.yInc;
      }
  }

  private gameOver() {
    clearInterval(this.interval);
    this.message = "Game Over!";
  }

  private nextLevel() {
    clearInterval(this.interval);
    this.message = "Congratulations!";
  }

  private randomGenerator(min: number, max: number) {
    let rand = Math.floor(Math.random() * (max - min + 1) ) + min;
    if(rand == 0) rand = rand + 1;
    return rand;
  }
}
