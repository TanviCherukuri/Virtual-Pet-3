var dog, happyDog, database, foodS, foodStock, database, currentTime, button1, button2, fedTime, lastFed, foodObj, happyDogIMG, dogIMG, bedroomIMG, gardenIMG, washroomIMG, gameState;

function preload()
{
  happyDogIMG = loadImage("images/dogImg1.png");
  dogIMG = loadImage("images/dogImg.png");
  bedroomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");
  sadDogIMG = loadImage("images/deadDog.png")
}

function setup() 
{
  createCanvas(750, 750);
  
  dog = createSprite(375,375,50,50);
  dog.addImage(dogIMG);
  dog.scale = 0.25;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  button1 = createButton("Feed the dog");
  button1.position(700,95);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(800,95);
  button2.mousePressed(addFoods);

}

function draw() 
{  
  background(46,139,87);

  readGameState();

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12) {
    text("Last Feed :" + lastFed%12 + "PM" , 350, 30);
  } else if (lastFed == 0)  {
    text("Last Feed : 12 AM" , 350, 30);
  }else{
    text("Last Feed :" + lastFed + "AM", 350, 30);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  foodObj.display();

  if(gameState != "Hungry") {
    button1.hide();
    button2.hide();
    dog.changeImage(happyDogIMG);
  }else {
    button1.show();
    button2.show();
    dog.changeImage(sadDogIMG);
  }

  fedTime-hour();
  if(fedTime == (lastFed+1)){
    update("Playing")
  }

  currentTime = hour();
  if(currentTime == (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  }else if(currentTime == (lastFed + 2)) {
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed + 2) && currentTime<=(lastFed+4)) {
    update("Bathing");
    foodObj.washroom();
  }else {
    update("Hungry");
    foodObj.display();
  }

  drawSprites();
}

function hide() {

}

function readGameState() {
  var changeGameState = database.ref('gameState');
  changeGameState.on("value", function(data) {
    gameState = data.val();
  });
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}

function readStock(data) 
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDogIMG);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}