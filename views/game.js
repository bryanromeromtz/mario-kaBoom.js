kaboom({
  global: true,
  fullscreen: true,
  scale: 1.5,
  debug: true,
  clearColor: [0, 0, 0, 1]
})

const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
const ENEMY_SPEED = 60;
let FALL_DEATH = 500;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = true;

https://imgur.com/wbKxhcd

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

// loadRoot('../assets')
// loadSprite('coin', '/wbKxhcd.png')
// loadSprite('evil-shroom', '/evil-shroom.png')
// loadSprite('block', '/block.png')
// loadSprite('mario', '/mario.png')
// loadSprite('mushroom', '/mushroom.png')
// loadSprite('surprise', '/surprise.png')
// loadSprite('unboxed', '/unboxed.png')
// loadSprite('pipe-top-left', '/pipe-top-left.png')
// loadSprite('pipe-top-right', '/pipe-top-right.png')
// loadSprite('pipe-bottom-left', '/pipe-bottom-left.png')
// loadSprite('pipe-bottom-right', '/pipe-bottom-right.png')
// //loadSprite('mario-jump', '/mario-jump.png')
// loadSprite('blue-block', '/blue-block.png')
// loadSprite('blue-brick', '/blue-brick.png')
// loadSprite('blue-steel', '/blue-steel.png')
// loadSprite('blue-evil-shroom', '/blue-evil-shroom.png')
// loadSprite('blue-surprise', '/blue-surprise.png')
loadSprite('flower', '/uaUm9sN.png')

scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'iu'], 'obj')

  const maps = [
    [
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '     %   =*=%=                        ',
      '                                      ',
      '                            -+        ',
      '                    ^   ^   ()        ',
      '==============================   =====',
    ],
    [
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£        @`@@&@              x x        £',
      '£                          x x x        £',
      '£                        x x x x  x   -+£',
      '£               z   z  x x x x x  x   ()£',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ]
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid(), 'destroy-block'],
    '$': [sprite('coin'), 'coin', body()],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous', body()],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    '`': [sprite('blue-surprise'), solid(), scale(0.5), 'flower-surprise'],
    '&': [sprite('blue-surprise'), solid(), scale(0.5), 'ggg'],
    '?': [sprite('flower'), 'flower', body()],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],
  }

  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    add([
      text('score'),
      pos(40, -9),
      layer('ui'),
    ]),
    text(score),
    pos(88, -7),
    layer('ui'),
    {
      value: score,
    }
  ])

  add([text('level ' + parseInt(level + 1)), pos(40, 6)])

  function big() {
    timer = 0;
    isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return this.isBig;
      },
      smallify() {
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        this.scale = vec2(1);
        timer = 0;
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true
      }
    }
  }

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    big(),
    origin('bot')
  ])

  action("mushroom", (m) => {
    m.move(60, 0);
  });

  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  player.on('headbump', (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }
    if (obj.is('flower-surprise')) {
      gameLevel.spawn('?', obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }
    if (obj.is('ggg')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    }
    if (obj.is('destroy-block')) {
      destroy(obj);
    }
  })

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  })

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  })

  player.collides("dangerous", (d) => {
    if (isJumping) {
      destroy(d);
    }
    else {
      go('lose', { score: scoreLabel.value });
    }
  })

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { score: scoreLabel.value });
    }
  })



  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })

    })

  })

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  })

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

})

scene("lose", ({ score }) => {
  add([
    text("SCORE", 30),
    origin("center"),
    pos(width() / 2, height() / 2.7)
  ])
  add([
    text(score, 32),
    origin("center"),
    pos(width() / 2, height() / 2)
  ])
})

start("game", { level: 0, score: 0 })