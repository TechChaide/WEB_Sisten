# Script para unificar mapas KML
$kmlFolder = "d:\Sisten Pruebas\Sisten_Chaide2025\Sisten_Chaide\KML"
$outputFile = "$kmlFolder\MapaZonificacionNacional.kml"

# Configuración de log en archivo
$logFile = "$kmlFolder\unificar_mapas_log.txt"
function Write-Log {
    param([string]$msg)
    Add-Content -Path $logFile -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg)
}

# Archivos a unificar
$archivos = @(
    "MAPA DE ZONIFICACION NACIONAL GYE.kml",
    "MAPA DE ZONIFICACION NACIONAL SEGUNDO MAPA.kml",
    "SEGMENTACION DE ZONAS MANABI - LOS - RIOS - PENINSULA.kml"
)

# Obtener archivos dinámicamente para evitar problemas de encoding
$todosArchivos = Get-ChildItem $kmlFolder -Filter "*.kml" | Where-Object { $_.Name -notlike "MapaZonificacionNacional*" } | Select-Object -ExpandProperty Name
$archivos = $todosArchivos

Write-Log "Archivos encontrados: $($archivos.Count)"
Write-Log "Archivos: $($archivos -join ', ')"

# Array para guardar estilos y placemarks
$estilos = @()
$placemarks = @()

# Procesar cada archivo
foreach ($archivo in $archivos) {
    $rutaArchivo = Join-Path $kmlFolder $archivo
    Write-Log "Leyendo: $archivo"
    
    try {
        $contenido = [xml](Get-Content $rutaArchivo -Encoding UTF8)
    } catch {
        Write-Log "ERROR leyendo archivo $rutaArchivo: $_"
        continue
    }
    
    # Extraer todos los estilos (Style y StyleMap)
    $contenido.kml.Document.Style | ForEach-Object { $estilos += $_ }
    $contenido.kml.Document.StyleMap | ForEach-Object { $estilos += $_ }
    
    # Extraer todos los Placemarks
    $contenido.kml.Document.Placemark | ForEach-Object { $placemarks += $_ }
    Write-Log "Placemarks agregados de $archivo: $($contenido.kml.Document.Placemark.Count)"
}

Write-Host "Total de estilos: $($estilos.Count)"
Write-Host "Total de polígonos: $($placemarks.Count)"

# Crear documento XML unificado
$xmlDoc = New-Object System.Xml.XmlDocument
$xmlDoc.PreserveWhitespace = $true

# Declaración XML
$xmlDeclaration = $xmlDoc.CreateXmlDeclaration("1.0", "UTF-8", $null)
$xmlDoc.AppendChild($xmlDeclaration) | Out-Null

# Elemento raíz KML
$kmlElement = $xmlDoc.CreateElement("kml")
$kmlElement.SetAttribute("xmlns", "http://www.opengis.net/kml/2.2")
$xmlDoc.AppendChild($kmlElement) | Out-Null

# Elemento Document
$documentElement = $xmlDoc.CreateElement("Document")
$kmlElement.AppendChild($documentElement) | Out-Null

# Nombre y descripción
$nameElement = $xmlDoc.CreateElement("name")
$nameElement.InnerText = "Mapa de Zonificación Nacional"
$documentElement.AppendChild($nameElement) | Out-Null

$descElement = $xmlDoc.CreateElement("description")
$descElement.InnerText = "Mapa unificado que contiene polígonos de zonificación de: Guayaquil, Manaí, Los Ríos, Península y otras zonas nacionales"
$documentElement.AppendChild($descElement) | Out-Null

# Agregar todos los estilos
foreach ($estilo in $estilos) {
    $nuevoEstilo = $xmlDoc.ImportNode($estilo, $true)
    $documentElement.AppendChild($nuevoEstilo) | Out-Null
}

# Agregar todos los placemarks
foreach ($placemark in $placemarks) {
    $nuevoPlacemark = $xmlDoc.ImportNode($placemark, $true)
    $documentElement.AppendChild($nuevoPlacemark) | Out-Null
}

# Guardar archivo
try {
    $xmlDoc.Save($outputFile)
    Write-Log "Archivo unificado guardado: $outputFile"
} catch {
    Write-Log "ERROR guardando archivo unificado: $_"
}

Write-Log "Total de estilos: $($estilos.Count)"
Write-Log "Total de placemarks: $($placemarks.Count)"
Write-Log "Total de elementos: $($estilos.Count + $placemarks.Count)"
