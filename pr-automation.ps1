[CmdletBinding()]
param(
    [Parameter()] [string] $Repo = "brandonlacoste9-tech/adgenxai",
    [Parameter()] [ValidateSet("json", "markdown")] [string] $Format = "json",
    [Parameter()] [string] $OutputPath = "artifacts/triage-report.json",
    [Parameter()] [int] $Limit = 50,
    [Parameter()] [switch] $DryRun,
    [Parameter()] [switch] $Force,
    [Parameter()] [string] $LogPath = "logs/pr-automation.log",
    [Parameter()] [string] $GitHubApiBase = "https://api.github.com"
)

$ErrorActionPreference = "Stop"

function Initialize-Log {
    param([string] $Path)
    $directory = Split-Path -Path $Path -Parent
    if (-not [string]::IsNullOrWhiteSpace($directory)) {
        if (-not (Test-Path -Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
    }
    if (-not (Test-Path -Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
    }
}

Initialize-Log -Path $LogPath

function Write-Log {
    param(
        [string] $Message,
        [string] $Level = "INFO"
    )
    $timestamp = (Get-Date).ToString("s")
    $entry = "[$timestamp][$Level] $Message"
    Add-Content -Path $LogPath -Value $entry
}

function Write-Status {
    param(
        [string] $Message,
        [string] $Level = "Info"
    )
    $prefix = "[$Level]"
    Write-Host "$prefix $Message"
    Write-Log -Message "$prefix $Message" -Level $Level.ToUpperInvariant()
}

function Ensure-Token {
    param([string] $ApiBase)
    $ApiTimeoutSeconds = 8
    
    if (-not $env:GITHUB_TOKEN -or [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
        Write-Status "GITHUB_TOKEN not set in session. Set it with: $env:GITHUB_TOKEN = 'ghp_your_token'" "Error"
        exit 1
    }

    $headers = @{ Authorization = "token $($env:GITHUB_TOKEN)"; "User-Agent" = "pr-automation" }

    try {
        $response = Invoke-RestMethod -Uri "$ApiBase/user" -Headers $headers -Method Get -TimeoutSec $ApiTimeoutSeconds
        if (-not $response.login) {
            throw "GitHub API returned an unexpected payload."
        }
        Write-Status "Authenticated as $($response.login)" "Info"
    }
    catch {
        Write-Status "GITHUB_TOKEN rejected by GitHub API: $($_.Exception.Message)" "Error"
        exit 1
    }
}

function Write-FileSafely {
    param(
        [string] $TargetPath,
        [string] $Content
    )
    $directory = Split-Path -Path $TargetPath -Parent
    if (-not [string]::IsNullOrWhiteSpace($directory)) {
        if (-not (Test-Path -Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
    }
    $tempPath = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tempPath, $Content, [System.Text.Encoding]::UTF8)
    Move-Item -Path $tempPath -Destination $TargetPath -Force
}

function Invoke-Process {
    param(
        [string] $FilePath,
        [string[]] $Arguments,
        [string] $Description,
        [string] $WorkingDirectory = (Get-Location).Path
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $FilePath
    $psi.WorkingDirectory = $WorkingDirectory
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true

    foreach ($argument in $Arguments) {
        $null = $psi.ArgumentList.Add($argument)
    }

    Write-Status "Starting $Description" "Info"
    $process = [System.Diagnostics.Process]::Start($psi)
    
    # Read stdout and stderr concurrently to avoid deadlock
    $stdoutJob = Start-Job -ScriptBlock { param($so) $so.ReadToEnd() } -ArgumentList $process.StandardOutput
    $stderrJob = Start-Job -ScriptBlock { param($se) $se.ReadToEnd() } -ArgumentList $process.StandardError

    # Wait for both jobs to finish
    Wait-Job -Job $stdoutJob, $stderrJob | Out-Null
    $stdout = Receive-Job -Job $stdoutJob
    $stderr = Receive-Job -Job $stderrJob

    # Clean up jobs
    Remove-Job -Job $stdoutJob, $stderrJob | Out-Null
    
    $process.WaitForExit()

    if ($stderr) {
        Write-Status "$Description stderr: $stderr" "Warning"
    }

    if ($process.ExitCode -ne 0) {
        Write-Status "$Description failed with exit code $($process.ExitCode)" "Error"
        throw "$Description failed"
    }

    Write-Status "$Description completed" "Info"
    return [PSCustomObject]@{ StdOut = $stdout; StdErr = $stderr; ExitCode = $process.ExitCode }
}

try {
    Ensure-Token -ApiBase $GitHubApiBase

    $isInteractive = $Host.Name -ne "ServerRemoteHost" -and $Host.UI -and $Host.UI.RawUI
    if (-not $Force -and $isInteractive -and -not $DryRun) {
        $answer = Read-Host "Proceed with automation steps? Type YES to continue"
        if ($answer.ToUpperInvariant() -ne "YES") {
            Write-Status "Automation cancelled by user" "Warning"
            exit 0
        }
    }

    $arguments = @("run", "triage:prs", "--", "--repo", $Repo, "--format", $Format, "--limit", $Limit.ToString(), "--output", "-")
    if ($DryRun) {
        $arguments += "--dry-run"
    }
    if ($Force) {
        $arguments += "--force"
    }

    $result = Invoke-Process -FilePath "npm" -Arguments $arguments -Description "npm triage pipeline"

    Write-FileSafely -TargetPath $OutputPath -Content $result.StdOut
    Write-Status "Report written to $OutputPath" "Info"
}
catch {
    Write-Status "Automation failed: $($_.Exception.Message)" "Error"
    exit 1
}
finally {
    Write-Status "Automation script finished" "Info"
}
