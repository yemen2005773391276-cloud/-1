const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// ضع الرمز الخاص بك هنا بأمان
const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAJ1L8QEAAAAAEJwgiUp6ngt2w2wHe2y0UuoiC2Q%3DK6stEyznENSkpFxppIjsSlMgzBMSsB4IiJD4451rksKNYz49ez';

app.get('/analyze', async (req, res) => {
    const username = req.query.user;
    if (!username) return res.status(400).json({ error: "يرجى إدخال اسم المستخدم" });

    try {
        // 1. طلب بيانات الحساب الحقيقية من API إكس
        const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description,created_at,verified`;
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        });

        if (!response.data.data) {
            return res.status(404).json({ error: "الحساب غير موجود" });
        }

        const userData = response.data.data;
        const metrics = userData.public_metrics;

        // 2. خوارزمية تحليل التفاعل الحقيقية
        const followers = metrics.followers_count;
        const following = metrics.following_count;
        const tweetCount = metrics.tweet_count;
        
        // حساب نسبة التفاعل التقديرية (بناءً على الأرقام الحقيقية)
        const engRate = followers > 0 ? ((tweetCount / followers) * 10).toFixed(2) : 0;
        
        let score = 50;
        if (engRate > 2) score += 20;
        if (userData.verified) score += 20;
        if (score > 100) score = 100;

        // 3. إرسال البيانات النهائية للواجهة
        res.json({
            user: userData.username,
            name: userData.name,
            followers: followers.toLocaleString(),
            following: following.toLocaleString(),
            tweets: tweetCount.toLocaleString(),
            engagement: engRate + "%",
            score: score,
            status: score > 60 ? "حساب موثوق ✅" : "حساب يحتاج نشاط ⚠️",
            advice: engRate < 1 ? "حاول التفاعل مع الحسابات الكبيرة لزيادة ظهورك." : "أداء ممتاز! استمر في جودة المحتوى الحالية.",
            lastUpdate: new Date().toLocaleTimeString('ar-EG')
        });

    } catch (error) {
        console.error("X API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "مشكلة في الاتصال بـ إكس، تأكد من صلاحية الـ Token" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
