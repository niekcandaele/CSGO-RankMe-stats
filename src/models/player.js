/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(process.env.MYSQL_TABLE, {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    steam: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    score: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    kills: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    deaths: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    assists: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    suicides: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    tk: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    shots: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    hits: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    headshots: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    connected: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    rounds_tr: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    rounds_ct: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lastconnect: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    knife: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    glock: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    hkp2000: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    usp_silencer: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    p250: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    deagle: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    elite: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fiveseven: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    tec9: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    cz75a: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    revolver: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    nova: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    xm1014: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mag7: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sawedoff: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    bizon: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mac10: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mp9: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mp7: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ump45: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    p90: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    galilar: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ak47: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    scar20: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    famas: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    m4a1: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    m4a1_silencer: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    aug: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ssg08: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    sg556: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    awp: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    g3sg1: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    m249: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    negev: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    hegrenade: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    flashbang: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    smokegrenade: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    inferno: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    decoy: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    taser: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mp5sd: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    head: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    chest: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    stomach: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    left_arm: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    right_arm: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    left_leg: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    right_leg: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    c4_planted: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    c4_exploded: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    c4_defused: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ct_win: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    tr_win: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    hostages_rescued: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    vip_killed: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    vip_escaped: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    vip_played: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    mvp: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    damage: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    match_win: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    match_draw: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    match_lose: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: process.env.MYSQL_TABLE,
    timestamps: false,
  });
};