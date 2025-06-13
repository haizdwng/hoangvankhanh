const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USER = "haizdwng";
const REPO = "hoangvankhanh";
const FILE_PATH = "data.txt";

app.post("/append", async (req, res) => {
	const newText = req.body.text;
	const apiUrl = `https://api.github.com/repos/${USER}/${REPO}/contents/${FILE_PATH}`;
	try {
		const { data } = await axios.get(apiUrl, {
			headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
		});
		const oldContent = Buffer.from(data.content, "base64").toString("utf8");
		const updatedContent = oldContent + "\n" + newText;
		await axios.put(apiUrl, {
			message: "Cập nhật file qua web",
			content: Buffer.from(updatedContent).toString("base64"),
			sha: data.sha
		}, {
			headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
		});
		res.send({ success: true });
	} catch (err) {
		console.error("❌ Lỗi:", err.response?.data || err.message);
		res.status(500).send({ error: "Không thể cập nhật file." });
	}
});

app.listen(3000, () => {
	console.log("✅ Server chạy tại http://localhost:3000");
});
