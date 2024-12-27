# Data Dragon — Object Structures
Data object structures output by the data-dragon.js functions


## Champion
##### *dd.champion(101)*
```
{
  version: '14.24.1',
  id: 'Xerath',
  key: '101',
  name: 'Xerath',
  title: 'the Magus Ascendant',
  blurb: 'Xerath is an Ascended Magus of ancient Shurima, a being of arcane energy writhing in the broken shards of a magical sarcophagus. For millennia, he was trapped beneath the desert sands, but the rise of Shurima freed him from his ancient prison. Driven...',
  info: { attack: 1, defense: 3, magic: 10, difficulty: 8 },
  image: {
    full: 'Xerath.png',
    sprite: 'champion5.png',
    group: 'champion',
    x: 288,
    y: 0,
    w: 48,
    h: 48
  },
  tags: [ 'Mage', 'Support' ],
  partype: 'Mana',
  stats: {
    hp: 596,
    hpperlevel: 106,
    mp: 400,
    mpperlevel: 22,
    movespeed: 340,
    armor: 22,
    armorperlevel: 4.7,
    spellblock: 30,
    spellblockperlevel: 1.3,
    attackrange: 525,
    hpregen: 5.5,
    hpregenperlevel: 0.55,
    mpregen: 6.85,
    mpregenperlevel: 0.8,
    crit: 0,
    critperlevel: 0,
    attackdamage: 55,
    attackdamageperlevel: 3,
    attackspeedperlevel: 1.36,
    attackspeed: 0.658
  },
  img: {
    centered: '/assets/dragontail/champion/centered/Xerath_0.jpg',
    loading: '/assets/dragontail/champion/loading/Xerath_0.jpg',
    loadingcrop: '/assets/dragontail/champion/loadingcrop/Xerath_0.jpg',
    splash: '/assets/dragontail/champion/splash/Xerath_0.jpg',
    square: '/assets/dragontail/champion/square/Xerath.png',
    squarecrop: '/assets/dragontail/champion/squarecrop/Xerath.png',
    tile: '/assets/dragontail/champion/tiles/Xerath_0.jpg'
  }
}
```

## Perk/Rune
##### *dd.rune(8112)*
```
{
  id: 8112,
  key: 'Electrocute',
  icon: 'perk-images/Styles/Domination/Electrocute/Electrocute.png',
  name: 'Electrocute',
  shortDesc: "Hitting a champion with 3 <b>separate</b> attacks or abilities in 3s deals bonus <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'>adaptive damage</lol-uikit-tooltipped-keyword>.",
  longDesc: "Hitting a champion with 3 <b>separate</b> attacks or abilities within 3s deals bonus <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'><font color='#48C4B7'>adaptive damage</font></lol-uikit-tooltipped-keyword>.<br><br>Damage: 50 - 190 (+0.1 bonus AD, +0.05 AP) damage.<br>Cooldown: 20s<br><br><i>'We called them the Thunderlords, for to speak of their lightning was to invite disaster.'</i>",
  img: '\\assets\\dragontail\\perk-images\\Styles\\Domination\\Electrocute\\Electrocute.png',
  endOfGameStatDescs: [ 'Total Damage Dealt: @eogvar1@' ]
}
```

## Item
##### *dd.item(222503)*
```
{
  name: 'Blackfire Torch',
  description: '<mainText><stats><attention>60</attention> Ability Power<br><attention>600</attention> Mana<br><attention>20</attention> Ability Haste</stats><br><br><passive>Baleful Blaze</passive><br>Dealing damage with Abilities causes enemies to burn. This damage increases to Monsters.<br><br><passive>Blackfire</passive><br>For each enemy Champion, Epic Monster, and Large Monster affected by your <passive>Baleful Blaze</passive>, gain <scaleAP>Ability Power</scaleAP>. </mainText>',
  colloq: '',
  plaintext: '',
  image: {
    full: '222503.png',
    sprite: 'item1.png',
    group: 'item',
    x: 192,
    y: 0,
    w: 48,
    h: 48
  },
  gold: { base: 2500, purchasable: true, total: 2500, sell: 1750 },
  tags: [ 'SpellDamage', 'Mana', 'CooldownReduction', 'AbilityHaste' ],
  maps: {
    '11': false,
    '12': false,
    '21': false,
    '22': false,
    '30': true,
    '33': false
  },
  stats: { FlatMPPoolMod: 600, FlatMagicDamageMod: 60 },
  img: '/assets/dragontail/item/222503.png'
}
```

## Summoner Spell
##### *dd.summoner(4)*
```
{
  id: 'SummonerFlash',
  name: 'Flash',
  description: 'Teleports you a short distance toward your cursor.',
  tooltip: 'Teleports you a short distance toward your cursor.',
  maxrank: 1,
  cooldown: [ 300 ],
  cooldownBurn: '300',
  cost: [ 0 ],
  costBurn: '0',
  datavalues: {},
  effect: [
    null,  [ 400 ],
    [ 0 ], [ 0 ],
    [ 0 ], [ 0 ],
    [ 0 ], [ 0 ],
    [ 0 ], [ 0 ],
    [ 0 ]
  ],
  effectBurn: [
    null, '400', '0',
    '0',  '0',   '0',
    '0',  '0',   '0',
    '0',  '0'
  ],
  vars: [],
  key: '4',
  summonerLevel: 7,
  modes: [
    'PRACTICETOOL', 'CLASSIC',
    'ARSR',         'ARAM',
    'NEXUSBLITZ',   'ULTBOOK',
    'TUTORIAL',     'FIRSTBLOOD',
    'ASSASSINATE',  'DOOMBOTSTEEMO',
    'URF',          'STARGUARDIAN',
    'PROJECT',      'WIPMODEWIP',
    'SNOWURF',      'ONEFORALL'
  ],
  costType: 'No Cost',
  maxammo: '-1',
  range: [ 425 ],
  rangeBurn: '425',
  image: {
    full: 'SummonerFlash.png',
    sprite: 'spell0.png',
    group: 'spell',
    x: 288,
    y: 0,
    w: 48,
    h: 48
  },
  resource: 'No Cost',
  img: '/assets/dragontail/spell/SummonerFlash.png'
}
```

## Queue
##### *dd.queue(420)*
```
{
  queueId: 420,
  map: "Summoner's Rift",
  description: '5v5 Ranked Solo games',
  notes: null,
  desc: '5v5 Ranked Solo'
}
```