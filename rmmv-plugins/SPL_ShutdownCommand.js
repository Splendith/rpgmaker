//=============================================================================
// SPL_ShutdownCommand.js
// Version 1.0
// Created by Splendith
//=============================================================================

/*:
 * @plugindesc This plugin adds shutdown command like earlier version of RPG Maker in only desktop app.
 * @author Splendith
 *
 * @param Shutdown text
 * @desc The text of the shutdown command
 * @default Shutdown
 *
 * @help
 * This plugin does not provide plugin commands.
 *
 * Version 1.0
 * Created by Splendith
 */

(function() {

    if (!Utils.isMobileDevice() && Utils.isNwjs()) {

        var parameters = PluginManager.parameters('SPL_ShutdownCommand');
        var textShutdown = parameters['Shutdown text'];

        var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow
        Scene_Title.prototype.createCommandWindow = function() {
            _Scene_Title_createCommandWindow.call(this);
            this._commandWindow.setHandler('shutdown', shutdown.bind(this));
        };

        var _Scene_GameEnd_createCommandWindow = Scene_GameEnd.prototype.createCommandWindow
        Scene_GameEnd.prototype.createCommandWindow = function() {
            _Scene_GameEnd_createCommandWindow.call(this);
            this._commandWindow.setHandler('shutdown', shutdown.bind(this));
        };

        var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList
        Window_TitleCommand.prototype.makeCommandList = function() {
            _Window_TitleCommand_makeCommandList.call(this);
            this.addCommand(textShutdown, 'shutdown');
        };

        Window_GameEnd.prototype.makeCommandList = function() {
            this.addCommand(TextManager.toTitle, 'toTitle');
            this.addCommand(textShutdown, 'shutdown');
            this.addCommand(TextManager.cancel, 'cancel');
        };

        var shutdown = function(scene) {
            this.fadeOutAll();
            SceneManager.exit();
        }
    }

})();
