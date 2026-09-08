$root = $PSScriptRoot
$publishDir = "$root\publish"

if (-not (Test-Path "$publishDir\MedicalAdminPortal.exe")) {
    Write-Host "Production build not found. Running build-and-deploy first..." -ForegroundColor Yellow
    & "$root\build-and-deploy.ps1"
}

# Check if already running on port 5000
$existing = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Process already running on port 5000 (PID: $($existing[0].OwningProcess))." -ForegroundColor Yellow
} else {
    Write-Host "Starting Medical Administration Portal (Production Mode on http://localhost:5000)..." -ForegroundColor Cyan
    $env:ASPNETCORE_ENVIRONMENT = "Production"
    $env:ASPNETCORE_URLS = "http://0.0.0.0:5000"
    
    $proc = Start-Process -FilePath "$publishDir\MedicalAdminPortal.exe" -WorkingDirectory $publishDir -PassThru
    Write-Host "Server started with Process ID: $($proc.Id)" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host "`n✓ Portal is live at: http://localhost:5000" -ForegroundColor Green
Write-Host "Swagger Documentation: http://localhost:5000/swagger" -ForegroundColor Green
Start-Process "http://localhost:5000"
