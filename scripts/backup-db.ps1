param(
  [string]$Database = "agriculture_db",
  [string]$User = "root",
  [string]$BackupDirectory = ".\backups"
)

$resolvedBackupDirectory = [System.IO.Path]::GetFullPath($BackupDirectory)
New-Item -ItemType Directory -Force -Path $resolvedBackupDirectory | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputFile = Join-Path $resolvedBackupDirectory "$Database-$timestamp.sql"

& mysqldump --user=$User --password --single-transaction --routines --triggers $Database |
  Out-File -FilePath $outputFile -Encoding utf8

if ($LASTEXITCODE -ne 0) {
  throw "Pravljenje rezervne kopije nije uspelo."
}
Write-Host "Rezervna kopija je napravljena: $outputFile"
