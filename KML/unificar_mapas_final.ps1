#!/usr/bin/env powershell
# Script para unificar todos los polígonos de los mapas KML

$kmlFolder = "d:\Sisten Pruebas\Sisten_Chaide2025\Sisten_Chaide\KML"
$outputFile = "$kmlFolder\MapaZonificacionNacional.kml"

# Configuración de log en archivo
$logFile = "$kmlFolder\unificar_mapas_log.txt"
function Write-Log {
    param([string]$msg)
    Add-Content -Path $logFile -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg)
}

# Obtener rutas de archivos dinámicamente
$archivos = @(Get-ChildItem $kmlFolder -Filter "*.kml" | Where-Object { $_.Name -notlike "MapaZonificacionNacional*" } | Select-Object -ExpandProperty FullName)

Write-Log "Archivos encontrados: $($archivos.Count)"
Write-Log "Archivos: $($archivos -join ', ')"

# Crear documento XML base
[xml]$xml = New-Object System.Xml.XmlDocument
$xmlDeclaration = $xml.CreateXmlDeclaration("1.0", "UTF-8", $null)
$xml.AppendChild($xmlDeclaration) | Out-Null

$kmlElement = $xml.CreateElement("kml")
$kmlElement.SetAttribute("xmlns", "http://www.opengis.net/kml/2.2")
$xml.AppendChild($kmlElement) | Out-Null

$documentElement = $xml.CreateElement("Document")
$kmlElement.AppendChild($documentElement) | Out-Null

$nameElement = $xml.CreateElement("name")
$nameElement.InnerText = "Mapa de Zonificacion Nacional"
$documentElement.AppendChild($nameElement) | Out-Null

$descElement = $xml.CreateElement("description")
$descElement.InnerText = "Mapa unificado que contiene todos los poligonos de zonificacion nacional"
$documentElement.AppendChild($descElement) | Out-Null

# Procesar cada archivo
$totalPlacemarks = 0
foreach ($archivo in $archivos) {
    Write-Log "Procesando: $(Split-Path $archivo -Leaf)"
    
    try {
        [xml]$xmlFuente = Get-Content $archivo -Encoding UTF8
    } catch {
        Write-Log "ERROR leyendo archivo $archivo: $_"
        continue
    }
    
    # Extraer y copiar estilos
    foreach ($estilo in $xmlFuente.GetElementsByTagName("Style")) {
        $nuevoEstilo = $xml.ImportNode($estilo, $true)
        $documentElement.AppendChild($nuevoEstilo) | Out-Null
    }
    
    foreach ($styleMap in $xmlFuente.GetElementsByTagName("StyleMap")) {
        $nuevoStyleMap = $xml.ImportNode($styleMap, $true)
        $documentElement.AppendChild($nuevoStyleMap) | Out-Null
    }
    
    # Extraer y copiar placemarks
    foreach ($placemark in $xmlFuente.GetElementsByTagName("Placemark")) {
        $nuevoPlacemark = $xml.ImportNode($placemark, $true)
        $documentElement.AppendChild($nuevoPlacemark) | Out-Null
        $totalPlacemarks++
        Write-Log "Placemark agregado de $archivo"
    }
}

# Guardar archivo usando Save
try {
    $xml.Save($outputFile)
    Write-Log "Archivo unificado guardado: $outputFile"
} catch {
    Write-Log "ERROR guardando archivo unificado: $_"
}

Write-Log "Total de poligonos en documento unificado: $totalPlacemarks"
