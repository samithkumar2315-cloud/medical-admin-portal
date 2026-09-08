Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Medical Administration Portal - Build & Deploy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Build Frontend
Write-Host "`n[1/3] Building React Frontend..." -ForegroundColor Yellow
Set-Location "$root\frontend"
cmd.exe /c npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# 2. Copy dist to backend wwwroot
Write-Host "`n[2/3] Updating Backend wwwroot..." -ForegroundColor Yellow
if (Test-Path "$root\backend\wwwroot") {
    Remove-Item -Recurse -Force "$root\backend\wwwroot"
}
Copy-Item -Recurse -Force "$root\frontend\dist" "$root\backend\wwwroot"

# 3. Publish Backend
Write-Host "`n[3/3] Publishing ASP.NET Core Backend (Release)..." -ForegroundColor Yellow
Set-Location "$root\backend"
dotnet publish -c Release -o "$root\publish"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend publish failed!" -ForegroundColor Red
    exit 1
}

Set-Location $root
Write-Host "`n✓ Deployment Build Completed Successfully!" -ForegroundColor Green
Write-Host "Production bundle located at: $root\publish" -ForegroundColor Green
Write-Host "To launch: Run start-production.bat" -ForegroundColor Cyan
