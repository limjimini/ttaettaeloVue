<template>
    <footer class="text-center text-white">
        <div id="footer" class="container">
            <!-- <section>
                <ul class="list-group list-group-horizontal" id="sitemap">
                    <li class="list-group-item text-end flex-fill">
                        <router-link to="/guide" class="text-white nav-link">
                            목욕탕 가이드
                        </router-link>
                    </li>
                    <li class="list-group-item flex-fill">
                        <router-link to="/bathhouse" class="text-white nav-link">
                            목욕탕 후기
                        </router-link>
                    </li>
                    <li class="list-group-item text-start flex-fill">
                        <router-link to="/support" class="text-white nav-link">
                            문의하기
                        </router-link>
                    </li>
                </ul>
            </section> -->

            <section>
                <p id="contact">
                    (06149) 서울시 강남구 선릉로 523, 유림빌딩 4F | TEL 02-556-9635
                </p>
            </section>
        </div>
        <div id="copyright" class="text-center p-3">
            <!-- © 안녕하세요 임지민입니다. 열심히 했어요 o(〃＾▽＾〃)o -->
        </div>
    </footer>
</template>

<script>

</script>

<style scoped>
footer {
    background-color: #4682A9;
}

#footer {
    padding: 24px 24px 12px 24px;
}

.list-group-item {
    background-color: #4682A9;
    border: none;
}

.nav-link {
    font-size: 17px;
}

.nav-link:hover {
    font-weight: bold;
}

#contact {
    font-size: 14px;
    margin: 50px 0 0 0;
}

#copyright {
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 12px;
}
</style>
