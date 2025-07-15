# 🏰 Oak Dragon Covenant - Docker Management Script (PowerShell)
param(
    [Parameter(Position=0)]
    [ValidateSet("build", "dev", "prod", "stop", "restart", "logs", "clean", "health", "shell", "backup", "help")]
    [string]$Command = "help"
)

# Configuration
$ProjectName = "oak-dragon-covenant"
$ComposeFile = "docker-compose.new.yml"
$DevComposeFile = "docker-compose.dev.yml"

# Functions
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Show-Help {
    Write-Host "🏰 Oak Dragon Covenant - Docker Management" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-manage.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  build          Build the Docker image" -ForegroundColor Gray
    Write-Host "  dev            Start in development mode" -ForegroundColor Gray
    Write-Host "  prod           Start in production mode" -ForegroundColor Gray
    Write-Host "  stop           Stop all services" -ForegroundColor Gray
    Write-Host "  restart        Restart all services" -ForegroundColor Gray
    Write-Host "  logs           Show logs" -ForegroundColor Gray
    Write-Host "  clean          Clean up containers and images" -ForegroundColor Gray
    Write-Host "  health         Check health status" -ForegroundColor Gray
    Write-Host "  shell          Open shell in running container" -ForegroundColor Gray
    Write-Host "  backup         Backup volumes" -ForegroundColor Gray
    Write-Host "  help           Show this help message" -ForegroundColor Gray
    Write-Host ""
}

function Build-Image {
    Write-Info "Building Oak Dragon Covenant Docker image..."
    docker build -f Dockerfile.new -t "$($ProjectName):latest" .
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Image built successfully!"
    } else {
        Write-Error "Build failed!"
        exit 1
    }
}

function Start-Dev {
    Write-Info "Starting Oak Dragon Covenant in development mode..."
    docker-compose -f $ComposeFile -f $DevComposeFile up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Development environment started!"
        Write-Info "Application available at: http://localhost:3000"
        Write-Info "API status: http://localhost:3000/api"
        Write-Info "Health check: http://localhost:3000/health"
    } else {
        Write-Error "Failed to start development environment!"
    }
}

function Start-Prod {
    Write-Info "Starting Oak Dragon Covenant in production mode..."
    docker-compose -f $ComposeFile up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Production environment started!"
        Write-Info "Application available at: http://localhost:3000"
    } else {
        Write-Error "Failed to start production environment!"
    }
}

function Stop-Services {
    Write-Info "Stopping Oak Dragon Covenant services..."
    docker-compose -f $ComposeFile down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services stopped!"
    }
}

function Restart-Services {
    Write-Info "Restarting Oak Dragon Covenant services..."
    docker-compose -f $ComposeFile restart
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services restarted!"
    }
}

function Show-Logs {
    Write-Info "Showing Oak Dragon Covenant logs..."
    docker-compose -f $ComposeFile logs -f --tail=100
}

function Clean-Up {
    Write-Warning "This will remove all containers, networks, and unused images!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Write-Info "Cleaning up Docker resources..."
        docker-compose -f $ComposeFile down -v --remove-orphans
        docker system prune -f
        docker volume prune -f
        Write-Success "Cleanup completed!"
    } else {
        Write-Info "Cleanup cancelled."
    }
}

function Check-Health {
    Write-Info "Checking Oak Dragon Covenant health..."
    
    # Check if containers are running
    $containers = docker-compose -f $ComposeFile ps -q
    if ($containers) {
        Write-Success "Containers are running"
        
        # Check application health
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Success "Application is healthy"
                try {
                    $apiResponse = Invoke-WebRequest -Uri "http://localhost:3000/api" -UseBasicParsing -TimeoutSec 10
                    Write-Host $apiResponse.Content
                } catch {
                    Write-Warning "Could not fetch API status"
                }
            }
        } catch {
            Write-Error "Application health check failed"
        }
    } else {
        Write-Error "Containers are not running"
    }
}

function Open-Shell {
    Write-Info "Opening shell in Oak Dragon Covenant container..."
    docker-compose -f $ComposeFile exec oak-dragon-app sh
}

function Backup-Volumes {
    Write-Info "Creating backup of Oak Dragon Covenant data..."
    $backupDir = ".\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    docker run --rm -v oak-dragon-covenant_oak-dragon-logs:/data -v "$($PWD.Path)\$backupDir:/backup" busybox tar czf /backup/logs.tar.gz -C /data .
    docker run --rm -v oak-dragon-covenant_oak-dragon-data:/data -v "$($PWD.Path)\$backupDir:/backup" busybox tar czf /backup/data.tar.gz -C /data .
    
    Write-Success "Backup created in $backupDir"
}

# Main script logic
switch ($Command) {
    "build" { Build-Image }
    "dev" { 
        Build-Image
        Start-Dev 
    }
    "prod" { 
        Build-Image
        Start-Prod 
    }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "clean" { Clean-Up }
    "health" { Check-Health }
    "shell" { Open-Shell }
    "backup" { Backup-Volumes }
    default { Show-Help }
}
