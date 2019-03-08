# CSGO RankMe stats Discord bot

A Discord bot that shows statistics from [Kento RankMe plugin](https://github.com/rogeraabbccdd/Kento-Rankme).

## Commands

- Stats

Calculates special fields for all players.

- `top <type> <amount>`

Shows the top players for a specific field. You can reverse the ordering by using the command alias `low` instead of `top`

`top list` will output a list of all fields that can be sorted against.

## Installation

You will need a MySQL database that is storing the statistics, this bot does not support SQLite (yet). Atleast NodeJs v8.x is recommended. 

[Guide](https://github.com/niekcandaele/CSGO-RankMe-Discord/wiki/Installation)

## Examples

![Global stats](img/global-stats.png "Global stats") ![Weapon stats](img/top.png "Weapon stats")

## Support

Either [make an issue](https://github.com/niekcandaele/CSGO-RankMe-Discord/issues/new) or [join my discord server](http://catalysm.net/discord).
