$kmlPath = "d:\Sisten Pruebas\Sisten2\KML\MapaZonificacionNacional.kml"
$jsonOut = "d:\Sisten Pruebas\Sisten2\KML\poligonos_consolidados.json"
$logFile = "d:\Sisten Pruebas\Sisten2\KML\export_log.txt"

"=== INICIO ===" | Set-Content $logFile
"Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Add-Content $logFile

[xml]$kml = Get-Content $kmlPath -Raw -Encoding UTF8
$nsManager = New-Object System.Xml.XmlNamespaceManager($kml.NameTable)
$nsManager.AddNamespace("kml", "http://www.opengis.net/kml/2.2")

$poligonos = @()
$placemarks = $kml.SelectNodes("//kml:Placemark", $nsManager)
"Total Placemarks: $($placemarks.Count)" | Add-Content $logFile

foreach ($placemark in $placemarks) {
    $nombre = $placemark.SelectSingleNode("kml:name", $nsManager)
    $nombreText = if ($nombre) { $nombre.InnerText } else { "SinNombre" }
    
    $polygon = $placemark.SelectSingleNode("kml:Polygon", $nsManager)
    if ($polygon) {
        $coordsNode = $polygon.SelectSingleNode("kml:outerBoundaryIs/kml:LinearRing/kml:coordinates", $nsManager)
        if ($coordsNode) {
            $coordsText = $coordsNode.InnerText
            $coords = $coordsText -split '[\s\n\r]+' | Where-Object { $_ -and $_.Trim() }
            
            $puntos = @()
            foreach ($coord in $coords) {
                $parts = $coord.Trim() -split ","
                if ($parts.Length -ge 2) {
                    $puntos += @{ lat = [double]$parts[1]; lng = [double]$parts[0] }
                }
            }
            
            if ($puntos.Count -gt 0) {
                $poligono = @{
                    nombre = $nombreText
                    puntos = $puntos
                    totalPuntos = $puntos.Count
                }
                $poligonos += $poligono
                $msg = "$nombreText`: $($puntos.Count) puntos"
                $msg | Add-Content $logFile
            }
        }
    }
}

"Total polígonos: $($poligonos.Count)" | Add-Content $logFile
$poligonos | ConvertTo-Json -Depth 5 | Set-Content $jsonOut -Encoding UTF8
"Archivo guardado: $jsonOut" | Add-Content $logFile
"=== FIN ===" | Add-Content $logFile

Write-Host "Polígonos extraídos: $($poligonos.Count)"
Write-Host "Archivo JSON: $jsonOut"
