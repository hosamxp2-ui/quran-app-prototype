document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");
    const themeButton = document.getElementById("themeButton");

    const ELEMENTS_BASE =
    "https://cdn.quran.ws/svg/elements/v1.1.1/pages/";


    // =========================
    // بيانات المشروع
    // =========================

    const surahs = QURAN_DATA.surahs;


    // =========================
    // الصفحة الرئيسية
    // =========================

    function renderHome() {

        app.innerHTML = `

            <section class="welcome-card">

                <span class="welcome-icon">﷽</span>

                <h2>بسم الله الرحمن الرحيم</h2>

                <p>القرآن الكريم</p>

                <button
                    id="continueButton"
                    class="primary-button">
                    متابعة القراءة
                </button>

            </section>

            <section class="section">

                <div class="section-title">
                    <h2>المصحف</h2>
                </div>

                <div id="surahList" class="surah-list"></div>

            </section>
        `;


        const list =
            document.getElementById("surahList");


        surahs.forEach((surah) => {

            const card =
                document.createElement("button");

            card.type = "button";
            card.className = "surah-card";


            card.innerHTML = `

                <div class="surah-number">
                    ${surah.id}
                </div>

                <div class="surah-info">

                    <h3 class="surah-name">
                        ${surah.name}
                    </h3>

                    <p class="surah-details">
                        ${surah.revelation}
                        •
                        ${surah.ayahCount} آية
                    </p>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    if (surah.id === 1) {
                        openMushafPage(1);
                    } else {
                        alert(
                            "سنضيف صفحات هذه السورة لاحقًا."
                        );
                    }

                }
            );


            list.appendChild(card);

        });


        document
            .getElementById("continueButton")
            .addEventListener(
                "click",
                continueReading
            );
    }


    // =========================
    // فتح صفحة المصحف
    // =========================

    async function openMushafPage(pageNumber) {

        app.innerHTML = `

            <section class="section">

                <button
                    id="backButton"
                    class="primary-button">
                    ← العودة إلى السور
                </button>

                <div
                    id="mushafLoading"
                    class="welcome-card">

                    <h2>جاري تحميل صفحة المصحف</h2>

                    <p>
                        صفحة ${pageNumber}
                    </p>

                </div>

                <div
                    id="mushafPage"
                    class="mushaf-page">
                </div>

            </section>
        `;


        document
            .getElementById("backButton")
            .addEventListener(
                "click",
                renderHome
            );


        try {

            const page =
                String(pageNumber).padStart(3, "0");


            const url =
                `${ELEMENTS_BASE}${page}.svg`;


            const response =
                await fetch(url);


            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            const svgText =
                await response.text();


            const container =
                document.getElementById(
                    "mushafPage"
                );


            container.innerHTML =
                svgText;


            const svg =
                container.querySelector("svg");


            if (!svg) {
                throw new Error(
                    "SVG غير موجود"
                );
            }


            svg.removeAttribute("width");
            svg.removeAttribute("height");


            svg.style.width = "100%";
            svg.style.height = "auto";
            svg.style.display = "block";


            /*
             * إزالة رسالة التحميل
             */

            document
                .getElementById("mushafLoading")
                .remove();


            /*
             * التفاعل مع الكلمات
             */

            svg.addEventListener(
                "click",
                handleWordClick
            );


            /*
             * توسيع منطقة اللمس
             * دون تغيير شكل المصحف
             */

            const wordPaths =
                svg.querySelectorAll(
                    "g.word path"
                );


            wordPaths.forEach((path) => {

                path.style.pointerEvents =
                    "all";

                path.style.stroke =
                    "transparent";

                path.style.strokeWidth =
                    "1.5";

                path.style.paintOrder =
                    "stroke fill";

            });


        } catch (error) {

            console.error(error);


            const loading =
                document.getElementById(
                    "mushafLoading"
                );


            loading.innerHTML = `

                <h2>
                    تعذر تحميل صفحة المصحف
                </h2>

                <p>
                    تحقق من اتصال الإنترنت ثم حاول مرة أخرى.
                </p>

                <p>
                    ${error.message}
                </p>

            `;

        }

    }


    // =========================
    // الضغط على كلمة
    // =========================

    function handleWordClick(event) {

        const word =
            event.target.closest(
                "g.word"
            );


        if (!word) {
            return;
        }


        const wordKey =
            word.dataset.wordKey;


        const ayah =
            word.closest(
                "g.ayah-fragment"
            );


        const ayahKey =
            ayah
                ? ayah.dataset.ayahKey
                : "";


        const text =
            word.dataset.rasmUthmani ||
            "كلمة قرآنية";


        showWordPanel(
            wordKey,
            ayahKey,
            text
        );

    }


    // =========================
    // لوحة الكلمة
    // =========================

    function showWordPanel(
        wordKey,
        ayahKey,
        text
    ) {

        const oldPanel =
            document.getElementById(
                "wordPanel"
            );


        if (oldPanel) {
            oldPanel.remove();
        }


        const panel =
            document.createElement("div");


        panel.id = "wordPanel";
        panel.className = "word-panel";


        panel.innerHTML = `

            <div class="word-panel-content">

                <button
                    id="closeWordPanel"
                    class="word-close">
                    ×
                </button>

                <div class="selected-word">
                    ${text}
                </div>

                <div class="word-key">
                    ${wordKey}
                </div>

                <div class="word-actions">

                    <button>
                        🔊
                        <span>استماع</span>
                    </button>

                    <button>
                        📖
                        <span>المعنى</span>
                    </button>

                    <button>
                        ⚙
                        <span>الإعراب</span>
                    </button>

                    <button>
                        🔤
                        <span>الجذر</span>
                    </button>

                    <button>
                        📌
                        <span>حفظ</span>
                    </button>

                    <button>
                        📝
                        <span>ملاحظة</span>
                    </button>

                </div>

                <div class="ayah-reference">

                    الآية:
                    ${ayahKey || "غير محدد"}

                </div>

            </div>
        `;


        document.body.appendChild(panel);


        document
            .getElementById(
                "closeWordPanel"
            )
            .addEventListener(
                "click",
                () => panel.remove()
            );

    }


    // =========================
    // متابعة القراءة
    // =========================

    function continueReading() {

        const page =
            localStorage.getItem(
                "lastPage"
            );


        if (page) {
            openMushafPage(
                Number(page)
            );
        } else {
            openMushafPage(1);
        }

    }


    // =========================
    // الوضع الليلي
    // =========================

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            localStorage.setItem(
                "darkMode",
                document.body.classList.contains(
                    "dark-mode"
                )
                    ? "1"
                    : "0"
            );

        }
    );


    if (
        localStorage.getItem("darkMode") === "1"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    // =========================
    // تشغيل التطبيق
    // =========================

    renderHome();

});
