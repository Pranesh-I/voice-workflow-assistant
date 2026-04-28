[System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
$filePath = "$env:windir\System32\WinMetadata\Windows.Devices.winmd"
[System.Reflection.Assembly]::LoadFile($filePath)

[Windows.Devices.Radios.Radio]::GetRadiosAsync()
