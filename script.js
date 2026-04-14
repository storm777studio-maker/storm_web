const ADMIN_CODE = "stu777dio";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlh79dqjcW70gw-bExMm7425I6sOfO2J3luP3wYCQHbux6wOvFPwTz8apv1SC-qbDaXg/exec";
let isAdmin = false;

// وظيفة إظهار/إخفاء كلمة المرور
function togglePass() {
    const p = document.getElementById("passInput");
    p.type = p.type === "password" ? "text" : "password";
}

// وظيفة تسجيل الدخول
function login() {
    const pass = document.getElementById("passInput").value;
    if(!pass) return alert("الرجاء إدخال كلمة المرور");

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-platform").style.display = "block";

    if(pass === ADMIN_CODE) {
        isAdmin = true;
        document.getElementById("adminBadge").style.display = "inline";
        document.getElementById("adminPanel").style.display = "block";
    }
}

// وظيفة رفع الفيديو وتسجيله في Google Sheets
async function uploadVideo() {
    const title = document.getElementById("vTitle").value;
    const fileInput = document.getElementById("vFile");
    const file = fileInput.files[0];

    if(!title || !file) return alert("أكمل البيانات (العنوان والملف)");

    // عرض الفيديو فوراً في الصفحة باستخدام رابط محلي
    const localURL = URL.createObjectURL(file);
    addVideoToUI(title, localURL);

    // تجهيز البيانات لجدول غوغل
    const data = {
        title: title,
        url: "File: " + file.name,
        date: new Date().toLocaleString()
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        alert("تم الحفظ في قاعدة البيانات بنجاح!");
        document.getElementById("vTitle").value = "";
        fileInput.value = "";
    } catch (e) {
        console.error("خطأ في الربط:", e);
    }
}

// وظيفة إضافة الفيديو لواجهة المستخدم
function addVideoToUI(title, url) {
    const container = document.getElementById("container");
    const card = document.createElement("div");
    card.className = "video-card";
    
    // زر الحذف يظهر فقط إذا كان المستخدم أدمن
    let deleteHtml = isAdmin ? `<button class="delete-btn" onclick="removeVideo(this)">حذف الفيديو</button>` : "";

    card.innerHTML = `
        <video controls src="${url}"></video>
        <div class="video-info" style="padding:15px;">
            <h4 style="margin:0;">${title}</h4>
            ${deleteHtml}
        </div>
    `;
    container.insertBefore(card, container.firstChild);
}

// وظيفة الحذف من الواجهة
function removeVideo(btn) {
    if(confirm("هل تريد حذف هذا الفيديو من العرض؟")) {
        btn.closest('.video-card').remove();
    }
}