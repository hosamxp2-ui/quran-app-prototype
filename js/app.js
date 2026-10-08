document.addEventListener("DOMContentLoaded", () => {

    const surahList = document.getElementById("surahList");
    const themeButton = document.getElementById("themeButton");
    const continueButton = document.getElementById("continueButton");

    /*
     * التأكد من وجود بيانات القرآن
     */
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
                    <p class="surah-details">
                        يرجى التأكد من ملف quran.js
                    </p>
                </div>
            </div>
        `;

        return;
    }


    /*
     * عرض السور
     */
    function renderSurahs() {

        surahList.innerHTML = "";

        QURAN_DATA.surahs.forEach((surah) => {

            const card = document.createElement("button");

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


            /*
             * عند اختيار سورة
             */
            card.addEventListener("click", () => {

                localStorage.setItem(
                    "lastSurah",
                    String(surah.id)
                );

                openSurah(surah);

            });


            surahList.appendChild(card);

        });

    }


    /*
     * فتح السورة
     *
     * في هذه المرحلة لا نفتح المصحف بعد.
     * سنضيف شاشة القراءة في الخطوة القادمة.
     */
    function openSurah(surah) {

        localStorage.setItem(
            "lastSurah",
            String(surah.id)
        );

        alert(
            `تم اختيار سورة ${surah.name}\n\n` +
            `الرواية: ${QURAN_DATA.riwayah.name}\n` +
            `عدد الآيات: ${surah.ayahCount}`
        );

    }


    /*
     * متابعة آخر قراءة
     */
    continueButton.addEventListener("click", () => {

        const lastSurahId =
            localStorage.getItem("lastSurah");

        if (!lastSurahId) {

            alert("لم يتم تحديد موضع قراءة سابق بعد.");

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

    });


    /*
     * الوضع الليلي
     */
    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const dark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "darkMode",
            dark ? "1" : "0"
        );

    });


    /*
     * استعادة الوضع السابق
     */
    const savedDarkMode =
        localStorage.getItem("darkMode");

    if (savedDarkMode === "1") {
        document.body.classList.add("dark-mode");
    }


    /*
     * تشغيل عرض السور
     */
    renderSurahs();

});
