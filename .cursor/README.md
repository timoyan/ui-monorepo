# Cursor MCP Configuration

This directory contains MCP (Model Context Protocol) server configurations for Cursor IDE.

## Google Chrome DevTools MCP

The Google Chrome DevTools MCP server allows AI assistants to interact with browsers for testing and debugging.

### Setup Instructions

**Note**: MCP servers are configured in Cursor's global settings, not in project files. This file serves as documentation.

1. **Configure in Cursor Settings**:
   - Open Cursor Settings (Cmd/Ctrl + ,)
   - Navigate to "Features" → "MCP Servers" (or search for "MCP")
   - Click "Add MCP Server"
   - Use the following configuration:
     ```json
     {
       "name": "google-chrome-devtools",
       "command": "npx",
       "args": ["-y", "@modelcontextprotocol/server-chrome-devtools"]
     }
     ```

2. **Alternative: Manual Installation**:
   ```bash
   npm install -g @modelcontextprotocol/server-chrome-devtools
   ```
   Then configure in Cursor settings with:
   ```json
   {
     "name": "google-chrome-devtools",
     "command": "mcp-server-chrome-devtools"
   }
   ```

3. **Usage**:
   - The MCP server enables browser automation through Cursor
   - Use it for debugging and browser interactions
   - Access browser tools via AI assistant commands

### Reference

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Chrome DevTools MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/chrome-devtools)

