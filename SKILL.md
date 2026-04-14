# Skill: Precision File Editing via Bash
When editing files, use the following patterns to ensure safety:
1. Use `grep` to verify the line exists.
2. Use `sed -i.bak 's/search/replace/' filename` to create a backup.
3. Use `diff` to verify the change.
