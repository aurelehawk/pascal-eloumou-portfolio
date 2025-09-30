Add-Type -AssemblyName System.Web

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()

Write-Host "🚀 Serveur démarré sur http://localhost:8080/" -ForegroundColor Green
Write-Host "📊 Interface admin: http://localhost:8080/admin.html" -ForegroundColor Cyan
Write-Host "🌐 Site principal: http://localhost:8080/index.html" -ForegroundColor Yellow
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq '/') { 
            $path = '/index.html' 
        }
        
        $filePath = Join-Path (Get-Location) $path.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath)
            
            switch ($ext) {
                '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                '.js' { $response.ContentType = 'application/javascript; charset=utf-8' }
                '.css' { $response.ContentType = 'text/css; charset=utf-8' }
                '.json' { $response.ContentType = 'application/json; charset=utf-8' }
                '.jpeg' { $response.ContentType = 'image/jpeg' }
                '.jpg' { $response.ContentType = 'image/jpeg' }
                '.png' { $response.ContentType = 'image/png' }
                default { $response.ContentType = 'text/plain; charset=utf-8' }
            }
            
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            
            Write-Host "✅ $($request.HttpMethod) $path - 200 OK" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $errorContent = [System.Text.Encoding]::UTF8.GetBytes('404 - Fichier non trouvé')
            $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
            
            Write-Host "❌ $($request.HttpMethod) $path - 404 NOT FOUND" -ForegroundColor Red
        }
        
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Serveur arrete." -ForegroundColor Yellow
}