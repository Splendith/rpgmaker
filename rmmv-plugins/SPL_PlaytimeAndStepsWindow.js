//=============================================================================
// SPL_PlaytimeAndStepsWindow.js
// Version 1.21
// Created by Splendith
//=============================================================================

/*:
 * @plugindesc Smart Simple Playtime and Steps Window
 * @author Splendith
 *
 * @param ---Display Settings---
 * @desc
 *
 * @param Show Caption
 * @desc Display caption text?
 * NO - false     YES - true
 * @default true
 *
 * @param Show Playtime
 * @desc Show playtime?
 * NO - false     YES - true
 * @default true
 *
 * @param Show Steps
 * @desc Show steps?
 * NO - false     YES - true
 * @default true
 *
 * @param Playtime First
 * @desc Display the playtime before the steps, or vice versa?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Text Settings---
 * @desc
 *
 * @param Caption Text
 * @desc Text for caption of the window.
 * @default Game Status
 *
 * @param ---Icon Settings---
 * @desc
 *
 * @param Playtime Icon
 * @desc Icon for playtime.
 * @default 220
 *
 * @param Steps Icon
 * @desc Icon for steps.
 * @default 82
 *
 * @help
 * This plugin does not provide plugin commands.
 *
 * Version 1.0
 * Created by Splendith
 */

(function() {

    var parameters = PluginManager.parameters('SPL_PlaytimeAndStepsWindow');

    var showCaption     =   (parameters['Show Caption'].toLowerCase()   == 'true') ? true : false;
    var showPlaytime    =   (parameters['Show Playtime'].toLowerCase()  == 'true') ? true : false;
    var showSteps       =   (parameters['Show Steps'].toLowerCase()     == 'true') ? true : false;
    var isPlaytimeFirst =   (parameters['Playtime First'].toLowerCase() == 'true') ? true : false;

    var textCaption     =   String(parameters['Caption Text']);

    var iconPlaytime    =   Number(parameters['Playtime Icon']);
    var iconSteps       =   Number(parameters['Steps Icon']);

    var lineCount       =   Number(showCaption) + Number(showPlaytime) + Number(showSteps);

    //-----------------------------------------------------------------------------
    // Scene_Menu
    //-----------------------------------------------------------------------------

    // Override
    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();

        // Added
        if (lineCount > 0 && !(lineCount === 1 && showCaption)) {
            this.createStatWindow();
        } else if (lineCount <= 0) {
            console.warn("The SPL_PlaytimeAndStepsWindow will not activate because you are not showing any module in display settings.");
        } else if (lineCount === 1 && showCaption) {
            console.warn("The SPL_PlaytimeAndStepsWindow will not activate because you are showing only 'display caption' module in display settings.");
        }

        this.createGoldWindow();
        this.createStatusWindow();
    };

    // New
    Scene_Menu.prototype.createStatWindow = function() {
        this._statWindow = new Window_GameStat(0, 0);
        this._statWindow.y = Graphics.boxHeight - this._statWindow.fittingHeight(1) - this._statWindow.height;
        this.addWindow(this._statWindow);
    };

    //-----------------------------------------------------------------------------
    // Window_GameStat
    //-----------------------------------------------------------------------------

    function Window_GameStat() {
        this.initialize.apply(this, arguments);
    }

    Window_GameStat.prototype = Object.create(Window_Base.prototype);
    Window_GameStat.prototype.constructor = Window_GameStat;

    Window_GameStat.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_GameStat.prototype.windowWidth = function() {
        return 240;
    };

    Window_GameStat.prototype.windowHeight = function() {
        return this.fittingHeight(lineCount);
    };

    Window_GameStat.prototype.refresh = function() {
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
        var lineHeight = this.lineHeight();
        var indent = 48;
        this.contents.clear();

        var tempHeight = 0;

        // Caption
        if (showCaption) {
            this.changeTextColor(this.systemColor());
            this.drawText(textCaption, 0, 0, width, lineHeight);
            this.resetTextColor();
            tempHeight += lineHeight;
        }

        // Playtime
        if (showPlaytime) {
            if (!isPlaytimeFirst && showSteps) tempHeight += lineHeight;
            this.drawIcon(iconPlaytime, 0, tempHeight);
            this.drawText($gameSystem.playtimeText(), indent, tempHeight, width, lineHeight);
            if (!isPlaytimeFirst && showSteps) tempHeight -= lineHeight * 2;
            tempHeight += lineHeight;
        }

        // Steps
        if (showSteps) {
            this.drawIcon(iconSteps, 0, tempHeight);
            this.drawText($gameParty.steps(), indent, tempHeight, width, lineHeight);
        }
    };

    Window_GameStat.prototype.update = function() {
        if(Graphics.frameCount % 60 == 0)
            this.refresh();
    };

    Window_GameStat.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };

})();
