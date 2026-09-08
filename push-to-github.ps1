param(
    [string]$RepoUrl
)

$root = $PSScriptRoot
Set-Location $root
$env:Path = "$env:Path;$env:LOCALAPPDATA\Programs\Git\cmd"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Push Medical Administration Portal to GitHub" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$defaultUrl = "https://github.com/samithkumar2315-cloud/medical-admin-portal.git"
if (-not $RepoUrl) {
    Write-Host "Default Repository URL: $defaultUrl" -ForegroundColor Gray
    $inputUrl = Read-Host "Press Enter to use default, or paste a different URL"
    if ($inputUrl) {
        $RepoUrl = $inputUrl
    } else {
        $RepoUrl = $defaultUrl
    }
}

# Remove existing origin if already present
git remote remove origin 2>$null

# Add new origin and push
Write-Host "`nSetting remote origin to: $RepoUrl" -ForegroundColor Yellow
git remote add origin $RepoUrl

Write-Host "Pushing main branch to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Check your GitHub repository URL and authentication." -ForegroundColor Red
}
