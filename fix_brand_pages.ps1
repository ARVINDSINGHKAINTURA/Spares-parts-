$pages = @{ "abb" = "ABB"; "fanuc" = "Fanuc"; "indramat" = "Indramat"; "mitsubishi" = "Mitsubishi"; "schneider" = "Schneider"; "siemens" = "Siemens"; "br" = "B&R" }
foreach ($p in $pages.GetEnumerator()) {
    $file = $p.Key + ".html"
    if (-not (Test-Path $file)) { continue }
    $content = Get-Content $file
    $brand = $p.Value
    $content = $content -replace 'Home &gt; Manufacturers &gt; ABB', ('Home &gt; Manufacturers &gt; ' + $brand)
    $content = $content -replace 'aria-label="ABB overview"', ('aria-label="' + $brand + ' overview"')
    $content = $content -replace 'aria-label="ABB part catalog"', ('aria-label="' + $brand + ' part catalog"')
    $h2Replacement = '<h2>' + $brand + '</h2>'
    $content = $content -replace '<h2>ABB</h2>', $h2Replacement
    $content = $content -replace '<p class="prod-breadcrumb">Home &gt; Manufacturers &gt; ABB</p>', ('<p class="prod-breadcrumb">Home &gt; Manufacturers &gt; ' + $brand + '</p>')
    $h4Replacement = '<h4>' + $brand + '</h4>'
    $content = $content -replace '<h4>ABB</h4>', $h4Replacement
    $titleReplacement = '<title>' + $brand + ' - Products | Simha Automation Hub</title>'
    $content = $content -replace '<title>Simha Automation Hub \| Products</title>', $titleReplacement
    Set-Content $file $content
}
