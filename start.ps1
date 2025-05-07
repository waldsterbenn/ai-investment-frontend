# Parent script (start_all.ps1)

# Start the server script in a new PowerShell terminal
wt -w 0 -p "Windows PowerShell" powershell -noExit -c "ollama serve"
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; .\start_node.ps1"

# Start the frontend script in a new PowerShell terminal
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; .\start_dev.ps1"

Write-Host "Server and frontend scripts started in new terminals."

Read-Host -Prompt "Press Enter to exit"
