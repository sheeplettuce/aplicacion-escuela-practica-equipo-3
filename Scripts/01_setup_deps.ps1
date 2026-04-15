param(
  [string]$InstallerDir = $PSScriptRoot,
  [string]$LogFile = "C:\dems_install_log.txt"
)

Start-Transcript -Path $LogFile -Force

Write-Host "Verificando dependencias..."

function Install-MSI($path) {
    if (!(Test-Path $path)) {
        Write-Host "No existe MSI: $path"
        Stop-Transcript
        exit 1
    }
    $p = Start-Process "msiexec.exe" -ArgumentList "/i `"$path`" /quiet /norestart" -Wait -PassThru
    if ($p.ExitCode -ne 0) {
        Write-Host "MSI falló con código: $($p.ExitCode)"
        Stop-Transcript
        exit 1
    }
}

# NODE
$node = Get-Command node -ErrorAction SilentlyContinue
if (!$node) {
    Write-Host "Instalando Node..."
    Install-MSI (Join-Path $InstallerDir "node-v24.14.1-x64.msi")

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path", "User")

    $node = Get-Command node -ErrorAction SilentlyContinue
    if (!$node) {
        Write-Host "Node no se instaló correctamente"
        Stop-Transcript
        exit 1
    }
    Write-Host "Node instalado: $(node --version)"
} else {
    Write-Host "Node ya instalado: $(node --version)"
}

Write-Host "Dependencias listas"
Stop-Transcript
exit 0