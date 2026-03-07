param(
    [string]$processName
)

# 获取 Chrome 进程
$process = Get-Process -Name $processName -ErrorAction SilentlyContinue | Select-Object -First 1

if ($process) {
    # 使用 User32.dll 最小化窗口
    Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class NativeMethods {
        [DllImport("user32.dll")]
        public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
    }
"@
    
    # SW_MINIMIZE = 6
    [NativeMethods]::ShowWindowAsync($process.MainWindowHandle, 6)
    Write-Host "窗口已最小化"
} else {
    Write-Host "未找到进程：$processName"
}
