# A tiny local web server for the offline map, using only what Windows already has (no install).
# It serves the "site" folder next to this file on http://localhost:5175/ and opens your browser.
# Close this window to stop it.

$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'site'
$port = 5175
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.mjs' = 'text/javascript; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'; '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.webp' = 'image/webp'; '.pbf' = 'application/x-protobuf'
  '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'; '.geojson' = 'application/geo+json'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try { $listener.Start() } catch {
  Write-Host "Could not start on port $port. Is the map already open in another window?" -ForegroundColor Yellow
  exit 1
}
Write-Host "Palestine: A Living Map is running at http://localhost:$port/  (close this window to stop it)"
Start-Process "http://localhost:$port/"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $response = $context.Response
  try {
    $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
    if ($path -eq '') { $path = 'index.html' }
    $file = [System.IO.Path]::GetFullPath((Join-Path $root $path))
    if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) {
      $response.StatusCode = 404
    } else {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      # Always send the files again, so a rebuilt map is never hidden behind the browser's old copy.
      $response.Headers.Add('Cache-Control', 'no-store')
      $response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    $response.StatusCode = 500
  } finally {
    $response.Close()
  }
}
