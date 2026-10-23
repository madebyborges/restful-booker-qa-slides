# Restful Booker · Bugs da API

Apresentação estática em HTML, CSS e JavaScript, com canvas horizontal de **1920 × 1080** e ajuste proporcional à janela.

São 12 slides: logo animada, abertura, resumo, um slide por bug (7 ocorrências e suas 16 variações agrupadas), impedimentos de PUT/DELETE e conclusão. O conteúdo registra a rodada no Postman de 21 de outubro de 2026 frente aos critérios do case. Os prints e o PDF estão incluídos no projeto.

## Navegação

- **← / →**, Page Up / Page Down ou botões: mudar slide.
- **Home / End**: início e conclusão.
- **I**: índice com busca por cenário ou ocorrência.
- **F**: alternar tela cheia.
- **Esc**: fechar índice ou imagem ampliada.
- **Ver print**: abrir a captura correspondente, aplicar zoom e consultar o print completo.
- **Ver variações**: consultar os cenários e selecionar qual requisição, resposta e análise aparecem no mesmo slide.
- Os painéis escuros exibem o JSON colorido para facilitar a leitura durante a apresentação.
- Na abertura, a logo executa sua entrada e mantém os movimentos do personagem. Clique na logo para repetir; voltar ao primeiro slide também reinicia a entrada.
- Em telas de toque, deslizar para os lados também navega.

Links `#slide-1` até `#slide-12` abrem diretamente o slide desejado. A preferência do sistema para reduzir movimento desativa as animações.

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
- `cover-logo.js`: logo SVG com a animação de entrada da abertura, respeitando movimento reduzido.
- `evidence-data.js`: transcrição dos corpos de requisição e resposta observados nos prints de 21/10/2026. Os painéis não executam chamadas à API; as respostas 200 exibem um trecho dos campos relevantes. O botão de cópia fornece o corpo completo transcrito, e **Ver print** abre a evidência correspondente.
- `assets/prints`: recortes documentais utilizados nos slides.
- `assets/originals`: capturas completas correspondentes.
- `assets/relatorio-api.pdf`: relatório da rodada.

## Limites da evidência

O retorno de um `bookingid` no POST não comprova persistência. Os controles de consulta retornaram 404; PUT e DELETE ficaram impedidos, e a origem do 404 não foi determinada. Os impactos são possibilidades; a causa técnica das falhas exige investigação. A numeração dos bugs acompanha o relatório original, começando por BUG-002.

A primeira tela apresenta apenas a logo animada Bug Hunters. Clique na logo ou pressione seta direita/espaço para continuar. O conteúdo da apresentação começa no segundo slide.

Cada bug mostra uma evidência diretamente no slide. O botão Ver variações abre esperado, obtido e análise das variantes; ao escolher uma evidência, o print e os textos do mesmo slide são atualizados. A navegação permanece com 12 slides.

## Evidências de utilização em vídeo

Abra `manual.html` para revisar as 10 gravações: 3 bugs observados, 6 ocorrências em análise e 1 controle sem falha visual. A exibição segue o mesmo canvas 1920 × 1080 dos slides da API: vídeo à esquerda, análise à direita e setas, progresso, índice e tela cheia no rodapé. O índice reúne os 10 vídeos com filtros e documentação. O botão **Front · Vídeos** no cabeçalho da API alterna para esta seção; o botão **API** retorna ao resumo da apresentação. Há capítulos clicáveis e legendas descritivas opcionais.

Os vídeos são integrais e foram comprimidos com FFmpeg em H.264/AAC, na resolução original, sem cortes nem alteração de velocidade. Os originais permanecem no Drive. Os arquivos `EVIDENCIAS-UTILIZACAO.md` e `manual-data.json` registram passos, cenário, resultado, critério, limites, tempos e hashes SHA-256. As classificações são independentes dos 7 bugs da API.

Para `manual.html`, use um servidor HTTP local com suporte a byte ranges (necessário para buscar trechos dos vídeos) ou GitHub Pages (o navegador precisa carregar o JSON); o arquivo da apresentação principal continua independente de build.

Ao abrir ou trocar de evidência, o vídeo selecionado carrega e começa automaticamente, sem som. O áudio pode ser ativado nos controles do player. Restrições do navegador ainda podem exigir um clique em reproduzir.

O vídeo selecionado fica em loop: ao chegar ao fim, reinicia automaticamente enquanto a evidência estiver aberta. A troca de evidência interrompe o anterior e inicia o novo vídeo.

## Controle compartilhado pela internet

1. No PC, abra um slide e clique em **Ao vivo** no cabeçalho.
2. Clique em **Criar sessão compartilhada** e copie o link.
3. Abra esse mesmo link no celular. O controle com botões grandes aparece automaticamente em telas pequenas.
4. Use **Anterior**, **Próximo**, **Modo API** ou **Front · Vídeos**. Todos os participantes que possuem o link podem controlar a sessão.

A sessão sincroniza o slide da API, a variação selecionada, o vídeo do Front, o filtro e a troca de modo. Quem entra depois recebe o estado atual. Não é necessário estar na mesma rede Wi-Fi. O estado é consultado no Supabase aproximadamente a cada segundo enquanto a página está visível; ao voltar à página ou reconectar, ela consulta novamente. Os vídeos mantêm autoplay/loop locais; não se pretende sincronizar o instante exato de cada frame.

Use **Sair desta sessão** para voltar à navegação independente. Cada sessão dura até 24 horas. O link é a autorização para controlar a sessão; compartilhe somente com quem deve participar. Nenhum usuário/senha ou dado do sistema de reservas é enviado ao Supabase: apenas o estado da apresentação.

Backend dedicado: projeto Supabase `bug-hunters-apresentacao`. A configuração de navegador em `shared-config.js` contém somente URL e chave publicável. A tabela tem RLS, acesso limitado à sessão pelo segredo aleatório do link e atualização de versão no servidor; o segredo não é armazenado em texto puro. O SQL versionado está em `supabase/session-schema.sql`. A sessão não pode ser lida ou modificada apenas conhecendo a chave publicável.
