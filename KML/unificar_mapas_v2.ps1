# Script mejorado para unificar mapas KML
$kmlFolder = "d:\Sisten Pruebas\Sisten_Chaide2025\Sisten_Chaide\KML"
$outputFile = "$kmlFolder\MapaZonificacionNacional.kml"

# Configuración de log en archivo
$logFile = "$kmlFolder\unificar_mapas_log.txt"
function Write-Log {
    param([string]$msg)
    Add-Content -Path $logFile -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg)
}

# Obtener todos los archivos KML excepto el unificado
$archivos = Get-ChildItem $kmlFolder -Filter "*.kml" | Where-Object { $_.Name -notlike "MapaZonificacionNacional*" } | Select-Object -ExpandProperty FullName
Write-Log "Archivos encontrados: $($archivos.Count)"
Write-Log "Archivos: $($archivos -join ', ')"

# Leer contenido de todos los archivos
[xml]$xmlUnificado = $null
$primeraIteracion = $true

foreach ($archivo in $archivos) {
    Write-Log "Procesando: $(Split-Path $archivo -Leaf)"
    
    try {
        [xml]$xmlActual = Get-Content $archivo -Encoding UTF8
    } catch {
        Write-Log "ERROR leyendo archivo $archivo: $_"
        continue
    }
    $nomDocument = $xmlActual.kml.Document
    
    if ($primeraIteracion) {
        # Primer archivo: usar como base
        $xmlUnificado = $xmlActual
        # Actualizar nombre y descripción del documento
        $xmlUnificado.kml.Document.name = "Mapa de Zonificacion Nacional"
        $xmlUnificado.kml.Document.description = "Mapa unificado con poligonos de todas las zonas"
        $primeraIteracion = $false
    } else {
        # Archivos posteriores: extraer estilos y placemarks
        foreach ($estilo in $nomDocument.Style) {
            $nuevoEstilo = $xmlUnificado.ImportNode($estilo, $true)
            $xmlUnificado.kml.Document.AppendChild($nuevoEstilo) | Out-Null
        }
        
        foreach ($styleMap in $nomDocument.StyleMap) {
            $nuevoStyleMap = $xmlUnificado.ImportNode($styleMap, $true)
            $xmlUnificado.kml.Document.AppendChild($nuevoStyleMap) | Out-Null
        }
        
        foreach ($placemark in $nomDocument.Placemark) {
            $nuevoPlacemark = $xmlUnificado.ImportNode($placemark, $true)
            $xmlUnificado.kml.Document.AppendChild($nuevoPlacemark) | Out-Null
            Write-Log "Placemark agregado de $archivo"
        }
    }
}

# Guardar el archivo unificado
try {
    $xmlUnificado.Save($outputFile)
    Write-Log "Archivo unificado guardado: $outputFile"
} catch {
    Write-Log "ERROR guardando archivo unificado: $_"
}

Write-Log "Total de Placemarks en documento unificado: $($xmlUnificado.kml.Document.Placemark.Count)"
