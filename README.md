# Restful Booker · Bugs da API

Apresentação estática em HTML, CSS e JavaScript, com canvas horizontal de **1920 × 1080** e ajuste proporcional à janela.

São 36 slides: abertura, resumo de 7 ocorrências, evidência e análise de 16 variações, impedimentos de PUT/DELETE e conclusão. O conteúdo registra a rodada no Postman de 21 de outubro de 2026 frente aos critérios do case. Os prints e o PDF estão incluídos no projeto.

## Navegação

- **← / →**, Page Up / Page Down ou botões: mudar slide.
- **Home / End**: início e conclusão.
- **I**: índice com busca por cenário ou ocorrência.
- **F**: alternar tela cheia.
- **Esc**: fechar índice ou imagem ampliada.
- **Ampliar print**: abrir evidência, aplicar zoom e consultar o print completo.
- Em telas de toque, deslizar para os lados também navega.

Links `#slide-1` até `#slide-36` abrem diretamente o slide desejado. A preferência do sistema para reduzir movimento desativa as animações.

## Executar localmente

Abra `index.html` no navegador. Não há dependências, instalação ou compilação. Opcionalmente, use um servidor estático na pasta do projeto:

```sh
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Publicação

GitHub Pages, branch `main`, pasta `/` (raiz). O arquivo `.nojekyll` preserva a publicação estática. Atualizações enviadas para essa branch são publicadas pelo GitHub.

## Estrutura

- `index.html`: estrutura e controles acessíveis.
- `styles.css`: composição, escala 16:9, cores e animações.
- `report.css`: identidade Bug Hunters e composição dos relatórios conforme a referência visual.
- `app.js`: slides, navegação, índice, zoom e tela cheia.
- `data.js`: dados das evidências e análises.
- `evidence-data.js`: transcrição dos corpos de requisição e resposta observados nos prints de 21/10/2026. Os painéis não executam chamadas à API; as respostas 200 exibem um trecho dos campos relevantes. O botão de cópia fornece o corpo completo transcrito, e **Ver print** abre a evidência correspondente.
- `assets/prints`: recortes documentais utilizados nos slides.
- `assets/originals`: capturas completas correspondentes.
- `assets/relatorio-api.pdf`: relatório da rodada.

## Limites da evidência

O retorno de um `bookingid` no POST não comprova persistência. Os controles de consulta retornaram 404; PUT e DELETE ficaram impedidos, e a origem do 404 não foi determinada. Os impactos são possibilidades; a causa técnica das falhas exige investigação. A numeração dos bugs acompanha o relatório original, começando por BUG-002.
