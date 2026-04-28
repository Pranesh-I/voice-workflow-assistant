Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
$getRadiosMethod = [Windows.Devices.Radios.Radio].GetMethod('GetRadiosAsync')

$radiosAsync = $getRadiosMethod.Invoke($null, @())
$castMethod = $asTask.MakeGenericMethod([System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]])

$radiosTask = $castMethod.Invoke($null, @($radiosAsync))
$radiosTask.Wait()
$radios = $radiosTask.Result

foreach ($radio in $radios) {
    Write-Output "Found: $($radio.Kind) - $($radio.State)"
}
