const BACKEND_URL = "https://squeezepic.onrender.com";

// टैब बदलने का नया रंग-बिरंगा सिस्टम
function switchTab(tabId) {
    document.querySelectorAll('.tool-card').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).style.display = 'block';
    
    // क्लिक किए गए बटन के हिसाब से सही क्लास ढूंढना
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== 1. कंप्रेसर टूल ====================
    const inputComp = document.getElementById("input-compress");
    const workComp = document.getElementById("work-compress");
    const sliderComp = document.getElementById("slider-compress");
    const valComp = document.getElementById("val-compress");
    const btnDownComp = document.getElementById("btn-download-compress");
    
    inputComp.addEventListener("change", () => { 
        if(inputComp.files.length > 0) workComp.style.display = "block"; 
    });
    
    sliderComp.addEventListener("input", (e) => { 
        valComp.innerText = e.target.value + "%"; 
    });
    
    btnDownComp.addEventListener("click", async () => {
        const formData = new FormData();
        formData.append("image", inputComp.files[0]); // पहली फोटो उठाना
        formData.append("quality", sliderComp.value);
        
        btnDownComp.innerText = "सर्वर प्रोसेसिंग कर रहा है...";
        try {
            const response = await fetch(`${BACKEND_URL}/compress`, { method: "POST", body: formData });
            const blob = await response.blob();
            triggerDownload(blob, "compressed_image.jpg");
        } catch (error) {
            alert("सर्वर से कनेक्ट नहीं हो पाया, कृपया चेक करें!");
        }
        btnDownComp.innerText = "⚡ सर्वर से कंप्रेस करके डाउनलोड करें";
    });

    // ==================== 2. कनवर्टर टूल ====================
    const inputConv = document.getElementById("input-convert");
    const workConv = document.getElementById("work-convert");
    const selectFormat = document.getElementById("select-format");
    const btnDownConv = document.getElementById("btn-download-convert");
    
    inputConv.addEventListener("change", () => { 
        if(inputConv.files.length > 0) workConv.style.display = "block"; 
    });
    
    btnDownConv.addEventListener("click", async () => {
        const formData = new FormData();
        formData.append("image", inputConv.files[0]);
        formData.append("format", selectFormat.value);
        
        btnDownConv.innerText = "कनवर्ट हो रहा है...";
        try {
            const response = await fetch(`${BACKEND_URL}/convert`, { method: "POST", body: formData });
            const blob = await response.blob();
            triggerDownload(blob, `converted_image.${selectFormat.value}`);
        } catch (error) {
            alert("एरर आया!");
        }
        btnDownConv.innerText = "⚡ फॉर्मेट बदलें और डाउनलोड करें";
    });

    // ==================== 3. IMAGE TO PDF टूल ====================
    const inputPdf = document.getElementById("input-pdf");
    const workPdf = document.getElementById("work-pdf");
    const btnDownPdf = document.getElementById("btn-download-pdf");
    
    inputPdf.addEventListener("change", () => { 
        if(inputPdf.files.length > 0) workPdf.style.display = "block"; 
    });
    
    btnDownPdf.addEventListener("click", async () => {
        const formData = new FormData();
        formData.append("image", inputPdf.files[0]);
        
        btnDownPdf.innerText = "PDF तैयार हो रही है...";
        try {
            const response = await fetch(`${BACKEND_URL}/pdf`, { method: "POST", body: formData });
            const blob = await response.blob();
            triggerDownload(blob, "converted_document.pdf");
        } catch (error) {
            alert("एरर आया!");
        }
        btnDownPdf.innerText = "⚡ हाई-क्वालिटी PDF फाइल डाउनलोड करें";
    });

    // फाइल डाउनलोड ट्रिगर करने का फंक्शन
    function triggerDownload(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
    }
});
