# Puts a "Research Desk" shortcut on the Desktop.
#
# It points straight at the electron.exe inside node_modules rather than at
# npm or a .cmd wrapper, which is what keeps it from flashing a console
# window on launch — electron.exe is a GUI binary, so Windows opens it with
# no terminal at all.
#
# The tradeoff is that the shortcut breaks if node_modules is deleted or
# reinstalled somewhere else. Re-run this to fix it:
#
#   cd tools/desk-app
#   npm install
#   npm run shortcut

$ErrorActionPreference = 'Stop'

$app = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe = Join-Path $app 'node_modules\electron\dist\electron.exe'

if (-not (Test-Path $exe)) {
    Write-Error "electron.exe not found. Run 'npm install' in $app first."
    exit 1
}

$lnk = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Research Desk.lnk'

$shortcut = (New-Object -ComObject WScript.Shell).CreateShortcut($lnk)
$shortcut.TargetPath       = $exe
$shortcut.Arguments        = '.'
$shortcut.WorkingDirectory = $app
$shortcut.IconLocation     = "$exe,0"
$shortcut.Description      = 'Site Atlas research desk - local subagent research notes'
$shortcut.Save()

Write-Output "Created $lnk"
