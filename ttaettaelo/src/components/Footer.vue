<template>
    <footer class="text-center text-white">
        <div id="footer" class="container">
            <section>
                <p id="contact">
                    (06149) 서울시 강남구 선릉로 523, 유림빌딩 4F | TEL 02-556-9635
                </p>
            </section>
        </div>
        <div id="copyright" class="text-center p-3">
            © 2025-05-23
        </div>
    </footer>
</template>

<script>

</script>

<style scoped>
footer { /* 전체 footer 배경색 */
    background-color: #4682A9;
}

#footer {
    padding: 24px 24px 12px 24px;
}

.list-group-item { /* footer와 동일한 배경색 */
    background-color: #4682A9;
    border: none;
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
