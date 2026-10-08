document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");
    const surahList = document.getElementById("surahList");
    const themeButton = document.getElementById("themeButton");
    const continueButton = document.getElementById("continueButton");


    if (
        typeof QURAN_DATA === "undefined" ||
        !QURAN_DATA.surahs
    ) {
        surahList.innerHTML = `
            <div class="surah-card">
                <div class="surah-info">
                    <h3 class="surah-name">
                        تعذر تحميل بيانات القرآن
                    </h3>
                </div>
            </div>
        `;

        return;
    }


    /*
     * الصفحة الرئيسية
     */
    function renderHome() {

        app.innerHTML = `

            <section class="welcome-card">

                <span class="welcome-icon">﷽</span>

                <h2>بسم الله الرحمن الرحيم</h2>

                <p>
                    القرآن الكريم
                </p>

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

                <div id="surahList" class="surah-list">
                </div>

            </section>
        `;


        const newSurahList =
            document.getElementById("surahList");


        const newContinueButton =
            document.getElementById("continueButton");


        renderSurahs(newSurahList);


        newContinueButton.addEventListener(
            "click",
            continueReading
        );
    }


    /*
     * عرض السور
     */
    function renderSurahs(container) {

        container.innerHTML = "";


        QURAN_DATA.surahs.forEach((surah) => {

            const card =
                document.createElement("button");

            card.className = "surah-card";

            card.type = "button";


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
                () => openSurah(surah)
            );


            container.appendChild(card);
        });
    }


    /*
     * فتح السورة
     */
    function openSurah(surah) {

        localStorage.setItem(
            "lastSurah",
            String(surah.id)
        );


        app.innerHTML = `

            <section class="section">

                <button
                    id="backButton"
                    class="primary-button">
                    ← العودة إلى السور
                </button>


                <div class="welcome-card">

                    <span class="welcome-icon">
                        ﷽
                    </span>

                    <h2>
                        سورة ${surah.name}
                    </h2>

                    <p>
                        ${surah.revelation}
                        •
                        ${surah.ayahCount} آية
                    </p>

                </div>


                <div class="section">

                    <div class="surah-card">

                        <div class="surah-info">

                            <h3 class="surah-name">
                                شاشة القراءة
                            </h3>

                            <p class="surah-details">
                                سيتم هنا عرض آيات السورة
                                في الخطوة التالية.
                            </p>

                        </div>

                    </div>

                </div>

            </section>
        `;


        document
            .getElementById("backButton")
            .addEventListener(
                "click",
                renderHome
            );
    }


    /*
     * متابعة القراءة
     */
    function continueReading() {

        const lastSurahId =
            localStorage.getItem("lastSurah");


        if (!lastSurahId) {

            alert(
                "لم يتم تحديد موضع قراءة سابق بعد."
            );

            return;
        }


        const surah =
            QURAN_DATA.surahs.find(
                item =>
                    String(item.id) === lastSurahId
            );


        if (surah) {
            openSurah(surah);
        }
    }


    /*
     * الوضع الليلي
     */
    themeButton.addEventListener("click", () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const dark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "darkMode",
            dark ? "1" : "0"
        );
    });


    /*
     * استعادة الوضع الليلي
     */
    if (
        localStorage.getItem("darkMode") === "1"
    ) {
        document.body.classList.add(
            "dark-mode"
        );
    }


    /*
     * التشغيل الأول
     */
    renderHome();

});
