const express = require('express');
const cors = require('cors');
const axios = require('axios'); // مكتبة لجلب البيانات من تويتر

const app = express();
app.use(cors()); // للسماح لموقعك بالاتصال بالسيرفر

const PORT = process.env.PORT || 3000;

// نقطة الاتصال الأساسية
app.get('/analyze', async (req, res) => {
    const username = req.query.user;

    if (!username) {
        return res.status(400).json({ error: "يرجى إدخال اسم المستخدم" });
    }

    try {
        // ملاحظة: هنا يجب ربط تويتر API لاحقاً
        // حالياً سنرسل بيانات تجريبية (Mock Data) لنختبر السيرفر
        const analysisResult = {
            user: username,
            followers: "جاري الجلب...",
            engagement: (Math.random() * 5 + 1).toFixed(2) + "%", // رقم عشوائي للتجربة
            shadowban: username.length > 12 ? "تحذير ⚠️" : "آمن ✅",
            lastUpdate: new Date().toLocaleString()
        };

        res.json(analysisResult);
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
});

app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});
