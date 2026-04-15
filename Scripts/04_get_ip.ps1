$ip = (Get-NetIPAddress -AddressFamily IPv4 |
Where-Object {$_.InterfaceAlias -notlike "*Loopback*"} |
Select-Object -First 1).IPAddress

Set-Content "$PSScriptRoot\ip.txt" $ip