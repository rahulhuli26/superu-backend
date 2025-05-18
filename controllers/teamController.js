const db = require("../models/db");


exports.inviteMember = async (req, res) => {
  const { email, id, inviter_email, content_id } = req.body;
  if (!email || !id || !inviter_email || !content_id) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  }

  try {
    const [
      [userRows],
      [inviterRows],
      [contentRows],
      [existingRows],
    ] = await Promise.all([
      db.query("SELECT * FROM users WHERE email = ? AND id = ?", [email, id]),
      db.query("SELECT * FROM users WHERE email = ?", [inviter_email]),
      db.query("SELECT * FROM pages WHERE id = ?", [content_id]),
      db.query(
        "SELECT * FROM team_members WHERE member_email = ? AND content_id = ?",
        [inviter_email, content_id]
      ),
    ]);

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "Invited user does not exist." });
    }
    if (inviterRows.length === 0) {
      return res.status(404).json({ success: false, message: "Inviter does not exist." });
    }
    if (contentRows.length === 0) {
      return res.status(404).json({ success: false, message: "Content does not exist." });
    }
    if (existingRows.length > 0) {
      return res.status(200).json({
        success: true,
        message: `${email} has already been invited to this content.`,
      });
    }

    await db.query(
      "INSERT INTO team_members (inviter_email, inviter_id, member_email, content_id) VALUES (?, ?, ?, ?)",
        [email, id, inviter_email, content_id]
    );

    res.status(200).json({
      success: true,
      message: `${email} has been successfully invited to collaborate on the content.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the invitation.",
      error: error.message,
    });
  }
};

exports.invitedMembersList = async (req, res) => {
  const userId = req.headers.userid;
  try {
    const [list] = await db.query(
      "SELECT * FROM team_members WHERE inviter_id = ?",
      [userId]
    );
    if (list.length > 0) {
      return res.status(200).json({ status: "success", data: list });
    } else {
      return res.status(200).json({ status: "success", data: [], message: "No invited members found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while getting data");
  }
};

