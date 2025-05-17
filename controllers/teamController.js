const db = require('../models/db');

exports.inviteMember = async (req, res) => {
  const { email, id, inviter_email, content_id } = req.body;
  if (!email || !id || !inviter_email || !content_id) {
    return res.status(400).json({ message: "Missing required parameters: email, id, inviter_email, or content_id." });
  }

  try {
    const [[user], [inviter], [content], [existingInvite]] = await Promise.all([
      db.promise().query("SELECT * FROM users WHERE email = ? AND id = ?", [email, id]),
      db.promise().query("SELECT * FROM users WHERE email = ?", [inviter_email]),
      db.promise().query("SELECT * FROM pages WHERE id = ?", [content_id]),
      db.promise().query("SELECT * FROM team_members WHERE member_email = ? AND content_id = ?", [email, content_id])
    ]).then(results => results.map(([rows]) => rows));

    if (!user) return res.status(404).json({ success: false, message: "Invited user does not exist." });
    if (!inviter) return res.status(404).json({ success: false, message: "Inviter does not exist." });
    if (!content) return res.status(404).json({ success: false, message: "Content does not exist." });

    if (existingInvite) {
      return res.status(200).json({
        success: true,
        message: `${email} has already been invited to this content.`
      });
    }

    await db.promise().query(
      "INSERT INTO team_members (inviter_email, inviter_id, member_email, content_id) VALUES (?, ?, ?, ?)",
      [email, id, inviter_email, content_id]
    );

    res.status(200).json({
      success: true,
      message: `${email} has been successfully invited to collaborate on the content.`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the invitation.",
      error: error.message
    });
  }
};
