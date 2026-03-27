// Prevent a console window appearing in Windows release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_global_shortcut::{Builder as ShortcutBuilder, GlobalShortcutExt, ShortcutState};

#[tauri::command]
fn open_app(app_name: String) -> Result<String, String> {
    println!("open_app command triggered for: {}", app_name);
    match std::process::Command::new("cmd")
        .args(["/C", "start", "", &app_name])
        .spawn()
    {
        Ok(_) => Ok(format!("Opened {}", app_name)),
        Err(e) => Err(format!("Failed to open {}: {}", app_name, e)),
    }
}

fn main() {
    tauri::Builder::default()
        // Enable opener plugin
        .plugin(tauri_plugin_opener::init())
        // Enable shell plugin
        .plugin(tauri_plugin_shell::init())
        // Enable logging plugin
        .plugin(tauri_plugin_log::Builder::default().build())
        // Global shortcut: register handler + key in builder (works in both dev & release)
        .plugin(
            ShortcutBuilder::new()
                .with_handler(|app, shortcut, event| {
                    let expected = match "Ctrl+Shift+Space".parse() {
                        Ok(s) => s,
                        Err(_) => return,
                    };

                    if shortcut == &expected && event.state == ShortcutState::Pressed {
                        println!("Shortcut triggered!");

                        if let Some(window) = app.get_webview_window("assistant") {
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
        // Single setup block — register the shortcut exactly once
        .setup(|app| {
            // Register shortcut — the handler above will fire when triggered
            app.global_shortcut()
                .register("Ctrl+Shift+Space")
                .expect("Failed to register global shortcut");

            Ok(())
        })
        // Register command handlers
        .invoke_handler(tauri::generate_handler![open_app])
        // Run app
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
