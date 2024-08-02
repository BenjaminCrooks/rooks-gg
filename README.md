# RooksGG
RooksGG is a data exploration & visualization tool created so that I can easily view specific information for League of Legend match data spanning across multiple accounts & seasons; which is not available on other data exploration tools.

The match data is provided via [RIOT Games' developer API](https://developer.riotgames.com/) & parsed into a format that better fits my needs. This app uses assets provided by RIOT, which are available for each patch release of the game via [Data Dragon's](https://developer.riotgames.com/docs/lol#:~:text=https%3A//ddragon.leagueoflegends.com/cdn/dragontail%2D14.15.1.tgz) dragontail asset files.

[RIOT Developer API Documentation](https://developer.riotgames.com/docs/lol)


### Project Directory
```
.
├── node_modules
├── public
│   ├── assets
│   │   ├── augments			# Arena augment icon images
│   │   │   ├── gold
│   │   │   ├── prismatic
│   │   │   └── silver
│   │   ├── dragontail			# LoL game data & assets (a trimmed/parsed version of data dragon's asset folder)
│   │   │   ├── champion
│   │   │   │   ├── centered		# Centered splash arts
│   │   │   │   ├── spells		# Spell icons
│   │   │   │   ├── square		# Champion portrait icons
│   │   │   │   └── square106		# Trimmed portrait icons
│   │   │   ├── items			# Item icons
│   │   │   ├── profileicon		# Summoner icons
│   │   │   │   ├── champies
│   │   │   │   └── fav
│   │   │   └── runes
│   │   │       ├── icons		# Rune type icons
│   │   │       ├── statmods		# Stat mod icons
│   │   │       └── styles		# Rune option icons
│   │   ├── fonts
│   │   └── icons
│   ├── controllers
│   ├── models
│   ├── plugins
│   └── routes
├── views
│   └── partials
│       └── rows
├── index.js
└── README.md
```

## Routing

### Homepage
A quick overview for match data for my most recent 20 matches. Allows me to quickly see how I am performing on my most recently played champions, along with showing me what champions I have been consistently losing to. More general data for individual matches is also displayed, giving an overview of how my games have been going across all of the accounts that I play on. 

![Overview](Screenshot_1.png "Overview")


### Win Rate Data
```
GET     /champions/win-rates	finds all of my individual data
GET     /teams/win-rates        finds all of the data for other players in my matches
```

Displays general champion data for every match recorded in the database. Depending on the route, this data is viewable as either just my personal player data or strictly the other champions in my matches. Both routes combine the champion data for matches played across mutliple accounts. This allows for easy viewing of which champions I see the most frequently, as well as which I play the best with & lose against the most.

![Champions](Screenshot_2.png "My champion win rates")

![Teams](Screenshot_3.png "Team & enemy win rates")


### Arena Augments
```
GET     /arena/augments/Caitlyn        		finds all authors
```

Allows me to easily view what augments are available for which champions, sorted by order of which I feel are most valuable. The augment lists for each champion are stored as arrays within the routing section since I only wanted to view a specific few champions, so it didn't warrant it's own MongoDB collection.

![Augments](Screenshot_5.png "Arena augments")


### Navigation
```
GET     .../selection        		finds all authors
```

Controller functions used to display which champions are viewable for a given root route.

![Navigation](Screenshot_4.png "Navigation selection")


### Champion Stats
```
GET     /stats/:champion        		finds all authors
```
*(Still a work in progress)*

Detailed information for my individual stats for any single given champion that I have played.

Displayed data includes...
- Overall win rate
- Total match played
- Average match length
- Total time played (in days, hours, minutes, & seconds)
- KDA
- Average kills / deaths / assists
- Total kills / deaths / assists
- Q/W/E/R spell casts (match average & total)
- *Total multi-kills (doubles/triples/quadras/pentas)* \*
- *Creep score (per minute average & total)* \*
- *Vision score (match average & total)* \*
- *Control wards (purchased & placed)* \*
- *Wards killed* \*
- *Largest killing spree* \*
- *Longest time spent alive* \*
- *Structure damage* \*
- *Damage dealt* \*
- *Damage taken* \*
- *Total time (applying) crowd control* \*
- *Rune builds (most used & individual rune frequency; win rates for both)* \*
- *Items (purchase frequency & win rates; for both full builds & individual items)* \*

\* *Not yet implemented*


### Random Icon
```
GET     /random-icon/favorites        		finds all authors
GET     /random-icon/all-champies        		finds all authors
GET     /random-icon/fav-champies        		finds all authors
```
I wanted a quick way to randomly select which summoner/profile icon to use from a pre-select list of my favorites. 
