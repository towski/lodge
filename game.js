var world;
var fearBar;
var hungerBar;

var Vector2 = Class.create({
  initialize: function(x, y){
    this.x = x;
    this.y = y;
  }
});

var Vector3 = Class.create({
  initialize: function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
});

var Twig = Class.create({
  initialize: function(x1, y1, tw){
    this.x = x1;
    this.y = y1;
    this.twigs = tw;
  },
  
  taskTime: function(player){
    return 1.0;
  },
  
  interact: function(player){
    player.twigs += 1;
    twigs.Remove(this);
  },
  
  draw: function(world){
    if(world.visible(x, y)){
      if (GUI.Button (Rect (world.X(x),world.Y(y),20,20), "g")) {
        world.player.addToQueue(this);
      }
    }
  }
});

var Tree = Class.create({
  initialize: function(x1, y1, p, f){
    this.x = x1;
    this.y = y1;
    this.player = p;
    this.forest = f;
  },
  
  draw: function(world){
    if(world.visible(x, y)){
      if (GUI.Button (Rect (world.X(x),world.Y(y),20,20), "tree")) {
        player.addToQueue(this);
      }
    }
  },
  
  taskTime: function(player){
    return 10.0;
  },
  
  interact: function(player){
    player.twigs += 3;
    forest.Remove(this);
  }
});

var BonfireUpgrade = Class.create({
  initialize: function(bonf){
    this.bonfire = bonf;
    this.x = bonf.x;
    this.y = bonf.y;
  },
  
  taskTime: function(player){
    return (player.twigs >= 5 ? 3.0 : 0.0);
  },
  
  interact: function(player){
    if(player.twigs >= 5){
      player.twigs -= 5;
      bonfire.radius += 50;
      var localRadius = bonfire.radius / 5.0;
      bonfire.sphere.transform.localScale = Vector3(localRadius, localRadius, localRadius);
    }
  }
});

var Bonfire = Class.create({
  Bonfire: function(x1, y1, r){
    if(r){
      radius = r;
    }
    this.x = x1;
    this.y = y1;
  },
  
  draw: function(world){
    if(world.visible(x, y)){
      if (GUI.Button (Rect(world.X(x),world.Y(y),20,20), "bonfire")) {
        world.player.addToQueue(this);
      }
      if (GUI.Button (Rect(world.X(x) + 25,world.Y(y),20,20), "upgrade")) {
        world.player.addToQueue(new BonfireUpgrade(this));
      }
    }
  },
  
  taskTime: function(player){
    return player.fear;
  },
  
  interact: function(player){
    player.afraid = false;
  }
});

var LeekPatch = Class.create({
  LeekPatch: function(x1, y1){
    this.x = x1;
    this.y = y1;
    this.leeksLeft = 3;
  },
  
  taskTime: function(player){
    return 3.0;
  },
  
  interact: function(player){
    if(leeksLeft > 0 && Random.value > 0.5){
      leeksLeft -= 1;
      player.leeks += 1;
    }
  },
  
  draw: function(world){
    if (GUI.Button (Rect (world.X(x),world.Y(y),60,50), "leeks " + leeksLeft)) {
      world.player.addToQueue(this);
    }
  }
});

var Bar = Class.create({
  draw: function(player){
    //none
  },
  
  fullness: function(player){
    return 0.0;
  },
  
  text: function(){
    return "Hey";
  },
});

var FearBar = Class.create(Bar, {
  initialize: function(){
    this.pos = new Vector2(10,30);
    this.size = new Vector2(200,20);
  },
  
  fullness: function(player){
    return player.fear / 10.0;
  },
  
  text: function(){
    return "Fear";
  },
});

var HungerBar = Class.create(Bar, {
  initialize: function(){
    pos = new Vector2(10,50);
  },
  
  fullness: function(player){
    return player.hunger;
  },
  
  text: function(){
    return "Hunger";
  },
});

var Place = Class.create({
  initialize: function(x1, y1){
    this.x = x1;
    this.y = y1;
  },
  
  interact: function(player){
  }
});

var MoveAction = Class.create(Place, {
  initialize: function(x1,y1){
    super(x1,y1);
  },
  
  taskTime: function(player){
    return 0.0;
  }
});

