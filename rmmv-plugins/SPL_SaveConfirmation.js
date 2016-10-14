//=============================================================================
// SPL_SaveConfirmation.js
// Version 1.0
// Created by Splendith
//=============================================================================

/*:
 * @plugindesc Creates a confirmation dialog before saving in an existing file.
 * @author Splendith
 *
 * @param Confirm text
 * @desc The text of the 'confirm' choice
 * @default Overwrite
 *
 * @param Cancel text
 * @desc The text of the 'cancel' choice
 * @default Cancel
 *
 * @param Default choice
 * @desc The default selected choice, 'CANCEL' or 'CONFIRM' value only.
 * @default CANCEL
 *
 * @param Width
 * @desc The width of the command window.
 * @default 240
 *
 * @help
 * This plugin does not provide plugin commands.
 *
 * Version 1.0
 * Created by Splendith
 */

(function() {

    var parameters = PluginManager.parameters('SPL_SaveConfirmation');
    var textConfirm = parameters['Confirm text'];
    var textCancel = parameters['Cancel text'];
    var defaultChoice = (parameters['Default choice'].toUpperCase() === 'CONFIRM') ? 0 : 1;
    var width = Number(parameters['Width'] || 240);

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this.createSaveConfirmationWindow();
    };

    Scene_File.prototype.createSaveConfirmationWindow = function() {
        this._commandSaveConfirmation = new Window_SaveConfirmationCommand(Graphics.boxWidth, 0);
        this._commandSaveConfirmation.setHandler('overwrite_choice', this.commandOverwriteChoice.bind(this));
        this._commandSaveConfirmation.setHandler('cancel_choice', this.commandCancelChoice.bind(this));
        this._commandSaveConfirmation.setHandler('cancel', this.commandCancel.bind(this));
        this.addWindow(this._commandSaveConfirmation);
        this._commandSaveConfirmation.deactivate();
        this._commandSaveConfirmation.hide();
    };

    Scene_File.prototype.commandOverwriteChoice = function() {
        Scene_File.prototype.onSavefileOk.call(this);
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(this.savefileId())) {
            this.onSaveSuccess();
        } else {
            this.onSaveFailure();
        }
    };

    Scene_File.prototype.commandCancelChoice = function() {
        SoundManager.playOk();
        this.commandCancel();
    };
    Scene_File.prototype.commandCancel = function() {
        this._commandSaveConfirmation.hide();
        this.activateListWindow();
    };


    Scene_Save.prototype.onSavefileOk = function() {
        if (!DataManager.isThisGameFile(this.savefileId()))
            this.commandOverwriteChoice();
        else {
            SoundManager.playOk();

            this._commandSaveConfirmation.select(defaultChoice);
            this._commandSaveConfirmation.activate();
            this._commandSaveConfirmation.show();
        }
    };

    function Window_SaveConfirmationCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_SaveConfirmationCommand.prototype = Object.create(Window_Command.prototype);
    Window_SaveConfirmationCommand.prototype.constructor = Window_SaveConfirmationCommand;

    Window_SaveConfirmationCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this.updatePlacement();
    };

    Window_SaveConfirmationCommand.prototype.updatePlacement = function() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
        this.setBackgroundType(0);
    };

    Window_SaveConfirmationCommand.prototype.windowWidth = function() {
        return width;
    };

    Window_SaveConfirmationCommand.prototype.makeCommandList = function() {
        this.addCommand(textConfirm, 'overwrite_choice', true);
        this.addCommand(textCancel, 'cancel_choice', true);
    };

    Window_SaveConfirmationCommand.prototype.playOkSound = function() {};


})();
