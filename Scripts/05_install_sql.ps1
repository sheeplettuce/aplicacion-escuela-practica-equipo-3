param(
  [string]$SetupDir
)

Write-Host "Verificando SQL Server..."
Write-Host "SetupDir: $SetupDir"

# ── Detectar cualquier instancia de SQL Server instalada ─────────────────────
# Cubre: Express, Developer, Standard, Enterprise y cualquier instancia nombrada.
# El registro HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL
# contiene todas las instancias activas independientemente de la edición.
$instancesKey = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL"
$hasAnyInstance = $false

if (Test-Path $instancesKey) {
    $instances = Get-ItemProperty $instancesKey -ErrorAction SilentlyContinue
    if ($instances) {
        $names = $instances.PSObject.Properties |
                 Where-Object { $_.Name -notlike "PS*" } |
                 Select-Object -ExpandProperty Name
        if ($names.Count -gt 0) {
            Write-Host "Instancias de SQL Server detectadas: $($names -join ', ')"
            $hasAnyInstance = $true
        }
    }
}

# Fallback: buscar el servicio SQLEXPRESS específicamente
if (!$hasAnyInstance) {
    $svc = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host "Servicio MSSQL`$SQLEXPRESS encontrado (estado: $($svc.Status))"
        $hasAnyInstance = $true
    }
}

if ($hasAnyInstance) {
    Write-Host "SQL Server ya está instalado. Se omite la instalación."
    exit 0
}

# ── Instalar SQL Server Express ───────────────────────────────────────────────
Write-Host "No se encontró SQL Server. Procediendo con la instalación..."

$setup = Join-Path $SetupDir "SETUP.EXE"

if (!(Test-Path $setup)) {
    Write-Host "No existe SETUP.EXE en: $SetupDir"
    exit 1
}

$p = Start-Process $setup -ArgumentList `
    "/Q /ACTION=Install /FEATURES=SQLEngine /INSTANCENAME=SQLEXPRESS /SECURITYMODE=SQL /SAPWD=Admin123! /TCPENABLED=1 /NPENABLED=1 /IACCEPTSQLSERVERLICENSETERMS" `
    -WorkingDirectory $SetupDir `
    -Wait -PassThru

Write-Host "SETUP.EXE exit code: $($p.ExitCode)"

if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
    Write-Host "SQL Server falló con código: $($p.ExitCode)"
    exit 1
}

$retries = 0
do {
    Start-Sleep -Seconds 10
    $svc = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
    $retries++
    Write-Host "Esperando servicio SQL... intento $retries/12"
} while (!$svc -and $retries -lt 12)

if (!$svc) {
    Write-Host "SQL Server no quedó registrado como servicio"
    exit 1
}

Write-Host "SQL Server instalado correctamente"
exit 0