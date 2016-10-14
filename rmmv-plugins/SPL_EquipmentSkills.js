//=============================================================================
// SPL_EquipmentSkills.js
//=============================================================================

/*:
 * @plugindesc Can learn skills when equip the conditional weapons or armors. For instruction, click 'Help...'.
 * @author Splendith
 *
 * @help This plugin does not provide plugin commands.
 *
 * Weapon or Armor database Note:
 *
 * <eq_skills: [[9, 1]]>
 * Someone who uses this equipment will learn a skill #9 at level 1
 *
 * <eq_skills: [[8, 3], [9, 10]]>
 * Someone who uses this equipment will learn a skill #8 at level 3
 * and skill #9 at level 10
 *
 * etc.
 *
 * Version 1.0
 * Created by Splendith
 */

(function() {

    Game_Actor.prototype.skills = function() {
        var list = [];
        this._skills.concat(this.addedSkills()).forEach(function(id) {
            if (!list.contains($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        });
        var equips = this._equips;
        for (var i = 0; i < equips.length; i++) {
            var type = equips[i]._dataClass;
            var id = equips[i]._itemId;
            if (id === 0) continue;

            var data;
            if (type === 'weapon') data = $dataWeapons[id];
            if (type === 'armor') data = $dataArmors[id];

            if (data.meta.eq_skills === undefined) continue;
            var skills = JsonEx.parse(data.meta.eq_skills);

            for (var j = 0; j < skills.length; j++) {
                if (this._level >= skills[j][1] && !list.contains($dataSkills[skills[j][0]]))
                    list.push($dataSkills[skills[j][0]]);
            }
        }
        return list;
    };

})();
