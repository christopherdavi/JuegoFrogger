//Nivel del juego Invasión alienígena
var level1 = [
 // Start,    End, Gap,  Type,   Override
  [ 0,       4000, 500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 12000,  16000, 400, 'circle' ],
  [ 18200,  20000, 500, 'straight', { x: 150 } ],
  [ 18200,  20000, 500, 'straight', { x: 100 } ],
  [ 18400,  20000, 500, 'straight', { x: 200 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 300 }],
  [ 22000,  25000, 400, 'wiggle', { x: 200 }]
];

var Level = function(levelData,callback) {
  this.levelData = [];
  for(var i = 0; i < levelData.length; i++) {
    this.levelData.push(Object.create(levelData[i]));
  }
  this.t = 0;
  this.callback = callback;
}

Level.prototype.draw = function(ctx) { }

Level.prototype.step = function(dt) {
  var idx = 0, remove = [], curShip = null;
 
 // Update the current time offset
  this.t += dt * 1000;

  //  Datos de nivel de ejemplo
  //   Inicio, fin, espacio, tipo, anulación
  // [[ 0,     4000, 500, 'step', { x: 100 } ]
  while((curShip = this.levelData[idx]) && 
        (curShip[0] < this.t + 2000)) {
    // Check if past the end time 
    if(this.t > curShip[1]) {
      // Si es así, elimine la entrada
      remove.push(curShip);
    } else if(curShip[0] < this.t) {
      // Obtén el plano de definición del enemigo
      var enemy = enemies[curShip[3]],
          override = curShip[4];

      // Agrega un nuevo enemigo con el plano y anula
      this.board.add(new Enemy(enemy,override));

      // Incrementar la hora de inicio por la brecha
      curShip[0] += curShip[2];
    }
    idx++;
  }
  // Eliminar cualquier objeto del nivel Datos que hayan pasado
  for(var i = 0, len = remove.length; i < len; i++) {
    var idx = this.levelData.indexOf(remove[i]);
    if(idx != -1) this.levelData.splice(idx,1);
  }

  // Si no hay más enemigos en el tablero o en 
  // Datos de nivel, este nivel está terminado
  if(this.levelData.length == 0 && this.board.cnt[OBJECT_ENEMY] == 0) {
    if(this.callback) this.callback();
  }
}