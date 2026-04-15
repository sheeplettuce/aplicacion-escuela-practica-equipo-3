Write-Host "Configurando firewall..."

# Backend Node.js
$existing = Get-NetFirewallRule -DisplayName "DEMS Backend" -ErrorAction SilentlyContinue
if (!$existing) {
    New-NetFirewallRule -DisplayName "DEMS Backend" `
        -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow | Out-Null
    Write-Host "Regla DEMS Backend creada"
} else {
    Write-Host "Regla DEMS Backend ya existe"
}

# SQL Server puerto TCP
$existing = Get-NetFirewallRule -DisplayName "DEMS SQL Server" -ErrorAction SilentlyContinue
if (!$existing) {
    New-NetFirewallRule -DisplayName "DEMS SQL Server" `
        -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow | Out-Null
    Write-Host "Regla DEMS SQL Server creada"
} else {
    Write-Host "Regla DEMS SQL Server ya existe"
}

# SQL Server Browser (resolución de nombre de instancia)
$existing = Get-NetFirewallRule -DisplayName "DEMS SQL Browser" -ErrorAction SilentlyContinue
if (!$existing) {
    New-NetFirewallRule -DisplayName "DEMS SQL Browser" `
        -Direction Inbound -Protocol UDP -LocalPort 1434 -Action Allow | Out-Null
    Write-Host "Regla DEMS SQL Browser creada"
} else {
    Write-Host "Regla DEMS SQL Browser ya existe"
}

# Habilitar y arrancar SQL Server Browser
$browser = Get-Service -Name "SQLBrowser" -ErrorAction SilentlyContinue
if ($browser) {
    Set-Service -Name "SQLBrowser" -StartupType Automatic
    if ($browser.Status -ne "Running") {
        Start-Service -Name "SQLBrowser"
        Write-Host "SQL Server Browser iniciado"
    } else {
        Write-Host "SQL Server Browser ya está corriendo"
    }
} else {
    Write-Host "Advertencia: SQL Server Browser no encontrado"
}

Write-Host "Firewall configurado correctamente"
exit 0