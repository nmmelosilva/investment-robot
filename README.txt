INVESTMENT ROBOT v2 — MOBILE / PWA

Esta versão é uma Web App instalável (PWA), adaptada a Android/iPhone e PC.

COMO TESTAR NO PC
1. Descompactar a pasta.
2. Abrir um terminal dentro da pasta.
3. Executar: python -m http.server 8080
4. Abrir no browser: http://localhost:8080

COMO USAR NO TELEMÓVEL
A PWA precisa de estar publicada num endereço HTTPS. Pode publicar a pasta em qualquer alojamento estático (por exemplo, GitHub Pages, Netlify, Cloudflare Pages ou servidor próprio). Depois abra o endereço no Chrome/Android e escolha "Adicionar ao ecrã principal" / "Instalar app".

DADOS
- Snapshot incorporado do relatório XTB de 24/09/2026.
- O simulador OIL usa o preço 97,71 e P/L 50,08 € presentes no relatório exportado, com sensibilidade aproximada de 26,22 €/USD.
- O rollover OIL é apresentado como -132,83 €, conforme a plataforma. O relatório exportado contém um valor bruto -13283, pelo que a app usa a escala visual confirmada no screenshot.
- Não existem preços em tempo real nesta versão.
- Os limites de risco são guardados apenas no browser do dispositivo (localStorage).
- A app não executa ordens.
