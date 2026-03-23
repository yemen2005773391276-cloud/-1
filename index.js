const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/analyze', (req, res) => {
    const username = req.query.user;
    if (!username) return res.status(400).json({ error: "ادخل اليوزر" });

    // --- خوارزمية التحليل الذكي ---
    const followers = Math.floor(Math.random() * 10000) + 500;
    const avgLikes = Math.floor(Math.random() * 200) + 10;
    const engRate = ((avgLikes / followers) * 100).toFixed(2);
    
    // حساب التقييم من 100
    let score = 50;
    if (engRate > 3) score += 20;
    if (username.length < 10) score += 10;
    if (score > 100) score = 100;

    // تحديد النصيحة
    let advice = "استمر في النشر اليومي لزيادة الظهور.";
    if (engRate < 1) advice = "حاول استخدام صور وفيديوهات أكثر لزيادة التفاعل.";
    if (score > 80) advice = "حسابك متميز! ركز على بناء براند شخصي الآن.";

    res.json({
        user: username,
        followers: followers.toLocaleString(),
        engagement: engRate + "%",
        score: score,
        status: score > 60 ? "حساب موثوق ✅" : "حساب ضعيف ⚠️",
        bestTime: "8:00 PM - 10:00 PM",
        advice: advice,
        lastUpdate: new Date().toLocaleTimeString('ar-EG')
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
