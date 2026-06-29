(() => {
    if(!document.querySelector('link[data-game-guide]')){
        const style = document.createElement("link");
        const isPage = location.pathname.replace(/\\/g,"/").includes("/pages/");

        style.rel = "stylesheet";
        style.href = `${isPage ? "../" : ""}css/guide.css`;
        style.dataset.gameGuide = "true";
        document.head.appendChild(style);
    }

    window.showGameGuide = function showGameGuide(){
        Swal.fire({
            showCloseButton:true,
            showConfirmButton:true,
            confirmButtonText:"เข้าใจแล้ว ไปผจญภัยกัน! 🌸",
            customClass:{
                popup:"guideModal",
                confirmButton:"guideConfirm"
            },
            html:`
                <div class="guideContent">
                    <div class="guideHero">
                        <div class="guideHeroIcon">🗺️✨</div>
                        <h2>คู่มือผจญภัยดินแดนชมพูทวีป</h2>
                        <p>ตอบคำถาม สะสมกุญแจ เปิดหีบ และไขคำตอบสุดท้าย</p>
                    </div>

                    <div class="guideBody">
                        <div class="guideGoal">
                            🎯 <strong>เป้าหมายของเกม:</strong>
                            เดินทางผ่านคำถามทุกด่าน เก็บกุญแจให้ได้มากที่สุด
                            แล้วใช้กุญแจเปิดหีบเพื่อค้นหาตัวอักษรสำหรับเรียงเป็นคำตอบสุดท้าย
                        </div>

                        <div class="guideGrid">
                            <section class="guideCard">
                                <h3>1. เตรียมภารกิจ 📝</h3>
                                <ol>
                                    <li>เข้าเมนู “จัดการระบบ” แล้วเลือกสร้างภารกิจ</li>
                                    <li>กำหนดชื่อ จำนวนคำถาม และตัวเลือก A–D</li>
                                    <li>คำตอบสุดท้ายต้องเว้นวรรคระหว่างส่วนที่ต้องการแยกลงคนละหีบ เช่น <strong>ช ม พู</strong></li>
                                    <li>บันทึกภารกิจ แล้วเลือกภารกิจที่ต้องการเล่น</li>
                                </ol>
                            </section>

                            <section class="guideCard">
                                <h3>2. เลือกตัวละคร 🧙‍♀️</h3>
                                <ul>
                                    <li>ตัวละครแต่ละตัวมีหัวใจและสกิลต่างกัน</li>
                                    <li>ภารกิจต่ำกว่า 15 ข้อ ใช้สกิลได้ 1 ครั้ง</li>
                                    <li>ภารกิจตั้งแต่ 15 ข้อขึ้นไป ใช้สกิลได้ 2 ครั้ง</li>
                                    <li>จำนวนครั้งของสกิลใช้ร่วมกันตลอดภารกิจ ควรเลือกจังหวะให้ดี</li>
                                </ul>
                            </section>

                            <section class="guideCard full">
                                <h3>3. กติกาการตอบคำถาม ❓</h3>
                                <div class="guideRuleRow">
                                    <div class="guideRule good">
                                        ✅ <strong>ตอบถูก</strong><br>
                                        ได้กุญแจ 1 ดอก และผ่านไปข้อถัดไป
                                    </div>
                                    <div class="guideRule bad">
                                        ❌ <strong>ตอบผิด</strong><br>
                                        เสียหัวใจ 1 ดวง ข้ามข้อนั้นทันที และไม่ได้กุญแจ
                                    </div>
                                </div>
                                <ul>
                                    <li>เมื่อหัวใจหมด การผจญภัยจะสิ้นสุดและต้องเริ่มใหม่</li>
                                    <li>จำนวนกุญแจที่มุมขวาบนคือจำนวนโอกาสเปิดหีบในช่วงสุดท้าย</li>
                                    <li>หมุดสีทองพร้อม ✓ หมายถึงตอบถูก ส่วนหมุดสีแดงพร้อม ✕ หมายถึงตอบผิดและข้ามข้อนั้นแล้ว</li>
                                </ul>
                            </section>

                            <section class="guideCard full">
                                <h3>4. สกิลตัวละคร ✨</h3>
                                <div class="skillGuide">
                                    <div>🪷 <strong>พระ:</strong> ตัดตัวเลือกผิด 2 ตัว</div>
                                    <div>🔮 <strong>พ่อมด:</strong> ข้ามคำถามพร้อมรับกุญแจ</div>
                                    <div>🛡️ <strong>นักรบ:</strong> ป้องกันการเสียหัวใจ 1 ครั้ง</div>
                                    <div>👑 <strong>กษัตริย์:</strong> รับกุญแจโบนัส 1 ดอก</div>
                                    <div>🎵 <strong>นักดนตรี:</strong> ทำให้คำตอบที่ถูกเปล่งประกายชั่วครู่</div>
                                </div>
                            </section>

                            <section class="guideCard">
                                <h3>5. เสี่ยงโชคเปิดหีบ 🗝️</h3>
                                <ul>
                                    <li>จำนวนหีบจะมากกว่าจำนวนกุญแจ 1–2 ใบเสมอ จึงไม่สามารถเปิดได้ทุกใบ</li>
                                    <li>การเปิดหีบทุกใบใช้กุญแจ 1 ดอกทันที</li>
                                    <li>🔤 <strong>หีบตัวอักษร:</strong> ได้ชิ้นส่วนคำตอบลอยลงถาด</li>
                                    <li>🫧 <strong>หีบเปล่า:</strong> ไม่มีรางวัล</li>
                                    <li>🔑− <strong>หีบกับดัก 2 ใบ:</strong> เสียกุญแจเพิ่มอีก 1 ดอก</li>
                                    <li>💣 <strong>หีบระเบิด 1 ใบ:</strong> เสียกุญแจเพิ่มสูงสุด 3 ดอก แต่ยังเล่นต่อได้</li>
                                    <li>เมื่อพบตัวอักษร ตัวอักษรจะลอยลงถาดด้านล่างโดยอัตโนมัติ</li>
                                    <li>ถ้ากุญแจหมด จะไม่สามารถเปิดหีบเพิ่มได้</li>
                                </ul>
                            </section>

                            <section class="guideCard">
                                <h3>6. เรียงคำตอบสุดท้าย 🧩</h3>
                                <ol>
                                    <li>เมื่อพบตัวอักษรอย่างน้อย 1 ชิ้น ปุ่ม “ไปเรียงคำ” จะเปิดใช้งานทันที</li>
                                    <li>สามารถไปลองเรียงได้แม้ยังค้นพบตัวอักษรไม่ครบ โดยช่องที่ขาดจะยังว่างอยู่</li>
                                    <li>แตะตัวอักษรเพื่อวางลงช่องตามลำดับ</li>
                                    <li>แตะตัวอักษรในช่องเพื่อนำกลับมาเรียงใหม่</li>
                                    <li>หากเดาคำตอบได้แล้ว สามารถพิมพ์คำตอบลงในช่องด้านล่างได้ทันที โดยไม่ต้องเก็บตัวอักษรให้ครบ</li>
                                    <li>กด “ตรวจคำตอบ” เพื่อจบภารกิจ</li>
                                </ol>
                            </section>
                        </div>

                        <div class="guideTip">
                            💖 เคล็ดลับ: หีบทุกใบหน้าตาเหมือนกันก่อนเปิด หากพบตัวอักษรแม้ยังไม่ครบ ก็สามารถนำไปลองเรียงคำได้ทันที!
                        </div>
                    </div>
                </div>
            `
        });
    };
})();
