# Umi-OCR API 测试脚本
# 使用 PowerShell 测试 Umi-OCR HTTP API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Umi-OCR API 测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置API地址
$apiUrl = "http://127.0.0.1:1224/api/ocr"

Write-Host "API地址: $apiUrl" -ForegroundColor Yellow
Write-Host ""

# 检查服务是否可访问
Write-Host "1. 检查服务连接..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:1224" -Method GET -TimeoutSec 5
    Write-Host "   ✓ 服务可访问 (状态码: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ 无法访问服务: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确认：" -ForegroundColor Yellow
    Write-Host "  - Umi-OCR 已启动" -ForegroundColor White
    Write-Host "  - HTTP 服务已开启" -ForegroundColor White
    Write-Host "  - 端口号是 1224" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "服务测试成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "接下来请在 AutoX.js 手机端运行脚本进行测试。" -ForegroundColor Yellow
Write-Host ""
Write-Host "手机端运行前请确认：" -ForegroundColor Cyan
Write-Host "  1. 手机和电脑在同一 WiFi 网络" -ForegroundColor White
Write-Host "  2. 手机 IP 是 192.168.2.x 格式" -ForegroundColor White
Write-Host "  3. 电脑 IP 是 192.168.2.100" -ForegroundColor White
Write-Host "  4. 防火墙已允许 1224 端口" -ForegroundColor White
Write-Host ""