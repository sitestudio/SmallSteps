# File Manipulation Rules
- ALWAYS prefer using Bash tools (`sed`, `tee`, `cat`) over the built-in `edit` or `write` tools for modifying existing code.
- This ensures preservation of complex formatting and allows for immediate verification via `grep` or `diff`.
