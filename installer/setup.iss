[Setup]
AppName=DEMS
AppVersion=1.0.0
DefaultDirName={pf}\DEMS
DefaultGroupName=DEMS
OutputDir=.
OutputBaseFilename=DEMS-Installer
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
; App Electron
Source: "..\Windows\electron\dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

; Backend
Source: "..\Windows\DEMSBACK\*"; DestDir: "{app}\DEMSBACK"; Flags: recursesubdirs
Source: "..\Windows\Database\SQLDEMS.sql"; DestDir: "{app}\DEMSBACK"; Flags: ignoreversion

; Scripts comprimidos para extracción temprana (antes del wizard)
; IMPORTANTE: generar Scripts.zip desde la carpeta Scripts\ incluyendo node_modules
Source: "..\Scripts.zip"; DestDir: "{tmp}"; Flags: dontcopy

; Extraccion temprana para InitializeSetup
Source: "..\Scripts\01_setup_deps.ps1"; DestDir: "{tmp}"; Flags: dontcopy
Source: "..\Installers\node-v24.14.1-x64.msi"; DestDir: "{tmp}"; Flags: dontcopy
; Reemplaza la línea del SQLEXPR_x64_ESN.exe por la carpeta ya extraída
Source: "..\Installers\SQLEXPR_x64_ESN\*"; DestDir: "{tmp}\SQLEXPR"; Flags: recursesubdirs

; Instaladores a {app}
Source: "..\Installers\*"; DestDir: "{app}\installers"; Flags: recursesubdirs

[Icons]
Name: "{group}\DEMS"; Filename: "{app}\DEMS.exe"
Name: "{commondesktop}\DEMS"; Filename: "{app}\DEMS.exe"

[Run]
Filename: "{app}\DEMS.exe"; Description: "Abrir DEMS"; Flags: nowait postinstall skipifsilent

[Code]

var
  ResultCode: Integer;
  DeviceCount: Integer;
  DevicePage: TInputQueryWizardPage;
  QRImage: TBitmapImage;
  StatusLabelDevices: TNewStaticText;
  IP: String;


