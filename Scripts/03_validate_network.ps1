$net = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}

if (!$net) {
    Write-Host "ERROR: No hay conexión de red"
    pause
    exit 1
}