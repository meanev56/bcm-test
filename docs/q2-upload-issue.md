Q2 — Editor can't upload images, colleague can
Likely causes (ordered by likelihood and cost to check):

Role/capability mismatch.

Check: get_role('editor') capabilities vs the colleague's role. Compare upload_files and edit_posts.

Evidence: In wp-admin/user-edit.php or via current_user_can('upload_files') in a test snippet. If false → capability removed by a plugin (remove_cap) or a custom role.

Fix: Re-add upload_files to the editor role, or correct the user's role. Confirm with the user.

File type / size restriction (plugin or server).

Check: wp_check_filetype_and_ext, upload_mimes filter, and php.ini upload_max_filesize / post_max_size.

Evidence: Try uploading the same file as the colleague; check browser network response for the exact error. If it's a 413 or "Sorry, you are not allowed to upload this file type", it's server/plugin config.

Fix: Allow the MIME type, raise limits, or resize.

Media library / folder permissions or disk full.

Check: wp-content/uploads ownership and permissions; df -h on the server.

Evidence: Upload a small JPG as the editor; check /wp-content/debug.log for Unable to create directory. If the colleague can upload but the editor can't to the same folder, this is less likely — but a role-based upload path filter could still cause it.

Fix: Correct ownership (www-data:www-data), 755/644, or free disk.

Order I'd check: Role/capability first (fastest, most common), then file type/size (reproduce with the same file), then server/permissions.

Assumptions: Both users are on the same site, same browser, same file. If not, I'd standardise the test first