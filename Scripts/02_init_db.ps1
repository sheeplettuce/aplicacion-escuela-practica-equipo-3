param(
  [string]$AppDir
)

Write-Host "Inicializando base de datos..."
Write-Host "AppDir: $AppDir"

$initDb = Join-Path $AppDir "DEMSBACK\init-db.js"

if (!(Test-Path $initDb)) {
  Write-Host "No existe: $initDb"
  exit 1
}

$result = & node $initDb
Write-Host $result

if ($LASTEXITCODE -ne 0) {
  Write-Host "Error inicializando BD. Código: $LASTEXITCODE"
  exit 1
}

Write-Host "BD inicializada correctamente"
exit 0