document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. تحميل بيانات المستخدم
    const [userResponse, messagesResponse] = await Promise.all([
      fetch("/api/user"),
      fetch("/profile/messages"),
    ]);

    // 2. معالجة بيانات المستخدم
    if (!userResponse.ok) throw new Error("فشل تحميل بيانات المستخدم");
    const user = await userResponse.json();

    const shareUrl = `${window.location.origin}/messages/${user._id}`;
    document.getElementById("shareUrl").value = shareUrl;

    // 3. معالجة الرسائل
    if (!messagesResponse.ok) throw new Error("فشل تحميل الرسائل");
    const messages = await messagesResponse.json();
    const messagesContainer = document.getElementById("messages");

    if (messages.length === 0) {
      messagesContainer.innerHTML =
        '<p class="no-messages">لا توجد رسائل بعد</p>';
      return;
    }

    // 4. عرض الرسائل مع فواصل
    messagesContainer.innerHTML = messages
      .map(
        (msg) => `
        <div class="message-box">
          <p>${msg.content}</p>
          <span class="message-time">${new Date(
            msg.timestamp
          ).toLocaleString()}</span>
          <hr class="message-divider">
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("حدث خطأ:", error);
    document.getElementById("messages").innerHTML =
      '<p class="error-message">حدث خطأ في تحميل البيانات</p>';
  }
});



document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    
    // تحديث رسالة الترحيب
    document.getElementById('welcomeMessage').innerHTML = 
      `مرحباً بك يا ${user.name}`;
      
    // ... بقية الكود ...
  } catch (error) {
    // ...
  }
});