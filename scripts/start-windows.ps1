param(
  [int]$Port = 4173,
  [string]$HostAddress = '127.0.0.1'
)
$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$env:PORT = [string]$Port
$env:HOST = $HostAddress
Push-Location $project
try {
  node server.js
} finally {
  Pop-Location
}