// ============================
// EJECUCIÓN SEGURA
// ============================
procedure ExecOrFail(FileName, Params: String);
begin
  if not Exec(FileName, Params, '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Error al ejecutar: ' + FileName + #13#10 + 'Params: ' + Params, mbError, MB_OK);
    Abort;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('El proceso falló: ' + FileName + #13#10 + 'Params: ' + Params + #13#10 + 'Código: ' + IntToStr(ResultCode), mbError, MB_OK);
    Abort;
  end;
end;


// ============================
// BUSCAR node.exe EN EL SISTEMA
// ============================
// Inno Setup no hereda el PATH del usuario, por lo que llamar 'node' directamente
// falla aunque Node esté instalado. Esta función busca node.exe en el registro
// y en rutas comunes para obtener la ruta absoluta.
function FindNodeExe(): String;
var
  InstallPath: String;
  Candidate: String;
begin
  // 1. Buscar en registro HKLM (instalación para todos los usuarios, lo más común)
  if RegQueryStringValue(HKLM, 'SOFTWARE\Node.js', 'InstallPath', InstallPath) then
  begin
    Candidate := InstallPath + '\node.exe';
    if FileExists(Candidate) then
    begin
      Result := Candidate;
      Exit;
    end;
  end;

  // 2. Buscar en registro HKCU (instalación solo para el usuario actual)
  if RegQueryStringValue(HKCU, 'SOFTWARE\Node.js', 'InstallPath', InstallPath) then
  begin
    Candidate := InstallPath + '\node.exe';
    if FileExists(Candidate) then
    begin
      Result := Candidate;
      Exit;
    end;
  end;

  // 3. Ruta por defecto del instalador MSI oficial de Node.js
  Candidate := 'C:\Program Files\nodejs\node.exe';
  if FileExists(Candidate) then
  begin
    Result := Candidate;
    Exit;
  end;

  // 4. Ruta alternativa en Program Files (x86), rara pero posible
  Candidate := 'C:\Program Files (x86)\nodejs\node.exe';
  if FileExists(Candidate) then
  begin
    Result := Candidate;
    Exit;
  end;

  // 5. Sin resultado: devolver cadena vacía (el llamador debe manejar este caso)
  Result := '';
end;


// ============================
// VALIDAR DEPENDENCIAS (ANTES DE UI)
// ============================
function InitializeSetup(): Boolean;
var
  ScriptPath: String;
  InstallerPath: String;
  TmpDir: String;
begin
  Result := True;
  TmpDir := ExpandConstant('{tmp}');

  // ── Paso 1: Extraer archivos con dontcopy ──────────────────────────────────
  ExtractTemporaryFile('01_setup_deps.ps1');
  ExtractTemporaryFile('node-v24.14.1-x64.msi');
  ExtractTemporaryFile('Scripts.zip');

  ScriptPath    := TmpDir + '\01_setup_deps.ps1';
  InstallerPath := TmpDir;

  // ── Paso 2: Instalar dependencias (Node.js, etc.) ─────────────────────────
  if not Exec(
    'powershell.exe',
    '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptPath + '" -InstallerDir "' + InstallerPath + '" -LogFile "C:\dems_install_log.txt"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) then
  begin
    MsgBox('Error ejecutando script de dependencias', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('Falló la instalación de dependencias. Código: ' + IntToStr(ResultCode) + #13#10 + 'Ver: C:\dems_install_log.txt', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  // ── Paso 3: Descomprimir Scripts.zip → {tmp}\Scripts ──────────────────────
  // Esto hace que device-sync.js y node_modules estén disponibles ANTES de que
  // aparezca el wizard, solucionando el error de directorio inexistente.
  if not Exec(
    'powershell.exe',
    '-NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path ''' +
      TmpDir + '\Scripts.zip'' -DestinationPath ''' + TmpDir + '\Scripts'' -Force"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) then
  begin
    MsgBox('Error descomprimiendo Scripts.zip', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('Falló la extracción de Scripts.zip. Código: ' + IntToStr(ResultCode), mbError, MB_OK);
    Result := False;
    Exit;
  end;

  // ── Paso 4: Abrir puertos en el firewall ──────────────────────────────────
  // Se ejecuta aquí para que el puerto 3000 esté disponible cuando los
  // dispositivos intenten conectarse al QR, antes de mostrar las páginas del wizard.
  if not Exec(
    'powershell.exe',
    '-NoProfile -ExecutionPolicy Bypass -File "' + TmpDir + '\Scripts\06_firewall.ps1"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) then
  begin
    MsgBox('Error ejecutando script de firewall', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('Falló la configuración del firewall. Código: ' + IntToStr(ResultCode), mbError, MB_OK);
    Result := False;
    Exit;
  end;
end;

// ============================
// LEER IP
// ============================
function GetIPFromFile(): String;
var
  IPContent: AnsiString;
begin
  if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\ip.txt'), IPContent) then
    Result := Trim(String(IPContent))
  else
    Result := '';
end;


// ============================
// UI
// ============================
procedure InitializeWizard();
begin
  DevicePage := CreateInputQueryPage(
    wpSelectDir,
    'Configuración de dispositivos',
    'Cantidad de meseros',
    'Ingrese cuántos dispositivos móviles se conectarán:'
  );
  DevicePage.Add('Número de dispositivos:', False);

  QRImage := TBitmapImage.Create(DevicePage.Surface);
  QRImage.Parent := DevicePage.Surface;
  QRImage.Width := 200;    // píxeles fijos — debe coincidir con el resize de PowerShell
  QRImage.Height := 200;   // píxeles fijos — debe coincidir con el resize de PowerShell
  QRImage.Left := ScaleX(20);
  QRImage.Top := ScaleY(65);
  QRImage.Visible := False;

  StatusLabelDevices := TNewStaticText.Create(DevicePage.Surface);
  StatusLabelDevices.Parent := DevicePage.Surface;
  StatusLabelDevices.Left := ScaleX(20);
  StatusLabelDevices.Top := ScaleY(245);  // justo debajo del QR (65 + 170 + 10)
  StatusLabelDevices.Caption := 'Dispositivos conectados: 0/0';
  StatusLabelDevices.Visible := False;
end;

// ============================
// ACTUALIZAR UI
// ============================
procedure UpdateStatusUI();
var
  Status: AnsiString;
begin
  if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\status.txt'), Status) then
    StatusLabelDevices.Caption := 'Dispositivos conectados: ' + Trim(Status);
end;


// ============================
// ESPERAR DISPOSITIVOS
// ============================
procedure WaitForDevices();
var
  Status: AnsiString;
  Current: Integer;
  SepPos: Integer;
begin
  while True do
  begin
    if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\status.txt'), Status) then
    begin
      Status := Trim(Status);
      SepPos := Pos('/', Status);

      if SepPos > 0 then
      begin
        Current := StrToIntDef(Copy(Status, 1, SepPos - 1), 0);
        StatusLabelDevices.Caption := 'Dispositivos conectados: ' + Status;

        if Current >= DeviceCount then
          Break;
      end;
    end;

    WizardForm.Refresh;
    Sleep(1000);
  end;
end;


function NextButtonClick(CurPageID: Integer): Boolean;
var
  ScriptsPath: String;
  QRPngPath, QRBmpPath: String;
  PSCommand: String;
  Timeout: Integer;
  NodeExe: String;       // <-- NUEVO: ruta absoluta a node.exe
begin
  Result := True;

  if CurPageID = DevicePage.ID then
  begin
    DeviceCount := StrToIntDef(DevicePage.Values[0], 0);
    if DeviceCount <= 0 then
    begin
      MsgBox('Por favor, ingrese un número válido.', mbError, MB_OK);
      Result := False;
      Exit;
    end;

    ScriptsPath := ExpandConstant('{tmp}\Scripts\');
    QRPngPath   := ScriptsPath + 'qr.png';
    QRBmpPath   := ScriptsPath + 'qr.bmp';

    // 1. Limpiar archivos de un intento anterior
    if FileExists(QRPngPath) then DeleteFile(QRPngPath);
    if FileExists(QRBmpPath) then DeleteFile(QRBmpPath);

    // 2. Resolver ruta absoluta de node.exe
    //    Inno Setup NO hereda el PATH del sistema, por lo que 'node' no se encuentra
    //    aunque esté instalado. FindNodeExe() lo busca vía registro y rutas conocidas.
    NodeExe := FindNodeExe();
    if NodeExe = '' then
    begin
      MsgBox(
        'No se encontró node.exe en el sistema.' + #13#10 +
        'Asegúrese de que Node.js esté instalado y vuelva a intentarlo.',
        mbError, MB_OK
      );
      Result := False;
      Exit;
    end;

    // 3. Ejecutar Node en segundo plano via archivo .bat temporal
    //    cmd.exe /c tiene problemas de quoting cuando hay múltiples argumentos
    //    entre comillas. Escribir un .bat evita el problema completamente.
    SaveStringToFile(
      ScriptsPath + 'run_node.bat',
      '@echo off' + #13#10 +
      '"' + NodeExe + '" "' + ScriptsPath + 'device-sync.js" ' + IntToStr(DeviceCount) +
      ' > "' + ScriptsPath + 'node.log" 2>&1' + #13#10,
      False
    );

    if not Exec(
      'cmd.exe',
      '/c "' + ScriptsPath + 'run_node.bat"',
      ScriptsPath,
      SW_HIDE,
      ewNoWait,
      ResultCode
    ) then
    begin
      MsgBox(
        'Error al iniciar Node.js.' + #13#10 +
        'Ruta usada: ' + NodeExe + #13#10 +
        'Revise: ' + ScriptsPath + 'node.log',
        mbError, MB_OK
      );
      Result := False;
      Exit;
    end;

    StatusLabelDevices.Caption := 'Generando código QR...';
    StatusLabelDevices.Visible := True;
    WizardForm.Refresh;

    // 4. Esperar hasta 10 segundos a que Node genere el PNG
    //    (ampliado de 5s a 10s por si la máquina es lenta al arrancar el servidor)
    Timeout := 0;
    while (not FileExists(QRPngPath)) and (Timeout < 50) do
    begin
      Sleep(200);
      Timeout := Timeout + 1;
    end;

    // 5. Convertir PNG → BMP con System.Drawing (Inno solo muestra BMP)
    if FileExists(QRPngPath) then
    begin
      PSCommand :=
        '-NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Drawing; ' +
        '$src = [System.Drawing.Image]::FromFile(''' + QRPngPath + '''); ' +
        '$bmp = New-Object System.Drawing.Bitmap(200, 200); ' +
        '$g = [System.Drawing.Graphics]::FromImage($bmp); ' +
        '$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic; ' +
        '$g.DrawImage($src, 0, 0, 200, 200); ' +
        '$g.Dispose(); $src.Dispose(); ' +
        '$bmp.Save(''' + QRBmpPath + ''', [System.Drawing.Imaging.ImageFormat]::Bmp); ' +
        '$bmp.Dispose();"';

      Exec('powershell.exe', PSCommand, '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

      // 6. Mostrar el BMP en la UI
      if FileExists(QRBmpPath) then
      begin
        QRImage.Bitmap.LoadFromFile(QRBmpPath);
        QRImage.Visible := True;
        QRImage.Left := (DevicePage.SurfaceWidth - QRImage.Width) div 2;
        QRImage.Top := ScaleY(65);
      end else
      begin
        MsgBox('Error: Windows no pudo convertir el QR a formato BMP.', mbError, MB_OK);
      end;
    end else
    begin
      MsgBox(
        'Error: No se pudo generar el QR (Node.js no creó qr.png).' + #13#10 +
        'Revise el log en: ' + ScriptsPath + 'node.log',
        mbError, MB_OK
      );
    end;

    // 7. Bloquear el instalador hasta que todos los dispositivos se conecten
    WizardForm.NextButton.Enabled := False;
    try
      WaitForDevices();
    finally
      WizardForm.NextButton.Enabled := True;
    end;
  end;
end;

// ============================
// FLUJO PRINCIPAL
// ============================
procedure CurStepChanged(CurStep: TSetupStep);
var
  ScriptsPath: String;
  SqlSetupDir: String;
begin
  if CurStep = ssPostInstall then
  begin
    ScriptsPath := ExpandConstant('{tmp}\Scripts\');
    SqlSetupDir := ExpandConstant('{tmp}\SQLEXPR');

    // 1. Instalar SQL Server
    ExecOrFail('powershell.exe',
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s05_install_sql.ps1" -SetupDir "%s"', [ScriptsPath, SqlSetupDir]));

    // 2. Inicializar DB
    ExecOrFail('powershell.exe',
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s02_init_db.ps1" -AppDir "%s"', [ScriptsPath, ExpandConstant('{app}')]));

    // 3. Obtener la IP final
    ExecOrFail('powershell.exe',
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s04_get_ip.ps1"', [ScriptsPath]));

    IP := GetIPFromFile();

    if IP = '' then
    begin
      MsgBox('Advertencia: No se pudo recuperar la IP local, pero la instalación continuará.', mbInformation, MB_OK);
    end;

    // 4. Configurar Firewall
    ExecOrFail('powershell.exe',
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s06_firewall.ps1"', [ScriptsPath]));
  end;
end;