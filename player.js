var Player = Class.create({
  initialize: function(bon, go){
    this.bonfire = bon;
    this.gameObject = go;
    this.leeks = 1;
    this.twigs = 1;
    this.fear = 0.0;
    this.bonfire;
    this.x = 10.0;
    this.y = 0.0;
    this.queue = new Array();
    this.busy = false;
    this.startedTask;
    this.currentTask;
    this.afraid = false;
    this.hunger = 0.0;
    this.enableMenu = true;
    this.gameObject;
  },
  
  addToQueue: function(object){
    queue.Add(object);
  },
  
  queued: function(){
    if(queue.length > 0){
      return queue[0];
    }
  },
  
  dequeue: function(){
    return queue.shift();
  },
  
  checkFear: function(){
    var distance = Vector2.Distance(Vector2(bonfire.x, bonfire.y), Vector2(x,y));
    if(distance > bonfire.radius){
      if(fear <= 10.0){
        fear += Time.deltaTime;
      }
    } else {
      if(fear > 0){
        fear -= Time.deltaTime;
      }
    }
    if(fear >= 10.0 && !afraid){
      busy = false;
      afraid = true;
      queue = new Array();
      currentTask = bonfire;
    }
  },
  
  hungry: function(){
    return hunger >= 1;
  },
  
  checkHunger: function(){
    if(!hungry()){
      hunger += 0.0001;
    }
  },
  
  moveToNext: function(){
    //this.checkFear();
    this.checkHunger();
    var nextObject = currentTask;
    if(!nextObject){
      nextObject = queued();
    }
    if(!busy && nextObject){
      var vector = Vector2(nextObject.x, nextObject.y) - Vector2(x, y);
      if(Mathf.Abs(vector.x) < 10 && Mathf.Abs(vector.y) < 10){
        busy = true;
        startedTask = Time.time;
        if(!currentTask){
          currentTask = dequeue();
        }
      } else {
        vector.Normalize();
        x += vector.x * Time.deltaTime * 100.0;
        y += vector.y * Time.deltaTime * 100.0;
        gameObject.transform.position.x = x / 10.0;
        gameObject.transform.position.z = y / 10.0;
      }
    } else if (busy && nextObject){
        if (startedTask + currentTask.taskTime(this) < Time.time){
          busy = false;
          nextObject.interact(this);
          currentTask = null;
        }
    }
  },
  
  eat: function(){
    if(leeks > 0){
      leeks--;
      hunger = 0;
    }
  },
  
  draw: function(world){
    if(world.visible(x,y)){
      if (GUI.Button (Rect (world.X(x),world.Y(y),20,20), "player")) {
        enableMenu = !enableMenu;
      }
    }
    if(currentTask){
      if (GUI.Button (Rect (10,10,20,20), "task")) {
        busy = false;
        currentTask = null;
      }
    }
    var offset = 40;
    var toRemove = new Array();
    for(object in queue){
      if (GUI.Button (Rect (offset,10,20,20), "task")) {
        toRemove.Add(object);
      }
      offset += 25;
    }
    for(removal in toRemove){
      queue.Remove(removal);
    }
    if(enableMenu){
      if (GUI.Button (Rect (10,110,60,30), "make dam")) {
        this.eat();
      }
    }
  }
});