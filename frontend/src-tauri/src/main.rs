#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_global_shortcut::{Builder, Shortcut, ShortcutState};

fn main() {
    tauri::Builder::default()

        // Enable shell plugin (required for opening external URLs)
        .plugin(tauri_plugin_shell::init())

        // Enable global shortcut plugin
        .plugin(
            Builder::new()
                .with_shortcuts(["Ctrl+Shift+V"])
                .unwrap()
                .with_handler(|app, shortcut, event| {

                    let expected: Shortcut = "Ctrl+Shift+V".parse().unwrap();

                    // Only trigger when shortcut key is pressed
                    if shortcut == &expected && event.state == ShortcutState::Pressed {

                        if let Some(window) = app.get_webview_window("main") {

                            let visible = window.is_visible().unwrap_or(false);

                            if visible {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(),
        )

        // Hide window at startup
        .setup(|app| {

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            Ok(())
        })

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}