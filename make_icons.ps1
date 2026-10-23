# Generates icon16.png, icon48.png, icon128.png using System.Drawing
# The icon: a gold rounded square with a play-triangle + film-strip marks

Add-Type -AssemblyName System.Drawing

function Make-Icon {
  param([int]$size, [string]$outPath)

  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g   = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  [int]$pad     = [Math]::Round($size * 0.07)
  [int]$cornerR = [Math]::Round($size * 0.22)
  [int]$innerW  = $size - $pad * 2
  [int]$innerH  = $size - $pad * 2
  [int]$cr2     = $cornerR * 2

  # Gold gradient background (rounded rect path)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($size, $size)),
    [System.Drawing.Color]::FromArgb(255, 255, 230, 140),
    [System.Drawing.Color]::FromArgb(255, 180, 120, 20)
  )

  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gp.AddArc($pad,                       $pad,                       $cr2, $cr2, 180, 90)
  $gp.AddArc($size - $pad - $cr2,        $pad,                       $cr2, $cr2, 270, 90)
  $gp.AddArc($size - $pad - $cr2,        $size - $pad - $cr2,        $cr2, $cr2,   0, 90)
  $gp.AddArc($pad,                       $size - $pad - $cr2,        $cr2, $cr2,  90, 90)
  $gp.CloseFigure()

  $g.FillPath($brush, $gp)

  # Dark border
  [float]$pw  = [float]($size) * 0.025
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 80, 40, 0), $pw)
  $g.DrawPath($pen, $gp)

  # Dark brown brush for details
  $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 60, 35, 5))

  # Play triangle
  [int]$cx = [Math]::Round($size * 0.54)
  [int]$cy = [Math]::Round($size * 0.50)
  [int]$ts = [Math]::Round($size * 0.28)
  [int]$tsH = [Math]::Round($ts / 2)

  [System.Drawing.Point[]]$tri = @(
    [System.Drawing.Point]::new($cx - $tsH, $cy - $ts),
    [System.Drawing.Point]::new($cx + $ts,  $cy),
    [System.Drawing.Point]::new($cx - $tsH, $cy + $ts)
  )
  $g.FillPolygon([System.Drawing.Brush]$darkBrush, $tri)

  # Two film-strip tick marks on the left
  [int]$tw  = [Math]::Round($size * 0.08)
  [int]$th  = [Math]::Round($size * 0.12)
  [int]$tx  = [Math]::Round($size * 0.19)
  [int]$t1y = [Math]::Round($size * 0.30)
  [int]$t2y = [Math]::Round($size * 0.58)
  $g.FillRectangle([System.Drawing.Brush]$darkBrush, $tx, $t1y, $tw, $th)
  $g.FillRectangle([System.Drawing.Brush]$darkBrush, $tx, $t2y, $tw, $th)

  $g.Dispose()
  $brush.Dispose()
  $pen.Dispose()
  $darkBrush.Dispose()
  $gp.Dispose()

  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Saved $outPath"
}

$base = "C:\Users\Sanjeev\.gemini\antigravity\scratch\yt-gold-glass-v10\icons"
Make-Icon -size 16  -outPath "$base\icon16.png"
Make-Icon -size 48  -outPath "$base\icon48.png"
Make-Icon -size 128 -outPath "$base\icon128.png"
Write-Host "All icons generated."