var World = Class.create({
  initialize: function(p){
    this.player = p;
    this.trees = new Array();
    this.bonfires = new Array();
    this.twigs = new Array();
    this.streams = new Array();
    var homeBonfire = new Bonfire(0, 0, 0);
    this.bonfires.Add(homeBonfire);
    for(var i = 0; i < 100; i++){
      var attempts = 0;
      var validLocation = false;
      var newLocation;
      while(!validLocation){
        newLocation = Vector2(Random.Range(-1000, 1000), Random.Range(-1000, 1000));
        //newLocation = Vector2(0, 200);
        validLocation = true;
        for(tree in trees){
          if(Vector2.Distance(newLocation, Vector2(tree.x, tree.y)) < 50){
            validLocation = false;
          }
        }
        attempts++;
        if(attempts > 10){
          throw("tried too hard to find trees");
        }
      }
      trees.Add(new Tree(newLocation.x, newLocation.y, player, trees));
    }
    for(i = 0; i < 100; i++){
      twigs.Add(new Twig(Random.Range(-1000, 1000), Random.Range(-1000, 1000), twigs));
    }
    this.leekPatch = new LeekPatch(Random.Range(-200, 200), Random.Range(-200, 200));
  },
  
  X: function(x){
    return x + (Screen.width / 2) - Camera.main.transform.position.x * 9.0;
  },
  
  Y: function(y){
    return (Screen.height / 2) - y + Camera.main.transform.position.z * 9.0;
  },
  
  fromX: function(x){
    return x - (Screen.width / 2.0) + Camera.main.transform.position.x * 9.0;
  },
  
  fromY: function(y){
    return y - (Screen.height / 2.0) + Camera.main.transform.position.z * 9.0;
  },
  
  visible: function(x, y){
    var rightSide = Camera.main.transform.position.x * 9.0 + (Screen.width / 2);
    var leftSide = Camera.main.transform.position.x * 9.0 - (Screen.width / 2);
    if(x < rightSide && x > leftSide){
      var top = Camera.main.transform.position.z * 9.0 + (Screen.height / 2);
      var bottom = Camera.main.transform.position.z * 9.0 - (Screen.height / 2);
      if(y < top && y > bottom){
        return true;
      }
    }
    return false;
  },
  
  move: function(){
    player.moveToNext();
    if(Input.GetAxis("Horizontal")){
      Camera.main.transform.position.x += -Input.GetAxis("Horizontal") * Time.deltaTime * 10.0;
    }
    if(Input.GetAxis("Vertical")){
      Camera.main.transform.position.z += Input.GetAxis("Vertical") * Time.deltaTime * 10.0;
    }
  },
  
  draw: function(){
    GUI.Label (Rect (100,70,100,70), "Twigs: " + player.twigs);
    GUI.Label (Rect (100,90,100,70), "Leeks: " + player.leeks);
    player.draw(this);
    for(bonfire in bonfires){
      bonfire.draw(this);
    }
    for(tree in trees){
      tree.draw(this);
    }
    for(twig in twigs){
      twig.draw(this);
    }
    leekPatch.draw(this);
  }
});

document.observe("dom:loaded", function() {
  var example = document.getElementById('example');
  example.addEventListener("click", function(e) { alert("x:"+(e.clientX-example.offsetLeft) +" y:"+(e.clientY-example.offsetTop)); }, false);
  var context = example.getContext('2d');
  context.fillStyle = "rgb(255,0,0)";
  context.fillRect(30, 30, 50, 50);
  world = new World(new Player(null, null));
  var stream = new Stream(0, 0, 100.0, 1000.0, null, null);
  stream.divide();
  world.streams.Add(stream);
  fearBar = new FearBar();
  hungerBar = new HungerBar();
  StartCoroutine(checkNearestBonfire());
});

function Update(){
  world.move();
}

function checkNearestBonfire(){
  while(true){
    var highestDistance = 10000000;
    for(bonfire in world.bonfires){
      if(bonfire.radius > 0){
        distance = Vector2.Distance(Vector2(bonfire.x, bonfire.y), Vector2(world.player.x,world.player.y));
        if(distance < highestDistance){
          world.player.bonfire = bonfire;
          highestDistance = distance;
        }
      }
    }
    //yield WaitForSeconds(1.0);
  }
}

function OnGUI () {
  fearBar.draw(world.player);
  hungerBar.draw(world.player);
  world.draw();
  if (GUI.Button (Rect (0,0,Screen.width,Screen.height), "")) {
    world.player.addToQueue(new MoveAction(world.fromX(Input.mousePosition.x), world.fromY(Input.mousePosition.y)));
  }
}
