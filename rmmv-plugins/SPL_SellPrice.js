//=============================================================================
// SPL_SellPrice.js
// Version 1.0
// Created by Splendith
//=============================================================================

/*:
 * @plugindesc This plugins allow you to specify the custom sell price (seperate NPC)
 * @author Splendith
 *
 * @help
 *
 * SellPrice xID PRICE
 * xID: type and id of inventory (x: i, w, or a followed by ID)
 * PRICE: price of selling item you want
 *
 * Examples
 * SellPrice i12 50       ->  Item id 12, sell price 50
 * SellPrice w7 4000      ->  Weapon id 7, sell price 4000
 * SellPrice a24 1700     ->  Armor id 24, sell price 1700
 *
 * NOTE that you should set this plugin command before the "Shop Processing" command you worked with
 *
 * Version 1.0
 * Created by Splendith
 */

(function() {

    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearSellPrice();
    };

    Game_Temp.prototype.addSellPrice = function(type, id, price) {
        switch (type) {
            case 'i':
                this._sellItems[id] = price; break;
            case 'w':
                this._sellWeapons[id] = price; break;
            case 'a':
                this._sellArmors[id] = price; break;
        }
    }

    Game_Temp.prototype.clearSellPrice = function() {
        this._sellItems = {};
        this._sellWeapons = {};
        this._sellArmors = {};
    }

    Scene_Shop.prototype.sellingPrice = function() {
        var id = this._item.id;

        if('itypeId' in this._item && id in $gameTemp._sellItems) {
            return $gameTemp._sellItems[id];
        }
        if('wtypeId' in this._item && id in $gameTemp._sellWeapons) {
            return $gameTemp._sellWeapons[id];
        }
        if('atypeId' in this._item && id in $gameTemp._sellArmors) {
            return $gameTemp._sellArmors[id];
        }

        return Math.floor(this._item.price / 2);
    };

    var _Scene_Shop_terminate = Scene_Shop.prototype.terminate;
    Scene_Shop.prototype.terminate = function() {
        _Scene_Shop_terminate.call(this);
        $gameTemp.clearSellPrice();
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'sellprice') {
            var type = args[0].charAt(0).toLowerCase();
            var id = parseInt(args[0].substr(1));
            var price = parseInt(args[1]);
            $gameTemp.addSellPrice(type, id, price);
        }
    };

})();
